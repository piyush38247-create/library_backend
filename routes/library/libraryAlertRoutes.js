import express from "express";
import { createAlert, deleteAlert, getAlerts, getAlertStats, markAllAsRead, markAsRead } from "../../controllers/library/alertController.js";
import {  createAlertValidation, validateAlert } from "../../middleware/validation.js";

const router = express.Router();

router.get("/:libraryId", getAlerts); 
router.post("/",createAlertValidation,validateAlert,createAlert ); 
router.patch("/:id/read", createAlertValidation,validateAlert, markAsRead); 
router.patch("/read-all/:id",createAlertValidation,validateAlert, markAllAsRead); 
router.delete("/:id", deleteAlert); 
router.get("/stats", getAlertStats); 

export {router as libraryAlertRouter}
