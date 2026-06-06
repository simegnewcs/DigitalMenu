'use client';

import { useState } from 'react';
import { menuItems, categories } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import Image from 'next/image';

// PDF Generation Function
const generatePDF = () => {
  // Create a printable window with styled content
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Build menu HTML
  let menuHTML = '';
  categories.forEach((category) => {
    const items = menuItems.filter(item => item.category === category.id);
    if (items.length === 0) return;

    menuHTML += `
      <div class="category">
        <div class="category-header">
          <span class="category-am">${category.nameAm}</span> / ${category.name}
        </div>
        <div class="items">
    `;

    items.forEach((item) => {
      const subItemsHtml = item.subItems && item.subItems.length > 0
        ? `<div class="ingredients">${item.subItems.map(si => `<span class="ingredient">${si.name}</span>`).join('')}</div>`
        : '';

      menuHTML += `
        <div class="item">
          <div class="item-header">
            <div class="item-names">
              <span class="item-name">${item.name}</span>
              <span class="item-am">${item.nameAmharic}</span>
            </div>
            <div class="item-price">${item.price} <span class="currency">ETB</span></div>
          </div>
          <div class="item-desc">${item.description}</div>
          ${subItemsHtml}
        </div>
      `;
    });

    menuHTML += '</div></div>';
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dagmaros Menu</title>
        <style>
          @page { size: A4; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            background: white;
            color: #450a0a;
            line-height: 1.4;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 10mm;
          }
          .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #d97706;
            margin-bottom: 20px;
          }
          .logo {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 3px solid #f59e0b;
            margin: 0 auto 10px;
          }
          .restaurant-name {
            font-size: 26px;
            color: #450a0a;
            margin-bottom: 3px;
          }
          .restaurant-am {
            font-size: 16px;
            color: #92400e;
          }
          .category {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .category-header {
            background: linear-gradient(to right, #d97706, #fbbf24, #d97706);
            color: #450a0a;
            padding: 8px 15px;
            font-size: 16px;
            border-radius: 8px;
            margin-bottom: 10px;
            text-align: center;
          }
          .category-am {
            font-size: 18px;
          }
          .items {
            padding: 0 5px;
          }
          .item {
            background: #fef3c7;
            border: 1px solid #d97706;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 8px;
            page-break-inside: avoid;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
          }
          .item-names {
            display: flex;
            flex-direction: column;
          }
          .item-name {
            font-size: 14px;
            color: #450a0a;
          }
          .item-am {
            font-size: 12px;
            color: #92400e;
          }
          .item-price {
            font-size: 16px;
            color: #450a0a;
            white-space: nowrap;
          }
          .currency {
            font-size: 11px;
            color: #92400e;
          }
          .item-desc {
            font-size: 11px;
            color: #78350f;
            font-style: italic;
            margin-bottom: 5px;
          }
          .ingredients {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
          }
          .ingredient {
            background: #fde68a;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            color: #78350f;
            border: 1px solid #f59e0b;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #d97706;
            font-size: 11px;
            color: #92400e;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="/dagmaroslogo.jpg" class="logo" alt="Logo" />
            <div class="restaurant-name">Dagmaros Cafe & Restaurant</div>
            <div class="restaurant-am">ዳግማሮስ ካፌ እና ሬስቶራንት</div>
          </div>
          ${menuHTML}
          <div class="footer">
            <p>Thank you for visiting Dagmaros Cafe & Restaurant</p>
            <p>አስተማማኝ አገልግሎት እናበርክታለን</p>
            <p style="margin-top: 10px;">Powered by DevVoltz Technology PLC</p>
          </div>
        </div>
        <div class="no-print" style="text-align: center; padding: 20px; background: #fef3c7;">
          <button onclick="window.print()" style="padding: 12px 30px; font-size: 16px; font-family: 'Times New Roman', serif; font-weight: bold; background: #d97706; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Save as PDF
          </button>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

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

      {/* PDF Download Button */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4">
        <button
          onClick={generatePDF}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 sm:py-4 rounded-lg font-bold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg border-2 border-blue-400 text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Menu
        </button>
      </div>

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
