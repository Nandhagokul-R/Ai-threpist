import express from "express";
import { auth } from "../middleware/auth";
import { logActivity, getHistory } from "../controllers/activityController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Get user history (must be before /:id generic routes if added later)
router.get("/history", getHistory);

// Log a new activity
router.post("/", logActivity);

export default router;
