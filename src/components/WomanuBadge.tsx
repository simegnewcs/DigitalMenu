'use client';

import { useWomanu } from './WomanuContext';

export default function WomanuBadge() {
  const { mode } = useWomanu();
  if (!mode) return null;
  return (
    <div className="bg-red-950/80 border-b border-amber-600/30 text-center py-1.5 shadow-md">
      <span className="text-xs sm:text-sm font-bold text-amber-300">
        {mode === 'womenu' ? '😂 WOMENU MODE ACTIVE' : '👨 MEN-U MODE'}
      </span>
    </div>
  );
}
