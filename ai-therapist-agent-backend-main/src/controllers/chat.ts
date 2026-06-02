import { Request, Response } from "express";
import { ChatSession, IChatSession } from "../models/ChatSession";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { inngest } from "../inngest/client";
import { User } from "../models/User";
import { InngestSessionResponse, InngestEvent } from "../types/inngest";
import { Types } from "mongoose";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyDTYEhSdFF-i2SUpBTUs0w1HQTeF5HYi3U"
);

// Create a new chat session
export const createChatSession = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User not authenticated" });
    }

    const userId = req.user.id;
    const sessionId = uuidv4();

    try {
      const session = new ChatSession({
        sessionId,
        userId: new Types.ObjectId(userId),
        startTime: new Date(),
        status: "active",
        messages: [],
      });
      await session.save();
    } catch (dbError) {
      logger.error("Database error in createChatSession:", dbError);
      if (process.env.ALLOW_DEMO !== "true") {
        throw dbError;
      }
      logger.info("Proceeding with mock session ID in demo mode");
    }

    res.status(201).json({
      message: "Chat session created successfully",
      sessionId: sessionId,
    });
  } catch (error) {
    logger.error("Error creating chat session:", error);
    res.status(500).json({
      message: "Error creating chat session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Send a message in the chat session
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    const userId = new Types.ObjectId(req.user.id);

    logger.info("Processing message:", { sessionId, message });

    // Find session by sessionId
    let session;
    try {
      session = await ChatSession.findOne({ sessionId });
      if (!session) {
        logger.warn("Session not found:", { sessionId });
        if (process.env.ALLOW_DEMO !== "true") {
          return res.status(404).json({ message: "Session not found" });
        }
        // Create a temporary session object for demo mode
        session = new ChatSession({ sessionId, userId, messages: [] });
      } else if (session.userId.toString() !== userId.toString()) {
        logger.warn("Unauthorized access attempt:", { sessionId, userId });
        return res.status(403).json({ message: "Unauthorized" });
      }
    } catch (dbError) {
      logger.error("Database error in sendMessage (find):", dbError);
      if (process.env.ALLOW_DEMO !== "true") throw dbError;
      session = new ChatSession({ sessionId, userId, messages: [] });
    }

    // Create Inngest event for message processing
    const event: InngestEvent = {
      name: "therapy/session.message",
      data: {
        message,
        history: session.messages,
        memory: {
          userProfile: {
            emotionalState: [],
            riskLevel: 0,
            preferences: {},
          },
          sessionContext: {
            conversationThemes: [],
            currentTechnique: null,
          },
        },
        goals: [],
        systemPrompt: `You are an AI therapist assistant. Your role is to:
        1. Provide empathetic and supportive responses
        2. Use evidence-based therapeutic techniques
        3. Maintain professional boundaries
        4. Monitor for risk factors
        5. Guide users toward their therapeutic goals`,
      },
    };

    logger.info("Sending message to Inngest:", { event });

    // Send event to Inngest for logging and analytics (non-blocking)
    inngest.send(event).catch(err => logger.error("Inngest send error:", err));

    // Process the message directly using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze the message
    const analysisPrompt = `Analyze this therapy message and provide insights. Return ONLY a valid JSON object with no markdown formatting or additional text.
    Message: ${message}
    Context: ${JSON.stringify({
      memory: event.data.memory,
      goals: event.data.goals,
    })}
    
    Required JSON structure:
    {
      "emotionalState": "string",
      "themes": ["string"],
      "riskLevel": number,
      "recommendedApproach": "string",
      "progressIndicators": ["string"]
    }`;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text().trim();
    const cleanAnalysisText = analysisText
      .replace(/```json\n|\n```/g, "")
      .trim();
    const analysis = JSON.parse(cleanAnalysisText);

    logger.info("Message analysis:", analysis);

    // Generate therapeutic response
    const responsePrompt = `${event.data.systemPrompt}
    
    Based on the following context, generate a therapeutic response:
    Message: ${message}
    Analysis: ${JSON.stringify(analysis)}
    Memory: ${JSON.stringify(event.data.memory)}
    Goals: ${JSON.stringify(event.data.goals)}
    
    Provide a response that:
    1. Addresses the immediate emotional needs
    2. Uses appropriate therapeutic techniques
    3. Shows empathy and understanding
    4. Maintains professional boundaries
    5. Considers safety and well-being`;

    const responseResult = await model.generateContent(responsePrompt);
    const response = responseResult.response.text().trim();

    logger.info("Generated response:", response);

    // Add message to session history
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    session.messages.push({
      role: "assistant",
      content: response,
      timestamp: new Date(),
      metadata: {
        analysis,
        progress: {
          emotionalState: analysis.emotionalState,
          riskLevel: analysis.riskLevel,
        },
      },
    });

    // Save the updated session
    try {
      await session.save();
      logger.info("Session updated successfully:", { sessionId });
    } catch (saveError) {
      logger.error("Database error in sendMessage (save):", saveError);
      if (process.env.ALLOW_DEMO !== "true") throw saveError;
      logger.info("Skipping session save in demo mode");
    }

    // Return the response
    res.json({
      response,
      message: response,
      analysis,
      metadata: {
        progress: {
          emotionalState: analysis.emotionalState,
          riskLevel: analysis.riskLevel,
        },
      },
    });
  } catch (error) {
    logger.error("Error in sendMessage:", error);
    res.status(500).json({
      message: "Error processing message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get chat session history
export const getSessionHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = new Types.ObjectId(req.user.id);

    const session = (await ChatSession.findById(
      sessionId
    ).exec()) as IChatSession;
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      messages: session.messages,
      startTime: session.startTime,
      status: session.status,
    });
  } catch (error) {
    logger.error("Error fetching session history:", error);
    res.status(500).json({ message: "Error fetching session history" });
  }
};

export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    logger.info(`Getting chat session: ${sessionId}`);
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      logger.warn(`Chat session not found: ${sessionId}`);
      return res.status(404).json({ error: "Chat session not found" });
    }
    logger.info(`Found chat session: ${sessionId}`);
    res.json(chatSession);
  } catch (error) {
    logger.error("Failed to get chat session:", error);
    res.status(500).json({ error: "Failed to get chat session" });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = new Types.ObjectId(req.user.id);

    // Find session by sessionId instead of _id
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(session.messages);
  } catch (error) {
    logger.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};

export const getAllChatSessions = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    let sessions = [];

    try {
      sessions = await ChatSession.find({ userId }).sort({ startTime: -1 });
    } catch (dbError) {
      logger.error("Database error in getAllChatSessions:", dbError);
      if (process.env.ALLOW_DEMO === "true") {
        logger.info("Returning mock sessions for demo mode");
        sessions = [
          {
            _id: "mock-session-1",
            sessionId: "mock-uuid-1",
            userId: userId,
            startTime: new Date(),
            status: "active",
            messages: [
              { role: "user", content: "Hello", timestamp: new Date() },
              { role: "assistant", content: "Hi! How can I help you today?", timestamp: new Date() }
            ]
          }
        ];
      } else {
        throw dbError;
      }
    }

    const mappedSessions = sessions.map((session: any) => {
      const sessionData = session.toObject ? session.toObject() : session;
      return {
        ...sessionData,
        createdAt: sessionData.startTime || new Date(),
        updatedAt: sessionData.startTime || new Date(),
      };
    });

    res.json(mappedSessions);
  } catch (error) {
    logger.error("Error fetching all chat sessions:", error);
    res.status(500).json({ message: "Error fetching chat sessions" });
  }
};
