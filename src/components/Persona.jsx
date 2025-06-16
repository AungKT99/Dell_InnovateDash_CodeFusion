import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/persona.css';

const Persona = () => {
  return (
    <div>
      <header>
        <div className="logo">Empower+</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/community">Community</Link>
          <Link to="/challenges">Challenges</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="persona-card">
          <h1>You are a <span className="highlight">Curious Explorer</span> 🧭</h1>

          <div className="persona-image">
            <img src="/assets/curious-explorer.png" alt="Curious Explorer Persona" />
          </div>

          <p className="description">
            You're open to change, eager to learn more, and ready to take small steps toward a healthier lifestyle.
            Keep exploring your health journey with curiosity and confidence!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Persona; 