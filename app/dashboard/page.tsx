"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  isActive: boolean;
  isQrPaid: boolean;
  createdAt: string;
  _count?: {
    categories: number;
    qrCodes: number;
  };
  owner?: {
    name: string | null;
    email: string | null;
  };
}

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeNavTab, setActiveNavTab] = useState<"overview" | "restaurants" | "qrcodes" | "billing">("overview");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"ADMIN" | "OWNER">("OWNER");

  useEffect(() => {
    // 1. Session check
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          const role = (session.user.role as "ADMIN" | "OWNER") || "OWNER";
          setUserRole(role);
          try {
            localStorage.setItem(
              "digitalmenu_user",
              JSON.stringify({ ...session.user, isLoggedIn: true })
            );
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("digitalmenu_user");
          if (stored) {
            const parsed = JSON.parse(stored);
            setCurrentUser(parsed);
            if (parsed.role) setUserRole(parsed.role);
          }
        } catch (e) {}
      });

    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/restaurants");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      } else {
        toast.error("Failed to load restaurants");
      }
    } catch (error) {
      toast.error("Network error while loading restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestaurant.name.trim()) {
      toast.error("Restaurant name is required");
      return;
    }

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      });

      if (res.ok) {
        const created = await res.json();
        toast.success(`${created.name} created successfully!`);
        setShowCreateModal(false);
        setNewRestaurant({ name: "", address: "", phone: "", description: "" });
        fetchRestaurants();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create restaurant");
      }
    } catch (error) {
      toast.error("Error creating restaurant");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("digitalmenu_user");
      localStorage.clear();
    } catch (e) {}
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/" });
  };

  // Filtered restaurants for search
  const filteredRestaurants = useMemo(() => {
    if (!searchFilter.trim()) return restaurants;
    const q = searchFilter.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.address && r.address.toLowerCase().includes(q))
    );
  }, [restaurants, searchFilter]);

  // Aggregate Stats
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.isActive).length;
  const totalCategories = restaurants.reduce(
    (acc, r) => acc + (r._count?.categories || 0),
    0
  );
  const totalQRCodes = restaurants.reduce(
    (acc, r) => acc + (r._count?.qrCodes || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex text-slate-800 font-sans selection:bg-primary-500 selection:text-white">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 1. LEFT SIDEBAR (TailwindAdmin Style) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 ease-in-out shadow-xs ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 group overflow-hidden">
            <Image
              src="/logo.png"
              alt="DigitalMenu"
              width={36}
              height={36}
              className="w-9 h-9 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform"
              priority
            />
            {!sidebarCollapsed && (
              <span className="text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                Digital<span className="text-primary-600">Menu</span>
              </span>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Group 1: HOME */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Home
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveNavTab("overview");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeNavTab === "overview"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span className="text-lg shrink-0">📊</span>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <Link
                href="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                <span className="text-lg shrink-0">🌐</span>
                {!sidebarCollapsed && <span>Landing Page</span>}
              </Link>
            </div>
          </div>

          {/* Group 2: RESTAURANTS & MENUS */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Management
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveNavTab("restaurants");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeNavTab === "restaurants"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span className="text-lg shrink-0">🏬</span>
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>My Restaurants</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                      {totalRestaurants}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveNavTab("qrcodes");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeNavTab === "qrcodes"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span className="text-lg shrink-0">📱</span>
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Table QR Posters</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                      {totalQRCodes}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Group 3: SERVICES */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Services
              </p>
            )}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveNavTab("billing");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeNavTab === "billing"
                    ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <span className="text-lg shrink-0">💳</span>
                {!sidebarCollapsed && <span>Telebirr Billing</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || currentUser?.email || "Restaurant Owner"}
                </p>
                <span className="inline-block text-[10px] font-bold text-primary-700 bg-primary-100 px-1.5 py-0.2 rounded uppercase tracking-wider">
                  {userRole}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Navbar Header */}
        <header className="h-18 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          {/* Left: Sidebar Toggle + Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarCollapsed(!sidebarCollapsed);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Quick Search */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs w-64 md:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search restaurants, slugs, locations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions + Profile */}
          <div className="flex items-center gap-3">
            {/* Return to Home Link */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
            >
              <span>← Home</span>
            </Link>

            {/* Add Restaurant CTA */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden xs:inline sm:inline">Add Restaurant</span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline text-xs font-bold text-slate-700 max-w-[120px] truncate">
                  {currentUser?.name || "My Account"}
                </span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser?.name || "Restaurant Manager"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser?.email || ""}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {userRole} Account
                    </span>
                  </div>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Landing Page
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition border-t border-slate-100 mt-1"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* 3. HERO WELCOME BANNER (TailwindAdmin Style) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/70 border border-blue-100/90 p-6 sm:p-8 shadow-xs">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-blue-200/60 text-primary-700 text-xs font-bold mb-3 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  DevVoltz Cloud Active • Hostinger MySQL
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome back, {currentUser?.name || "Partner"}! 👋
                </h1>
                <p className="mt-1 text-sm text-slate-600 max-w-xl leading-relaxed">
                  Manage your contactless digital menus, customize A4 table QR codes, and deliver instant touchless ordering across all your branches.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-primary-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  + New Restaurant
                </button>
              </div>
            </div>
          </div>

          {/* 4. PASTEL STAT METRIC CARDS (TailwindAdmin Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Metric 1 */}
            <div className="bg-[#E6FFFA] rounded-2xl p-5 border border-[#B2F5EA] flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-[#234E52] uppercase tracking-wider">
                  Active Restaurants
                </p>
                <h3 className="text-2xl font-black text-[#1D4044] mt-1">
                  {activeRestaurants} <span className="text-sm font-normal text-slate-500">/ {totalRestaurants}</span>
                </h3>
                <p className="text-[11px] text-[#2C7A7B] font-semibold mt-1">
                  Ready for scanning
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 text-emerald-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                🏬
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#FFF5F5] rounded-2xl p-5 border border-[#FED7D7] flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-[#742A2A] uppercase tracking-wider">
                  Menu Categories
                </p>
                <h3 className="text-2xl font-black text-[#63171B] mt-1">
                  {totalCategories}
                </h3>
                <p className="text-[11px] text-[#9B2C2C] font-semibold mt-1">
                  Live categorized dishes
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 text-rose-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                📋
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#EBF8FF] rounded-2xl p-5 border border-[#BEE3F8] flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-[#2A4365] uppercase tracking-wider">
                  Table QR Codes
                </p>
                <h3 className="text-2xl font-black text-[#2C5282] mt-1">
                  {totalQRCodes}
                </h3>
                <p className="text-[11px] text-[#3182CE] font-semibold mt-1">
                  A4 Posters Generated
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 text-sky-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                📱
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#FAF5FF] rounded-2xl p-5 border border-[#E9D8FD] flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-[#44337A] uppercase tracking-wider">
                  Currency & Billing
                </p>
                <h3 className="text-2xl font-black text-[#553C9A] mt-1">
                  ETB
                </h3>
                <p className="text-[11px] text-[#6B46C1] font-semibold mt-1">
                  {userRole === "ADMIN" ? "Admin Mode (Unlimited)" : "1,300 ETB / Restaurant"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 text-purple-600 flex items-center justify-center text-2xl font-bold shadow-xs">
                💳
              </div>
            </div>
          </div>

          {/* 5. RESTAURANT PERFORMANCE & MANAGEMENT (TailwindAdmin Product Performance Table) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Restaurant Catalog & Operations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overview of all registered dining locations, categories, and QR deployment status.
                </p>
              </div>

              {/* Mobile Search Input */}
              <div className="sm:hidden flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Filter by name or slug..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent border-none outline-none w-full"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-semibold">Loading your restaurants...</p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4">
                  🏬
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {searchFilter ? "No matching restaurants found" : "No restaurants registered yet"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchFilter
                    ? "Try adjusting your search keywords."
                    : "Create your first restaurant profile to generate table QR posters and upload your menu."}
                </p>
                {!searchFilter && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary-600/20"
                  >
                    + Create First Restaurant
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                      <th className="py-4 px-6">Restaurant</th>
                      <th className="py-4 px-6">Address & Contact</th>
                      <th className="py-4 px-6">Catalog Breakdown</th>
                      <th className="py-4 px-6">QR Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRestaurants.map((restaurant) => (
                      <tr
                        key={restaurant.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Restaurant Name & Avatar */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {restaurant.logo ? (
                              <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-amber-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                                {restaurant.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                  {restaurant.name}
                                </span>
                                {restaurant.isActive && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 font-mono">
                                /{restaurant.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Address & Phone */}
                        <td className="py-4 px-6 text-slate-600">
                          <p className="truncate max-w-[200px]">
                            {restaurant.address || "No address specified"}
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {restaurant.phone || "No phone"}
                          </p>
                        </td>

                        {/* Catalog Stats */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                              {restaurant._count?.categories || 0} Categories
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                              {restaurant._count?.qrCodes || 0} QRs
                            </span>
                          </div>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-6">
                          {userRole === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                              ★ Admin Mode
                            </span>
                          ) : restaurant.isQrPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              ✓ QR Paid (1,300 ETB)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                              Pending Telebirr
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/restaurants/${restaurant.id}`}
                              className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xs transition"
                            >
                              Manage Menu →
                            </Link>
                            <Link
                              href={`/menu/${restaurant.slug}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                            >
                              Preview ↗
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. RECENT ACTIVITY TIMELINE (TailwindAdmin Style) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <span>⏱️</span>
              <span>Recent Activity & System Logs</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">
                    Hostinger MySQL Database Connection Established
                  </p>
                  <p className="text-[11px] text-slate-400">
                    srv651.hstgr.io:3306 • Synchronized schema across production
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Live</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary-500 ring-4 ring-primary-100 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">
                    Official Brand Identity Active
                  </p>
                  <p className="text-[11px] text-slate-400">
                    D-monogram smartphone logo with camera & notch rendered across all surfaces
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Branded</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">
                    Telebirr Contactless A4 Poster Generator Ready
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Table-specific QR print posters with custom color palette in ETB
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ready</span>
              </div>
            </div>
          </div>
        </main>

        {/* Dashboard Footer */}
        <footer className="p-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
          DigitalMenu by DevVoltz • TailwindAdmin Modern Architecture • All Rights Reserved © {new Date().getFullYear()}
        </footer>
      </div>

      {/* CREATE RESTAURANT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Add New Restaurant
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Create your restaurant catalog to begin designing table QR posters and adding delicious menu items.
            </p>

            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Addis Gourmet Burger"
                  value={newRestaurant.name}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bole Road, Addis Ababa"
                  value={newRestaurant.address}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0911234567"
                  value={newRestaurant.phone}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Cuisine
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Traditional & Western fusion cuisine"
                  value={newRestaurant.description}
                  onChange={(e) =>
                    setNewRestaurant({ ...newRestaurant, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-primary-600/20 transition"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
