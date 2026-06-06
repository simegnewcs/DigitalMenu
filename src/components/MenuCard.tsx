'use client';

import { MenuItem } from '@/types/menu';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-3 border-b border-amber-900/20 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-white font-medium text-sm sm:text-base">{item.name}</h3>
          <span className="text-amber-300 text-xs sm:text-sm">{item.nameAmharic}</span>
        </div>
        <p className="text-amber-100/70 text-xs mt-0.5 leading-relaxed hidden sm:block">{item.description}</p>
      </div>
      <div className="hidden sm:block flex-1 border-b border-dotted border-amber-400/50 mx-2 mb-1 min-w-[20px]"></div>
      <div className="flex sm:block items-center justify-between sm:justify-end shrink-0 mt-1 sm:mt-0">
        <span className="text-amber-100/50 text-xs sm:hidden">{item.description.slice(0, 30)}...</span>
        <div className="text-right">
          <span className="text-amber-300 font-bold text-base sm:text-lg">{item.price}</span>
          <span className="text-amber-400/70 text-xs ml-1">ETB</span>
        </div>
      </div>
    </div>
  );
}
