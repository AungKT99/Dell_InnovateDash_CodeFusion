// frontend/src/api/screeningApi.jsx
import axios from 'axios';

// Create axios instance with default config (following your project pattern)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
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

const SCREENING_BASE = '/api/screening';

// Get user's personalized screening checklist
export const getScreeningChecklist = async () => {
  try {
    const response = await API.get(`${SCREENING_BASE}/checklist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching screening checklist:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch screening checklist',
      status: error.response?.status
    };
  }
};

// Get detailed screening recommendations
export const getScreeningRecommendations = async () => {
  try {
    const response = await API.get(`${SCREENING_BASE}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching screening recommendations:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch screening recommendations',
      status: error.response?.status
    };
  }
};

// Get providers for a specific test
export const getTestProviders = async (testCode) => {
  try {
    const response = await API.get(`${SCREENING_BASE}/test-providers/${testCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test providers:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch test providers',
      status: error.response?.status
    };
  }
};

// Get detailed information about a specific test
export const getTestInfo = async (testCode) => {
  try {
    const response = await API.get(`${SCREENING_BASE}/test-info/${testCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test info:', error.response?.data || error.message);
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch test information',
      status: error.response?.status
    };
  }
};

export default {
  getScreeningChecklist,
  getScreeningRecommendations,
  getTestProviders,
  getTestInfo
};