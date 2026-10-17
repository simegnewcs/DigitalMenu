"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPwaPrompt({
  restaurantName = "BGS Chicken Restaurant",
  variant = "banner",
}: {
  restaurantName?: string;
  variant?: "banner" | "button" | "modal";
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

    // 1. Check if already installed / running as PWA
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

    // 4. iOS Safari Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|firefox|fxios/.test(userAgent);

    if (isIosDevice && !checkStandalone()) {
      setIsIOS(true);
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
        className="bg-[#021C0E] border-t sm:border border-[#00E564]/50 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md p-6 relative shadow-[0_0_80px_rgba(0,0,0,0.9)] text-white animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowIosGuide(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#062E19] text-emerald-300 hover:text-white flex items-center justify-center font-bold text-sm border border-[#0E542F]"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00E564] text-black text-2xl flex items-center justify-center shadow-lg font-black shrink-0">
            📱
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Install as Mobile App
            </h3>
            <p className="text-xs text-emerald-300/80">
              Enjoy fullscreen native app dining without app store downloads
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 bg-[#042413] p-4 rounded-2xl border border-[#0E542F]">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Tap the <strong className="text-[#00E564]">Share</strong> icon{" "}
              <span className="inline-block px-1.5 py-0.5 bg-[#062E19] border border-emerald-600 rounded text-sm">
                ⎋
              </span>{" "}
              at the bottom or top of your browser toolbar.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Scroll down and tap{" "}
              <strong className="text-[#00E564]">&quot;Add to Home Screen&quot;</strong>{" "}
              <span className="inline-block px-1.5 py-0.5 bg-[#062E19] border border-emerald-600 rounded text-sm">
                ⊞
              </span>
              .
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#00E564] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Tap <strong className="text-white">&quot;Add&quot;</strong> in the top right.
              The app icon will appear instantly on your phone home screen!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowIosGuide(false)}
          className="w-full py-3.5 bg-[#00E564] hover:bg-[#00FF66] text-black font-black text-xs rounded-xl transition shadow-lg shadow-[#00E564]/20 cursor-pointer"
        >
          Got it, close
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* 1. DISMISSIBLE TOP MOBILE INSTALL BANNER */}
      {isInstallable && !isDismissed && variant === "banner" && (
        <div className="relative z-30 mx-3 my-2 bg-gradient-to-r from-[#042A16] via-[#06381D] to-[#042A16] border border-[#00E564]/50 rounded-2xl p-3 shadow-xl text-white animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#00E564] text-black font-black flex items-center justify-center shrink-0 shadow-md">
                📱
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
                  <span>Install {restaurantName} App</span>
                  <span className="text-[9px] bg-[#00E564] text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    PWA
                  </span>
                </p>
                <p className="text-[10px] text-emerald-300/80 truncate">
                  Add to home screen for 1-tap instant ordering & offline view
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-[#00E564] hover:bg-[#00FF66] active:scale-95 text-black font-black text-xs rounded-xl transition shadow-md flex items-center gap-1 cursor-pointer"
              >
                <span>📲</span>
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg text-emerald-400 hover:text-white flex items-center justify-center text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. INLINE BUTTON TRIGGER (Used in headers or bottom bars) */}
      {variant === "button" && !isStandalone && (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06381D] hover:bg-[#00E564] hover:text-black text-[#00E564] border border-[#00E564]/40 font-black text-xs rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
          title="Install as Mobile App"
        >
          <span>📲</span>
          <span>Install App</span>
        </button>
      )}

      {/* 3. PORTALED IOS / ADD-TO-HOME-SCREEN GUIDE MODAL */}
      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
