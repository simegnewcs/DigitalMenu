import React from "react";

interface DevvoltzLogoProps {
  size?: number; // width/height of the D mark
  showText?: boolean;
  showTagline?: boolean;
  variant?: "dark" | "light" | "color";
  className?: string;
}

export default function DevvoltzLogo({
  size = 48,
  showText = true,
  showTagline = false,
  variant = "color",
  className = "",
}: DevvoltzLogoProps) {
  const textColor =
    variant === "dark"
      ? "#ffffff"
      : variant === "light"
      ? "#1e1b4b"
      : "#4f46e5";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The D Mark with QR icon inside */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="dGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="dGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow bg circle */}
        <circle cx="50" cy="50" r="48" fill="url(#dGrad2)" />

        {/* Outer D shape (thick curved) */}
        <path
          d="M18 12 L18 88 L50 88 C74 88 86 74 86 50 C86 26 74 12 50 12 Z"
          fill="url(#dGrad)"
          filter="url(#glow)"
        />

        {/* Inner cutout to form the D hollow */}
        <path
          d="M28 22 L28 78 L48 78 C66 78 74 66 74 50 C74 34 66 22 48 22 Z"
          fill="#0a0a1a"
        />

        {/* QR Code Icon inside the D hollow */}
        {/* Top-left corner square */}
        <rect x="34" y="30" width="10" height="10" rx="1.5" fill="#e0e7ff" />
        <rect x="36.5" y="32.5" width="5" height="5" rx="0.5" fill="#0a0a1a" />

        {/* Top-right corner square */}
        <rect x="56" y="30" width="10" height="10" rx="1.5" fill="#e0e7ff" />
        <rect x="58.5" y="32.5" width="5" height="5" rx="0.5" fill="#0a0a1a" />

        {/* Bottom-left corner square */}
        <rect x="34" y="60" width="10" height="10" rx="1.5" fill="#e0e7ff" />
        <rect x="36.5" y="62.5" width="5" height="5" rx="0.5" fill="#0a0a1a" />

        {/* Data dots - middle area */}
        <rect x="46" y="31" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="51" y="31" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="46" y="36" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="51" y="36" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="46" y="41" width="3" height="3" rx="0.5" fill="#c4b5fd" />

        {/* Right column data */}
        <rect x="57" y="41" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="41" width="3" height="3" rx="0.5" fill="#c4b5fd" />

        {/* Bottom row data */}
        <rect x="46" y="61" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="51" y="61" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="56" y="61" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="61" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="46" y="66" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="56" y="66" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="66" width="3" height="3" rx="0.5" fill="#c4b5fd" />

        {/* Center data */}
        <rect x="46" y="46" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="51" y="46" width="3" height="3" rx="0.5" fill="#a78bfa" />
        <rect x="56" y="46" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="46" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="46" y="51" width="3" height="3" rx="0.5" fill="#a78bfa" />
        <rect x="51" y="51" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="57" y="51" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="51" width="3" height="3" rx="0.5" fill="#a78bfa" />
        <rect x="46" y="56" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="56" y="56" width="3" height="3" rx="0.5" fill="#c4b5fd" />
        <rect x="62" y="56" width="3" height="3" rx="0.5" fill="#c4b5fd" />
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              color: textColor,
              fontSize: size * 0.38,
              fontWeight: 900,
              letterSpacing: "0.08em",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1,
            }}
          >
            DEVVOLTZ
          </span>
          {showTagline && (
            <span
              style={{
                color:
                  variant === "light"
                    ? "#6366f1"
                    : "rgba(196,181,253,0.8)",
                fontSize: size * 0.18,
                fontWeight: 500,
                letterSpacing: "0.15em",
                marginTop: 3,
                textTransform: "uppercase",
              }}
            >
              Digital Menu
            </span>
          )}
        </div>
      )}
    </div>
  );
}
