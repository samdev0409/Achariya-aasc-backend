import express from "express";
import * as controller from "../controllers/aasc_beats__aascbeatsdataController.js";
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// Public Read Access
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Admin Only Write Access
router.post("/", authenticate, isAdmin, controller.create);
router.put("/:id", authenticate, isAdmin, controller.update);
router.delete("/:id", authenticate, isAdmin, controller.deleteItem);

export default router;
