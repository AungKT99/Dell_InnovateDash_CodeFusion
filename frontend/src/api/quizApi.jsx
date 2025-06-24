// frontend/src/api/quizApi.jsx
import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const QUIZ_BASE = '/api/quiz';

// Get active quiz (no authentication required)
export const getActiveQuiz = async () => {
  try {
    const response = await API.get(`${QUIZ_BASE}/active`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active quiz:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch active quiz',
      status: error.response?.status
    };
  }
};

// Submit quiz attempt (no authentication required)
export const submitQuizAttempt = async (quizData) => {
  try {
    const response = await API.post(`${QUIZ_BASE}/submit`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to submit quiz',
      status: error.response?.status
    };
  }
};

// Link quiz attempt to user (requires authentication)
export const linkQuizToUser = async (quizData) => {
  try {
    const response = await API.post(`${QUIZ_BASE}/link-attempt`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error linking quiz to user:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to link quiz to user',
      status: error.response?.status
    };
  }
};

// Get quiz analytics (requires authentication/admin)
export const getQuizAnalytics = async (quizId) => {
  try {
    const response = await API.get(`${QUIZ_BASE}/${quizId}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz analytics:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch quiz analytics',
      status: error.response?.status
    };
  }
};

// Create quiz (requires authentication/admin)
export const createQuiz = async (quizData) => {
  try {
    const response = await API.post(`${QUIZ_BASE}/create`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to create quiz',
      status: error.response?.status
    };
  }
};

export default {
  getActiveQuiz,
  submitQuizAttempt,
  linkQuizToUser,
  getQuizAnalytics,
  createQuiz
};