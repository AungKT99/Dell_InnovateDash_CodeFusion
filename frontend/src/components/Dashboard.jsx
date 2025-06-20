import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, TrendingUp, ChevronRight, Activity, Target } from 'lucide-react';
import Header from './Header';
import '../styles/styles.css';
import '../styles/dashboard.css';

const CancerRiskData = {
  userProfile: {
    name: "Sarah Chen",
    age: 45,
    gender: "Female"
  },
  riskScore: {
    current: 72,
    maximum: 100,
    level: "HIGH RISK",
    percentage: 72
  },
  riskBreakdown: [
    { id: "smoking", icon: "\uD83D\uDEAC", name: "Smoking", points: 25, description: "Daily smoker (10+ cigarettes)", severity: "high" },
    { id: "poor_diet", icon: "\uD83C\uDF54", name: "Poor Diet", points: 20, description: "High processed food intake", severity: "high" },
    { id: "no_exercise", icon: "\uD83C\uDFC3", name: "No Exercise", points: 15, description: "Less than 30 mins/week", severity: "medium" },
    { id: "family_history", icon: "\uD83E\uDDEC", name: "Family History", points: 12, description: "Parent with colorectal cancer", severity: "medium" }
  ],
  colors: {
    highRisk: { primary: "#DC2626", light: "#FEF2F2", border: "#FECACA", hover: "#B91C1C" },
    moderateRisk: { primary: "#D97706", light: "#FFF7ED", border: "#FED7AA", hover: "#B45309" },
    lowRisk: { primary: "#059669", light: "#ECFDF5", border: "#A7F3D0", hover: "#047857" }
  },
  uiText: {
    title: "MY CANCER RISK",
    riskBreakdownTitle: "Risk Breakdown:",
    urgencyMessage: "Early screening can significantly reduce your risk",
    primaryButton: "Try Risk Simulator",
    secondaryButton: "Book Screening"
  }
};

const CancerRiskHelpers = {
  getRiskColors: (level) => {
    switch(level) {
      case "HIGH RISK": return CancerRiskData.colors.highRisk;
      case "MODERATE RISK": return CancerRiskData.colors.moderateRisk;
      case "LOW RISK": return CancerRiskData.colors.lowRisk;
      default: return CancerRiskData.colors.highRisk;
    }
  }
};

