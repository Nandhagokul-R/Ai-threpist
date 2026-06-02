import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="bg-[#0f1419]/70 backdrop-blur-xl shadow-lg w-full p-4 flex items-center justify-center border-b border-white/5 relative z-50">
            <button onClick={onMenuClick} className="absolute left-4 lg:hidden p-2 rounded-xl hover:bg-gray-800 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center space-x-3"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </motion.div>
                <div>
                    <h1 className="text-lg font-black text-white tracking-tight leading-none">Aura</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500/80 mt-1">Mental Wellness AI</p>
                </div>
            </motion.div>
        </header>
    );
};

export default Header;