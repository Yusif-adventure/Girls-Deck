import React, { useRef, useState } from 'react';


const RecordPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sent, setSent] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [sendResult, setSendResult] = useState('');
  const [region, setRegion] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Always fetch all agents on mount
  React.useEffect(() => {
    const fetchAgents = async () => {
      const apiBaseUrl = require('../apiBaseUrl').default ? require('../apiBaseUrl').default() : '';
      const res = await fetch(`${apiBaseUrl}/api/agents`);
      const data = await res.json();
      setAgents(data.agents);
    };
    fetchAgents();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorderRef.current.ondataavailable = e => audioChunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    if (!selectedAgent) {
      setError('Please select an agent.');
      return;
    }
    setError('');
    setTranscription('');
    setSendResult('');
    const blob = await fetch(audioUrl).then(r => r.blob());
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('channel', channel);
    formData.append('agentContact', channel === 'whatsapp' ? selectedAgent.whatsapp : selectedAgent.telegram);
    const apiBaseUrl = require('../apiBaseUrl').default ? require('../apiBaseUrl').default() : '';
    const res = await fetch(`${apiBaseUrl}/api/audio`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setTranscription(data.transcription || '');
    setSendResult(data.sendResult || '');
    setSent(true);
  };

  return (
    <div className="record-page">
      <h2>Record Audio</h2>
      {agents.length > 0 ? (
        <>
          <label>Select Agent:</label>
          <select value={selectedAgent ? selectedAgent.phone : ''} onChange={e => setSelectedAgent(agents.find(a => a.phone === e.target.value))} required>
            <option value="">--Select Agent--</option>
            {agents.map(agent => (
              <option key={agent.phone} value={agent.phone}>{agent.name}</option>
            ))}
          </select>
          <label>Send via:</label>
          <select value={channel} onChange={e => setChannel(e.target.value)}>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
          </select>
        </>
      ) : (
        <div style={{ color: 'red', margin: '16px 0' }}>
          No agents available. Please check your network connection or contact support.
        </div>
      )}
      {!recording && <button onClick={startRecording}>🎤 Record</button>}
      {recording && <button onClick={stopRecording}>⏹️ Stop</button>}
      {audioUrl && <audio src={audioUrl} controls />}
      {audioUrl && !sent && <button onClick={sendAudio}>📤 Send</button>}
      {sent && (
        <div>
          <div>Audio sent to agent!</div>
          {transcription && (
            <div style={{ marginTop: 10 }}>
              <strong>Transcription:</strong>
              <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 4, marginTop: 4 }}>{transcription}</div>
            </div>
          )}
          {sendResult && (
            <div style={{ marginTop: 10, color: '#16a34a' }}>{sendResult}</div>
          )}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default RecordPage;
