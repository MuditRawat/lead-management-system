import axios from 'axios';

// This lets Vercel use its dashboard environment variables perfectly!
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lead-backend-q644.onrender.com';

export const submitLead = async (data) => (await axios.post(`${API_BASE_URL}/api/leads`, data)).data;
export const fetchDashboardStats = async () => (await axios.get(`${API_BASE_URL}/api/dashboard`)).data;