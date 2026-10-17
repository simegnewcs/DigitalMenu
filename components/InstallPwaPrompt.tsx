"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function InstallPwaPrompt({
  restaurantName = "DigitalMenu",
  variant = "button",
  className,
}: {
  restaurantName?: string;
  variant?: "banner" | "button";
  className?: string;
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem("digitalmenu_apk_dismissed");
      if (dismissed) setIsDismissed(true);
    } catch (e) {}
  }, []);

  const handleDownloadApk = () => {
    try {
      setDownloading(true);
      toast.success("Downloading DigitalMenu.apk... Tap the downloaded file to install!", {
        duration: 5000,
        icon: "📲",
      });

      // Direct trigger of APK download
      const link = document.createElement("a");
      link.href = "/api/download-apk";
      link.download = "DigitalMenu.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("APK download error:", err);
      window.location.href = "/api/download-apk";
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("digitalmenu_apk_dismissed", "true");
    } catch (e) {}
  };

  return (
    <>
      {/* 1. DISMISSIBLE TOP MOBILE APK DOWNLOAD BANNER (HOME PAGE ONLY) */}
      {!isDismissed && variant === "banner" && (
        <div className="relative z-30 mx-3 my-2 bg-gradient-to-r from-[#17092e] via-[#240e45] to-[#17092e] border border-purple-400/40 rounded-2xl p-3 shadow-xl text-white animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E564] to-emerald-600 text-black font-black flex items-center justify-center shrink-0 shadow-md">
                📲
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
                  <span>Download {restaurantName} App</span>
                  <span className="text-[9px] bg-[#00E564] text-black font-black px-1.5 py-0.2 rounded-full uppercase">
                    APK
                  </span>
                </p>
                <p className="text-[10px] text-purple-200/80 truncate">
                  Official Android APK • Direct Install for Phones & Tablets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleDownloadApk}
                disabled={downloading}
                className="px-3.5 py-1.5 bg-gradient-to-r from-[#00E564] to-emerald-500 hover:from-[#00FF66] hover:to-emerald-400 active:scale-95 text-black font-black text-xs rounded-xl transition shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-60"
              >
                <span>{downloading ? "⏳" : "📲"}</span>
                <span>{downloading ? "Downloading..." : "Download APK"}</span>
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
      {variant === "button" && (
        <button
          onClick={handleDownloadApk}
          disabled={downloading}
          className={
            className ||
            "inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          }
          title="Download DigitalMenu Android APK"
        >
          <span>{downloading ? "⏳" : "📲"}</span>
          <span>{downloading ? "Downloading..." : "Install App"}</span>
          <span className="bg-white/20 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            APK
          </span>
        </button>
      )}
    </>
  );
}
