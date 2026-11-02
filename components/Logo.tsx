import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  variant = "full",
  theme = "light",
  className = "",
  href = "/",
}: LogoProps) {
  // Dimensions for the icon and typography
  const dimensions = {
    sm: { box: 28, text: "text-lg", gap: "gap-2" },
    md: { box: 38, text: "text-2xl", gap: "gap-2.5" },
    lg: { box: 48, text: "text-3xl", gap: "gap-3" },
    xl: { box: 64, text: "text-4xl", gap: "gap-4" },
  }[size];

  const iconElement = (
    <div
      className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
      style={{ width: dimensions.box, height: dimensions.box }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(229,50,45,0.28)]"
      >
        <defs>
          {/* Vibrant Imperial Crimson Brand Gradient */}
          <linearGradient id="logoBadgeGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="55%" stopColor="#E5322D" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Origami 45-Degree Fold Facet */}
          <linearGradient id="logoFoldFacet" x1="36" y1="12" x2="52" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Vibrant Crimson Squircle Tile */}
        <rect width="64" height="64" rx="16" fill="url(#logoBadgeGrad)" />

        {/* Subtle Rim Light for Dark/Light Contrast */}
        <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="1.5" />

        {/* Bold White Origami Document "P" Ribbon */}
        {/* Vertical Spine / Document Edge */}
        <rect x="14" y="12" width="11" height="40" rx="3" fill="#FFFFFF" />

        {/* Folding Document "P" Loop Body */}
        <path
          d="M22 12H39C46.1797 12 52 17.8203 52 25C52 32.1797 46.1797 38 39 38H22V12Z"
          fill="#FFFFFF"
        />

        {/* Clean Embossed Cutout (Reveals Core Crimson) */}
        <path
          d="M25 21H38C40.2091 21 42 22.7909 42 25C42 27.2091 40.2091 29 38 29H25V21Z"
          fill="url(#logoBadgeGrad)"
        />

        {/* 45-Degree Origami Paper Fold Facet */}
        <path
          d="M38 12L52 26H42C39.7909 26 38 24.2091 38 22V12Z"
          fill="url(#logoFoldFacet)"
        />
      </svg>
    </div>
  );

  const textElement = (
    <span
      className={`font-black tracking-tight leading-none ${dimensions.text} transition-colors select-none`}
    >
      <span className={theme === "dark" ? "text-white" : "text-slate-900"}>
        PDF
      </span>
      <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-rose-600 bg-clip-text text-transparent">
        Pagenio
      </span>
    </span>
  );

  const content = (
    <div
      className={`inline-flex items-center ${dimensions.gap} ${className} group`}
    >
      {iconElement}
      {variant === "full" && textElement}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
