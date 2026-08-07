'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '@/types/menu';

export type AppMode = 'menu' | 'womanu' | null;

interface WomanuContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  // The item currently being interacted with in WOMANU mode
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  // The recommended alternative
  recommendedItem: MenuItem | null;
  setRecommendedItem: (item: MenuItem | null) => void;
  // Interaction state
  changesCount: number;
  setChangesCount: (count: number | ((prev: number) => number)) => void;
  // Modal visibility
  showRecommendationModal: boolean;
  setShowRecommendationModal: (show: boolean) => void;
  showOrderSummary: boolean;
  setShowOrderSummary: (show: boolean) => void;
  // Reset interaction state
  resetWomanuState: () => void;
}

const WomanuContext = createContext<WomanuContextType | undefined>(undefined);

export function WomanuProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>(null); // null means user hasn't chosen yet
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [recommendedItem, setRecommendedItem] = useState<MenuItem | null>(null);
  const [changesCount, setChangesCount] = useState(0);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const resetWomanuState = () => {
    setSelectedItem(null);
    setRecommendedItem(null);
    setChangesCount(0);
    setShowRecommendationModal(false);
    setShowOrderSummary(false);
  };

  return (
    <WomanuContext.Provider
      value={{
        mode,
        setMode,
        selectedItem,
        setSelectedItem,
        recommendedItem,
        setRecommendedItem,
        changesCount,
        setChangesCount,
        showRecommendationModal,
        setShowRecommendationModal,
        showOrderSummary,
        setShowOrderSummary,
        resetWomanuState,
      }}
    >
      {children}
    </WomanuContext.Provider>
  );
}

export function useWomanu() {
  const context = useContext(WomanuContext);
  if (context === undefined) {
    throw new Error('useWomanu must be used within a WomanuProvider');
  }
  return context;
}
