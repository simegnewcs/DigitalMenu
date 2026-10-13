"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    // 1. Check localStorage first
    try {
      const stored = localStorage.getItem("digitalmenu_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isLoggedIn || parsed?.email) {
          setCurrentUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {}

    // 2. Validate with active NextAuth session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          setIsLoggedIn(true);
          try {
            localStorage.setItem(
              "digitalmenu_user",
              JSON.stringify({ ...session.user, isLoggedIn: true })
            );
          } catch (e) {}
        } else {
          if (!localStorage.getItem("digitalmenu_user")) {
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setAuthLoaded(true);
      });
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("digitalmenu_user");
      localStorage.clear();
    } catch (e) {}
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/" });
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs: FAQItem[] = [
    {
      question: "Do my customers need to download an app or sign up to view the menu?",
      answer:
        "No! Customers simply open their smartphone's native camera (iOS or Android) and scan the QR code placed on the table. The menu loads instantly in their mobile browser—no app downloads, registrations, or installations required.",
      category: "Customer Experience",
    },
    {
      question: "How do I update dish prices or toggle out-of-stock items?",
      answer:
        "You can edit dish names, ETB prices, descriptions, and dietary badges in real time from your restaurant dashboard. You can also toggle dishes as 'Available' or 'Out of Stock' with a single tap. Changes reflect immediately on all scanned menus without reprinting QR codes!",
      category: "Menu Management",
    },
    {
      question: "How does table QR code generation and printing work?",
      answer:
        "Our built-in QR generator lets you generate QR codes for your entire restaurant or dedicated table numbers (e.g. Table 1, Table 2). You can customize the poster background color with our color picker to match your restaurant interior and download high-resolution, print-ready A4 posters directly from the dashboard.",
      category: "QR Codes & Printing",
    },
    {
      question: "Can customers place orders directly from their tables?",
      answer:
        "Yes! Guests can browse food and drinks by category, view appetizing item photos, add dishes to their digital ordering tray with quantity controls, and review their order total in ETB directly from their mobile screen.",
      category: "Ordering",
    },
    {
      question: "Can I manage multiple restaurants or branch locations with one account?",
      answer:
        "Yes. Restaurant owners and administrators can create and manage multiple restaurant locations, separate menu catalogs, and individual table QR codes from a single, unified dashboard.",
      category: "Multi-Location",
    },
    {
      question: "What currency is used for prices?",
      answer:
        "All pricing across the platform is formatted in Ethiopian Birr (ETB), perfectly tailored for local dining establishments, cafes, and hospitality businesses.",
      category: "Pricing & Currency",
    },
    {
      question: "How quickly can I set up my restaurant menu?",
      answer:
        "Less than 5 minutes! Register for free, create your restaurant profile, add your menu categories (e.g. Appetizers, Mains, Drinks, Desserts), add your dishes with prices and images, and download your table QR posters immediately.",
      category: "Setup",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900 selection:bg-primary-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <Image
                  src="/logo.png"
                  alt="DigitalMenu"
                  width={38}
                  height={38}
                  className="w-9 h-9 object-contain rounded-xl group-hover:scale-105 transition-transform"
                  priority
                />
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  Digital<span className="text-primary-600">Menu</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links (Center) */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-gray-50/80 p-1 rounded-xl border border-gray-200/60">
              <button
                id="nav-why-btn"
                onClick={() => scrollTo("why-digital-menu")}
                className="text-gray-700 hover:text-primary-600 hover:bg-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
              >
                Why Digital Menu
              </button>
              <button
                id="nav-faq-btn"
                onClick={() => scrollTo("faq")}
                className="text-gray-700 hover:text-primary-600 hover:bg-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-xs"
              >
                FAQ
              </button>
            </div>

            {/* Right: Auth Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold text-gray-800 max-w-[140px] truncate">
                      {currentUser?.name || currentUser?.email}
                    </span>
                    {currentUser?.role && (
                      <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Dashboard</span>
                    <span>→</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 px-3.5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 transition-all"
                  >
                    Create Menu
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <button
              onClick={() => scrollTo("why-digital-menu")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Why Digital Menu
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Frequently Asked Questions (FAQ)
            </button>
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full text-center bg-primary-600 text-white font-bold py-2.5 rounded-xl text-sm"
                  >
                    Go to Dashboard →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-sm font-semibold text-red-600 py-2 hover:bg-red-50 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full text-center border border-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="w-full text-center bg-primary-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-md"
                  >
                    Create Menu
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-primary-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-bold uppercase tracking-wider mb-6 border border-primary-200">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping"></span>
              The Contactless QR Menu Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Modern Digital Menus <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-amber-600 bg-clip-text text-transparent">
                for Your Restaurant
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Replace messy, expensive paper menus with smart, QR-based digital menus.
              Update prices in ETB instantly, manage multiple tables, and delight your guests with seamless contactless browsing.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 text-base font-bold shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Go to Dashboard</span>
                  <span>→</span>
                </Link>
              ) : (
                <Link
                  href="/login?mode=register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 text-base font-bold shadow-xl shadow-primary-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Create Free Menu</span>
                  <span>→</span>
                </Link>
              )}

              <button
                onClick={() => scrollTo("why-digital-menu")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/80 text-base font-semibold shadow-xs transition-colors"
              >
                <span>Why Digital Menu?</span>
                <span className="text-primary-600">↓</span>
              </button>

              <button
                onClick={() => scrollTo("faq")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/80 text-base font-semibold shadow-xs transition-colors"
              >
                <span>Explore FAQ</span>
                <span className="text-primary-600">↓</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">✓</span> Zero App Downloads Required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">✓</span> Live Real-Time Price Updates
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">✓</span> Custom A4 Table Posters
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">✓</span> Ethiopian Birr (ETB) Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DIGITAL MENU SECTION */}
      <section
        id="why-digital-menu"
        className="py-20 lg:py-28 bg-white border-y border-gray-100 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200 mb-3">
              <span>🚀</span> Why Upgrade Today
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Why Choose DigitalMenu?
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Paper menus get dirty, tear easily, and cost thousands to reprint every time prices shift.
              DigitalMenu gives you total control, higher customer satisfaction, and increased revenue.
            </p>
          </div>

          {/* 6 Value Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                💸
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Save 100% on Printing Costs
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No more expensive print runs when ingredient prices fluctuate or chef specials change.
                Update dishes, descriptions, and prices directly from your smartphone or laptop for free.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Instant Real-Time Updates
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Run out of beef or seafood during peak dinner rush? Toggle it as &apos;Out of Stock&apos; in one click so customers never order unavailable food.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Zero Friction for Diners
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No app installation. No app store waiting. No account creation.
                Guests scan the table QR code and the beautiful menu opens instantly in safari, chrome, or native camera.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Print-Ready A4 Table Posters
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generate professional, branded QR table posters with custom background colors matching your restaurant atmosphere. Download and laminate in seconds.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                📈
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Higher Order Value & Turnover
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vibrant dish imagery and appetizing descriptions trigger impulse ordering, boosting average check size by up to 25% and reducing customer wait time.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-5 group-hover:scale-110 transition-transform">
                🧼
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Clean, Touchless & Modern
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Say goodbye to sticky, grease-stained paper menus passed between dozens of strangers. Deliver a hygienic, premium dining touchpoint that builds customer trust.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-gradient-to-br from-slate-900 to-gray-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold">
                Old Paper Menus vs. DevVoltz DigitalMenu
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                See why forward-thinking restaurants and cafes are making the permanent switch.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="pb-4 font-semibold">Feature</th>
                    <th className="pb-4 font-semibold text-rose-400">Traditional Paper Menus</th>
                    <th className="pb-4 font-semibold text-emerald-400">DigitalMenu Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="py-4 font-medium text-gray-300">Price Adjustments</td>
                    <td className="py-4 text-gray-400">Requires expensive reprinting & delay</td>
                    <td className="py-4 text-emerald-400 font-semibold">Instant updates in ETB in 5 seconds</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-gray-300">Out-of-Stock Dishes</td>
                    <td className="py-4 text-gray-400">Ugly pen scribbles or waiter apologies</td>
                    <td className="py-4 text-emerald-400 font-semibold">One-click instant toggle hide</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-gray-300">Hygiene & Cleanliness</td>
                    <td className="py-4 text-gray-400">Sticky, worn, stained paper booklets</td>
                    <td className="py-4 text-emerald-400 font-semibold">100% Touchless on diner&apos;s own phone</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-gray-300">Table Management</td>
                    <td className="py-4 text-gray-400">Waiters running menus back and forth</td>
                    <td className="py-4 text-emerald-400 font-semibold">Permanent branded A4 table QR codes</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-gray-300">Visual Appeal</td>
                    <td className="py-4 text-gray-400">Plain text or faded low-res photos</td>
                    <td className="py-4 text-emerald-400 font-semibold">High-resolution vivid food photography</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        className="py-20 lg:py-28 bg-slate-50 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider border border-primary-200 mb-3">
              <span>💡</span> Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Everything you need to know about setting up your digital menu, generating table QR codes, and delighting your guests.
            </p>
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-primary-300 shadow-md ring-2 ring-primary-500/10"
                      : "border-gray-200/90 shadow-xs hover:border-gray-300"
                  }`}
                >
                  <button
                    id={`faq-btn-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <span className="font-bold text-gray-900 text-base sm:text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? "bg-primary-600 text-white rotate-180"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Support Callout Box */}
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-primary-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                💬
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">
                  Have a specific question about your restaurant?
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  Our team is available to assist you with onboarding, QR poster design, and menu setup.
                </p>
              </div>
            </div>
            <Link
              href="/login?mode=register"
              className="flex-shrink-0 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 transition-all"
            >
              Start Free Setup →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-primary-600 via-primary-700 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to upgrade your restaurant menu?
          </h2>
          <p className="mt-3 text-lg text-primary-100 max-w-2xl mx-auto">
            Join modern restaurants cutting costs, boosting order sizes, and delighting guests with contactless digital menus.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login?mode=register"
              className="bg-white text-primary-700 hover:bg-gray-100 font-extrabold px-8 py-3.5 rounded-xl shadow-lg text-base transition-all transform hover:-translate-y-0.5"
            >
              Create Your Menu Now →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="DigitalMenu"
                width={32}
                height={32}
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Digital<span className="text-primary-500">Menu</span>
              </span>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                by DevVoltz
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <button
                onClick={() => scrollTo("why-digital-menu")}
                className="hover:text-white transition-colors"
              >
                Why Digital Menu
              </button>
              <button
                onClick={() => scrollTo("faq")}
                className="hover:text-white transition-colors"
              >
                FAQ
              </button>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/login?mode=register"
                className="hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </div>

            <div className="text-xs text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} DigitalMenu (DevVoltz). All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
