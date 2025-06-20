import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/onboarding.css';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    healthGoals: [],
    experience: ''
  });
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHealthGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      healthGoals: prev.healthGoals.includes(goal)
        ? prev.healthGoals.filter(g => g !== goal)
        : [...prev.healthGoals, goal]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/persona');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Welcome to Empower+</h2>
            <p>Let's get to know you better to personalize your health journey.</p>
            <div className="form-group">
              <label>What's your name?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Basic Information</h2>
            <p>This helps us provide personalized recommendations.</p>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Health Goals</h2>
            <p>What are your main health goals? (Select all that apply)</p>
            <div className="goals-grid">
              {[
                'Improve fitness',
                'Better nutrition',
                'Mental wellness',
                'Preventive care',
                'Weight management',
                'Stress reduction'
              ].map(goal => (
                <button
                  key={goal}
                  className={`goal-btn ${formData.healthGoals.includes(goal) ? 'selected' : ''}`}
                  onClick={() => handleHealthGoalToggle(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <h2>Experience Level</h2>
            <p>How would you describe your current health journey?</p>
            <div className="experience-options">
              {[
                { value: 'beginner', label: 'Just starting out', desc: 'New to health tracking' },
                { value: 'intermediate', label: 'Some experience', desc: 'Have tried health apps before' },
                { value: 'advanced', label: 'Health enthusiast', desc: 'Regularly track health metrics' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`experience-btn ${formData.experience === option.value ? 'selected' : ''}`}
                  onClick={() => handleInputChange('experience', option.value)}
                >
                  <h3>{option.label}</h3>
                  <p>{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Header />

      <main className="onboarding-page">
        <div className="onboarding-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>

          <div className="onboarding-content">
            {renderStep()}
          </div>

          <div className="onboarding-actions">
            {currentStep > 1 && (
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
            )}
            <button 
              onClick={nextStep} 
              className="btn-primary"
              disabled={
                (currentStep === 1 && !formData.name) ||
                (currentStep === 2 && (!formData.age || !formData.gender)) ||
                (currentStep === 3 && formData.healthGoals.length === 0) ||
                (currentStep === 4 && !formData.experience)
              }
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding; 