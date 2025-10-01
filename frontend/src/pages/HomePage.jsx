import React, { useEffect, useState } from 'react';
import getApiBaseUrl from '../apiBaseUrl';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [locationAllowed, setLocationAllowed] = useState(null);
  const [place, setPlace] = useState('');
  const [nearestAgent, setNearestAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOther, setShowOther] = useState(false);

  useEffect(() => {
    // Prompt for location on mount
    if (locationAllowed === null) {
      setTimeout(() => getLocation(), 500); // slight delay for UX
    }
    // eslint-disable-next-line
  }, []);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLocationAllowed(true);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const apiBaseUrl = getApiBaseUrl();
            const res = await fetch(`${apiBaseUrl}/api/nearest-agents`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat, lng })
            });
            const data = await res.json();
            setPlace(data.place || 'your area');
            if (data.agents && data.agents.length > 0) {
              setNearestAgent(data.agents[0]);
            } else {
              setError('No officers found near your location.');
            }
          } catch (err) {
            setError('Failed to fetch agent. Please try again.');
          }
          setLoading(false);
        },
        (error) => {
          setLocationAllowed(false);
          setLoading(false);
          setError('Location access denied. Please allow location to connect you to help.');
        }
      );
    } else {
      setLocationAllowed(false);
      setLoading(false);
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleCall = () => {
    if (nearestAgent) {
      window.location.href = `tel:${nearestAgent.phone}`;
    }
  };

  const handleChat = (type) => {
    if (!nearestAgent) return;
    if (type === 'whatsapp') {
      const message = encodeURIComponent('Hello, I need help with a child marriage case.');
      window.open(`https://wa.me/${nearestAgent.whatsapp.replace('+', '')}?text=${message}`);
    } else if (type === 'telegram') {
      window.open(`https://t.me/${nearestAgent.telegram}`);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ maxWidth: 428, margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="bg-white shadow-sm border-bottom p-3 text-center">
        <h4 className="fw-bold mb-0">Girls Deck: Report Child Marriage</h4>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => setShowOther(v => !v)}>
          {showOther ? 'Hide Other Options' : 'Other Options'}
        </button>
        {showOther && (
          <div className="mt-3 d-flex flex-column gap-2 align-items-center">
            <Link className="btn btn-outline-primary w-100" to="/form">Fill a Form</Link>
            <Link className="btn btn-outline-primary w-100" to="/record">Send a Voice Message</Link>
            <Link className="btn btn-outline-primary w-100" to="/contact">Contact Officers List</Link>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <div className="mb-4">
          <button className="btn btn-danger mb-2" style={{ fontWeight: 600, fontSize: 18 }} onClick={() => window.location.href = 'tel:999'}>
            🚨 Emergency? Call 999
          </button>
        </div>
        {loading && <div className="my-4">Getting your location...</div>}
        {error && <div className="alert alert-warning my-3">{error}</div>}
        {nearestAgent && (
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 340 }}>
            <div className="card-body text-center">
              <img
                src={`https://randomuser.me/api/portraits/men/1.jpg`}
                alt="Agent"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }}
              />
              <h5 className="fw-bold mb-1">{nearestAgent.name}</h5>
              <div className="text-muted mb-2" style={{ fontSize: 13 }}>{nearestAgent.place || place}</div>
              <div className="mb-3" style={{ fontSize: 14 }}>
                You’re about to connect with <b>{nearestAgent.name}</b>, a trained child protection officer.
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success" style={{ fontSize: 16 }} onClick={handleCall}>
                  📞 Call Now
                </button>
                <button className="btn btn-primary" style={{ fontSize: 16 }} onClick={() => handleChat('whatsapp')}>
                  💬 Chat on WhatsApp
                </button>
                <button className="btn btn-info" style={{ fontSize: 16, color: '#fff' }} onClick={() => handleChat('telegram')}>
                  💬 Chat on Telegram
                </button>
              </div>
            </div>
          </div>
        )}
        {!loading && !nearestAgent && !error && (
          <button className="btn btn-outline-primary mt-4" onClick={getLocation}>
            Get My Location
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
