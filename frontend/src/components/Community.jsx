import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/community.css';

const Community = () => {
  const [selectedArea, setSelectedArea] = useState('Sengkang');
  const [friendEmail, setFriendEmail] = useState('');

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    // Add invite logic here
    console.log('Inviting:', friendEmail);
    setFriendEmail('');
  };

  return (
    <div>
      <Header />

      <main>
        <section className="community-header">
          <h1>🌟 Welcome to Your Empower+ Community</h1>
          <p>See what others are doing, track your buddy progress, and earn badges together!</p>
        </section>

        <section className="community-page">
          <div className="card pledge-card">
            <h2>🧱 Pledge Wall</h2>
            <div className="pledge-list">
              <div className="pledge">
                Marcus T. – Yishun <span className="quote">"I pledged because I care about my family."</span>
              </div>
              <div className="pledge">
                Anonymized – Sengkang <span className="quote">"Early detection saves lives."</span>
              </div>
              <button>Make a Pledge</button>
            </div>
          </div>

          <div className="card counter-card">
            <h2>🚀 This Week</h2>
            <p><strong>35 people in {selectedArea} pledged this week</strong></p>
            <select value={selectedArea} onChange={handleAreaChange}>
              <option>Sengkang</option>
              <option>Yishun</option>
              <option>Bukit Batok</option>
            </select>
          </div>

          <div className="card leaderboard">
            <h2>🏆 Leaderboard</h2>
            <div className="leader">
              <img src="/assets/duo-profile.png" className="avatar" alt="Leader avatar" />
              <div>
                <strong>Jamie</strong><br /> 
                Streak: 6 days<br /> 
                ☕ Progress: ████▁ (4/7)
              </div>
            </div>
          </div>

          <div className="card duo-card">
            <h2>🫲 Wellness Duo</h2>
            <div className="duo-details">
              <img src="/assets/duo-profile.png" className="avatar" alt="Duo avatar" />
              <div>
                <strong>You & Jamie</strong><br />
                🔥 Duo Streak: 3 days<br />
                🏆 Shared Challenge: 7-Day Water Challenge<br />
                ███▁▁ (3/7)
              </div>
            </div>
            <div className="duo-actions">
              <button>Send Nudge</button>
              <button className="outline">View Progress</button>
            </div>
          </div>

          <div className="card badge-card">
            <h2>🪪 Badge Progress</h2>
            <p>Community Builder: <strong>60%</strong></p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
            <p className="tip">Refer 1 more friend to unlock!</p>
          </div>

          <div className="card referral-card">
            <h2>📨 Invite Friends</h2>
            <p>You've referred <strong>3 friends</strong> this month</p>
            <form onSubmit={handleInvite}>
              <input 
                type="email" 
                placeholder="Enter friend's email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
              />
              <button type="submit">Send Invite</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Community; 