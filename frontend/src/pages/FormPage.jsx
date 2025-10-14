import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Globe, Phone, MessageCircle, CheckCircle } from 'lucide-react';

const FormPage = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    region: '',
    contact: '',
    moreInfo: ''
  });
  const [success, setSuccess] = useState('');
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mock agents data
  const mockAgents = {
    'Greater Accra': [
      {
        name: 'Sarah Mitchell - Child Protection Officer',
        phone: '+233244567890',
        whatsapp: '+233244567890',
        telegram: 'sarah_cpo'
      },
      {
        name: 'John Asante - Social Worker',
        phone: '+233209876543',
        whatsapp: '+233209876543',
        telegram: 'john_sw'
      }
    ],
    'Ashanti': [
      {
        name: 'Mary Osei - Child Protection Officer',
        phone: '+233244123456',
        whatsapp: '+233244123456',
        telegram: 'mary_cpo'
      },
      {
        name: 'Peter Yeboah - Family Support Officer',
        phone: '+233209123456',
        whatsapp: '+233209123456',
        telegram: 'peter_fso'
      }
    ],
    'Northern': [
      {
        name: 'Ibrahim Mohammed - Child Rights Officer',
        phone: '+233244654321',
        whatsapp: '+233244654321',
        telegram: 'ibrahim_cro'
      },
      {
        name: 'Fatima Abdul - Social Services Officer',
        phone: '+233209654321',
        whatsapp: '+233209654321',
        telegram: 'fatima_sso'
      }
    ]
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setForm({ ...form, region: selectedRegion });

    // Load agents for selected region
    if (selectedRegion && mockAgents[selectedRegion]) {
      setAgents(mockAgents[selectedRegion]);
      setSelectedAgent('');
    } else {
      setAgents([]);
      setSelectedAgent('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAgent && agents.length > 0) {
      setSuccess('Please select an agent to send the report to.');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      const message = `CHILD MARRIAGE REPORT - Girls Deck:

Reporter: ${form.name || 'Anonymous'}
Girl's Age: ${form.age}
Location: ${form.region}
Contact: ${form.contact || 'Anonymous'}

Details: ${form.moreInfo}

This is a child marriage report requiring immediate attention.`;

      if (selectedAgent) {
        if (channel === 'whatsapp') {
          const whatsappUrl = `https://wa.me/${selectedAgent.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        } else {
          window.open(`https://t.me/${selectedAgent.telegram}`, '_blank');
        }
      }

      setFormSubmitted(true);
      setIsSubmitting(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setForm({ name: '', age: '', region: '', contact: '', moreInfo: '' });
        setAgents([]);
        setSelectedAgent('');
        setSuccess('');
      }, 3000);
    }, 2000);
  };

  if (formSubmitted) {
    return (
      <div className="container-fluid p-0" style={{ maxWidth: '428px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-bottom">
          <div className="d-flex align-items-center justify-content-between p-3">
            <button className="btn btn-link p-0 text-dark" onClick={() => window.history.back()}>
              <ArrowLeft size={20} />
            </button>
            <h5 className="mb-0 fw-bold">Child Marriage Report</h5>
            <div style={{ width: '24px' }}></div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
          <div className="text-center p-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '80px', height: '80px', backgroundColor: '#22c55e' }}>
              <CheckCircle size={40} className="text-white" />
            </div>
            <h4 className="fw-bold text-success mb-3">Report Submitted!</h4>
            <p className="text-muted">Your child marriage report has been sent to protection services.</p>
            <div className="spinner-border spinner-border-sm text-muted mt-3" role="status">
              <span className="visually-hidden">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className='form-container'>
      <div className='container'>
        <div className='row align-items-center px-md-0 px-3 py-md-4 py-5'>
          <div className='col-md-6 col-12 bg-white rounded'>
            {/* Header */}
            <div className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between p-3">
                <button className="btn btn-link p-0 text-dark" onClick={() => window.history.back()}>
                  <ArrowLeft size={20} />
                </button>
                <h5 className="mb-0 fw-bold text-green">Child Marriage Report</h5>
                <div style={{ width: '24px' }}></div>
              </div>
            </div>

            <div className="px-3">
              <form onSubmit={handleSubmit}>
                <div className="card border-0 mb-3">
                  <div className="card-body px-4 pt-4 pb-0">

                    {/* Info Banner */}
                    <div className="alert alert-danger border-0 shadow-sm">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
                        <div>
                          <div className="fw-bold small">Anonymous Reporting Available</div>
                          <div style={{ fontSize: '12px' }} className="text-muted">
                            You can submit this report without providing your name or contact information.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      {/* Name Field */}
                      <div className="col-md-6 mb-4">
                        <label className="form-label text-dark fw-medium d-flex align-items-center">
                          <User size={16} className="me-2" />
                          Your Name (or Anonymous)
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-lg border-2 rounded-3"
                          placeholder="Enter name or leave blank for anonymous"
                          value={form.name}
                          onChange={handleChange}
                          style={{ fontSize: '16px' }}
                        />
                      </div>

                      {/* Age Field */}
                      <div className="col-md-6 mb-4">
                        <label className="form-label text-dark fw-medium d-flex align-items-center">
                          <Calendar size={16} className="me-2" />
                          Girl's Age <span className='text-red'>*</span>
                        </label>
                        <input
                          type="number"
                          name="age"
                          className="form-control form-control-lg border-2 rounded-3"
                          placeholder="Age of the girl at risk"
                          value={form.age}
                          onChange={handleChange}
                          min="1"
                          max="25"
                          required
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>

                    {/* Region Field */}
                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium d-flex align-items-center">
                        <Globe size={16} className="me-2" />
                        Location/Region  <span className='text-red'>*</span>
                      </label>
                      <select
                        name="region"
                        className="form-select form-select-lg border-2 rounded-3"
                        value={form.region}
                        onChange={handleRegionChange}
                        required
                        style={{ fontSize: '16px' }}
                      >
                        <option value="">Select location</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Northern">Northern</option>
                        <option value="Western">Western</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Central">Central</option>
                        <option value="Volta">Volta</option>
                        <option value="Upper East">Upper East</option>
                        <option value="Upper West">Upper West</option>
                        <option value="Brong Ahafo">Brong Ahafo</option>
                      </select>
                    </div>

                    {/* Phone Number Field */}
                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium d-flex align-items-center">
                        <Phone size={16} className="me-2" />
                        Contact Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        className="form-control form-control-lg border-2 rounded-3"
                        placeholder="Leave blank to remain anonymous"
                        value={form.contact}
                        onChange={handleChange}
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {/* Additional Information Field */}
                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium d-flex align-items-center">
                        <MessageCircle size={16} className="me-2" />
                        Child Marriage Details <span className='text-red'>*</span>
                      </label>
                      <textarea
                        name="moreInfo"
                        className="form-control form-control-lg border-2 rounded-3"
                        rows="4"
                        placeholder="Please provide details: Is the marriage planned or already happened? Who is involved? When? Any other important information..."
                        value={form.moreInfo}
                        onChange={handleChange}
                        required
                        style={{ fontSize: '16px', resize: 'none' }}
                      />
                    </div>

                    {/* Agent Selection - Only show if region is selected and agents are available */}
                    {agents.length > 0 && (
                      <>
                        <div className="mb-4">
                          <label className="form-label text-dark fw-medium">
                            Select Child Protection Officer <span className='text-red'>*</span>
                          </label>
                          <select
                            className="form-select form-select-lg border-2 rounded-3"
                            value={selectedAgent ? selectedAgent.phone : ''}
                            onChange={(e) => setSelectedAgent(agents.find(a => a.phone === e.target.value))}
                            required
                            style={{ fontSize: '16px' }}
                          >
                            <option value="">-- Select Officer --</option>
                            {agents.map(agent => (
                              <option key={agent.phone} value={agent.phone}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="form-label text-dark fw-medium">
                            Send Report Via:
                          </label>
                          <div className="d-flex gap-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="channel"
                                id="whatsapp"
                                value="whatsapp"
                                checked={channel === 'whatsapp'}
                                onChange={(e) => setChannel(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="whatsapp">
                                <i className="bi bi-whatsapp text-success me-1"></i>
                                WhatsApp
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="channel"
                                id="telegram"
                                value="telegram"
                                checked={channel === 'telegram'}
                                onChange={(e) => setChannel(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="telegram">
                                <i className="bi bi-telegram text-info me-1"></i>
                                Telegram
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg rounded-3"
                    disabled={isSubmitting}
                    style={{ fontSize: '16px', padding: '12px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Submitting Report...
                      </>
                    ) : (
                      'Submit Child Marriage Report'
                    )}
                  </button>
                </div>

                {/* Success/Error Message */}
                {success && (
                  <div className={`alert ${success.includes('Failed') ? 'alert-danger' : 'alert-success'} border-0 shadow-sm`}>
                    {success}
                  </div>
                )}
              </form>


            </div>
          </div>

          {/* <div className='col-md-6 display-md-none'>
          <img src="../assets/girl.webp" alt="young-girl" style={{ width: '100%'}} />
        </div> */}
        </div>
      </div>

      {/* <div className="container-fluid p-0" style={{ maxWidth: '428px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header *
        <div className="bg-white shadow-sm border-bottom">
          <div className="d-flex align-items-center justify-content-between p-3">
            <button className="btn btn-link p-0 text-dark" onClick={() => window.history.back()}>
              <ArrowLeft size={20} />
            </button>
            <h5 className="mb-0 fw-bold">Child Marriage Report</h5>
            <div style={{ width: '24px' }}></div>
          </div>
        </div>

        <div className="p-3">
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">

                {/* Name Field *
                <div className="mb-4">
                  <label className="form-label text-dark fw-medium d-flex align-items-center">
                    <User size={16} className="me-2" />
                    Your Name (or Anonymous)
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg border-2 rounded-3"
                    placeholder="Enter name or leave blank for anonymous"
                    value={form.name}
                    onChange={handleChange}
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Age Field *
                <div className="mb-4">
                  <label className="form-label text-dark fw-medium d-flex align-items-center">
                    <Calendar size={16} className="me-2" />
                    Girl's Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    className="form-control form-control-lg border-2 rounded-3"
                    placeholder="Age of the girl at risk"
                    value={form.age}
                    onChange={handleChange}
                    min="1"
                    max="25"
                    required
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Region Field *
                <div className="mb-4">
                  <label className="form-label text-dark fw-medium d-flex align-items-center">
                    <Globe size={16} className="me-2" />
                    Location/Region *
                  </label>
                  <select
                    name="region"
                    className="form-select form-select-lg border-2 rounded-3"
                    value={form.region}
                    onChange={handleRegionChange}
                    required
                    style={{ fontSize: '16px' }}
                  >
                    <option value="">Select location</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Northern">Northern</option>
                    <option value="Western">Western</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Central">Central</option>
                    <option value="Volta">Volta</option>
                    <option value="Upper East">Upper East</option>
                    <option value="Upper West">Upper West</option>
                    <option value="Brong Ahafo">Brong Ahafo</option>
                  </select>
                </div>

                {/* Phone Number Field *
                <div className="mb-4">
                  <label className="form-label text-dark fw-medium d-flex align-items-center">
                    <Phone size={16} className="me-2" />
                    Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    className="form-control form-control-lg border-2 rounded-3"
                    placeholder="Leave blank to remain anonymous"
                    value={form.contact}
                    onChange={handleChange}
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Additional Information Field *
                <div className="mb-4">
                  <label className="form-label text-dark fw-medium d-flex align-items-center">
                    <MessageCircle size={16} className="me-2" />
                    Child Marriage Details *
                  </label>
                  <textarea
                    name="moreInfo"
                    className="form-control form-control-lg border-2 rounded-3"
                    rows="4"
                    placeholder="Please provide details: Is the marriage planned or already happened? Who is involved? When? Any other important information..."
                    value={form.moreInfo}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '16px', resize: 'none' }}
                  />
                </div>

                {/* Agent Selection - Only show if region is selected and agents are available *
                {agents.length > 0 && (
                  <>
                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium">
                        Select Child Protection Officer *
                      </label>
                      <select
                        className="form-select form-select-lg border-2 rounded-3"
                        value={selectedAgent ? selectedAgent.phone : ''}
                        onChange={(e) => setSelectedAgent(agents.find(a => a.phone === e.target.value))}
                        required
                        style={{ fontSize: '16px' }}
                      >
                        <option value="">-- Select Officer --</option>
                        {agents.map(agent => (
                          <option key={agent.phone} value={agent.phone}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-dark fw-medium">
                        Send Report Via:
                      </label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="channel"
                            id="whatsapp"
                            value="whatsapp"
                            checked={channel === 'whatsapp'}
                            onChange={(e) => setChannel(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="whatsapp">
                            <i className="bi bi-whatsapp text-success me-1"></i>
                            WhatsApp
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="channel"
                            id="telegram"
                            value="telegram"
                            checked={channel === 'telegram'}
                            onChange={(e) => setChannel(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="telegram">
                            <i className="bi bi-telegram text-info me-1"></i>
                            Telegram
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button *
            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-3"
                disabled={isSubmitting}
                style={{ fontSize: '16px', padding: '12px' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Submitting Report...
                  </>
                ) : (
                  'Submit Child Marriage Report'
                )}
              </button>
            </div>

            {/* Success/Error Message *
            {success && (
              <div className={`alert ${success.includes('Failed') ? 'alert-danger' : 'alert-info'} border-0 shadow-sm`}>
                {success}
              </div>
            )}
          </form>

          {/* Info Banner *
          <div className="alert alert-info border-0 shadow-sm">
            <div className="d-flex align-items-start">
              <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
              <div>
                <div className="fw-medium small">Anonymous Reporting Available</div>
                <div style={{ fontSize: '12px' }} className="text-muted">
                  You can submit this report without providing your name or contact information.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FormPage;