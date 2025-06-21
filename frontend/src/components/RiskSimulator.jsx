import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, TrendingUp, ChevronRight, Activity, Target, Loader2, RefreshCw, ArrowRight, RotateCcw } from 'lucide-react';
import Header from './Header';
import { getDashboardRiskData } from '../api/dashboardApi';
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

// Questions that can be modified in the simulator (exclude age, family history, previous cancer, etc.)
const MODIFIABLE_QUESTIONS = [
  'q3', // Smoking (0-10 points, multiplier 4)
  'q4', // BMI (0-10 points, multiplier 4) 
  'q6', // Alcohol (0-10 points, multiplier 2)
  'q7', // Exercise (0-10 points, multiplier 2)
  'q8', // Fruits/Veg (0-10 points, multiplier 2)
  'q9', // Processed Meat (0-10 points, multiplier 2)
  'q12', // Sun Protection (0-10 points, multiplier 1)
  'q13', // Sleep (0-10 points, multiplier 1)
  'q14'  // Stress (0-10 points, multiplier 1)
];

// Question configurations for sliders
const QUESTION_CONFIGS = {
  'q3': { // Smoking
    min: 0, max: 10, multiplier: 4,
    labels: { left: 'Never smoked', right: 'Daily (21+/day)' }
  },
  'q4': { // BMI
    min: 0, max: 10, multiplier: 4,
    labels: { left: 'Normal (18.5-24.9)', right: 'Obese (≥30)' }
  },
  'q6': { // Alcohol
    min: 0, max: 10, multiplier: 2,
    labels: { left: 'Never/Rarely', right: '5+ days/wk' }
  },
  'q7': { // Exercise
    min: 0, max: 10, multiplier: 2,
    labels: { left: '6+ days', right: '0 days' }
  },
  'q8': { // Fruits/Veg
    min: 0, max: 10, multiplier: 2,
    labels: { left: '5+ servings', right: 'Rarely (<1/day)' }
  },
  'q9': { // Processed Meat
    min: 0, max: 10, multiplier: 2,
    labels: { left: 'Rarely/Never', right: 'Daily' }
  },
  'q12': { // Sun Protection
    min: 0, max: 10, multiplier: 1,
    labels: { left: 'Always', right: 'Never' }
  },
  'q13': { // Sleep
    min: 0, max: 10, multiplier: 1,
    labels: { left: 'Good (7-8 h)', right: 'Chronic problems' }
  },
  'q14': { // Stress
    min: 0, max: 10, multiplier: 1,
    labels: { left: 'Low', right: 'Chronic high' }
  }
};

