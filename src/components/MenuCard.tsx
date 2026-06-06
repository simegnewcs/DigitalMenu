'use client';

import { useState } from 'react';
import { MenuItem } from '@/types/menu';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="bg-gradient-to-br from-red-800/60 to-red-950/80 rounded-lg sm:rounded-xl p-2.5 sm:p-4 mb-2 sm:mb-3 border-2 sm:border-4 border-white/90 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
      {/* Main Item Row */}
      <div className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 ${hasSubItems ? 'cursor-pointer' : ''}`}
           onClick={() => hasSubItems && setShowDetails(!showDetails)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-1">
              {item.name}
              {hasSubItems && (
                <span className="text-amber-400 text-xs">
                  {showDetails ? '▲' : '▼'}
                </span>
              )}
            </h3>
            <span className="text-amber-300 text-xs sm:text-sm">{item.nameAmharic}</span>
          </div>
          <p className="text-amber-100/80 text-xs mt-1 leading-relaxed hidden sm:block">{item.description}</p>
        </div>
        <div className="hidden sm:block flex-1 border-b border-dotted border-amber-400/60 mx-2 mb-1 min-w-[20px]"></div>
        <div className="flex sm:block items-center justify-between sm:justify-end shrink-0 mt-1 sm:mt-0">
          <span className="text-amber-100/60 text-xs sm:hidden">
            {hasSubItems 
              ? (showDetails ? 'Tap to hide details' : `${item.subItems?.length} ingredients - tap to see`)
              : item.description
            }
          </span>
          <div className="text-right bg-red-900/60 rounded-lg px-2 sm:px-3 py-1 border border-amber-600/40">
            <span className="text-amber-300 font-bold text-base sm:text-lg">{item.price}</span>
            <span className="text-amber-400/70 text-xs ml-1">ETB</span>
          </div>
        </div>
      </div>

      {/* Expandable Sub-Items / Ingredients */}
      {hasSubItems && showDetails && (
        <div className="mt-3 ml-2 sm:ml-3 pl-2 sm:pl-3 border-l-2 sm:border-l-4 border-amber-500/60">
          <p className="text-amber-300 text-xs sm:text-sm mb-2 font-semibold">Ingredients / ንጥረ ነገሮች:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {item.subItems?.map((subItem, index) => (
              <div 
                key={index} 
                className="bg-red-900/60 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-amber-100 border-2 border-white/70 shadow-sm"
              >
                <span className="font-semibold block">{subItem.name}</span>
                {subItem.nameAmharic && (
                  <span className="text-amber-300/80 text-[10px]">/ {subItem.nameAmharic}</span>
                )}
              </div>
            ))}
          </div>
          {item.description && (
            <p className="text-amber-100/70 text-xs mt-2 italic">{item.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
