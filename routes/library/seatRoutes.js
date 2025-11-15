import express from "express";
import {
  getSeats,
  getSeatStats,
  assignSeat,
  createSeat,
  deleteSeat,
  unassignSeat,
} from "../../controllers/library/seatController.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

// Library- seat
//  routes
router.get("/:libraryId", authenticate, getSeats);
router.get("/:libraryId/stats", authenticate, getSeatStats);
router.post("/create", authenticate, createSeat);
router.delete("/delete", authenticate, deleteSeat);
router.post("/assign", authenticate, assignSeat);
router.put("/:id/unassign", authenticate, unassignSeat);

export { router as librarySeatRoutes };
