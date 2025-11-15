import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getMyAlerts, getMyDashboard, getMyDetails, getMyDuePayments, getMyPayments, getMySeat } from '../controllers/user.Controller.js';


const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/dashboard', getMyDashboard);
router.get('/details', getMyDetails);
router.get('/payments', getMyPayments
);
router.get('/due-payments', getMyDuePayments);
router.get('/alerts', getMyAlerts);
router.get('/seat', getMySeat);

export { router as userRouter}
