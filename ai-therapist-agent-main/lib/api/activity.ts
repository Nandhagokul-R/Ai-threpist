interface ActivityEntry {
  type: string;
  name: string;
  description?: string;
  duration?: number;
}

export async function logActivity(
  data: ActivityEntry
): Promise<{ success: boolean; data: any }> {
  try {
    // Get token from session storage first, then localStorage as fallback
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    
    if (!token) {
      console.error("Authentication token not found");
      return { success: false, data: { message: "Not authenticated" } };
    }

    const response = await fetch("/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to log activity" }));
      console.error("Activity logging failed:", errorData);
      return { success: false, data: errorData };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in logActivity:", error);
    return { success: false, data: { message: "Failed to log activity" } };
  }
}
