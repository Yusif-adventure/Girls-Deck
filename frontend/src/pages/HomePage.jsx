// import React, { useEffect, useState } from 'react';
// import getApiBaseUrl from '../apiBaseUrl';
// import { Link } from 'react-router-dom';
// import { MapPin, Phone, MessageCircle, Users, AlertTriangle, Loader2 } from 'lucide-react';

// const HomePage = () => {
//   const [locationAllowed, setLocationAllowed] = useState(null);
//   const [place, setPlace] = useState('');
//   const [nearestAgent, setNearestAgent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showOther, setShowOther] = useState(false);

//   useEffect(() => {
//     // Prompt for location on mount
//     if (locationAllowed === null) {
//       setTimeout(() => getLocation(), 500); // slight delay for UX
//     }
//     // eslint-disable-next-line
//   }, []);

//   const getLocation = () => {
//     setLoading(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//           setLocationAllowed(true);
//           const lat = pos.coords.latitude;
//           const lng = pos.coords.longitude;
//           try {
//             const apiBaseUrl = getApiBaseUrl();
//             const res = await fetch(`${apiBaseUrl}/api/nearest-agents`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ lat, lng })
//             });
//             const data = await res.json();
//             setPlace(data.place || 'your area');
//             if (data.agents && data.agents.length > 0) {
//               setNearestAgent(data.agents[0]);
//             } else {
//               setError('No officers found near your location.');
//             }
//           } catch (err) {
//             setError('Failed to fetch agent. Please try again.');
//           }
//           setLoading(false);
//         },
//         (error) => {
//           setLocationAllowed(false);
//           setLoading(false);
//           setError('Location access denied. Please allow location to connect you to help.');
//         }
//       );
//     } else {
//       setLocationAllowed(false);
//       setLoading(false);
//       setError('Geolocation is not supported by this browser.');
//     }
//   };

//   const handleCall = () => {
//     if (nearestAgent) {
//       window.location.href = `tel:${nearestAgent.phone}`;
//     }
//   };

//   const handleChat = (type) => {
//     if (!nearestAgent) return;
//     if (type === 'whatsapp') {
//       const message = encodeURIComponent('Hello, I need help with a child marriage case.');
//       window.open(`https://wa.me/${nearestAgent.whatsapp.replace('+', '')}?text=${message}`);
//     } else if (type === 'telegram') {
//       window.open(`https://t.me/${nearestAgent.telegram}`);
//     }
//   };

//   return (
//     <div className="container-fluid p-0" style={{ maxWidth: 428, margin: '0 auto', background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       {/* Header */}
//       <div className="bg-white shadow-sm border-bottom p-3 text-center">
//         <h2 className="fw-bold mb-1" style={{ letterSpacing: 0.5 }}>Girls Deck</h2>
//         <div className="text-muted" style={{ fontSize: 15 }}>Get help fast. Connect to a trained officer near you.</div>
//       </div>

//       {/* Main Card */}
//       <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ padding: '32px 12px 0 12px' }}>
//         {/* Step 1: Location Prompt */}
//         {locationAllowed === null && !loading && !error && (
//           <div className="card border-0 shadow-sm p-4 text-center" style={{ maxWidth: 370, margin: '0 auto', borderRadius: 18 }}>
//             <MapPin size={40} className="mb-3 text-primary" />
//             <div className="mb-3" style={{ fontSize: 17, fontWeight: 500 }}>Allow location to connect you to the nearest help</div>
//             <button className="btn btn-primary btn-lg px-4 py-2" style={{ fontSize: 18, borderRadius: 8 }} onClick={getLocation}>
//               Allow Location
//             </button>
//           </div>
//         )}
//         {/* Loading Spinner */}
//         {loading && (
//           <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 180 }}>
//             <Loader2 size={36} className="mb-3 text-primary spin" />
//             <div style={{ fontSize: 16 }}>Finding the nearest officer...</div>
//           </div>
//         )}
//         {/* Error State */}
//         {error && (
//           <div className="card border-0 shadow-sm p-4 text-center" style={{ maxWidth: 370, margin: '0 auto', borderRadius: 18, background: '#fffbe6' }}>
//             <AlertTriangle size={32} className="mb-2 text-warning" />
//             <div className="mb-2" style={{ fontSize: 16, color: '#b45309' }}>{error}</div>
//             <div className="text-muted mb-3" style={{ fontSize: 13 }}>You can still use other options below.</div>
//           </div>
//         )}
//         {/* Step 2: Agent Card */}
//         {locationAllowed && nearestAgent && !loading && !error && (
//           <div className="card border-0 shadow-sm mx-auto p-4 text-center" style={{ maxWidth: 370, borderRadius: 18 }}>
//             <img
//               src={`https://randomuser.me/api/portraits/men/1.jpg`}
//               alt="Agent"
//               style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 14, border: '3px solid #e0e7ff' }}
//             />
//             <h4 className="fw-bold mb-1">{nearestAgent.name}</h4>
//             <div className="text-muted mb-2" style={{ fontSize: 14 }}>{nearestAgent.place || place}</div>
//             <div className="mb-3" style={{ fontSize: 15 }}>
//               You’re about to connect with <b>{nearestAgent.name}</b>, a trained child protection officer.
//             </div>
//             <div className="d-grid gap-2 mb-2">
//               <button className="btn btn-success btn-lg" style={{ fontSize: 17, borderRadius: 8 }} onClick={handleCall}>
//                 <Phone size={18} className="me-2" />Call Now
//               </button>
//               <button className="btn btn-primary btn-lg" style={{ fontSize: 17, borderRadius: 8 }} onClick={() => handleChat('whatsapp')}>
//                 <MessageCircle size={18} className="me-2" />Chat on WhatsApp
//               </button>
//               <button className="btn btn-info btn-lg text-white" style={{ fontSize: 17, borderRadius: 8 }} onClick={() => handleChat('telegram')}>
//                 <MessageCircle size={18} className="me-2" />Chat on Telegram
//               </button>
//             </div>
//             <div className="text-muted mt-2" style={{ fontSize: 12 }}>
//               Your privacy is protected. This is confidential.
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Other Options */}
//       <div className="text-center mt-4 mb-3">
//         <div className="mb-2" style={{ fontSize: 15, color: '#6b7280' }}>Other ways to report:</div>
//         <div className="d-flex flex-column gap-2 align-items-center mb-3">
//           <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/form">
//             <span role="img" aria-label="form" className="me-2">📝</span> Fill a Form
//           </Link>
//           <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/record">
//             <span role="img" aria-label="voice" className="me-2">🎤</span> Send a Voice Message
//           </Link>
//           <Link className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" to="/contact">
//             <span role="img" aria-label="officers" className="me-2">👥</span> Contact Officers List
//           </Link>
//         </div>
//       </div>

