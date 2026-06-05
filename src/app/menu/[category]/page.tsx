import { menuItems, categories } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.id,
  }));
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-800 text-white py-4 px-4 text-center sticky top-0 z-20">
        <Link href="/">
          <h1 className="text-2xl font-bold">Dagmaros Cafe & Restaurant</h1>
          <p className="text-amber-200 text-sm">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
        </Link>
      </header>

      <CategoryNav categories={categories} activeCategory={category} />

      <main className="container mx-auto px-4 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/menu" className="text-amber-600 hover:text-amber-700">
            ← All Menu
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {categoryData.name}
          <span className="ml-2 text-lg text-amber-600">({categoryData.nameAm})</span>
        </h2>
        
        <div className="grid gap-4">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
