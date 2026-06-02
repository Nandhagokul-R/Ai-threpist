import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // Mock login for development - bypasses backend entirely
  if (process.env.NODE_ENV !== "production") {
    console.log("Mock login for:", email);
    
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock user data
    return NextResponse.json({
      user: {
        _id: "mock-user-id",
        name: "Demo User",
        email: email,
      },
      token: "mock-jwt-token-" + Date.now(),
      message: "Login successful (mock mode)",
    });
  }

  // Production: use real backend
  const API_URL =
    process.env.BACKEND_API_URL ||
    "https://ai-therapist-agent-backend.onrender.com";

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
