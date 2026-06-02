import { Request, Response, NextFunction } from "express";
import { Activity, IActivity } from "../models/Activity";
import { Mood, IMood } from "../models/Mood";
import { logger } from "../utils/logger";
import { sendActivityCompletionEvent } from "../utils/inngestEvents";

// Log a new activity
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty, feedback } =
      req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // Send activity completion event to Inngest
    await sendActivityCompletionEvent({
      userId,
      id: activity._id,
      type,
      name,
      duration,
      difficulty,
      feedback,
      timestamp: activity.timestamp,
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// Get user history (combined mood and activities)
export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // specific filtering
    const { startDate, endDate, type } = req.query;
    const query: any = { userId };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    // Fetch activities and moods in parallel
    const [activities, moods] = await Promise.all([
      Activity.find(query).sort({ timestamp: -1 }).lean(),
      Mood.find(query).sort({ timestamp: -1 }).lean()
    ]);

    // Format and combine
    const formattedActivities = activities.map((a: any) => ({
      ...a,
      kind: 'activity'
    }));

    const formattedMoods = moods.map((m: any) => ({
      ...m,
      type: 'mood',
      name: 'Mood Check-in',
      description: m.note || `Mood score: ${m.score}`,
      kind: 'mood',
      moodScore: m.score
    }));

    // Filter by type if requested
    let combined = [...formattedActivities, ...formattedMoods];
    if (type && type !== 'all') {
      combined = combined.filter((item: any) => {
        if (type === 'mood') return item.kind === 'mood';
        return item.type === type;
      });
    }

    // Sort combined list
    combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.status(200).json({
      success: true,
      data: combined
    });
  } catch (error) {
    next(error);
  }
};
