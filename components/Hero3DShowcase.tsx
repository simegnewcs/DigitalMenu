"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SceneStep {
  id: number;
  title: string;
  shortLabel: string;
  duration: number; // in seconds
  description: string;
  highlightPill: string;
}

const SCENES: SceneStep[] = [
  {
    id: 1,
    title: "1. Create Menu & Set ETB Prices",
    shortLabel: "1. Build Menu",
    duration: 6,
    description: "Enter restaurant info, add categories (Starters, Mains, Drinks), upload dish photos & set prices in Ethiopian Birr.",
    highlightPill: "Live Cloud Sync in 0.1s",
  },
  {
    id: 2,
    title: "2. Generate 3D Table QR Stand",
    shortLabel: "2. QR Stand",
    duration: 6,
    description: "Instantly create high-resolution table QR codes with acrylic stand mockups & print-ready A4 table posters.",
    highlightPill: "Ready to Print & Laminate",
  },
  {
    id: 3,
    title: "3. Guest Scans Table QR Code",
    shortLabel: "3. Camera Scan",
    duration: 6,
    description: "Diners point their smartphone camera at the table QR code. Opens instantaneously without any app download or login.",
    highlightPill: "Zero App Download Needed",
  },
  {
    id: 4,
    title: "4. Browse Dishes & Contactless Tray",
    shortLabel: "4. Digital Dining",
    duration: 6,
    description: "Guests explore mouth-watering food photos, toggle sold-out items, build their order tray, and view the live ETB total.",
    highlightPill: "+28% Higher Average Ticket",
  },
];

// High-definition crisp vector QR code component with scanner registration marks
function QRCodeGraphic({ className = "w-full h-full text-slate-900" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      {/* Top-Left Position Detection Pattern */}
      <rect x="6" y="6" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
      <rect x="14" y="14" width="10" height="10" rx="1" fill="#6c2ebd" />

      {/* Top-Right Position Detection Pattern */}
      <rect x="68" y="6" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
      <rect x="76" y="14" width="10" height="10" rx="1" fill="#6c2ebd" />

      {/* Bottom-Left Position Detection Pattern */}
      <rect x="6" y="68" width="26" height="26" rx="4" fill="#0f172a" />
      <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
      <rect x="14" y="76" width="10" height="10" rx="1" fill="#6c2ebd" />

      {/* Timing Patterns and Data Cells */}
      <rect x="36" y="10" width="6" height="6" rx="1" fill="#0f172a" />
      <rect x="46" y="10" width="6" height="6" rx="1" fill="#6c2ebd" />
      <rect x="56" y="10" width="6" height="6" rx="1" fill="#0f172a" />

      <rect x="36" y="20" width="6" height="6" rx="1" fill="#6c2ebd" />
      <rect x="46" y="20" width="16" height="6" rx="1" fill="#0f172a" />

      <rect x="10" y="36" width="6" height="6" rx="1" fill="#0f172a" />
      <rect x="20" y="36" width="12" height="6" rx="1" fill="#6c2ebd" />
      <rect x="36" y="36" width="8" height="8" rx="1" fill="#0f172a" />
      <rect x="48" y="36" width="12" height="6" rx="1" fill="#6c2ebd" />
      <rect x="64" y="36" width="8" height="8" rx="1" fill="#0f172a" />
      <rect x="76" y="36" width="18" height="6" rx="1" fill="#6c2ebd" />

      <rect x="10" y="46" width="12" height="6" rx="1" fill="#6c2ebd" />
      <rect x="26" y="46" width="6" height="14" rx="1" fill="#0f172a" />
      <rect x="36" y="48" width="10" height="10" rx="1" fill="#6c2ebd" />
      <rect x="52" y="48" width="16" height="6" rx="1" fill="#0f172a" />
      <rect x="72" y="46" width="14" height="6" rx="1" fill="#6c2ebd" />
      <rect x="90" y="46" width="4" height="12" rx="1" fill="#0f172a" />

      <rect x="10" y="56" width="6" height="8" rx="1" fill="#0f172a" />
      <rect x="36" y="62" width="12" height="6" rx="1" fill="#0f172a" />
      <rect x="52" y="58" width="6" height="12" rx="1" fill="#6c2ebd" />
      <rect x="62" y="58" width="12" height="6" rx="1" fill="#0f172a" />
      <rect x="78" y="56" width="10" height="10" rx="1" fill="#0f172a" />

      <rect x="36" y="72" width="8" height="8" rx="1" fill="#6c2ebd" />
      <rect x="48" y="74" width="18" height="6" rx="1" fill="#0f172a" />
      <rect x="70" y="70" width="8" height="16" rx="1" fill="#6c2ebd" />
      <rect x="82" y="72" width="12" height="6" rx="1" fill="#0f172a" />

      <rect x="36" y="84" width="16" height="6" rx="1" fill="#0f172a" />
      <rect x="56" y="84" width="8" height="8" rx="1" fill="#6c2ebd" />
      <rect x="68" y="88" width="16" height="6" rx="1" fill="#0f172a" />
      <rect x="88" y="82" width="6" height="12" rx="1" fill="#6c2ebd" />
    </svg>
  );
}

