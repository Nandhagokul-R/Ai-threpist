import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://blocklinklabs:rKjw3YwImNAzgMzU@cluster0.znbgmwt.mongodb.net/ai-therapy";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    // Allow demo mode to continue without DB connection
    if (process.env.ALLOW_DEMO === "true" || process.env.NODE_ENV !== "production") {
      logger.warn("Proceeding without MongoDB connection (demo mode)");
      return;
    }
    process.exit(1);
  }
};
