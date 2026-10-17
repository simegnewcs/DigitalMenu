"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  categoryId?: string;
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

const COLOR_PRESETS = [
  { name: "Onyx Black", hex: "#0b120e" },
  { name: "Emerald Green", hex: "#047857" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Warm Amber", hex: "#D97706" },
  { name: "Navy Blue", hex: "#1E3A8A" },
  { name: "Royal Violet", hex: "#7C3AED" },
  { name: "Espresso Brown", hex: "#451A03" },
  { name: "Ruby Red", hex: "#DC2626" },
];

const DISH_IMAGE_PRESETS = [
  { name: "Shawarma", url: "/dishes/shawarma.jpg" },
  { name: "Roasted Chicken", url: "/dishes/roasted_chicken.jpg" },
  { name: "Chicken Kebab", url: "/dishes/kebab.jpg" },
  { name: "Burger", url: "/dish_burger.jpg" },
  { name: "Ribeye Steak", url: "/dish_steak.jpg" },
  { name: "Ethiopian Dish", url: "/dish_ethiopian.jpg" },
  { name: "Coffee / Drinks", url: "/dish_coffee.jpg" },
];

function isColorLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

function getDishThumbnail(item: { name: string; image?: string | null }) {
  if (item.image && item.image.trim().length > 0) return item.image;
  const n = item.name.toLowerCase();
  if (n.includes("shawarma")) return "/dishes/shawarma.jpg";
  if (n.includes("roast") || n.includes("chicken") || n.includes("wing")) return "/dishes/roasted_chicken.jpg";
  if (n.includes("kebab") || n.includes("grill")) return "/dishes/kebab.jpg";
  if (n.includes("burger")) return "/dish_burger.jpg";
  if (n.includes("steak") || n.includes("beef") || n.includes("meat")) return "/dish_steak.jpg";
  if (n.includes("coffee") || n.includes("tea") || n.includes("juice") || n.includes("drink")) return "/dish_coffee.jpg";
  if (n.includes("injera") || n.includes("doro") || n.includes("tibs") || n.includes("fasting")) return "/dish_ethiopian.jpg";
  return "/dishes/roasted_chicken.jpg";
}

export default function RestaurantManagePage() {
  const params = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"menu" | "qr" | "settings">("menu");

  // User auth & role state
  const [userRole, setUserRole] = useState<"ADMIN" | "OWNER">("OWNER");
  const [currentUser, setCurrentUser] = useState<{ id?: string; email?: string; name?: string } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<"all" | "available" | "popular">("all");
  const [copiedLink, setCopiedLink] = useState(false);

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
  const [qrBgColor, setQrBgColor] = useState<string>("#021c0e");

  // Restaurant settings state
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "category" | "item" | "qr" | "restaurant";
    id: string;
    name: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "item",
    id: "",
    name: "",
    title: "",
    message: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
        setSettingsForm({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          description: data.description || "",
        });
      } else {
        toast.error("Failed to load restaurant");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Quick Copy Public Menu Link
  const handleCopyMenuLink = () => {
    if (!restaurant) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://digitalmenu.devvoltz.com";
    const url = `${origin}/menu/${restaurant.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Public menu URL copied to clipboard!", { icon: "📋" });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Fast Toggle Item Availability
  const handleToggleItemAvailability = async (item: MenuItem, categoryId: string) => {
    const updatedStatus = !item.isAvailable;
    // Optimistic UI update
    setRestaurant((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        categories: prev.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            menuItems: cat.menuItems.map((m) =>
              m.id === item.id ? { ...m, isAvailable: updatedStatus } : m
            ),
          };
        }),
      };
    });

    try {
      const res = await fetch(`/api/menu-items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          isAvailable: updatedStatus,
          isPopular: item.isPopular,
        }),
      });

      if (res.ok) {
        toast.success(
          updatedStatus
            ? `"${item.name}" is now IN STOCK 🟢`
            : `"${item.name}" marked OUT OF STOCK 🔴`,
          { duration: 2500 }
        );
      } else {
        toast.error("Failed to update status on server");
        fetchRestaurant();
      }
    } catch (err) {
      toast.error("Network error while updating stock");
      fetchRestaurant();
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
        toast.success("Category created successfully! 🎉");
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

  // Delete Confirmation Handlers
  const confirmDeleteCategory = (category: Category) => {
    setDeleteModal({
      isOpen: true,
      type: "category",
      id: category.id,
      name: category.name,
      title: "Delete Category?",
      message: `Are you sure you want to delete "${category.name}"? All ${category.menuItems.length} dish(es) inside this section will also be permanently deleted.`,
    });
  };

  const confirmDeleteItem = (item: MenuItem) => {
    setDeleteModal({
      isOpen: true,
      type: "item",
      id: item.id,
      name: item.name,
      title: "Delete Dish?",
      message: `Are you sure you want to delete "${item.name}"? It will be removed from your digital menu immediately.`,
    });
  };

  const confirmDeleteQR = (qr: QRCodeData) => {
    setDeleteModal({
      isOpen: true,
      type: "qr",
      id: qr.id,
      name: qr.tableNumber ? `Table #${qr.tableNumber}` : "Main Entrance QR",
      title: "Delete QR Code?",
      message: `Are you sure you want to delete this table QR code? Any physical table stands using this code will no longer link to the menu.`,
    });
  };

  const confirmDeleteRestaurant = () => {
    if (!restaurant) return;
    setDeleteModal({
      isOpen: true,
      type: "restaurant",
      id: restaurant.id,
      name: restaurant.name,
      title: "Delete Entire Restaurant Menu?",
      message: `Are you sure you want to delete "${restaurant.name}"? All categories, dishes, and QR codes will be permanently erased. This action cannot be undone.`,
    });
  };

  const handleExecuteDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      if (deleteModal.type === "category") {
        const res = await fetch(`/api/categories/${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(`Category "${deleteModal.name}" deleted`);
          setDeleteModal((prev) => ({ ...prev, isOpen: false }));
          fetchRestaurant();
        } else {
          toast.error("Failed to delete category");
        }
      } else if (deleteModal.type === "item") {
        const res = await fetch(`/api/menu-items/${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(`Dish "${deleteModal.name}" deleted`);
          setDeleteModal((prev) => ({ ...prev, isOpen: false }));
          fetchRestaurant();
        } else {
          toast.error("Failed to delete dish");
        }
      } else if (deleteModal.type === "qr") {
        const res = await fetch(`/api/qr-codes/${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("QR code deleted");
          setDeleteModal((prev) => ({ ...prev, isOpen: false }));
          fetchRestaurant();
        } else {
          toast.error("Failed to delete QR code");
        }
      } else if (deleteModal.type === "restaurant") {
        const res = await fetch(`/api/restaurants/${deleteModal.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(`Restaurant "${deleteModal.name}" deleted successfully`);
          setDeleteModal((prev) => ({ ...prev, isOpen: false }));
          router.push("/dashboard");
        } else {
          toast.error("Failed to delete restaurant");
        }
      }
    } catch (error) {
      toast.error("An error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  // Menu Item handlers
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      toast.error("Please select a category for this dish");
      return;
    }
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
        toast.success("Dish added to menu! 🍽️");
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
        toast.error("Failed to create dish");
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
        toast.success("Dish updated successfully!");
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

  // QR Code handlers
  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();

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
        toast.success("QR code generated successfully! 🎉");
        fetchRestaurant();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to generate QR");
      }
    } catch (error) {
      toast.error("Failed to generate QR");
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

  const downloadA4Sheet = (
    qrImageUrl: string,
    code: string,
    tableNum?: number | null,
    bgColor = qrBgColor
  ) => {
    if (userRole !== "ADMIN" && !restaurant?.isQrPaid) {
      toast.error(
        "Payment of 1,300 ETB via Telebirr (0962935163) required to download QR codes"
      );
      return;
    }

    const canvas = document.createElement("canvas");
    const width = 1240;
    const height = 1754;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isLight = isColorLight(bgColor);
    const textColor = isLight ? "#0f172a" : "#ffffff";
    const subtextColor = isLight ? "#475569" : "#cbd5e1";
    const accentBorder = isLight
      ? "rgba(0, 0, 0, 0.08)"
      : "rgba(255, 255, 255, 0.16)";

    // 1. Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Borders
    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = accentBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 70, width - 140, height - 140);

    // 3. Header
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = textColor;
    ctx.font = "bold 64px Inter, system-ui, sans-serif";
    ctx.fillText(restaurant?.name || "Digital Menu", width / 2, 220);

    if (tableNum) {
      const badgeY = 320;
      ctx.fillStyle = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(width / 2 - 160, badgeY - 32, 320, 64, 32);
      } else {
        ctx.rect(width / 2 - 160, badgeY - 32, 320, 64);
      }
      ctx.fill();

      ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
      ctx.font = "bold 32px Inter, system-ui, sans-serif";
      ctx.fillText(`TABLE #${tableNum}`, width / 2, badgeY);
    } else {
      ctx.fillStyle = subtextColor;
      ctx.font = "600 32px Inter, system-ui, sans-serif";
      ctx.fillText("CONTACTLESS DINING MENU", width / 2, 310);
    }

    ctx.fillStyle = textColor;
    ctx.font = "800 48px Inter, system-ui, sans-serif";
    ctx.fillText("SCAN TO VIEW MENU", width / 2, 430);

    ctx.fillStyle = subtextColor;
    ctx.font = "400 26px Inter, system-ui, sans-serif";
    ctx.fillText("Point your camera at the QR code below", width / 2, 490);

    // 4. Center QR Card
    const cardSize = 640;
    const cardX = (width - cardSize) / 2;
    const cardY = 560;

    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardX, cardY, cardSize, cardSize, 36);
    } else {
      ctx.rect(cardX, cardY, cardSize, cardSize);
    }
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardX, cardY, cardSize, cardSize, 36);
    } else {
      ctx.rect(cardX, cardY, cardSize, cardSize);
    }
    ctx.stroke();

    // QR Image
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.onload = () => {
      const pad = 44;
      ctx.drawImage(qrImg, cardX + pad, cardY + pad, cardSize - pad * 2, cardSize - pad * 2);

      ctx.fillStyle = textColor;
      ctx.font = "bold 32px Inter, system-ui, sans-serif";
      ctx.fillText("NO APP DOWNLOAD REQUIRED", width / 2, cardY + cardSize + 110);

      ctx.fillStyle = subtextColor;
      ctx.font = "400 24px Inter, system-ui, sans-serif";
      ctx.fillText("Open Camera • Scan Code • Order From Table", width / 2, cardY + cardSize + 160);

      ctx.fillStyle = subtextColor;
      ctx.font = "500 22px Inter, system-ui, sans-serif";
      ctx.fillText("Powered by DigitalMenu™ Smart QR Dining", width / 2, height - 120);

      const link = document.createElement("a");
      const filename = tableNum
        ? `A4-QR-Table-${tableNum}-${restaurant?.slug || "menu"}.png`
        : `A4-QR-Main-${restaurant?.slug || "menu"}.png`;
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("A4 Printable Poster downloaded!");
    };
    qrImg.src = qrImageUrl;
  };

  // Save Restaurant Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });

      if (res.ok) {
        toast.success("Restaurant settings updated successfully! ✨");
        fetchRestaurant();
      } else {
        toast.error("Failed to update restaurant settings");
      }
    } catch (err) {
      toast.error("Network error while saving settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Compute Total Dishes and Average Price
  const { totalItems, averagePrice, filteredCategories } = useMemo(() => {
    if (!restaurant) {
      return { totalItems: 0, averagePrice: 0, filteredCategories: [] };
    }

    let count = 0;
    let totalPrice = 0;

    restaurant.categories.forEach((cat) => {
      cat.menuItems.forEach((item) => {
        count++;
        totalPrice += Number(item.price) || 0;
      });
    });

    const avg = count > 0 ? Math.round(totalPrice / count) : 0;

    // Filter categories and their items based on search and filters
    const query = searchQuery.trim().toLowerCase();
    const categoriesFiltered = restaurant.categories
      .filter((cat) => {
        if (selectedCategoryFilter === "ALL") return true;
        return cat.id === selectedCategoryFilter;
      })
      .map((cat) => {
        const filteredItems = cat.menuItems.filter((item) => {
          // Stock filter
          if (stockFilter === "available" && !item.isAvailable) return false;
          if (stockFilter === "popular" && !item.isPopular) return false;

          // Search query
          if (!query) return true;
          const matchName = item.name.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchPrice = item.price.toString().includes(query);
          return matchName || matchDesc || matchPrice;
        });

        return {
          ...cat,
          menuItems: filteredItems,
        };
      })
      // Hide categories that have 0 items when searching
      .filter((cat) => (query ? cat.menuItems.length > 0 : true));

    return {
      totalItems: count,
      averagePrice: avg,
      filteredCategories: categoriesFiltered,
    };
  }, [restaurant, searchQuery, selectedCategoryFilter, stockFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06150b] text-white">
        <div className="w-14 h-14 rounded-2xl bg-[#00E564]/10 border border-[#00E564]/40 flex items-center justify-center animate-spin mb-4">
          <span className="text-2xl">🍗</span>
        </div>
        <p className="text-sm font-bold text-emerald-300 tracking-wide uppercase">
          Loading Restaurant Menu Studio...
        </p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07170c] text-white p-4">
        <div className="text-center bg-[#0d2616] p-8 rounded-3xl border border-emerald-500/20 max-w-md w-full shadow-2xl">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-lg font-bold text-white mb-2">Restaurant Not Found</p>
          <p className="text-xs text-emerald-200/70 mb-6">
            The requested restaurant ID does not exist or you don&apos;t have permissions to edit it.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E564] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#00FF66] transition shadow-lg"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const canAccessQR = userRole === "ADMIN" || restaurant.isQrPaid;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans selection:bg-[#00E564] selection:text-black">
      {/* ========================================================= */}
      {/* 1. LUXURY TOP BRAND NAVBAR */}
      {/* ========================================================= */}
      <nav className="bg-[#021c0e] text-white border-b border-[#0e542f]/80 sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center gap-3">
            {/* Left Brand & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white bg-[#06331a] hover:bg-[#0b4827] px-3 py-2 rounded-xl border border-emerald-600/40 transition-all shrink-0 active:scale-95"
                title="Return to Dashboard"
              >
                <span>←</span>
                <span className="hidden sm:inline">All Restaurants</span>
                <span className="sm:hidden">Back</span>
              </Link>

              <div className="h-6 w-px bg-emerald-800/60 hidden sm:block shrink-0"></div>

              {/* Restaurant Name in Nav */}
              <div className="min-w-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E564] to-emerald-600 text-black flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                  🍗
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                      {restaurant.name}
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-[#00E564]/15 text-[#00E564] border border-[#00E564]/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E564] animate-pulse"></span>
                      Live Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 font-mono truncate hidden sm:block">
                    /menu/{restaurant.slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Copy Menu Link */}
              <button
                onClick={handleCopyMenuLink}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-[#06331a] hover:bg-[#0b4827] hover:text-white px-3 py-2 rounded-xl border border-emerald-700/50 transition-all cursor-pointer"
                title="Copy public menu link"
              >
                <span>{copiedLink ? "✓" : "📋"}</span>
                <span>{copiedLink ? "Link Copied!" : "Copy URL"}</span>
              </button>

              {/* View Live Customer Menu */}
              <Link
                href={`/menu/${restaurant.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#00E564] to-emerald-400 hover:from-[#00FF66] hover:to-emerald-300 text-black px-3.5 py-2 rounded-xl transition-all shadow-md shadow-[#00E564]/20 active:scale-95 shrink-0"
              >
                <span>👁️</span>
                <span className="hidden sm:inline">View Public</span>
                <span>Menu</span>
                <span>↗</span>
              </Link>

              {/* Delete Menu */}
              <button
                onClick={confirmDeleteRestaurant}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-600/80 bg-rose-950/40 px-2.5 py-2 rounded-xl transition-all border border-rose-800/40 shrink-0"
                title="Delete this restaurant menu"
              >
                <span>🗑️</span>
                <span className="hidden lg:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 2. RESTAURANT HERO SPOTLIGHT CARD */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-[#021c0e] via-[#052b17] to-[#f8faf9] pt-6 pb-10 border-b border-slate-200 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#042413]/90 backdrop-blur-xl border border-[#00E564]/20 rounded-3xl p-5 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* Restaurant Branding & Bio */}
              <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#06381d] border-2 border-[#00E564]/50 p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden group">
                  {restaurant.logo ? (
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#00E564] to-emerald-700 text-black flex items-center justify-center text-3xl font-black shadow-inner">
                      🍗
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                      {restaurant.name}
                    </h1>
                    {userRole === "ADMIN" ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black px-2.5 py-0.5 rounded-full shadow-sm">
                        👑 System Admin
                      </span>
                    ) : restaurant.isQrPaid ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#00E564] text-black px-2.5 py-0.5 rounded-full shadow-sm">
                        ✓ QR Paid Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/90 text-black px-2.5 py-0.5 rounded-full shadow-sm">
                        ⏳ QR Unpaid (1,300 ETB)
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      📍 {restaurant.address || "Addis Ababa, Ethiopia"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-1.5 max-w-2xl line-clamp-2 leading-relaxed">
                    {restaurant.description ||
                      "Live menu catalogue, contactless table ordering, and high-resolution printable QR code stands."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-emerald-300/80 mt-3 font-semibold flex-wrap">
                    <span className="flex items-center gap-1">
                      <span>📞</span>
                      <span>{restaurant.phone || "+251 940 192 676"}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-emerald-200">
                      <span>🌐</span>
                      <span>digitalmenu.devvoltz.com/menu/{restaurant.slug}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick KPI Stats Pill Card */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 bg-[#02180b] p-3 rounded-2xl border border-emerald-800/60">
                <div className="text-center px-2 py-1.5">
                  <div className="text-lg sm:text-2xl font-black text-white">
                    {restaurant.categories.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                    Categories
                  </div>
                </div>

                <div className="text-center px-2 py-1.5 border-x border-emerald-800/60">
                  <div className="text-lg sm:text-2xl font-black text-[#00E564]">
                    {totalItems}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                    Dishes
                  </div>
                </div>

                <div className="text-center px-2 py-1.5">
                  <div className="text-lg sm:text-2xl font-black text-amber-300">
                    {restaurant.qrCodes.length}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                    QR Stands
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT TABS */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 -mt-6">
        {/* Navigation Tab Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex items-center gap-1.5 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "menu"
                ? "bg-[#021c0e] text-[#00E564] shadow-md shadow-emerald-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>📋</span>
            <span>Menu & Dishes</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "menu"
                  ? "bg-[#06381d] text-[#00E564]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {totalItems}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "qr"
                ? "bg-[#021c0e] text-[#00E564] shadow-md shadow-emerald-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>📱</span>
            <span>QR Codes & Stands</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "qr"
                  ? "bg-[#06381d] text-[#00E564]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {restaurant.qrCodes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#021c0e] text-[#00E564] shadow-md shadow-emerald-950/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>⚙️</span>
            <span>Restaurant Profile</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: MENU & CATEGORIES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Control Bar: Search, Category Filter, and Primary Action Buttons */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search dishes by name, ingredients, or ETB price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter by Stock availability */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStockFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stockFilter === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({totalItems})
                </button>
                <button
                  onClick={() => setStockFilter("available")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stockFilter === "available"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  In Stock 🟢
                </button>
                <button
                  onClick={() => setStockFilter("popular")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stockFilter === "popular"
                      ? "bg-amber-500 text-black shadow-xs font-black"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  Popular ⭐
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "", description: "" });
                    setShowCategoryModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wider transition-all border border-slate-200 flex items-center gap-1.5 active:scale-95"
                >
                  <span>+ Add Category</span>
                </button>

                <button
                  onClick={() => {
                    if (restaurant.categories.length === 0) {
                      toast.error("Please create a category first!");
                      setShowCategoryModal(true);
                      return;
                    }
                    setSelectedCategoryId(restaurant.categories[0].id);
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>🍽️</span>
                  <span>+ New Dish</span>
                </button>
              </div>
            </div>

            {/* Category Quick Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategoryFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategoryFilter === "ALL"
                    ? "bg-[#021c0e] text-[#00E564] shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                All Sections ({restaurant.categories.length})
              </button>
              {restaurant.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategoryFilter === cat.id
                      ? "bg-[#021c0e] text-[#00E564] shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                    {cat.menuItems.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Categories & Dish Cards Grid */}
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0">
                          📁
                        </span>
                        <h2 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                          {category.name}
                        </h2>
                        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                          {category.menuItems.length} {category.menuItems.length === 1 ? "dish" : "dishes"}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-10.5">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
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
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
                      >
                        <span>+ Add Dish</span>
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
                        className="text-slate-600 hover:text-slate-900 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => confirmDeleteCategory(category)}
                        className="text-rose-600 hover:text-rose-700 px-3 py-1.5 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1"
                        title="Delete category"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Dishes Grid */}
                  <div className="p-5 sm:p-6">
                    {category.menuItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {category.menuItems.map((item) => {
                          const thumbnail = getDishThumbnail(item);
                          return (
                            <div
                              key={item.id}
                              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:shadow-lg ${
                                item.isAvailable
                                  ? "bg-white border-slate-200/90 hover:border-emerald-500/50"
                                  : "bg-slate-50/80 border-slate-200 opacity-75"
                              }`}
                            >
                              <div>
                                {/* Dish Image with Badges */}
                                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                                  <img
                                    src={thumbnail}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                                  {/* Top Badges */}
                                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                                    {item.isPopular && (
                                      <span className="text-[10px] bg-amber-400 text-black font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                                        ⭐ Popular Special
                                      </span>
                                    )}
                                  </div>

                                  {/* Fast Stock Toggle Button right on the image */}
                                  <div className="absolute top-2.5 right-2.5">
                                    <button
                                      onClick={() => handleToggleItemAvailability(item, category.id)}
                                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md transition-transform active:scale-90 cursor-pointer flex items-center gap-1 ${
                                        item.isAvailable
                                          ? "bg-[#00E564] text-black hover:bg-[#00FF66]"
                                          : "bg-rose-600 text-white hover:bg-rose-700"
                                      }`}
                                      title="Click to toggle In Stock / Sold Out"
                                    >
                                      <span>{item.isAvailable ? "🟢" : "🔴"}</span>
                                      <span>{item.isAvailable ? "In Stock" : "Sold Out"}</span>
                                    </button>
                                  </div>

                                  {/* Price Tag in Bottom Right of Image */}
                                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md text-[#00E564] border border-[#00E564]/40 font-black text-xs px-2.5 py-1 rounded-xl shadow-lg">
                                    ETB {Number(item.price).toFixed(2)}
                                  </div>
                                </div>

                                {/* Content info */}
                                <div className="p-4">
                                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                                    {item.name}
                                  </h3>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                    {item.description || "Authentic freshly prepared specialty dish with premium ingredients."}
                                  </p>
                                </div>
                              </div>

                              {/* Card Action Footer */}
                              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-extrabold text-slate-600">
                                    {item.isAvailable ? "Available" : "Unavailable"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
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
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDeleteItem(item)}
                                    className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                                    title="Delete dish"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="text-3xl mb-2">🍽️</div>
                        <p className="text-xs sm:text-sm font-bold text-slate-700">
                          No dishes found in {category.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Click &quot;+ Add Dish&quot; above to add your first menu item.
                        </p>
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
                          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          + Add Dish to {category.name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center shadow-xs">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {searchQuery ? "No dishes match your search" : "No menu categories created yet"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? `Try clearing your search term "${searchQuery}" or switching the filter.`
                      : "Start building your digital menu by creating your first category (e.g., Main Courses, Fast Food, Drinks)."}
                  </p>
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider"
                    >
                      Clear Search Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryForm({ name: "", description: "" });
                        setShowCategoryModal(true);
                      }}
                      className="mt-4 px-5 py-2.5 bg-[#021c0e] hover:bg-[#06381d] text-[#00E564] border border-[#00E564]/40 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg transition"
                    >
                      + Create First Category
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: QR CODES & DOWNLOADS (PAYMENT GATE & MOCKUP CARDS) */}
        {/* ========================================================= */}
        {activeTab === "qr" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Restaurant QR Codes & Table Stands
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Generate contactless QR codes for physical table stands, tent cards, and entrance posters.
                </p>
              </div>

              {canAccessQR && (
                <button
                  onClick={() => {
                    setTableNumber("");
                    setGeneratedQR(null);
                    setShowQRModal(true);
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer shrink-0"
                >
                  <span>📱</span>
                  <span>+ Generate New QR Code</span>
                </button>
              )}
            </div>

            {/* ADMIN ACCESS BANNER */}
            {userRole === "ADMIN" && (
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-xl shadow-md">
                    👑
                  </div>
                  <div>
                    <div className="font-extrabold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                      Administrator Privileges Active
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black uppercase">
                        Free Unlimited Access
                      </span>
                    </div>
                    <p className="text-xs text-amber-800/80 mt-0.5">
                      You are logged in as System Admin. You can create menus, generate unlimited table QR codes, and download high-resolution A4 posters without payment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS OWNER PAID BADGE */}
            {userRole !== "ADMIN" && restaurant.isQrPaid && (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#00E564] text-black flex items-center justify-center font-black text-xl shadow-md">
                    ✓
                  </div>
                  <div>
                    <div className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
                      Telebirr Payment Confirmed (1,300 ETB)
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-black uppercase">
                        QR Codes Active
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Your restaurant has completed payment. You can generate unlimited table QR codes and download high-resolution PNGs anytime.
                    </p>
                  </div>
                </div>
                {restaurant.qrPaymentRef && (
                  <span className="text-xs text-emerald-900 bg-emerald-200/80 px-3 py-1.5 rounded-xl font-mono font-bold">
                    Ref: {restaurant.qrPaymentRef}
                  </span>
                )}
              </div>
            )}

            {/* BUSINESS OWNER UNPAID - TELEBIRR PAYMENT UNLOCK CARD */}
            {userRole !== "ADMIN" && !restaurant.isQrPaid && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
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

            {/* QR CODES LIST (CARDS WITH TABLE STAND MOCKUPS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.qrCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* QR Preview Box with Realistic Card Framing */}
                    <div className="bg-gradient-to-b from-[#021c0e] to-[#052b17] rounded-2xl p-5 flex flex-col items-center justify-center mb-4 border border-emerald-900/50 shadow-inner text-white relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[10px] font-black tracking-widest text-[#00E564] uppercase opacity-75">
                        {restaurant.name}
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-white/20 mt-4 mb-2">
                        <img
                          src={qr.qrImageUrl}
                          alt="QR Code"
                          className="w-40 h-40 object-contain"
                        />
                      </div>

                      <div className="text-center mt-1">
                        <span className="inline-block bg-white/10 text-emerald-300 font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider">
                          {qr.tableNumber ? `Table #${qr.tableNumber}` : "Main Entrance QR"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {qr.tableNumber ? `Table #${qr.tableNumber}` : "Main Entrance QR"}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md">
                        {qr.code.slice(-6)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 font-mono truncate">
                      Scans open: <span className="text-emerald-700 font-bold">/menu/{restaurant.slug}{qr.tableNumber ? `?table=${qr.tableNumber}` : ""}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => downloadQR(qr.qrImageUrl, qr.code)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAccessQR
                          ? "bg-[#021c0e] hover:bg-[#06381d] text-[#00E564] border border-[#00E564]/30 shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>⬇</span>
                      <span>QR PNG</span>
                    </button>

                    <button
                      onClick={() => downloadA4Sheet(qr.qrImageUrl, qr.code, qr.tableNumber, qrBgColor)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        canAccessQR
                          ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                      title="Download A4 Stand Poster"
                    >
                      <span>📄</span>
                      <span>A4 Poster</span>
                    </button>

                    <button
                      onClick={() => confirmDeleteQR(qr)}
                      className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Delete QR code"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {restaurant.qrCodes.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center shadow-xs">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="font-black text-slate-900 text-lg">
                    No Table QR Codes Generated Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    {canAccessQR
                      ? "Generate unique QR codes for your restaurant entrance or specific numbered tables."
                      : "Pay 1,300 ETB via Telebirr (0962935163) above to generate and download your custom table stands."}
                  </p>
                  {canAccessQR && (
                    <button
                      onClick={() => {
                        setTableNumber("");
                        setGeneratedQR(null);
                        setShowQRModal(true);
                      }}
                      className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                    >
                      + Generate First QR Code
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RESTAURANT PROFILE & DETAILS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center">
                ⚙️
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Restaurant Settings</h2>
                <p className="text-xs text-slate-500">
                  Update public contact details, physical address, and menu description.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Restaurant Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Physical Address / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5Kilo, Addis Ababa, Ethiopia"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +251 940 192 676"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  About & Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Brief description of your restaurant cuisine, dining atmosphere, and hours."
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Slug: <span className="font-mono text-slate-600 font-bold">/{restaurant.slug}</span>
                </p>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. MODALS (CATEGORY, ITEM, QR, DELETE CONFIRMATION) */}
      {/* ========================================================= */}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingCategory ? "Edit Category" : "Add Menu Category"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicken / Main, Combos, Desserts, Drinks"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this food category"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              <div className="mt-6 flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-700/25 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {editingItem ? "Edit Menu Dish" : "Add New Dish"}
              </h3>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
              {/* Category Select */}
              {!editingItem && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category Section <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                  >
                    {restaurant.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.menuItems.length} items)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dish Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Chicken Shawarma"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              {/* Price (ETB) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Price in Ethiopian Birr (ETB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-black text-slate-500">
                    ETB
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="670.00"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, seasonings, sides included (e.g. served with pita and fries)"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />
              </div>

              {/* Image URL & Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dish Photo URL <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/dish.jpg or select preset below"
                  value={itemForm.image}
                  onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                />

                {/* Quick Presets */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                  {DISH_IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, image: p.url })}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition ${
                        itemForm.image === p.url
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>🟢 Available (In Stock)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isPopular}
                    onChange={(e) => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4"
                  />
                  <span>⭐ Popular / Chef Special</span>
                </label>
              </div>

              <div className="mt-6 flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-700/25 cursor-pointer"
                >
                  {editingItem ? "Save Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black text-slate-900">
                Generate Table Stand QR Code
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowQRModal(false);
                  setGeneratedQR(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Select your poster background color below to generate an A4 printable table stand with centered QR code.
            </p>

            {/* COLOR PALETTE */}
            <div className="mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>🎨</span>
                  <span>Poster Color Theme</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  {qrBgColor}
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    title={color.name}
                    onClick={() => setQrBgColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center shadow-xs ${
                      qrBgColor.toLowerCase() === color.hex.toLowerCase()
                        ? "border-[#00E564] ring-2 ring-[#00E564]/40 scale-110"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {qrBgColor.toLowerCase() === color.hex.toLowerCase() && (
                      <span
                        className={`text-[10px] font-black ${
                          isColorLight(color.hex) ? "text-slate-900" : "text-white"
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}

                {/* Custom Color Dot */}
                <label
                  title="Choose custom color"
                  className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 hover:border-[#00E564] flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden bg-white"
                >
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-xs">🎨</span>
                </label>
              </div>
            </div>

            {!generatedQR ? (
              <form onSubmit={handleGenerateQR}>
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Table Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Leave blank for general entrance QR"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00E564]/30 focus:border-[#00E564] focus:bg-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    If specified, guests scanning this code will automatically have Table #{tableNumber} pinned on their order header.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-700/25 cursor-pointer"
                  >
                    Generate QR Code
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                {/* LIVE A4 PRINTABLE SHEET PREVIEW */}
                <div className="flex justify-center mb-5">
                  <div
                    style={{ backgroundColor: qrBgColor }}
                    className="w-64 aspect-[210/297] rounded-2xl shadow-2xl p-4 flex flex-col justify-between items-center text-center relative border border-black/10 transition-colors duration-300 overflow-hidden"
                  >
                    <div
                      style={{
                        borderColor: isColorLight(qrBgColor)
                          ? "rgba(0,0,0,0.08)"
                          : "rgba(255,255,255,0.18)",
                      }}
                      className="absolute inset-2 rounded-xl border pointer-events-none"
                    ></div>

                    <div className="mt-2 z-10">
                      <div
                        style={{ color: isColorLight(qrBgColor) ? "#0f172a" : "#ffffff" }}
                        className="font-black text-sm tracking-tight truncate max-w-[180px]"
                      >
                        {restaurant.name}
                      </div>
                      <div
                        style={{
                          backgroundColor: isColorLight(qrBgColor)
                            ? "#e2e8f0"
                            : "rgba(255,255,255,0.2)",
                          color: isColorLight(qrBgColor) ? "#0f172a" : "#ffffff",
                        }}
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 tracking-wider"
                      >
                        {tableNumber ? `TABLE #${tableNumber}` : "DINE-IN MENU"}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl shadow-lg border border-white/20 z-10">
                      <img
                        src={generatedQR.qrImageUrl}
                        alt="QR Code"
                        className="w-28 h-28 object-contain"
                      />
                    </div>

                    <div className="mb-2 z-10">
                      <div
                        style={{ color: isColorLight(qrBgColor) ? "#0f172a" : "#ffffff" }}
                        className="text-[10px] font-black uppercase tracking-wider"
                      >
                        SCAN TO VIEW MENU
                      </div>
                      <div
                        style={{ color: isColorLight(qrBgColor) ? "#64748b" : "#94a3b8" }}
                        className="text-[8px] font-bold"
                      >
                        Open Camera • Point at Code
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadQR(generatedQR.qrImageUrl, generatedQR.code)}
                    className="flex-1 py-3 bg-[#021c0e] hover:bg-[#06381d] text-[#00E564] border border-[#00E564]/40 font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                  >
                    ⬇️ Download PNG
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadA4Sheet(
                        generatedQR.qrImageUrl,
                        generatedQR.code,
                        generatedQR.tableNumber,
                        qrBgColor
                      )
                    }
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-700/25"
                  >
                    📄 Download A4 Poster
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowQRModal(false);
                    setGeneratedQR(null);
                  }}
                  className="w-full mt-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        itemName={deleteModal.name}
        message={deleteModal.message}
        isDeleting={isDeleting}
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
