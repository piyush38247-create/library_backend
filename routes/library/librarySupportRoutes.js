import express from "express";
import {
  createSupport,
  getSupports,
  updateSupportStatus,
  deleteSupport,
  createMessage,
  getMessagesBySupportId,
  updateMessage,
  deleteMessage,
} from "../../controllers/library/supportController.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

//  support ticket  routes
router.post("/:libraryId", authenticate, createSupport);
router.get("/:libraryId", authenticate, getSupports);
router.put("/status/:id", authenticate, updateSupportStatus);
router.delete("/:id", authenticate, deleteSupport);


//  message routes

router.post("/:supportId/messages", authenticate, createMessage);
router.get("/:supportId/messages", authenticate, getMessagesBySupportId);

router.put("/:messageId",authenticate, updateMessage);
router.delete("/msg/:messageId",authenticate, deleteMessage);

 export {router as librarySupportRoutes};
