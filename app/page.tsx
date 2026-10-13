"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    // 1. Immediately check localStorage
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
          // If server says no session, and localStorage was empty
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Top Dynamic Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-black text-primary-600 tracking-tight">
                  DigitalMenu
                </span>
              </Link>
            </div>

            {/* Dynamic Auth Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {isLoggedIn ? (
                <>
                  {/* Logged-In User Information */}
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold text-gray-800 max-w-[150px] truncate">
                      {currentUser?.name || currentUser?.email}
                    </span>
                    {currentUser?.role && (
                      <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    )}
                  </div>

                  {/* Direct Dashboard Link */}
                  <Link
                    href="/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Dashboard</span>
                    <span>→</span>
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Guest Links */}
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Modern Digital Menus</span>
            <span className="block text-primary-600">for Your Restaurant</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Replace paper menus with QR-based digital menus. Easy to manage,
            always up-to-date, and accessible from any smartphone.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center gap-3">
            {isLoggedIn ? (
              <div className="rounded-xl shadow-md">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg shadow-lg shadow-primary-600/25 transition-all"
                >
                  <span>Go to Dashboard</span>
                  <span>→</span>
                </Link>
              </div>
            ) : (
              <div className="rounded-xl shadow-md">
                <Link
                  href="/login?mode=register"
                  className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg shadow-lg shadow-primary-600/25 transition-all"
                >
                  Create Menu
                </Link>
              </div>
            )}
          
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    QR Code Generation
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Generate unique QR codes for your restaurant and tables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Easy Menu Management
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add, edit, and organize menu items with categories.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-primary-100 rounded-md flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mobile Responsive
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Menus look great on all devices - no app needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
