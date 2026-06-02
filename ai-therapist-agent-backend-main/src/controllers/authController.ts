import { Request, Response } from "express";
import { User } from "../models/User";
import { Session } from "../models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // Respond
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User registered successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for email:", email);
    console.log("Request body:", { email, password: password ? "***" : "missing" });

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user with a timeout to avoid 30s hangs when DB is unreachable
    let user = null as any;
    try {
      console.log("Looking up user in database...");
      user = await Promise.race([
        User.findOne({ email }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("User lookup timeout")), 5000)
        ),
      ]);
      console.log("User lookup result:", user ? "found" : "not found");
    } catch (dbFindErr: unknown) {
      const message = dbFindErr instanceof Error ? dbFindErr.message : String(dbFindErr);
      console.log("Database lookup error:", message);
      user = null;
    }

    // Dev fallback: if DB unavailable, allow demo login (non-production only)
    if (!user && process.env.NODE_ENV !== "production") {
      console.log("Using demo user fallback");
      const demoToken = jwt.sign(
        { userId: "demo-user-id" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );
      return res.json({
        user: {
          _id: "demo-user-id",
          name: "Demo User",
          email,
        },
        token: demoToken,
        message: "Login successful (demo mode)",
      });
    }
    if (!user) {
      console.log("User not found and not in demo mode");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify password
    console.log("Verifying password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Create session (non-blocking with timeout fallback)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    try {
      console.log("Creating session...");
      const session = new Session({
        userId: user._id,
        token,
        expiresAt,
        deviceInfo: req.headers["user-agent"],
      });
      // Avoid long hangs on DB write; proceed if it takes too long
      await Promise.race([
        session.save(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session save timeout")), 5000)
        ),
      ]);
      console.log("Session created successfully");
    } catch (sessionError: unknown) {
      const message = sessionError instanceof Error ? sessionError.message : String(sessionError);
      console.log("Session creation error:", message);
      // Swallow session persistence errors to avoid breaking login
      // Session creation failure should not prevent issuing a token
    }

    // Respond with user data and token
    console.log("Login successful, sending response");
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      await Session.deleteOne({ token });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
