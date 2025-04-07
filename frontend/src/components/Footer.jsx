import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AI Twitter Post Generator</h3>
          <p>Generate engaging content for your social media</p>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">GitHub</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} AI Twitter Post Generator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;