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
    { id: "smoking", icon: "\uD83D\uDEAC", name: "Smoking", points: 2, description: "Daily smoker (10+ cigarettes)", severity: "high" },
    { id: "poor_diet", icon: "\uD83C\uDF54", name: "Poor Diet", points: 2, description: "High processed food intake", severity: "high" },
    { id: "no_exercise", icon: "\uD83C\uDFC3", name: "No Exercise", points: 1, description: "Less than 30 mins/week", severity: "medium" },
    { id: "family_history", icon: "\uD83E\uDDEC", name: "Family History", points: 2, description: "Parent with colorectal cancer", severity: "medium" }
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

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: 'Risk Assessment', icon: AlertTriangle, component: <CancerRiskAssessment /> },
    { id: 1, name: 'Section 2', icon: Activity, component: <div className="bg-white rounded-xl shadow-lg p-6 h-full"><h2 className="text-xl font-bold text-gray-900 mb-4">Section 2</h2><p className="text-gray-600">Content for second section will go here</p></div> },
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
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Section 2</h2>
              <p className="text-gray-600">Content for second section will go here</p>
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
