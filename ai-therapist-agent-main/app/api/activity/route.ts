import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, name, description, duration } = body;

    if (!type || !name) {
      return NextResponse.json(
        { error: "Type and name are required" },
        { status: 400 }
      );
    }

    // Mock activity logging for development - bypasses backend entirely
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock activity logged:", { type, name, description, duration });

      // Simulate a small delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock success response
      return NextResponse.json({
        success: true,
        message: "Activity logged successfully",
        activity: {
          id: "mock-activity-" + Date.now(),
          userId: "mock-user-id",
          type,
          name,
          description,
          duration,
          timestamp: new Date().toISOString(),
        }
      });
    }

    // Production: use real backend
    const API_URL =
      process.env.BACKEND_API_URL ||
      "https://ai-therapist-agent-backend.onrender.com";

    const response = await fetch(`${API_URL}/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ type, name, description, duration }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to log activity" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization");
  // Allow deletion without token in dev mode for mock data
  if (!token && process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Activity ID is required" }, { status: 400 });
    }

    // Mock deletion for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock activity deletion requested for:", id);

      // Try to remove from mood store first
      const { moodStore } = await import("@/lib/mood-store");
      const removed = moodStore.remove(id);

      if (removed) {
        console.log("Removed from mood store");
      } else {
        console.log("Not found in mood store (might be a static mock activity)");
      }

      return NextResponse.json({
        success: true,
        message: "Activity deleted successfully"
      });
    }

    // Production: use real backend
    const API_URL =
      process.env.BACKEND_API_URL ||
      "https://ai-therapist-agent-backend.onrender.com";

    const response = await fetch(`${API_URL}/api/activity/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete activity" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
