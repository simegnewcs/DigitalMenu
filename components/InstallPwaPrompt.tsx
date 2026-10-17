"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPwaPrompt({
  restaurantName = "DigitalMenu",
  variant = "banner",
  className,
}: {
  restaurantName?: string;
  variant?: "banner" | "button" | "modal";
  className?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check if already installed / running as PWA standalone mode
    const checkStandalone = () => {
      const isWindowStandalone = window.matchMedia("(display-mode: standalone)").matches;
      // @ts-expect-error iOS Safari navigator.standalone check
      const isSafariStandalone = window.navigator.standalone === true;
      return isWindowStandalone || isSafariStandalone;
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if previously dismissed in this session
    try {
      const dismissed = sessionStorage.getItem("digitalmenu_pwa_dismissed");
      if (dismissed) setIsDismissed(true);
    } catch (e) {}

    // 3. Android / Chromium beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Device & Browser Detection (iOS Safari or mobile devices)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);

    if (isIosDevice) {
      setIsIOS(true);
    }

    if (isMobile) {
      setIsInstallable(true);
    }

    // 5. App Installed event listener
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // If native browser prompt is not buffered yet or not supported, show guide
      setShowIosGuide(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsStandalone(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt error:", err);
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("digitalmenu_pwa_dismissed", "true");
    } catch (e) {}
  };

  // If already running inside installed PWA, do not render prompt
  if (isStandalone) return null;

  // The Modal content that portals to <body>
  const modalContent = showIosGuide && mounted ? (
    <div
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={() => setShowIosGuide(false)}
    >
      <div
        className="bg-[#120824] border-t sm:border border-purple-500/50 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md p-6 relative shadow-[0_0_80px_rgba(0,0,0,0.9)] text-white animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowIosGuide(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#241142] text-purple-300 hover:text-white flex items-center justify-center font-bold text-sm border border-purple-500/40"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E564] to-emerald-600 text-black text-2xl flex items-center justify-center shadow-lg font-black shrink-0">
            📱
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Install {restaurantName} App
            </h3>
            <p className="text-xs text-purple-200/80">
              Enjoy fullscreen native app dining without app store downloads
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 bg-[#1b0c33] p-4 rounded-2xl border border-purple-500/30">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <p className="text-xs text-purple-100 leading-relaxed">
              Tap the <strong className="text-[#00E564]">Share</strong> icon{" "}
              <span className="inline-block px-1.5 py-0.5 bg-[#2a134e] border border-purple-400/50 rounded text-sm">
                ⎋
              </span>{" "}
              (Safari/iOS) or <strong className="text-[#00E564]">Menu</strong> icon{" "}
              <span className="inline-block px-1.5 py-0.5 bg-[#2a134e] border border-purple-400/50 rounded text-sm">
                ⋮
              </span>{" "}
              (Chrome/Android) on your browser toolbar.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <p className="text-xs text-purple-100 leading-relaxed">
              Scroll down and tap{" "}
              <strong className="text-white">&quot;Add to Home Screen&quot;</strong>{" "}
              <span className="inline-block px-1.5 py-0.5 bg-[#2a134e] border border-purple-400/50 rounded text-sm">
                ⊞
              </span>{" "}
              or <strong className="text-white">&quot;Install App&quot;</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <p className="text-xs text-purple-100 leading-relaxed">
              Tap <strong className="text-[#00E564]">&quot;Add&quot;</strong> or{" "}
              <strong className="text-[#00E564]">&quot;Install&quot;</strong>.
              The {restaurantName} app icon will appear instantly on your phone home screen!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowIosGuide(false)}
          className="w-full py-3.5 bg-gradient-to-r from-[#00E564] to-emerald-500 hover:from-[#00FF66] hover:to-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#00E564]/20 cursor-pointer"
        >
          Got it, Close
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* 1. DISMISSIBLE TOP MOBILE INSTALL BANNER */}
      {isInstallable && !isDismissed && variant === "banner" && (
        <div className="relative z-30 mx-3 my-2 bg-gradient-to-r from-[#17092e] via-[#240e45] to-[#17092e] border border-purple-400/40 rounded-2xl p-3 shadow-xl text-white animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E564] to-emerald-600 text-black font-black flex items-center justify-center shrink-0 shadow-md">
                📱
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
                  <span>Install {restaurantName} App</span>
                  <span className="text-[9px] bg-[#00E564] text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    PWA
                  </span>
                </p>
                <p className="text-[10px] text-purple-200/80 truncate">
                  Add to home screen for 1-tap instant ordering & offline view
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#00E564] to-emerald-500 hover:from-[#00FF66] hover:to-emerald-400 active:scale-95 text-black font-black text-xs rounded-xl transition shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>📲</span>
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg text-purple-300 hover:text-white flex items-center justify-center text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. INLINE BUTTON TRIGGER (Used in navbar or mobile drawer) */}
      {variant === "button" && !isStandalone && (
        <button
          onClick={handleInstallClick}
          className={
            className ||
            "inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          }
          title="Install as Mobile App"
        >
          <span>📲</span>
          <span>Install App</span>
          <span className="hidden xl:inline-block bg-white/20 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            PWA
          </span>
        </button>
      )}

      {/* 3. PORTALED IOS / ADD-TO-HOME-SCREEN GUIDE MODAL */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
