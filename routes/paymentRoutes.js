import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getPayments, updatePayment } from '../controllers/payment.controller.js';
import { paymentValidation } from '../middleware/validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('payments', 'read'), getPayments);

// router.get('/stats', authorize('payments', 'read'), getPaymentStats);
// router.get('/export', authorize('payments', 'read'), exportPayments);
router.put('/:id', authorize('payments', paymentValidation,'update'), updatePayment)



export { router as paymentRouter}
