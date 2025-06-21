// frontend/src/components/Dashboard.jsx - Complete version with Screening Card
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, TrendingUp, ChevronRight, Activity, Target, Loader2, RefreshCw, ClipboardList, Calendar, MapPin } from 'lucide-react';
import Header from './Header';
import { getDashboardRiskData } from '../api/dashboardApi';
import { getScreeningChecklist } from '../api/screeningApi';
import '../styles/styles.css';
import '../styles/dashboard.css';

const CancerRiskHelpers = {
  getRiskColors: (level, colors) => {
    switch(level) {
      case "HIGH RISK": 
      case "HIGH_RISK":
        return { 
          primary: "#b0004e", 
          light: "rgba(176, 0, 78, 0.1)", 
          border: "rgba(176, 0, 78, 0.2)", 
          hover: "#6a0dad" 
        };
      case "MODERATE RISK": 
      case "MODERATE_RISK":
        return { 
          primary: "#f472b6", 
          light: "rgba(244, 114, 182, 0.1)", 
          border: "rgba(244, 114, 182, 0.2)", 
          hover: "#b0004e" 
        };
      case "LOW RISK": 
      case "LOW_RISK":
        return { 
          primary: "#f472b6", 
          light: "rgba(244, 114, 182, 0.1)", 
          border: "rgba(244, 114, 182, 0.2)", 
          hover: "#ec4899" 
        };
      default: 
        return { 
          primary: "#b0004e", 
          light: "rgba(176, 0, 78, 0.1)", 
          border: "rgba(176, 0, 78, 0.2)", 
          hover: "#6a0dad" 
        };
    }
  }
};

const CancerRiskAssessment = () => {
  const navigate = useNavigate();

  // Data from backend
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
              maxHeight: '240px',
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
                pointerEvents: 'none'
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
          
          {/* Secondary CTA - View Screening Recommendations */}
          <Link 
            to="/screening-checklist"
            className="risk-btn secondary"
          >
            <span>{uiText.secondaryButton || 'View Screening Recommendations'}</span>
            <ChevronRight className="btn-icon" />
          </Link>
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

// NEW: Risk Simulator component for dashboard
const RiskSimulator = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Risk Simulator</h2>
        <Target className="w-6 h-6 text-blue-600" />
      </div>
      
      <p className="text-gray-600 mb-6">
        Explore how lifestyle changes could impact your cancer risk over time.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">🥗 Diet Improvements</h3>
          <p className="text-sm text-gray-600">See how increasing fruits & vegetables affects your risk</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">🏃‍♀️ Exercise More</h3>
          <p className="text-sm text-gray-600">Calculate risk reduction from regular physical activity</p>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">🚭 Lifestyle Changes</h3>
          <p className="text-sm text-gray-600">Model impact of quitting smoking & reducing alcohol</p>
        </div>
      </div>
      
      <div className="mt-6">
        <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold">
          Launch Risk Simulator
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-pink-50 rounded-lg">
        <p className="text-sm text-pink-800">
          💡 Interactive tool to see potential risk improvements
        </p>
      </div>
    </div>
  );
};

// NEW: Screening Overview component for dashboard
const ScreeningOverview = () => {
  const [screeningData, setScreeningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScreeningData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getScreeningChecklist();
      
      if (response.success) {
        setScreeningData(response.data);
      } else {
        // Don't show error for missing screening data if user has completed assessment
        // Instead show that we're generating recommendations
        setError(null);
        setScreeningData({ screeningItems: [], userInfo: null });
      }
    } catch (err) {
      console.error('Error fetching screening data:', err);
      // Handle network errors gracefully
      setError(null);
      setScreeningData({ screeningItems: [], userInfo: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreeningData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Screening Recommendations</h2>
          <ClipboardList className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Generating your personalized recommendations...</span>
        </div>
      </div>
    );
  }

  const { screeningItems, userInfo } = screeningData || {};
  
  // Count priorities
  const urgentCount = screeningItems?.filter(item => 
    item.priority?.toLowerCase() === 'high' || item.priority?.toLowerCase() === 'urgent'
  ).length || 0;
  
  const recommendedCount = screeningItems?.filter(item => 
    item.priority?.toLowerCase() === 'medium' || item.priority?.toLowerCase() === 'needed'
  ).length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Screening Recommendations</h2>
        <ClipboardList className="w-6 h-6 text-blue-600" />
      </div>
      
      <p className="text-gray-600 mb-4">
        Personalized screening recommendations based on your risk assessment.
      </p>

      {/* If no screening data yet, show generating recommendations */}
      {(!screeningItems || screeningItems.length === 0) && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Recommendations</h3>
          <p className="text-gray-600 mb-4">
            Our system is analyzing your risk profile to create personalized screening recommendations.
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Cancer Risk Analysis</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-900">Provider Matching</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⏳ Processing</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {urgentCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-900">Urgent Screenings</span>
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {urgentCount} pending
            </span>
          </div>
        )}
        
        {recommendedCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-900">Recommended</span>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              {recommendedCount} pending
            </span>
          </div>
        )}
      </div>

      {/* Quick preview of first screening item */}
      {screeningItems && screeningItems.length > 0 && (
        <div className="mt-4 p-3 border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{screeningItems[0].testName}</h4>
              <p className="text-sm text-gray-600">{screeningItems[0].whyText}</p>
              {screeningItems[0].recommendedPackage && (
                <p className="text-xs text-blue-600 mt-1">
                  {screeningItems[0].recommendedPackage.provider.name}
                </p>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              screeningItems[0].priority?.toLowerCase() === 'high' || screeningItems[0].priority?.toLowerCase() === 'urgent'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {screeningItems[0].priority?.toUpperCase() || 'NEEDED'}
            </span>
          </div>
        </div>
      )}
      
      <div className="mt-6 space-y-2">
        <Link 
          to="/screening-checklist"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ClipboardList className="w-4 h-4" />
          {screeningItems && screeningItems.length > 0 ? 'View Full Checklist' : 'View Recommendations'}
        </Link>
        
        <button 
          onClick={fetchScreeningData}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { 
      id: 0, 
      name: 'Risk Assessment', 
      icon: AlertTriangle, 
      component: <CancerRiskAssessment /> 
    },
    { 
      id: 1, 
      name: 'Risk Simulator', 
      icon: Target, 
      component: <RiskSimulator /> 
    },
    { 
      id: 2, 
      name: 'Screening Recommendations', 
      icon: ClipboardList, 
      component: <ScreeningOverview /> 
    }
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
              <RiskSimulator />
            </div>
            <div className="h-full">
              <ScreeningOverview />
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