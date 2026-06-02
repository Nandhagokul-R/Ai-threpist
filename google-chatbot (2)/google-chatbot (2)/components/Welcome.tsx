import React from 'react';
import { Card3D, FadeIn } from './ui/ThreeD';

const Welcome: React.FC = () => {
  return (
    <FadeIn delay={0.2}>
      <Card3D intensity={0.05} className="m-auto flex flex-col items-center justify-center text-center p-12 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-emerald-500/20 shadow-2xl max-w-lg">
        <div className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/40 relative">
          <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 rounded-full animate-pulse" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 mb-4">
          Welcome to Aura
        </h1>

        <div className="space-y-4">
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            Your personal sanctuary for emotional well-being.
          </p>
          <p className="text-gray-400 leading-relaxed">
            I'm here to listen, support, and suggest activities like music and games tailored to your mood.
          </p>
        </div>

        <div className="mt-10 flex items-center space-x-2 text-emerald-400/60 font-semibold tracking-widest text-xs uppercase">
          <div className="w-8 h-[1px] bg-emerald-400/20" />
          <span>Start your journey below</span>
          <div className="w-8 h-[1px] bg-emerald-400/20" />
        </div>
      </Card3D>
    </FadeIn>
  );
};

export default Welcome;