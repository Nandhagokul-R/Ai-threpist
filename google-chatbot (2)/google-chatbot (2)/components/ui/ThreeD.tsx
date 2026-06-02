import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Card3D({ children, className = "", intensity = 0.1 }: {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) * intensity;
            const rotateY = (centerX - x) * intensity;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [intensity]);

    return (
        <div
            ref={cardRef}
            className={`transition-transform duration-300 ease-out ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
}

export function Floating3D({
    children,
    className = "",
    speed = 1,
    range = 10
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
    range?: number;
}) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [-range, range, -range],
                rotateX: [0, 5, 0],
                rotateY: [0, 5, 0],
            }}
            transition={{
                duration: 4 / speed,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function Particles({ count = 15 }: { count?: number }) {
    const [particles, setParticles] = React.useState<{ left: number; top: number; duration: number; delay: number; size: number }[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: count }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
            size: 2 + Math.random() * 4,
        }));
        setParticles(generated);
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-emerald-500/10"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
