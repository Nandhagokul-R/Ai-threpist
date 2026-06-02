"use client";

import { useState, useEffect } from "react";
import { Bird, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Container } from "@/components/ui/container";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function FlappyBirdPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Auto-launch the game when the page loads
  useEffect(() => {
    // Redirect to external Flappy Bird game
    window.open('https://flapppy.netlify.app/', '_blank');
    setGameStarted(true);
  }, []);

  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/games" className="text-primary hover:underline">
              ← Back to Games
            </Link>
            <h1 className="text-3xl font-bold flex items-center">
              <Bird className="h-8 w-8 text-blue-500 mr-2" />
              Flappy Bird
            </h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden border-2 border-primary/20">
            <div className="aspect-video bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              {gameStarted ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Game Opened!</h2>
                  <p className="mb-4">The Flappy Bird game has opened in a new tab.</p>
                  <p>Check your browser tabs or click the Launch Game button again if needed.</p>
                </div>
              ) : (
                <div className="text-center">
                  <Bird className="h-24 w-24 text-blue-500 mx-auto animate-bounce" />
                  <p className="mt-4 text-lg">Opening Flappy Bird game...</p>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  onClick={() => {
                    if (!gameStarted) {
                      window.open('https://flapppy.netlify.app/', '_blank');
                      setGameStarted(true);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={gameStarted}
                >
                  {gameStarted ? "Game Running" : "Launch Game"}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {gameStarted ? "Game opened in new tab" : "Click to open external game"}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">How to Play:</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Press <strong>SPACE</strong> to make the bird flap</li>
                  <li>Navigate through the pipes without hitting them</li>
                  <li>Each pipe you pass gives you one point</li>
                  <li>Try to get the highest score possible!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}