const CancerRiskAssessment = () => {
  const [riskScore, setRiskScore] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const userRiskScore = CancerRiskData.riskScore.current;
  const userRiskLevel = CancerRiskData.riskScore.level;
  const riskFactors = CancerRiskData.riskBreakdown;
  const riskColors = CancerRiskHelpers.getRiskColors(userRiskLevel);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsLoaded(true);
      let current = 0;
      const target = userRiskScore;
      const increment = target / 30;
      const scoreAnimation = setInterval(() => {
        current += increment;
        if (current >= target) {
          setRiskScore(target);
          clearInterval(scoreAnimation);
          setTimeout(() => setProgressWidth(target), 200);
        } else {
          setRiskScore(Math.floor(current));
        }
      }, 50);
    }, 300);
    return () => clearTimeout(timer1);
  }, [userRiskScore]);

  return (
    <div className="cancer-risk-card">
      {/* Risk Header */}
      <div className="risk-header">
        <div className="risk-header-bg">
          <div className="risk-header-content">
            <h2 className="risk-title">
              {CancerRiskData.uiText.title}
            </h2>
            
            {/* Main Risk Score */}
            <div className="risk-score-container">
              <div className={`risk-score ${isLoaded ? 'loaded' : ''}`}>
                {riskScore}
                <span className="risk-score-max">
                  /{CancerRiskData.riskScore.maximum}
                </span>
              </div>
              
              {/* Pulsing warning icon */}
              <div className="risk-warning-icon">
                <AlertTriangle className="warning-icon" />
              </div>
            </div>

            {/* Risk Level Label */}
            <div className="risk-level">
              <AlertTriangle className="level-icon" />
              <span className="level-text">{userRiskLevel}</span>
              <AlertTriangle className="level-icon" />
            </div>

            {/* Progress Bar */}
            <div className="risk-progress-container">
              <div className="risk-progress-bar">
                <div 
                  className="risk-progress-fill"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Breakdown Section */}
      <div className="risk-content">
        <h3 className="risk-breakdown-title">
          <TrendingUp className="breakdown-icon" />
          Risk Factors
        </h3>
        
        <div className="risk-factors-list">
          {riskFactors.slice(0, 3).map((factor, index) => (
            <div 
              key={factor.id} 
              className={`risk-factor-item ${isLoaded ? 'loaded' : ''}`}
              style={{ transitionDelay: `${index * 100 + 800}ms` }}
            >
              <div className="factor-info">
                <span className="factor-icon">{factor.icon}</span>
                <div className="factor-details">
                  <div className="factor-name">
                    {factor.name}
                  </div>
                  <div className="factor-description">
                    {factor.description}
                  </div>
                </div>
              </div>
              <div className="factor-points">
                +{factor.points}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="risk-actions">
          {/* Primary CTA - Risk Simulator */}
          <button className="risk-btn primary">
            <span>{CancerRiskData.uiText.primaryButton}</span>
            <ChevronRight className="btn-icon" />
          </button>
          
          {/* Secondary CTA - Book Screening */}
          <button className="risk-btn secondary">
            <span>{CancerRiskData.uiText.secondaryButton}</span>
            <ChevronRight className="btn-icon" />
          </button>
        </div>
        
        {/* Urgency message */}
        <div className="risk-urgency">
          <p className="urgency-text">
            <AlertTriangle className="urgency-icon" />
            {CancerRiskData.uiText.urgencyMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

const RiskReductionSimulator = () => {
  // Initial values from CancerRiskData
  const initialSmoking = 10; // 10+ cigarettes/day
  const initialExercise = 0; // Never
  const initialDiet = 0; // Poor

  // Slider state
  const [smoking, setSmoking] = useState(initialSmoking);
  const [exercise, setExercise] = useState(initialExercise);
  const [diet, setDiet] = useState(initialDiet);

  // Risk points from CancerRiskData
  const smokingMaxPoints = 25; // Daily smoker
  const exerciseMaxPoints = 15; // No exercise
  const dietMaxPoints = 20; // Poor diet

  // Calculate reductions
  const smokingReduction = (smokingMaxPoints * (1 - smoking / 10)); // 0 = never, 10 = max
  const exerciseReduction = (exerciseMaxPoints * (exercise / 7)); // 0 = never, 7 = daily
  const dietReduction = (dietMaxPoints * (diet / 10)); // 0 = poor, 10 = healthy

  // Simulated risk score
  const currentRisk = CancerRiskData.riskScore.current;
  const simulatedRisk = Math.round(
    currentRisk - (smokingMaxPoints - smokingReduction) - (exerciseMaxPoints - exerciseReduction) - (dietMaxPoints - dietReduction)
  );
  const totalReduction = currentRisk - simulatedRisk;
  const reductionPercent = Math.round((totalReduction / currentRisk) * 100);

  // Risk level
  let simulatedLevel = 'HIGH RISK';
  if (simulatedRisk < 50) simulatedLevel = 'MODERATE RISK';
  if (simulatedRisk < 30) simulatedLevel = 'LOW RISK';

  return (
    <div className="risk-simulator-card">
      <div className="sim-header">RISK REDUCTION SIMULATOR</div>
      <hr />
      <div className="sim-scores-row">
        <div>
          <div>Current: <b>{currentRisk}</b></div>
          <div className="sim-label">HIGH RISK</div>
        </div>
        <div className="sim-arrow">→</div>
        <div>
          <div>Simulated: <b>{simulatedRisk}</b></div>
          <div className="sim-label">{simulatedLevel}</div>
        </div>
      </div>
      <hr />
      <div className="sim-section-title">Adjust Your Lifestyle:</div>
      <div className="sim-slider-row">
        <div className="sim-slider-label">Smoking</div>
        <input type="range" min="0" max="10" step="0.1" value={smoking} onChange={e => setSmoking(Number(e.target.value))} />
        <div className="sim-slider-value">{smoking === 0 ? 'Never' : smoking === 10 ? '10+/day' : smoking.toFixed(1) + '/day'}</div>
        <div className="sim-points">-{Math.round(smokingMaxPoints - smokingReduction)} pts</div>
      </div>
      <div className="sim-slider-row">
        <div className="sim-slider-label">Exercise</div>
        <input type="range" min="0" max="7" step="0.1" value={exercise} onChange={e => setExercise(Number(e.target.value))} />
        <div className="sim-slider-value">{exercise === 0 ? 'Never' : exercise === 7 ? 'Daily' : exercise.toFixed(1) + 'x/wk'}</div>
        <div className="sim-points">-{Math.round(exerciseMaxPoints - exerciseReduction)} pts</div>
      </div>
      <div className="sim-slider-row">
        <div className="sim-slider-label">Diet</div>
        <input type="range" min="0" max="10" step="0.1" value={diet} onChange={e => setDiet(Number(e.target.value))} />
        <div className="sim-slider-value">{diet === 0 ? 'Poor' : diet === 10 ? 'Healthy' : diet.toFixed(1)}</div>
        <div className="sim-points">-{Math.round(dietMaxPoints - dietReduction)} pts</div>
      </div>
      <hr />
      <div className="sim-total-reduction">Total Reduction: <b>{totalReduction} points ({reductionPercent}%)</b></div>
      <div className="sim-actions">
        <button className="sim-btn">Save as PDF</button>
        <button className="sim-btn">Share Results</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: 'Risk Assessment', icon: AlertTriangle, component: <CancerRiskAssessment /> },
    { id: 1, name: 'Risk Simulator', icon: Activity, component: <RiskReductionSimulator /> },
    { id: 2, name: 'Section 3', icon: Target, component: <div className="bg-white rounded-xl shadow-lg p-6 h-full"><h2 className="text-xl font-bold text-gray-900 mb-4">Section 3</h2><p className="text-gray-600">Content for third section will go here</p></div> }
  ];

  return (
    <div>
      <Header />

      <main className="dashboard">
        <div className="dashboard-container">
          {/* Mobile Tab Navigation */}
          <div className="mobile-tabs">
            <div className="tab-navigation">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent className="tab-icon" />
                    <span className="tab-label">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="desktop-grid">
            <div className="h-full">
              <CancerRiskAssessment />
            </div>
            <div className="h-full">
              <RiskReductionSimulator />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Section 3</h2>
              <p className="text-gray-600">Content for third section will go here</p>
            </div>
          </div>

          {/* Mobile Tab Content */}
          <div className="tab-content">
            <div className="tab-panel">
              {tabs[activeTab].component}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
