// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/contest/login`,
  ROUND1_SUBMIT: `${API_BASE_URL}/api/contest/round1/submit`,
  ROUND2_SUBMIT: `${API_BASE_URL}/api/contest/round2/submit`,
  ROUND3_SUBMIT: `${API_BASE_URL}/api/contest/round3/submit`,
  LEADERBOARD: `${API_BASE_URL}/api/contest/leaderboard`,
};

export default API;