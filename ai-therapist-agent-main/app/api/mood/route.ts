import { NextRequest, NextResponse } from "next/server";
import { moodStore } from "@/lib/mood-store";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { score, note } = body;

    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Invalid mood score" },
        { status: 400 }
      );
    }

    // Mock mood tracking for development - stores data for retrieval
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock mood tracked:", { score, note });
      
      // Simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const moodActivity = {
        id: "mood-" + Date.now(),
        userId: "mock-user-id",
        type: "mood",
        name: "Mood Check-in",
        description: note || `Mood score: ${score}`,
        timestamp: new Date().toISOString(),
        moodScore: score,
        completed: true,
        duration: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("Created mood activity with score:", score);
      console.log("Full mood activity:", moodActivity);
      
      // Store the mood activity so it persists
      moodStore.add(moodActivity);
      
      // Return mock success response with activity data
      return NextResponse.json({
        success: true,
        message: "Mood tracked successfully",
        mood: moodActivity,
        activity: moodActivity
      });
    }

    // Production: use real backend
    const API_URL =
      process.env.BACKEND_API_URL ||
      "https://ai-therapist-agent-backend.onrender.com";

    const response = await fetch(`${API_URL}/api/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ score, note }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to track mood" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error tracking mood:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
