import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS LINE
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, TrendingUp, ChevronRight, Activity, Target, Loader2, RefreshCw } from 'lucide-react';
import Header from './Header';
import { getDashboardRiskData } from '../api/dashboardApi';
import '../styles/styles.css';
import '../styles/dashboard.css';

const CancerRiskHelpers = {
  getRiskColors: (level, colors) => {
    switch(level) {
      case "HIGH RISK": 
      case "HIGH_RISK": 
        return colors?.highRisk || { primary: "#DC2626", light: "#FEF2F2", border: "#FECACA", hover: "#B91C1C" };
      case "MODERATE RISK": 
      case "MODERATE_RISK": 
        return colors?.moderateRisk || { primary: "#D97706", light: "#FFF7ED", border: "#FED7AA", hover: "#B45309" };
      case "LOW RISK": 
      case "LOW_RISK": 
        return colors?.lowRisk || { primary: "#059669", light: "#ECFDF5", border: "#A7F3D0", hover: "#047857" };
      default: 
        return colors?.highRisk || { primary: "#DC2626", light: "#FEF2F2", border: "#FECACA", hover: "#B91C1C" };
    }
  }
};

const CancerRiskAssessment = () => {
   const navigate = useNavigate(); // to navigate

  //Data from backend
  const [riskScore, setRiskScore] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasQuizData, setHasQuizData] = useState(false);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardRiskData();
      
      if (response.success) {
        setHasQuizData(response.hasQuizData);
        if (response.hasQuizData && response.data) {
          setDashboardData(response.data);
          
          // Debug logging
          console.log('Dashboard Data:', response.data);
          console.log('Risk Breakdown:', response.data.riskBreakdown);
          console.log('Risk Score:', response.data.riskScore);
        }
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Animation effect for risk score (using percentage)
  useEffect(() => {
    if (dashboardData && hasQuizData) {
      const userRiskPercentage = dashboardData.riskScore?.percentage || 0;
      
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
    }
  }, [dashboardData, hasQuizData]);

  // Loading state
  if (loading) {
    return (
      <div className="cancer-risk-card">
        <div className="risk-content" style={{ padding: '3rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Your Risk Assessment</h3>
          <p className="text-gray-500">Fetching your personalized cancer risk data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="cancer-risk-card">
        <div className="risk-content" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No quiz data state
  if (!hasQuizData) {
    return (
      <div className="cancer-risk-card">
        <div className="risk-content" style={{ padding: '3rem', textAlign: 'center' }}>
          <Target className="mx-auto mb-4 text-blue-500" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Complete Your Assessment</h3>
          <p className="text-gray-600 mb-4">
            {dashboardData?.uiText?.urgencyMessage || 'Complete your lifestyle assessment to see your personalized risk data'}
          </p>
          <button 
            onClick={() => navigate('/lifestyle_quiz')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
            Start Lifestyle Quiz
            <ChevronRight size={16} className="ml-2" />
        </button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const userRiskPercentage = dashboardData.riskScore?.percentage || 0;
  const userRiskLevel = dashboardData.riskScore?.level || "UNKNOWN";
  const riskFactors = dashboardData.riskBreakdown || [];
  const riskColors = CancerRiskHelpers.getRiskColors(userRiskLevel, dashboardData.colors);
  const uiText = dashboardData.uiText || {};

  // Set CSS variables for dynamic styling
  const cssVariables = {
    '--gradient': `linear-gradient(135deg, ${riskColors.primary} 0%, ${riskColors.hover} 100%)`,
    '--risk-primary': riskColors.primary,
    '--risk-light': riskColors.light,
    '--risk-border': riskColors.border,
    '--risk-hover': riskColors.hover
  };

  return (
    <div className="cancer-risk-card" style={cssVariables}>
      {/* Risk Header */}
      <div className="risk-header">
        <div className="risk-header-bg">
          <div className="risk-header-content">
            <h2 className="risk-title">
              {uiText.title || 'MY CANCER RISK'}
            </h2>
            
            {/* Main Risk Score */}
            <div className="risk-score-container">
              <div className={`risk-score ${isLoaded ? 'loaded' : ''}`}>
                {riskScore}
                <span className="risk-score-max">
                  %
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
                  style={{ width: `${Math.min(progressWidth, 100)}%` }}
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
          {uiText.riskBreakdownTitle || 'Risk Factors'}
        </h3>
        
        <div className="risk-factors-list">
          {/* Scrollable container for all factors */}
          <div 
            className="risk-factors-scroll-container" 
            style={{
              maxHeight: '240px', // Space for ~3 factors
              overflowY: 'auto',
              paddingRight: '8px',
             
            }}
          >
            {riskFactors.map((factor, index) => (
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
                  {factor.points > 0 ? `+${factor.percentage}%` : `${factor.percentage}%`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll indicator - only show if there are more than what's visible */}
          {riskFactors.length > 3 && (
            <div 
              className="scroll-indicator" 
              style={{
                textAlign: 'center',
                marginTop: '12px',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                position: 'relative',
                zIndex: 1,
                pointerEvents: 'none' // Prevent interference with button clicks
              }}
            >
              <ChevronRight 
                size={14} 
                style={{ 
                  transform: 'rotate(90deg)',
                  animation: 'bounce 2s infinite'
                }} 
              />
              <span>Scroll to see {riskFactors.length - 3} more factor{riskFactors.length - 3 === 1 ? '' : 's'}</span>
            </div>
          )}
          
          {riskFactors.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">No specific risk factors identified</p>
              <p className="text-sm text-gray-400">This indicates healthy lifestyle choices!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="risk-actions">
          {/* Primary CTA - Risk Simulator */}
          <button className="risk-btn primary">
            <span>{uiText.primaryButton || 'Try Risk Simulator'}</span>
            <ChevronRight className="btn-icon" />
          </button>
          
          {/* Secondary CTA - Book Screening */}
          <button className="risk-btn secondary">
            <span>{uiText.secondaryButton || 'Book Screening'}</span>
            <ChevronRight className="btn-icon" />
          </button>
        </div>
        
        {/* Urgency message */}
        <div className="risk-urgency">
          <p className="urgency-text">
            <AlertTriangle className="urgency-icon" />
            {uiText.urgencyMessage || 'Early screening can significantly reduce your risk'}
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