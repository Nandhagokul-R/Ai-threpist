"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WELLNESS_PHRASES = [
    "You're doing great! Keep it up! 💜",
    "Remember to take deep breaths! 🌸",
    "You're stronger than you think! ✨",
    "Take a moment for yourself today! 🌟",
    "I believe in you! You've got this! 💪",
    "Stay hydrated and stay happy! 💧",
    "Your mental health matters! 🌈",
    "One step at a time, you're amazing! 👏",
    "Don't forget to smile today! 😊",
    "You deserve happiness and peace! 🕊️",
    "Progress, not perfection! 🎯",
    "Be kind to yourself! 💝",
];

export function PaimonCompanion() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [paimonPosition, setPaimonPosition] = useState({ x: 100, y: 100 });
    const [isIdle, setIsIdle] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isInside, setIsInside] = useState(true);
    const [currentPhrase, setCurrentPhrase] = useState(WELLNESS_PHRASES[0]);
    const [showSpeechBubble, setShowSpeechBubble] = useState(false);
    const animationFrameRef = useRef<number>();
    const speechTimeoutRef = useRef<NodeJS.Timeout>();
    const autoSpeakIntervalRef = useRef<NodeJS.Timeout>();

    // Text-to-speech function optimized for Paimon-like voice from Genshin Impact
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Paimon voice settings - high pitch, fast & energetic like the game!
            utterance.rate = 1.2; // Fast and energetic like Paimon
            utterance.pitch = 2.0; // Maximum pitch for that signature Paimon sound!
            utterance.volume = 1.0; // Full volume

            // Try to find the highest-pitched, most Paimon-like voice
            const setVoice = () => {
                const voices = window.speechSynthesis.getVoices();

                // Look for high-pitched voices that sound young and energetic
                // Priority: Google voices, Microsoft Zira, or any "girl/young" voices
                const paimonLikeVoices = voices.filter(voice =>
                    voice.lang.startsWith('en') && (
                        voice.name.toLowerCase().includes('google') ||
                        voice.name.toLowerCase().includes('zira') ||
                        voice.name.toLowerCase().includes('girl') ||
                        voice.name.toLowerCase().includes('child') ||
                        voice.name.toLowerCase().includes('junior')
                    )
                );

                // Fallback to any female English voice
                const femaleVoices = voices.filter(voice =>
                    voice.lang.startsWith('en') && (
                        voice.name.toLowerCase().includes('female') ||
                        voice.name.toLowerCase().includes('woman') ||
                        voice.name.toLowerCase().includes('samantha') ||
                        voice.name.toLowerCase().includes('victoria')
                    )
                );

                // Use the best available voice
                if (paimonLikeVoices.length > 0) {
                    utterance.voice = paimonLikeVoices[0];
                } else if (femaleVoices.length > 0) {
                    utterance.voice = femaleVoices[0];
                }
            };

            // Set voice immediately if available
            if (window.speechSynthesis.getVoices().length > 0) {
                setVoice();
            } else {
                // Wait for voices to load
                window.speechSynthesis.onvoiceschanged = setVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    // Handle click on companion to speak and toggle follow mode
    const handleClick = () => {
        setIsFollowing(prev => !prev);

        const randomPhrase = WELLNESS_PHRASES[Math.floor(Math.random() * WELLNESS_PHRASES.length)];
        setCurrentPhrase(randomPhrase);
        setShowSpeechBubble(true);
        speak(randomPhrase);

        // Hide speech bubble after 5 seconds
        if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
        }
        speechTimeoutRef.current = setTimeout(() => {
            setShowSpeechBubble(false);
        }, 5000);
    };

    // Auto-speak every 30 seconds when idle
    useEffect(() => {
        autoSpeakIntervalRef.current = setInterval(() => {
            if (isIdle && !isSpeaking) {
                const randomPhrase = WELLNESS_PHRASES[Math.floor(Math.random() * WELLNESS_PHRASES.length)];
                setCurrentPhrase(randomPhrase);
                setShowSpeechBubble(true);
                speak(randomPhrase);

                setTimeout(() => {
                    setShowSpeechBubble(false);
                }, 5000);
            }
        }, 30000); // Every 30 seconds

        return () => {
            if (autoSpeakIntervalRef.current) {
                clearInterval(autoSpeakIntervalRef.current);
            }
        };
    }, [isIdle, isSpeaking]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsIdle(false);
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Idle timeout
        const idleTimeout = setInterval(() => {
            setIsIdle(true);
        }, 3000);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearInterval(idleTimeout);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (speechTimeoutRef.current) {
                clearTimeout(speechTimeoutRef.current);
            }
            // Cancel any ongoing speech on unmount
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Smooth following animation
    useEffect(() => {
        const updatePosition = () => {
            setPaimonPosition((prev) => {
                // Determine target position
                let targetX, targetY;

                if (isFollowing) {
                    targetX = mousePosition.x - 64;
                    targetY = mousePosition.y - 64;
                } else if (isInside) {
                    // Target position is same as Castle Home Position
                    if (typeof window !== 'undefined') {
                        targetX = window.innerWidth - 100;
                        targetY = window.innerHeight - 100;
                    } else {
                        targetX = 100;
                        targetY = 100;
                    }
                } else {
                    // Fixed home position (bottom right) near castle
                    if (typeof window !== 'undefined') {
                        targetX = window.innerWidth - 180;
                        targetY = window.innerHeight - 180;
                    } else {
                        targetX = 100;
                        targetY = 100;
                    }
                }

                const dx = targetX - prev.x;
                const dy = targetY - prev.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Move if distance is significant
                if (distance > 1) {
                    // Smooth easing
                    const easing = 0.1;
                    return {
                        x: prev.x + dx * easing,
                        y: prev.y + dy * easing,
                    };
                }
                return prev;
            });

            animationFrameRef.current = requestAnimationFrame(updatePosition);
        };

        animationFrameRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [mousePosition, isFollowing, isInside]);

    // Calculate rotation based on movement direction
    const dx = mousePosition.x - paimonPosition.x;
    const rotation = dx > 0 ? 5 : dx < 0 ? -5 : 0;

    return (
        <>
            {/* Castle Home */}
            <motion.div
                className="fixed bottom-8 right-8 z-40 cursor-pointer pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsInside(!isInside);
                    if (!isInside) setIsFollowing(false); // Stop following if sending back
                    if (isInside) speak("I'm here! 🌸"); // Speak when coming out
                }}
            >
                <div className="w-20 h-20 flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl border-2 border-purple-300 dark:border-purple-500/40 shadow-lg group hover:shadow-purple-500/30 transition-shadow">
                    <span className="text-4xl filter drop-shadow-lg group-hover:rotate-12 transition-transform duration-300">🏰</span>
                </div>
            </motion.div>

            <motion.div
                className="fixed z-50 pointer-events-none" // pointer-events-none on wrapper, auto on children
                style={{
                    left: paimonPosition.x,
                    top: paimonPosition.y,
                }}
                animate={{
                    rotate: rotation,
                    y: isIdle && !isInside ? [0, -10, 0] : 0,
                    scale: isInside ? 0 : 1,
                    opacity: isInside ? 0 : 1
                }}
                transition={{
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    rotate: {
                        duration: 0.3,
                    },
                    scale: {
                        duration: 0.5,
                        type: "spring"
                    },
                    opacity: {
                        duration: 0.4
                    }
                }}
            >
                {/* Paimon Character with Actual Image */}
                <div
                    className="relative w-32 h-32 cursor-pointer pointer-events-auto"
                    onClick={handleClick}
                    title="Click me to hear a wellness message!"
                >
                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-blue-400/40 rounded-full blur-2xl"
                        animate={{
                            scale: isSpeaking ? [1, 1.2, 1] : [1, 1.1, 1],
                            opacity: isSpeaking ? [0.6, 0.9, 0.6] : [0.5, 0.7, 0.5],
                        }}
                        transition={{
                            duration: isSpeaking ? 0.5 : 2,
                            repeat: Infinity,
                        }}
                    />

                    {/* Main Paimon Image */}
                    <motion.div
                        className="relative w-full h-full flex items-center justify-center"
                        animate={{
                            scale: isSpeaking ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                            duration: 0.3,
                            repeat: isSpeaking ? Infinity : 0,
                        }}
                    >
                        <img
                            src="/paimon.png"
                            alt="Paimon Companion"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            style={{
                                filter: isSpeaking ? 'brightness(1.1) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))' : 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))',
                            }}
                        />
                    </motion.div>

                    {/* Sparkles - More vibrant when speaking */}
                    {
                        (isIdle || isSpeaking) && (
                            <>
                                <motion.div
                                    className="absolute -left-6 top-6 text-2xl"
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: isSpeaking ? 1 : 2,
                                        repeat: Infinity,
                                        repeatDelay: isSpeaking ? 0 : 1,
                                    }}
                                >
                                    ✨
                                </motion.div>
                                <motion.div
                                    className="absolute -right-6 top-10 text-2xl"
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, -180, -360],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: isSpeaking ? 1 : 2,
                                        repeat: Infinity,
                                        repeatDelay: isSpeaking ? 0 : 1,
                                        delay: 0.5,
                                    }}
                                >
                                    ⭐
                                </motion.div>
                                {isSpeaking && (
                                    <>
                                        <motion.div
                                            className="absolute left-8 -top-4 text-xl"
                                            animate={{
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                            }}
                                        >
                                            💜
                                        </motion.div>
                                        <motion.div
                                            className="absolute right-8 top-12 text-xl"
                                            animate={{
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: 0.3,
                                            }}
                                        >
                                            🌸
                                        </motion.div>
                                    </>
                                )}
                            </>
                        )
                    }

                    {/* Speech bubble */}
                    <AnimatePresence>
                        {(showSpeechBubble || isIdle) && (
                            <motion.div
                                className="absolute -top-16 -right-32 w-48 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-2xl border-2 border-purple-300 dark:border-purple-500/40 pointer-events-none"
                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: 10 }}
                                transition={{ duration: 0.3, type: "spring" }}
                            >
                                <motion.p
                                    className="text-xs text-purple-600 dark:text-purple-400 font-medium leading-relaxed"
                                    animate={isSpeaking ? {
                                        scale: [1, 1.02, 1],
                                    } : {}}
                                    transition={{
                                        duration: 0.5,
                                        repeat: isSpeaking ? Infinity : 0,
                                    }}
                                >
                                    {showSpeechBubble ? currentPhrase : "Click me! 💜"}
                                </motion.p>
                                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-purple-300 dark:border-purple-500/40 rotate-45" />

                                {/* Sound waves when speaking */}
                                {isSpeaking && (
                                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-purple-500 rounded-full"
                                                animate={{
                                                    height: [8, 16, 8],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.1,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >
            </motion.div >
        </>
    );
}
