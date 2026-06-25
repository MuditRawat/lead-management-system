import express from 'express';
import { createLead, getDashboardStats, trackOpen, trackClick } from '../controllers/leadController.js';

const router = express.Router();

// Combined with '/api' in server.js, this creates the perfect endpoint: POST /api/leads
router.post('/leads', createLead);

// Combined with '/api' in server.js, this creates: GET /api/dashboard
router.get('/dashboard', getDashboardStats);

// Tracking links - keep these simple so your emails can hit them cleanly
router.get('/track-open/:id', trackOpen);
router.get('/track-click/:id', trackClick);

export default router;