"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  accentColor: string;
  borderActive: string;
  cardBg: string;
  features: string[];
  recommended?: boolean;
}

export const PRICING_PACKAGES: PricingPlan[] = [
  {
    id: "FREE",
    name: "Free",
    tagline: "Get Started",
    price: "ETB 0",
    period: "forever",
    description: "For small businesses testing digital menus.",
    badge: "Free Trial",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    accentColor: "from-slate-500 to-slate-700",
    borderActive: "border-slate-800 ring-2 ring-slate-800/20",
    cardBg: "bg-white",
    features: [
      "1 business · 1 digital menu",
      "Up to 20 menu items",
      "QR code generation & download",
      "Mobile-friendly menu page",
      "Basic menu themes & images",
      "Basic availability toggle",
      "DEVVOLTZ platform branding",
      "Basic view counter",
    ],
    recommended: false,
  },
  {
    id: "STARTER",
    name: "Starter",
    tagline: "Individual Venues",
    price: "ETB 499",
    period: "/ month",
    description: "Per month · For individual restaurants and cafés.",
    badge: "Popular for Cafés",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    accentColor: "from-sky-600 to-blue-600",
    borderActive: "border-sky-600 ring-2 ring-sky-600/30",
    cardBg: "bg-white",
    features: [
      "1 business · Up to 3 menus",
      "Up to 100 menu items per business",
      "Custom logo, colors, and cover image",
      "10+ professional menu templates",
      "Unlimited QR scans (fair-use)",
      "Mark items as sold out instantly",
      "Hide DEVVOLTZ branding",
      "Shareable direct menu link",
    ],
    recommended: false,
  },
  {
    id: "POPULAR",
    name: "Popular",
    tagline: "Growth & Established",
    price: "ETB 999",
    period: "/ month",
    description: "For established restaurants, hotels, and growing businesses.",
    badge: "Recommended",
    badgeColor: "bg-pink-500 text-white border-pink-400 shadow-sm",
    accentColor: "from-purple-600 to-indigo-700",
    borderActive: "border-purple-600 ring-2 ring-purple-600/40",
    cardBg: "bg-gradient-to-b from-purple-50/70 via-white to-white",
    features: [
      "Everything in Starter",
      "Up to 10 menus",
      "Up to 500 menu items",
      "Separate Breakfast, Lunch & Dinner menus",
      "Schedule menus by day or time",
      "Advanced sales & popular-item reports",
      "Downloadable print PDF menu",
      "Priority customer support",
    ],
    recommended: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    tagline: "Enterprise & Chains",
    price: "ETB 1,999",
    period: "/ month",
    description: "For restaurant chains, franchises, and large F&B operators.",
    badge: "Enterprise",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    accentColor: "from-amber-600 to-orange-600",
    borderActive: "border-amber-600 ring-2 ring-amber-600/30",
    cardBg: "bg-white",
    features: [
      "Everything in Popular",
      "Unlimited menus & unlimited items",
      "Multi-location central control",
      "Franchise & multiple manager logins",
      "Custom domain support (menu.yourbrand.com)",
      "API & POS system integrations",
      "Dedicated account manager & 24/7 support",
    ],
    recommended: false,
  },
];

interface CreateMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdRestaurant: any) => void;
}

