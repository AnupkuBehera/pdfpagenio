"use client";

import React, { useEffect, useRef } from "react";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  responsive?: boolean;
  className?: string;
}

/**
 * AdSlot Component for Google AdSense
 * Ensures Cumulative Layout Shift (CLS) = 0 with min-height containers
 * Policy compliant: labeled "Advertisement" with safe margins from interactive UI.
 */
export default function AdSlot({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Check if window.adsbygoogle is available and ad hasn't been pushed
    if (typeof window !== "undefined" && slotId && !isLoaded.current) {
      try {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch {
        // Suppress adsbygoogle push errors in dev or adblock environments
      }
    }
  }, [slotId]);

  return (
    <div
      className={`my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 select-none">
        Advertisement
      </span>

      <div className="w-full max-w-4xl min-h-[90px] sm:min-h-[100px] bg-slate-100/60 rounded-2xl border border-slate-200/60 flex items-center justify-center p-2 text-center">
        {slotId ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px" }}
            data-ad-client="ca-pub-0000000000000000" // Replace with your Publisher ID
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
          />
        ) : (
          <div className="text-xs text-slate-400 font-medium py-3">
            Ad Space (Ready for Google AdSense Client ID)
          </div>
        )}
      </div>
    </div>
  );
}
