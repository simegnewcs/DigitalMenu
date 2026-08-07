import { ReactNode } from 'react';
import { WomanuProvider } from '@/components/WomanuContext';
import WomanuModeSelector from '@/components/WomanuModeSelector';
import WomanuRecommendationModal from '@/components/WomanuRecommendationModal';
import WomanuOrderSummary from '@/components/WomanuOrderSummary';

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <WomanuProvider>
      {children}
      <WomanuModeSelector />
      <WomanuRecommendationModal />
      <WomanuOrderSummary />
    </WomanuProvider>
  );
}
