'use client';

import React, { useEffect, useState } from 'react';
import { useWomanu } from './WomanuContext';
import { getWomanuPrice } from '@/data/womanuLogic';

export default function WomanuOrderSummary() {
  const { mode, selectedItem, showOrderSummary, resetWomanuState } = useWomanu();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showOrderSummary) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOrderSummary]);

  if (mode !== 'womenu' || !showOrderSummary || !selectedItem) return null;

  const originalPrice = selectedItem.price;
  const womanuPrice = getWomanuPrice(originalPrice);
  const comedyAdjustment = womanuPrice - originalPrice;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-red-950/90 backdrop-blur-md p-4">
      {/* Simple CSS Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="text-6xl animate-bounce mt-10">🎉</div>
          <div className="text-6xl animate-bounce mt-20 ml-20" style={{ animationDelay: '0.2s' }}>🎊</div>
          <div className="text-6xl animate-bounce mt-16 mr-20" style={{ animationDelay: '0.4s' }}>😂</div>
        </div>
      )}

      <div className="w-full max-w-sm bg-gradient-to-b from-red-900 to-red-950 border-4 border-amber-500 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.2)] p-6 animate-in slide-in-from-bottom-8 duration-500 relative z-10">

        <div className="text-center mb-6 border-b border-amber-600/30 pb-4">
          <h2 className="text-2xl font-black text-amber-400">🎉 ORDER CONFIRMED</h2>
          <p className="text-amber-200/80 text-sm mt-1">You finally made a decision. Congratulations. 😂👏</p>
          <p className="text-red-400 font-bold text-sm mt-2 bg-red-950/50 p-2 rounded-lg border border-red-500/30"> ግን በጣም ታናድዳለህ እሺ ድሮም ሃበሻ የሚጠቅመዉን እና የሚጠቀምበትን አያውቅም</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-red-950/60 rounded-xl p-4 border border-amber-500/20">
            <h3 className="font-bold text-lg text-amber-300 mb-2">{selectedItem.name}</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-amber-100/80">
                <span>Original price:</span>
                <span>{originalPrice} ETB</span>
              </div>
              <div className="flex justify-between text-amber-400 font-semibold border-b border-amber-600/30 pb-2">
                <span>WOMENU comedy adjustment:</span>
                <span>+{comedyAdjustment} ETB</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold text-lg pt-1">
                <span>Total:</span>
                <span>{womanuPrice} ETB</span>
              </div>
            </div>
          </div>

          <div className="bg-red-950/60 rounded-xl p-4 border border-amber-500/20 text-sm space-y-2">
            <div className="flex justify-between text-amber-100/80">
              <span>Food preparation:</span>
              <span>15 min</span>
            </div>
            <div className="flex justify-between text-amber-400 font-semibold">
              <span>WOMENU decision time:</span>
              <span>+10 min 😂</span>
            </div>
            <div className="flex justify-between text-amber-300 font-bold border-t border-amber-600/30 pt-2 mt-2">
              <span>Estimated total:</span>
              <span>25 min</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            // Demo reset, in a real app this might go to a real cart
            resetWomanuState();
          }}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-red-950 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          Continue to Menu
        </button>

        <p className="text-center text-[10px] text-amber-200/50 mt-4">
          Demo Price. Actual store price remains {originalPrice} ETB.
        </p>
      </div>
    </div>
  );
}
