'use client';

import { MenuItem } from '@/types/menu';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-sm text-amber-600 font-medium">{item.nameAmharic}</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-green-600">{item.price} ETB</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
    </div>
  );
}
