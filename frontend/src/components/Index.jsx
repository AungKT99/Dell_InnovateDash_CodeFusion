import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';

const Index = () => {
  return (
    <div>
      <Header />

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Your Health Journey Starts Here</h1>
            <p>Empower+ guides you with personalized steps, emotional motivation, and social support. Start transforming your health today.</p>
            <div className="hero-buttons">
              <Link to="/onboarding" className="start-btn">Start My Journey</Link>
              <Link to="/faq" className="learn-btn">Learn More</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/illustration-health.png" alt="Health Illustration" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <img src="/assets/target-icon.png" alt="Personalized Plan Icon" className="feature-img" />
          <h3>Personalized Plan</h3>
          <p>Get a 7 day journey tailored to your habits, mindset, and wellness level.</p>
        </div>
        <div className="feature-card">
          <img src="/assets/mail-icon.png" alt="Emotional Nudges Icon" className="feature-img" />
          <h3>Emotional Nudges</h3>
          <p>Stay motivated with reminders that resonate—like family, freedom, and the future.</p>
        </div>
        <div className="feature-card">
          <img src="/assets/group-icon.png" alt="Group Challenges Icon" className="feature-img" />
          <h3>Group Challenges</h3>
          <p>Form wellness circles, invite friends, and unlock achievement badges together.</p>
        </div>
      </section>

      <footer>
        &copy; 2025 Empower+ | Made with ❤️ for Singapore Cancer Society
      </footer>
    </div>
  );
};

export default Index; 