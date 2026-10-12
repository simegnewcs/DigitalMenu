"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import QRCode from "qrcode";

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
  _count?: { menuItems: number };
}

interface QRCodeData {
  id: string;
  code: string;
  qrImageUrl: string;
  tableNumber: number | null;
  isActive: boolean;
  menuUrl: string;
}

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
  qrPaymentRef?: string | null;
  qrPaymentPhone?: string | null;
  qrPaidAt?: string | null;
  categories: Category[];
  qrCodes: QRCodeData[];
}

export default function RestaurantManagePage() {
  const params = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "qr">("categories");

  // User auth & role state
  const [userRole, setUserRole] = useState<"ADMIN" | "OWNER">("OWNER");
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; name?: string } | null>(null);

  // Telebirr payment state
  const [telebirrForm, setTelebirrForm] = useState({
    transactionRef: "",
    phoneNumber: "",
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  // Menu item modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    isAvailable: true,
    isPopular: false,
  });

  // QR code modal state
  const [showQRModal, setShowQRModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [generatedQR, setGeneratedQR] = useState<QRCodeData | null>(null);

  const restaurantId = params.id as string;

  useEffect(() => {
    fetchRestaurant();

    // Fetch user session to determine role and keep in localStorage
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          const role = (session.user.role as "ADMIN" | "OWNER") || "OWNER";
          setUserRole(role);
          setCurrentUser(session.user);
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
            if (parsed.role) setUserRole(parsed.role);
            setCurrentUser(parsed);
          }
        } catch (e) {}
      });
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurant(data);
      } else {
        toast.error("Failed to load restaurant");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Telebirr payment confirmation handler
  const handleConfirmTelebirrPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telebirrForm.transactionRef.trim()) {
      toast.error("Please enter the Telebirr Transaction Reference Number");
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/pay-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telebirrForm),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Payment verified! QR code generation unlocked 🎉");
        setRestaurant((prev) =>
          prev
            ? {
                ...prev,
                isQrPaid: true,
                qrPaymentRef: telebirrForm.transactionRef,
                qrPaymentPhone: telebirrForm.phoneNumber || "0962935163",
              }
            : null
        );
        setTelebirrForm({ transactionRef: "", phoneNumber: "" });
        fetchRestaurant();
      } else {
        toast.error(data.error || "Failed to confirm payment");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const copyTelebirrPhone = () => {
    navigator.clipboard.writeText("0962935163");
    setCopiedPhone(true);
    toast.success("Telebirr number copied: 0962935163");
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Category handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...categoryForm, restaurantId }),
      });
      if (res.ok) {
        toast.success("Category created");
        setShowCategoryModal(false);
        setCategoryForm({ name: "", description: "" });
        fetchRestaurant();
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      if (res.ok) {
        toast.success("Category updated");
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm({ name: "", description: "" });
        fetchRestaurant();
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure? All items in this category will also be deleted."))
      return;
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted");
        fetchRestaurant();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Menu Item handlers
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price),
          categoryId: selectedCategoryId,
        }),
      });
      if (res.ok) {
        toast.success("Menu item created");
        setShowItemModal(false);
        setItemForm({
          name: "",
          description: "",
          price: "",
          image: "",
          isAvailable: true,
          isPopular: false,
        });
        fetchRestaurant();
      } else {
        toast.error("Failed to create item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/menu-items/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price),
        }),
      });
      if (res.ok) {
        toast.success("Menu item updated");
        setShowItemModal(false);
        setEditingItem(null);
        setItemForm({
          name: "",
          description: "",
          price: "",
          image: "",
          isAvailable: true,
          isPopular: false,
        });
        fetchRestaurant();
      } else {
        toast.error("Failed to update item");
      }
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Item deleted");
        fetchRestaurant();
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  // QR Code handlers
  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check payment rule: Owner must pay 1300 ETB, Admin is free
    if (userRole !== "ADMIN" && !restaurant?.isQrPaid) {
      toast.error("Payment required: Please pay 1,300 ETB via Telebirr (0962935163) first");
      return;
    }

    try {
      const res = await fetch("/api/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableNumber: tableNumber ? parseInt(tableNumber) : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQR(data);
        toast.success("QR code generated successfully!");
        fetchRestaurant();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to generate QR");
      }
    } catch (error) {
      toast.error("Failed to generate QR");
    }
  };

  const handleDeleteQR = async (qrId: string) => {
    if (!confirm("Delete this QR code?")) return;
    try {
      const res = await fetch(`/api/qr-codes/${qrId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("QR code deleted");
        fetchRestaurant();
      }
    } catch (error) {
      toast.error("Failed to delete QR");
    }
  };

  const downloadQR = (qrImageUrl: string, code: string) => {
    if (userRole !== "ADMIN" && !restaurant?.isQrPaid) {
      toast.error("Payment of 1,300 ETB via Telebirr (0962935163) required to download QR codes");
      return;
    }
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `qr-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-700">Restaurant not found</p>
          <Link href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canAccessQR = userRole === "ADMIN" || restaurant.isQrPaid;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-primary-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200"
                title="Return to Home Page"
              >
                <span>←</span>
                <span>Home</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-primary-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200"
              >
                <span>Dashboard</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>{restaurant.name}</span>
                  {userRole === "ADMIN" ? (
                    <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Admin Mode
                    </span>
                  ) : restaurant.isQrPaid ? (
                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      QR Paid
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      QR Unpaid
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-400">/{restaurant.slug}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/menu/${restaurant.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-2 rounded-lg transition-colors border border-primary-200"
              >
                <span>Preview Menu</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 space-x-8">
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "categories"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>📋 Menu & Categories</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {restaurant.categories.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "qr"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>📱 QR Codes & Downloads</span>
            {canAccessQR ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {userRole === "ADMIN" ? "Admin Free" : "Active"}
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                1300 ETB
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: MENU & CATEGORIES */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Menu Categories</h2>
                <p className="text-sm text-gray-500">
                  Organize your food, drinks, and specials into categories
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: "", description: "" });
                  setShowCategoryModal(true);
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition-all"
              >
                + Add Category
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-6">
              {restaurant.categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-5 bg-gray-50/60 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        {category.name}
                        <span className="text-xs font-normal text-gray-500 bg-white border px-2 py-0.5 rounded-full">
                          {category.menuItems.length} items
                        </span>
                      </h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setEditingItem(null);
                          setItemForm({
                            name: "",
                            description: "",
                            price: "",
                            image: "",
                            isAvailable: true,
                            isPopular: false,
                          });
                          setShowItemModal(true);
                        }}
                        className="bg-white hover:bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        + Add Item
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryForm({
                            name: category.name,
                            description: category.description || "",
                          });
                          setShowCategoryModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-900 p-1.5 text-xs font-medium rounded hover:bg-gray-200/60"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700 p-1.5 text-xs font-medium rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Category Items */}
                  <div className="divide-y divide-gray-100">
                    {category.menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xl font-bold">
                              🍽️
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {item.name}
                              </h4>
                              {item.isPopular && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                              {!item.isAvailable && (
                                <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <p className="text-xs font-bold text-primary-600 mt-1">
                              ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setSelectedCategoryId(category.id);
                              setItemForm({
                                name: item.name,
                                description: item.description || "",
                                price: String(item.price),
                                image: item.image || "",
                                isAvailable: item.isAvailable,
                                isPopular: item.isPopular,
                              });
                              setShowItemModal(true);
                            }}
                            className="text-gray-500 hover:text-gray-800 text-xs px-2.5 py-1 rounded border border-gray-200 hover:bg-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs px-2.5 py-1 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {category.menuItems.length === 0 && (
                      <div className="p-8 text-center text-xs text-gray-400">
                        No items in this category yet. Click &quot;+ Add Item&quot; to add dishes.
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {restaurant.categories.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-bold text-gray-900 text-base">
                    No categories created yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    Start by creating your first menu category (e.g., Appetizers, Main Courses, Drinks).
                  </p>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: "", description: "" });
                      setShowCategoryModal(true);
                    }}
                    className="mt-4 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700"
                  >
                    + Create First Category
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QR CODES & DOWNLOADS (PAYMENT GATE FOR BUSINESS OWNERS) */}
        {activeTab === "qr" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Restaurant QR Codes & Downloads
                </h2>
                <p className="text-sm text-gray-500">
                  Generate contactless QR codes for physical table stands and entrance displays
                </p>
              </div>

              {canAccessQR && (
                <button
                  onClick={() => {
                    setTableNumber("");
                    setGeneratedQR(null);
                    setShowQRModal(true);
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-primary-600/20 transition-all flex items-center gap-2"
                >
                  <span>+ Generate New QR Code</span>
                </button>
              )}
            </div>

            {/* ADMIN ACCESS BANNER */}
            {userRole === "ADMIN" && (
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20">
                    👑
                  </div>
                  <div>
                    <div className="font-bold text-amber-900 text-sm flex items-center gap-2">
                      Administrator Privileges
                      <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                        Free QR Generation & Instant Download
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-0.5">
                      You are logged in as System Admin. You can create menus, generate unlimited table QR codes, and download them without payment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS OWNER PAID BADGE */}
            {userRole !== "ADMIN" && restaurant.isQrPaid && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      Telebirr Payment Confirmed (1,300 ETB)
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        QR Codes Active
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your restaurant has completed payment. You can generate unlimited table QR codes and download high-resolution PNGs anytime.
                    </p>
                  </div>
                </div>
                {restaurant.qrPaymentRef && (
                  <span className="text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md font-mono">
                    Ref: {restaurant.qrPaymentRef}
                  </span>
                )}
              </div>
            )}

            {/* BUSINESS OWNER UNPAID - TELEBIRR PAYMENT UNLOCK CARD */}
            {userRole !== "ADMIN" && !restaurant.isQrPaid && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Telebirr header bar */}
                <div className="bg-gradient-to-r from-[#00A3E0] to-[#0072CE] p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#0072CE] font-black text-xl flex items-center justify-center shadow-lg">
                      tb
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-cyan-100 font-bold">
                        Telebirr Payment Required
                      </span>
                      <h3 className="text-2xl font-black tracking-tight">
                        Unlock QR Code Generation & Downloads
                      </h3>
                    </div>
                  </div>

                  <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                    <div className="text-xs text-cyan-100 uppercase tracking-wider font-semibold">
                      Activation Fee
                    </div>
                    <div className="text-2xl font-black text-white">
                      1,300 <span className="text-sm font-bold">ETB</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Step 1 & Instructions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                      <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <span>📲</span>
                        <span>Telebirr Payment Information</span>
                      </h4>
                      <div className="bg-white rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Transfer 1,300 ETB to Telebirr Number:
                          </p>
                          <p className="text-2xl font-black text-[#0072CE] tracking-wider mt-0.5 font-mono">
                            0962935163
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={copyTelebirrPhone}
                          className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0072CE] rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5"
                        >
                          {copiedPhone ? "✓ Copied" : "Copy Number"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        3 Simple Steps to Unlock:
                      </h4>
                      <ol className="space-y-2.5 text-xs text-gray-600">
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-cyan-100 text-[#0072CE] font-bold flex items-center justify-center shrink-0 text-[11px]">
                            1
                          </span>
                          <span>
                            Open your <strong>telebirr App</strong> or dial <strong>*127#</strong> on your phone.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-cyan-100 text-[#0072CE] font-bold flex items-center justify-center shrink-0 text-[11px]">
                            2
                          </span>
                          <span>
                            Send exactly <strong>1,300 ETB</strong> to Telebirr phone number: <strong>0962935163</strong>.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-cyan-100 text-[#0072CE] font-bold flex items-center justify-center shrink-0 text-[11px]">
                            3
                          </span>
                          <span>
                            Enter the <strong>Transaction Reference Number</strong> from your Telebirr SMS receipt below and click confirm.
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Confirmation Form */}
                  <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-200/80 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        Confirm Your Payment
                      </h4>
                      <p className="text-xs text-gray-500 mb-4">
                        Provide your payment details to immediately unlock QR generation and high-res downloads.
                      </p>

                      <form onSubmit={handleConfirmTelebirrPayment} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                            Telebirr Transaction Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. EB49201840 or 10-digit ID"
                            value={telebirrForm.transactionRef}
                            onChange={(e) =>
                              setTelebirrForm({ ...telebirrForm, transactionRef: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/30 focus:border-[#00A3E0] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                            Your Phone Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 09XXXXXXXX"
                            value={telebirrForm.phoneNumber}
                            onChange={(e) =>
                              setTelebirrForm({ ...telebirrForm, phoneNumber: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00A3E0]/30 focus:border-[#00A3E0]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingPayment}
                          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#00A3E0] to-[#0072CE] hover:from-[#0091C8] hover:to-[#0062B2] text-white font-bold rounded-xl shadow-lg shadow-cyan-600/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmittingPayment ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Verifying Payment...</span>
                            </>
                          ) : (
                            <span>Confirm Telebirr Payment (1,300 ETB)</span>
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200/60 text-center">
                      <p className="text-[11px] text-gray-400">
                        Need assistance? Telebirr support phone: <strong>0962935163</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR CODES LIST (UNLOCKED FOR ADMIN OR PAID OWNER) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.qrCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center mb-4 border border-gray-100">
                      <img
                        src={qr.qrImageUrl}
                        alt="QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-base">
                        {qr.tableNumber ? `Table #${qr.tableNumber}` : "Main / Entrance QR"}
                      </h4>
                      <span className="text-[11px] bg-gray-100 text-gray-600 font-mono px-2 py-0.5 rounded">
                        {qr.code.slice(-6)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Scans open: <span className="font-mono text-primary-600">/menu/{restaurant.slug}{qr.tableNumber ? `?table=${qr.tableNumber}` : ""}</span>
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => downloadQR(qr.qrImageUrl, qr.code)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        canAccessQR
                          ? "bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>⬇</span>
                      <span>Download PNG</span>
                    </button>
                    <button
                      onClick={() => handleDeleteQR(qr.id)}
                      className="px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {restaurant.qrCodes.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="font-bold text-gray-900 text-base">
                    No QR codes generated yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    {canAccessQR
                      ? "Generate unique QR codes for your restaurant entrance or specific tables."
                      : "Pay 1,300 ETB via Telebirr (0962935163) above to generate and download your custom QR codes."}
                  </p>
                  {canAccessQR && (
                    <button
                      onClick={() => {
                        setTableNumber("");
                        setGeneratedQR(null);
                        setShowQRModal(true);
                      }}
                      className="mt-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                    >
                      + Generate First QR Code
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Appetizers, Main Courses, Drinks"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Description <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Brief description of this section"
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-primary-600/20"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENU ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Margherita Pizza"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="12.99"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Ingredients, dietary notes, etc."
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Image URL <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-1">
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isAvailable}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, isAvailable: e.target.checked })
                      }
                      className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.isPopular}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, isPopular: e.target.checked })
                      }
                      className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span>Popular / Chef&apos;s Special</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-primary-600/20"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Generate Contactless QR Code
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Create a QR code for a specific dining table or a general menu.
            </p>

            {!generatedQR ? (
              <form onSubmit={handleGenerateQR}>
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Table Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Leave blank for general restaurant QR"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    If specified, guests scanning this QR will automatically see Table #{tableNumber} on their menu order header.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-primary-600/20"
                  >
                    Generate QR
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4 flex items-center justify-center">
                  <img
                    src={generatedQR.qrImageUrl}
                    alt="Generated QR"
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  {generatedQR.tableNumber
                    ? `Table #${generatedQR.tableNumber} QR Code`
                    : "General Menu QR Code"}
                </p>
                <p className="text-xs text-gray-400 font-mono mb-4 break-all">
                  {generatedQR.menuUrl}
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => downloadQR(generatedQR.qrImageUrl, generatedQR.code)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>⬇</span>
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedQR(null);
                      setTableNumber("");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Generate Another
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
