"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import SectionDivider from "@/components/SectionDivider";

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

interface DemoDish {
  id: string;
  title: string;
  category: "mains" | "traditional" | "drinks" | "desserts";
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  tag: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // =========================================================================
  // INTERACTIVE HERO MENU CREATION STUDIO STATE
  // =========================================================================
  const [studioTab, setStudioTab] = useState<"builder" | "qr" | "diner">("builder");
  const [activeStudioCategory, setActiveStudioCategory] = useState<"mains" | "traditional" | "drinks" | "desserts">("mains");
  const [selectedDemoDishId, setSelectedDemoDishId] = useState<string>("m1");
  const [demoDishes, setDemoDishes] = useState<DemoDish[]>([
    {
      id: "m1",
      title: "Gourmet Ribeye Steak",
      category: "mains",
      price: 680,
      image: "/dish_steak.jpg",
      description: "Charred rosemary ribeye with roasted vine tomatoes & asparagus",
      inStock: true,
      tag: "Chef Special",
    },
    {
      id: "m2",
      title: "Artisan Brioche Burger",
      category: "mains",
      price: 340,
      image: "/dish_burger.jpg",
      description: "Caramelized onions, aged melted cheddar & crispy shoestring fries",
      inStock: true,
      tag: "Popular",
    },
    {
      id: "t1",
      title: "Special Doro Wat & Injera",
      category: "traditional",
      price: 450,
      image: "/dish_ethiopian.jpg",
      description: "Traditional spicy chicken stew, boiled farm egg, tibs & freshly rolled injera",
      inStock: true,
      tag: "Traditional",
    },
    {
      id: "d1",
      title: "Clay Pot Jebena Coffee",
      category: "drinks",
      price: 120,
      image: "/dish_coffee.jpg",
      description: "Organic highland single-origin beans roasted over fragrant frankincense",
      inStock: true,
      tag: "Organic",
    },
  ]);
  const [selectedTable, setSelectedTable] = useState<string>("Table 04");
  const [qrColorTheme, setQrColorTheme] = useState<string>("#7f44c9");
  const [dinerTray, setDinerTray] = useState<{ id: string; title: string; price: number; qty: number }[]>([
    { id: "m1", title: "Gourmet Ribeye Steak", price: 680, qty: 1 },
    { id: "d1", title: "Clay Pot Jebena Coffee", price: 120, qty: 1 },
  ]);
  const [syncToastVisible, setSyncToastVisible] = useState(false);

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

  // Trigger temporary sync notification on demo interactions
  const notifySync = (msg: string) => {
    setSyncToastVisible(true);
    setTimeout(() => setSyncToastVisible(false), 2400);
  };

  const handlePriceChange = (delta: number) => {
    setDemoDishes((prev) =>
      prev.map((d) => {
        if (d.id === selectedDemoDishId) {
          const newPrice = Math.max(50, d.price + delta);
          return { ...d, price: newPrice };
        }
        return d;
      })
    );
    notifySync("Price updated & synced to all table QR scans in 0.1s!");
  };

  const handleToggleStock = () => {
    setDemoDishes((prev) =>
      prev.map((d) => {
        if (d.id === selectedDemoDishId) {
          const newStock = !d.inStock;
          return { ...d, inStock: newStock };
        }
        return d;
      })
    );
    notifySync("Stock status toggled live across tables!");
  };

