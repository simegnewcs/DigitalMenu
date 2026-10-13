"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  isActive: boolean;
  _count?: { categories: number; qrCodes: number };
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; email?: string; role?: string } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchRestaurants();
    // Keep user session in localStorage until logout
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          try {
            localStorage.setItem(
              "digitalmenu_user",
              JSON.stringify({
                ...session.user,
                isLoggedIn: true,
              })
            );
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("digitalmenu_user");
          if (stored) setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      });
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (error) {
      toast.error("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRestaurant),
      });

      if (res.ok) {
        toast.success("Restaurant created successfully");
        setShowCreateModal(false);
        setNewRestaurant({ name: "", address: "", phone: "", description: "" });
        fetchRestaurants();
      } else {
        toast.error("Failed to create restaurant");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("digitalmenu_user");
      localStorage.clear();
    } catch (e) {}
    await signOut({ callbackUrl: "/login" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Back Button to Home Page */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-2">
            {/* Left: Logo & Dashboard Badge */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <Link
                href="/"
                id="back-to-home-btn"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-primary-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all border border-gray-200 shadow-xs shrink-0"
                title="Return to Home Page"
              >
                <span>←</span>
                <span className="hidden sm:inline">Back to </span>
                <span>Home</span>
              </Link>

              <div className="h-5 w-px bg-gray-200 hidden sm:block shrink-0"></div>

              <Link
                href="/"
                className="flex items-center space-x-2 text-lg sm:text-2xl font-black text-slate-900 tracking-tight hover:opacity-90 transition-opacity shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="DigitalMenu"
                  width={34}
                  height={34}
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg"
                />
                <span className="hidden xs:inline sm:inline">
                  Digital<span className="text-primary-600">Menu</span>
                </span>
              </Link>

              <span className="text-[11px] sm:text-xs bg-primary-50 text-primary-700 font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-primary-200 hidden md:inline-block shrink-0">
                Dashboard
              </span>
            </div>

            {/* Right: User Chip + Add Restaurant + Logout */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {currentUser && (
                <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-gray-800 max-w-[140px] truncate">
                    {currentUser.name || currentUser.email}
                  </span>
                  {currentUser.role && (
                    <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span className="text-base leading-none">+</span>
                <span>Add Restaurant</span>
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-colors shrink-0"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb with Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs transition-colors"
            >
              <span>←</span>
              <span>Home Page</span>
            </Link>
            <span className="text-gray-300">/</span>
            <h2 className="text-xl font-bold text-gray-900">My Restaurants</h2>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No restaurants yet. Create your first restaurant!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md"
            >
              Create Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {restaurant.logo ? (
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-lg">
                          {restaurant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          restaurant.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {restaurant.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{restaurant.address}</p>

                  <div className="flex space-x-2 text-sm text-gray-600 mb-4">
                    <span>{restaurant._count?.categories || 0} categories</span>
                    <span>•</span>
                    <span>{restaurant._count?.qrCodes || 0} QR codes</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/restaurants/${restaurant.id}`}
                      className="flex-1 bg-primary-600 text-white text-center py-2 rounded-md text-sm hover:bg-primary-700"
                    >
                      Manage
                    </Link>
                    <Link
                      href={`/menu/${restaurant.slug}`}
                      target="_blank"
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-md text-sm hover:bg-gray-200"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Restaurant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Restaurant</h3>
            <form onSubmit={handleCreateRestaurant}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestaurant.name}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newRestaurant.address}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, address: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newRestaurant.phone}
                    onChange={(e) =>
                      setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
