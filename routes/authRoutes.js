import { Router } from 'express';
import { changePassword, getProfile, login, register, updateProfile } from '../controllers/auth.Controller.js';
import { authenticate } from '../middleware/auth.js';
import { changePasswordValidation, loginValidation, registerValidation } from '../middleware/validation.js';

const router = Router();


 

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, changePassword);

export {router as authRouter}
