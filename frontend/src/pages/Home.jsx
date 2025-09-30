import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mic, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import './Home.css'; // Import the CSS file

const Home = () => (
  <div className="mobile-container">
    {/* Status Bar */}
    <div className="status-bar">
      <span>9:41</span>
      <div className="carrier-info">
        <span>•••</span>
        <span>Girls Deck</span>
      </div>
      <span>100%</span>
    </div>

    {/* Blue Header Section */}
    <div className="header-section">
      {/* App Icon */}
      <div className="app-icon-container">
        <div className="app-icon">
          <AlertCircle className="icon-large" />
        </div>
      </div>
      
      {/* App Title */}
      <h1 className="app-title">Girls Deck</h1>
      <p className="app-subtitle">Report child marriage. Protect a girl's future.</p>
    </div>

    {/* White Content Section */}
    <div className="content-section">
      {/* Main Title */}
      <h2 className="main-title">How can we help?</h2>
      
      {/* Option Cards */}
      <div className="options-container">
        {/* Fill Form */}
        <Link to="/form" className="option-card option-card-blue">
          <div className="option-content">
            <div className="option-left">
              <div className="option-icon option-icon-blue">
                <FileText className="icon-medium" />
              </div>
              <div className="option-text">
                <h3 className="option-title">Fill Form</h3>
                <p className="option-description">Complete a detailed report form</p>
              </div>
            </div>
            <ArrowRight className="arrow-icon" />
          </div>
        </Link>

        {/* Record Audio */}
        <Link to="/record" className="option-card option-card-green">
          <div className="option-content">
            <div className="option-left">
              <div className="option-icon option-icon-green">
                <Mic className="icon-medium" />
              </div>
              <div className="option-text">
                <h3 className="option-title">Record Audio</h3>
                <p className="option-description">Send a voice message</p>
              </div>
            </div>
            <ArrowRight className="arrow-icon" />
          </div>
        </Link>

        {/* Contact Agent */}
        <Link to="/contact" className="option-card option-card-purple">
          <div className="option-content">
            <div className="option-left">
              <div className="option-icon option-icon-purple">
                <Phone className="icon-medium" />
              </div>
              <div className="option-text">
                <h3 className="option-title">Contact Agent</h3>
                <p className="option-description">Call or chat with local agents</p>
              </div>
            </div>
            <ArrowRight className="arrow-icon" />
          </div>
        </Link>
      </div>

      {/* Emergency Banner */}
      <div className="emergency-banner">
        <AlertCircle className="emergency-icon" />
        <div className="emergency-text">
          <p className="emergency-title">Immediate Danger?</p>
          <p className="emergency-subtitle">Call Police: 999 or Social Services</p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p className="footer-main">Available 24/7 • Anonymous Reporting • Child Protection</p>
        <div className="footer-features">
          <span>✓ Confidential</span>
          <span>✓ Safe</span>
          <span>✓ Professional</span>
        </div>
      </div>
    </div>
  </div>
);

export default Home;


