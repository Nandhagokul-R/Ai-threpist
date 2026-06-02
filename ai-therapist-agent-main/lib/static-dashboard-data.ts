// Static data for the dashboard
const staticChatHistory = [
  {
    id: "1",
    userId: "user1",
    message: "Hi, how are you feeling today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sentiment: "positive",
    context: null,
  },
  {
    id: "2",
    userId: "user1",
    message: "I'm feeling a bit anxious about my presentation tomorrow.",
    role: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    sentiment: "negative",
    context: null,
  },
  {
    id: "3",
    userId: "user1",
    message:
      "I understand presentations can be stressful. Would you like to try a quick breathing exercise together?",
    role: "assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    sentiment: "neutral",
    context: null,
  },
];

const staticSessions = [
  {
    id: "1",
    userId: "user1",
    title: "First Therapy Session",
    status: "completed",
    summary: "Discussed anxiety management techniques",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "2",
    userId: "user1",
    title: "Follow-up Session",
    status: "scheduled",
    summary: "",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

const generateMockHistory = () => {
  const activities = [];
  const today = new Date();
  const activitiesList = [
    { type: "meditation", name: "Morning Calm", desc: "10 min breathing" },
    { type: "game", name: "Bubble Pop", desc: "Stress relief game" },
    { type: "journal", name: "Evening Reflection", desc: "Daily gratitude" },
    { type: "exercise", name: "Yoga Flow", desc: "15 min stretching" },
    { type: "therapy", name: "Chat Session", desc: "Discussed improved sleep" }
  ];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 1-3 activities per day, sometimes 0 for realism
    if (Math.random() > 0.8) continue;

    const dailyCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < dailyCount; j++) {
      const activityTemplate = activitiesList[Math.floor(Math.random() * activitiesList.length)];
      // Simulate mood trends: lower in the past (i > 20), improving recently
      const baseMood = i > 20 ? 40 : 60;
      const moodScore = Math.floor(Math.random() * 30) + baseMood;

      activities.push({
        id: `mock-${i}-${j}`,
        userId: "default-user",
        type: activityTemplate.type,
        name: activityTemplate.name,
        description: activityTemplate.desc,
        timestamp: new Date(date.setHours(9 + j * 3)),
        duration: 15,
        completed: true,
        moodScore: activityTemplate.type === 'journal' ? moodScore : null,
        moodNote: activityTemplate.type === 'journal' ? "Feeling better" : null,
        createdAt: new Date(date),
        updatedAt: new Date(date),
      });

      // Add specific mood check-in
      if (j === 0) {
        activities.push({
          id: `mood-${i}`,
          userId: "default-user",
          type: "mood",
          name: "Daily Mood Log",
          description: "Check-in",
          timestamp: new Date(date.setHours(8)),
          duration: 0,
          completed: true,
          moodScore: Math.floor(Math.random() * 20) + baseMood,
          moodNote: "Reflecting on the day",
          createdAt: new Date(date),
          updatedAt: new Date(date),
        });
      }
    }
  }
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const staticActivities = generateMockHistory();

export const getSessionChatHistory = async (sessionId: string) => {
  return staticChatHistory;
};

export const saveChatMessage = async (data: {
  userId: string;
  message: string;
  role: "user" | "assistant";
  context?: any;
}) => {
  const newMessage = {
    id: Math.random().toString(36).substr(2, 9),
    userId: data.userId,
    message: data.message,
    role: data.role,
    timestamp: new Date(),
    sentiment: "neutral",
    context: data.context,
  };
  staticChatHistory.push(newMessage);
  return newMessage;
};

export const updateSessionStatus = async (
  sessionId: string,
  status: string
) => {
  const session = staticSessions.find((s) => s.id === sessionId);
  if (session) {
    session.status = status;
    session.updatedAt = new Date();
  }
  return session;
};

export const updateTherapySession = async (
  sessionId: string,
  data: {
    status?: string;
    summary?: string;
    title?: string;
  }
) => {
  const session = staticSessions.find((s) => s.id === sessionId);
  if (session) {
    if (data.status) session.status = data.status;
    if (data.summary) session.summary = data.summary;
    if (data.title) session.title = data.title;
    session.updatedAt = new Date();
  }
  return session;
};

export const getTodaysActivities = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return staticActivities.filter(
    (activity) =>
      activity.userId === userId &&
      activity.timestamp >= today &&
      activity.timestamp < new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );
};

export const updateActivityStatus = async (
  activityId: string,
  completed: boolean
) => {
  const activity = staticActivities.find((a) => a.id === activityId);
  if (activity) {
    activity.completed = completed;
    activity.updatedAt = new Date();
  }
  return activity;
};

export const getLatestHealthMetrics = async (userId: string) => {
  return {
    heartRate: 72,
    steps: 5432,
    sleepHours: 7.5,
    stressLevel: "low",
  };
};

export const getUserActivities = async (userId: string) => {
  return staticActivities.filter((activity) => activity.userId === userId);
};

export const saveMoodData = async (data: {
  userId: string;
  mood: number;
  note?: string;
}) => {
  const newActivity = {
    id: Math.random().toString(36).substr(2, 9),
    userId: data.userId,
    type: "mood",
    name: "Mood Check-in",
    description: data.note || "",
    timestamp: new Date(),
    duration: 0,
    completed: true,
    moodScore: data.mood,
    moodNote: data.note || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  staticActivities.push(newActivity);
  return newActivity;
};

export const logActivity = async (data: {
  userId: string;
  type: string;
  name: string;
  description?: string;
  duration?: number;
}) => {
  const newActivity = {
    id: Math.random().toString(36).substr(2, 9),
    userId: data.userId,
    type: data.type,
    name: data.name,
    description: data.description || "",
    timestamp: new Date(),
    duration: data.duration || 0,
    completed: false,
    moodScore: 0,
    moodNote: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  staticActivities.push(newActivity);
  return newActivity;
};
