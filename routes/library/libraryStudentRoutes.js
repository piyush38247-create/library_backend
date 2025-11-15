import express from 'express';

import { authenticate } from '../../middleware/auth.js'; 
import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from '../../controllers/library/studentController.js';

const router = express.Router();


router.get('/:libraryId', authenticate, getStudents);

router.get('/:libraryId/:studentId', authenticate, getStudentById);

router.post('/:libraryId', authenticate, createStudent);

router.put('/:libraryId/:studentId', authenticate, updateStudent);

router.delete('/:libraryId/:studentId', authenticate, deleteStudent);

 export {router as librarystudentRouter};

