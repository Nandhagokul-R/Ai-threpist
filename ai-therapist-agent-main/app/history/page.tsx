
"use client";

import { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, Brain, Activity, TrendingUp, AlertCircle, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserActivities } from "@/lib/static-dashboard-data";
import { analyzeMoodHistory, MoodAnalysis } from "@/lib/mood-analyzer";
import { Activity as ActivityType } from "@/lib/types";
import { format } from "date-fns";
import { useSession } from "@/lib/contexts/session-context";
import { useToast } from "@/components/ui/use-toast";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { motion } from "framer-motion";

export default function HistoryPage() {
    const router = useRouter();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<7 | 30>(7);
    const [filterType, setFilterType] = useState<"all" | "mood" | "mindfulness" | "journal">("all");

    const { toast } = useToast();
    const { isAuthenticated } = useSession();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                // If not authenticated, we can't fetch real data
                // For demo purposes, we might still show static data or redirect
                // But since the request is to "monitor activities", lets try to fetch
                if (!isAuthenticated) return;
            }

            const queryParams = new URLSearchParams();
            if (filterType !== 'all') queryParams.append('type', filterType);

            // Calculate date range
            const now = new Date();
            const startDate = new Date();
            startDate.setDate(now.getDate() - timeRange);
            queryParams.append('startDate', startDate.toISOString());

            const response = await fetch(`/api/activity/history?${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }

            const result = await response.json();

            if (result.success) {
                // Map backend data to frontend model
                const mappedData = result.data.map((item: any) => ({
                    ...item,
                    id: item._id || item.id,
                    timestamp: new Date(item.timestamp), // Ensure date object
                    type: item.type === 'mood_log' ? 'mood' : item.type // normalize types if needed
                }));

                const sortedData = mappedData.sort((a: any, b: any) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                setActivities(sortedData);
                setAnalysis(analyzeMoodHistory(sortedData, timeRange));
            }
        } catch (error) {
            console.error("Failed to load history data", error);
            toast({
                title: "Error loading history",
                description: "Could not fetch your activity history.",
                variant: "destructive"
            });
            // Fallback to empty or keep previous state
            setActivities([]);
        } finally {
            setLoading(false);
        }
    }, [filterType, timeRange, isAuthenticated, toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // Prepare chart data
    const chartData = analysis?.weeklyProgress.map(day => ({
        date: format(day.date, timeRange === 7 ? "EEE" : "MMM d"),
        mood: day.averageMood || 0,
        activities: day.activitiesCount,
        fullDate: format(day.date, "MMM d, yyyy")
    })) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "declining": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "improving": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "excellent": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <Container className="pt-20 pb-8 space-y-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="hover:bg-primary/10 rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Your Wellness Journey</h1>
                            <p className="text-muted-foreground">Track your progress and emotional growth</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg backdrop-blur-sm border">
                        <Button
                            variant={timeRange === 7 ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeRange(7)}
                            className="px-4"
                        >
                            7 Days
                        </Button>
                        <Button
                            variant={timeRange === 30 ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeRange(30)}
                            className="px-4"
                        >
                            30 Days
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Button
                        variant={filterType === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="rounded-full"
                    >
                        All Activities
                    </Button>
                    <Button
                        variant={filterType === 'mood' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('mood')}
                        className="rounded-full"
                    >
                        Mood Logs
                    </Button>
                    <Button
                        variant={filterType === 'mindfulness' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('mindfulness')}
                        className="rounded-full"
                    >
                        Mindfulness
                    </Button>
                    <Button
                        variant={filterType === 'journal' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('journal')}
                        className="rounded-full"
                    >
                        Journal Entries
                    </Button>
                </div>

                {/* Mood Analysis Section */}
                {analysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Current Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <Card className={`h-full border-2 ${getStatusColor(analysis.currentStatus).split(' ')[2]}`}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className={`w-5 h-5 ${getStatusColor(analysis.currentStatus).split(' ')[0]}`} />
                                        Current Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className={`text-2xl font-bold capitalize ${getStatusColor(analysis.currentStatus).split(' ')[0]}`}>
                                        {analysis.currentStatus}
                                    </div>
                                    <p className="text-muted-foreground">{analysis.trendDescription}</p>

                                    {analysis.currentStatus === 'critical' && (
                                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                            <div className="text-sm text-red-700 dark:text-red-300">
                                                <p className="font-medium">We're here for you</p>
                                                <p>Consider reaching out to a professional or using our crisis resources.</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Recommendations Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <Card className="h-full bg-gradient-to-br from-card to-secondary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-primary" />
                                        AI Insights & Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {analysis.recommendations.map((rec, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border hover:bg-background/80 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm md:text-base">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Mood Trends
                            </CardTitle>
                            <CardDescription>Your emotional well-being over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="mood"
                                            stroke="hsl(var(--primary))"
                                            fillOpacity={1}
                                            fill="url(#colorMood)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detailed History Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-500" />
                                Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                                {activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((activity, index) => (
                                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                        {/* Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-card z-10">
                                            {activity.type === 'mood' ? (
                                                <Brain className="w-5 h-5 text-pink-500" />
                                            ) : activity.type === 'game' ? (
                                                <Activity className="w-5 h-5 text-orange-500" />
                                            ) : (
                                                <Calendar className="w-5 h-5 text-blue-500" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-1">
                                                <time className="font-mono text-xs text-muted-foreground">
                                                    {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                                                </time>
                                                {activity.moodScore !== null && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activity.moodScore > 70 ? 'bg-green-100 text-green-700' :
                                                        activity.moodScore < 30 ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        Mood: {activity.moodScore}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-foreground">{activity.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {activity.description || "No specific details logged."}
                                            </p>
                                        </Card>

                                    </div>
                                ))}

                                {activities.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-muted-foreground">No activities recorded yet. Start your journey today!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
}
