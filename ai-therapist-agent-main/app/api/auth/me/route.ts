import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  // Mock user data for development - bypasses backend entirely
  if (process.env.NODE_ENV !== "production") {
    console.log("Mock /auth/me called with token:", token.substring(0, 20) + "...");
    
    return NextResponse.json({
      user: {
        _id: "mock-user-id",
        name: "Demo User",
        email: "demo@example.com",
      }
    });
  }

  // Production: use real backend
  const API_URL =
    process.env.BACKEND_API_URL ||
    "https://ai-therapist-agent-backend.onrender.com";

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
