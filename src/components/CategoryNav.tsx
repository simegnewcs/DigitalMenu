'use client';

import { Category } from '@/types/menu';
import Link from 'next/link';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <nav className="sticky top-0 bg-white shadow-md z-10 mb-6">
      <div className="flex overflow-x-auto py-3 px-4 gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/menu/${cat.id}`}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === cat.id 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <span className="mr-1">{cat.name}</span>
            <span className="text-xs opacity-75">({cat.nameAm})</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