  const handleAddToDinerTray = (dish: DemoDish) => {
    setDinerTray((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: dish.id, title: dish.title, price: dish.price, qty: 1 }];
    });
    toast.success(`Added ${dish.title} to diner tray!`);
  };

  const currentDish = demoDishes.find((d) => d.id === selectedDemoDishId) || demoDishes[0];
  const trayTotal = dinerTray.reduce((acc, item) => acc + item.price * item.qty, 0);

  const faqs: FAQItem[] = [
    {
      question: "How does the menu creation platform work?",
      answer:
        "You register your restaurant in under 3 minutes, add your dish categories (Starters, Mains, Traditional, Beverages), set your prices in Ethiopian Birr (ETB), and upload dish photos. Our platform automatically generates a custom mobile digital menu and high-resolution table QR posters ready for instant printing.",
      category: "Menu Creation",
    },
    {
      question: "Do my restaurant guests need to download an app or sign up?",
      answer:
        "No! Guests simply open their smartphone's native camera (iOS or Android) and aim it at the QR code on the table. The digital menu loads instantaneously in their mobile browser—no downloads, registrations, or passwords required.",
      category: "Customer Experience",
    },
    {
      question: "How fast do price changes and out-of-stock toggles reflect?",
      answer:
        "Instantly in real time! When ingredient costs fluctuate or a dish runs out during peak dinner rush, you edit the ETB price or toggle 'Out of Stock' in your DigitalMenu dashboard. Any diner scanning that table sees the update immediately without reprinting paper menus.",
      category: "Live Management",
    },
    {
      question: "How do table QR code posters work?",
      answer:
        "Our built-in QR generator lets you generate QR codes for your entire restaurant or dedicated table numbers (e.g. Table 1, Table 2 ... Table 50). You can customize poster background colors to match your restaurant interior and download high-resolution, print-ready A4 or table tent posters directly.",
      category: "QR Codes & Printing",
    },
    {
      question: "Can guests build an order tray on their phones?",
      answer:
        "Yes! Diners can browse categories, view appetizing dish photos, add items to their personal ordering tray with quantity controls, and review their order total in ETB directly on their screen.",
      category: "Ordering",
    },
    {
      question: "Can I manage multiple restaurants or branch locations?",
      answer:
        "Yes. Restaurant owners can manage multiple branches, separate menu catalogs, and dedicated table QR codes from one unified DigitalMenu account.",
      category: "Multi-Location",
    },
    {
      question: "What currency is used across the system?",
      answer:
        "All pricing across the platform is formatted in Ethiopian Birr (ETB), perfectly tailored for local dining establishments, cafes, lounges, and hotels across Ethiopia.",
      category: "Pricing & Currency",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8fc] text-slate-800 selection:bg-[#ff7597] selection:text-white font-sans">
      {/* ========================================================= */}
      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR */}
      {/* ========================================================= */}
      <div className="bg-[#6c2ebd] text-white/95 text-xs py-2 px-4 border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span>✨ Contactless Smart QR Digital Menus for Restaurants & Cafes</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-purple-200">
            <span>📍 Addis Ababa & Global</span>
            <span>•</span>
            <a
              href="tel:+251940192676"
              className="hover:text-[#ff98b4] transition-colors"
            >
              📞 +251 940 192 676
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN NAVBAR */}
      {/* ========================================================= */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-purple-100 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="DigitalMenu Official Brand Logo"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#6c2ebd]">
                Digital<span className="text-[#ff6384]">Menu</span>
              </span>
            </Link>

            {/* Clean, Clear Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-semibold text-slate-600">
              <button
                onClick={() => scrollTo("how-it-works")}
                className="hover:text-[#6c2ebd] transition-colors py-1"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollTo("studio-demo")}
                className="hover:text-[#6c2ebd] transition-colors py-1"
              >
                Live Studio
              </button>
              <button
                onClick={() => scrollTo("features-section")}
                className="hover:text-[#6c2ebd] transition-colors py-1"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("pricing-section")}
                className="hover:text-[#6c2ebd] transition-colors py-1"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollTo("faq-section")}
                className="hover:text-[#6c2ebd] transition-colors py-1"
              >
                FAQ
              </button>
            </div>

            {/* Right Action: Clean Sign In (Create Menu Free hidden on top) */}
            <div className="hidden sm:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 border border-purple-200/60 rounded-full text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-[#6c2ebd] max-w-[130px] truncate">
                      {currentUser?.name || currentUser?.email}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    className="bg-[#6c2ebd] hover:bg-[#581c87] text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold shadow-sm transition-all"
                  >
                    Dashboard →
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-rose-600 px-2 py-1.5 text-xs font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#6c2ebd] hover:bg-purple-50/70 border border-slate-200 transition-all shadow-xs"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-700 hover:text-[#6c2ebd] hover:bg-purple-50 transition-colors"
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6c2ebd]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("studio-demo")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6c2ebd]"
            >
              Live Studio
            </button>
            <button
              onClick={() => scrollTo("features-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6c2ebd]"
            >
              Platform Features
            </button>
            <button
              onClick={() => scrollTo("pricing-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6c2ebd]"
            >
              Price List
            </button>
            <button
              onClick={() => scrollTo("faq-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#6c2ebd]"
            >
              FAQ
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full text-center bg-[#6c2ebd] text-white font-bold py-2.5 rounded-full text-sm shadow-md"
                  >
                    Go to Dashboard →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-sm font-semibold text-rose-600 py-1.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="w-full text-center border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-full text-sm hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================= */}
      {/* 3. HERO SECTION: BRAND & CLEAR CREATING PLATFORM DEMO */}
      {/* ========================================================= */}
      <section
        id="studio-demo"
        className="relative pt-10 pb-24 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#fbf8ff] via-white to-[#faf5ff]"
      >
        {/* Soft background ambient gradient glows */}
        <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-br from-[#7f44c9]/12 to-[#ff6384]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-36 right-10 w-[550px] h-[400px] bg-gradient-to-bl from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* ------------------------------------------------ */}
            {/* HERO LEFT COLUMN: The Platform Value Proposition */}
            {/* ------------------------------------------------ */}
            <div className="lg:col-span-6 text-center lg:text-left">
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/80 text-[#6c2ebd] text-xs font-bold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>The #1 Digital Menu & QR Creation Platform</span>
                <span className="text-[#ff6384] font-black">•</span>
                <span className="text-slate-600 font-medium">3-Min Setup</span>
              </div>

              {/* Bold Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
                Create, Launch & Manage Your Restaurant&apos;s{" "}
                <span className="bg-gradient-to-r from-[#6c2ebd] via-[#8538ea] to-[#ff6384] bg-clip-text text-transparent">
                  QR Digital Menu
                </span>
              </h1>

              {/* Clear Platform Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                Say goodbye to expensive reprints and sticky paper menus. Add your dishes, set prices in Ethiopian Birr (ETB), generate print-ready table QR codes, and let guests browse & order instantly on their smartphone cameras.
              </p>

              {/* 3-Step Interactive Pills that switch demo perspective */}
              <div className="mb-8 p-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm max-w-xl mx-auto lg:mx-0">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  See How Simply You Create & Launch:
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setStudioTab("builder");
                      notifySync("Showing Menu Builder: Add items & set prices");
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                      studioTab === "builder"
                        ? "bg-[#6c2ebd] text-white shadow-md shadow-[#6c2ebd]/20"
                        : "bg-purple-50/60 text-slate-700 hover:bg-purple-100/60"
                    }`}
                  >
                    <span className="text-[10px] opacity-80">Step 1</span>
                    <span className="truncate w-full">① Build Menu</span>
                  </button>

                  <button
                    onClick={() => {
                      setStudioTab("qr");
                      notifySync("Showing QR Studio: Instant table poster generator");
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                      studioTab === "qr"
                        ? "bg-[#6c2ebd] text-white shadow-md shadow-[#6c2ebd]/20"
                        : "bg-purple-50/60 text-slate-700 hover:bg-purple-100/60"
                    }`}
                  >
                    <span className="text-[10px] opacity-80">Step 2</span>
                    <span className="truncate w-full">② Get Table QRs</span>
                  </button>

                  <button
                    onClick={() => {
                      setStudioTab("diner");
                      notifySync("Showing Diner Phone: Instant camera view");
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                      studioTab === "diner"
                        ? "bg-[#6c2ebd] text-white shadow-md shadow-[#6c2ebd]/20"
                        : "bg-purple-50/60 text-slate-700 hover:bg-purple-100/60"
                    }`}
                  >
                    <span className="text-[10px] opacity-80">Step 3</span>
                    <span className="truncate w-full">③ Diners Scan</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white bg-[#6c2ebd] hover:bg-[#581c87] text-sm uppercase tracking-wider font-extrabold shadow-xl shadow-[#6c2ebd]/30 transition-all border-b-4 border-[#ff6384] transform hover:-translate-y-0.5"
                  >
                    <span>Open Your Dashboard</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?mode=register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white bg-[#6c2ebd] hover:bg-[#581c87] text-sm uppercase tracking-wider font-extrabold shadow-xl shadow-[#6c2ebd]/30 transition-all border-b-4 border-[#ff6384] transform hover:-translate-y-0.5"
                  >
                    <span>Create Your Menu — Free</span>
                    <span>→</span>
                  </Link>
                )}

                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[#6c2ebd] bg-white hover:bg-purple-50 border-2 border-purple-200 shadow-md shadow-purple-500/5 text-sm uppercase tracking-wider font-bold transition-all"
                >
                  <span>Explore 3 Steps</span>
                  <span>↓</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="mt-9 pt-6 border-t border-purple-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>0.2s Camera QR Scan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6384]"></span>
                  <span>100% No App Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6c2ebd]"></span>
                  <span>Instant ETB Price Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>A4 Vector Posters</span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* HERO RIGHT COLUMN: Interactive Creation Platform */}
            {/* ------------------------------------------------ */}
            <div className="lg:col-span-6 relative">
              {/* Outer Glow container */}
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#6c2ebd] via-[#ff6384] to-indigo-600 rounded-3xl opacity-20 blur-xl"></div>

                {/* Main Interactive Studio Card */}
                <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden">
                  {/* Studio Window Chrome Bar */}
                  <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-semibold text-slate-300 ml-2 font-mono">
                        DigitalMenu Studio › Bole Bistro
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Cloud Live</span>
                    </div>
                  </div>

                  {/* Studio Navigation Tabs */}
                  <div className="flex items-center border-b border-purple-100 bg-[#faf8fc] px-4 pt-2">
                    <button
                      onClick={() => setStudioTab("builder")}
                      className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                        studioTab === "builder"
                          ? "border-[#6c2ebd] text-[#6c2ebd]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>🛠️ 1. Menu Builder</span>
                    </button>

                    <button
                      onClick={() => setStudioTab("qr")}
                      className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                        studioTab === "qr"
                          ? "border-[#6c2ebd] text-[#6c2ebd]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>🏷️ 2. QR Generator</span>
                    </button>

                    <button
                      onClick={() => setStudioTab("diner")}
                      className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                        studioTab === "diner"
                          ? "border-[#6c2ebd] text-[#6c2ebd]"
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>📱 3. Diner Mobile View</span>
                    </button>
                  </div>

                  {/* ------------------------------------------------ */}
                  {/* TAB 1: MENU BUILDER VIEW */}
                  {/* ------------------------------------------------ */}
                  {studioTab === "builder" && (
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Category Selection Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Choose Category to Edit:
                          </label>
                          <span className="text-[10px] text-[#6c2ebd] font-bold">
                            Interactive Sandbox
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                          {(
                            [
                              { key: "mains", label: "🥩 Mains" },
                              { key: "traditional", label: "🥘 Ethiopian" },
                              { key: "drinks", label: "☕ Drinks" },
                              { key: "desserts", label: "🍰 Desserts" },
                            ] as const
                          ).map((cat) => (
                            <button
                              key={cat.key}
                              onClick={() => {
                                setActiveStudioCategory(cat.key);
                                const match = demoDishes.find((d) => d.category === cat.key);
                                if (match) setSelectedDemoDishId(match.id);
                              }}
                              className={`py-2 px-1 rounded-xl text-center truncate transition-all ${
                                activeStudioCategory === cat.key
                                  ? "bg-[#6c2ebd] text-white shadow-sm"
                                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Dish Editor Box */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-pink-50/40 border border-purple-200/70 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-purple-200 bg-white">
                              <img
                                src={currentDish.image}
                                alt={currentDish.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#6c2ebd] text-white">
                                  {currentDish.tag}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  {currentDish.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                                {currentDish.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {currentDish.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Price & Stock Controls */}
                        <div className="pt-2 border-t border-purple-200/60 grid grid-cols-2 gap-3 items-center">
                          {/* Price in ETB control */}
                          <div className="bg-white p-2 rounded-xl border border-purple-200/80 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              Dish Price (ETB):
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-base font-black text-[#6c2ebd]">
                                {currentDish.price} ETB
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handlePriceChange(-20)}
                                  className="w-6 h-6 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#6c2ebd] font-bold flex items-center justify-center text-xs transition-colors"
                                  title="Decrease Price"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => handlePriceChange(20)}
                                  className="w-6 h-6 rounded-lg bg-[#6c2ebd] hover:bg-[#581c87] text-white font-bold flex items-center justify-center text-xs transition-colors"
                                  title="Increase Price"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Stock Status Toggle button */}
                          <button
                            onClick={handleToggleStock}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              currentDish.inStock
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                                : "bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100"
                            }`}
                          >
                            <span className="text-[10px] font-bold block uppercase opacity-80">
                              Table Stock Toggle:
                            </span>
                            <span className="text-xs font-extrabold flex items-center gap-1.5 mt-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  currentDish.inStock ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              ></span>
                              {currentDish.inStock ? "Active & Serving" : "Marked Out of Stock"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Live Sync Notification Banner */}
                      <div className="p-3 rounded-xl bg-purple-900 text-white flex items-center justify-between text-xs shadow-md">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚡</span>
                          <div>
                            <p className="font-bold">Instant Real-Time Cloud Sync</p>
                            <p className="text-[11px] text-purple-200">
                              Any guest scanning Table 1 to 24 sees updates in 0.1s.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setStudioTab("diner")}
                          className="px-3 py-1.5 rounded-lg bg-[#ff6384] hover:bg-[#ff4d73] text-white font-bold text-[11px] transition-colors shrink-0"
                        >
                          View Phone →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------ */}
                  {/* TAB 2: TABLE QR POSTER GENERATOR */}
                  {/* ------------------------------------------------ */}
                  {studioTab === "qr" && (
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-slate-700">
                            Select Dining Table:
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Generate dedicated QR codes per table
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {["Table 01", "Table 04", "Table 12", "All 24"].map((tbl) => (
                            <button
                              key={tbl}
                              onClick={() => {
                                setSelectedTable(tbl);
                                notifySync(`Generated vector QR poster for ${tbl}`);
                              }}
                              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                                selectedTable === tbl
                                  ? "bg-[#6c2ebd] text-white"
                                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                              }`}
                            >
                              {tbl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Printable A4 Table Tent Frame Mockup */}
                      <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-purple-50 border-2 border-purple-200 shadow-inner flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-[#6c2ebd] p-0.5 flex items-center justify-center">
                            <Image
                              src="/logo.png"
                              alt="Logo"
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-extrabold text-sm text-[#6c2ebd]">
                            Bole Garden Bistro
                          </span>
                        </div>

                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff6384] bg-pink-100 px-3 py-0.5 rounded-full mb-3">
                          {selectedTable} • Contactless Dining
                        </span>

                        {/* Visual QR Code Generator */}
                        <div className="w-36 h-36 p-3 bg-white rounded-2xl shadow-md border-2 border-slate-900/10 flex flex-col items-center justify-center relative group">
                          {/* Authentic SVG QR pattern representation */}
                          <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="5" y="5" width="25" height="25" rx="3" fill="#1e1b4b" />
                            <rect x="10" y="10" width="15" height="15" fill="white" />
                            <rect x="13" y="13" width="9" height="9" fill="#6c2ebd" />

                            <rect x="70" y="5" width="25" height="25" rx="3" fill="#1e1b4b" />
                            <rect x="75" y="10" width="15" height="15" fill="white" />
                            <rect x="78" y="13" width="9" height="9" fill="#6c2ebd" />

                            <rect x="5" y="70" width="25" height="25" rx="3" fill="#1e1b4b" />
                            <rect x="10" y="75" width="15" height="15" fill="white" />
                            <rect x="13" y="78" width="9" height="9" fill="#6c2ebd" />

                            {/* Dense data modules */}
                            <rect x="36" y="10" width="8" height="8" fill="#1e1b4b" />
                            <rect x="48" y="10" width="14" height="6" fill="#1e1b4b" />
                            <rect x="36" y="24" width="26" height="6" fill="#6c2ebd" />
                            <rect x="10" y="36" width="12" height="6" fill="#1e1b4b" />
                            <rect x="28" y="36" width="14" height="14" fill="#1e1b4b" />
                            <rect x="48" y="36" width="14" height="8" fill="#1e1b4b" />
                            <rect x="68" y="36" width="22" height="8" fill="#6c2ebd" />
                            <rect x="10" y="48" width="12" height="14" fill="#6c2ebd" />
                            <rect x="48" y="50" width="16" height="14" fill="#1e1b4b" />
                            <rect x="70" y="50" width="20" height="8" fill="#1e1b4b" />
                            <rect x="36" y="70" width="10" height="20" fill="#1e1b4b" />
                            <rect x="52" y="70" width="18" height="10" fill="#6c2ebd" />
                            <rect x="76" y="66" width="14" height="14" fill="#1e1b4b" />
                            <rect x="52" y="84" width="38" height="6" fill="#1e1b4b" />
                          </svg>

                          <div className="absolute inset-0 bg-[#6c2ebd]/90 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white p-2">
                            <span className="text-xl">📷</span>
                            <span className="text-[10px] font-bold mt-1">Aim Phone Camera</span>
                          </div>
                        </div>

                        <p className="text-xs font-bold text-slate-800 mt-3">
                          Point Smartphone Camera to Open Menu
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Instant high-speed mobile browser catalog • No apps needed
                        </p>
                      </div>

                      {/* Download CTA Bar */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toast.success(`Downloaded high-res A4 poster for ${selectedTable}!`)}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#6c2ebd] hover:bg-[#581c87] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <span>📥 Download A4 Poster (PDF)</span>
                        </button>
                        <button
                          onClick={() => setStudioTab("diner")}
                          className="py-3 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#6c2ebd] font-bold text-xs transition-colors"
                        >
                          Simulate Scan ➔
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------ */}
                  {/* TAB 3: LIVE DINER SMARTPHONE VIEW */}
                  {/* ------------------------------------------------ */}
                  {studioTab === "diner" && (
                    <div className="p-5 sm:p-6 bg-slate-100/70">
                      {/* Realistic Smartphone Shell */}
                      <div className="max-w-[340px] mx-auto bg-white rounded-[2.5rem] shadow-xl border-4 border-slate-900 overflow-hidden relative">
                        {/* Smartphone Speaker notch */}
                        <div className="bg-slate-900 h-5 w-32 mx-auto rounded-b-xl flex items-center justify-center mb-1">
                          <span className="w-10 h-1 rounded-full bg-slate-700"></span>
                        </div>

                        {/* Diner App Header */}
                        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#6c2ebd] p-0.5 flex items-center justify-center">
                              <Image
                                src="/logo.png"
                                alt="Logo"
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-none">Bole Garden</p>
                              <p className="text-[9px] font-bold text-emerald-600">Table 04 • Verified</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">🇪🇹 ETB</span>
                        </div>

                        {/* Diner Menu Feed */}
                        <div className="p-3 space-y-2.5 max-h-[290px] overflow-y-auto">
                          {demoDishes.map((dish) => (
                            <div
                              key={dish.id}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2.5 hover:bg-purple-50/50 transition-colors"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                                <img
                                  src={dish.image}
                                  alt={dish.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-900 text-xs truncate">
                                  {dish.title}
                                </h5>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {dish.description}
                                </p>
                                <span className="text-xs font-black text-[#6c2ebd]">
                                  {dish.price} ETB
                                </span>
                              </div>
                              <button
                                onClick={() => handleAddToDinerTray(dish)}
                                disabled={!dish.inStock}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                                  dish.inStock
                                    ? "bg-[#6c2ebd] text-white hover:bg-[#581c87]"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                              >
                                {dish.inStock ? "+ Add" : "Sold Out"}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Diner Floating Tray Drawer */}
                        <div className="p-3 bg-purple-900 text-white flex items-center justify-between border-t border-purple-800">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-[#ff6384]">Diner Tray</p>
                            <p className="text-xs font-black">
                              {dinerTray.length} items • {trayTotal} ETB
                            </p>
                          </div>
                          <button
                            onClick={() => toast.success("Order ready! Waiter notified for Table 04.")}
                            className="px-3.5 py-1.5 rounded-full bg-[#ff6384] hover:bg-[#ff4d73] text-white text-[11px] font-bold shadow-md transition-all"
                          >
                            Review Order →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Studio Bottom Bar Help Notice */}
                  <div className="bg-purple-50/60 px-5 py-2.5 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Interactive Demo: Click categories, prices, or tabs to test!
                    </span>
                    <span className="font-bold text-[#6c2ebd]">DigitalMenu™ Engine</span>
                  </div>
                </div>

                {/* Micro floating live sync badges */}
                <div
                  className={`absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-purple-200 flex items-center gap-3 transition-all duration-300 ${
                    syncToastVisible ? "scale-105 ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Live Table Sync
                    </p>
                    <p className="text-xs font-bold text-[#6c2ebd]">
                      Prices update in 0.1s across tables
                    </p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xl border border-purple-400/30 flex items-center gap-2.5">
                  <div className="w-5 h-3.5 rounded-sm overflow-hidden flex flex-col shadow-xs border border-white/20 shrink-0">
                    <div className="h-1/3 bg-[#078930]"></div>
                    <div className="h-1/3 bg-[#fcdd09] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0f47af]"></div>
                    </div>
                    <div className="h-1/3 bg-[#da121a]"></div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-[#ff6384]">Currency Ready</p>
                    <p className="text-xs font-bold text-white">Ethiopian Birr (ETB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="slant-right" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION 2: HOW THE MENU CREATION PLATFORM WORKS */}
      {/* ========================================================= */}
      <section
        id="how-it-works"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#6c2ebd]">
                Simple 3-Step Process
              </span>
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              How to Create & Launch Your Digital Menu
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              From signing up to placing custom QR code posters on your restaurant tables in less than 5 minutes.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#faf8fc] to-white border-2 border-purple-100 hover:border-[#6c2ebd] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#6c2ebd] flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                  01
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Build Your Menu Catalog
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter your restaurant details, create custom categories (Mains, Combos, Beverages, Desserts), upload mouth-watering dish photos, and set your prices in Ethiopian Birr (ETB).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100/80 flex items-center gap-2 text-xs font-bold text-[#6c2ebd]">
                <span>✓ Unlimited dishes & photos</span>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#faf8fc] to-white border-2 border-purple-100 hover:border-[#6c2ebd] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#ff6384] flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#ff6384] group-hover:text-white transition-colors">
                  02
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Generate Table QR Posters
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Instantly generate crisp, high-resolution QR codes tailored for individual tables (Table 1, Table 2 ... Table 50). Download print-ready A4 table tents matching your brand palette.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100/80 flex items-center gap-2 text-xs font-bold text-[#ff6384]">
                <span>✓ High-res vector printable files</span>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#faf8fc] to-white border-2 border-purple-100 hover:border-[#6c2ebd] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  03
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  Guests Scan & You Update Live
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Diners aim their smartphone camera at the table QR code to browse and order with zero apps. Update prices or toggle sold-out items anytime—changes reflect instantly!
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-100/80 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>✓ Zero reprinting costs ever</span>
              </div>
            </div>
          </div>

          {/* Quick CTA banner */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#6c2ebd] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h4 className="text-xl sm:text-2xl font-black">
                Ready to create your restaurant menu today?
              </h4>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                No credit card required. Start with our free tier and launch in 3 minutes.
              </p>
            </div>
            <Link
              href="/login?mode=register"
              className="px-8 py-3.5 rounded-full bg-white text-[#6c2ebd] hover:bg-[#ff6384] hover:text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all border-b-2 border-[#ff6384] whitespace-nowrap"
            >
              Start Creating Now →
            </Link>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="slant-left" fillColor="#faf5ff" />
      </section>

      {/* ========================================================= */}
      {/* 5. SECTION 3: FEATURES THAT POWER MODERN RESTAURANTS */}
      {/* ========================================================= */}
      <section
        id="features-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-[#faf5ff] scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#6c2ebd]">
                Platform Capabilities
              </span>
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Engineered for Ethiopian Hospitality
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Transform traditional restaurant dining into a fast, beautiful, and profitable digital experience.
            </p>
          </div>

          {/* 6 Core Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                ⚡
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Real-Time ETB Price Updates
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ingredient costs changed? Update prices in Ethiopian Birr from your phone dashboard. Scanned tables reflect the new prices in 0.1s.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                📱
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Zero App Download Friction
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No App Store or Google Play downloads required. Diners scan with their built-in phone camera and the digital menu opens immediately.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                🖨️
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Vector Print Table Posters
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate high-resolution A4 acrylic stand inserts or table tent cards with your restaurant logo and custom theme colors ready to laminate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                🛒
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Diner Digital Ordering Tray
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Guests curate items in their personal ordering tray, adjust quantities, review the total bill in ETB, and submit orders effortlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                🏢
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Multi-Branch & Table Control
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manage 1 restaurant or 10 branch locations. Assign dedicated table numbers (Table 1 to 50) and isolate orders by dining station.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-2xl mb-5 group-hover:bg-[#6c2ebd] group-hover:text-white transition-colors">
                🔒
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Fast Cloud Cluster & 99.9% Uptime
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Backed by robust cloud database clustering with sub-second response times, ensuring zero slowdowns even during Friday night peak rush.
              </p>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="asymmetric" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* 6. SECTION 4: PAPER VS DIGITAL MENU COMPARISON */}
      {/* ========================================================= */}
      <section className="relative py-20 pb-28 lg:py-24 lg:pb-36 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Restaurants Are Retiring Paper Menus
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Calculate the massive cost and operational advantage of moving to DigitalMenu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Old Paper Menu Card */}
            <div className="p-8 rounded-3xl bg-[#faf8fc] border border-rose-100/90 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl">
                  ✕
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Traditional Paper Menus</h3>
                  <p className="text-xs text-rose-600 font-semibold">Expensive & Outdated</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>15,000+ ETB spent annually on reprints for every price adjustment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Sticky, ripped, stained and unhygienic after multiple guests</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>Cannot hide sold-out dishes, leading to disappointed diners</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <span>No appetizing food photography due to limited printed space</span>
                </div>
              </div>
            </div>

            {/* Modern DigitalMenu Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#6c2ebd] to-[#581c87] text-white shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#ff6384] text-white font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-xl">
                The Smart Standard
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-xl">
                  ✓
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-white">DigitalMenu Platform</h3>
                  <p className="text-xs text-purple-200 font-semibold">Fast, Hygienic & Cloud-Synced</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm text-purple-100">
                <div className="flex items-start gap-3">
                  <span className="text-[#ff98b4] font-bold text-base mt-[-2px]">✓</span>
                  <span>0 ETB reprint costs forever — change prices instantly from any phone</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#ff98b4] font-bold text-base mt-[-2px]">✓</span>
                  <span>Always pristine, hygienic, and customized on guests&apos; personal screens</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#ff98b4] font-bold text-base mt-[-2px]">✓</span>
                  <span>1-Tap out-of-stock toggles to prevent guest order mistakes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#ff98b4] font-bold text-base mt-[-2px]">✓</span>
                  <span>Vivid HD food photography proven to boost average ticket value by 28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="slant-right" fillColor="#faf5ff" />
      </section>

      {/* ========================================================= */}
      {/* 5. SECTION 5: PRICING SECTION */}
      {/* ========================================================= */}
      <section
        id="pricing-section"
        className="relative py-20 pb-36 lg:py-28 lg:pb-44 bg-[#faf5ff] scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 text-[#6c2ebd] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-3 bg-[#078930] rounded-xs"></span>
                <span className="w-1.5 h-3 bg-[#fcdd09] rounded-xs"></span>
                <span className="w-1.5 h-3 bg-[#da121a] rounded-xs"></span>
              </span>
              <span>Recommended Pricing Structure</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Simple, Capacity-Based Plans
            </h2>

            {/* Core Strategy Callout */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-xs border border-purple-200 shadow-sm max-w-2xl mx-auto text-left flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6c2ebd] flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
                💡
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-extrabold block mb-0.5">Our Key Strategy:</strong>
                Limit business capacity on lower plans, not the basic experience of creating a good digital menu. Every customer should be able to create a useful menu, scan a QR code, and show it to customers.
              </div>
            </div>

            <p className="mt-3 text-[11px] sm:text-xs text-slate-500 font-medium italic">
              These are proposed launch prices for Ethiopia, not prices validated by market research.
            </p>
          </div>

          {/* 4-Tier Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {/* ------------------------------------------- */}
            {/* Plan 1: Free */}
            {/* ------------------------------------------- */}
            <div className="rounded-3xl bg-white border border-purple-100 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-slate-900">Free</h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6c2ebd] border border-purple-200/60">
                    Get started
                  </span>
                </div>

                <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">ETB 0</span>
                  <span className="text-xs font-semibold text-slate-400">forever</span>
                </div>

                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  For small businesses testing digital menus.
                </p>

                <div className="pt-4 border-t border-purple-50 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1 business</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>1 digital menu</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Up to 20 menu items</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>QR code generation and download</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Mobile-friendly menu page</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Basic menu themes</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Product images</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Basic availability toggle</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span className="text-slate-500">DEVVOLTZ platform branding</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Basic view counter</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-50">
                <div className="p-2.5 rounded-xl bg-purple-50/60 text-[11px] text-slate-600 mb-4 leading-relaxed">
                  <strong className="text-[#6c2ebd]">Upgrade trigger:</strong> more items, branding removal, and advanced customization.
                </div>

                <Link
                  href="/login?mode=register"
                  className="block w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#6c2ebd] bg-purple-50 hover:bg-[#6c2ebd] hover:text-white border border-purple-200/80 transition-all shadow-xs"
                >
                  Get Started →
                </Link>
              </div>
            </div>

            {/* ------------------------------------------- */}
            {/* Plan 2: Starter */}
            {/* ------------------------------------------- */}
            <div className="rounded-3xl bg-white border-2 border-purple-200/70 p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-slate-900">Starter</h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                    Individual Venues
                  </span>
                </div>

                <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">ETB 499</span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>

                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Per month · For individual restaurants and cafés.
                </p>

                <div className="pt-4 border-t border-purple-50 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>1 business</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Up to 3 menus</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Up to 100 menu items per business</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Custom logo, colors, and cover image</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>10+ professional menu templates</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Categories, prices, descriptions, and images</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Unlimited QR scans, subject to fair-use policy</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Mark products as sold out</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Menu search</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Basic analytics</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="font-semibold text-slate-800">Hide platform branding</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#6c2ebd] font-bold">✓</span>
                    <span>Shareable menu link</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-50">
                <div className="p-2.5 rounded-xl bg-purple-50/60 text-[11px] text-slate-600 mb-4 leading-relaxed">
                  <strong className="text-[#6c2ebd]">Best for:</strong> A single restaurant that wants a professional digital presence.
                </div>

                <Link
                  href="/login?mode=register"
                  className="block w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#6c2ebd] hover:bg-[#581c87] transition-all shadow-md shadow-[#6c2ebd]/20"
                >
                  Get Starter →
                </Link>
              </div>
            </div>

            {/* ------------------------------------------- */}
            {/* Plan 3: Popular (Recommended) */}
            {/* ------------------------------------------- */}
            <div className="rounded-3xl bg-gradient-to-b from-[#6c2ebd] via-[#5b21b6] to-[#4c1d95] text-white p-6 sm:p-7 shadow-2xl border-2 border-[#ff6384] relative overflow-hidden flex flex-col justify-between transform xl:-translate-y-2">
              <div className="absolute top-0 right-0 bg-[#ff6384] text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-md">
                Recommended
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-white">Popular</h3>
                </div>

                <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">ETB 999</span>
                  <span className="text-xs font-semibold text-purple-200">/ month</span>
                </div>

                <p className="text-xs text-purple-200 mb-6 leading-relaxed">
                  For established restaurants, hotels, and growing businesses.
                </p>

                <div className="pt-4 border-t border-purple-400/30 space-y-2.5 text-xs text-purple-100">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span className="font-bold text-white">Everything in Starter</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Up to 10 menus</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Up to 500 menu items</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Advanced customization and premium templates</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Multiple branches or locations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Separate menus for breakfast, lunch, and dinner</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Schedule menus by day or time</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Advanced analytics and popular-item reports</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Temporary discounts and promotional badges</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Customer feedback and ratings</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Downloadable menu PDF</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Menu duplication and bulk editing</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#ff98b4] font-bold">✓</span>
                    <span>Priority support</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-400/30">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-400/20 text-[11px] text-purple-200 mb-4 leading-relaxed">
                  <strong className="text-[#ff98b4]">Best for:</strong> Businesses that want to manage multiple menus and understand customer interest.
                </div>

                <Link
                  href="/login?mode=register"
                  className="block w-full text-center py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-[#6c2ebd] bg-white hover:bg-[#ff6384] hover:text-white transition-all shadow-xl border-b-2 border-[#ff6384]"
                >
                  Get Popular Plan →
                </Link>
              </div>
            </div>

            {/* ------------------------------------------- */}
            {/* Plan 4: Premium */}
            {/* ------------------------------------------- */}
            <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-white">Premium</h3>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    Groups & Chains
                  </span>
                </div>

                <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">ETB 1,999</span>
                  <span className="text-xs font-semibold text-slate-400">/ month</span>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Per month · For restaurant groups, hotels, and chains.
                </p>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span className="font-bold text-white">Everything in Popular</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Multiple branches with centralized management</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Custom domain support</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Unlimited menus and menu items within fair-use limits</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Team accounts and role-based permissions</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Branch-specific prices and availability</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Advanced analytics and exportable reports</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>API access and integrations</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span className="font-semibold text-white">Multi-language menus, including Amharic and English</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Premium support and onboarding</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Custom branding options</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>Audit history for important menu changes</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-800/60 text-[11px] text-slate-400 mb-4 leading-relaxed">
                  <strong className="text-amber-400">Best for:</strong> Businesses that need control, collaboration, and scalability.
                </div>

                <Link
                  href="/login?mode=register"
                  className="block w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-amber-400 transition-all shadow-md"
                >
                  Get Premium →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="wave" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* 6. SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      <section
        id="faq-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#6c2ebd]">
                Got Questions?
              </span>
              <span className="w-10 h-[2px] bg-[#ff6384]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Everything you need to know about setting up your restaurant digital menu.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#6c2ebd] shadow-md ring-2 ring-[#6c2ebd]/10"
                      : "border-purple-100 shadow-sm hover:border-[#ff6384]"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-[#6c2ebd] uppercase tracking-wider">
                        {faq.category}
                      </span>
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0 font-bold ${
                        isOpen
                          ? "bg-[#6c2ebd] text-white rotate-180"
                          : "bg-purple-50 text-[#6c2ebd]"
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-purple-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider variant="chevron" fillColor="#6c2ebd" />
      </section>

      {/* ========================================================= */}
      {/* 7. SECTION 7: CALL TO ACTION BANNER */}
      {/* ========================================================= */}
      <section className="relative py-20 pb-28 lg:py-24 lg:pb-36 bg-gradient-to-r from-[#6c2ebd] via-[#5b21b6] to-[#7c3aed] text-white text-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#ff98b4]">
            Start Free Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 mb-5 leading-tight">
            Ready to upgrade your restaurant dining?
          </h2>
          <p className="text-base sm:text-lg text-purple-100 max-w-2xl mx-auto mb-8 font-normal">
            Join forward-thinking restaurants and cafes cutting printing costs and delighting dining guests with contactless QR menus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-[#6c2ebd] hover:bg-[#ff6384] hover:text-white text-xs uppercase tracking-wider font-extrabold shadow-xl transition-all border-b-2 border-[#ff6384]"
            >
              Create Free Restaurant Menu →
            </Link>
            <button
              onClick={() => scrollTo("studio-demo")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-white hover:bg-white/10 border-2 border-white/50 text-xs uppercase tracking-wider font-bold transition-all"
            >
              Try Menu Studio Demo
            </button>
          </div>
        </div>

        {/* Section Divider */}
        <SectionDivider
          variant="slant-right"
          fillColor="#150a24"
          blackBorderColor="#0a0a0a"
          redBorderColor="#ff6384"
        />
      </section>

      {/* ========================================================= */}
      {/* 11. FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-[#150a24] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-md border border-purple-800/40 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="DigitalMenu Official Brand Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Digital<span className="text-[#ff6384]">Menu</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
                The premier contactless QR menu creation & management platform for Ethiopian and global dining establishments. Seamless table ordering, instant cloud synchronization, and elegant hospitality design.
              </p>
              <p className="text-xs text-[#ff98b4] font-semibold">
                Official Platform: <span className="text-slate-300">DigitalMenu™ Smart QR Dining</span>
              </p>
            </div>

            {/* Col 2: Quick Navigation */}
            <div>
              <h5 className="text-white text-xs font-black uppercase tracking-widest mb-4">
                Quick Navigation
              </h5>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollTo("how-it-works")} className="hover:text-white transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("studio-demo")} className="hover:text-white transition-colors">
                    Interactive Menu Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("features-section")} className="hover:text-white transition-colors">
                    Platform Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("pricing-section")} className="hover:text-white transition-colors">
                    Pricing & Plans
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Access */}
            <div>
              <h5 className="text-white text-xs font-black uppercase tracking-widest mb-4">
                Restaurant Portal
              </h5>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Owner Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/login?mode=register" className="hover:text-white transition-colors">
                    Create New Account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Restaurant Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollTo("faq-section")} className="hover:text-white transition-colors">
                    Support & FAQs
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>
              Copyright &copy; {new Date().getFullYear()} DigitalMenu. All rights reserved.
            </div>
            <div className="flex items-center gap-4 font-semibold">
              <span className="text-slate-400">Addis Ababa, Ethiopia</span>
              <span>•</span>
              <span className="text-[#ff98b4]">ETB Currency Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
