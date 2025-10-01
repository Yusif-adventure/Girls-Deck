import React, { useEffect, useState } from 'react';
import getApiBaseUrl from '../apiBaseUrl';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Users, AlertTriangle, Loader2 } from 'lucide-react';

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
    <div className="container-fluid p-0" style={{ maxWidth: 428, margin: '0 auto', background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom p-3 text-center">
        <h2 className="fw-bold mb-1" style={{ letterSpacing: 0.5 }}>Girls Deck</h2>
        <div className="text-muted" style={{ fontSize: 15 }}>Get help fast. Connect to a trained officer near you.</div>
      </div>

      {/* Main Card */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ padding: '32px 12px 0 12px' }}>
        {/* Step 1: Location Prompt */}
        {locationAllowed === null && !loading && !error && (
          <div className="card border-0 shadow-sm p-4 text-center" style={{ maxWidth: 370, margin: '0 auto', borderRadius: 18 }}>
            <MapPin size={40} className="mb-3 text-primary" />
            <div className="mb-3" style={{ fontSize: 17, fontWeight: 500 }}>Allow location to connect you to the nearest help</div>
            <button className="btn btn-primary btn-lg px-4 py-2" style={{ fontSize: 18, borderRadius: 8 }} onClick={getLocation}>
              Allow Location
            </button>
          </div>
        )}
        {/* Loading Spinner */}
        {loading && (
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 180 }}>
            <Loader2 size={36} className="mb-3 text-primary spin" />
            <div style={{ fontSize: 16 }}>Finding the nearest officer...</div>
          </div>
        )}
        {/* Error State */}
        {error && (
          <div className="card border-0 shadow-sm p-4 text-center" style={{ maxWidth: 370, margin: '0 auto', borderRadius: 18, background: '#fffbe6' }}>
            <AlertTriangle size={32} className="mb-2 text-warning" />
            <div className="mb-2" style={{ fontSize: 16, color: '#b45309' }}>{error}</div>
            <div className="text-muted mb-3" style={{ fontSize: 13 }}>You can still use other options below.</div>
          </div>
        )}
        {/* Step 2: Agent Card */}
        {locationAllowed && nearestAgent && !loading && !error && (
          <div className="card border-0 shadow-sm mx-auto p-4 text-center" style={{ maxWidth: 370, borderRadius: 18 }}>
            <img
              src={`https://randomuser.me/api/portraits/men/1.jpg`}
              alt="Agent"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 14, border: '3px solid #e0e7ff' }}
            />
            <h4 className="fw-bold mb-1">{nearestAgent.name}</h4>
            <div className="text-muted mb-2" style={{ fontSize: 14 }}>{nearestAgent.place || place}</div>
            <div className="mb-3" style={{ fontSize: 15 }}>
              You’re about to connect with <b>{nearestAgent.name}</b>, a trained child protection officer.
            </div>
            <div className="d-grid gap-2 mb-2">
              <button className="btn btn-success btn-lg" style={{ fontSize: 17, borderRadius: 8 }} onClick={handleCall}>
                <Phone size={18} className="me-2" />Call Now
              </button>
              <button className="btn btn-primary btn-lg" style={{ fontSize: 17, borderRadius: 8 }} onClick={() => handleChat('whatsapp')}>
                <MessageCircle size={18} className="me-2" />Chat on WhatsApp
              </button>
              <button className="btn btn-info btn-lg text-white" style={{ fontSize: 17, borderRadius: 8 }} onClick={() => handleChat('telegram')}>
                <MessageCircle size={18} className="me-2" />Chat on Telegram
              </button>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: 12 }}>
              Your privacy is protected. This is confidential.
            </div>
          </div>
        )}
      </div>

      {/* Other Options */}
      <div className="text-center mt-4 mb-3">
        <div className="mb-2" style={{ fontSize: 15, color: '#6b7280' }}>Other ways to report:</div>
        <div className="d-flex flex-column gap-2 align-items-center mb-3">
          <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/form">
            <span role="img" aria-label="form" className="me-2">📝</span> Fill a Form
          </Link>
          <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/record">
            <span role="img" aria-label="voice" className="me-2">🎤</span> Send a Voice Message
          </Link>
          <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/contact">
            <span role="img" aria-label="officers" className="me-2">👥</span> Contact Officers List
          </Link>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="w-100 text-center p-3" style={{ background: '#dc2626', color: '#fff', fontWeight: 600, fontSize: 18, letterSpacing: 0.5, position: 'sticky', bottom: 0, left: 0, zIndex: 100 }}>
        🚨 Immediate danger? <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => window.location.href = 'tel:999'}>Call 999 now</span>.
      </div>
    </div>
  );
};

export default HomePage;
