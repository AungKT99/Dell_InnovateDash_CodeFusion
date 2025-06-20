import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/faq.css';

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What is Empower+?",
      answer: "Empower+ is a comprehensive health and wellness platform designed to encourage early cancer screening and promote healthy lifestyle habits. We combine education, community support, and gamification to make health management engaging and accessible."
    },
    {
      id: 2,
      question: "How does the risk assessment work?",
      answer: "Our risk assessment tool evaluates various factors including age, family history, lifestyle choices, and medical history to provide personalized risk scores. This helps identify individuals who would benefit most from early screening."
    },
    {
      id: 3,
      question: "Are my health data and information secure?",
      answer: "Yes, we take data security very seriously. All personal health information is encrypted and stored securely. We follow strict privacy guidelines and never share your data without explicit consent."
    },
    {
      id: 4,
      question: "How do I earn badges and rewards?",
      answer: "You can earn badges by completing challenges, participating in community activities, referring friends, and maintaining healthy habits. Each badge represents a milestone in your wellness journey."
    },
    {
      id: 5,
      question: "Can I invite friends and family?",
      answer: "Absolutely! We encourage you to invite friends and family to join Empower+. You can earn special rewards for referrals, and it's a great way to support each other's health goals."
    },
    {
      id: 6,
      question: "What if I need to schedule a screening?",
      answer: "Our platform can help you find nearby screening facilities and schedule appointments. We also provide reminders and support throughout the screening process."
    }
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div>
      <Header />

      <main>
        <section className="faq-header">
          <h1>❓ Frequently Asked Questions</h1>
          <p>Find answers to common questions about Empower+</p>
        </section>

        <section className="faq-content">
          <div className="faq-list">
            {faqItems.map((item) => (
              <div key={item.id} className={`faq-item ${openItem === item.id ? 'open' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleItem(item.id)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{openItem === item.id ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-section">
            <h2>Still have questions?</h2>
            <p>Can't find what you're looking for? Contact our support team.</p>
            <div className="contact-options">
              <a href="mailto:support@empowerplus.com" className="contact-btn">
                📧 Email Support
              </a>
              <a href="tel:+1234567890" className="contact-btn">
                📞 Call Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQ; 