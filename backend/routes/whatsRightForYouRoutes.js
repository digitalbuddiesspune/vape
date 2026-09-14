import express from "express";
import {
  getWhatsRightForYouItems,
  getAllWhatsRightForYouItems,
  getWhatsRightForYouItemById,
  addWhatsRightForYouItem,
  updateWhatsRightForYouItem,
  deleteWhatsRightForYouItem,
} from "../controllers/whatsRightForYouController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getWhatsRightForYouItems);
router.get("/all", protect, requireAdmin, getAllWhatsRightForYouItems);
router.get("/:id", getWhatsRightForYouItemById);
router.post("/", protect, requireAdmin, addWhatsRightForYouItem);
router.put("/:id", protect, requireAdmin, updateWhatsRightForYouItem);
router.delete("/:id", protect, requireAdmin, deleteWhatsRightForYouItem);

export default router;
