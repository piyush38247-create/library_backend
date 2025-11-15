import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { getLibraryDashboard } from "../../controllers/library/dashboardController.js";

const router = express.Router();

router.get("/:libraryId", authenticate, getLibraryDashboard);

export {router as libraryDashboardRoutes};
