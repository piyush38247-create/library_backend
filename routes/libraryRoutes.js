import { Router } from 'express';
import { deleteLibrary, getLibrares, registerLibrary, updateLibrary } from '../controllers/company/libraryController.js';
import { validationResult } from 'express-validator';
import { validateRequest } from '../middleware/vaildationResult.js';
import { libraryValidation } from '../middleware/validation.js';

const router = Router();

router.get("/all", getLibrares)

router.post("/register",libraryValidation,validateRequest, registerLibrary)

router.put("/:id", updateLibrary)

router.delete("/:id", deleteLibrary)


export { router as libraryRouter}
