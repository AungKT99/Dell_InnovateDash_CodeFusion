<<<<<<< HEAD
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/styles.css';
import '../styles/onboarding.css';


const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    smoking: '',
    diet: '',
    physicalActivity: '',
    familyHistory: '',
    screeningAttitude: '',
    motivation: '',
    healthApproach: ''
  });

  const handleOptionSelect = (question, value) => {
    setFormData(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div>
      <Header />

      <div className="onboarding-box">
        <h2>Let's personalize your wellness journey</h2>

        {/* Step 1 */}
        <div className={`step ${currentStep === 1 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>What is your age group?</strong>
            <div className="options">
              {['Under 25', '25–34', '35–44', '45–54', '55–64'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.ageGroup === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('ageGroup', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="question">
            <strong>What is your gender?</strong>
            <div className="options">
              {['Male', 'Female', 'Prefer not to say'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.gender === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('gender', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`step ${currentStep === 2 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>Do you currently smoke?</strong>
            <div className="options">
              {['Yes', 'Occasionally', 'No'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.smoking === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('smoking', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>How often do you consume fruits and vegetables?</strong>
            <div className="options">
              {['Rarely', '1–2 servings a day', '3+ servings a day'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.diet === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('diet', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>How many days a week are you physically active (30 min or more)?</strong>
            <div className="options">
              {['0 days', '1–2 days', '3–5 days', '6+ days'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.physicalActivity === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('physicalActivity', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`step ${currentStep === 3 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>Has anyone in your immediate family been diagnosed with cancer?</strong>
            <div className="options">
              {['Yes', 'No', 'Not sure'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.familyHistory === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('familyHistory', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`step ${currentStep === 4 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>How do you currently feel about going for health screenings?</strong>
            <div className="options">
              {[
                'I avoid them—better not to know',
                'I procrastinate',
                'I need reminders',
                'I go regularly'
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.screeningAttitude === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('screeningAttitude', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>What motivates you most to stay healthy?</strong>
            <div className="options">
              {[
                'My family and loved ones',
                'My future goals and career',
                'My independence and freedom',
                "I don't think much about it"
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.motivation === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('motivation', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>Which statement best describes your current approach to health?</strong>
            <div className="options">
              {[
                "I don't think about it unless something's wrong",
                'I want to start taking better care',
                "I'm taking small steps",
                'I actively track and improve'
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.healthApproach === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('healthApproach', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="buttons">
          <button 
            className="btn" 
            onClick={prevStep}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            ← Back
          </button>
          <button 
            className="btn" 
            onClick={nextStep}
            style={{ visibility: currentStep === 4 ? 'hidden' : 'visible' }}
          >
            Next →
          </button>
          {currentStep === 4 && (
            <Link to="/persona" className="btn">
              Complete →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/onboarding.css';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    smoking: '',
    diet: '',
    physicalActivity: '',
    familyHistory: '',
    screeningAttitude: '',
    motivation: '',
    healthApproach: ''
  });

  const handleOptionSelect = (question, value) => {
    setFormData(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
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

      <div className="onboarding-box">
        <h2>Let's personalize your wellness journey</h2>

        {/* Step 1 */}
        <div className={`step ${currentStep === 1 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>What is your age group?</strong>
            <div className="options">
              {['Under 25', '25–34', '35–44', '45–54', '55–64'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.ageGroup === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('ageGroup', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <div className="question">
            <strong>What is your gender?</strong>
            <div className="options">
              {['Male', 'Female', 'Prefer not to say'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.gender === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('gender', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`step ${currentStep === 2 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>Do you currently smoke?</strong>
            <div className="options">
              {['Yes', 'Occasionally', 'No'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.smoking === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('smoking', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>How often do you consume fruits and vegetables?</strong>
            <div className="options">
              {['Rarely', '1–2 servings a day', '3+ servings a day'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.diet === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('diet', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>How many days a week are you physically active (30 min or more)?</strong>
            <div className="options">
              {['0 days', '1–2 days', '3–5 days', '6+ days'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.physicalActivity === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('physicalActivity', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`step ${currentStep === 3 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>Has anyone in your immediate family been diagnosed with cancer?</strong>
            <div className="options">
              {['Yes', 'No', 'Not sure'].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.familyHistory === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('familyHistory', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`step ${currentStep === 4 ? '' : 'hidden'}`}>
          <div className="question">
            <strong>How do you currently feel about going for health screenings?</strong>
            <div className="options">
              {[
                'I avoid them—better not to know',
                'I procrastinate',
                'I need reminders',
                'I go regularly'
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.screeningAttitude === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('screeningAttitude', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>What motivates you most to stay healthy?</strong>
            <div className="options">
              {[
                'My family and loved ones',
                'My future goals and career',
                'My independence and freedom',
                "I don't think much about it"
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.motivation === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('motivation', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className="question">
            <strong>Which statement best describes your current approach to health?</strong>
            <div className="options">
              {[
                "I don't think about it unless something's wrong",
                'I want to start taking better care',
                "I'm taking small steps",
                'I actively track and improve'
              ].map(option => (
                <div 
                  key={option}
                  className={`option ${formData.healthApproach === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('healthApproach', option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="buttons">
          <button 
            className="btn" 
            onClick={prevStep}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            ← Back
          </button>
          <button 
            className="btn" 
            onClick={nextStep}
            style={{ visibility: currentStep === 4 ? 'hidden' : 'visible' }}
          >
            Next →
          </button>
          {currentStep === 4 && (
            <Link to="/persona" className="btn">
              Complete →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

>>>>>>> harshitha/aichatbot
export default Onboarding; 