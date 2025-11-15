import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from '../controllers/student.Controller.js';
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { studentValidation } from '../middleware/validation.js';



const router = Router();

// Validation rules

// All routes require authentication
router.use(authenticate);

// Routes with authorization
router.get('/', authorize('students', 'read'), getStudents);
router.get('/:id', authorize('students', 'read'), getStudentById);
router.post('/', authorize('students', 'create'), studentValidation, createStudent);
router.put('/:id', authorize('students', 'update'), updateStudent);
router.delete('/:id', authorize('students', 'delete'), deleteStudent);

 export {router as studentRouter};
