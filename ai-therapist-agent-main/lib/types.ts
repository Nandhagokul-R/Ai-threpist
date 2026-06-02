
export interface Activity {
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

export interface DayActivity {
    date: Date;
    level: "none" | "low" | "medium" | "high";
    activities: {
        type: string;
        name: string;
        completed: boolean;
        time?: string;
    }[];
}
