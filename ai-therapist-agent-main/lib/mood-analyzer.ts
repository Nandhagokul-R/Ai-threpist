
import { Activity } from "./types";
import { format, isSameDay, subDays } from "date-fns";

export type MoodStatus = "improving" | "declining" | "stable" | "critical" | "excellent" | "unknown";

interface DailySummary {
    date: Date;
    averageMood: number | null;
    activitiesCount: number;
    criticalMoods: number; // Count of very low mood scores
    activities: Activity[];
}

export interface MoodAnalysis {
    currentStatus: MoodStatus;
    trendDescription: string;
    weeklyProgress: DailySummary[];
    recommendations: string[];
}

export const analyzeMoodHistory = (activities: Activity[], days = 7): MoodAnalysis => {
    // 1. Group activities by day
    const today = new Date();
    const dateRange = Array.from({ length: days }, (_, i) => subDays(today, i)).reverse();

    const weeklyProgress: DailySummary[] = dateRange.map(date => {
        const daysActivities = activities.filter(a =>
            isSameDay(new Date(a.timestamp), date)
        );

        const moodEntries = daysActivities.filter(a => a.type === 'mood' && a.moodScore !== null);
        const totalMood = moodEntries.reduce((acc, curr) => acc + (curr.moodScore || 0), 0);
        const averageMood = moodEntries.length > 0 ? totalMood / moodEntries.length : null;

        // Count critical moods (e.g., below 30)
        const criticalMoods = moodEntries.filter(a => (a.moodScore || 0) < 30).length;

        return {
            date,
            averageMood,
            activitiesCount: daysActivities.length,
            criticalMoods,
            activities: daysActivities
        };
    });

    // 2. Analyze Trends
    const validMoodDays = weeklyProgress.filter(d => d.averageMood !== null);
    let currentStatus: MoodStatus = "unknown";
    let trendDescription = "Not enough data to analyze your mood trends yet.";

    if (validMoodDays.length >= 2) {
        const recentDays = validMoodDays.slice(-3); // Look at last 3 days with data
        const latestDay = recentDays[recentDays.length - 1];
        const previousDay = recentDays[recentDays.length - 2];

        const latestScore = latestDay.averageMood || 0;
        const previousScore = previousDay.averageMood || 0;

        if (latestScore < 30) {
            currentStatus = "critical";
            trendDescription = "Your recent mood logs indicate you might be going through a tough time.";
        } else if (latestScore > 80) {
            currentStatus = "excellent";
            trendDescription = "You're doing great! Your mood has been consistently high.";
        } else if (latestScore > previousScore + 10) {
            currentStatus = "improving";
            trendDescription = "Your mood is showing clearer signs of improvement compared to before.";
        } else if (latestScore < previousScore - 10) {
            currentStatus = "declining";
            trendDescription = "There's a slight dip in your recent mood scores.";
        } else {
            currentStatus = "stable";
            trendDescription = "Your mood has been relatively stable recently.";
        }
    } else if (validMoodDays.length === 1) {
        const score = validMoodDays[0].averageMood || 0;
        if (score < 30) {
            currentStatus = "critical";
            trendDescription = "Your current mood seems quite low. We're here to help.";
        } else if (score > 80) {
            currentStatus = "excellent";
            trendDescription = "Great start! You're feeling positive today.";
        } else {
            currentStatus = "stable";
            trendDescription = "Thanks for checking in today.";
        }
    }

    // 3. Generate Recommendations
    const recommendations: string[] = [];
    if (currentStatus === "critical" || currentStatus === "declining") {
        recommendations.push("Try a 5-minute breathing exercise");
        recommendations.push("Connect with a friend or family member");
        recommendations.push("Listen to calming music in our Spotify section");
    } else if (currentStatus === "improving" || currentStatus === "excellent") {
        recommendations.push("Reflect on what went well today in your journal");
        recommendations.push("Keep up the momentum with a quick workout");
    } else {
        recommendations.push("Take a moment for a quick mindfulness break");
        recommendations.push("Check out today's motivational quotes");
    }

    return {
        currentStatus,
        trendDescription,
        weeklyProgress,
        recommendations
    };
};
