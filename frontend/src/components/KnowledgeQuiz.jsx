import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Brain, Loader2 } from 'lucide-react';
import { getActiveQuiz, submitQuizAttempt } from '../api/quizApi';

const KnowledgeQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quiz from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await getActiveQuiz();
        if (response.success) {
          setQuiz(response.data);
        } else {
          setError('Failed to load quiz');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Unable to load quiz. Please try again later.');
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

      const response = await submitQuizAttempt({
        quizId: quiz._id,
        answers: formattedAnswers
      });

      if (response.success) {
        localStorage.setItem('quizAttemptId', response.data.attemptId); //Store the Attempt ID for later linking
        setResults(response.data.results);
        setShowResults(true);

      } else {
        setError('Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Unable to submit quiz. Please try again.');
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



  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const isLastQuestion = quiz && currentQuestion === quiz.questions.length - 1;
  const canProceed = answers[quiz?.questions[currentQuestion]?.id];
  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.questions.length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your Cancer IQ Quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <Brain className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <Brain className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          </div>

          {/* Score */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{results.score}</div>
              <p className="text-xl text-gray-700 mb-4">Your Cancer Knowledge Score</p>
              <p className="text-gray-600">
                You got {results.correctAnswers} out of {results.totalQuestions} questions correct
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-2">🎯 Want to know YOUR actual cancer risk?</h3>
              <p className="text-blue-100 mb-4">
                Get a personalized risk assessment based on YOUR lifestyle, family history, and health data
              </p>
              <div className="text-sm text-blue-200">
                🔒 100% confidential
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-bold text-lg shadow-lg transform hover:scale-105 text-center no-underline"
                >
                🚀 Calculate My Personal Risk
              </Link>
              <button
                onClick={restartQuiz}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Join thousands who've already discovered their risk level
            </p>
          </div>

          {/* Explanations */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Answers</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.explanations.map((exp, index) => (
                <div key={exp.questionId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      exp.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {exp.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{exp.questionText}</p>
                      <p className="text-sm text-gray-600 mb-2">Your answer: {exp.selectedAnswer}</p>
                      <p className="text-sm text-gray-700">{exp.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
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
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:shadow-md ${
                  answers[currentQ.id] === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === option.id
                      ? 'border-blue-500 bg-blue-500'
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
                    Submitting...
                  </>
                ) : (
                  'Get My Results'
                )}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default KnowledgeQuiz;