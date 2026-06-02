"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  Activity,
  Sun,
  Moon,
  Heart,
  Trophy,
  Bell,
  AlertCircle,
  PhoneCall,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  ArrowRight,
  X,
  Loader2,
  Car,
  Gamepad2,
  Clock,
  Target,
  Award,
  TrendingUp,
  Music,
  Trash2,
  Hammer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

import { MoodForm } from "@/components/mood/mood-form";
import { AnxietyGames } from "@/components/games/anxiety-games";

import {
  getUserActivities,
  saveMoodData,
  logActivity,
} from "@/lib/static-dashboard-data";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  addDays,
  format,
  subDays,
  startOfDay,
  isWithinInterval,
} from "date-fns";

import { ActivityLogger } from "@/components/activities/activity-logger";
import { useSession } from "@/lib/contexts/session-context";
import { getAllChatSessions } from "@/lib/api/chat";
import { useToast } from "@/components/ui/use-toast";
import { PaimonCompanion } from "@/components/ui/paimon-companion";

// Add this type definition
type ActivityLevel = "none" | "low" | "medium" | "high";

interface DayActivity {
  date: Date;
  level: ActivityLevel;
  activities: {
    type: string;
    name: string;
    completed: boolean;
    time?: string;
  }[];
}

// Add this interface near the top with other interfaces
interface Activity {
  id: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: Date;
  duration: number | null;
  completed: boolean;
  moodScore: number | null;
  moodNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Add this interface for stats
interface DailyStats {
  moodScore: number | null;
  completionRate: number;
  mindfulnessCount: number;
  totalActivities: number;
  lastUpdated: Date;
}

// Update the calculateDailyStats function to show correct stats
const calculateDailyStats = (activities: Activity[]): DailyStats => {
  const today = startOfDay(new Date());
  const todaysActivities = activities.filter((activity) =>
    isWithinInterval(new Date(activity.timestamp), {
      start: today,
      end: addDays(today, 1),
    })
  );

  // Calculate mood score (average of today's mood entries)
  const moodEntries = todaysActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null
  );
  const averageMood =
    moodEntries.length > 0
      ? Math.round(
        moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
        moodEntries.length
      )
      : null;

  // Count therapy sessions (all sessions ever)
  const therapySessions = activities.filter((a) => a.type === "therapy").length;

  return {
    moodScore: averageMood,
    completionRate: 100, // Always 100% as requested
    mindfulnessCount: therapySessions, // Total number of therapy sessions
    totalActivities: todaysActivities.length,
    lastUpdated: new Date(),
  };
};

