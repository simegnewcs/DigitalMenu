"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isPopular: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  menuItems: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  categories: Category[];
}

export default function PublicMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const tableNumber = searchParams.get("table");
  const slug = params.slug as string;

  useEffect(() => {
    fetchRestaurant();
  }, [slug]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/public/menu/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch restaurant", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchRestaurant();
      return;
    }

    try {
      const res = await fetch(`/api/public/search/${slug}?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
          <p className="mt-2 text-gray-600">The menu you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {restaurant.logo && (
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
                {tableNumber && (
                  <p className="text-sm text-gray-500">Table #{tableNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Tabs */}
          {!searchQuery && restaurant.categories.length > 0 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
              {restaurant.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {restaurant.categories
          .filter((cat) => !searchQuery || cat.menuItems.length > 0)
          .map((category) => (
            <div
              key={category.id}
              className={`mb-8 ${activeCategory === category.id || searchQuery ? "" : "hidden"}`}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">{category.name}</h2>
              {category.description && (
                <p className="text-sm text-gray-500 mb-4">{category.description}</p>
              )}
              <div className="space-y-4">
                {category.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex space-x-4"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover w-20 h-20"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                            {item.isPopular && (
                              <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                        <p className="font-bold text-primary-600">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {restaurant.categories.every((cat) => cat.menuItems.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
