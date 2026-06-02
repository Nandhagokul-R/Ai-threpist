import React from 'react';
import { motion } from 'framer-motion';
import type { MessageSentiment, Recommendation } from '../types';
import { Card3D, FadeIn } from './ui/ThreeD';

interface MessageBubbleProps {
  role: 'user' | 'model';
  content: string;
  sentiment?: MessageSentiment;
  recommendation?: Recommendation;
}

const UserIcon = () => (
  <div className="flex-shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
)

const ModelIcon = () => (
  <div className="w-6 h-6 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </div>
)

const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
  const isGame = recommendation.type === 'game';

  return (
    <Card3D intensity={0.05}>
      <div className="mt-4 p-4 rounded-xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 backdrop-blur-md shadow-xl group">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg transition-colors duration-300 ${isGame ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' : 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30'}`}>
            {isGame ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
              Recommended {recommendation.type}
            </span>
            <h4 className="text-sm font-bold text-gray-100">{recommendation.title}</h4>
          </div>
        </div>
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={recommendation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 px-4 mt-3 text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20"
        >
          {isGame ? 'LAUNCH EXPERIENCE' : 'LISTEN ON SPOTIFY'}
        </motion.a>
      </div>
    </Card3D>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, sentiment, recommendation }) => {
  const isUser = role === 'user';

  if (!content && role === 'model') {
    return null;
  }

  const sentimentClasses = {
    Supportive: 'border-l-4 border-emerald-400 pl-4 pr-5',
    Empathetic: 'border-l-4 border-amber-500 pl-4 pr-5',
    Neutral: 'px-6',
  };
  const modelBubbleClasses = `bg-gray-800/40 text-gray-200 rounded-bl-none backdrop-blur-sm border border-gray-700/30 ${sentiment ? sentimentClasses[sentiment] : sentimentClasses.Neutral}`;

  return (
    <FadeIn className={`flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <ModelIcon />
        </div>
      )}
      <div
        className={`max-w-xl py-4 rounded-2xl shadow-xl transition-all duration-300 ${isUser
          ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-br-none px-6 shadow-emerald-900/20'
          : modelBubbleClasses
          }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">{content}</p>
        {!isUser && recommendation && <RecommendationCard recommendation={recommendation} />}
      </div>
      {isUser && <UserIcon />}
    </FadeIn>
  );
};

export default MessageBubble;