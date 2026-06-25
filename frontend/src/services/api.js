import axios from 'axios';

// Force the local machine port for testing the full email system
const API_BASE_URL = 'http://localhost:5000';

export const submitLead = async (data) => (await axios.post(`${API_BASE_URL}/api/leads`, data)).data;
export const fetchDashboardStats = async () => (await axios.get(`${API_BASE_URL}/api/dashboard`)).data;