import express from "express";
import {
  getLibraryPayments,
  addLibraryPayment,
  updateLibraryPayment,
  deleteLibraryPayment,
} from "../../controllers/library/paymentController.js";

import { authenticate } from "../../middleware/auth.js";

const router = express.Router();


router.get("/:libraryId", authenticate, getLibraryPayments);
router.post("/:libraryId", authenticate, addLibraryPayment);
router.put("/:id", authenticate, updateLibraryPayment);
router.delete("/:id", authenticate, deleteLibraryPayment);


export {router as libraryPaymentRoute};;
