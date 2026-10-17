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

// Curated high-resolution dish imagery for BGS menu items
const DISH_IMAGE_FALLBACKS: Record<string, string> = {
  // Chicken / Main
  "Special Chicken Shawarma": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop&q=80",
  "Normal Shawarma": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80",
  "Family Style": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
  "BGS Special": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
  "Full Roasted Chicken": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80",
  "Half Roasted Chicken": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
  "Chicken Grill": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80",
  "Chicken Wings": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",

  // Main Dishes
  "KAPSA": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80",
  "Mofo": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80",
  "Akeda": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
  "Fassa": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
  "Grill Chicken Breast": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop&q=80",
  "Fajita": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
  "Chicken Shekla Tibse": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
  "Roasted Chicken Leg": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80",

  // Fasting Menu
  "BGS Fasting Salade": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
  "BGS Veggy Wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
  "Cooked Vegetables": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
  "Salad with Rice": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80",
  "French Fries": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",

  // Mojito
  "Special Mojito": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
  "Lemon Mojito": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
  "Cinnamon Mojito": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80",
  "Strawberry Mojito": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
  "Pineapple Mojito": "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&auto=format&fit=crop&q=80",
  "Mint Mojito": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
  "Coffee Mojito": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
  "Ginger Mojito": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80",
  "Mojito without Ice": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80",

  // Juices
  "BGS Special Juice": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80",
  "Orange Juice": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
  "Watermelon Juice": "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=600&auto=format&fit=crop&q=80",
  "Pineapple Juice": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop&q=80",
  "Flaxseed Juice": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80",
  "Carrot Juice": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
  "Strawberry Juice": "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80",
  "Temet Juice": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
  "Fasting Special Juice": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80",

  // Soft Drinks
  "Soft Drink": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&auto=format&fit=crop&q=80",
  "Ambo Water": "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&auto=format&fit=crop&q=80",
  "Bottled Water ½ Liter": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",

  // Extras
  "Mayonnaise": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
  "Spice": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
  "Pita": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
  "Ketchup": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",

  // Takeaway
  "Takeaway Box": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80",
  "Takeaway Bag": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
  "Juice Cup": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
};

