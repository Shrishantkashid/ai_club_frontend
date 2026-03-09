// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = {
  BASE_URL: API_BASE_URL,
  
  // Original contest routes
  LOGIN: `${API_BASE_URL}/api/contest/login`,
  ROUND1_SUBMIT: `${API_BASE_URL}/api/contest/round1/submit`,
  ROUND2_SUBMIT: `${API_BASE_URL}/api/contest/round2/submit`,
  ROUND3_SUBMIT: `${API_BASE_URL}/api/contest/round3/submit`,
  LEADERBOARD: `${API_BASE_URL}/api/contest/leaderboard`,
  
  // 2nd Sem contest routes
  SEM2_LOGIN: `${API_BASE_URL}/api/contest/sem2/login`,
  SEM2_ADMIN_LOGIN: `${API_BASE_URL}/api/contest/sem2/admin/login`,
  SEM2_ROUND1_QUESTIONS: `${API_BASE_URL}/api/contest/sem2/round1/questions`,
  SEM2_ROUND1_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round1/submit`,
  SEM2_ROUND2_ACTIVITY_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round2/activity/submit`,
  SEM2_ROUND2_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round2/submit`,
  SEM2_ROUND3_TASK_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round3/task/submit`,
  SEM2_ROUND3_RIDDLE_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round3/riddle/submit`,
  SEM2_ROUND3_SUBMIT: `${API_BASE_URL}/api/contest/sem2/round3/submit`,
  SEM2_LEADERBOARD: `${API_BASE_URL}/api/contest/sem2/leaderboard`,
  SEM2_ADMIN_ATTEMPTS: `${API_BASE_URL}/api/contest/sem2/admin/attempts`,
};

export default API;