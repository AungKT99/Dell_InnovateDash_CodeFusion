
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
              <Link to="/LifeStyleQuiz" className="start-btn">Start My Journey</Link>
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
          <img src="/assets/target-icon.png" alt="Risk Assessment Icon" className="feature-img" />
          <h3>Risk Assessment</h3>
          <p>Take our comprehensive lifestyle quiz to understand your personalized cancer risk factors and get actionable insights.</p>
        </div>
        <div className="feature-card">
          <img src="/assets/mail-icon.png" alt="Knowledge Quiz Icon" className="feature-img" />
          <h3>Knowledge Quiz</h3>
          <p>Test your cancer awareness with our interactive quiz and learn essential facts about prevention and early detection.</p>
        </div>
        <div className="feature-card">
          <img src="/assets/group-icon.png" alt="Screening Recommendations Icon" className="feature-img" />
          <h3>Screening Recommendations</h3>
          <p>Get personalized screening suggestions based on your risk profile with direct links to healthcare providers.</p>
        </div>
      </section>

      <footer>
        &copy; 2025 Empower+ | Made with ❤️ for Singapore Cancer Society
      </footer>
    </div>
  );
};

export default Index; 
