"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bird, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const GAME_DURATION = 5 * 60; // 5 minutes in seconds

export function FlappyBird() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [launchPython, setLaunchPython] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((GAME_DURATION - newTime) / GAME_DURATION) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const togglePlay = () => {
    if (!isPlaying) {
      setLaunchPython(true);
      // Create a flag file to trigger the Python game
      fetch('/api/launch-flappy', {
        method: 'POST',
      }).catch(err => console.error('Failed to launch Flappy Bird:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-full blur-xl" />
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Bird className="w-24 h-24 text-yellow-600" />
        </motion.div>
      </div>

      <div className="w-64 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Time Remaining</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Volume</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setVolume(volume === 0 ? 50 : 0)}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
      </div>

      {launchPython && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-500">
            Flappy Bird game launched! Check your Python window.
          </p>
        </div>
      )}
    </div>
  );
}