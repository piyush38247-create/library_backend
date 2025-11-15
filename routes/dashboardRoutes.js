import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getDashboardStats, getRevenueAnalytics } from '../controllers/dashboard.Controller.js';
const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/stats', authorize('dashboard', 'read'), getDashboardStats);
router.get('/revenue-analytics', authorize('dashboard', 'read'), getRevenueAnalytics);



export {router as dashboardRouter}
