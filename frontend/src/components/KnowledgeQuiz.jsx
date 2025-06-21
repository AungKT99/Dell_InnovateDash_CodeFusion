import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Brain, Loader2 } from 'lucide-react';
import { getActiveQuiz, submitQuizAttempt } from '../api/quizApi';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const KnowledgeQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndShuffleQuiz = async () => {
    try {
      setLoading(true);
      const response = await getActiveQuiz();
      if (response.success) {
        const shuffled = shuffleArray(response.data.questions).slice(0, 10);
        setQuiz({ ...response.data, questions: shuffled });
      } else {
        setError('Failed to load quiz');
      }
    } catch (err) {
      setError('Unable to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndShuffleQuiz();
  }, []);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
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
      const formattedAnswers = Object.entries(answers).map(([qid, optionId]) => ({ qid, optionId }));
      const response = await submitQuizAttempt({ quizId: quiz._id, answers: formattedAnswers });
      if (response.success) {
        localStorage.setItem('quizAttemptId', response.data.attemptId);
        setResults(response.data.results);
        setShowResults(true);
      } else {
        setError('Failed to submit quiz');
      }
    } catch (err) {
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
    fetchAndShuffleQuiz();
  };

  const getScoreLevelColor = (score) => {
    if (score < 30) return 'bg-red-50 text-red-700 border border-red-200';
    if (score < 70) return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
    return 'bg-green-50 text-green-700 border border-green-200';
  };

  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const isLastQuestion = quiz && currentQuestion === quiz.questions.length - 1;
  const canProceed = answers[quiz?.questions[currentQuestion]?.id];
  const allQuestionsAnswered = quiz && Object.keys(answers).length === quiz.questions.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-red-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Loading your Cancer IQ Quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-red-50">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center">
          <Brain className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">Oops!</h2>
          <p className="text-gray-600 mb-6 text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition duration-200 font-semibold shadow-md"
          >Try Again</button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    const scoreColor = getScoreLevelColor(results.score);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-10">
          <div className="text-center mb-10">
            <Brain className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl font-semibold text-gray-900 mb-2">Quiz Complete!</h2>
          </div>

          <div className={`rounded-2xl px-6 py-8 mb-10 shadow-inner text-center ${scoreColor}`}>
            <div className="text-6xl font-bold mb-2 tracking-tight">{results.score}</div>
            <p className="text-lg font-medium mb-2">Your Cancer Knowledge Score</p>
            <p className="text-sm">You got {results.correctAnswers} out of {results.totalQuestions} questions correct</p>
          </div>

          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-purple-100 border border-purple-200 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">🎯 Want to know YOUR actual cancer risk?</h3>
              <p className="text-gray-700 mb-2 text-base leading-relaxed">Get a personalized risk assessment based on your lifestyle, family history, and health habits — with practical tips to reduce your risk.</p>
              <p className="text-sm text-purple-500 font-medium">🔒 100% confidential</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-red-600 hover:to-purple-700 transition-all font-bold text-lg shadow-xl transform hover:scale-105 text-center no-underline">
                🚀 Calculate My Personal Risk
              </Link>
              <button
                onClick={restartQuiz}
                className="bg-white border border-purple-300 text-purple-700 px-6 py-3 rounded-2xl hover:bg-purple-50 transition-colors font-semibold shadow-sm hover:shadow-md"
              >🔁 Retake Quiz</button>
            </div>

            <p className="text-xs text-gray-400">Join thousands who’ve already discovered their risk level</p>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Answers</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.explanations.map((exp) => (
                <div key={exp.questionId} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      exp.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {exp.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{exp.questionText}</p>
                      <p className="text-sm text-gray-600 mb-1">Your answer: {exp.selectedAnswer}</p>
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

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            <span className="text-sm text-gray-500 sm:text-base">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: '#C8102E' }}></div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.text}</h2>
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-100 hover:bg-purple-100 text-purple-900'
                      : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

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
                {submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>) : 'Get My Results'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={!canProceed}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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