export default function CreateMenuModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMenuModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("POPULAR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
  });

  // Reset step whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const currentPlan =
    PRICING_PACKAGES.find((p) => p.id === selectedPlanId) ||
    PRICING_PACKAGES[2];

  const handlePlanSelectAndContinue = (planId: string) => {
    setSelectedPlanId(planId);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a name for your menu/restaurant");
      return;
    }

    setIsSubmitting(true);
    try {
      // Append package metadata cleanly to description if not provided
      const packageNote = `[Plan: ${currentPlan.name} - ${currentPlan.price}${
        currentPlan.period ? " " + currentPlan.period : ""
      }]`;
      const enrichedDescription = form.description.trim()
        ? `${form.description.trim()}\n\n${packageNote}`
        : packageNote;

      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim() || null,
          phone: form.phone.trim() || null,
          description: enrichedDescription,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        toast.success(`Menu "${created.name}" created on ${currentPlan.name} plan!`);
        setForm({ name: "", address: "", phone: "", description: "" });
        onSuccess(created);
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create menu");
      }
    } catch (error) {
      toast.error("Error creating menu. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className={`bg-white rounded-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[94dvh] sm:max-h-[90vh] transition-all duration-300 overflow-hidden my-auto ${
          step === 1 ? "max-w-5xl" : "max-w-lg"
        }`}
      >
        {/* Header with Step Progress */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6c2ebd] flex items-center justify-center text-lg shrink-0 font-bold border border-purple-100 shadow-xs">
              {step === 1 ? "💎" : "📋"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#6c2ebd]">
                  Step {step} of 2
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  {step === 1 ? "Select Package" : "Menu Information"}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                {step === 1
                  ? "Choose Your Menu Package"
                  : "Enter Menu Details"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 flex items-center justify-center text-sm font-bold transition shrink-0 ml-2 disabled:opacity-50"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ============================================================ */}
        {/* STEP 1: PRICING PACKAGE SELECTION */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Subheader Notice */}
            <div className="px-5 py-3 sm:px-7 bg-purple-50/50 border-b border-purple-100/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="font-bold text-[#6c2ebd]">💡 Capacity-Based:</span>
                <span>Select which plan fits your dining capacity. You can upgrade anytime.</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Ethiopia Launch Pricing</span>
            </div>

            {/* Scrollable Packages Grid */}
            <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
                {PRICING_PACKAGES.map((pkg) => {
                  const isSelected = selectedPlanId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPlanId(pkg.id)}
                      className={`rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between border-2 transition-all cursor-pointer relative ${
                        pkg.cardBg
                      } ${
                        isSelected
                          ? pkg.borderActive + " shadow-xl scale-[1.01]"
                          : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 truncate">
                          {pkg.tagline}
                        </span>
                        {pkg.badge && (
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${pkg.badgeColor}`}
                          >
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      {/* Plan Name & Price */}
                      <div>
                        <h4 className="text-lg font-black text-slate-900 mb-0.5">
                          {pkg.name}
                        </h4>
                        <div className="flex items-baseline gap-1 my-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {pkg.price}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {pkg.period}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>

                        {/* Features list */}
                        <div className="space-y-1.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 mb-3">
                          {pkg.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-black shrink-0">✓</span>
                              <span className="leading-snug">{f}</span>
                            </div>
                          ))}
                          {pkg.features.length > 4 && (
                            <div className="text-[10px] font-bold text-[#6c2ebd] pt-0.5">
                              + {pkg.features.length - 4} more features
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Direct action button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlanSelectAndContinue(pkg.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 ${
                          isSelected
                            ? "bg-[#6c2ebd] hover:bg-[#581c87] text-white shadow-md shadow-[#6c2ebd]/25"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <span>{isSelected ? "Selected" : "Select"}</span>
                        <span>→</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="px-5 py-4 sm:px-7 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Selected Plan:</span>
                <span className="text-sm font-black text-slate-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl text-[#6c2ebd]">
                  {currentPlan.name} ({currentPlan.price} {currentPlan.period})
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-[#6c2ebd] hover:bg-[#581c87] active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#6c2ebd]/25 transition flex items-center justify-center gap-2"
                >
                  <span>Continue with {currentPlan.name}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: MENU INFORMATION FORM */}
        {/* ============================================================ */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1 overscroll-contain">
              {/* Selected Plan Summary Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">✨</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-900">
                        {currentPlan.name} Plan
                      </span>
                      <span className="text-[11px] font-bold text-[#6c2ebd] bg-white px-2 py-0.5 rounded-md border border-purple-200 font-mono">
                        {currentPlan.price} {currentPlan.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentPlan.features[1]} · {currentPlan.features[0]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#6c2ebd] hover:text-[#581c87] bg-white hover:bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-200 transition shrink-0"
                >
                  Change Plan
                </button>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Menu / Restaurant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Addis Gourmet Burger Menu"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6c2ebd]/20 focus:border-[#6c2ebd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Physical Address{" "}
                  <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bole Road, Behind Edna Mall, Addis Ababa"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6c2ebd]/20 focus:border-[#6c2ebd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number{" "}
                  <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0911234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6c2ebd]/20 focus:border-[#6c2ebd] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Cuisine{" "}
                  <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Authentic Ethiopian cuisine & modern continental breakfast"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6c2ebd]/20 focus:border-[#6c2ebd] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="px-5 py-4 sm:px-7 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase transition flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Change Package</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#6c2ebd] to-indigo-600 hover:from-[#581c87] hover:to-indigo-700 active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#6c2ebd]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Creating Menu...</span>
                  </>
                ) : (
                  <>
                    <span>Create Menu ({currentPlan.name})</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
