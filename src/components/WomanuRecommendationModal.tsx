'use client';

import React, { useState, useEffect } from 'react';
import { useWomanu } from './WomanuContext';
import { getRecommendation, getRejectionMessage, getConfidenceScore, getWomanuPrice } from '@/data/womanuLogic';

export default function WomanuRecommendationModal() {
  const { 
    mode, 
    selectedItem, 
    changesCount, 
    setChangesCount, 
    showRecommendationModal, 
    setShowRecommendationModal,
    setShowOrderSummary
  } = useWomanu();

  const [step, setStep] = useState<'initial' | 'recommendation' | 'rejection' | 'friend'>('initial');
  const [recommendationData, setRecommendationData] = useState<ReturnType<typeof getRecommendation> | null>(null);
  const [showReasons, setShowReasons] = useState(false);

  useEffect(() => {
    if (showRecommendationModal && selectedItem) {
      setStep('initial');
      setShowReasons(false);
      setRecommendationData(getRecommendation(selectedItem.id, selectedItem.category));
      
      const timer = setTimeout(() => {
        setStep('recommendation');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showRecommendationModal, selectedItem]);

  if (mode !== 'womanu' || !showRecommendationModal || !selectedItem || !recommendationData) return null;

  const handleAcceptRecommendation = () => {
    setChangesCount(prev => prev + 1);
    setShowRecommendationModal(false);
    // Note: To truly change the selection and trigger again, we rely on the user clicking the new item from the menu, 
    // or we could auto-select it. Auto-selecting and jumping to summary ruins the menu browsing.
    // Instead we just close the modal and let them continue. Or we jump straight to checkout with the new item.
    // Let's close and let them select it, OR we auto-checkout with it?
    // User requested: If they choose it, they might change their mind again. 
    // Actually, let's just close modal. If they want it, they'll find it.
    setShowRecommendationModal(false);
  };

  const handleReject = () => {
    setStep('rejection');
  };

  const handleFinalConfirm = () => {
    setShowRecommendationModal(false);
    setShowOrderSummary(true);
  };

  const rejectionMsg = getRejectionMessage(changesCount);
  const confidenceScore = getConfidenceScore(changesCount);
  const inflatedPrice = getWomanuPrice(selectedItem.price);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-red-900 to-red-950 border-2 border-amber-500 rounded-2xl shadow-2xl p-5 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Progress / Score Header */}
        {step !== 'initial' && (
          <div className="mb-4 bg-red-950/50 rounded-lg p-3 border border-amber-600/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-200/80 text-xs font-bold">Decision Confidence</span>
              <span className="text-amber-400 text-xs font-bold">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-red-950 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${confidenceScore > 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Step: Initial Selection acknowledgment */}
        {step === 'initial' && (
          <div className="text-center py-8 animate-pulse">
            <h3 className="text-xl font-bold text-amber-300 mb-2">{selectedItem.name} selected!</h3>
            <p className="text-amber-100/80">Okay, preparing your choice...</p>
          </div>
        )}

        {/* Step: Recommendation */}
        {step === 'recommendation' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center space-y-2">
              {changesCount > 0 && (
                <p className="text-red-400 font-bold text-sm">Wait, you just changed your mind! 😂</p>
              )}
              <h3 className="text-xl font-bold text-amber-300">{recommendationData.message}</h3>
              <p className="text-amber-100">{recommendationData.subMessage}</p>
            </div>
            
            <div 
              className="bg-red-800/40 rounded-xl p-3 border border-amber-500/30 cursor-pointer hover:bg-red-800/60 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              onClick={() => setShowReasons(!showReasons)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-amber-200/60 block">AI Recommendation:</span>
                <span className="text-[10px] text-amber-400 animate-pulse font-semibold">Tap to see why 👇</span>
              </div>
              <div className="font-bold text-amber-400">{recommendationData.recommendedItem.name}</div>
              
              {showReasons && recommendationData.reasons && (
                <div className="mt-3 space-y-2 border-t border-amber-600/30 pt-3 animate-in slide-in-from-top-2">
                  {recommendationData.reasons.map((reason, i) => (
                    <div key={i} className="text-xs text-amber-100 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleAcceptRecommendation}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-red-950 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Change to {recommendationData.recommendedItem.name}
              </button>
              <button
                onClick={handleReject}
                className="w-full bg-red-950/50 border border-amber-600/30 text-amber-200/80 font-semibold py-3 rounded-xl hover:bg-red-900 transition-colors text-sm"
              >
                No, I want my {selectedItem.name} 😤
              </button>
            </div>
          </div>
        )}

        {/* Step: Rejection pushback */}
        {step === 'rejection' && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300 text-center">
            <h3 className="text-2xl font-bold text-amber-300 mb-1">{rejectionMsg.title}</h3>
            <p className="text-amber-100 mb-4">{rejectionMsg.desc}</p>
            
            <div className="bg-red-950 rounded-xl p-4 border border-amber-500/30 text-left mb-4">
              <span className="text-xs text-amber-200/60 block mb-1">You selected:</span>
              <div className="font-bold text-amber-400 text-lg">{selectedItem.name}</div>
              <div className="text-amber-300/80 text-sm">{inflatedPrice} ETB</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleFinalConfirm}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                YES, I'M SURE 😤
              </button>
              <button
                onClick={() => setShowRecommendationModal(false)}
                className="w-full bg-transparent border border-amber-600/30 text-amber-200/80 font-semibold py-3 rounded-xl hover:bg-red-900 transition-colors text-sm"
              >
                Let me look again 😂
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
