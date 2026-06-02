import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatSession, MessageSentiment } from '../types';

interface HistorySidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onNewChat: () => void;
    onSelectChat: (sessionId: string) => void;
    onDeleteChat: (sessionId: string) => void;
    onRenameChat: (sessionId: string, newTitle: string) => void;
    onAnalyze: () => void;
    currentView: 'chat' | 'analysis';
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const SentimentIndicator: React.FC<{ session: ChatSession }> = ({ session }) => {
    const lastModelMessage = [...session.messages]
        .reverse()
        .find(m => m.role === 'model');

    if (!lastModelMessage) {
        return <div className="w-2 h-2 rounded-full mr-2.5 flex-shrink-0 bg-gray-600 animate-pulse" />;
    }

    const sentiment = lastModelMessage.sentiment || 'Neutral';

    const sentimentClasses: Record<MessageSentiment, string> = {
        Supportive: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
        Empathetic: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
        Neutral: 'bg-teal-500 shadow-[0_0_8px_#14b8a6]',
    };

    const colorClass = sentimentClasses[sentiment];

    return (
        <div
            className={`w-2 h-2 rounded-full mr-2.5 flex-shrink-0 ${colorClass} transition-all duration-500`}
            title={`Last sentiment: ${sentiment}`}
        />
    );
};


const HistorySidebar: React.FC<HistorySidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectChat, onDeleteChat, onRenameChat, onAnalyze, currentView, isOpen, setIsOpen }) => {
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [titleInput, setTitleInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingSessionId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingSessionId]);

    const handleStartEditing = (e: React.MouseEvent, session: ChatSession) => {
        e.stopPropagation();
        setEditingSessionId(session.id);
        setTitleInput(session.title);
    };

    const handleRenameSubmit = () => {
        if (editingSessionId && titleInput.trim()) {
            onRenameChat(editingSessionId, titleInput.trim());
        }
        setEditingSessionId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setEditingSessionId(null);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className={`w-80 bg-[#0a0e1a]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col absolute lg:static z-40 h-full transition-all duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl`}>
                <div className="p-6 border-b border-white/5 flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs uppercase tracking-[0.2em] font-black text-gray-500">Conversations</h2>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {sessions.length} CHATS
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNewChat}
                        className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all font-bold text-sm shadow-lg shadow-emerald-500/5 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>New Reflection</span>
                    </motion.button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {sessions.map((session, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={session.id}
                            onClick={() => editingSessionId !== session.id && onSelectChat(session.id)}
                            className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${activeSessionId === session.id && currentView === 'chat'
                                    ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 shadow-xl shadow-emerald-500/5'
                                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                }`}
                        >
                            {activeSessionId === session.id && currentView === 'chat' && (
                                <motion.div
                                    layoutId="activeHighlight"
                                    className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                                />
                            )}

                            <div className="flex-1 flex items-center min-w-0 mr-2">
                                {editingSessionId !== session.id && <SentimentIndicator session={session} />}
                                {editingSessionId === session.id ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        onBlur={handleRenameSubmit}
                                        onKeyDown={handleKeyDown}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-transparent text-sm font-bold text-white border-b-2 border-emerald-500 focus:outline-none"
                                    />
                                ) : (
                                    <p className={`truncate text-sm font-bold ${activeSessionId === session.id && currentView === 'chat' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {session.title}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-1 flex-shrink-0">
                                {editingSessionId !== session.id && (
                                    <button
                                        onClick={(e) => handleStartEditing(e, session)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                                    >
                                        <EditIcon />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-[#0a0e1a]/40">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAnalyze}
                        disabled={!activeSessionId || (sessions.find(s => s.id === activeSessionId)?.messages.length || 0) <= 1}
                        className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl text-sm font-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${currentView === 'analysis'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20'
                                : 'bg-white/5 text-emerald-400 border border-white/5 hover:bg-white/10'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>View Journey</span>
                    </motion.button>
                </div>
            </aside>
        </>
    );
};

export default HistorySidebar;