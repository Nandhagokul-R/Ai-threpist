"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 3D Card Component
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

// 3D Floating Element
export function Floating3D({ 
  children, 
  className = "", 
  speed = 1,
  range = 20 
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
        duration: 3 / speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// 3D Parallax Container
export function Parallax3D({ 
  children, 
  className = "",
  speed = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string; 
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ 
        y, 
        rotateX,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
}

// 3D Button with hover effects
export function Button3D({ 
  children, 
  className = "",
  onClick,
  disabled = false
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) * 0.1;
      const rotateY = (centerX - x) * 0.1;
      
      button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    const handleMouseDown = () => {
      button.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(-5px)';
    };

    const handleMouseUp = () => {
      button.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`transition-all duration-300 ease-out ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </button>
  );
}

// 3D Icon with rotation
export function Icon3D({ 
  children, 
  className = "",
  hoverRotate = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  hoverRotate?: boolean;
}) {
  return (
    <motion.div
      className={className}
      whileHover={hoverRotate ? { 
        rotateY: 180,
        scale: 1.1,
        transition: { duration: 0.3 }
      } : {}}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}

// 3D Background Particles
export function Particles3D({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = React.useState<{ left: number; top: number; duration: number; delay: number }[]>([]);
  const mountedRef = React.useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const generated = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
}

// 3D Glass Morphism Card
export function GlassCard3D({ 
  children, 
  className = "",
  intensity = 0.05 
}: { 
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
      className={`backdrop-blur-lg bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl transition-all duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}























