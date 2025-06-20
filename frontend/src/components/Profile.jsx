import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Header />

      <main>
        <section className="profile-header">
          <div className="profile-info">
            <img src="/assets/duo-profile.png" alt="Profile" className="profile-avatar" />
            <div>
              <h1>Sarah Chen</h1>
              <p>Member since March 2024</p>
              <div className="badges">
                <span className="badge">🏆</span>
                <span className="badge">🔥</span>
                <span className="badge">⭐</span>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="card stats-card">
                  <h2>📊 Your Stats</h2>
                  <div className="stats-grid">
                    <div className="stat">
                      <h3>7</h3>
                      <p>Challenges Completed</p>
                    </div>
                    <div className="stat">
                      <h3>24</h3>
                      <p>Days Active</p>
                    </div>
                    <div className="stat">
                      <h3>3</h3>
                      <p>Friends Referred</p>
                    </div>
                  </div>
                </div>

                <div className="card recent-activity">
                  <h2>🕒 Recent Activity</h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">🏆</span>
                      <div>
                        <p>Completed Water Challenge</p>
                        <small>2 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">👥</span>
                      <div>
                        <p>Referred Jamie to Empower+</p>
                        <small>1 day ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">🎯</span>
                      <div>
                        <p>Started Walking Challenge</p>
                        <small>3 days ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="achievements-tab">
                <div className="card achievements-grid">
                  <h2>🏅 Achievements</h2>
                  <div className="achievement-list">
                    <div className="achievement unlocked">
                      <span className="achievement-icon">🏆</span>
                      <h3>First Challenge</h3>
                      <p>Complete your first challenge</p>
                    </div>
                    <div className="achievement unlocked">
                      <span className="achievement-icon">🔥</span>
                      <h3>Streak Master</h3>
                      <p>Maintain a 7-day streak</p>
                    </div>
                    <div className="achievement locked">
                      <span className="achievement-icon">⭐</span>
                      <h3>Community Builder</h3>
                      <p>Refer 5 friends</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <div className="card settings-form">
                  <h2>⚙️ Settings</h2>
                  <form>
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" defaultValue="Sarah Chen" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue="sarah@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Notifications</label>
                      <select defaultValue="all">
                        <option value="all">All notifications</option>
                        <option value="important">Important only</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <button type="submit" className="save-btn">Save Changes</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;