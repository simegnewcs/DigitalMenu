"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

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
  const [searchFilter, setSearchFilter] = useState("");
  const [activeNavTab, setActiveNavTab] = useState<"overview" | "restaurants" | "qrcodes" | "billing">("overview");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<"ADMIN" | "OWNER">("OWNER");

  useEffect(() => {
    // Session check
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showCreateModal) {
        setShowCreateModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCreateModal]);

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
      toast.error("Menu name is required");
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
        toast.success(`Menu "${created.name}" created successfully!`);
        setShowCreateModal(false);
        setNewRestaurant({ name: "", address: "", phone: "", description: "" });
        fetchRestaurants();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create menu");
      }
    } catch (error) {
      toast.error("Error creating menu");
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

  const confirmDeleteRestaurant = (restaurant: Restaurant) => {
    setDeleteModal({
      isOpen: true,
      id: restaurant.id,
      name: restaurant.name,
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/restaurants/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Restaurant "${deleteModal.name}" deleted successfully`);
        setDeleteModal({ isOpen: false, id: "", name: "" });
        fetchRestaurants();
      } else {
        toast.error("Failed to delete restaurant");
      }
    } catch (e) {
      toast.error("An error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 font-serif text-slate-700 antialiased selection:bg-sky-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* 1. NOTUS REACT SIDEBAR */}
      <nav
        className={`md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-50 py-4 px-6 transition-transform duration-300 ${
          sidebarOpen ? "fixed top-0 bottom-0 left-0 w-64 translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between w-full border-b border-slate-100 md:border-b-0 pb-3 md:pb-0">
            <Link
              href="/"
              className="md:block text-left text-slate-700 inline-block whitespace-nowrap text-base uppercase font-bold tracking-wider hover:text-sky-600 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="DigitalMenu"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>Digital Menu</span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-lg font-bold"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Sidebar Nav Links */}
          <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded w-full">
            {/* Heading 1: ADMIN LAYOUT PAGES */}
            <h6 className="md:min-w-full text-slate-400 text-xs uppercase font-bold block pt-4 pb-2 no-underline tracking-wider">
              Admin Layout Pages
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
              <li className="items-center">
                <button
                  onClick={() => {
                    setActiveNavTab("overview");
                    setSidebarOpen(false);
                  }}
                  className={`text-xs uppercase py-3 font-bold flex items-center gap-3 w-full transition-colors ${
                    activeNavTab === "overview"
                      ? "text-sky-600 hover:text-sky-700"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                >
                  <span className="text-base text-sky-500">📊</span>
                  <span>Dashboard</span>
                </button>
              </li>

              <li className="items-center">
                <button
                  onClick={() => {
                    setActiveNavTab("restaurants");
                    setSidebarOpen(false);
                  }}
                  className={`text-xs uppercase py-3 font-bold flex items-center justify-between w-full transition-colors ${
                    activeNavTab === "restaurants"
                      ? "text-sky-600 hover:text-sky-700"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base text-red-500">🏬</span>
                    <span>My Restaurants</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                    {totalRestaurants}
                  </span>
                </button>
              </li>

              <li className="items-center">
                <button
                  onClick={() => {
                    setActiveNavTab("qrcodes");
                    setSidebarOpen(false);
                  }}
                  className={`text-xs uppercase py-3 font-bold flex items-center justify-between w-full transition-colors ${
                    activeNavTab === "qrcodes"
                      ? "text-sky-600 hover:text-sky-700"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base text-pink-500">📱</span>
                    <span>Table QR Posters</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                    {totalQRCodes}
                  </span>
                </button>
              </li>

              <li className="items-center">
                <button
                  onClick={() => {
                    setActiveNavTab("billing");
                    setSidebarOpen(false);
                  }}
                  className={`text-xs uppercase py-3 font-bold flex items-center justify-between w-full transition-colors ${
                    activeNavTab === "billing"
                      ? "text-sky-600 hover:text-sky-700"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base text-emerald-500">💳</span>
                    <span>Telebirr Billing</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                    ETB
                  </span>
                </button>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full border-slate-200" />

            {/* Heading 2: ACTIONS & PAGES */}
            <h6 className="md:min-w-full text-slate-400 text-xs uppercase font-bold block pt-1 pb-2 no-underline tracking-wider">
              Quick Actions
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
              <li>
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase py-2.5 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2 my-2"
                >
                  <span>+</span>
                  <span>Add New Menu</span>
                </button>
              </li>

              <li className="items-center">
                <Link
                  href="/"
                  className="text-slate-700 hover:text-slate-500 text-xs uppercase py-3 font-bold flex items-center gap-3 block transition-colors"
                >
                  <span className="text-base text-slate-400">🌐</span>
                  <span>Landing Page</span>
                </Link>
              </li>

              <li className="items-center">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 text-xs uppercase py-3 font-bold flex items-center gap-3 w-full text-left transition-colors"
                >
                  <span className="text-base">🚪</span>
                  <span>Log Out</span>
                </button>
              </li>
            </ul>

            {/* User Profile Card at bottom of sidebar */}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow shrink-0">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {currentUser?.name || "Restaurant Manager"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. NOTUS MAIN CONTENT AREA */}
      <div className="relative md:ml-64 bg-slate-100 min-h-screen flex flex-col justify-between max-w-full overflow-x-hidden">
        {/* NOTUS TOP BLUE HEADER REGION */}
        <div className="relative bg-sky-600 pb-32 pt-12 md:pt-16">
          {/* Top Navbar */}
          <nav className="absolute top-0 left-0 w-full z-10 bg-transparent flex items-center justify-between p-4 px-4 md:px-10">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-white text-xl p-2 rounded-lg bg-sky-700 hover:bg-sky-800 transition"
                aria-label="Open sidebar"
              >
                ☰
              </button>

              <span className="text-white text-sm uppercase font-bold tracking-wider hidden md:inline-block">
                Dashboard
              </span>
            </div>

            {/* Right: Search, Action Button & User Dropdown */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Quick Search Input */}
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Search menus..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="border-0 px-3 py-2 pl-8 placeholder-slate-400 text-slate-700 relative bg-white rounded-lg text-xs shadow outline-none focus:outline-none focus:ring-2 focus:ring-sky-300 w-36 sm:w-56 md:w-64 transition-all"
                />
              </div>

              {/* Add New Menu CTA Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white hover:bg-slate-50 text-sky-600 font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs uppercase shadow hover:shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <span className="text-sm font-bold leading-none">+</span>
                <span className="hidden sm:inline">Add New Menu</span>
                <span className="sm:hidden">Menu</span>
              </button>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white/60 text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-105 transition-transform"
                >
                  {currentUser?.name?.charAt(0).toUpperCase() || "A"}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser?.name || "Admin Partner"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.email || ""}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {userRole} Mode
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
          </nav>

          {/* NOTUS 4 FLOATING STATS CARDS */}
          <div className="px-4 md:px-10 mx-auto w-full mt-10 md:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Card 1: TRAFFIC / ACTIVE RESTAURANTS (Red Icon Badge) */}
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex-auto">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 className="text-slate-400 uppercase font-bold text-xs tracking-wider">
                        Active Restaurants
                      </h5>
                      <span className="font-bold text-xl text-slate-700 mt-1 block">
                        {activeRestaurants}{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          / {totalRestaurants}
                        </span>
                      </span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-md rounded-full bg-red-500 text-xl font-bold">
                        🏬
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">↑ 100%</span>
                    <span>Ready for QR scanning</span>
                  </p>
                </div>
              </div>

              {/* Card 2: NEW USERS / MENU CATEGORIES (Orange Icon Badge) */}
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex-auto">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 className="text-slate-400 uppercase font-bold text-xs tracking-wider">
                        Menu Categories
                      </h5>
                      <span className="font-bold text-xl text-slate-700 mt-1 block">
                        {totalCategories}
                      </span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-md rounded-full bg-orange-500 text-xl font-bold">
                        📋
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">↑ Active</span>
                    <span>Live categorized dishes</span>
                  </p>
                </div>
              </div>

              {/* Card 3: SALES / TABLE QR POSTERS (Pink Icon Badge) */}
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex-auto">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 className="text-slate-400 uppercase font-bold text-xs tracking-wider">
                        Table QR Codes
                      </h5>
                      <span className="font-bold text-xl text-slate-700 mt-1 block">
                        {totalQRCodes}
                      </span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-md rounded-full bg-pink-500 text-xl font-bold">
                        📱
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">↑ Ready</span>
                    <span>Printable A4 QR Posters</span>
                  </p>
                </div>
              </div>

              {/* Card 4: PERFORMANCE / BILLING (Light Blue Icon Badge) */}
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-xl shadow-lg p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex-auto">
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 className="text-slate-400 uppercase font-bold text-xs tracking-wider">
                        Currency & Billing
                      </h5>
                      <span className="font-bold text-xl text-slate-700 mt-1 block">
                        ETB
                      </span>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                      <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-md rounded-full bg-sky-500 text-xl font-bold">
                        💳
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 truncate">
                    <span className="text-sky-600 font-bold">●</span>
                    <span className="truncate">
                      {userRole === "ADMIN" ? "Unlimited Admin Mode" : "1,300 ETB / Restaurant"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NOTUS MAIN BODY OVERLAPPING CONTAINER */}
        <div className="px-4 md:px-10 mx-auto w-full -mt-24 flex-1">
          {/* ROW 1: THE TWO NOTUS REACT CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* 1. DARK OVERVIEW CHART (Notus 'Sales Value' Line Chart) */}
            <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-xl bg-slate-800 text-white xl:col-span-2 overflow-hidden">
              <div className="rounded-t mb-0 px-5 py-4 bg-transparent border-b border-slate-700/60">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-slate-400 mb-1 text-xs font-semibold tracking-wider">
                      Overview
                    </h6>
                    <h2 className="text-white text-xl font-bold">
                      Menu Views & Customer Scans
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                      <span className="text-slate-300">2026 Scans</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
                      <span className="text-slate-300">2025 Base</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive SVG Line Graph */}
              <div className="p-5 flex-auto">
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Dotted horizontal grid lines */}
                    {[30, 70, 110, 150, 190].map((y, idx) => (
                      <line
                        key={idx}
                        x1="30"
                        y1={y}
                        x2="590"
                        y2={y}
                        stroke="#475569"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Area fill for 2026 */}
                    <path
                      d="M 40 190 Q 120 70 200 100 T 360 160 T 520 80 L 580 90 L 580 190 L 40 190 Z"
                      fill="url(#blueGradient)"
                    />

                    {/* 2026 Line (Indigo) */}
                    <path
                      d="M 40 190 Q 120 70 200 100 T 360 160 T 520 80 L 580 90"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3.5"
                    />

                    {/* 2025 Line (White) */}
                    <path
                      d="M 40 210 Q 140 150 220 60 T 360 130 T 520 120 L 580 50"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />

                    {/* Glowing Data Points */}
                    <circle cx="200" cy="100" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="360" cy="160" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="580" cy="90" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />

                    <circle cx="220" cy="60" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="360" cy="130" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="580" cy="50" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
                  </svg>
                </div>

                {/* Month Axis Labels */}
                <div className="flex justify-between px-3 text-[11px] text-slate-400 uppercase font-semibold mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* 2. LIGHT PERFORMANCE CHART (Notus 'Total Orders' Bar Chart) */}
            <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-xl bg-white col-span-1 overflow-hidden">
              <div className="rounded-t mb-0 px-5 py-4 bg-transparent border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-slate-400 mb-1 text-xs font-semibold tracking-wider">
                      Performance
                    </h6>
                    <h2 className="text-slate-700 text-xl font-bold">
                      QR Table Scans
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
                      <span className="text-slate-500 font-bold">2026</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-900 inline-block"></span>
                      <span className="text-slate-500 font-bold">2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart Graphics */}
              <div className="p-5 flex-auto">
                <div className="relative h-64 w-full flex items-end justify-between px-4 pb-2 border-b border-dashed border-slate-200">
                  {/* Month 1 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "45%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "35%" }}></div>
                  </div>
                  {/* Month 2 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "78%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "65%" }}></div>
                  </div>
                  {/* Month 3 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "55%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "85%" }}></div>
                  </div>
                  {/* Month 4 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "38%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "72%" }}></div>
                  </div>
                  {/* Month 5 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "95%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "20%" }}></div>
                  </div>
                  {/* Month 6 */}
                  <div className="flex items-end gap-1.5 h-full">
                    <div className="w-3 bg-pink-500 rounded-t" style={{ height: "60%" }}></div>
                    <div className="w-3 bg-indigo-900 rounded-t" style={{ height: "82%" }}></div>
                  </div>
                </div>

                <div className="flex justify-between px-2 text-[11px] text-slate-400 uppercase font-semibold mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: THE TWO NOTUS REACT TABLES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* TABLE 1: RESTAURANT CATALOG & OPERATIONS (Notus 'Page Visits' Style) */}
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-xl xl:col-span-2 overflow-hidden">
              {/* Notus Table Header */}
              <div className="rounded-t mb-0 px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h6 className="uppercase text-slate-400 text-xs font-semibold tracking-wider">
                    Catalog Breakdown
                  </h6>
                  <h3 className="font-bold text-base text-slate-700">
                    Restaurant Menus & QR Deployment
                  </h3>
                </div>
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-500 active:bg-indigo-600 hover:bg-indigo-600 text-white font-bold uppercase text-xs px-3.5 py-1.5 rounded-lg shadow hover:shadow-md outline-none focus:outline-none transition-all"
                  >
                    + Add New Menu
                  </button>
                </div>
              </div>

              {/* Mobile Table Scroll Hint */}
              <div className="sm:hidden px-5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span>👉</span>
                  <span>Swipe table horizontally to view actions</span>
                </span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                  Scrollable
                </span>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-semibold">Loading your menus...</p>
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4">
                    🏬
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    {searchFilter ? "No matching restaurants found" : "No menus registered yet"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchFilter
                      ? "Try adjusting your search keywords."
                      : "Create your first digital menu to start generating table QR posters and categories."}
                  </p>
                  {!searchFilter && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-5 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs uppercase font-bold shadow hover:shadow-md transition"
                    >
                      + Add New Menu
                    </button>
                  )}
                </div>
              ) : (
                <div className="block w-full overflow-x-auto overscroll-x-contain">
                  <table className="items-center w-full min-w-[700px] bg-transparent border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Restaurant & Menu
                        </th>
                        <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Location / Contact
                        </th>
                        <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Catalog Breakdown
                        </th>
                        <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          QR Status
                        </th>
                        <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Name & Avatar */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            <div className="flex items-center gap-3">
                              {restaurant.logo ? (
                                <img
                                  src={restaurant.logo}
                                  alt={restaurant.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                                  {restaurant.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">
                                  {restaurant.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  /{restaurant.slug}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Address & Phone */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <p className="truncate max-w-[180px] font-semibold text-slate-700">
                              {restaurant.address || "No address provided"}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {restaurant.phone || "No phone"}
                            </p>
                          </td>

                          {/* Catalog Badges */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-bold text-xs border border-sky-100">
                                {restaurant._count?.categories || 0} Categories
                              </span>
                              <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                                {restaurant._count?.qrCodes || 0} QRs
                              </span>
                            </div>
                          </td>

                          {/* QR Status */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
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

                          {/* Action Links */}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/dashboard/restaurants/${restaurant.id}`}
                                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase shadow-xs transition"
                              >
                                Manage Menu →
                              </Link>
                              <Link
                                href={`/menu/${restaurant.slug}`}
                                target="_blank"
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                              >
                                Preview ↗
                              </Link>
                              <button
                                onClick={() => confirmDeleteRestaurant(restaurant)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold text-xs transition flex items-center gap-1 shadow-xs"
                                title={`Delete ${restaurant.name}`}
                              >
                                <span>🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TABLE 2: CATEGORY TRAFFIC & COMPLETION (Notus 'Social Traffic' Style) */}
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-xl col-span-1 overflow-hidden">
              <div className="rounded-t mb-0 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h6 className="uppercase text-slate-400 text-xs font-semibold tracking-wider">
                    Menu Distribution
                  </h6>
                  <h3 className="font-bold text-base text-slate-700">
                    Category Engagement
                  </h3>
                </div>
                <button
                  onClick={() => setActiveNavTab("restaurants")}
                  className="bg-indigo-500 active:bg-indigo-600 hover:bg-indigo-600 text-white font-bold uppercase text-xs px-3 py-1 rounded-lg shadow outline-none"
                >
                  See all
                </button>
              </div>

              <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse text-xs">
                  <thead className="thead-light">
                    <tr>
                      <th className="px-5 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Category
                      </th>
                      <th className="px-5 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Items
                      </th>
                      <th className="px-5 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <th className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-slate-800">
                        Main Courses
                      </th>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-slate-600">
                        1,480
                      </td>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-bold text-slate-700">60%</span>
                          <div className="relative w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-slate-800">
                        Appetizers & Starters
                      </th>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-slate-600">
                        5,480
                      </td>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-bold text-slate-700">70%</span>
                          <div className="relative w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-slate-800">
                        Beverages & Juices
                      </th>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-slate-600">
                        4,807
                      </td>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-bold text-slate-700">80%</span>
                          <div className="relative w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-slate-800">
                        Desserts & Sweets
                      </th>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-slate-600">
                        3,678
                      </td>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-bold text-slate-700">75%</span>
                          <div className="relative w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-sky-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-slate-800">
                        Traditional Combos
                      </th>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-slate-600">
                        2,645
                      </td>
                      <td className="border-t-0 px-5 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-bold text-slate-700">30%</span>
                          <div className="relative w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ROW 3: SYSTEM INFRASTRUCTURE / RECENT LOGS (ADMIN ONLY) */}
          {userRole === "ADMIN" && (
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-xl p-5 mb-8">
              <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>⏱️</span>
                <span>Hostinger MySQL & DigitalMenu Cloud Engine</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse"></span>
                  <div>
                    <p className="font-bold text-slate-800">Hostinger MySQL Synced</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">srv651.hstgr.io:3306 live cluster</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-1 shrink-0"></span>
                  <div>
                    <p className="font-bold text-slate-800">Contactless QR Poster Generator</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">High-res vector print ready in ETB</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                  <div>
                    <p className="font-bold text-slate-800">Notus React Architecture</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Tailwind responsive dashboard theme</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTUS FOOTER */}
          <footer className="block py-4 border-t border-slate-200">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4">
                  <div className="text-xs text-slate-500 font-semibold py-1 text-center md:text-left">
                    Copyright © {new Date().getFullYear()} Digital Menu by DevVoltz | Distributed on Notus Theme
                  </div>
                </div>
                <div className="w-full md:w-8/12 px-4">
                  <ul className="flex flex-wrap list-none md:justify-end justify-center text-xs">
                    <li>
                      <Link href="/" className="text-slate-600 hover:text-slate-800 font-semibold block py-1 px-3">
                        Landing Page
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-slate-600 hover:text-slate-800 font-semibold block py-1 px-3"
                      >
                        Add New Menu
                      </button>
                    </li>
                    <li>
                      <a
                        href="https://preview.themewagon.com/Notus-React/#/admin/dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 hover:text-slate-800 font-semibold block py-1 px-3"
                      >
                        Notus Theme
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* CREATE MENU MODAL (PHONE-RESPONSIVE NOTUS STYLED) */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-menu-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-slate-100 flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-base shrink-0 font-bold border border-sky-100">
                  📋
                </div>
                <div className="min-w-0">
                  <h3
                    id="create-menu-modal-title"
                    className="text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate uppercase"
                  >
                    Add New Menu
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    Set up your dining catalog & table QR code
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 flex items-center justify-center text-sm font-bold transition shrink-0 ml-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateRestaurant} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 overscroll-contain">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Menu / Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Addis Gourmet Burger Menu"
                    value={newRestaurant.name}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Physical Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bole Road, Addis Ababa"
                    value={newRestaurant.address}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, address: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="e.g. 0911234567"
                    value={newRestaurant.phone}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Description / Cuisine <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Traditional & Western fusion cuisine"
                    value={newRestaurant.description}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons (Sticky at bottom of modal) */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 sm:bg-white flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white sm:bg-slate-100 hover:bg-slate-200 active:scale-[0.98] border border-slate-200 sm:border-transparent text-slate-700 py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase shadow-md shadow-sky-600/20 transition"
                >
                  Add New Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMIZED STYLED DELETE CONFIRMATION POPUP */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Entire Restaurant Menu?"
        itemName={deleteModal.name}
        message={`Are you sure you want to delete "${deleteModal.name}"? All associated categories, menu items, and QR codes will be permanently erased. This action cannot be undone.`}
        confirmText="Yes, Delete Restaurant"
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteModal((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      />
    </div>
  );
}
