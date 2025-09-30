import React, { useRef, useState } from 'react';


const RecordPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sent, setSent] = useState(false);
  const [region, setRegion] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleRegionBlur = async () => {
    if (region) {
      const res = await fetch(`http://localhost:3001/api/agents?region=${region}`);
      const data = await res.json();
      setAgents(data.agents);
      setSelectedAgent('');
    }
  };

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
    const blob = await fetch(audioUrl).then(r => r.blob());
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('channel', channel);
    formData.append('agentContact', channel === 'whatsapp' ? selectedAgent.whatsapp : selectedAgent.telegram);
    await fetch('http://localhost:3001/api/audio', {
      method: 'POST',
      body: formData,
    });
    setSent(true);
  };

  return (
    <div className="record-page">
      <h2>Record Audio</h2>
      <input
        placeholder="Region"
        value={region}
        onChange={e => setRegion(e.target.value)}
        onBlur={handleRegionBlur}
      />
      {agents.length > 0 && (
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
      )}
      {!recording && <button onClick={startRecording}>🎤 Record</button>}
      {recording && <button onClick={stopRecording}>⏹️ Stop</button>}
      {audioUrl && <audio src={audioUrl} controls />}
      {audioUrl && !sent && <button onClick={sendAudio}>📤 Send</button>}
      {sent && <div>Audio sent to agent!</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default RecordPage;
