import { Router } from 'express';
import { createAdmin, deleteUser, getUsers, getUserStats, toggleUserStatus, updatePermissions } from '../controllers/admin.Controller.js';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { createAdminValidation } from '../middleware/validation.js';



const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation rules

// Admin management routes
router.get('/users', requireAdmin, getUsers);
router.get('/users/stats', requireAdmin, getUserStats);
router.post('/users', requireAdmin, createAdminValidation, createAdmin);
router.put('/users/:id/permissions', requireAdmin, updatePermissions);
router.put('/users/:id/status', requireAdmin, toggleUserStatus);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

export {router as adminRouter}
