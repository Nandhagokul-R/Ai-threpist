import React, { useRef, useEffect } from 'react';
import type { ChatMessage, MessageSentiment } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import Welcome from './Welcome';
import { Particles, Floating3D } from './ui/ThreeD';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onAnalyze: () => void;
  lastModelSentiment: MessageSentiment;
  sessionId: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onAnalyze, lastModelSentiment, sessionId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const canAnalyze = messages.filter(m => m.role === 'user').length >= 2;

  return (
    <main className="flex-1 flex flex-col bg-[#0a0e1a] overflow-hidden relative">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#0a0e1a] to-[#0a0e1a] -z-10" />
      <Particles count={30} />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 relative z-10 custom-scrollbar">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Floating3D speed={0.8} range={15}>
              <Welcome />
            </Floating3D>
          </div>
        ) : (
          <>
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {messages.map((msg, index) => (
                <MessageBubble key={index} role={msg.role} content={msg.content} sentiment={msg.sentiment} recommendation={msg.recommendation} />
              ))}
            </div>
            {canAnalyze && !isLoading && (
              <div className="flex justify-center pt-8 pb-4">
                <button
                  onClick={onAnalyze}
                  className="flex items-center space-x-2 py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>End Chat & View Mood Report</span>
                </button>
              </div>
            )}
          </>
        )}
        {isLoading && <TypingIndicator lastModelSentiment={lastModelSentiment} />}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} sessionId={sessionId} />
    </main>
  );
};

export default ChatWindow;