
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/styles.css';
import '../styles/profile.css';

const Profile = () => {

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
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

      <main className="profile-page">
        {/* User Header */}
        <section className="profile-header">
          <img src="/assets/curious-explorer.png" alt="Persona" className="profile-pic" />
          <h1 className="username">Jamie Tan</h1>
          <p className="persona-label">Persona: Curious Explorer 🧭</p>

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
          Log Out
          </button>
        </section>

        {/* Badge Gallery */}
        <section className="badge-gallery">
          <h2>Full Badge Gallery</h2>
          <div className="badge-grid">
            {/* Earned */}
            <div className="badge">
              <img src="/assets/badge-1.png" alt="Silent Risk Fighter" />
              <p>Silent Risk Fighter</p>
            </div>
            {/* Locked */}
            <div className="badge">
              <img src="/assets/badge-2.png" alt="Community Builder" />
              <p>Community Builder</p>
            </div>
            {/* Add more badges as needed */}
          </div>
        </section>

        {/* History & Stats */}
        <section className="history-stats">
          <h2>Screening History & Pledges</h2>
          <ul className="stats-list">
            <li>🩺 Screenings Completed: <strong>2</strong></li>
            <li>📣 Public Pledges Made: <strong>3</strong></li>
            <li>✅ Daily Challenges Completed: <strong>15</strong></li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Profile; 
