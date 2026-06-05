import { menuItems, categories } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import CategoryNav from '@/components/CategoryNav';
import Link from 'next/link';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amber-800 text-white py-4 px-4 text-center sticky top-0 z-20">
        <Link href="/">
          <h1 className="text-2xl font-bold">Dagmaros Cafe & Restaurant</h1>
          <p className="text-amber-200 text-sm">ዳግማሮስ ካፌ እና ሬስቶራንት</p>
        </Link>
      </header>

      <CategoryNav categories={categories} activeCategory="all" />

      <main className="container mx-auto px-4 pb-8">
        {categories.map((category) => {
          const items = menuItems.filter(item => item.category === category.id);
          return (
            <section key={category.id} id={category.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                {category.name}
                <span className="ml-2 text-lg text-amber-600">({category.nameAm})</span>
              </h2>
              <div className="grid gap-4">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