// Rename the function
const generateInsights = (activities: Activity[]) => {
  const insights: {
    title: string;
    description: string;
    icon: any;
    priority: "low" | "medium" | "high";
  }[] = [];

  // Get activities from last 7 days
  const lastWeek = subDays(new Date(), 7);
  const recentActivities = activities.filter(
    (a) => new Date(a.timestamp) >= lastWeek
  );

  // Analyze mood patterns
  const moodEntries = recentActivities.filter(
    (a) => a.type === "mood" && a.moodScore !== null
  );
  if (moodEntries.length >= 2) {
    const averageMood =
      moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0) /
      moodEntries.length;
    const latestMood = moodEntries[moodEntries.length - 1].moodScore || 0;

    if (latestMood > averageMood) {
      insights.push({
        title: "Mood Improvement",
        description:
          "Your recent mood scores are above your weekly average. Keep up the good work!",
        icon: Brain,
        priority: "high",
      });
    } else if (latestMood < averageMood - 20) {
      insights.push({
        title: "Mood Change Detected",
        description:
          "I've noticed a dip in your mood. Would you like to try some mood-lifting activities?",
        icon: Heart,
        priority: "high",
      });
    }
  }

  // Analyze activity patterns
  const mindfulnessActivities = recentActivities.filter((a) =>
    ["game", "meditation", "breathing"].includes(a.type)
  );
  if (mindfulnessActivities.length > 0) {
    const dailyAverage = mindfulnessActivities.length / 7;
    if (dailyAverage >= 1) {
      insights.push({
        title: "Consistent Practice",
        description: `You've been regularly engaging in mindfulness activities. This can help reduce stress and improve focus.`,
        icon: Trophy,
        priority: "medium",
      });
    } else {
      insights.push({
        title: "Mindfulness Opportunity",
        description:
          "Try incorporating more mindfulness activities into your daily routine.",
        icon: Sparkles,
        priority: "low",
      });
    }
  }

  // Check activity completion rate
  const completedActivities = recentActivities.filter((a) => a.completed);
  const completionRate =
    recentActivities.length > 0
      ? (completedActivities.length / recentActivities.length) * 100
      : 0;

  if (completionRate >= 80) {
    insights.push({
      title: "High Achievement",
      description: `You've completed ${Math.round(
        completionRate
      )}% of your activities this week. Excellent commitment!`,
      icon: Trophy,
      priority: "high",
    });
  } else if (completionRate < 50) {
    insights.push({
      title: "Activity Reminder",
      description:
        "You might benefit from setting smaller, more achievable daily goals.",
      icon: Calendar,
      priority: "medium",
    });
  }

  // Time pattern analysis
  const morningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() < 12
  );
  const eveningActivities = recentActivities.filter(
    (a) => new Date(a.timestamp).getHours() >= 18
  );

  if (morningActivities.length > eveningActivities.length) {
    insights.push({
      title: "Morning Person",
      description:
        "You're most active in the mornings. Consider scheduling important tasks during your peak hours.",
      icon: Sun,
      priority: "medium",
    });
  } else if (eveningActivities.length > morningActivities.length) {
    insights.push({
      title: "Evening Routine",
      description:
        "You tend to be more active in the evenings. Make sure to wind down before bedtime.",
      icon: Moon,
      priority: "medium",
    });
  }

  // Sort insights by priority and return top 3
  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { user } = useSession();
  const { toast } = useToast();

  // Rename the state variable
  const [insights, setInsights] = useState<
    {
      title: string;
      description: string;
      icon: any;
      priority: "low" | "medium" | "high";
    }[]
  >([]);

  // New states for activities and wearables
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showCheckInChat, setShowCheckInChat] = useState(false);
  const [activityHistory, setActivityHistory] = useState<DayActivity[]>([]);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [isSavingActivity, setIsSavingActivity] = useState(false);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const skipNextFetchRef = useRef(false);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    moodScore: null,
    completionRate: 100,
    mindfulnessCount: 0,
    totalActivities: 0,
    lastUpdated: new Date(),
  });

  // Add this function to transform activities into day activity format
  const transformActivitiesToDayActivity = (
    activities: Activity[]
  ): DayActivity[] => {
    const days: DayActivity[] = [];
    const today = new Date();

    // Create array for last 28 days
    for (let i = 27; i >= 0; i--) {
      const date = startOfDay(subDays(today, i));
      const dayActivities = activities.filter((activity) =>
        isWithinInterval(new Date(activity.timestamp), {
          start: date,
          end: addDays(date, 1),
        })
      );

      // Determine activity level based on number of activities
      let level: ActivityLevel = "none";
      if (dayActivities.length > 0) {
        if (dayActivities.length <= 2) level = "low";
        else if (dayActivities.length <= 4) level = "medium";
        else level = "high";
      }

      days.push({
        date,
        level,
        activities: dayActivities.map((activity) => ({
          type: activity.type,
          name: activity.name,
          completed: activity.completed,
          time: format(new Date(activity.timestamp), "h:mm a"),
        })),
      });
    }

    return days;
  };

  // Modify the loadActivities function to use the same API as My Day page
  const loadActivities = useCallback(async () => {
    // Skip if we just updated locally to prevent overwriting
    if (skipNextFetchRef.current) {
      console.log('Skipping activities load - using local data');
      return;
    }

    try {
      // Use the same API endpoint as My Day page
      const response = await fetch('/api/activities/today', {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const activitiesData = await response.json();
        // Convert string timestamps to Date objects for dashboard compatibility
        const convertedActivities = activitiesData.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
          createdAt: new Date(activity.timestamp),
          updatedAt: new Date(activity.timestamp)
        }));
        setActivities(convertedActivities);
        setActivityHistory(transformActivitiesToDayActivity(convertedActivities));
      } else {
        console.error('Failed to fetch activities from API');
        // Fallback to static data
        const userActivities = await getUserActivities("default-user");
        setActivities(userActivities);
        setActivityHistory(transformActivitiesToDayActivity(userActivities));
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      // Fallback to static data
      try {
        const userActivities = await getUserActivities("default-user");
        setActivities(userActivities);
        setActivityHistory(transformActivitiesToDayActivity(userActivities));
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Add this effect to update stats when activities change
  // But SKIP if we just manually updated (to prevent overwriting)
  useEffect(() => {
    if (activities.length > 0 && !skipNextFetchRef.current) {
      console.log('Activities changed - recalculating stats from activities array');
      setDailyStats(calculateDailyStats(activities));
    } else if (skipNextFetchRef.current) {
      console.log('Skipping stats recalculation - manual update in progress');
    }
  }, [activities]);

  // Update the effect
  useEffect(() => {
    if (activities.length > 0) {
      setInsights(generateInsights(activities));
    }
  }, [activities]);

  // Fetch therapy sessions for stats
  const fetchTherapySessions = useCallback(async () => {
    try {
      const sessions = await getAllChatSessions();
      // Update only the therapy sessions count, preserve other stats
      setDailyStats((prev) => ({
        ...prev,
        mindfulnessCount: sessions.length,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error("Error fetching therapy sessions:", error);
    }
  }, []);

  // Fetch therapy sessions on mount and every 5 minutes
  useEffect(() => {
    fetchTherapySessions();
    const interval = setInterval(fetchTherapySessions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTherapySessions]);

  // Update wellness stats to reflect the changes
  console.log('=== DASHBOARD RENDER ===');
  console.log('Rendering dashboard with dailyStats:', dailyStats);
  console.log('Mood Score value:', dailyStats.moodScore);
  console.log('Activities array:', activities);

  const wellnessStats = [
    {
      title: "Mood Score",
      value: dailyStats.moodScore !== null ? `${dailyStats.moodScore}%` : "No data",
      icon: Brain,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-pink-500/10 backdrop-blur-sm border border-indigo-100 dark:border-indigo-500/20",
      description: "Today's average mood",
    },
    {
      title: "Completion Rate",
      value: "100%",
      icon: Trophy,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-cyan-500/10 backdrop-blur-sm border border-emerald-100 dark:border-emerald-500/20",
      description: "Perfect completion rate",
    },
    {
      title: "Total Activities",
      value: dailyStats.totalActivities.toString(),
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-500/15 dark:via-cyan-500/15 dark:to-sky-500/10 backdrop-blur-sm border border-blue-100 dark:border-blue-500/20",
      description: "Planned for today",
    },
  ];

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // My Day navigation removed

  const handleAICheckIn = () => {
    setShowActivityLogger(true);
  };

  // Add handler for game activities
  const handleGamePlayed = useCallback(
    async (gameName: string, description: string) => {
      try {
        await logActivity({
          userId: "default-user",
          type: "game",
          name: gameName,
          description: description,
          duration: 0,
        });

        // Refresh activities after logging
        loadActivities();
      } catch (error) {
        console.error("Error logging game activity:", error);
      }
    },
    [loadActivities]
  );

  // Add handler for deleting activities
  const handleDeleteActivity = async (id: string) => {
    try {
      // Optimistic update
      setActivities(prev => prev.filter(a => a.id !== id));

      // Also update stats immediately
      const updatedActivities = activities.filter(a => a.id !== id);
      setDailyStats(calculateDailyStats(updatedActivities));

      // Prevent next API fetch from overwriting our local data
      skipNextFetchRef.current = true;
      setTimeout(() => {
        skipNextFetchRef.current = false;
      }, 5000);

      const response = await fetch(`/api/activity?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      toast({
        title: "Activity deleted",
        description: "The activity has been removed from your history.",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      });
      // Revert optimistic update if failed (optional, but good practice)
      loadActivities();
    }
  };

  // Simple loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Centered Bloom Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Outermost large bloom */}
        <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-r from-indigo-500/8 via-purple-500/8 to-transparent blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        {/* Mid bloom */}
        <div className="absolute w-[650px] h-[650px] rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        {/* Inner bloom */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
        {/* Core accent bloom */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent blur-2xl animate-float" style={{ animationDelay: '-1s' }} />
      </div>

      <Container className="pt-20 pb-8 space-y-6 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.name || "there"}
              </h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="h-10 w-10 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Actions Card */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80">
              <div className="border-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
                <CardContent className="p-6 relative">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Quick Actions</h3>
                        <p className="text-sm text-muted-foreground">
                          Start your wellness journey
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Button
                        variant="animated"
                        size="lg"
                        className="w-full justify-between items-center p-6 h-auto relative overflow-hidden group/history"
                        onClick={() => router.push('/history')}
                      >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/history:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-white text-base">
                              View Wellness History
                            </div>
                            <div className="text-xs text-white/90">
                              Track mood trends & progress
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover/history:translate-x-1 transition-transform relative z-10" />
                      </Button>
                      <Button
                        variant="animated"
                        size="lg"
                        className="w-full justify-between items-center p-6 h-auto"
                        onClick={() => window.open('http://localhost:5173', '_blank')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white text-base">
                              Aura Therapy
                            </div>
                            <div className="text-xs text-white/90">
                              Begin a new session
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        variant="neon"
                        size="lg"
                        className="w-full justify-between items-center p-6 h-auto mt-3"
                        onClick={() => router.push('/quiz')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white text-base">
                              Mental Health Quiz
                            </div>
                            <div className="text-xs text-white/90">
                              Assess anxiety & depression
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        variant="success"
                        size="lg"
                        className="w-full justify-between items-center p-6 h-auto mt-3"
                        onClick={() => window.open('https://open.spotify.com/', '_blank')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
                            {/* Enhanced Spotify Icon SVG */}
                            <svg className="w-5 h-5 text-white" viewBox="0 0 167.5 167.5" fill="currentColor">
                              <path d="M83.7 0C37.5 0 0 37.5 0 83.7c0 46.3 37.5 83.7 83.7 83.7 46.3 0 83.7-37.5 83.7-83.7C167.5 37.5 130 0 83.7 0zM122.5 121c-1.5 2.5-4.7 3.2-7.2 1.7-19.8-12-44.5-14.2-73.7-7.8-2.8.5-5.3-1.2-5.8-4-.5-2.8 1.3-5.2 4-5.8 32-7.3 59.6-5 82 8.2 2.5 1.5 3.2 4.7 1.7 7.2zm8.3-20.4c-2 3-6 4-9 2.3-22.6-13.8-56.8-17.8-83.4-9.7-3.3 1-7-1.2-8-4.5s1.2-7 4.5-8c30.4-9.7 68.3-5.2 94 11 3 2 4 6 2 9zm.5-21.1C104.8 66.2 58.3 65.4 34.2 75.8c-4 1.7-8.7-.3-10.3-4.3-1.7-4 .3-8.7 4.3-10.3 28-11.8 79.5-12.5 108.3 2.5 3.5 1.8 5 6 3.2 9.5-1.8 3.5-6 5-9.5 3.2z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white text-base">
                              Spotify Therapy
                            </div>
                            <div className="text-xs text-white/90 font-medium">
                              Curated wellness playlists for your mood
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        variant="premium"
                        size="lg"
                        className="w-full justify-between items-center p-6 h-auto mt-3"
                        onClick={() => {
                          // Create and trigger fire sparkle animation
                          const createSparkle = (x: number, y: number) => {
                            const sparkle = document.createElement('div');
                            sparkle.innerHTML = '🔥';
                            sparkle.style.position = 'fixed';
                            sparkle.style.left = `${x}px`;
                            sparkle.style.top = `${y}px`;
                            sparkle.style.fontSize = '24px';
                            sparkle.style.pointerEvents = 'none';
                            sparkle.style.zIndex = '9999';
                            sparkle.style.transition = 'all 1s ease-out';
                            document.body.appendChild(sparkle);

                            // Animate
                            requestAnimationFrame(() => {
                              sparkle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(0)`;
                              sparkle.style.opacity = '0';
                            });

                            // Cleanup
                            setTimeout(() => sparkle.remove(), 1000);
                          };

                          // Create multiple sparkles
                          const rect = (document.activeElement as HTMLElement).getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;

                          for (let i = 0; i < 10; i++) {
                            setTimeout(() => createSparkle(centerX, centerY), i * 50);
                          }

                          // Open link after a short delay
                          setTimeout(() => {
                            window.open('https://motivation.com/posts', '_blank');
                          }, 500);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center backdrop-blur-sm group-hover:animate-bounce">
                            <span className="text-lg">🔥</span>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-amber-950 text-base">
                              Boost your Mind
                            </div>
                            <div className="text-xs text-amber-900/80 font-medium">
                              Get inspired and motivated
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-amber-950 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="soft"
                        className="flex flex-col h-[120px] px-4 py-3 justify-center items-center text-center"
                        onClick={() => setShowMoodModal(true)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-2 shadow-md shadow-rose-500/30">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Track Mood</div>
                          <div className="text-xs opacity-80 mt-0.5">
                            How are you feeling?
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="glass"
                        className="flex flex-col h-[120px] px-4 py-3 justify-center items-center text-center"
                        onClick={handleAICheckIn}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-2 shadow-md shadow-blue-500/30">
                          <BrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Check-in</div>
                          <div className="text-xs opacity-80 mt-0.5">
                            Quick wellness check
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Today's Overview Card */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80">
              <div className="border-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Overview</CardTitle>
                      <CardDescription>
                        Your wellness metrics for{" "}
                        {format(new Date(), "MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={loadActivities}
                      className="h-8 w-8"
                      title="Refresh activities"
                    >
                      <Loader2 className={cn("h-4 w-4", "animate-spin")} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {wellnessStats.map((stat) => (
                      <div
                        key={stat.title}
                        className={cn(
                          "p-4 rounded-lg transition-all duration-300",
                          "transform hover:scale-105 hover:-translate-y-1",
                          "shadow-lg hover:shadow-xl",
                          "border border-white/10",
                          stat.bgColor
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                          <p className="text-sm font-medium">{stat.title}</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {stat.value}
                          {stat.title === "Mood Score" && (
                            <span className="text-xs ml-2 text-muted-foreground">
                              (Updated: {format(dailyStats.lastUpdated, "h:mm:ss a")})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-right">
                    Last updated: {format(dailyStats.lastUpdated, "h:mm a")}
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Insights Card */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80">
              <div className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Insights
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your activity patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.length > 0 ? (
                      insights.map((insight, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-lg space-y-2 transition-all hover:scale-[1.02]",
                            insight.priority === "high"
                              ? "bg-primary/10"
                              : insight.priority === "medium"
                                ? "bg-primary/5"
                                : "bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <insight.icon className="w-5 h-5 text-primary" />
                            <p className="font-medium">{insight.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p>
                          Complete more activities to receive personalized
                          insights
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wellness Games Section */}
              <Card className="transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80">
                <div className="border-primary/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/30">
                          <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>Wellness Games</CardTitle>
                          <CardDescription>
                            Relax and have fun with our therapeutic games
                          </CardDescription>
                        </div>
                      </div>
                      <Link href="/games">
                        <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                          <span className="flex items-center gap-2">
                            Play Games
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Car Race Game Card */}
                      <Card>
                        <Card className="group relative overflow-hidden border border-blue-200 dark:border-blue-500/30 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-500/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-2">
                              <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              Car Race
                            </CardTitle>
                            <CardDescription>Speed through traffic in a fast-paced car race.</CardDescription>
                          </CardHeader>
                          <CardContent className="relative z-10 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Single-player arcade</div>
                            <Button asChild className="group-hover:scale-105 transition-transform duration-300">
                              <Link href="/car-race" target="_blank" rel="noopener noreferrer" prefetch={false}>
                                Play
                              </Link>
                            </Button>
                          </CardContent>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Card>
                      </Card>

                      {/* Flappy Bird Game Card */}
                      <Card>
                        <Card className="group relative overflow-hidden border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-500/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-2">
                              <Gamepad2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              Flappy Bird
                            </CardTitle>
                            <CardDescription>Navigate through obstacles while maintaining focus and calm.</CardDescription>
                          </CardHeader>
                          <CardContent className="relative z-10 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Mindfulness & Focus</div>
                            <Button asChild className="group-hover:scale-105 transition-transform duration-300">
                              <Link href="/games/bird" target="_blank" rel="noopener noreferrer" prefetch={false}>
                                Play
                              </Link>
                            </Button>
                          </CardContent>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Card>
                      </Card>

                      {/* Horizon Drive Game Card */}
                      <Card>
                        <Card className="group relative overflow-hidden border border-green-200 dark:border-green-500/30 hover:border-green-300 dark:hover:border-green-500/50 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-green-200/50 dark:hover:shadow-green-500/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-2">
                              <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                              Horizon Drive
                            </CardTitle>
                            <CardDescription>Experience the thrill of driving through scenic horizons and landscapes.</CardDescription>
                          </CardHeader>
                          <CardContent className="relative z-10 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Adventure racing</div>
                            <Button asChild className="group-hover:scale-105 transition-transform duration-300">
                              <Link href="https://shopify.com/editions/summer2025/drive" target="_blank" rel="noopener noreferrer" prefetch={false}>
                                Play
                              </Link>
                            </Button>
                          </CardContent>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Card>
                      </Card>
                    </div>
                  </CardContent>
                </div>
              </Card>



              {/* Anxiety Games - Now at the bottom */}
              <AnxietyGames onGamePlayed={handleGamePlayed} />

              {/* Break Your Stress - Voxel Toy Box */}
              <Card
                className="mt-6 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80 overflow-hidden relative group cursor-pointer border-primary/20"
                onClick={() => window.open('https://gesture-control-voxel-toy-box.vercel.app', '_blank')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-all duration-500 animate-pulse" />
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500 animate-pulse" style={{ animationDelay: '1s' }} />

                <CardContent className="p-8 relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                      <Hammer className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 mb-2">
                        Break your Stress
                      </h3>
                      <p className="text-muted-foreground text-lg max-w-md">
                        Unleash your creativity and smash away stress in the Voxel Toy Box!
                      </p>
                    </div>
                  </div>

                  <div className="h-14 w-14 rounded-full border-2 border-fuchsia-500/30 flex items-center justify-center group-hover:border-fuchsia-500 group-hover:bg-fuchsia-500 transition-all duration-300 shadow-sm group-hover:shadow-fuchsia-500/50">
                    <ArrowRight className="w-7 h-7 text-fuchsia-500 group-hover:text-white transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Activity Tracker */}
            <div className="space-y-6">
              <Card className="h-full transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-md bg-card/80">
                <div className="border-primary/10 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Activity Tracker
                    </CardTitle>
                    <CardDescription>
                      Your recent wellness activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto max-h-[600px] pr-2">
                    <div className="space-y-4">
                      {activities.filter(activity => activity.type !== 'therapy').length > 0 ? (
                        activities.filter(activity => activity.type !== 'therapy').slice(0, 10).map((activity, index) => (
                          <div
                            key={activity.id || index}
                            className="group flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors relative"
                          >
                            <div className={`mt-1 p-1.5 rounded-full ${activity.type === 'mood' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                              activity.type === 'game' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                activity.type === 'therapy' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-primary/10 text-primary'
                              }`}>
                              {activity.type === 'mood' ? <Heart className="w-3 h-3" /> :
                                activity.type === 'game' ? <Gamepad2 className="w-3 h-3" /> :
                                  activity.type === 'therapy' ? <MessageSquare className="w-3 h-3" /> :
                                    <Activity className="w-3 h-3" />}
                            </div>
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium leading-none">
                                {activity.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.description || 'Activity completed'}
                              </p>
                              <p className="text-[10px] text-muted-foreground/70">
                                {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activity.id) handleDeleteActivity(activity.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">No activities yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>

      {/* Mood tracking modal */}
      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Move the slider to track your current mood
            </DialogDescription>
          </DialogHeader>
          <MoodForm onSuccess={(moodScore) => {
            console.log('=== MOOD FORM SUCCESS CALLBACK ===');
            console.log('Received mood score:', moodScore);
            console.log('Current activities count:', activities.length);
            console.log('Current dailyStats BEFORE update:', dailyStats);

            // Create mood activity immediately
            const newMoodActivity: Activity = {
              id: `mood-${Date.now()}`,
              userId: (user as any)?.id || "default-user",
              type: 'mood',
              name: 'Mood Check-in',
              description: `Mood score: ${moodScore}`,
              timestamp: new Date(),
              duration: null,
              completed: true,
              moodScore: moodScore,
              moodNote: '',
              createdAt: new Date(),
              updatedAt: new Date()
            };

            console.log('Created new mood activity:', newMoodActivity);

            // Update activities and stats immediately
            const updatedActivities = [newMoodActivity, ...activities];
            console.log('Updated activities count:', updatedActivities.length);
            console.log('Full updated activities:', updatedActivities);

            const newStats = calculateDailyStats(updatedActivities);
            console.log('Calculated new stats:', newStats);
            console.log('New mood score should be:', newStats.moodScore);
            console.log('Calling setDailyStats with:', newStats);

            // Prevent next API fetch from overwriting our local data
            skipNextFetchRef.current = true;
            console.log('Set skipNextFetchRef.current = true to protect local data');

            // Update states
            setActivities(updatedActivities);
            setDailyStats(newStats);

            console.log('State updates called - React should re-render now');

            // Force a re-render by updating the state again after a tiny delay
            setTimeout(() => {
              console.log('Forcing re-render with timestamp update');
              setDailyStats((prev) => {
                console.log('Previous stats in timeout:', prev);
                const updated = { ...newStats, lastUpdated: new Date() };
                console.log('Updating stats to:', updated);
                return updated;
              });
            }, 100);

            // Reset the skip flag after 5 seconds so future fetches work
            setTimeout(() => {
              skipNextFetchRef.current = false;
              console.log('Reset skipNextFetchRef.current = false - protection period over');
            }, 5000);

            setShowMoodModal(false);
          }} />
        </DialogContent>
      </Dialog>

      {/* AI check-in chat */}
      {showCheckInChat && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l shadow-lg">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">AI Check-in</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCheckInChat(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4"></div>
            </div>
          </div>
        </div>
      )}

      <ActivityLogger
        open={showActivityLogger}
        onOpenChange={setShowActivityLogger}
        onActivityLogged={loadActivities}
      />

      {/* Interactive Paimon-like Companion */}
      <PaimonCompanion />
    </div>
  );
}