export default function Hero3DShowcase() {
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [viewAngle, setViewAngle] = useState<"cinematic" | "front" | "isometric">("cinematic");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  
  // Interactive 3D cursor parallax
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Synthesize lightweight pleasant UI click audio using Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.1); // B5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  }, [soundEnabled]);

  // Video progress timer & automatic scene transition
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 50;
    const currentSceneObj = SCENES[activeScene - 1];
    const stepDurationMs = currentSceneObj.duration * 1000;
    const stepIncrement = (intervalMs / stepDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          setActiveScene((current) => {
            const next = current === SCENES.length ? 1 : current + 1;
            return next;
          });
          playChime();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeScene, playChime]);

  // Handle Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || viewAngle !== "cinematic") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseTilt({ x: x * 18, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const jumpToScene = (sceneId: number) => {
    setActiveScene(sceneId);
    setProgress(0);
    playChime();
  };

  // Determine 3D Transform based on selected view angle & mouse tilt
  const getStageTransform = () => {
    if (viewAngle === "front") {
      return "rotateY(0deg) rotateX(0deg)";
    }
    if (viewAngle === "isometric") {
      return "rotateY(-24deg) rotateX(18deg) scale(0.95)";
    }
    // Cinematic default with interactive mouse tilt
    return `rotateY(${-8 + mouseTilt.x}deg) rotateX(${6 + mouseTilt.y}deg)`;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Outer 3D Glow Aura */}
      <div className="absolute -inset-3 bg-gradient-to-tr from-[#6c2ebd]/30 via-[#ff6384]/25 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-75 pointer-events-none"></div>

      {/* Main 3D Theater Showcase Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-slate-950 text-white rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* ============================================================ */}
        {/* 1. TOP VIDEO HEADER CONTROLS */}
        {/* ============================================================ */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
          {/* Left: 3D Video Status Badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-400 font-mono">
                3D Promo Video
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60 font-mono">
                How It Works
              </span>
            </div>
          </div>

          {/* Right: Camera Angle & Audio Controls */}
          <div className="flex items-center gap-2">
            {/* Camera View Angle Selector */}
            <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/70 text-[10px] font-bold">
              <button
                onClick={() => setViewAngle("cinematic")}
                className={`px-2 py-0.5 rounded transition ${
                  viewAngle === "cinematic"
                    ? "bg-[#6c2ebd] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Cinematic 3D Angle with interactive cursor tilt"
              >
                3D Tilt
              </button>
              <button
                onClick={() => setViewAngle("front")}
                className={`px-2 py-0.5 rounded transition ${
                  viewAngle === "front"
                    ? "bg-[#6c2ebd] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Direct flat front view"
              >
                Front
              </button>
              <button
                onClick={() => setViewAngle("isometric")}
                className={`px-2 py-0.5 rounded transition ${
                  viewAngle === "isometric"
                    ? "bg-[#6c2ebd] text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Isometric top-angle view"
              >
                Iso
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              className={`p-1.5 rounded-lg border text-xs transition ${
                soundEnabled
                  ? "bg-purple-900/60 border-purple-500/60 text-purple-200"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title={soundEnabled ? "Audio On" : "Enable UI Sound Effects"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. 3D STAGE & SCENE PRESENTATION */}
        {/* ============================================================ */}
        <div className="relative h-[360px] sm:h-[400px] w-full p-4 sm:p-6 overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-950 via-[#0d0718] to-slate-950">
          {/* Subtle 3D Grid Flooring / Radial Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6c2ebd]/20 via-transparent to-transparent pointer-events-none"></div>

          {/* Perspective 3D Box Container */}
          <div
            className="relative w-full max-w-md h-full transition-transform duration-300 ease-out flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: getStageTransform(),
            }}
          >
            {/* -------------------------------------------------------- */}
            {/* SCENE 1: RESTAURANT CREATES MENU & SETS PRICES IN ETB   */}
            {/* -------------------------------------------------------- */}
            {activeScene === 1 && (
              <div
                className="w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border-2 border-purple-500/40 p-4 sm:p-5 shadow-2xl animate-in zoom-in-95 fade-in duration-300 relative"
                style={{ transform: "translateZ(30px)" }}
              >
                {/* Scene 1 Floating Holographic Badge */}
                <div
                  className="absolute -top-3.5 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg border border-emerald-300/40 flex items-center gap-1.5"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                  <span>Instant 0.1s Cloud Sync</span>
                </div>

                <div className="flex items-center gap-2.5 mb-3 border-b border-slate-800 pb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center text-sm font-bold">
                    🛠️
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-400 font-mono uppercase font-bold block">
                      Admin Studio Dashboard
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      Bole Sky Bistro & Lounge
                    </h4>
                  </div>
                </div>

                {/* Dish Editing Simulator Box */}
                <div className="space-y-2.5 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Active Category:</span>
                    <span className="bg-[#6c2ebd]/40 text-purple-200 px-2 py-0.5 rounded-md font-bold text-[11px] border border-purple-500/30">
                      🥩 Mains & Traditional
                    </span>
                  </div>

                  {/* Simulated Live Added Item */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/40 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-400/40 shrink-0">
                        <img
                          src="/dish_steak.jpg"
                          alt="Gourmet Ribeye Steak"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Gourmet Ribeye Steak</p>
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Available In Stock</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Price</span>
                      <span className="text-xs font-black text-amber-300 font-mono">
                        650 ETB
                      </span>
                    </div>
                  </div>

                  {/* Another Dish Entry */}
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img
                          src="/dish_burger.jpg"
                          alt="Artisan Brioche Burger"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Artisan Brioche Burger</p>
                        <span className="text-[10px] text-purple-300 font-bold">★ Most Popular</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Price</span>
                      <span className="text-xs font-black text-amber-300 font-mono">
                        450 ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom sync status */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Reprint costs: 0 ETB</span>
                  </span>
                  <span className="text-[#ff98b4] font-bold">Changes live in 0.1s</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SCENE 2: 3D ACRYLIC TABLE QR STAND & PRINT GENERATOR    */}
            {/* -------------------------------------------------------- */}
            {activeScene === 2 && (
              <div
                className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-300 relative"
                style={{ transform: "translateZ(40px)" }}
              >
                {/* 3D Realistic Acrylic Stand Preview */}
                <div
                  className="relative w-56 sm:w-64 bg-gradient-to-b from-slate-900 to-slate-950 p-4 rounded-2xl border-4 border-slate-700/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
                  style={{
                    transform: "rotateX(6deg)",
                    boxShadow: "0 20px 40px -10px rgba(108, 46, 189, 0.4)",
                  }}
                >
                  {/* Glass reflective sheen across stand */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>

                  {/* Table Badge */}
                  <div className="inline-block px-3 py-0.5 rounded-full bg-purple-600/30 border border-purple-400/40 text-[#ff98b4] font-black text-[10px] uppercase tracking-wider mb-2 font-mono">
                    Table #04 • Contactless
                  </div>

                  <h5 className="text-xs font-black text-white tracking-tight uppercase mb-0.5">
                    Bole Sky Bistro
                  </h5>
                  <p className="text-[10px] text-slate-400 mb-2">Scan to browse & order</p>

                  {/* QR Code Container with Center Logo */}
                  <div className="relative w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-xl border-2 border-purple-200 flex items-center justify-center">
                    <QRCodeGraphic className="w-full h-full text-slate-900" />
                    <div className="absolute w-8 h-8 rounded-lg bg-slate-950 border border-purple-400 p-1 flex items-center justify-center shadow-md">
                      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-amber-300 mt-2 font-mono">
                    Point camera at QR code
                  </p>
                </div>

                {/* Stand Wooden Base Simulation */}
                <div
                  className="w-64 sm:w-72 h-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-b-xl shadow-2xl border-t border-amber-700/40 -mt-1"
                  style={{ transform: "translateZ(10px)" }}
                ></div>

                {/* Floating 3D Print Callout Badge */}
                <div
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-purple-900/80 border border-purple-400/50 text-xs font-extrabold text-white shadow-xl flex items-center gap-2"
                  style={{ transform: "translateZ(60px)" }}
                >
                  <span>📄</span>
                  <span>Print-Ready High-Res A4 Poster Generated</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SCENE 3: GUEST CAMERA SCAN WITH ZERO APP DOWNLOAD       */}
            {/* -------------------------------------------------------- */}
            {activeScene === 3 && (
              <div
                className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-300 relative"
                style={{ transform: "translateZ(40px)" }}
              >
                {/* 3D Floating Smartphone Frame */}
                <div
                  className="relative w-64 sm:w-72 bg-slate-900 rounded-[2.5rem] p-3 border-4 border-slate-700 shadow-2xl overflow-hidden"
                  style={{
                    transform: "rotateY(-8deg) rotateX(4deg)",
                    boxShadow: "0 20px 50px -10px rgba(0, 240, 255, 0.35)",
                  }}
                >
                  {/* Phone Speaker Notch */}
                  <div className="w-20 h-4 bg-slate-950 mx-auto rounded-full mb-2"></div>

                  {/* Camera Viewfinder Screen */}
                  <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {/* Background blurred dining scene */}
                    <img
                      src="/hero_qr_dining.jpg"
                      alt="Camera view"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px]"
                    />

                    {/* QR Code in viewfinder target */}
                    <div className="relative w-28 h-28 bg-white p-2.5 rounded-xl shadow-lg border-2 border-emerald-400">
                      <QRCodeGraphic className="w-full h-full text-slate-900" />
                    </div>

                    {/* Animated Neon Cyan Laser Scan Line */}
                    <div
                      className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse"
                      style={{
                        top: `${25 + (progress % 50)}%`,
                        transition: "top 0.1s linear",
                      }}
                    ></div>

                    {/* Viewfinder Target Reticle Corners */}
                    <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
                    <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
                    <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

                    {/* Pop-up Safari/Chrome Link Notification */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-2xl border border-purple-200 text-slate-900 flex items-center justify-between gap-2 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">🌐</span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase text-purple-700 truncate">
                            QR Code Detected
                          </p>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            Open Bole Sky Bistro Menu
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#6c2ebd] text-white px-2 py-1 rounded-md font-extrabold shrink-0">
                        Open ↗
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Badge */}
                <div
                  className="mt-3 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs font-extrabold shadow-xl flex items-center gap-2"
                  style={{ transform: "translateZ(70px)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Zero App Download • Opens in 0.2s</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* SCENE 4: INTERACTIVE DIGITAL MENU & CONTACTLESS TRAY    */}
            {/* -------------------------------------------------------- */}
            {activeScene === 4 && (
              <div
                className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-300 relative"
                style={{ transform: "translateZ(40px)" }}
              >
                {/* 3D Customer Phone Viewing Active Menu */}
                <div
                  className="relative w-64 sm:w-72 bg-slate-900 rounded-[2.5rem] p-3 border-4 border-purple-500/60 shadow-2xl overflow-hidden"
                  style={{
                    transform: "rotateY(6deg) rotateX(2deg)",
                    boxShadow: "0 25px 50px -10px rgba(108, 46, 189, 0.5)",
                  }}
                >
                  {/* Speaker Notch */}
                  <div className="w-20 h-4 bg-slate-950 mx-auto rounded-full mb-2"></div>

                  {/* Customer Menu Screen */}
                  <div className="h-64 rounded-2xl bg-white text-slate-900 p-3 overflow-hidden flex flex-col justify-between border border-slate-100">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between border-b border-purple-100 pb-2 mb-2">
                        <div>
                          <h6 className="font-extrabold text-xs text-[#6c2ebd]">
                            Bole Sky Bistro
                          </h6>
                          <span className="text-[9px] font-bold text-slate-400">Table #04</span>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                          Live Menu
                        </span>
                      </div>

                      {/* Sample Dish Card with Photo */}
                      <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center gap-2 mb-2 shadow-xs">
                        <img
                          src="/dish_steak.jpg"
                          alt="Ribeye"
                          className="w-11 h-11 rounded-lg object-cover border border-purple-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-extrabold text-slate-900 truncate">
                            Gourmet Ribeye Steak
                          </p>
                          <span className="text-xs font-black text-[#6c2ebd]">650 ETB</span>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#6c2ebd] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          ✓
                        </span>
                      </div>

                      {/* Second Dish */}
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 shadow-xs">
                        <img
                          src="/dish_ethiopian.jpg"
                          alt="Doro Wat"
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-extrabold text-slate-900 truncate">
                            Special Doro Wat & Injera
                          </p>
                          <span className="text-xs font-black text-[#6c2ebd]">520 ETB</span>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          +
                        </span>
                      </div>
                    </div>

                    {/* Bottom Order Tray Pill */}
                    <div className="bg-gradient-to-r from-[#6c2ebd] to-[#8035e4] text-white p-2 rounded-xl flex items-center justify-between text-xs font-bold shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-extrabold">
                          2
                        </span>
                        <span className="text-[11px]">Diner Tray</span>
                      </div>
                      <span className="font-mono text-amber-300 font-extrabold">
                        1,170 ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Order Boost Badge */}
                <div
                  className="mt-3 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400/50 text-white text-xs font-extrabold shadow-xl flex items-center gap-2"
                  style={{ transform: "translateZ(70px)" }}
                >
                  <span>🚀</span>
                  <span>Contactless Ordering Boosts Sales by 28%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. VIDEO PROGRESS & STEP SCRUBBER TIMELINE */}
        {/* ============================================================ */}
        <div className="bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 border-t border-slate-800">
          {/* Active Scene Description Box */}
          <div className="mb-3 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#6c2ebd] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {activeScene}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h5 className="text-xs font-extrabold text-white truncate">
                  {SCENES[activeScene - 1].title}
                </h5>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-800/40">
                  {SCENES[activeScene - 1].highlightPill}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {SCENES[activeScene - 1].description}
              </p>
            </div>
          </div>

          {/* Video Timeline Scrubber */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {SCENES.map((scene) => {
              const isCurrent = activeScene === scene.id;
              const isPast = activeScene > scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(scene.id)}
                  className={`text-left group transition-all`}
                >
                  {/* Scrub Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative mb-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCurrent
                          ? "bg-gradient-to-r from-[#6c2ebd] to-[#ff6384]"
                          : isPast
                          ? "bg-purple-500"
                          : "bg-transparent"
                      }`}
                      style={{
                        width: isCurrent ? `${progress}%` : isPast ? "100%" : "0%",
                      }}
                    ></div>
                  </div>

                  <span
                    className={`block text-[10px] truncate font-bold uppercase tracking-wider ${
                      isCurrent
                        ? "text-purple-300"
                        : isPast
                        ? "text-slate-400"
                        : "text-slate-600 group-hover:text-slate-400"
                    }`}
                  >
                    {scene.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Player Controls & CTA */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              {/* Play / Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold transition shadow-xs"
                title={isPlaying ? "Pause 3D Video" : "Play 3D Video"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <span className="text-[11px] font-mono text-slate-400">
                0:0{activeScene * 6 - 6 + Math.floor((progress / 100) * 6)} / 0:24
              </span>
            </div>

            {/* Direct CTA */}
            <Link
              href="/login?mode=register"
              className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#6c2ebd] to-[#8035e4] hover:from-[#581c87] hover:to-[#6c2ebd] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md shadow-[#6c2ebd]/25 transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Create Free Menu</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