//       {/* Emergency Banner */}
//       <div className="w-100 text-center p-3" style={{ background: '#dc2626', color: '#fff', fontWeight: 600, fontSize: 18, letterSpacing: 0.5, position: 'sticky', bottom: 0, left: 0, zIndex: 100 }}>
//         🚨 Immediate danger? <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => window.location.href = 'tel:999'}>Call 999 now</span>.
//       </div>
//     </div>
//   );
// };

// export default HomePage;











import React, { useEffect, useState } from 'react';
import getApiBaseUrl from '../apiBaseUrl';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, AlertTriangle, Loader2, FileText, Mic, Phone, AlertCircle, ArrowRight, FolderMinus, Siren, Contact, FolderMinusIcon } from 'lucide-react';
import './Home.css'; // Import the CSS file


const HomePage = () => {
  const [locationAllowed, setLocationAllowed] = useState(null);
  const [place, setPlace] = useState('');
  const [nearestAgent, setNearestAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (locationAllowed === null) {
      setTimeout(() => getLocation(), 500);
    }
  }, []); // run once

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
        () => {
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
    <div className=''>
      <div className="main-div container">
        {/* Navigation */}
        <nav className="d-flex align-items-start justify-content-between w-full pt-4">
          <div>
            <h1 className='fw-bold fs-2' style={{ color: 'green' }}>GirlsDeck</h1>
            <p className="text-muted" style={{ marginTop: '-10px', fontSize: '14px' }}>Get help fast. Connect to a trained officer near you.</p>
          </div>
        </nav>

        {/* Main Content */}
        <div className="row g-4 mt-2 align-items-center justify-content-between">
          <div className="col-md-6 col-12 hero-section">
            {/* Location Prompt */}
            {locationAllowed === null && !loading && !error && (
              <div className="card shadow-sm text-center p-4 border-0" style={{ borderRadius: 18, maxWidth: 370 }}>
                <MapPin size={40} className="mb-3 text-primary" />
                <h5 className="mb-3">Allow location to connect you to the nearest help</h5>
                <button className="btn btn-primary btn-lg" onClick={getLocation}>
                  Allow Location
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="d-flex flex-column align-items-center">
                <Loader2 size={36} className="mb-3 text-primary spinner-border" />
                <div>Finding the nearest officer...</div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="card shadow-sm text-center p-4 border-0 bg-warning-subtle" style={{ borderRadius: 18, maxWidth: 370 }}>
                <AlertTriangle size={32} className="mb-2 text-warning" />
                <div className="mb-2 fw-semibold">{error}</div>
                <div className="text-muted small">You can still use other options.</div>
              </div>
            )}

            {/* Agent Found */}
            {locationAllowed && nearestAgent && !loading && !error && (
              <div className="card agent-card text-center mx-md-0 mx-2 p-4 border-0" style={{ borderRadius: 18, maxWidth: 370 }}>
                <img
                  src="../../assets/man2.jpg"
                  // src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Agent"
                  className="rounded-circle border mb-3"
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                />
                <h4 className="fw-bold fs-3" style={{marginBottom: '-5px'}}>{nearestAgent.name}</h4>
                <p className="text-muted">{nearestAgent.place || place}</p>
                <p style={{fontSize: '14px'}}>You’re about to connect with <b>{nearestAgent.name}</b>, a trained child protection officer.</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-success btn-lg fs-6" onClick={handleCall}>
                    <Phone size={18} className="me-2" /> Call Now
                  </button>
                  <button className="btn btn-primary btn-lg fs-6" onClick={() => handleChat('whatsapp')}>
                    <MessageCircle size={18} className="me-2" /> Chat on WhatsApp
                  </button>
                  {/* <button className="btn btn-info btn-lg text-white fs-6" onClick={() => handleChat('telegram')}>
                    <MessageCircle size={18} className="me-2" /> Chat on Telegram
                  </button> */}
                </div>
                <small className="text-muted d-block mt-2">Your privacy is protected. This is confidential.</small>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="col-md-4 col-10 mx-auto px-md-0 px-2 mt-md-0 mt-5">
            <div className="booking-card">
              {/* Other Options */}
              <div className="p-md-3 p-1">
                <p className="fw-bold ">Other ways to report:</p>
                <div className="d-flex flex-column gap-2 text-center">
                  <Link className="btn-option" to="/form">
                    <i className="bi bi-card-list me-2"></i> Fill a Form</Link>
                  {/* <Link className="btn-option" to="/record">🎤 Send a Voice Message</Link> */}
                  <Link className="btn-option" to="/contact"><Contact /> Contact Officers List</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Emergency banner*/}
      <div className="bg-danger text-white text-center fw-bold p-3 bottom-0 right-0 left-0 w-100" style={{ position: 'fixed' }}>
        🚨 Immediate danger?{" "}
        <span className="text-decoration-underline" style={{ cursor: 'pointer' }} onClick={() => (window.location.href = 'tel:999')}>
          Call 999 now
        </span>.
      </div>


      {/* <div className="container-fluid bg-light d-flex flex-column min-vh-100" style={{ maxWidth: 428 }}>
        {/* Header *
        <div className="bg-white shadow-sm border-bottom p-3 text-center">
          <h2 className="fw-bold mb-1">Girls Deck</h2>
          <div className="text-muted">Get help fast. Connect to a trained officer near you.</div>
        </div>

        {/* Main Content *
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3">
          {/* Location Prompt *
          {locationAllowed === null && !loading && !error && (
            <div className="card shadow-sm text-center p-4 border-0" style={{ borderRadius: 18, maxWidth: 370 }}>
              <MapPin size={40} className="mb-3 text-primary" />
              <h5 className="mb-3">Allow location to connect you to the nearest help</h5>
              <button className="btn btn-primary btn-lg" onClick={getLocation}>
                Allow Location
              </button>
            </div>
          )}

          {/* Loading *
          {loading && (
            <div className="d-flex flex-column align-items-center">
              <Loader2 size={36} className="mb-3 text-primary spinner-border" />
              <div>Finding the nearest officer...</div>
            </div>
          )}

          {/* Error *
          {error && (
            <div className="card shadow-sm text-center p-4 border-0 bg-warning-subtle" style={{ borderRadius: 18, maxWidth: 370 }}>
              <AlertTriangle size={32} className="mb-2 text-warning" />
              <div className="mb-2 fw-semibold">{error}</div>
              <div className="text-muted small">You can still use other options below.</div>
            </div>
          )}

          {/* Agent Found *
          {locationAllowed && nearestAgent && !loading && !error && (
            <div className="card shadow-sm text-center p-4 border-0" style={{ borderRadius: 18, maxWidth: 370 }}>
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Agent"
                className="rounded-circle border mb-3"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
              <h4 className="fw-bold">{nearestAgent.name}</h4>
              <p className="text-muted">{nearestAgent.place || place}</p>
              <p>You’re about to connect with <b>{nearestAgent.name}</b>, a trained child protection officer.</p>
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg" onClick={handleCall}>
                  <Phone size={18} className="me-2" /> Call Now
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => handleChat('whatsapp')}>
                  <MessageCircle size={18} className="me-2" /> Chat on WhatsApp
                </button>
                <button className="btn btn-info btn-lg text-white" onClick={() => handleChat('telegram')}>
                  <MessageCircle size={18} className="me-2" /> Chat on Telegram
                </button>
              </div>
              <small className="text-muted d-block mt-2">Your privacy is protected. This is confidential.</small>
            </div>
          )}
        </div>

        {/* Other Options *
        <div className="text-center p-3">
          <p className="text-muted mb-2">Other ways to report:</p>
          <div className="d-flex flex-column gap-2">
            <Link className="btn btn-outline-primary" to="/form">📝 Fill a Form</Link>
            <Link className="btn btn-outline-primary" to="/record">🎤 Send a Voice Message</Link>
            <Link className="btn btn-outline-primary" to="/contact">👥 Contact Officers List</Link>
          </div>
        </div>

        {/* Emergency Banner *
        <div className="bg-danger text-white text-center fw-bold p-3 sticky-bottom">
          🚨 Immediate danger?{" "}
          <span className="text-decoration-underline" style={{ cursor: 'pointer' }} onClick={() => (window.location.href = 'tel:999')}>
            Call 999 now
          </span>.
        </div>
      </div> */}

    </div>
  );
};

export default HomePage;
