import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../../controllers/library/reportController.js";
import { authenticate } from '../../middleware/auth.js'; 

const router = express.Router();

router.post("/",authenticate, createReport);          
router.get("/",authenticate, getReports);            
router.get("/:id",authenticate, getReportById);       
router.put("/:id",authenticate, updateReport);       
router.delete("/:id",authenticate, deleteReport);     

 export {router as libraryReportRouter};
