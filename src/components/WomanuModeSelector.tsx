'use client';

import React from 'react';
import { useWomanu } from './WomanuContext';

export default function WomanuModeSelector() {
  const { mode, setMode } = useWomanu();

  if (mode !== null) return null; // Only show if mode is not set

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-red-900 to-red-950 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-amber-400 mb-2">Choose your U</h2>
          <p className="text-amber-200/80 text-sm">How would you like to order today?</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setMode('menu')}
            className="w-full bg-red-900/50 hover:bg-red-800 border-2 border-amber-600/30 hover:border-amber-500 rounded-xl p-4 transition-all group flex flex-col items-center gap-2"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">👨</span>
            <span className="font-bold text-amber-300 text-lg">MEN-U</span>
            <span className="text-amber-100/60 text-xs">Classic Menu Experience</span>
          </button>

          <button
            onClick={() => setMode('womenu')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-red-950 border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] rounded-xl p-4 transition-all group flex flex-col items-center gap-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="text-4xl group-hover:scale-110 transition-transform relative z-10">👩</span>
            <span className="font-extrabold text-xl relative z-10">WOMEN-U</span>
            <span className="text-red-950/80 text-xs font-semibold relative z-10">Enhanced Decision-Making Experience 😂</span>
          </button>
        </div>
        
        <div className="mt-8 text-center opacity-50">
          <p className="text-[10px] text-amber-200">
            * WOMENU pricing and recommendations are fictional comedy features for this demo. 😂
          </p>
        </div>
      </div>
    </div>
  );
}
