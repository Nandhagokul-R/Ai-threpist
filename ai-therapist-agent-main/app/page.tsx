"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Brain,
  Heart,
  Shield,
  MessageCircle,
  Sparkles,
  LineChart,
  Waves,
  Check,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
  Gamepad2,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Ripple } from "@/components/ui/ripple";
import { Card3D, Floating3D, Parallax3D, Button3D, Icon3D, Particles3D, GlassCard3D } from "@/components/ui/3d-elements";
import { allMotivationalQuotes } from "@/lib/quotes";

export default function Home() {
  const emotions = [
    { value: 0, label: "😔 Down", color: "from-blue-600/50 via-cyan-400/30" },
    { value: 10, label: "😠 Angry", color: "from-rose-600/50 via-orange-500/30" },
    { value: 25, label: "😊 Content", color: "from-emerald-500/50 via-teal-400/30" },
    { value: 50, label: "😌 Peaceful", color: "from-indigo-500/50 via-purple-500/30" },
    { value: 75, label: "🤗 Happy", color: "from-yellow-500/50 via-amber-400/30" },
    { value: 100, label: "✨ Excited", color: "from-pink-600/50 via-fuchsia-500/30" },
  ];

  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const quoteTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleQuoteClick = (quote: string) => {
    if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    setHighlightedQuote(quote);
    quoteTimeoutRef.current = setTimeout(() => {
      setHighlightedQuote(null);
    }, 4000);
  };

  const welcomeSteps = [
    {
      title: "Hi, I'm Aura 👋",
      description:
        "Your AI companion for emotional well-being. I'm here to provide a safe, judgment-free space for you to express yourself.",
      icon: Waves,
    },
    {
      title: "Personalized Support 🌱",
      description:
        "I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.",
      icon: Brain,
    },
    {
      title: "Your Privacy Matters 🛡️",
      description:
        "Our conversations are completely private and secure. I follow strict ethical guidelines and respect your boundaries.",
      icon: Shield,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEmotion = emotions.reduce((prev, curr) => {
    return Math.abs(curr.value - emotion) < Math.abs(prev.value - emotion)
      ? curr
      : prev;
  });

  const features = [
    {
      icon: HeartPulse,
      title: "24/7 Support",
      description: "Always here to listen and support you, any time of day",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description: "Personalized guidance powered by emotional intelligence",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Your conversations are always confidential and encrypted",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: MessageSquareHeart,
      title: "Evidence-Based",
      description: "Therapeutic techniques backed by clinical research",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        {/* Optimized Radiant Aura System */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#020617]">
          {/* Hardware Accelerated Container */}
          <div className="absolute inset-0 flex items-center justify-center [will-change:transform]">
            {/* Subtle Grid Pattern - kept static for performance */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />

            {/* Base Atmospheric Glow - Consolidated into one large stable layer */}
            <div
              className={`absolute w-[1400px] h-[1000px] rounded-[100%] bg-gradient-to-r ${currentEmotion.color} to-transparent blur-[120px] opacity-15`}
            />

            {/* Core Radiant System */}
            <div className="relative flex items-center justify-center scale-110 md:scale-125">
              {/* Main Breathing Core */}
              <motion.div
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr ${currentEmotion.color} via-primary/10 to-transparent blur-[90px] [will-change:transform,opacity]`}
              />

              {/* High Intensity Heart */}
              <div
                className={`absolute w-[300px] h-[300px] rounded-full bg-gradient-to-tr ${currentEmotion.color} to-transparent blur-[40px] opacity-80 animate-pulse`}
              />

              {/* Optimized Lens Flare Elements */}
              <div className="absolute flex items-center justify-center rotate-45 opacity-30">
                <div className="w-[1px] h-[400px] bg-white blur-[8px]" />
                <div className="h-[1px] w-[400px] bg-white blur-[8px]" />
              </div>
            </div>

            {/* Floating Bokeh / Particles - Reduced count for performance */}
            <Particles3D count={35} />

            {/* Light Rings - Reduced complexity */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-[800px] h-[800px] rounded-full border border-primary/5 blur-[1px]"
                style={{
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  opacity: 0.15 - i * 0.05
                }}
              />
            ))}
          </div>

          {/* Vignette Overlay - Replaces expensive backdrop-blur */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/95 pointer-events-none" />
          <div className="absolute inset-0 bg-background/10 pointer-events-none" />
        </div>
        <Ripple className="opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative space-y-8 text-center"
        >
          {/* Enhanced badge with 3D icon */}
          <Card3D className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
            <Icon3D className="w-4 h-4">
              <Waves className="animate-wave text-primary" />
            </Icon3D>
            <span className="relative text-foreground/90 dark:text-foreground after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary/30 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
              Your AI Agent Mental Health Companion
            </span>
          </Card3D>

          {/* Enhanced main heading with smoother gradient and glow */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-plus-jakarta tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] hover:to-primary transition-all duration-300">
              Find Peace
            </span>
            <br />
            <span className="inline-block mt-2 bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
              of Mind
            </span>
          </h1>

          {/* Enhanced description with better readability */}
          <p className="max-w-[600px] mx-auto text-base md:text-lg text-muted-foreground leading-relaxed tracking-wide">
            Experience a new way of emotional support. Our AI companion is here
            to listen, understand, and guide you through life's journey.
          </p>

          {/* Emotion slider section with enhanced transitions */}
          <motion.div
            className="w-full max-w-[600px] mx-auto space-y-6 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground/80 font-medium">
                Whatever you're feeling, we're here to listen
              </p>
              <div className="flex justify-between items-center px-2">
                {emotions.map((em) => (
                  <div
                    key={em.value}
                    className={`transition-all duration-500 ease-out cursor-pointer hover:scale-105 ${Math.abs(emotion - em.value) < 15
                      ? "opacity-100 scale-110 transform-gpu"
                      : "opacity-50 scale-100"
                      }`}
                    onClick={() => setEmotion(em.value)}
                  >
                    <div className="text-2xl transform-gpu">
                      {em.label.split(" ")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {em.label.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced slider with dynamic gradient */}
            <div className="relative px-2">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentEmotion.color} to-transparent blur-2xl -z-10 transition-all duration-500`}
              />
              <Slider
                value={[emotion]}
                onValueChange={(value) => setEmotion(value[0])}
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
            </div>

            <div className="relative pt-4 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <div
                className="flex gap-12 animate-marquee [--duration:60s]"
                style={{ animationPlayState: highlightedQuote ? 'paused' : 'running' }}
              >
                {/* Render a small set of quotes twice for seamless looping */}
                {[...allMotivationalQuotes.slice(0, 20), ...allMotivationalQuotes.slice(0, 20)].map((quote, i) => (
                  <span
                    key={i}
                    onClick={() => handleQuoteClick(quote)}
                    className="text-sm font-medium text-muted-foreground/60 whitespace-nowrap hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    {quote}
                  </span>
                ))}
              </div>
            </div>

            {/* Quote spotlight popup */}
            <motion.div
              key={highlightedQuote ?? 'empty'}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={highlightedQuote ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            >
              {highlightedQuote && (
                <div className="relative max-w-lg w-full mx-6">
                  {/* Glow backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 blur-2xl rounded-3xl" />
                  <div className="relative bg-background/90 backdrop-blur-xl border border-primary/30 rounded-2xl px-8 py-7 shadow-2xl text-center space-y-4">
                    <span className="text-3xl">✨</span>
                    <p className="text-lg font-semibold leading-relaxed text-foreground">
                      &ldquo;{highlightedQuote}&rdquo;
                    </p>
                    {/* Progress bar */}
                    <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 4, ease: 'linear' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Enhanced CTA button and welcome dialog */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Button3D
              onClick={() => setShowDialog(true)}
              className="relative group h-16 px-12 rounded-2xl bg-slate-950 border border-white/10 hover:border-primary/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]"
            >
              {/* Premium Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/70 group-hover:text-primary transition-colors duration-300">
                    Get Started
                  </span>
                  <span className="text-xl font-bold text-white tracking-tight">
                    Let's Go!
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </Button3D>
          </motion.div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/20 flex items-start justify-center p-1 hover:border-primary/40 transition-colors duration-300">
            <div className="w-1 h-2 rounded-full bg-primary animate-scroll" />
          </div>
        </motion.div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" /> */}

        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16 space-y-4 text-white ">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent dark:text-primary/90">
              How Aura Helps You
            </h2>
            <p className="text-foreground dark:text-foreground/95 max-w-2xl mx-auto font-medium text-lg">
              Experience a new kind of emotional support, powered by empathetic
              AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card3D intensity={0.05}>
                  <GlassCard3D className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-[200px] p-6">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 dark:group-hover:opacity-30`}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                          <Icon3D>
                            <feature.icon className="w-5 h-5 text-primary dark:text-primary/90" />
                          </Icon3D>
                        </div>
                        <h3 className="font-semibold tracking-tight text-foreground/90 dark:text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground/90 dark:text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </GlassCard3D>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-lg">
          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {welcomeSteps[currentStep] && (
                  <div>
                    {React.createElement(welcomeSteps[currentStep].icon, {
                      className: "w-8 h-8 text-primary",
                    })}
                  </div>
                )}
              </div>
              <DialogTitle className="text-2xl text-center">
                {welcomeSteps[currentStep]?.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base leading-relaxed">
                {welcomeSteps[currentStep]?.description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? "bg-primary w-4" : "bg-primary/20"
                    }`}
                />
              ))}
            </div>
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((c) => c + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                  // Here you would navigate to the chat interface
                }
              }}
            >
              <span className="flex items-center gap-2">
                {currentStep === welcomeSteps.length - 1 ? (
                  <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (token) {
                        fetch("/api/activity", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            type: "game", // or 'therapy'
                            name: "Started Aura Therapy",
                            description: "User clicked link to open Aura Therapy Voxel App",
                          }),
                        }).catch(e => console.error(e));
                      }
                    }}
                  >
                    Aura Therapy
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </a>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add custom animations to globals.css */}
    </div>
  );
}
