import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Optional: Add your styling here

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/stafflogin" className="nav-link">Staff Login</Link>
        </li>
        <li className="nav-item">
          <a href="#about-section" className="nav-link">About</a>
        </li>
        <li className="nav-item">
          <a href="#footer-section" className="nav-link">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;