const RiskSimulator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data from backend
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasQuizData, setHasQuizData] = useState(false);

  // Simulator state
  const [currentRiskScore, setCurrentRiskScore] = useState(0);
  const [simulatedRiskScore, setSimulatedRiskScore] = useState(0);
  const [currentRiskLevel, setCurrentRiskLevel] = useState('');
  const [simulatedRiskLevel, setSimulatedRiskLevel] = useState('');
  const [modifiableFactors, setModifiableFactors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

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
          
          // Extract modifiable factors
          const factors = response.data.riskBreakdown || [];
          const modifiable = factors.filter(factor => 
            MODIFIABLE_QUESTIONS.includes(factor.id)
          );
          
          setModifiableFactors(modifiable.map(factor => ({
            ...factor,
            currentValue: factor.points,
            simulatedValue: factor.points,
            sliderValue: factor.points
          })));

          // Set initial risk scores
          const initialRisk = response.data.riskScore?.percentage || 0;
          setCurrentRiskScore(initialRisk);
          setSimulatedRiskScore(initialRisk);
          setCurrentRiskLevel(response.data.riskScore?.level || 'UNKNOWN');
          setSimulatedRiskLevel(response.data.riskScore?.level || 'UNKNOWN');
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

  // Animation effect for risk score
  useEffect(() => {
    if (dashboardData && hasQuizData) {
      const timer1 = setTimeout(() => {
        setIsLoaded(true);
        let current = 0;
        const target = currentRiskScore;
        const increment = target / 30;
        const scoreAnimation = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCurrentRiskScore(target);
            clearInterval(scoreAnimation);
            setTimeout(() => setProgressWidth(target), 200);
          } else {
            setCurrentRiskScore(Math.floor(current));
          }
        }, 50);
      }, 300);
      
      return () => clearTimeout(timer1);
    }
  }, [dashboardData, hasQuizData]);

  // Calculate simulated risk when factors change
  useEffect(() => {
    if (modifiableFactors.length > 0) {
      // Calculate the difference in points for modifiable factors only
      let totalPointDifference = 0;
      
      modifiableFactors.forEach(factor => {
        const pointDifference = factor.simulatedValue - factor.currentValue;
        const multiplier = QUESTION_CONFIGS[factor.id].multiplier;
        const weightedDifference = pointDifference * multiplier;
        totalPointDifference += weightedDifference;
      });
      
      // Apply the point difference to the current risk score
      // The risk score is already a percentage, so we need to convert points to percentage
      const maxPossiblePoints = 320; // From the quiz scoring system
      const percentageDifference = (totalPointDifference / maxPossiblePoints) * 100;
      
      const newSimulatedRisk = Math.max(0, Math.min(100, currentRiskScore + percentageDifference));
      setSimulatedRiskScore(Math.round(newSimulatedRisk));
      
      // Determine risk level
      let newRiskLevel = 'LOW_RISK';
      if (newSimulatedRisk > 60) {
        newRiskLevel = 'HIGH_RISK';
      } else if (newSimulatedRisk > 30) {
        newRiskLevel = 'MODERATE_RISK';
      }
      setSimulatedRiskLevel(newRiskLevel);
    }
  }, [modifiableFactors, currentRiskScore]);

  // Handle slider change
  const handleSliderChange = (factorId, newValue) => {
    setModifiableFactors(prev => prev.map(factor => 
      factor.id === factorId 
        ? { ...factor, simulatedValue: newValue, sliderValue: newValue }
        : factor
    ));
  };

  // Reset all sliders to current values
  const resetSimulation = () => {
    setModifiableFactors(prev => prev.map(factor => ({
      ...factor,
      simulatedValue: factor.currentValue,
      sliderValue: factor.currentValue
    })));
  };

  // Loading state
  if (loading) {
    return (
      <div className="cancer-risk-card">
        <div className="risk-content" style={{ padding: '3rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Risk Simulator</h3>
          <p className="text-gray-500">Preparing your interactive risk assessment...</p>
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
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Complete Your Assessment First</h3>
          <p className="text-gray-600 mb-4">
            You need to complete your lifestyle assessment before using the risk simulator
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
  const riskColors = CancerRiskHelpers.getRiskColors(currentRiskLevel, dashboardData?.colors);
  const simulatedColors = CancerRiskHelpers.getRiskColors(simulatedRiskLevel, dashboardData?.colors);
  const uiText = dashboardData?.uiText || {};

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
              RISK SIMULATOR
            </h2>
            
            {/* Risk Score Comparison */}
            <div className="risk-simulator-comparison">
              {/* Current Risk */}
              <div className="risk-simulator-current">
                <div className="text-sm text-gray-600 mb-2">Current Risk</div>
                <div className={`risk-score ${isLoaded ? 'loaded' : ''}`} style={{ fontSize: '2.5rem' }}>
                  {currentRiskScore}
                  <span className="risk-score-max">%</span>
                </div>
                <div className="risk-level" style={{ marginTop: '0.5rem' }}>
                  <span className="level-text">{currentRiskLevel}</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="risk-simulator-arrow">
                <ArrowRight />
              </div>

              {/* Simulated Risk */}
              <div className="risk-simulator-simulated">
                <div className="text-sm text-gray-600 mb-2">Simulated Risk</div>
                <div 
                  className={`risk-score ${isLoaded ? 'loaded' : ''}`} 
                  style={{ 
                    fontSize: '2.5rem',
                    color: simulatedColors.primary
                  }}
                >
                  {simulatedRiskScore}
                  <span className="risk-score-max">%</span>
                </div>
                <div className="risk-level" style={{ marginTop: '0.5rem' }}>
                  <span className="level-text">{simulatedRiskLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Simulator Content */}
      <div className="risk-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="risk-breakdown-title">
            <TrendingUp className="breakdown-icon" />
            Adjust Your Risk Factors
          </h3>
          <button 
            onClick={resetSimulation}
            className="risk-simulator-reset-btn"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </button>
        </div>
        
        <div className="risk-factors-list">
          <div 
            className="risk-factors-scroll-container" 
            style={{
              maxHeight: '240px', // Space for ~3 factors
              overflowY: 'auto',
              paddingRight: '8px',
            }}
          >
            {modifiableFactors.map((factor, index) => (
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
                {/* Slider */}
                <div style={{ width: '200px', marginLeft: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                    <div style={{ textAlign: 'left' }}>{QUESTION_CONFIGS[factor.id].labels.left}</div>
                    <div style={{ textAlign: 'right' }}>{QUESTION_CONFIGS[factor.id].labels.right}</div>
                  </div>
                  <input
                    type="range"
                    min={QUESTION_CONFIGS[factor.id].min}
                    max={QUESTION_CONFIGS[factor.id].max}
                    value={factor.sliderValue}
                    onChange={(e) => handleSliderChange(factor.id, parseInt(e.target.value))}
                    className="risk-simulator-slider"
                  />
                  <div className={`slider-value-display ${
                    factor.sliderValue > factor.currentValue ? 'positive' : 
                    factor.sliderValue < factor.currentValue ? 'negative' : 'neutral'
                  }`}>
                    {factor.sliderValue > factor.currentValue ? '+' : ''}
                    {factor.sliderValue - factor.currentValue}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Scroll indicator - only show if there are more than 3 factors */}
          {modifiableFactors.length > 3 && (
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
              <span>Scroll to see {modifiableFactors.length - 3} more factor{modifiableFactors.length - 3 === 1 ? '' : 's'}</span>
            </div>
          )}
          {modifiableFactors.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">No modifiable risk factors found</p>
              <p className="text-sm text-gray-400">All your current risk factors are non-modifiable</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="risk-actions">
          <button className="risk-btn primary">
            <span>Save as PDF</span>
            <ChevronRight className="btn-icon" />
          </button>
          
          <button className="risk-btn secondary">
            <span>Book Screening</span>
            <ChevronRight className="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskSimulator; 