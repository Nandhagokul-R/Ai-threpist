"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/contexts/session-context";
import { useRouter } from "next/navigation";

interface MoodFormProps {
  onSuccess?: (moodScore: number) => void;
}

export function MoodForm({ onSuccess }: MoodFormProps) {
  const [moodScore, setMoodScore] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useSession();
  const router = useRouter();

  const emotions = [
    { value: 0, label: "😭", description: "Very Poor" },
    { value: 10, label: "😠", description: "Angry" },
    { value: 20, label: "😔", description: "Poor" },
    { value: 40, label: "😕", description: "Below Average" },
    { value: 60, label: "😐", description: "Average" },
    { value: 80, label: "😊", description: "Good" },
    { value: 100, label: "😄", description: "Excellent" },
  ];

  // Find the closest emotion based on mood score
  const getCurrentEmotion = () => {
    if (moodScore <= 5) return emotions[0]; // Very Poor
    if (moodScore <= 15) return emotions[1]; // Angry
    if (moodScore <= 30) return emotions[2]; // Poor
    if (moodScore <= 50) return emotions[3]; // Below Average
    if (moodScore <= 70) return emotions[4]; // Average
    if (moodScore <= 90) return emotions[5]; // Good
    return emotions[6]; // Excellent
  };

  const currentEmotion = getCurrentEmotion();

  const handleSubmit = async () => {
    console.log("MoodForm: Starting submission");
    console.log("MoodForm: Auth state:", { isAuthenticated, loading, user });

    if (!isAuthenticated) {
      console.log("MoodForm: User not authenticated");
      toast({
        title: "Authentication required",
        description: "Please log in to track your mood",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log(
        "MoodForm: Token from localStorage:",
        token ? "exists" : "not found"
      );

      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: moodScore }),
      });

      console.log("MoodForm: Response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("MoodForm: Error response:", error);
        throw new Error(error.error || "Failed to track mood");
      }

      const data = await response.json();
      console.log("MoodForm: Success response:", data);

      toast({
        title: "Mood tracked successfully!",
        description: "Your mood has been recorded.",
      });

      // Call onSuccess with the mood score to update parent state
      onSuccess?.(moodScore);
    } catch (error) {
      console.error("MoodForm: Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to track mood",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Emotion display */}
      <div className="text-center space-y-2">
        <div className="text-6xl animate-bounce">{currentEmotion.label}</div>
        <div className="text-lg font-semibold">
          {currentEmotion.description}
        </div>
        <div className="text-2xl font-bold text-primary">
          {moodScore}%
        </div>
      </div>

      {/* Emotion slider */}
      <div className="space-y-4">
        <div className="flex justify-between px-2">
          {emotions.map((em) => {
            const isActive = currentEmotion.value === em.value;
            return (
              <div
                key={em.value}
                className={`cursor-pointer transition-all transform hover:scale-110 ${isActive
                    ? "opacity-100 scale-110"
                    : "opacity-40 hover:opacity-70"
                  }`}
                onClick={() => setMoodScore(em.value)}
                title={em.description}
              >
                <div className="text-2xl">{em.label}</div>
                <div className={`text-[10px] text-center mt-1 ${isActive ? 'font-semibold' : 'opacity-50'}`}>
                  {em.description}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative">
          <Slider
            value={[moodScore]}
            onValueChange={(value) => setMoodScore(value[0])}
            min={0}
            max={100}
            step={1}
            className="py-4"
          />
          {/* Mood markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-[10px] pointer-events-none">
            {emotions.map((em) => (
              <div
                key={em.value}
                className="w-1 h-2 bg-muted-foreground/30 rounded-full"
                style={{ marginLeft: em.value === 0 ? '0' : '-2px' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading || loading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : loading ? (
          "Loading..."
        ) : (
          "Save Mood"
        )}
      </Button>
    </div>
  );
}
