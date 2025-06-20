// frontend/src/components/LifestyleQuiz.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Loader2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { getActiveLifestyleQuiz, submitLifestyleQuizAttempt } from '../api/lifeStyleQuizApi';

const LifestyleQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lifestyle quiz from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await getActiveLifestyleQuiz();
        if (response.success) {
          setQuiz(response.data);
        } else {
          setError('Failed to load lifestyle quiz');
        }
      } catch (err) {
        console.error('Error fetching lifestyle quiz:', err);
        setError('Unable to load lifestyle quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      
      // Convert answers to the format expected by backend
      const formattedAnswers = Object.entries(answers).map(([qid, optionId]) => ({
        qid,
        optionId
      }));

      const response = await submitLifestyleQuizAttempt({
        quizId: quiz._id,
        answers: formattedAnswers
      });

      if (response.success) {
        setResults(response.data.results);
        setShowResults(true);
      } else {
        setError('Failed to submit lifestyle quiz');
      }
    } catch (err) {
      console.error('Error submitting lifestyle quiz:', err);
      setError('Unable to submit lifestyle quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setShowResults(false);
    setError(null);
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW_RISK':
        return <CheckCircle className="w-16 h-16" style={{ color: '#059669' }} />;
      case 'MODERATE_RISK':
        return <Shield className="w-16 h-16" style={{ color: '#D97706' }} />;
      case 'HIGH_RISK':
        return <AlertTriangle className="w-16 h-16" style={{ color: '#DC2626' }} />;
      default:
        return <Heart className="w-16 h-16 text-gray-600" />;
    }
  };

  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const isLastQuestion = quiz && currentQuestion === quiz.questions.length - 1;
  const canProceed = answers[quiz?.questions[currentQuestion]?.id];
  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.questions.length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your Lifestyle Risk Assessment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <Heart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              {getRiskIcon(results.riskLevel)}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600">Your personalized cancer risk assessment</p>
          </div>

          {/* Risk Score */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div 
                className="text-5xl font-bold mb-2"
                style={{ color: results.riskColor }}
              >
                {results.percentageScore}%
              </div>
              <p className="text-xl text-gray-700 mb-2">Cancer Risk Score</p>
              <div 
                className="inline-block px-4 py-2 rounded-full text-white font-semibold mb-4"
                style={{ backgroundColor: results.riskColor }}
              >
                {results.riskLabel}
              </div>
              <p className="text-gray-600">
                {results.riskDescription}
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Factor Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-gray-700">Primary Factors (Age, Genetics)</span>
                <span className="font-bold text-red-600">
                  {results.categoryBreakdown.primary.percentage}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Secondary Factors (Lifestyle)</span>
                <span className="font-bold text-orange-600">
                  {results.categoryBreakdown.secondary.percentage}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-700">Tertiary Factors (Habits)</span>
                <span className="font-bold text-yellow-600">
                  {results.categoryBreakdown.tertiary.percentage}%
                </span>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-2">🎯 Secure Your Health with Early Screening</h3>
              <p className="text-green-100 mb-4">
                Finding cancer early usually means simpler treatment, lower costs, and far better survival—book your screening today.

              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                View Dashboard
              </Link>
              <button
                onClick={restartQuiz}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            {currentQ.icon && (
              <span className="text-2xl mr-3">{currentQ.icon}</span>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentQ.text}
              </h2>
              {currentQ.subText && (
                <p className="text-sm text-gray-600 mt-2">{currentQ.subText}</p>
              )}
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              currentQ.category === 'primary' 
                ? 'bg-red-100 text-red-800' 
                : currentQ.category === 'secondary'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)} Factor
            </span>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:shadow-md ${
                  answers[currentQ.id] === option.id
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === option.id
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={submitQuiz}
                disabled={!allQuestionsAnswered || submitting}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Get My Risk Assessment'
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleQuiz;