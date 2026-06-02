"use client";

import { useState } from "react";
import { Bird, Car, Mountain, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Container } from "../../components/ui/container";
import { Card3D, Floating3D, Icon3D, Particles3D } from "../../components/ui/3d-elements";

export default function GamesPage() {
  const [isLoading, setIsLoading] = useState(false);

  const launchFlappyBird = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/launch-flappy', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to launch Flappy Bird game');
      }
      
      // Game launched successfully
      console.log('Flappy Bird game launched successfully');
    } catch (error) {
      console.error('Error launching Flappy Bird game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="relative flex flex-col items-center justify-center pt-24 md:pt-28 pb-10 min-h-screen">
        {/* 3D Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Particles3D count={20} />
          <Floating3D className="absolute w-[300px] h-[300px] rounded-full blur-3xl top-20 left-10 bg-blue-500/20 opacity-60" speed={0.3} />
          <Floating3D className="absolute w-[250px] h-[250px] rounded-full blur-3xl bottom-20 right-10 bg-purple-500/20 opacity-60" speed={0.5} />
        </div>

        <Floating3D className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Games
          </h1>
          <p className="text-xl mb-10 text-center max-w-2xl text-muted-foreground">
            Enjoy our collection of games designed to help you relax and have fun.
          </p>
        </Floating3D>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <Card3D intensity={0.1}>
            <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Icon3D className="w-5 h-5">
                    <Car className="text-blue-500" />
                  </Icon3D>
                  Car race
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
          </Card3D>

          <Card3D intensity={0.1}>
            <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Icon3D className="w-5 h-5">
                    <Bird className="text-yellow-500" />
                  </Icon3D>
                  Flappy Bird
                </CardTitle>
                <CardDescription>Fly the bird through gaps without hitting obstacles.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Casual arcade</div>
                <Button asChild className="group-hover:scale-105 transition-transform duration-300">
                  <Link href="https://flapppy.netlify.app/" target="_blank" rel="noopener noreferrer" prefetch={false}>
                    Play
                  </Link>
                </Button>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          </Card3D>

          <Card3D intensity={0.1}>
            <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Icon3D className="w-5 h-5">
                    <Mountain className="text-green-500" />
                  </Icon3D>
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
          </Card3D>

          <Card3D intensity={0.1}>
            <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Icon3D className="w-5 h-5">
                    <Circle className="text-pink-500" />
                  </Icon3D>
                  Bubble Burst
                </CardTitle>
                <CardDescription>Pop colorful bubbles to relieve stress and relax your mind.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Stress relief</div>
                <Button asChild className="group-hover:scale-105 transition-transform duration-300">
                  <Link href="https://bubblepopgame.vercel.app/" target="_blank" rel="noopener noreferrer" prefetch={false}>
                    Play
                  </Link>
                </Button>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          </Card3D>
        </div>
      </div>
    </Container>
  );
}