// Category Top Arc Icons & Images
const CATEGORY_ASSETS: Record<string, { icon: string; image: string; short: string }> = {
  "Chicken / Main": {
    icon: "🍗",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&auto=format&fit=crop&q=80",
    short: "Chicken",
  },
  "Main Dishes": {
    icon: "🍢",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop&q=80",
    short: "Mains",
  },
  "Fasting Menu": {
    icon: "🥗",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=80",
    short: "Fasting",
  },
  "Mojito": {
    icon: "🍹",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80",
    short: "Mojito",
  },
  "Juices": {
    icon: "🧃",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&auto=format&fit=crop&q=80",
    short: "Juices",
  },
  "Soft Drinks": {
    icon: "🥤",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&auto=format&fit=crop&q=80",
    short: "Drinks",
  },
  "Extras": {
    icon: "🍟",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200&auto=format&fit=crop&q=80",
    short: "Extras",
  },
  "Takeaway": {
    icon: "📦",
    image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&auto=format&fit=crop&q=80",
    short: "Takeaway",
  },
};

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
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(initialTableNumber || null);

  // Active Bottom Nav Tab
  const [activeNavTab, setActiveNavTab] = useState<"home" | "orders" | "favorites" | "waiter">("home");

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemModalQty, setItemModalQty] = useState(1);
  const [itemModalNotes, setItemModalNotes] = useState("");
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);
  const [isRestaurantSwitcherOpen, setIsRestaurantSwitcherOpen] = useState(false);

  // Tray / Cart State
  const [tray, setTray] = useState<TrayItem[]>([]);

  // Load Tray from localStorage
  useEffect(() => {
    if (!restaurant?.id) return;
    try {
      const savedTray = localStorage.getItem(`digitalmenu_tray_${restaurant.id}`);
      if (savedTray) setTray(JSON.parse(savedTray));

      const savedFavs = localStorage.getItem(`digitalmenu_favs_${restaurant.id}`);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch (e) {}
  }, [restaurant?.id]);

  // Persist Tray
  useEffect(() => {
    if (!restaurant?.id) return;
    try {
      localStorage.setItem(`digitalmenu_tray_${restaurant.id}`, JSON.stringify(tray));
    } catch (e) {}
  }, [tray, restaurant?.id]);

  // Persist Favorites
  useEffect(() => {
    if (!restaurant?.id) return;
    try {
      localStorage.setItem(`digitalmenu_favs_${restaurant.id}`, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites, restaurant?.id]);

  // Fetch Menu if needed
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

  // Totals
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
    toast.success(`Added ${item.name} to order!`, {
      style: {
        background: "#062E19",
        color: "#00E564",
        border: "1px solid #0E542F",
      },
      icon: "🛒",
    });
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
    toast.success("Order tray cleared", {
      style: { background: "#062E19", color: "#fff", border: "1px solid #0E542F" },
    });
  };

  const toggleFavorite = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      toast(exists ? "Removed from favorites" : "Added to favorites! ❤️", {
        icon: exists ? "🤍" : "❤️",
        style: { background: "#062E19", color: "#fff", border: "1px solid #0E542F" },
      });
      return next;
    });
  };

  const handleCallWaiter = () => {
    setIsWaiterCalled(true);
    toast.success(
      tableNumber
        ? `🔔 Staff notified for Table #${tableNumber}! A server is on the way.`
        : "🔔 Staff notified! A team member will assist you shortly.",
      {
        duration: 5000,
        style: {
          background: "#062E19",
          color: "#00E564",
          border: "1px solid #00E564",
          fontWeight: "bold",
        },
      }
    );
    setTimeout(() => setIsWaiterCalled(false), 5000);
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

        if (filterFavoritesOnly) {
          items = items.filter((item) => favorites.includes(item.id));
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
  }, [restaurant, searchQuery, activeCategory, filterPopularOnly, filterFavoritesOnly, favorites]);

  const totalMenuItemsCount = useMemo(() => {
    if (!restaurant) return 0;
    return restaurant.categories.reduce((acc, cat) => acc + cat.menuItems.length, 0);
  }, [restaurant]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#02180B] text-white flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-[#00E564] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-sm tracking-wide text-emerald-400">Loading BGS Digital Menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#02180B] text-white flex flex-col items-center justify-center p-6 text-center">
        <span className="text-5xl mb-4">🍗</span>
        <h2 className="text-2xl font-black text-white">Restaurant Not Found</h2>
        <p className="text-sm text-emerald-300/70 mt-2 max-w-sm">
          The requested menu could not be located. Please check the QR code or link.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#00E564] text-black font-extrabold rounded-2xl text-sm transition hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#011409] text-white selection:bg-[#00E564] selection:text-black">
      {/* Outer Shell for Desktop & Native Mobile Container */}
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto min-h-screen bg-[#021C0E] shadow-[0_0_80px_rgba(0,229,100,0.12)] relative flex flex-col pb-28 border-x border-[#07381D]/60">
        
        {/* Subtle Top Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-[#00E564]/10 via-[#04331A]/30 to-transparent pointer-events-none -z-0"></div>

        {/* 1. TOP STATUS BAR (Mobile-native aesthetic) */}
        <div className="relative z-10 px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-emerald-200/70 tracking-tight">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            {/* Cellular signal */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1 bg-emerald-300 rounded-xs"></span>
              <span className="w-0.5 h-1.5 bg-emerald-300 rounded-xs"></span>
              <span className="w-0.5 h-2 bg-emerald-300 rounded-xs"></span>
              <span className="w-0.5 h-3 bg-emerald-300 rounded-xs"></span>
            </div>
            {/* Wifi Icon */}
            <svg className="w-3.5 h-3.5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zm-2.829 2.828a3 3 0 00-4.242 0 1 1 0 01-1.415-1.414 5 5 0 017.072 0 1 1 0 01-1.415 1.414zM10 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {/* Battery Icon */}
            <div className="w-5 h-2.5 rounded-xs border border-emerald-300/80 p-0.5 flex items-center">
              <div className="w-3.5 h-1.5 bg-emerald-300 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* 2. HEADER: Delivery Location / Table & Action Icons */}
        <header className="relative z-10 px-5 pt-2 pb-3">
          <div className="flex items-center justify-between gap-3">
            {/* Delivery Location / Table Info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Delivery Courier / Cloche Avatar */}
              <div
                onClick={() => setIsRestaurantSwitcherOpen(!isRestaurantSwitcherOpen)}
                className="w-11 h-11 rounded-2xl bg-[#07301B] border border-[#0E542F] p-1.5 flex items-center justify-center shrink-0 cursor-pointer shadow-md hover:border-[#00E564]/50 transition"
              >
                <span className="text-xl">🛵</span>
              </div>

              <div className="min-w-0">
                <div
                  onClick={() => setIsRestaurantSwitcherOpen(!isRestaurantSwitcherOpen)}
                  className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-emerald-300 hover:text-white transition group"
                >
                  <span className="truncate">{tableNumber ? `Dining Table #${tableNumber}` : "Delivery location"}</span>
                  <svg className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-100/70 truncate mt-0.5">
                  <span className="text-rose-400 text-xs">📍</span>
                  <span className="truncate">{restaurant.address || "5Kilo, Addis Ababa"}</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons: Cart Tray & Waiter Bell */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Cart / Tray Icon with Badge */}
              <button
                onClick={() => setIsTrayOpen(true)}
                className="relative w-10 h-10 rounded-2xl bg-[#062E19] border border-[#0E542F] text-white flex items-center justify-center hover:border-[#00E564]/60 transition shadow-sm"
                title="View Tray"
              >
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalTrayCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#00E564] text-black font-black text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalTrayCount}
                  </span>
                )}
              </button>

              {/* Waiter / Notification Bell with Badge */}
              <button
                onClick={handleCallWaiter}
                className={`relative w-10 h-10 rounded-2xl border flex items-center justify-center transition shadow-sm ${
                  isWaiterCalled
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                    : "bg-[#062E19] border-[#0E542F] text-emerald-300 hover:border-[#00E564]/60"
                }`}
                title="Call Waiter"
              >
                <span className="text-base">🔔</span>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#00E564] text-black font-black text-[10px] rounded-full flex items-center justify-center shadow-md">
                  {tableNumber ? tableNumber : "✓"}
                </span>
              </button>
            </div>
          </div>

          {/* Restaurant Switcher Dropdown */}
          {isRestaurantSwitcherOpen && restaurantsList.length > 1 && (
            <div className="mt-3 p-3 bg-[#062E19] border border-[#0E542F] rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 px-1">
                Switch Restaurant Menu
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {restaurantsList.map((r) => (
                  <Link
                    key={r.id}
                    href={`/menu/${r.slug}`}
                    onClick={() => setIsRestaurantSwitcherOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      r.slug === restaurant.slug
                        ? "bg-[#00E564] text-black font-black"
                        : "text-emerald-100/80 hover:bg-[#0A3D22]"
                    }`}
                  >
                    <span className="truncate">{r.name}</span>
                    {r.slug === restaurant.slug && <span>✓</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* 3. SEARCH & FILTER BAR */}
        <div className="relative z-10 px-5 pt-1 pb-4">
          <div className="flex items-center gap-3">
            {/* Search Pill Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400/80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-[#062E19] text-white placeholder-emerald-400/60 text-xs sm:text-sm font-medium rounded-2xl border border-[#0E542F] focus:border-[#00E564] focus:outline-none focus:ring-2 focus:ring-[#00E564]/20 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-emerald-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Slider Button */}
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition shadow-md ${
                filterPopularOnly || filterFavoritesOnly || showFilterModal
                  ? "bg-[#00E564] text-black border-[#00E564]"
                  : "bg-[#062E19] text-emerald-300 border-[#0E542F] hover:border-[#00E564]/50"
              }`}
              title="Filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>

          {/* Quick Filter Pill Chips Modal / Popup */}
          {showFilterModal && (
            <div className="mt-3 p-3 bg-[#062E19] border border-[#0E542F] rounded-2xl shadow-xl flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
              <button
                onClick={() => {
                  setFilterPopularOnly(false);
                  setFilterFavoritesOnly(false);
                  setActiveCategory("all");
                  setShowFilterModal(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  !filterPopularOnly && !filterFavoritesOnly && activeCategory === "all"
                    ? "bg-[#00E564] text-black"
                    : "bg-[#042212] text-emerald-200 border border-[#0E542F]"
                }`}
              >
                All Items ({totalMenuItemsCount})
              </button>

              <button
                onClick={() => {
                  setFilterPopularOnly(!filterPopularOnly);
                  setFilterFavoritesOnly(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  filterPopularOnly
                    ? "bg-[#00E564] text-black"
                    : "bg-[#042212] text-emerald-200 border border-[#0E542F]"
                }`}
              >
                <span>🔥</span> Popular Specials
              </button>

              <button
                onClick={() => {
                  setFilterFavoritesOnly(!filterFavoritesOnly);
                  setFilterPopularOnly(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  filterFavoritesOnly
                    ? "bg-[#00E564] text-black"
                    : "bg-[#042212] text-emerald-200 border border-[#0E542F]"
                }`}
              >
                <span>❤️</span> Favorites ({favorites.length})
              </button>
            </div>
          )}
        </div>

        {/* 4. CURVED ARC CATEGORY CAROUSEL (Signature Visual from Screenshot) */}
        <div className="relative z-10 px-4 pt-1 pb-4">
          {/* Subtle curved arc background */}
          <div className="relative bg-gradient-to-b from-[#052C17] to-[#032011] rounded-3xl p-4 border border-[#0E542F]/80 shadow-xl overflow-hidden">
            {/* Top Indicator Dots (•••) */}
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeCategory === "all" ? "w-4 bg-[#00E564]" : "bg-emerald-600/50"}`}></span>
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${activeCategory !== "all" ? "w-4 bg-[#00E564]" : "bg-emerald-600/50"}`}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600/50"></span>
            </div>

            {/* Horizontal Category Items List */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
              {/* All Items Option */}
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex flex-col items-center shrink-0 transition group cursor-pointer ${
                  activeCategory === "all" ? "scale-105" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl transition shadow-lg relative overflow-hidden ${
                    activeCategory === "all"
                      ? "bg-[#00E564] text-black ring-3 ring-[#00E564]/40"
                      : "bg-[#07381E] border border-[#0E542F] text-white"
                  }`}
                >
                  <span>🍽️</span>
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold tracking-tight text-center ${
                    activeCategory === "all" ? "text-[#00E564] font-black" : "text-emerald-200"
                  }`}
                >
                  All
                </span>
              </button>

              {/* Dynamic Categories */}
              {restaurant.categories.map((cat) => {
                const asset = CATEGORY_ASSETS[cat.name] || {
                  icon: "🍲",
                  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80",
                  short: cat.name.split("/")[0].trim(),
                };
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center shrink-0 transition group cursor-pointer ${
                      isActive ? "scale-105" : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl relative overflow-hidden transition shadow-lg ${
                        isActive
                          ? "ring-3 ring-[#00E564] shadow-[#00E564]/30"
                          : "border border-[#0E542F]/80"
                      }`}
                    >
                      <Image
                        src={asset.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-300"
                        sizes="64px"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <span className="absolute bottom-1 right-1 text-xs drop-shadow-md">{asset.icon}</span>
                    </div>

                    <span
                      className={`mt-1.5 text-[11px] font-bold tracking-tight text-center max-w-[68px] truncate ${
                        isActive ? "text-[#00E564] font-black" : "text-emerald-200"
                      }`}
                    >
                      {asset.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. "OUR ITEMS" SECTION HEADER */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {activeCategory === "all"
                ? "Our Items"
                : restaurant.categories.find((c) => c.id === activeCategory)?.name || "Our Items"}
            </h2>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#07381D] text-[#00E564] border border-[#0E542F]">
              {filteredCategories.reduce((acc, c) => acc + c.menuItems.length, 0)}
            </span>
          </div>

          {filterFavoritesOnly && (
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <span>❤️</span> Favorites
            </span>
          )}
        </div>

        {/* 6. DISH CARDS GRID (Exact 2-Column Template from Screenshot!) */}
        <main className="px-4 py-2 flex-1">
          {filteredCategories.length > 0 ? (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-3">
                  {/* Category Subhead if "All" is active */}
                  {activeCategory === "all" && (
                    <div className="flex items-center justify-between border-b border-[#0E542F]/60 pb-1.5 pt-2">
                      <h3 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>{CATEGORY_ASSETS[category.name]?.icon || "🍽️"}</span>
                        <span>{category.name}</span>
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {category.menuItems.length} items
                      </span>
                    </div>
                  )}

                  {/* 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {category.menuItems.map((item) => {
                      const inTray = tray.find((t) => t.item.id === item.id);
                      const isFav = favorites.includes(item.id);
                      const imageSrc =
                        item.image ||
                        DISH_IMAGE_FALLBACKS[item.name] ||
                        "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item);
                            setItemModalQty(inTray ? inTray.quantity : 1);
                            setItemModalNotes(inTray?.specialInstructions || "");
                          }}
                          className="group bg-[#062E19] rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#0E542F]/70 shadow-xl hover:border-[#00E564]/50 transition duration-300 cursor-pointer flex flex-col justify-between relative hover:shadow-2xl"
                        >
                          {/* Top Food Image Container */}
                          <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-black/40">
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-108 transition duration-500"
                              sizes="(max-width: 640px) 180px, 240px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

                            {/* Top Left Badge: Free Delivery / Popular */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <span className="px-2 py-0.5 rounded-full bg-[#00E564] text-[#022812] font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                                {item.isPopular ? "🔥 Popular" : "Free Delivery"}
                              </span>
                            </div>

                            {/* Top Right Heart Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center text-xs transition hover:scale-110 active:scale-90 shadow-md ${
                                isFav
                                  ? "bg-rose-500 text-white"
                                  : "bg-black/50 text-white/90 hover:text-rose-400"
                              }`}
                            >
                              {isFav ? "❤️" : "🤍"}
                            </button>
                          </div>

                          {/* Signature Vibrant Neon Green Bottom Bar (Exactly like Screenshot) */}
                          <div className="bg-[#00E564] text-black p-3 sm:p-3.5 relative">
                            {/* Curved Cut / Accent Wave Top */}
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-black text-black text-xs sm:text-sm truncate leading-snug">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] text-[#034421] font-bold mt-0.5">
                                  <span>⏱</span>
                                  <span>15-30 min</span>
                                </div>
                              </div>
                            </div>

                            {/* Price & Add to Cart Circle Button */}
                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[#034421] leading-none uppercase">ETB</span>
                                <span className="text-sm sm:text-base font-black text-black leading-tight">
                                  {Math.round(item.price)}
                                </span>
                              </div>

                              {/* Cart Circle Button */}
                              <div onClick={(e) => e.stopPropagation()}>
                                {inTray ? (
                                  <div className="flex items-center bg-[#022812] rounded-full p-0.5 shadow-md">
                                    <button
                                      onClick={() => updateTrayQty(item.id, -1)}
                                      className="w-6 h-6 rounded-full text-[#00E564] hover:bg-black font-black flex items-center justify-center text-xs"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center text-xs font-black text-white">
                                      {inTray.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateTrayQty(item.id, 1)}
                                      className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black flex items-center justify-center text-xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToTray(item, 1)}
                                    className="w-8 h-8 rounded-full bg-[#022812] text-[#00E564] hover:bg-black hover:scale-110 active:scale-95 transition flex items-center justify-center shadow-md cursor-pointer"
                                    title="Add to tray"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#062E19] rounded-3xl p-8 text-center border border-[#0E542F] my-6">
              <span className="text-4xl">🔍</span>
              <h3 className="text-base font-black text-white mt-3">No dishes found</h3>
              <p className="text-xs text-emerald-300/70 mt-1 max-w-xs mx-auto">
                We couldn&apos;t find anything matching your filter. Tap below to reset.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setFilterPopularOnly(false);
                  setFilterFavoritesOnly(false);
                }}
                className="mt-4 px-5 py-2.5 bg-[#00E564] text-black font-black rounded-xl text-xs hover:bg-[#00FF66] transition shadow-md"
              >
                Reset Menu Filters
              </button>
            </div>
          )}

          {/* Footer Powered By Credit */}
          <div className="pt-8 pb-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062E19] border border-[#0E542F] text-emerald-300 text-[11px] font-semibold hover:border-[#00E564] transition"
            >
              <Image src="/logo.png" alt="DigitalMenu" width={18} height={18} className="rounded-xs" />
              <span>Powered by <strong className="text-white">DigitalMenu</strong></span>
            </Link>
          </div>
        </main>

        {/* 7. FLOATING BOTTOM NAVIGATION BAR (Exact 4-Icon Dock from Screenshot) */}
        <nav className="fixed bottom-3 inset-x-3 max-w-md sm:max-w-lg mx-auto z-40 bg-[#042413]/95 backdrop-blur-xl border border-[#0E542F] rounded-[28px] py-2 px-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-around">
          {/* 1. Home Button */}
          <button
            onClick={() => {
              setActiveNavTab("home");
              setActiveCategory("all");
              setFilterFavoritesOnly(false);
              setFilterPopularOnly(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 transition ${
              activeNavTab === "home" && !filterFavoritesOnly ? "text-[#00E564]" : "text-emerald-300/60 hover:text-white"
            }`}
          >
            <div className={`p-1 rounded-xl ${activeNavTab === "home" && !filterFavoritesOnly ? "bg-[#00E564]/10" : ""}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </button>

          {/* 2. My Order / Tray Button */}
          <button
            onClick={() => {
              setActiveNavTab("orders");
              setIsTrayOpen(true);
            }}
            className="flex flex-col items-center gap-1 relative text-emerald-300/60 hover:text-white transition"
          >
            <div className="relative p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {totalTrayCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00E564] text-black font-black text-[9px] rounded-full flex items-center justify-center shadow-md">
                  {totalTrayCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">My Order</span>
          </button>

          {/* 3. Favorites Button */}
          <button
            onClick={() => {
              setActiveNavTab("favorites");
              setFilterFavoritesOnly(true);
              setFilterPopularOnly(false);
              setActiveCategory("all");
            }}
            className={`flex flex-col items-center gap-1 relative transition ${
              filterFavoritesOnly ? "text-[#00E564]" : "text-emerald-300/60 hover:text-white"
            }`}
          >
            <div className={`p-1 rounded-xl relative ${filterFavoritesOnly ? "bg-[#00E564]/10" : ""}`}>
              <svg className="w-5 h-5" fill={filterFavoritesOnly ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Favorites</span>
          </button>

          {/* 4. Call Waiter / Table Info Button */}
          <button
            onClick={handleCallWaiter}
            className={`flex flex-col items-center gap-1 transition ${
              isWaiterCalled ? "text-amber-400 animate-pulse" : "text-emerald-300/60 hover:text-white"
            }`}
          >
            <div className="p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span className="text-[10px] font-bold">Call Waiter</span>
          </button>
        </nav>

        {/* 8. DISH DETAIL BOTTOM SHEET MODAL */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-[#032412] text-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border-t sm:border border-[#0E542F] animate-in slide-in-from-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#062E19] text-emerald-300 hover:text-white hover:bg-[#0A3D22] font-bold flex items-center justify-center text-sm z-10 border border-[#0E542F]"
              >
                ✕
              </button>

              {/* Dish Photo */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 border border-[#0E542F]">
                <Image
                  src={
                    selectedItem.image ||
                    DISH_IMAGE_FALLBACKS[selectedItem.name] ||
                    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
                  }
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#00E564] text-black font-black text-[10px] uppercase tracking-wider">
                    {selectedItem.isPopular ? "🔥 Popular Choice" : "Fresh Daily"}
                  </span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-emerald-300/80">
                    <span>⏱ 15-30 min prep</span>
                    <span>•</span>
                    <span>🔥 Freshly cooked</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-emerald-400 block">Price</span>
                  <span className="text-xl font-black text-[#00E564]">
                    ETB {Number(selectedItem.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-3 leading-relaxed bg-[#062E19]/60 p-3 rounded-2xl border border-[#0E542F]/50">
                  {selectedItem.description}
                </p>
              )}

              {/* Special Instructions Note */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-emerald-300 mb-1.5">
                  Special Kitchen Instructions (optional)
                </label>
                <textarea
                  value={itemModalNotes}
                  onChange={(e) => setItemModalNotes(e.target.value)}
                  placeholder="E.g., Extra hot sauce, no mayonnaise, well-done fries..."
                  rows={2}
                  className="w-full text-xs p-3 bg-[#062E19] border border-[#0E542F] text-white rounded-xl focus:border-[#00E564] outline-none placeholder-emerald-400/50"
                />
              </div>

              {/* Quantity Counter & Add Button */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center bg-[#062E19] rounded-2xl p-1 border border-[#0E542F]">
                  <button
                    onClick={() => setItemModalQty(Math.max(1, itemModalQty - 1))}
                    className="w-10 h-10 rounded-xl bg-[#042413] text-[#00E564] hover:bg-black font-black flex items-center justify-center text-base"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm text-white">
                    {itemModalQty}
                  </span>
                  <button
                    onClick={() => setItemModalQty(itemModalQty + 1)}
                    className="w-10 h-10 rounded-xl bg-[#00E564] text-black font-black flex items-center justify-center text-base"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToTray(selectedItem, itemModalQty, itemModalNotes);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-3.5 px-5 bg-[#00E564] hover:bg-[#00FF66] text-black font-black rounded-2xl text-sm transition flex items-center justify-between shadow-lg shadow-[#00E564]/20 cursor-pointer"
                >
                  <span>Add to Order</span>
                  <span>ETB {(selectedItem.price * itemModalQty).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. SLIDE-OVER TRAY / CART DRAWER */}
        {isTrayOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in"
            onClick={() => setIsTrayOpen(false)}
          >
            <div
              className="w-full max-w-md bg-[#021C0E] border-l border-[#0E542F] h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#0E542F] pb-4">
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <span>🛒</span>
                    <span>Your Table Order</span>
                  </h3>
                  <p className="text-xs text-emerald-300/70">
                    {tableNumber ? `Table #${tableNumber} • Contactless Dining` : "Dine-in & Takeaway Order"}
                  </p>
                </div>
                <button
                  onClick={() => setIsTrayOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#062E19] text-emerald-300 hover:text-white font-bold flex items-center justify-center text-sm border border-[#0E542F]"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {tray.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-emerald-300/50">
                    <span className="text-5xl mb-3">🍗</span>
                    <p className="font-bold text-white text-sm">Your order tray is empty</p>
                    <p className="text-xs text-emerald-300/60 mt-1 max-w-xs">
                      Tap the cart button on any delicious shawarma, chicken, or drink to begin.
                    </p>
                  </div>
                ) : (
                  tray.map((entry) => (
                    <div
                      key={entry.item.id}
                      className="p-3.5 rounded-2xl bg-[#062E19] border border-[#0E542F] flex items-start justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-white text-sm truncate">{entry.item.name}</h4>
                        <p className="text-xs text-[#00E564] font-bold mt-0.5">
                          ETB {entry.item.price.toFixed(2)} each
                        </p>
                        {entry.specialInstructions && (
                          <p className="text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md mt-1 border border-amber-500/20">
                            Note: {entry.specialInstructions}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-black text-white">
                          ETB {(entry.item.price * entry.quantity).toFixed(2)}
                        </span>

                        <div className="flex items-center bg-[#02180B] rounded-xl border border-[#0E542F] p-0.5">
                          <button
                            onClick={() => updateTrayQty(entry.item.id, -1)}
                            className="w-6 h-6 rounded-lg text-[#00E564] hover:bg-[#062E19] text-xs font-black flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-black text-white">
                            {entry.quantity}
                          </span>
                          <button
                            onClick={() => updateTrayQty(entry.item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-[#00E564] text-black text-xs font-black flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {tray.length > 0 && (
                <div className="border-t border-[#0E542F] pt-4 space-y-3">
                  <div className="space-y-1.5 text-xs text-emerald-200/80">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalTrayCount} items)</span>
                      <span className="font-bold text-white">ETB {totalTrayPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Service & VAT</span>
                      <span className="font-semibold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#0E542F]">
                      <span>Total Amount</span>
                      <span className="text-[#00E564] text-base">ETB {totalTrayPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Table Number Confirmation */}
                  <div className="bg-[#062E19] p-3 rounded-2xl border border-[#0E542F] flex items-center justify-between text-xs">
                    <span className="text-emerald-200 font-semibold">Table Number:</span>
                    <input
                      type="number"
                      value={tableNumber || ""}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-20 px-2 py-1 text-center font-black bg-[#02180B] border border-[#0E542F] rounded-lg text-white text-xs focus:border-[#00E564] outline-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={clearTray}
                      className="px-4 py-3 bg-[#062E19] hover:bg-[#0A3D22] text-rose-400 text-xs font-bold rounded-2xl transition border border-[#0E542F]"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        toast.success(
                          tableNumber
                            ? `Order confirmed for Table #${tableNumber}! Staff notified.`
                            : "Order ready! Please show this order screen to your server.",
                          {
                            duration: 5000,
                            icon: "🛎️",
                            style: { background: "#062E19", color: "#00E564", border: "1px solid #00E564" },
                          }
                        );
                        setIsTrayOpen(false);
                      }}
                      className="flex-1 py-3 px-4 bg-[#00E564] hover:bg-[#00FF66] text-black text-xs font-black rounded-2xl transition shadow-lg shadow-[#00E564]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>🛎️ Confirm Order • ETB {totalTrayPrice.toFixed(0)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
