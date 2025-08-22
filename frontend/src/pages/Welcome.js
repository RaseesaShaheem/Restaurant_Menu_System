import React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import './Welcome.css'; // External CSS for styling
import Footer from './Footer';
const Welcome = () => {
    const navigate = useNavigate(); 
    const handleBookTableClick = () => {
        navigate("/menu");
    };
    
return (
<div className="welcome-container">
    <NavBar/>
{/* Hero Section */}
<section className="hero-section">
<div className="overlay">
<div className="hero-content">
<h1 className="restaurant-name">The Bistro Food</h1>
<button onClick={handleBookTableClick} className="book-btn">Go To Menu</button>
</div>
</div>
</section>
<section id="about-section" className="about-section">
<h2>About Us</h2>
        <p className="about-intro">
          Welcome to <strong>Our Restaurant</strong>, where culinary artistry meets a passion for exceptional dining.
          We take pride in serving delicious dishes crafted from the freshest ingredients.
        </p>

        <div className="about-content">
          <div className="about-item">
            <h3>Our Mission</h3>
            <p className="desc">
              Our mission is to create memorable dining experiences through innovative recipes, quality ingredients,
              and warm hospitality.
            </p>
          </div>

          <div className="about-item">
            <h3>What We Offer</h3>
            <ul>
              <li>Diverse menu inspired by global and local cuisines</li>
              <li>Fresh and high-quality ingredients</li>
              <li>Exceptional service and dining experience</li>
            </ul>
          </div>

          <div className="about-item">
            <h3>Why Choose Us?</h3>
            <p>
              From a cozy ambiance to special diet options like vegetarian, vegan, and gluten-free dishes,
              we ensure every visit is a cherished memory. Nutritional transparency is our priority.
            </p>
          </div>
        </div>
</section>
 <section id="footer-section" className="footer-section">   
       <Footer/>
       </section>    
</div>
);
};

export default Welcome;