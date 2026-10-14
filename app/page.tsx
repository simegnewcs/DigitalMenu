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

interface GalleryDish {
  title: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");

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
    } catch (e) { }

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
          } catch (e) { }
        } else {
          if (!localStorage.getItem("digitalmenu_user")) {
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        }
      })
      .catch(() => { })
      .finally(() => {
        setAuthLoaded(true);
      });
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("digitalmenu_user");
      localStorage.clear();
    } catch (e) { }
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

  const galleryDishes: GalleryDish[] = [
    {
      title: "Gourmet Ribeye Steak",
      category: "main",
      price: "680 ETB",
      image: "/dish_steak.jpg",
      description: "Charred rosemary ribeye with roasted vine tomatoes & asparagus",
    },
    {
      title: "Authentic Doro Wat & Injera",
      category: "traditional",
      price: "450 ETB",
      image: "/dish_ethiopian.jpg",
      description: "Traditional spicy chicken stew, boiled egg, tibs, and freshly rolled injera",
    },
    {
      title: "Jebena Coffee & Tulip Latte",
      category: "beverages",
      price: "120 ETB",
      image: "/dish_coffee.jpg",
      description: "Clay pot roasted highland coffee ceremony paired with creamy latte art",
    },
    {
      title: "Artisan Brioche Burger",
      category: "main",
      price: "340 ETB",
      image: "/dish_burger.jpg",
      description: "Caramelized onions, aged melted cheddar, and crispy shoestring fries",
    },
  ];

  const filteredDishes =
    activeCategory === "all"
      ? galleryDishes
      : galleryDishes.filter((dish) => dish.category === activeCategory);

  const teamMembers: TeamMember[] = [
    {
      name: "Chef Seble Moges",
      role: "Culinary Director & Menu Curator",
      image: "/team_chef.jpg",
      bio: "15+ years fine dining menu development across luxury East African resorts.",
    },
    {
      name: "Marcus Vance",
      role: "Digital Menu Architect",
      image: "/team_architect.jpg",
      bio: "Creator of cloud-synced contactless dining technologies for 200+ restaurants.",
    },
    {
      name: "Helen Haile",
      role: "Guest Experience Lead",
      image: "/team_hospitality.jpg",
      bio: "Dedicated to smooth table turnaround and frictionless mobile customer journeys.",
    },
  ];

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
    <main className="min-h-screen bg-[#faf7fc] text-slate-800 selection:bg-[#ff98b4] selection:text-white font-serif">
      {/* ========================================================= */}
      {/* TOP ANNOUNCEMENT & CONTACT BAR (XTRA BEAUTY 2 STYLE) */}
      {/* ========================================================= */}
      <div className="bg-[#7f44c9] text-white/90 text-xs py-2 px-4 border-b border-[#9255e2]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs tracking-wider">
            <span>✨ Contactless QR Dining Solution for Restaurants, Cafes & Lounges</span>
            <span className="hidden md:inline text-[#ff98b4]">•</span>
            <span className="hidden md:inline"></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <span className="text-[#ff98b4]">📍</span> Addis Ababa, Ethiopia
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-[#ff98b4]">📞</span> +251940192676
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN NAVBAR (ELEGANT XTRA BEAUTY 2 CENTERING & PILL BUTTONS) */}
      {/* ========================================================= */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#ff98b4]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo with official logo image */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md shadow-[#7f44c9]/15 border border-[#ff98b4]/30 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="DigitalMenu Brand Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#7f44c9] leading-none">
                  Digital<span className="text-[#ff98b4]">Menu</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-sans mt-0.5">
                  Contactless Dining
                </span>
              </div>
            </Link>

            {/* Centered Desktop Navigation with active dot indicators */}
            <div className="hidden lg:flex items-center space-x-7">
              <Link
                href="/"
                className="relative py-1 text-sm font-bold text-[#7f44c9] transition-colors flex flex-col items-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff98b4] mb-1"></span>
                <span>Home</span>
              </Link>
              <button
                onClick={() => scrollTo("about-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollTo("services-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollTo("gallery-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                Culinary Gallery
              </button>
              <button
                onClick={() => scrollTo("pricing-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                Price List
              </button>
              <button
                onClick={() => scrollTo("team-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                Our Team
              </button>
              <button
                onClick={() => scrollTo("faq-section")}
                className="py-1 text-sm font-semibold text-slate-600 hover:text-[#7f44c9] transition-colors"
              >
                FAQ
              </button>
            </div>

            {/* Right Action: Pill Book / Account Button */}
            <div className="hidden sm:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#faf5ff] border border-[#ff98b4]/30 rounded-full text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#7f44c9] animate-pulse"></span>
                    <span className="font-semibold text-[#7f44c9] max-w-[130px] truncate">
                      {currentUser?.name || currentUser?.email}
                    </span>
                    {currentUser?.role && (
                      <span className="text-[9px] font-bold bg-[#ff98b4]/30 text-[#7f44c9] px-1.5 py-0.5 rounded-full uppercase">
                        {currentUser.role}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/dashboard"
                    className="bg-[#7f44c9] hover:bg-[#6b31b3] text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#7f44c9]/30 transition-all flex items-center gap-1.5 border-b-2 border-[#ff98b4]"
                  >
                    <span>Dashboard</span>
                    <span>→</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-rose-600 px-3 py-2 text-xs font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-600 hover:text-[#7f44c9] px-4 py-2 text-xs uppercase tracking-wider font-bold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="bg-[#7f44c9] hover:bg-[#ff98b4] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#7f44c9]/25 transition-all border-b-2 border-[#ff98b4] hover:border-[#7f44c9]"
                  >
                    Book / Add Menu
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-[#7f44c9] hover:bg-purple-50 transition-colors"
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#ff98b4]/20 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-[#7f44c9]"
            >
              Home
            </Link>
            <button
              onClick={() => scrollTo("about-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo("services-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              Services & Features
            </button>
            <button
              onClick={() => scrollTo("gallery-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              Culinary Gallery
            </button>
            <button
              onClick={() => scrollTo("pricing-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              Price List
            </button>
            <button
              onClick={() => scrollTo("team-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              Our Team
            </button>
            <button
              onClick={() => scrollTo("faq-section")}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#7f44c9]"
            >
              FAQ
            </button>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full text-center bg-[#7f44c9] text-white font-bold py-2.5 rounded-full text-sm shadow-md"
                  >
                    Go to Dashboard →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-sm font-semibold text-rose-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full text-center border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-full text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="w-full text-center bg-[#7f44c9] text-white font-bold py-2.5 rounded-full text-sm shadow-md"
                  >
                    Book / Add Menu
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================= */}
      {/* HERO SECTION (REV-SLIDER BEAUTY SALON 2 TYPOGRAPHY & LAYOUT) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-28 lg:pt-20 lg:pb-36 bg-gradient-to-b from-[#fff6f9] via-white to-[#faf5ff]">
        {/* Soft decorative background circles & SVG glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#ff98b4]/15 to-[#7f44c9]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Category Subtitle with signature Beauty Salon pink line */}
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-12 sm:w-16 h-[2px] bg-[#ff98b4]"></span>
                <span className="text-xl sm:text-2xl text-[#7f44c9] italic font-normal tracking-wide">
                  contactless dining
                </span>
                <span className="w-6 h-[2px] bg-[#ff98b4] lg:hidden"></span>
              </div>

              {/* Massive Signature Headline: "When You Look Good / Beauty Styles" */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#7f44c9] tracking-tight leading-[1.08] mb-6">
                <span className="text-3xl sm:text-4xl font-normal block text-slate-600 mb-1">
                  When Your Dining
                </span>
                <i className="italic font-normal">Looks Exquisite</i>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 font-serif">
                Replace expensive, sticky paper menus with smart smartphone QR menus. Update ETB prices in real time, customize dish categories, and delight your restaurant guests with instantaneous camera-to-table browsing.
              </p>

              {/* Signature Beauty Salon 2 Pill Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white bg-[#7f44c9] hover:bg-[#6b31b3] text-sm uppercase tracking-wider font-bold shadow-xl shadow-[#7f44c9]/30 transition-all border-b-4 border-[#ff98b4] transform hover:-translate-y-0.5"
                  >
                    <span>Open Dashboard</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?mode=register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white bg-[#7f44c9] hover:bg-[#6b31b3] text-sm uppercase tracking-wider font-bold shadow-xl shadow-[#7f44c9]/30 transition-all border-b-4 border-[#ff98b4] transform hover:-translate-y-0.5"
                  >
                    <span>Create Your Menu</span>
                    <span>→</span>
                  </Link>
                )}

                <button
                  onClick={() => scrollTo("gallery-section")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[#7f44c9] bg-white hover:bg-purple-50 border-b-4 border-[#ff98b4] shadow-md shadow-[#7f44c9]/10 text-sm uppercase tracking-wider font-bold transition-all"
                >
                  <span>View Our Gallery</span>
                </button>
              </div>

              {/* Highlights & Badges */}
              <div className="mt-10 pt-6 border-t border-purple-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff98b4]"></span>
                  <span>Zero App Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7f44c9]"></span>
                  <span>Instant ETB Price Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff98b4]"></span>
                  <span>A4 Vector QR Posters</span>
                </div>
              </div>
            </div>

            {/* Right Visual Frame: Dining Table with Wooden Stand & Phone Scan */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame with #ff98b4 accent */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-[#7f44c9] to-[#ff98b4] rounded-3xl opacity-30 blur-lg transform rotate-2"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="/hero_qr_dining.jpg"
                    alt="Contactless QR Dining Table Stand"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />

                  {/* Floating Beauty Salon Badges */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-[#ff98b4]/30 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 font-sans">Live Scan</p>
                      <p className="text-xs font-bold text-[#7f44c9]">0.2s Camera Speed</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-[#7f44c9]/95 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl border border-[#ff98b4]/40 flex items-center gap-2.5">
                    <span className="text-lg">⭐</span>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#ff98b4] font-sans">Rating</p>
                      <p className="text-xs font-bold text-white">4.9 / 5 Guest Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 End Clip Path Divider */}
        <SectionDivider variant="slant-right" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: ABOUT US ("_ about us _ / Your beauty is our duty") */}
      {/* ========================================================= */}
      <section
        id="about-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image with template offset frame */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative p-3 rounded-3xl bg-[#fff0f4] border-2 border-[#ff98b4]/30 shadow-lg">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="/dish_ethiopian.jpg"
                    alt="Authentic Culinary Dining Platter"
                    className="w-full h-auto object-cover hover:scale-102 transition-transform duration-500"
                  />
                </div>
                {/* Floating highlight quote */}
                <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-[#ff98b4]/40 max-w-xs">
                  <p className="text-xs italic text-slate-600">
                    &ldquo;DigitalMenu reduced our reprint costs to zero and our guests love browsing dish photos on their phones.&rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-[#7f44c9] mt-2 font-sans">
                    — Addis Ababa Lounge Manager
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
                <span className="text-2xl text-[#7f44c9] italic">about us</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Your guest experience <br />
                <span className="text-[#7f44c9]">is our passion</span>
              </h2>

              <p className="text-base text-slate-600 leading-relaxed mb-6">
                A digital restaurant menu is an interactive culinary catalog delivered directly to smartphone screens. Just as modern spas and salons elevated guest hospitality, DigitalMenu empowers dining establishments, hotels, and cafes to offer pristine, touchless, and visually stunning menus.
              </p>

              {/* Checklist with pink markers */}
              <div className="space-y-3.5 mb-8 text-sm text-slate-700 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff98b4]/30 text-[#7f44c9] flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </span>
                  <span>Instant Camera QR scan — no app installations or sign-ups</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff98b4]/30 text-[#7f44c9] flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </span>
                  <span>Real-time dish pricing and out-of-stock toggles in Ethiopian Birr</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ff98b4]/30 text-[#7f44c9] flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </span>
                  <span>High-resolution vector table tent & A4 poster generator</span>
                </div>
              </div>

              <button
                onClick={() => scrollTo("services-section")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white bg-[#7f44c9] hover:bg-[#ff98b4] text-xs uppercase tracking-wider font-bold shadow-md shadow-[#7f44c9]/20 transition-all border-b-2 border-[#ff98b4]"
              >
                <span>About Our Platform</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2 End Clip Path Divider */}
        <SectionDivider variant="slant-left" fillColor="#faf5ff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: SERVICES ("_ services _ / We are expert in") */}
      {/* ========================================================= */}
      <section
        id="services-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-[#faf5ff] scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
              <span className="text-2xl text-[#7f44c9] italic">services</span>
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
              We are expert in
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Transforming traditional restaurant dining through contactless digital intelligence.
            </p>
          </div>

          {/* EXACT BEAUTY SALON 2 3-COLUMN SERVICE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Column 1 (Left): 2 Services right-aligned on desktop */}
            <div className="lg:col-span-4 space-y-10 text-center lg:text-right">
              {/* Service 1 */}
              <div className="p-6 rounded-2xl bg-white border border-[#ff98b4]/20 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-2xl bg-[#fff0f4] text-[#7f44c9] flex items-center justify-center text-2xl mx-auto lg:ml-auto lg:mr-0 mb-4 group-hover:bg-[#7f44c9] group-hover:text-white transition-colors">
                  📱
                </div>
                <h3 className="text-2xl font-bold text-[#7f44c9] mb-2">
                  Contactless QR Menus
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-serif">
                  Diners aim their phone camera at the table code and the menu appears instantly. Zero app downloads, zero user friction.
                </p>
              </div>

              {/* Service 2 */}
              <div className="p-6 rounded-2xl bg-white border border-[#ff98b4]/20 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-2xl bg-[#fff0f4] text-[#7f44c9] flex items-center justify-center text-2xl mx-auto lg:ml-auto lg:mr-0 mb-4 group-hover:bg-[#7f44c9] group-hover:text-white transition-colors">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-[#7f44c9] mb-2">
                  Instant ETB Price Sync
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-serif">
                  Adjust ingredient price changes or mark dishes out-of-stock during peak dinner rush with a single tap in your dashboard.
                </p>
              </div>
            </div>

            {/* Column 2 (Center): The Signature Cutout Mockup */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative max-w-[320px] p-3 rounded-3xl bg-white border-2 border-[#ff98b4]/40 shadow-2xl hover:scale-105 transition-transform duration-500">
                <img
                  src="/phone_digital_menu.jpg"
                  alt="Digital Menu Smartphone App Display"
                  className="rounded-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#7f44c9] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg border-2 border-white whitespace-nowrap">
                  Live ETB Dishes & Ordering Tray
                </div>
              </div>
            </div>

            {/* Column 3 (Right): 2 Services left-aligned on desktop */}
            <div className="lg:col-span-4 space-y-10 text-center lg:text-left">
              {/* Service 3 */}
              <div className="p-6 rounded-2xl bg-white border border-[#ff98b4]/20 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-2xl bg-[#fff0f4] text-[#7f44c9] flex items-center justify-center text-2xl mx-auto lg:mr-auto lg:ml-0 mb-4 group-hover:bg-[#7f44c9] group-hover:text-white transition-colors">
                  🍲
                </div>
                <h3 className="text-2xl font-bold text-[#7f44c9] mb-2">
                  Categorized Catalogs
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-serif">
                  Group food into appetizers, chef specials, traditional combos, desserts, and cocktails with appetizing photos and dietary tags.
                </p>
              </div>

              {/* Service 4 */}
              <div className="p-6 rounded-2xl bg-white border border-[#ff98b4]/20 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 rounded-2xl bg-[#fff0f4] text-[#7f44c9] flex items-center justify-center text-2xl mx-auto lg:mr-auto lg:ml-0 mb-4 group-hover:bg-[#7f44c9] group-hover:text-white transition-colors">
                  🖨️
                </div>
                <h3 className="text-2xl font-bold text-[#7f44c9] mb-2">
                  Vector Print Posters
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-serif">
                  Generate print-ready A4 table posters and acrylic stands with customizable brand colors ready to laminate immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 End Clip Path Divider */}
        <SectionDivider variant="asymmetric" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: GALLERY ("_ gallery _ / Beauty moments of our salon") */}
      {/* ========================================================= */}
      <section
        id="gallery-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
              <span className="text-2xl text-[#7f44c9] italic">gallery</span>
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Culinary moments <br />
              <span className="text-[#7f44c9]">of our restaurants</span>
            </h2>
            <p className="mt-3 text-base text-slate-600">
              High-definition culinary photography that makes guests hungry before they take a seat.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2 rounded-full font-bold transition-all ${activeCategory === "all"
                  ? "bg-[#7f44c9] text-white shadow-md shadow-[#7f44c9]/25"
                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                  }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setActiveCategory("main")}
                className={`px-5 py-2 rounded-full font-bold transition-all ${activeCategory === "main"
                  ? "bg-[#7f44c9] text-white shadow-md shadow-[#7f44c9]/25"
                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                  }`}
              >
                Gourmet Mains
              </button>
              <button
                onClick={() => setActiveCategory("traditional")}
                className={`px-5 py-2 rounded-full font-bold transition-all ${activeCategory === "traditional"
                  ? "bg-[#7f44c9] text-white shadow-md shadow-[#7f44c9]/25"
                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                  }`}
              >
                Traditional Ethiopian
              </button>
              <button
                onClick={() => setActiveCategory("beverages")}
                className={`px-5 py-2 rounded-full font-bold transition-all ${activeCategory === "beverages"
                  ? "bg-[#7f44c9] text-white shadow-md shadow-[#7f44c9]/25"
                  : "bg-purple-50 text-slate-600 hover:bg-purple-100"
                  }`}
              >
                Coffee & Beverages
              </button>
            </div>
          </div>

          {/* 4-Item Responsive Culinary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden shadow-md bg-white border border-[#ff98b4]/20 transition-all hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Beauty Salon signature purple hover overlay */}
                  <div className="absolute inset-0 bg-[#7f44c9]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center text-white">
                    <span className="text-3xl mb-2">🔍</span>
                    <h4 className="font-bold text-lg leading-snug">{dish.title}</h4>
                    <p className="text-xs text-[#ff98b4] mt-1">{dish.description}</p>
                    <span className="mt-3 px-3.5 py-1 rounded-full bg-white text-[#7f44c9] text-xs font-bold">
                      {dish.price}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dish.title}</h4>
                    <p className="text-[11px] text-slate-400 capitalize">{dish.category}</p>
                  </div>
                  <span className="text-xs font-bold text-[#7f44c9] px-2.5 py-1 rounded-lg bg-[#faf5ff] border border-[#ff98b4]/30">
                    {dish.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Gallery CTA Button */}
          <div className="mt-12 text-center">
            <Link
              href="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white bg-[#7f44c9] hover:bg-[#ff98b4] text-xs uppercase tracking-wider font-bold shadow-md shadow-[#7f44c9]/25 transition-all border-b-2 border-[#ff98b4]"
            >
              <span>Publish Your Restaurant Dishes</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Section 4 End Clip Path Divider */}
        <SectionDivider variant="slant-left" fillColor="#faf5ff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: PRICING ("_ pricing _ / Best price list") */}
      {/* ========================================================= */}
      <section
        id="pricing-section"
        className="relative py-20 pb-36 lg:py-28 lg:pb-44 bg-[#faf5ff] scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Header & Dotted Price List */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
                <span className="text-2xl text-[#7f44c9] italic">pricing</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-8">
                Best price list <br />
                <span className="text-[#7f44c9]">for your restaurant</span>
              </h2>

              {/* EXACT CZ_PRICE_LIST DOTTED CONNECTOR COMPONENT */}
              <div className="space-y-6">
                {/* Item 1 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                      Starter Restaurant QR Plan
                    </h4>
                    <span className="flex-1 border-b-2 border-dotted border-purple-300 mx-2 mb-1.5"></span>
                    <span className="text-lg sm:text-xl font-bold text-[#7f44c9] shrink-0">
                      0 ETB / Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    Complete digital menu setup, QR code generation, and unlimited customer mobile scans.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                      Real-Time Cloud Price Sync
                    </h4>
                    <span className="flex-1 border-b-2 border-dotted border-purple-300 mx-2 mb-1.5"></span>
                    <span className="text-lg sm:text-xl font-bold text-[#7f44c9] shrink-0">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    Instant Hostinger MySQL cluster synchronization with zero downtime.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                      Print-Ready A4 Table Stand Poster Kit
                    </h4>
                    <span className="flex-1 border-b-2 border-dotted border-purple-300 mx-2 mb-1.5"></span>
                    <span className="text-lg sm:text-xl font-bold text-[#7f44c9] shrink-0">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    High-resolution vector printable table posters with custom background colors.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                      Multi-Branch & Dedicated Table Support
                    </h4>
                    <span className="flex-1 border-b-2 border-dotted border-purple-300 mx-2 mb-1.5"></span>
                    <span className="text-lg sm:text-xl font-bold text-[#7f44c9] shrink-0">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    Manage table 1 to table 100 with separate table-assigned ordering workflows.
                  </p>
                </div>

                {/* Item 5 */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                      Priority 24/7 Hospitality Support
                    </h4>
                    <span className="flex-1 border-b-2 border-dotted border-purple-300 mx-2 mb-1.5"></span>
                    <span className="text-lg sm:text-xl font-bold text-[#7f44c9] shrink-0">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    Live phone and WhatsApp support for menu onboarding and custom dish uploads.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Featured Pricing Card in Royal Purple */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#7f44c9] via-[#7435be] to-[#591e9f] text-white p-8 sm:p-10 rounded-3xl shadow-2xl border-4 border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#ff98b4] text-[#7f44c9] font-bold text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-xl font-sans">
                  Most Popular
                </div>

                <div className="text-center mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#ff98b4] font-sans">
                    Restaurant Pro
                  </span>
                  <div className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-black">1,300</span>
                    <span className="text-lg text-purple-200">ETB / month</span>
                  </div>
                  <p className="text-xs text-purple-200 mt-2 font-sans">
                    Everything you need to run high-volume contactless restaurant dining.
                  </p>
                </div>

                <div className="space-y-3 mb-8 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff98b4] font-bold text-base">✓</span>
                    <span>Unlimited Digital Menu Items & Photos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff98b4] font-bold text-base">✓</span>
                    <span>Unlimited Table QR Code Posters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff98b4] font-bold text-base">✓</span>
                    <span>Real-Time ETB Price & Stock Controls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff98b4] font-bold text-base">✓</span>
                    <span>Diner Digital Ordering Tray & Order Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff98b4] font-bold text-base">✓</span>
                    <span>Direct WhatsApp & Call Ordering</span>
                  </div>
                </div>

                <Link
                  href="/login?mode=register"
                  className="block w-full text-center bg-white text-[#7f44c9] hover:bg-[#ff98b4] hover:text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Start Free 14-Day Trial →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 End Clip Path Divider */}
        <SectionDivider variant="slant-right" fillColor="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: OUR TEAM ("_ our team _ / Where experience matters") */}
      {/* ========================================================= */}
      <section
        id="team-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
              <span className="text-2xl text-[#7f44c9] italic">our team</span>
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Where experience matters
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Passionate hospitality technologists and culinary curators dedicated to your restaurant success.
            </p>
          </div>

          {/* EXACT BEAUTY SALON 2 TEAM CARDS WITH PURPLE BG & PINK HOVER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-[#7f44c9] text-white rounded-[21px] p-6 pb-8 shadow-xl transition-all duration-300 hover:bg-[#ff98b4] hover:text-[#340074] group"
              >
                {/* Photo frame with thick white bottom border & pink bg */}
                <div className="bg-[#ff98b4] rounded-[20px] overflow-hidden border-b-[7px] border-white aspect-square relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Social links pills */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                    <span className="text-xs text-[#7f44c9] hover:text-[#ff98b4] cursor-pointer">Facebook</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-[#7f44c9] hover:text-[#ff98b4] cursor-pointer">Instagram</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-[#7f44c9] hover:text-[#ff98b4] cursor-pointer">LinkedIn</span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold tracking-tight">{member.name}</h3>
                  <p className="text-xs uppercase tracking-wider text-purple-200 group-hover:text-purple-900 font-sans mt-1">
                    {member.role}
                  </p>
                  <p className="text-xs text-white/80 group-hover:text-purple-900/80 font-serif mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6 End Clip Path Divider */}
        <SectionDivider variant="wave" fillColor="#faf5ff" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: FAQ ACCORDION ("_ questions _") */}
      {/* ========================================================= */}
      <section
        id="faq-section"
        className="relative py-20 pb-28 lg:py-28 lg:pb-36 bg-[#faf5ff] scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
              <span className="text-2xl text-[#7f44c9] italic">questions</span>
              <span className="w-10 h-[2px] bg-[#ff98b4]"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
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
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                    ? "border-[#7f44c9] shadow-md ring-2 ring-[#7f44c9]/10"
                    : "border-purple-100 shadow-sm hover:border-[#ff98b4]"
                    }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#fff0f4] text-[#7f44c9] uppercase tracking-wider font-sans">
                        {faq.category}
                      </span>
                      <span className="font-bold text-slate-900 text-base sm:text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0 ${isOpen
                        ? "bg-[#7f44c9] text-white rotate-180"
                        : "bg-purple-50 text-[#7f44c9]"
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

        {/* Section 7 End Clip Path Divider */}
        <SectionDivider variant="chevron" fillColor="#7f44c9" />
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: CALL TO ACTION BANNER */}
      {/* ========================================================= */}
      <section className="relative py-20 pb-28 lg:py-24 lg:pb-36 bg-gradient-to-r from-[#7f44c9] via-[#6e30b8] to-[#9255e2] text-white text-center overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#ff98b4] font-sans">
            Start Free Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-3 mb-5 leading-tight">
            Ready to upgrade your restaurant dining?
          </h2>
          <p className="text-base sm:text-lg text-purple-100 max-w-2xl mx-auto mb-8 font-serif">
            Join hundreds of forward-thinking restaurants and cafes cutting printing costs and delighting dining guests with contactless QR menus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?mode=register"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-[#7f44c9] hover:bg-[#ff98b4] hover:text-white text-xs uppercase tracking-wider font-bold shadow-xl transition-all border-b-2 border-[#ff98b4]"
            >
              Create Free Restaurant Menu →
            </Link>
            <button
              onClick={() => scrollTo("gallery-section")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-white hover:bg-white/10 border-2 border-white/50 text-xs uppercase tracking-wider font-bold transition-all"
            >
              View Sample Dishes
            </button>
          </div>
        </div>

        {/* Section 8 End Clip Path Divider */}
        <SectionDivider
          variant="slant-right"
          fillColor="#1c0f2b"
          blackBorderColor="#0a0a0a"
          redBorderColor="#ff2d55"
        />
      </section>

      {/* ========================================================= */}
      {/* FOOTER (DEEP LUXURY PURPLE PALETTE) */}
      {/* ========================================================= */}
      <footer className="bg-[#1c0f2b] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-md border border-purple-800/40 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="DigitalMenu Brand Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Digital<span className="text-[#ff98b4]">Menu</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
                The premier contactless QR menu management platform for Ethiopian and global dining establishments. Seamless ordering, instant cloud synchronization, and elegant hospitality design.
              </p>
              <p className="text-xs text-[#ff98b4]">
                Brand Identity: <span className="text-slate-300">DigitalMenu™ Contactless Platform</span>
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4 font-sans">
                Quick Navigation
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollTo("about-section")} className="hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("services-section")} className="hover:text-white transition-colors">
                    Services & Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("gallery-section")} className="hover:text-white transition-colors">
                    Culinary Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("pricing-section")} className="hover:text-white transition-colors">
                    Price List
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Access */}
            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-4 font-sans">
                Restaurant Portal
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/login?mode=register" className="hover:text-white transition-colors">
                    Create New Account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Owner Dashboard
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
              Copyright &copy; {new Date().getFullYear()} DigitalMenu | Designed with XTRA Beauty Salon 2 Aesthetic
            </div>
            <div className="flex items-center gap-4">
              <span>All rights reserved</span>
              <span>•</span>
              <span className="text-[#ff98b4]">ETB Currency Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
