import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/persona.css';

const Persona = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const navigate = useNavigate();

  const personas = [
    {
      id: 'curious-explorer',
      name: 'Curious Explorer',
      emoji: '🧭',
      description: 'You\'re eager to learn and try new things. You value knowledge and discovery.',
      traits: ['Inquisitive', 'Open-minded', 'Knowledge-seeking'],
      color: '#4F46E5'
    },
    {
      id: 'steady-achiever',
      name: 'Steady Achiever',
      emoji: '🎯',
      description: 'You prefer consistent progress and measurable results. You\'re goal-oriented.',
      traits: ['Goal-focused', 'Consistent', 'Results-driven'],
      color: '#059669'
    },
    {
      id: 'social-connector',
      name: 'Social Connector',
      emoji: '🤝',
      description: 'You thrive on community and relationships. You\'re motivated by helping others.',
      traits: ['Community-minded', 'Supportive', 'Relationship-focused'],
      color: '#DC2626'
    },
    {
      id: 'mindful-reflector',
      name: 'Mindful Reflector',
      emoji: '🧘',
      description: 'You value introspection and balance. You prefer thoughtful, deliberate actions.',
      traits: ['Reflective', 'Balanced', 'Mindful'],
      color: '#7C3AED'
    }
  ];

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
  };

  const handleContinue = () => {
    if (selectedPersona) {
      // Here you would typically save the persona selection to user profile
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <Header />

      <main className="persona-page">
        <div className="persona-container">
          <div className="persona-header">
            <h1>Discover Your Wellness Persona</h1>
            <p>Understanding your personality helps us tailor your health journey to your unique style.</p>
          </div>

          <div className="persona-grid">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className={`persona-card ${selectedPersona?.id === persona.id ? 'selected' : ''}`}
                onClick={() => handlePersonaSelect(persona)}
                style={{
                  borderColor: selectedPersona?.id === persona.id ? persona.color : 'transparent'
                }}
              >
                <div className="persona-emoji">{persona.emoji}</div>
                <h3>{persona.name}</h3>
                <p>{persona.description}</p>
                <div className="persona-traits">
                  {persona.traits.map((trait, index) => (
                    <span key={index} className="trait-tag">{trait}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="persona-actions">
            <button
              onClick={handleContinue}
              className="continue-btn"
              disabled={!selectedPersona}
            >
              Continue to Dashboard
            </button>
            <p className="persona-note">
              Don't worry - you can change your persona anytime in your profile settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Persona; 