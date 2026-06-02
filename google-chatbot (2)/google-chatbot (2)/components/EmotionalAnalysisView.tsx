import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../types';
import SentimentChart from './SentimentChart';
import { Card3D, FadeIn } from './ui/ThreeD';

interface EmotionalAnalysisViewProps {
    onBack: () => void;
    analysis: AnalysisResult | null;
    isLoading: boolean;
    error: string | null;
    onRegenerate: () => void;
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


const EmotionalAnalysisView: React.FC<EmotionalAnalysisViewProps> = ({ onBack, analysis, isLoading, error, onRegenerate }) => {

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-20 text-gray-400 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative w-24 h-24 mb-6">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-500"
                        />
                        <motion.div
                            animate={{ scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </motion.div>
                    </div>
                    <p className="font-bold text-2xl text-white mb-2 tracking-tight">Deciphering Emotions</p>
                    <p className="text-gray-400 max-w-xs mx-auto">Our AI is carefully reflecting on your conversation to provide meaningful insights.</p>
                </div>
            )
        }
        if (error) {
            return (
                <FadeIn className="text-center p-12 bg-red-900/20 border border-red-500/30 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Interrupted</h3>
                    <p className="text-red-300 opacity-80">{error}</p>
                    <button onClick={onRegenerate} className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all">Try Again</button>
                </FadeIn>
            );
        }
        if (analysis) {
            return (
                <div className="space-y-10 pb-20">
                    <FadeIn delay={0.1}>
                        <Card3D intensity={0.02}>
                            <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5 group hover:border-emerald-500/20 transition-all">
                                <h3 className="text-xl font-black text-white mb-4 flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mr-3 text-emerald-400">#</span>
                                    Journey Summary
                                </h3>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg italic opacity-90">"{analysis.overallSummary}"</p>
                            </div>
                        </Card3D>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <Card3D intensity={0.02}>
                            <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5 group hover:border-emerald-500/20 transition-all">
                                <h3 className="text-xl font-black text-white mb-2">Emotional Flow</h3>
                                <p className="text-sm text-gray-500 mb-8 uppercase tracking-[0.2em] font-bold">The heartbeat of your conversation</p>
                                <SentimentChart data={analysis.sentimentTrend} />
                            </div>
                        </Card3D>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card3D intensity={0.03} className="h-full">
                                <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5 h-full">
                                    <h3 className="text-xl font-black text-white mb-6">Key Insights</h3>
                                    <div className="space-y-6">
                                        {analysis.keyEmotions.map((item, index) => (
                                            <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full before:shadow-[0_0_8px_#10b981]">
                                                <h4 className="font-bold text-white text-lg">{item.emotion}</h4>
                                                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card3D>

                            <Card3D intensity={0.03} className="h-full">
                                <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/5 h-full">
                                    <h3 className="text-xl font-black text-white mb-6 flex items-center">
                                        <LightbulbIcon />
                                        Self-Care Toolkit
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.recommendations.map((rec, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ x: 10 }}
                                                className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-default"
                                            >
                                                <h4 className="font-bold text-emerald-400 mb-1">{rec.title}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{rec.description}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </Card3D>
                        </div>
                    </FadeIn>
                </div>
            )
        }
        return null;
    }

    return (
        <main className="flex-1 overflow-y-auto bg-[#0a0e1a] relative custom-scrollbar">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-12">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={onBack}
                        className="flex items-center text-sm font-bold text-emerald-400/80 hover:text-emerald-400 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Presence
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRegenerate}
                        disabled={isLoading}
                        className="flex items-center space-x-2 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5M4 20h5v-5M20 4h-5v5" />
                        </svg>
                        <span>{isLoading ? 'Reflecting...' : 'Refresh Insights'}</span>
                    </motion.button>
                </div>

                <FadeIn delay={0}>
                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                            Emotional <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Intelligence Report</span>
                        </h2>
                        <p className="text-gray-400 text-xl font-medium opacity-80 max-w-2xl">
                            A deep reflection on your inner states during our connection today.
                        </p>
                    </div>
                </FadeIn>

                {renderContent()}
            </div>
        </main>
    );
};

export default EmotionalAnalysisView;