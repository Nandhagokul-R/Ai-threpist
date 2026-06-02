interface MoodEntry {
  score: number;
  note?: string;
}

interface MoodStats {
  average: number;
  count: number;
  highest: number;
  lowest: number;
  history: Array<{
    _id: string;
    score: number;
    note?: string;
    timestamp: string;
  }>;
}

export async function trackMood(
  data: MoodEntry
): Promise<{ success: boolean; data: any }> {
  try {
    // Get token from session storage first, then localStorage as fallback
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    
    if (!token) {
      console.error("Authentication token not found");
      return { success: false, data: { message: "Not authenticated" } };
    }

    const response = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to track mood" }));
      console.error("Mood tracking failed:", errorData);
      return { success: false, data: errorData };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in trackMood:", error);
    return { success: false, data: { message: "Failed to track mood" } };
  }
}

export async function getMoodHistory(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<{ success: boolean; data: any[] }> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const response = await fetch(`/api/mood/history?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood history");
  }

  return response.json();
}

export async function getMoodStats(
  period: "week" | "month" | "year" = "week"
): Promise<{
  success: boolean;
  data: MoodStats;
}> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`/api/mood/stats?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch mood statistics");
  }

  return response.json();
}
