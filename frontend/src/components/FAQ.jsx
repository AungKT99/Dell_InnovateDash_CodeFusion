import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/faq.css';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "What is Empower+?",
      answer: "Empower+ is a health and wellness platform designed to help you take control of your health journey. We provide personalized guidance, community support, and tools to help you make informed decisions about your health."
    },
    {
      question: "How does the 7-day journey work?",
      answer: "The 7-day journey is a personalized health program that guides you through daily tasks and activities. Each day focuses on different aspects of health, from learning about screenings to developing healthy habits."
    },
    {
      question: "What are Wellness Duos?",
      answer: "Wellness Duos are partnerships between two users who support each other in their health journey. You can team up with a friend or be matched with someone who shares similar health goals."
    },
    {
      question: "How do I earn badges?",
      answer: "Badges are earned by completing challenges, participating in community activities, and achieving health milestones. They represent your progress and achievements in your health journey."
    },
    {
      question: "Is my health information private?",
      answer: "Yes, we take your privacy seriously. All health information is encrypted and stored securely. You can choose what information to share with the community and your Wellness Duo."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
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

      <main className="faq-page">
        <h1>Frequently Asked Questions</h1>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openQuestion === index ? 'open' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleQuestion(index)}
              >
                <h3>{faq.question}</h3>
                <span className="toggle-icon">
                  {openQuestion === index ? '−' : '+'}
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2>Still have questions?</h2>
          <p>Contact our support team at support@empowerplus.com</p>
        </div>
      </main>
    </div>
  );
};

export default FAQ; 