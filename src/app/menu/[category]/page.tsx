import { menuItems, categories } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [
    { category: 'pizza' },
    { category: 'lunch' },
    { category: 'burger' },
    { category: 'breakfast' },
    { category: 'soup' },
    { category: 'milkshake' },
    { category: 'juice' },
    { category: 'hotdrinks' },
    { category: 'fruitea' },
    { category: 'cake' },
    { category: 'beverages' },
  ];
}

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryData = categories.find(c => c.id === category);
  
  if (!categoryData) {
    notFound();
  }

  const items = menuItems.filter(item => item.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-red-950">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b-2 border-amber-600/50 shadow-2xl">
        <div className="py-4 px-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Center Banner Text */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-wide">Dagmaros Cafe & Restaurant</h1>
              <p className="text-amber-300/80 text-sm md:text-base mt-1">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
            </div>
            
            {/* Right Side Logo */}
            <Link href="/" className="shrink-0 ml-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg">
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

      <CategoryNav categories={categories} activeCategory={category} />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        <div className="mb-6">
          <Link href="/menu" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium">
            <span>←</span>
            <span>All Categories</span>
          </Link>
        </div>

        <section className="mb-10">
          <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-t-lg py-3 px-6 shadow-lg">
            <h2 className="text-xl font-bold text-red-950 flex items-center justify-center">
              <span className="text-2xl mr-2">{categoryData.nameAm}</span>
              <span className="text-lg">/ {categoryData.name}</span>
            </h2>
          </div>
          <div className="bg-gradient-to-b from-red-900/90 to-red-950/90 rounded-b-lg p-5 border-2 border-amber-600/30 border-t-0 shadow-xl">
            {items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-t-2 border-amber-600/50 py-6 text-center">
        <p className="text-amber-400/60 text-sm">Thank you for visiting Dagmaros Cafe & Restaurant</p>
        <p className="text-amber-300/40 text-xs mt-1">አስተማማኝ አገልግሎት እናበርክታለን</p>
        <p className="text-amber-500/50 text-xs mt-3">
          Developed by <a href="https://www.devvoltz.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline transition-colors">DevVoltz Technology PLC</a>
        </p>
      </footer>
    </div>
  );
}
