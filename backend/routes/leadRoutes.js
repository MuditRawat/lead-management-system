import express from 'express';
import { createLead, getDashboardStats, trackOpen, trackClick } from '../controllers/leadController.js';
const router = express.Router();
router.post('/api/leads', createLead);
router.get('/api/dashboard', getDashboardStats);
router.get('/track-open/:id', trackOpen);
router.get('/track-click/:id', trackClick);
export default router;