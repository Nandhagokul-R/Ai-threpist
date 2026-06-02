// Shared in-memory store for mood activities in development mode
// This allows mood data to persist between API calls during the same server session

export interface MoodActivity {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  timestamp: string;
  moodScore: number;
  completed: boolean;
  duration: null;
  createdAt: string;
  updatedAt: string;
}

class MoodStore {
  private activities: MoodActivity[] = [];

  add(activity: MoodActivity) {
    this.activities.push(activity);
    console.log(`[MoodStore] Added mood activity. Total: ${this.activities.length}`);
    console.log(`[MoodStore] Activity:`, activity);
  }

  getTodaysMoods(): MoodActivity[] {
    const today = new Date().setHours(0, 0, 0, 0);
    const todaysMoods = this.activities.filter(mood => {
      const moodDate = new Date(mood.timestamp).setHours(0, 0, 0, 0);
      return moodDate === today;
    });
    console.log(`[MoodStore] Retrieved ${todaysMoods.length} moods for today`);
    return todaysMoods;
  }

  getAll(): MoodActivity[] {
    return this.activities;
  }

  clear() {
    this.activities = [];
    console.log('[MoodStore] Cleared all mood activities');
  }

  remove(id: string) {
    const initialLength = this.activities.length;
    this.activities = this.activities.filter(a => a.id !== id);
    if (this.activities.length < initialLength) {
      console.log(`[MoodStore] Removed activity ${id}. Remaining: ${this.activities.length}`);
      return true;
    }
    return false;
  }
}

// Export a singleton instance
export const moodStore = new MoodStore();
