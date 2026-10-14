"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  menuItems: MenuItem[];
}

export interface RestaurantSummary {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  _count?: {
    categories: number;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  categories: Category[];
}

export interface TrayItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface MenuViewProps {
  initialRestaurant?: Restaurant | null;
  allRestaurants?: RestaurantSummary[];
  slug?: string;
  tableNumber?: string | null;
}

export default function MenuView({
  initialRestaurant,
  allRestaurants = [],
  slug,
  tableNumber: initialTableNumber,
}: MenuViewProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(initialRestaurant || null);
  const [restaurantsList, setRestaurantsList] = useState<RestaurantSummary[]>(allRestaurants);
  const [loading, setLoading] = useState(!initialRestaurant);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filterPopularOnly, setFilterPopularOnly] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(initialTableNumber || null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemModalQty, setItemModalQty] = useState(1);
  const [itemModalNotes, setItemModalNotes] = useState("");
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);
  const [isRestaurantSwitcherOpen, setIsRestaurantSwitcherOpen] = useState(false);

  // Tray / Cart State
  const [tray, setTray] = useState<TrayItem[]>([]);

  // Load from local storage if available for current restaurant
  useEffect(() => {
    if (!restaurant?.id) return;
    try {
      const saved = localStorage.getItem(`digitalmenu_tray_${restaurant.id}`);
      if (saved) {
        setTray(JSON.parse(saved));
      }
    } catch (e) {}
  }, [restaurant?.id]);

  // Persist tray
  useEffect(() => {
    if (!restaurant?.id) return;
    try {
      localStorage.setItem(`digitalmenu_tray_${restaurant.id}`, JSON.stringify(tray));
    } catch (e) {}
  }, [tray, restaurant?.id]);

  // Initial fetch if needed
  useEffect(() => {
    if (initialRestaurant) {
      setRestaurant(initialRestaurant);
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const url = slug ? `/api/public/menu/${slug}` : `/api/public/menu`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.currentRestaurant) {
            setRestaurant(data.currentRestaurant);
            if (data.restaurants) setRestaurantsList(data.restaurants);
          } else if (data.name && data.categories) {
            setRestaurant(data);
          }
        }
      } catch (err) {
        console.error("Failed to load restaurant menu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [slug, initialRestaurant]);

  // Calculate totals
  const totalTrayCount = useMemo(() => {
    return tray.reduce((sum, item) => sum + item.quantity, 0);
  }, [tray]);

  const totalTrayPrice = useMemo(() => {
    return tray.reduce((sum, item) => sum + item.quantity * item.item.price, 0);
  }, [tray]);

  // Cart actions
  const addToTray = (item: MenuItem, quantity = 1, notes = "") => {
    setTray((prev) => {
      const existingIndex = prev.findIndex((i) => i.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          specialInstructions: notes || next[existingIndex].specialInstructions,
        };
        return next;
      } else {
        return [...prev, { item, quantity, specialInstructions: notes }];
      }
    });
    toast.success(`Added ${item.name} to order!`);
  };

  const updateTrayQty = (itemId: string, delta: number) => {
    setTray((prev) => {
      return prev
        .map((entry) => {
          if (entry.item.id === itemId) {
            const nextQty = entry.quantity + delta;
            return nextQty > 0 ? { ...entry, quantity: nextQty } : null;
          }
          return entry;
        })
        .filter(Boolean) as TrayItem[];
    });
  };

  const clearTray = () => {
    setTray([]);
    toast.success("Order cleared");
  };

  const handleCallWaiter = () => {
    setIsWaiterCalled(true);
    toast.success(
      tableNumber
        ? `Waiter called for Table #${tableNumber}! Staff notified.`
        : "Staff alerted! A team member will assist you shortly.",
      { icon: "🔔", duration: 4000 }
    );
    setTimeout(() => setIsWaiterCalled(false), 5000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Menu link copied to clipboard!");
    }
  };

  // Filter items
  const filteredCategories = useMemo(() => {
    if (!restaurant) return [];

    return restaurant.categories
      .map((cat) => {
        let items = cat.menuItems.filter((item) => item.isAvailable);

        if (filterPopularOnly) {
          items = items.filter((item) => item.isPopular);
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          items = items.filter(
            (item) =>
              item.name.toLowerCase().includes(q) ||
              (item.description && item.description.toLowerCase().includes(q))
          );
        }

        return {
          ...cat,
          menuItems: items,
        };
      })
      .filter((cat) => {
        if (activeCategory !== "all" && cat.id !== activeCategory) {
          return false;
        }
        return cat.menuItems.length > 0;
      });
  }, [restaurant, searchQuery, activeCategory, filterPopularOnly]);

  const totalMenuItemsCount = useMemo(() => {
    if (!restaurant) return 0;
    return restaurant.categories.reduce((acc, cat) => acc + cat.menuItems.length, 0);
  }, [restaurant]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50/70 text-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header skeleton */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 animate-pulse">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
            </div>
          </div>
          {/* Categories skeleton */}
          <div className="flex gap-2 my-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-28 bg-slate-200 rounded-full animate-pulse"></div>
            ))}
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white h-36 rounded-2xl border border-slate-100 p-4 flex gap-4 animate-pulse">
                <div className="w-24 h-24 bg-slate-200 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🍽️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Active Menu Found</h2>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            There are currently no active restaurant menus available. Please contact restaurant administration.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
            >
              Return to Homepage
            </Link>
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition"
            >
              Restaurant Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 selection:bg-rose-500 selection:text-white pb-32">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 min-w-0">
              {restaurant.logo ? (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <Image
                    src={restaurant.logo}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-xl font-black shadow-sm shrink-0">
                  {restaurant.name.charAt(0)}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate tracking-tight">
                    {restaurant.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 truncate mt-0.5">
                  {tableNumber ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      Table #{tableNumber}
                    </span>
                  ) : (
                    <span>Digital Interactive Menu</span>
                  )}
                  {restaurant.address && (
                    <span className="hidden sm:inline-block truncate">
                      • {restaurant.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Call Waiter Button */}
              <button
                onClick={handleCallWaiter}
                disabled={isWaiterCalled}
                title="Call Waiter"
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isWaiterCalled
                    ? "bg-amber-50 border-amber-300 text-amber-700 cursor-default"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="text-sm">🔔</span>
                <span className="hidden md:inline">
                  {isWaiterCalled ? "Staff Notified" : "Call Waiter"}
                </span>
              </button>

              {/* Share / QR Link */}
              <button
                onClick={handleShare}
                title="Share Menu"
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Restaurant Switcher (if multiple exist) */}
              {restaurantsList.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setIsRestaurantSwitcherOpen(!isRestaurantSwitcherOpen)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <span>🏬</span>
                    <span className="hidden sm:inline">Restaurants</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isRestaurantSwitcherOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Available Restaurants
                      </div>
                      <div className="space-y-1 max-h-56 overflow-y-auto">
                        {restaurantsList.map((r) => (
                          <Link
                            key={r.id}
                            href={`/menu/${r.slug}`}
                            onClick={() => setIsRestaurantSwitcherOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                              r.slug === restaurant.slug
                                ? "bg-rose-50 text-rose-700 font-bold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            <span className="truncate flex-1">{r.name}</span>
                            {r.slug === restaurant.slug && <span>✓</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search dishes, drinks, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100/80 focus:bg-white text-sm rounded-xl border border-transparent focus:border-slate-300 focus:ring-3 focus:ring-rose-500/10 transition outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Popular Filter Pill */}
            <button
              onClick={() => setFilterPopularOnly(!filterPopularOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0 border ${
                filterPopularOnly
                  ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>🔥</span>
              <span>Popular Picks</span>
            </button>
          </div>

          {/* Categories Pill Navigation */}
          {restaurant.categories.length > 0 && !searchQuery && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                All Dishes ({totalMenuItemsCount})
              </button>

              {restaurant.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeCategory === category.id
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-600/20"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === category.id
                        ? "bg-rose-700 text-rose-100"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.menuItems.length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Restaurant Description or Notice */}
        {restaurant.description && !searchQuery && activeCategory === "all" && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50/60 via-amber-50/40 to-white border border-rose-100/60 text-xs text-slate-600 flex items-center gap-3">
            <span className="text-2xl shrink-0">✨</span>
            <p className="leading-relaxed">{restaurant.description}</p>
          </div>
        )}

        {/* Categories & Dish Items */}
        {filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{category.name}</span>
                      <span className="text-xs font-medium text-slate-400">
                        ({category.menuItems.length})
                      </span>
                    </h2>
                    {category.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.menuItems.map((item) => {
                    const inTray = tray.find((t) => t.item.id === item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setItemModalQty(inTray ? inTray.quantity : 1);
                          setItemModalNotes(inTray?.specialInstructions || "");
                        }}
                        className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition cursor-pointer flex gap-4 relative overflow-hidden"
                      >
                        {/* Dish Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition text-sm sm:text-base leading-snug">
                                {item.name}
                              </h3>
                            </div>

                            {item.isPopular && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70 px-2 py-0.5 rounded-full">
                                  <span>🔥</span> Popular
                                </span>
                              </div>
                            )}

                            {item.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-base font-black text-slate-900">
                              ETB {Number(item.price).toFixed(2)}
                            </span>

                            {/* Add / Qty Control */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1"
                            >
                              {inTray ? (
                                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                                  <button
                                    onClick={() => updateTrayQty(item.id, -1)}
                                    className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 font-bold flex items-center justify-center text-xs shadow-xs"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-slate-900">
                                    {inTray.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateTrayQty(item.id, 1)}
                                    className="w-7 h-7 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-bold flex items-center justify-center text-xs shadow-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToTray(item, 1)}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                >
                                  <span>+</span> Add
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dish Photo or Graphic */}
                        {item.image ? (
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-300"
                              sizes="(max-width: 640px) 96px, 112px"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-300 group-hover:text-rose-400 group-hover:bg-rose-50/50 transition shrink-0">
                            <span className="text-2xl">🍲</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1">Fresh</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 my-8">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">No matching items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try searching for another dish or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setFilterPopularOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Footer Brand Credit */}
        <div className="pt-10 pb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 text-slate-500 hover:text-slate-800 transition"
          >
            <Image
              src="/logo.png"
              alt="DigitalMenu"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded-md"
            />
            <span className="text-[11px] font-medium">
              Powered by <strong className="text-slate-700">DigitalMenu</strong>
            </span>
          </Link>
        </div>
      </main>

      {/* Floating Bottom Tray Bar (Appears when items are selected) */}
      {totalTrayCount > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4 max-w-lg mx-auto">
          <div
            onClick={() => setIsTrayOpen(true)}
            className="bg-slate-950 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between cursor-pointer hover:bg-slate-900 transition transform hover:-translate-y-0.5 border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-black text-sm">
                {totalTrayCount}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Your Table Tray</p>
                <p className="text-sm font-black tracking-tight">ETB {totalTrayPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition">
              <span>View Order</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm z-10"
            >
              ✕
            </button>

            {selectedItem.image ? (
              <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-36 rounded-2xl bg-gradient-to-tr from-rose-50 to-amber-50 flex items-center justify-center text-4xl mb-4 border border-slate-100">
                🍽️
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedItem.name}
                </h3>
                {selectedItem.isPopular && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full mt-1 border border-amber-200/70">
                    🔥 Chef&apos;s Popular Choice
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-rose-600">
                ETB {Number(selectedItem.price).toFixed(2)}
              </span>
            </div>

            {selectedItem.description && (
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {selectedItem.description}
              </p>
            )}

            {/* Special Instructions Note */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Special Instructions (optional)
              </label>
              <textarea
                value={itemModalNotes}
                onChange={(e) => setItemModalNotes(e.target.value)}
                placeholder="E.g., No spicy peppers, sauce on the side, extra napkins..."
                rows={2}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>

            {/* Quantity and Add Button */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                <button
                  onClick={() => setItemModalQty(Math.max(1, itemModalQty - 1))}
                  className="w-9 h-9 rounded-xl bg-white text-slate-800 font-bold flex items-center justify-center text-sm shadow-xs"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-sm text-slate-900">
                  {itemModalQty}
                </span>
                <button
                  onClick={() => setItemModalQty(itemModalQty + 1)}
                  className="w-9 h-9 rounded-xl bg-white text-slate-800 font-bold flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToTray(selectedItem, itemModalQty, itemModalNotes);
                  setSelectedItem(null);
                }}
                className="flex-1 py-3 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-600/20 transition flex items-center justify-between"
              >
                <span>Add to Tray</span>
                <span>ETB {(selectedItem.price * itemModalQty).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tray Drawer / Order Review Slide-over */}
      {isTrayOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div
            className="w-full max-w-md bg-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Table Order</h3>
                <p className="text-xs text-slate-500">
                  {tableNumber ? `Table #${tableNumber}` : "Dine-in Order Review"}
                </p>
              </div>
              <button
                onClick={() => setIsTrayOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Tray Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {tray.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <span className="text-4xl mb-2">🍽️</span>
                  <p className="font-bold text-slate-700 text-sm">Your tray is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Tap &quot;+ Add&quot; on any dish to prepare your order</p>
                </div>
              ) : (
                tray.map((entry) => (
                  <div
                    key={entry.item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm">{entry.item.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ETB {entry.item.price.toFixed(2)} each
                      </p>
                      {entry.specialInstructions && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md mt-1 border border-amber-200/50">
                          Note: {entry.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-sm font-black text-slate-900">
                        ETB {(entry.item.price * entry.quantity).toFixed(2)}
                      </span>

                      <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
                        <button
                          onClick={() => updateTrayQty(entry.item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => updateTrayQty(entry.item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tray Footer & Actions */}
            {tray.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">ETB {totalTrayPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Tax / Service</span>
                    <span className="font-semibold text-slate-800">Included</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-rose-600">ETB {totalTrayPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Table Number Confirmation */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Table Number:</span>
                  <input
                    type="number"
                    value={tableNumber || ""}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="E.g. 5"
                    className="w-20 px-2 py-1 text-center font-bold bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearTray}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      toast.success(
                        tableNumber
                          ? `Order confirmed for Table #${tableNumber}! Show your tray to your server.`
                          : "Order tray ready! Show this summary to your server.",
                        { duration: 5000, icon: "🛎️" }
                      );
                      setIsTrayOpen(false);
                    }}
                    className="flex-1 py-3 px-4 bg-slate-950 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>🛎️ Ready for Server</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
