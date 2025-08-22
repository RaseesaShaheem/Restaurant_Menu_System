import React from 'react';
import './Footer.css'; // Optional: Add your styling here

const Footer = () => {
  return (
    <footer id="footer-section">
      <div className="footer-content">
        <h3>Contact Us</h3>
        <p>Phone: +123 456 7890</p>
        <p>Email: info@thebistrofood.com</p>
        <p>Address: 123 Bistro Lane, Food City, FC 12345</p>
        
        <div className="social-media">
          <h4>Follow Us</h4>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/twitter-icon.png" alt="Twitter" className="social-icon" />
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp-icon.png" alt="WhatsApp" className="social-icon" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/instagram-icon.png" alt="Instagram" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;