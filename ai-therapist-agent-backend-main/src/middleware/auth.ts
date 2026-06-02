import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // In demo mode, bypass token requirement if missing
      if (process.env.ALLOW_DEMO === "true") {
        req.user = {
          id: "demo-user-id",
          _id: "demo-user-id",
          name: "Demo User",
          email: "demo@example.com"
        };
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;

    // Handle demo user fallback if DB lookup fails or is skipped
    if (decoded.userId === "demo-user-id") {
      req.user = {
        id: "demo-user-id",
        _id: "demo-user-id",
        name: "Demo User",
        email: "demo@example.com"
      };
      return next();
    }

    let user;
    try {
      user = await User.findById(decoded.userId);
    } catch (err) {
      // If DB error but in demo mode, fallback to demo user
      if (process.env.ALLOW_DEMO === "true") {
        req.user = { id: decoded.userId, name: "Demo User", email: "demo@example.com" };
        return next();
      }
      throw err;
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    // If token verification fails and we are in demo mode, permit the demo user
    if (process.env.ALLOW_DEMO === "true") {
      req.user = {
        id: "demo-user-id",
        _id: "demo-user-id",
        name: "Demo User",
        email: "demo@example.com"
      };
      return next();
    }
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};
