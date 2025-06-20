import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/challenges.css';

const Challenges = () => {
  return (
    <div>
      <Header />

      <main>
        <section className="challenges-header">
          <h1>🏆 Challenges</h1>
          <p>Complete challenges to earn badges and track your progress!</p>
        </section>

        <section className="challenges-page">
          <div className="card active-challenge">
            <h2>🔥 Active Challenge</h2>
            <div className="challenge-progress">
              <h3>7-Day Water Challenge</h3>
              <p>Drink 8 glasses of water daily</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <p>Day 4 of 7</p>
            </div>
          </div>

          <div className="card available-challenges">
            <h2>📋 Available Challenges</h2>
            <div className="challenge-list">
              <div className="challenge-item">
                <h3>🚶‍♂️ Walking Challenge</h3>
                <p>Walk 10,000 steps daily for 7 days</p>
                <button>Start Challenge</button>
              </div>
              <div className="challenge-item">
                <h3>🥗 Healthy Eating</h3>
                <p>Eat 5 servings of fruits/vegetables daily</p>
                <button>Start Challenge</button>
              </div>
              <div className="challenge-item">
                <h3>😴 Sleep Well</h3>
                <p>Get 8 hours of sleep for 5 days</p>
                <button>Start Challenge</button>
              </div>
            </div>
          </div>

          <div className="card completed-challenges">
            <h2>✅ Completed Challenges</h2>
            <div className="completed-list">
              <div className="completed-item">
                <h3>🧘‍♀️ Meditation Challenge</h3>
                <p>Completed on March 15, 2024</p>
                <span className="badge">🏆</span>
              </div>
              <div className="completed-item">
                <h3>💧 Hydration Challenge</h3>
                <p>Completed on March 10, 2024</p>
                <span className="badge">🏆</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Challenges; 