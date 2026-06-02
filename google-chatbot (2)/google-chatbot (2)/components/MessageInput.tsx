import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MessageInputProps {
  onSendMessage: (input: string) => void;
  isLoading: boolean;
  sessionId: string | null;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5a.75.75 0 01.75-.75z" />
  </svg>
);

// Add SpeechRecognition to the window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, sessionId }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null); // Using `any` for SpeechRecognition

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  // Re-focus the input when loading is finished or when switching sessions
  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading, sessionId]);

  // Cleanup effect to stop recognition if component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <footer className="bg-gray-950/80 backdrop-blur-2xl p-6 border-t border-white/5 relative z-50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-4">
        <div className="flex-1 relative group">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts with Aura..."
            rows={1}
            className="w-full p-4 bg-gray-900/50 text-gray-100 rounded-[1.5rem] border-2 border-white/5 focus:border-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none transition-all duration-300 placeholder:text-gray-600 block leading-relaxed shadow-inner"
          />
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleToggleRecording}
            disabled={isLoading}
            className={`p-4 rounded-2xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9, x: 0 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white rounded-2xl p-4 transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 focus:outline-none ring-offset-gray-950 focus:ring-2 focus:ring-emerald-500"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </footer>
  );
};

export default MessageInput;