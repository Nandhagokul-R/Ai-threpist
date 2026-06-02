import React from 'react';
import { motion } from 'framer-motion';
import type { MessageSentiment } from '../types';
import { FadeIn } from './ui/ThreeD';

const ModelIcon = () => (
  <div className="w-6 h-6 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </div>
)

interface TypingIndicatorProps {
  lastModelSentiment: MessageSentiment;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ lastModelSentiment }) => {
  const sentimentColors = {
    Supportive: 'bg-emerald-400',
    Empathetic: 'bg-amber-400',
    Neutral: 'bg-emerald-500',
  };
  const dotColor = sentimentColors[lastModelSentiment] || sentimentColors.Neutral;

  const dotTransition = (delay: number) => ({
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    delay: delay,
    ease: "easeInOut"
  });

  return (
    <FadeIn className="flex items-start space-x-4 p-4">
      <div className="flex-shrink-0 mt-1">
        <ModelIcon />
      </div>
      <div className="px-6 py-4 bg-gray-800/40 backdrop-blur-md rounded-2xl rounded-bl-none border border-white/5 shadow-xl">
        <div className="flex items-center space-x-1.5 h-4">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={dotTransition(delay)}
              className={`w-1.5 h-1.5 ${dotColor} rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]`}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
};

export default TypingIndicator;