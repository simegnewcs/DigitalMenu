'use client';

import { Category } from '@/types/menu';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-[60px] sm:top-[72px] z-40 transition-all duration-300 ${
      scrolled ? 'shadow-xl' : 'shadow-lg'
    }`}>
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 py-2 sm:py-3 px-2 sm:px-4">
        <div className="flex overflow-x-auto gap-2 sm:gap-3 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu/${cat.id}`}
              className={`whitespace-nowrap px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border-2
                ${activeCategory === cat.id 
                  ? 'bg-red-900 text-amber-300 border-amber-400 shadow-inner' 
                  : 'bg-red-950/80 text-amber-200 border-amber-600/50 hover:bg-red-900 hover:border-amber-400'
                }`}
            >
              <span className="mr-1">{cat.name}</span>
              <span className="text-[10px] sm:text-xs opacity-80">({cat.nameAm})</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
