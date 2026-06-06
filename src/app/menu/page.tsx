'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(categories.map(c => c.id))
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b-2 border-amber-600/50 shadow-2xl">
        <div className="py-3 sm:py-4 px-3 sm:px-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Center Banner Text */}
            <div className="flex-1 text-center min-w-0 px-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-400 tracking-wide truncate">Dagmaros Cafe & Restaurant</h1>
              <p className="text-amber-300/80 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
            </div>
            
            {/* Right Side Logo */}
            <Link href="/" className="shrink-0 ml-2 sm:ml-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg">
                <Image 
                  src="/dagmaroslogo.jpg" 
                  alt="Dagmaros Logo" 
                  width={64} 
                  height={64} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <CategoryNav categories={categories} activeCategory="all" />

      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-8 sm:pb-12">
        {categories.map((category) => {
          const items = menuItems.filter(item => item.category === category.id);
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <section key={category.id} id={category.id} className="mb-6 sm:mb-8">
              {/* Clickable Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-t-lg sm:rounded-t-xl py-2 sm:py-3 px-3 sm:px-6 shadow-lg sm:shadow-xl border-2 sm:border-4 border-blue-600/90 flex items-center justify-between hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-center justify-center flex-1 gap-1">
                  <span className="text-lg sm:text-2xl font-bold text-red-950">{category.nameAm}</span>
                  <span className="text-sm sm:text-lg font-bold text-red-950">/ {category.name}</span>
                </div>
                {/* Expand/Collapse Icon */}
                <div className="ml-2 shrink-0">
                  {isExpanded ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-950 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-950 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              
              {/* Collapsible Items List */}
              {isExpanded && (
                <div className="bg-gradient-to-b from-red-900/95 to-red-950/95 rounded-b-lg sm:rounded-b-xl p-3 sm:p-5 border-2 sm:border-4 border-blue-600/80 border-t-0 shadow-xl sm:shadow-2xl">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
              
              {/* Show item count when collapsed */}
              {!isExpanded && (
                <div className="bg-red-900/50 rounded-b-lg sm:rounded-b-xl py-2 px-3 sm:px-5 border-2 sm:border-4 border-blue-600/70 border-t-0 text-center shadow-lg">
                  <span className="text-amber-300/60 text-xs sm:text-sm">{items.length} items available - tap to view</span>
                </div>
              )}
            </section>
          );
        })}
      </main>

      <footer className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-t-2 border-amber-600/50 py-4 sm:py-6 text-center">
        <p className="text-amber-400/60 text-xs sm:text-sm">Thank you for visiting Dagmaros Cafe & Restaurant</p>
        <p className="text-amber-300/40 text-xs mt-1">አስተማማኝ አገልግሎት እናበርክታለን</p>
        <p className="text-amber-500/50 text-xs mt-2 sm:mt-3">
          Developed by <a href="https://www.devvoltz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline transition-colors">DevVoltz Technology PLC</a>
        </p>
      </footer>
    </div>
  );
}
