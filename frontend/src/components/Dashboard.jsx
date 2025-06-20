// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, TrendingUp, ChevronRight, Activity, Target, Loader2, Heart } from 'lucide-react';
import { getDashboardRiskData } from '../api/dashboardApi';
import Header from './Header';
import '../styles/styles.css';
import '../styles/dashboard.css';

const CancerRiskHelpers = {
  getRiskColors: (level, colors) => {
    if (!colors) {
      // Fallback colors if API doesn't return colors
      const fallbackColors = {
        highRisk: { primary: "#DC2626", light: "#FEF2F2", border: "#FECACA", hover: "#B91C1C" },
        moderateRisk: { primary: "#D97706", light: "#FFF7ED", border: "#FED7AA", hover: "#B45309" },
        lowRisk: { primary: "#059669", light: "#ECFDF5", border: "#A7F3D0", hover: "#047857" }
      };
      colors = fallbackColors;
    }
    
    switch(level) {
      case "HIGH RISK": return colors.highRisk;
      case "MODERATE RISK": return colors.moderateRisk;
      case "LOW RISK": return colors.lowRisk;
      default: return colors.highRisk;
    }
  }
};

const CancerRiskAssessment = () => {
  const [riskScore, setRiskScore] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [CancerRiskData, setCancerRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasQuizData, setHasQuizData] = useState(false);

  // Fetch dashboard risk data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardRiskData();
        
        if (response.success && response.hasQuizData) {
          // Transform backend data to match your original CancerRiskData structure
          const transformedData = {
            userProfile: response.data.userProfile,
            riskScore: response.data.riskScore,
            riskBreakdown: response.data.riskBreakdown,
            colors: response.data.colors,
            uiText: response.data.uiText
          };
          
          setCancerRiskData(transformedData);
          setHasQuizData(true);
        } else {
          setHasQuizData(false);
          setCancerRiskData(response.data); // Contains uiText for fallback
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Animation effect - only run when we have data
  useEffect(() => {
    if (!CancerRiskData || !hasQuizData) return;
    
    const userRiskPercentage = CancerRiskData.riskScore.percentage;
    
    const timer1 = setTimeout(() => {
      setIsLoaded(true);
      let current = 0;
      const target = userRiskPercentage;
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
  }, [CancerRiskData, hasQuizData]);

  // Loading state
  if (loading) {
    return (
      <div className="cancer-risk-card">
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your risk assessment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="cancer-risk-card">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No quiz data - show call to action
  if (!hasQuizData) {
    return (
      <div className="cancer-risk-card">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Get Your Personalized Risk Assessment
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Complete our comprehensive lifestyle quiz to understand your cancer risk factors and get personalized recommendations.
          </p>
          <Link
            to="/lifestyle_quiz"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Take Lifestyle Assessment
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Main component with real data - using your exact original UI structure
  const userRiskScore = CancerRiskData.riskScore.current;
  const userRiskLevel = CancerRiskData.riskScore.level;
  const riskFactors = CancerRiskData.riskBreakdown;
  const riskColors = CancerRiskHelpers.getRiskColors(userRiskLevel, CancerRiskData.colors);

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
                {Math.round(riskScore)}
                <span className="risk-score-max">%</span>
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
                  {factor.rationale && (
                    <div className="factor-rationale">
                      {factor.rationale}
                    </div>
                  )}
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