import React from "react";

export type DividerVariant =
  | "slant-right"
  | "slant-left"
  | "chevron"
  | "wave"
  | "asymmetric";

interface SectionDividerProps {
  /** The geometric shape of the clip-path divider */
  variant?: DividerVariant;
  /** Fill color matching the upcoming section background */
  fillColor?: string;
  /** Primary dark/black border color (defaults to #09090b) */
  blackBorderColor?: string;
  /** Vibrant red border color (defaults to #dc2626) */
  redBorderColor?: string;
  /** Height class for responsive scaling */
  heightClass?: string;
  /** Optional extra classes */
  className?: string;
}

export default function SectionDivider({
  variant = "slant-right",
  fillColor = "#ffffff",
  blackBorderColor = "#09090b",
  redBorderColor = "#dc2626",
  heightClass = "h-8 sm:h-12 lg:h-16",
  className = "",
}: SectionDividerProps) {
  // SVG coordinates tuned for 1200 x 60 viewBox
  let fillPath = "";
  let blackPath = "";
  let redPath = "";

  switch (variant) {
    case "slant-right":
      // Downward slant from left (y=10) to right (y=48)
      fillPath = "M0,10 L1200,48 L1200,60 L0,60 Z";
      blackPath = "M0,10 L1200,48";
      redPath = "M0,14 L1200,52";
      break;

    case "slant-left":
      // Downward slant from right (y=10) to left (y=48)
      fillPath = "M0,48 L1200,10 L1200,60 L0,60 Z";
      blackPath = "M0,48 L1200,10";
      redPath = "M0,52 L1200,14";
      break;

    case "chevron":
      // Symmetrical V-cut pointing downwards in center
      fillPath = "M0,10 L600,48 L1200,10 L1200,60 L0,60 Z";
      blackPath = "M0,10 L600,48 L1200,10";
      redPath = "M0,14 L600,52 L1200,14";
      break;

    case "wave":
      // Smooth organic hospitality wave
      fillPath = "M0,25 Q300,50 600,25 T1200,25 L1200,60 L0,60 Z";
      blackPath = "M0,25 Q300,50 600,25 T1200,25";
      redPath = "M0,29 Q300,54 600,29 T1200,29";
      break;

    case "asymmetric":
      // Modern architectural step slant
      fillPath = "M0,16 L420,16 L780,48 L1200,48 L1200,60 L0,60 Z";
      blackPath = "M0,16 L420,16 L780,48 L1200,48";
      redPath = "M0,20 L420,20 L780,52 L1200,52";
      break;

    default:
      fillPath = "M0,10 L1200,48 L1200,60 L0,60 Z";
      blackPath = "M0,10 L1200,48";
      redPath = "M0,14 L1200,52";
  }

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className={`w-full ${heightClass} block`}
      >
        <defs>
          <linearGradient id={`redGlow-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor={redBorderColor} />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <filter id={`shadow-${variant}`} x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Underlying shape fill matching the next section's background */}
        <path d={fillPath} fill={fillColor} />

        {/* 2. Top Dark/Black Border Line (High-contrast definition) */}
        <path
          d={blackPath}
          fill="none"
          stroke={blackBorderColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#shadow-${variant})`}
        />

        {/* 3. Lower Bold Red Border Line (Brand vibrant red accent stripe) */}
        <path
          d={redPath}
          fill="none"
          stroke={`url(#redGlow-${variant})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
