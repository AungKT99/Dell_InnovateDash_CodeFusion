import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/challenges.css';

const Challenges = () => {
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
    </div>
  );
};

export default Challenges; 