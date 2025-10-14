
import React, { useState } from 'react';
import { ArrowLeft, MapPin, User, Phone, MessageCircle, Navigation } from 'lucide-react';
import getApiBaseUrl from '../apiBaseUrl';

const ContactPage = () => {
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [chatType, setChatType] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Mock agents data
  const mockAgents = {
    'Greater Accra': [
      { id: 1, name: 'Sarah Mitchell - Child Protection Officer', phone: '+233244567890', whatsapp: '+233244567890', telegram: 'sarah_cpo', region: 'Greater Accra', status: 'online' },
      { id: 2, name: 'John Asante - Social Worker', phone: '+233209876543', whatsapp: '+233209876543', telegram: 'john_sw', region: 'Greater Accra', status: 'online' }
    ],
    'Ashanti': [
      { id: 3, name: 'Mary Osei - Child Protection Officer', phone: '+233244123456', whatsapp: '+233244123456', telegram: 'mary_cpo', region: 'Ashanti', status: 'online' },
      { id: 4, name: 'Peter Yeboah - Family Support Officer', phone: '+233209123456', whatsapp: '+233209123456', telegram: 'peter_fso', region: 'Ashanti', status: 'offline' }
    ],
    'Northern': [
      { id: 5, name: 'Ibrahim Mohammed - Child Rights Officer', phone: '+233244654321', whatsapp: '+233244654321', telegram: 'ibrahim_cro', region: 'Northern', status: 'online' },
      { id: 6, name: 'Fatima Abdul - Social Services Officer', phone: '+233209654321', whatsapp: '+233209654321', telegram: 'fatima_sso', region: 'Northern', status: 'online' }
    ]
  };

  const getLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          const apiBaseUrl = getApiBaseUrl();
          try {
            const res = await fetch(`${apiBaseUrl}/api/nearest-agents`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat, lng })
            });
            const data = await res.json();
            setAgents(data.agents || []);
            setPlace(data.place || '');
          } catch (err) {
            alert('Failed to fetch agents from server.');
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          setIsLoadingLocation(false);
          alert('Unable to get location. Please check permissions.');
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  const handleCall = () => {
    window.location.href = `tel:${selectedAgent.phone}`;
    setShowModal(false);
  };

  const handleChat = (type) => {
    setChatType(type);
    if (type === 'whatsapp') {
      const message = 'Hello, I need to report a child marriage case through Girls Deck.';
      window.open(`https://wa.me/${selectedAgent.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`);
    } else if (type === 'telegram') {
      window.open(`https://t.me/${selectedAgent.telegram}`);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className='form-container'>
        <div className='container'>
          <div className='row align-items-center px-md-0 px-3 py-md-4 py-5'>
            <div className='col-md-8 bg-white rounded align-items-center bg-primary h-100'>
              {/* Header */}
              <div className="bg-white border-bottom">
                <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-1">
                  <button className="btn btn-link p-0 text-dark" onClick={() => window.history.back()}>
                    <ArrowLeft size={20} />
                  </button>
                  <h5 className="mb-0 fw-bold text-green">Contact Officer</h5>
                  <div style={{ width: '24px' }}></div>
                </div>
              </div>

              <div className="p-3">
                {/* Location Section */}
                <div className="card mb-3 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <MapPin size={40} className="text-purple-500 mb-3" style={{ color: '#8b5cf6' }} />
                    <h6 className="fw-bold mb-3">Find Child Protection Officers</h6>

                    {!location ? (
                      <div>
                        <p className="text-muted small mb-3">Connect with child protection services in your area</p>
                        <button
                          className="btn btn-primary d-flex align-items-center justify-content-center mx-auto px-4 py-2 rounded-3"
                          onClick={getLocation}
                          disabled={isLoadingLocation}
                          style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
                        >
                          {isLoadingLocation ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <Navigation size={18} className="me-2" />
                              Get My Location
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-success small">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Location found: {place ? place : location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Cards */}
                <div className="row g-md-4 g-2 mb-3">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center text-primary">
                          <User size={18} className="me-2" />
                          <div>
                            <div className="fw-medium small">Professional Support</div>
                            <div style={{ fontSize: '11px' }} className="text-muted">Trained child protection officers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e' }}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center text-success">
                          <MessageCircle size={18} className="me-2" />
                          <div>
                            <div className="fw-medium small">Multiple Contact Options</div>
                            <div style={{ fontSize: '11px' }} className="text-muted">Call, WhatsApp, or Telegram</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm" style={{ backgroundColor: '#faf5ff', borderLeft: '4px solid #8b5cf6' }}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center" style={{ color: '#8b5cf6' }}>
                          <i className="bi bi-shield me-2"></i>
                          <div>
                            <div className="fw-medium small">Confidential & Safe</div>
                            <div style={{ fontSize: '11px' }} className="text-muted">Your privacy is protected</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agents List */}
                {location && (
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-header bg-white border-bottom p-3">
                      <h6 className="mb-1 fw-bold">Nearest Officers {place && (<span>in {place}</span>)}</h6>
                      <small className="text-muted">Tap to contact an officer immediately</small>
                    </div>
                    <div className="row g-4 card-body p-0">
                      {agents.length === 0 ? (
                        <div className="p-3 text-center text-muted">No officers found near your location.</div>
                      ) : (
                        agents.map((agent, idx) => {
                          // Generate a realistic name for demo purposes
                          const demoNames = [
                            'James Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'John Jones',
                            'Jennifer Garcia', 'Michael Miller', 'Linda Davis', 'William Rodriguez', 'Elizabeth Martinez',
                            'David Hernandez', 'Barbara Lopez', 'Richard Gonzalez', 'Susan Wilson', 'Joseph Anderson',
                            'Jessica Thomas', 'Thomas Taylor', 'Sarah Moore', 'Charles Jackson', 'Karen Martin'
                          ];
                          const demoPositions = [
                            'Child Protection Officer', 'Social Worker', 'Family Support Officer', 'Child Rights Officer',
                            'Community Liaison', 'Case Manager', 'Welfare Officer', 'Crisis Response Lead',
                            'Youth Advocate', 'Protection Specialist', 'Field Coordinator', 'Support Counselor',
                            'Legal Aid Officer', 'Helpline Agent', 'Safeguarding Lead', 'Community Outreach',
                            'Victim Support', 'Rescue Coordinator', 'Child Safety Advocate', 'Family Liaison'
                          ];
                          const realName = demoNames[idx % demoNames.length];
                          const realPosition = demoPositions[idx % demoPositions.length];
                          // Generate a random success rate (3-5 stars)
                          const starCount = 3 + (idx % 3); // 3, 4, or 5 stars
                          const stars = Array.from({ length: 5 }, (_, i) =>
                            i < starCount ? (
                              <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>&#9733;</span>
                            ) : (
                              <span key={i} style={{ color: '#e5e7eb', fontSize: '14px' }}>&#9733;</span>
                            )
                          );
                          return (
                            <div
                              key={agent.phone}
                              className="col-md-6 p-3 border-bottom cursor-pointer hover-bg-light"
                              onClick={() => handleAgentClick(agent)}
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                            >
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', overflow: 'hidden' }}>
                                  <img
                                    src={`https://randomuser.me/api/portraits/men/${(idx % 100) + 1}.jpg`}
                                    alt="Agent"
                                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-medium small" style={{ lineHeight: '1.2' }}>{realName}</div>
                                  <div className="text-muted" style={{ fontSize: '11px' }}>{realPosition}</div>
                                  <div>{stars} <span className="text-muted" style={{ fontSize: '11px' }}>Success Rate</span></div>
                                  <div className="text-muted" style={{ fontSize: '11px' }}>
                                    {agent.place ? agent.place + ' • ' : ''}Distance: {agent.distance ? agent.distance.toFixed(2) : '?'} km
                                  </div>
                                  <div className="d-flex align-items-center mt-1">
                                    <span className="badge bg-success me-2" style={{ fontSize: '9px' }}>Online</span>
                                    <span className="text-muted" style={{ fontSize: '10px' }}>Response time: ~5 min</span>
                                  </div>
                                </div>
                                <i className="bi bi-chevron-right text-muted"></i>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Banner */}
                <div className="alert alert-danger border-0 shadow-sm">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-exclamation-triangle-fill text-danger me-2 mt-1"></i>
                    <div>
                      <div className="fw-medium small">Immediate Danger?</div>
                      <div style={{ fontSize: '11px' }}>
                        If the girl is in immediate danger, call emergency services: <span className="fw-bold">999</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {location && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-3">
                      <h6 className="fw-medium mb-3">Quick Actions</h6>
                      <div className="d-grid gap-2">
                        <button className="btn btn-outline-primary btn-sm text-start d-flex align-items-center p-2 rounded-3">
                          <i className="bi bi-file-text text-primary me-2"></i>
                          <span className="small">File Anonymous Report</span>
                        </button>
                        <button className="btn btn-outline-success btn-sm text-start d-flex align-items-center p-2 rounded-3">
                          <i className="bi bi-mic text-success me-2"></i>
                          <span className="small">Send Voice Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal */}
            {showModal && selectedAgent && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow">
                    <div className="modal-body p-4 text-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', overflow: 'hidden' }}>
                        <img
                          src={`https://randomuser.me/api/portraits/men/${(agents.findIndex(a => a.phone === selectedAgent.phone) % 100) + 1}.jpg`}
                          alt="Agent"
                          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        />
                      </div>
                      <h6 className="fw-bold mb-1">{
                        (() => {
                          const demoNames = [
                            'James Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'John Jones',
                            'Jennifer Garcia', 'Michael Miller', 'Linda Davis', 'William Rodriguez', 'Elizabeth Martinez',
                            'David Hernandez', 'Barbara Lopez', 'Richard Gonzalez', 'Susan Wilson', 'Joseph Anderson',
                            'Jessica Thomas', 'Thomas Taylor', 'Sarah Moore', 'Charles Jackson', 'Karen Martin'
                          ];
                          const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                          return demoNames[idx % demoNames.length];
                        })()
                      }</h6>
                      <div className="text-muted small mb-2">{
                        (() => {
                          const demoPositions = [
                            'Child Protection Officer', 'Social Worker', 'Family Support Officer', 'Child Rights Officer',
                            'Community Liaison', 'Case Manager', 'Welfare Officer', 'Crisis Response Lead',
                            'Youth Advocate', 'Protection Specialist', 'Field Coordinator', 'Support Counselor',
                            'Legal Aid Officer', 'Helpline Agent', 'Safeguarding Lead', 'Community Outreach',
                            'Victim Support', 'Rescue Coordinator', 'Child Safety Advocate', 'Family Liaison'
                          ];
                          const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                          return demoPositions[idx % demoPositions.length];
                        })()
                      }</div>
                      <div>{(() => {
                        const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                        const starCount = 3 + (idx % 3);
                        return Array.from({ length: 5 }, (_, i) =>
                          i < starCount ? (
                            <span key={i} style={{ color: '#fbbf24', fontSize: '16px' }}>&#9733;</span>
                          ) : (
                            <span key={i} style={{ color: '#e5e7eb', fontSize: '16px' }}>&#9733;</span>
                          )
                        );
                      })()} <span className="text-muted" style={{ fontSize: '12px' }}>Success Rate</span></div>
                      <p className="text-muted small mb-4">{selectedAgent.place ? selectedAgent.place : selectedAgent.region + ' Region'}</p>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-success d-flex align-items-center justify-content-center"
                          onClick={handleCall}
                        >
                          <Phone size={18} className="me-2" />
                          Call Officer
                        </button>
                        <button
                          className="btn btn-primary d-flex align-items-center justify-content-center"
                          onClick={() => handleChat('whatsapp')}
                        >
                          <i className="bi bi-whatsapp me-2"></i>
                          WhatsApp
                        </button>
                        <button
                          className="btn btn-info d-flex align-items-center justify-content-center"
                          onClick={() => handleChat('telegram')}
                        >
                          <i className="bi bi-telegram me-2"></i>
                          Telegram
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>


      {/* <div className="container-fluid p-0" style={{ maxWidth: '428px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header *
        <div className="bg-white shadow-sm border-bottom">
          <div className="d-flex align-items-center justify-content-between p-3">
            <button className="btn btn-link p-0 text-dark" onClick={() => window.history.back()}>
              <ArrowLeft size={20} />
            </button>
            <h5 className="mb-0 fw-bold">Contact Officer</h5>
            <div style={{ width: '24px' }}></div>
          </div>
        </div>

        <div className="p-3">
          {/* Location Section *
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <MapPin size={40} className="text-purple-500 mb-3" style={{ color: '#8b5cf6' }} />
              <h6 className="fw-bold mb-3">Find Child Protection Officers</h6>

              {!location ? (
                <div>
                  <p className="text-muted small mb-3">Connect with child protection services in your area</p>
                  <button
                    className="btn btn-primary d-flex align-items-center justify-content-center mx-auto px-4 py-2 rounded-3"
                    onClick={getLocation}
                    disabled={isLoadingLocation}
                    style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation size={18} className="me-2" />
                        Get My Location
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-success small">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Location found: {place ? place : location}
                </div>
              )}
            </div>
          </div>

          {/* Info Cards *
          <div className="row g-2 mb-3">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center text-primary">
                    <User size={18} className="me-2" />
                    <div>
                      <div className="fw-medium small">Professional Support</div>
                      <div style={{ fontSize: '11px' }} className="text-muted">Trained child protection officers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e' }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center text-success">
                    <MessageCircle size={18} className="me-2" />
                    <div>
                      <div className="fw-medium small">Multiple Contact Options</div>
                      <div style={{ fontSize: '11px' }} className="text-muted">Call, WhatsApp, or Telegram</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ backgroundColor: '#faf5ff', borderLeft: '4px solid #8b5cf6' }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center" style={{ color: '#8b5cf6' }}>
                    <i className="bi bi-shield-check me-2"></i>
                    <div>
                      <div className="fw-medium small">Confidential & Safe</div>
                      <div style={{ fontSize: '11px' }} className="text-muted">Your privacy is protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agents List *
          {location && (
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white border-bottom p-3">
                <h6 className="mb-1 fw-bold">Nearest Officers {place && (<span>in {place}</span>)}</h6>
                <small className="text-muted">Tap to contact an officer immediately</small>
              </div>
              <div className="card-body p-0">
                {agents.length === 0 ? (
                  <div className="p-3 text-center text-muted">No officers found near your location.</div>
                ) : (
                  agents.map((agent, idx) => {
                    // Generate a realistic name for demo purposes
                    const demoNames = [
                      'James Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'John Jones',
                      'Jennifer Garcia', 'Michael Miller', 'Linda Davis', 'William Rodriguez', 'Elizabeth Martinez',
                      'David Hernandez', 'Barbara Lopez', 'Richard Gonzalez', 'Susan Wilson', 'Joseph Anderson',
                      'Jessica Thomas', 'Thomas Taylor', 'Sarah Moore', 'Charles Jackson', 'Karen Martin'
                    ];
                    const demoPositions = [
                      'Child Protection Officer', 'Social Worker', 'Family Support Officer', 'Child Rights Officer',
                      'Community Liaison', 'Case Manager', 'Welfare Officer', 'Crisis Response Lead',
                      'Youth Advocate', 'Protection Specialist', 'Field Coordinator', 'Support Counselor',
                      'Legal Aid Officer', 'Helpline Agent', 'Safeguarding Lead', 'Community Outreach',
                      'Victim Support', 'Rescue Coordinator', 'Child Safety Advocate', 'Family Liaison'
                    ];
                    const realName = demoNames[idx % demoNames.length];
                    const realPosition = demoPositions[idx % demoPositions.length];
                    // Generate a random success rate (3-5 stars)
                    const starCount = 3 + (idx % 3); // 3, 4, or 5 stars
                    const stars = Array.from({ length: 5 }, (_, i) =>
                      i < starCount ? (
                        <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>&#9733;</span>
                      ) : (
                        <span key={i} style={{ color: '#e5e7eb', fontSize: '14px' }}>&#9733;</span>
                      )
                    );
                    return (
                      <div
                        key={agent.phone}
                        className="p-3 border-bottom cursor-pointer hover-bg-light"
                        onClick={() => handleAgentClick(agent)}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                      >
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', overflow: 'hidden' }}>
                            <img
                              src={`https://randomuser.me/api/portraits/men/${(idx % 100) + 1}.jpg`}
                              alt="Agent"
                              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-medium small" style={{ lineHeight: '1.2' }}>{realName}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{realPosition}</div>
                            <div>{stars} <span className="text-muted" style={{ fontSize: '11px' }}>Success Rate</span></div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>
                              {agent.place ? agent.place + ' • ' : ''}Distance: {agent.distance ? agent.distance.toFixed(2) : '?'} km
                            </div>
                            <div className="d-flex align-items-center mt-1">
                              <span className="badge bg-success me-2" style={{ fontSize: '9px' }}>Online</span>
                              <span className="text-muted" style={{ fontSize: '10px' }}>Response time: ~5 min</span>
                            </div>
                          </div>
                          <i className="bi bi-chevron-right text-muted"></i>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Emergency Banner *
          <div className="alert alert-danger border-0 shadow-sm">
            <div className="d-flex align-items-start">
              <i className="bi bi-exclamation-triangle-fill text-danger me-2 mt-1"></i>
              <div>
                <div className="fw-medium small">Immediate Danger?</div>
                <div style={{ fontSize: '11px' }}>
                  If the girl is in immediate danger, call emergency services: <span className="fw-bold">999</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions *
          {location && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <h6 className="fw-medium mb-3">Quick Actions</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary btn-sm text-start d-flex align-items-center p-2 rounded-3">
                    <i className="bi bi-file-text text-primary me-2"></i>
                    <span className="small">File Anonymous Report</span>
                  </button>
                  <button className="btn btn-outline-success btn-sm text-start d-flex align-items-center p-2 rounded-3">
                    <i className="bi bi-mic text-success me-2"></i>
                    <span className="small">Send Voice Message</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal *
        {showModal && selectedAgent && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-body p-4 text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', overflow: 'hidden' }}>
                    <img
                      src={`https://randomuser.me/api/portraits/men/${(agents.findIndex(a => a.phone === selectedAgent.phone) % 100) + 1}.jpg`}
                      alt="Agent"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                  </div>
                  <h6 className="fw-bold mb-1">{
                    (() => {
                      const demoNames = [
                        'James Smith', 'Mary Johnson', 'Robert Williams', 'Patricia Brown', 'John Jones',
                        'Jennifer Garcia', 'Michael Miller', 'Linda Davis', 'William Rodriguez', 'Elizabeth Martinez',
                        'David Hernandez', 'Barbara Lopez', 'Richard Gonzalez', 'Susan Wilson', 'Joseph Anderson',
                        'Jessica Thomas', 'Thomas Taylor', 'Sarah Moore', 'Charles Jackson', 'Karen Martin'
                      ];
                      const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                      return demoNames[idx % demoNames.length];
                    })()
                  }</h6>
                  <div className="text-muted small mb-2">{
                    (() => {
                      const demoPositions = [
                        'Child Protection Officer', 'Social Worker', 'Family Support Officer', 'Child Rights Officer',
                        'Community Liaison', 'Case Manager', 'Welfare Officer', 'Crisis Response Lead',
                        'Youth Advocate', 'Protection Specialist', 'Field Coordinator', 'Support Counselor',
                        'Legal Aid Officer', 'Helpline Agent', 'Safeguarding Lead', 'Community Outreach',
                        'Victim Support', 'Rescue Coordinator', 'Child Safety Advocate', 'Family Liaison'
                      ];
                      const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                      return demoPositions[idx % demoPositions.length];
                    })()
                  }</div>
                  <div>{(() => {
                    const idx = agents.findIndex(a => a.phone === selectedAgent.phone);
                    const starCount = 3 + (idx % 3);
                    return Array.from({ length: 5 }, (_, i) =>
                      i < starCount ? (
                        <span key={i} style={{ color: '#fbbf24', fontSize: '16px' }}>&#9733;</span>
                      ) : (
                        <span key={i} style={{ color: '#e5e7eb', fontSize: '16px' }}>&#9733;</span>
                      )
                    );
                  })()} <span className="text-muted" style={{ fontSize: '12px' }}>Success Rate</span></div>
                  <p className="text-muted small mb-4">{selectedAgent.place ? selectedAgent.place : selectedAgent.region + ' Region'}</p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-success d-flex align-items-center justify-content-center"
                      onClick={handleCall}
                    >
                      <Phone size={18} className="me-2" />
                      Call Officer
                    </button>
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={() => handleChat('whatsapp')}
                    >
                      <i className="bi bi-whatsapp me-2"></i>
                      WhatsApp
                    </button>
                    <button
                      className="btn btn-info d-flex align-items-center justify-content-center"
                      onClick={() => handleChat('telegram')}
                    >
                      <i className="bi bi-telegram me-2"></i>
                      Telegram
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div> */}

    </>

  );
};

export default ContactPage;