'use client';

import { MenuItem } from '@/types/menu';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="flex items-baseline gap-2 py-3 border-b border-amber-900/20 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="text-white font-medium text-base truncate">{item.name}</h3>
          <span className="text-amber-300 text-sm">{item.nameAmharic}</span>
        </div>
        <p className="text-amber-100/70 text-xs mt-1 leading-relaxed">{item.description}</p>
      </div>
      <div className="flex-1 border-b border-dotted border-amber-400/50 mx-2 mb-1"></div>
      <div className="text-right shrink-0">
        <span className="text-amber-300 font-bold text-lg">{item.price}</span>
        <span className="text-amber-400/70 text-xs ml-1">ETB</span>
      </div>
    </div>
  );
}
