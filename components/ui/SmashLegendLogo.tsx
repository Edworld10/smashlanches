"use client";

import React, { useState } from "react";

interface SmashLegendLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export function SmashLegendLogo({
  className = "",
  size = "md",
  showSubtitle = true,
}: SmashLegendLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <div className={`relative flex items-center gap-2.5 ${className}`}>
      {/* Official Emblem Shield from the Store Banner */}
      {!imgError ? (
        <div
          className={`${sizeMap[size]} shrink-0 relative overflow-hidden rounded-xl border border-[#FF7A00]/40 bg-black shadow-[0_0_16px_rgba(255,122,0,0.35)] flex items-center justify-center p-0.5`}
        >
          <img
            src="/assets/aistudio/smash_legend_official_logo.png"
            alt="Smash Legend Logo Oficial"
            className="h-full w-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Vector SVG Shield Fallback */
        <svg
          viewBox="0 0 200 220"
          className={`${sizeMap[size]} shrink-0 drop-shadow-[0_4px_12px_rgba(255,122,0,0.35)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 6L185 45V135C185 178 145 208 100 216C55 208 15 178 15 135V45L100 6Z"
            fill="#0D0D0D"
            stroke="#FF7A00"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path
            d="M100 16L173 50V132C173 170 137 197 100 205C63 197 27 170 27 132V50L100 16Z"
            stroke="#FF7A00"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.6"
          />
          <path
            d="M62 68C62 50 78 44 100 44C122 44 138 50 138 68H62Z"
            fill="#FF7A00"
          />
          <rect x="58" y="72" width="84" height="9" rx="4.5" fill="#5A2E12" />
          <path
            d="M58 81H142L136 88C134 91 130 90 128 86C126 83 122 84 120 87C117 91 113 90 110 86C108 82 104 83 102 88C99 92 95 91 92 86C89 82 85 84 83 87C80 91 76 90 74 86L68 88L58 81Z"
            fill="#FFB300"
          />
          <rect x="56" y="88" width="88" height="10" rx="5" fill="#3D1E0B" />
          <path
            d="M62 102H138C138 111 126 116 100 116C74 116 62 111 62 102Z"
            fill="#E66A00"
          />
          <text
            x="100"
            y="146"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="var(--font-bebas), Impact, sans-serif"
            fontSize="36"
            fontWeight="bold"
            letterSpacing="2"
          >
            SMASH
          </text>
          <text
            x="100"
            y="178"
            textAnchor="middle"
            fill="#FF7A00"
            fontFamily="var(--font-bebas), Impact, sans-serif"
            fontSize="34"
            fontWeight="bold"
            letterSpacing="3"
          >
            LEGEND
          </text>
          <line x1="42" y1="190" x2="68" y2="190" stroke="#FF7A00" strokeWidth="1.5" />
          <text
            x="100"
            y="201"
            textAnchor="middle"
            fill="#C4B59D"
            fontFamily="sans-serif"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="2"
          >
            HAMBURGUERIA
          </text>
          <line x1="132" y1="190" x2="158" y2="190" stroke="#FF7A00" strokeWidth="1.5" />
        </svg>
      )}

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
            SMASH
          </span>
          <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-[#FF7A00]">
            LEGEND
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#C4B59D] -mt-1">
            Hamburgueria • Poá / SP
          </span>
        )}
      </div>
    </div>
  );
}
