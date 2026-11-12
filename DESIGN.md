---
name: "PDF Pagenio Design System"
version: "1.0.0"
category: "Productivity / Utility / Legal SaaS"
description: "Visual design language, design tokens, and UI component standards for PDF Pagenio, synthesizing Cal.com clarity, Raycast speed, and Linear craft."
tokens:
  colors:
    canvas:
      bg-default: "#FFFFFF"
      bg-subtle: "#F8FAFC" # slate-50/60
      bg-surface: "#FFFFFF"
      bg-surface-hover: "#F1F5F9"
      bg-dark: "#020617" # slate-950 (footer & dark elements)
    brand:
      primary: "#E5322D" # Signature PDF Crimson
      primary-hover: "#CC201C"
      primary-light: "#FEF2F2" # rose-50
      primary-glow: "rgba(229, 50, 45, 0.15)"
      secondary: "#FF4D4D" # Raycast Coral
    neutral:
      text-primary: "#0F172A" # slate-900
      text-secondary: "#475569" # slate-600
      text-muted: "#94A3B8" # slate-400
      border-subtle: "rgba(226, 232, 240, 0.8)" # slate-200/80
      border-hover: "rgba(203, 213, 225, 0.9)" # slate-300
    status:
      success: "#10B981" # emerald-500
      success-bg: "#ECFDF5" # emerald-50
      warning: "#F59E0B" # amber-500
      error: "#EF4444" # red-500
      info: "#3B82F6" # blue-500
  typography:
    font-sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    weights:
      normal: 400
      medium: 500
      semibold: 600
      bold: 700
      black: 900
    letter-spacing:
      tightest: "-0.03em"
      tight: "-0.02em"
      normal: "0em"
      wide: "0.05em"
  radii:
    sm: "8px"
    md: "12px"
    lg: "16px" # rounded-2xl
    xl: "24px" # rounded-3xl
    full: "9999px"
  shadows:
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    sm: "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)"
    md: "0 8px 20px -4px rgba(15, 23, 42, 0.06)"
    lg: "0 14px 34px -6px rgba(15, 23, 42, 0.08)"
    glow-brand: "0 8px 24px -4px rgba(229, 50, 45, 0.28)"
---

# PDF Pagenio Design System (`DESIGN.md`)

Welcome to the **PDF Pagenio Design System**. This document serves as the persistent single source of truth for visual identity, component architecture, and styling rules across **[pdfpagenio.com](https://pdfpagenio.com)**.

---

## 1. Visual Philosophy & Core Pillars

PDF Pagenio combines the best attributes of three industry-leading design systems:
1. **Cal.com's Functional Clarity**: Clean white/slate canvas, zero clutter, soft-rounded containers, and embedded interactive UI fragments instead of abstract illustrations.
2. **Raycast's Precision & Speed**: Blazing-fast keyboard-first interactions, monospace file metrics, and native brand red synergy (`#E5322D` / `#FF4D4D`).
3. **Linear's Atmospheric Craft**: Subtle top ambient gradients, micro-interactions with spring physics, and undeniable enterprise trust signals (HIPAA, CCPA, and FERPA compliance).

### Core Design Rules:
- **Instant Local Execution**: Emphasize that all computation runs in-browser with WebAssembly. UI states should feel immediate without waiting for server roundtrips.
- **Uncompromised Privacy by Design**: Always surface trust pills with emerald security indicators (*100% On-Device • Zero File Uploads*).
- **High-Contrast Legibility**: Black/slate headings (`#0F172A`) against clean white cards with subtle 1px border lines.
- **No Decorative Fluff**: Every visual element must serve a utility purpose (e.g. page counts, byte savings, drag handles, action buttons).

---

## 2. Color Palette & Surface Tokens

### Brand Crimson & Accents
- `brand-600` (`#E5322D`): Primary action button fill, logo badge, active stepper status.
- `brand-700` (`#CC201C`): Hover state for primary buttons.
- `brand-50` (`#FEF2F2`): Light tint for active category pills and secondary badges.
- `brand-coral` (`#FF4D4D`): Top gradient highlight for the logo and active progress shimmers.

### Surfaces & Backgrounds
- **App Background**: `bg-slate-50/60` (`#F8FAFC` with 60% opacity) over pure white.
- **Card Surface**: `bg-white` with `border border-slate-200/80` and `rounded-3xl` (24px).
- **Elevated Interactive Surface**: `bg-white/95 backdrop-blur-2xl` for sticky header, floating action bars, and modal sheets.
- **Footer & Contrast Blocks**: `bg-slate-950` with `border-t border-slate-850`.

### Status Indicators
- **Privacy & Security**: Emerald (`#10B981` / `bg-emerald-50 text-emerald-700 border-emerald-200`).
- **Processing / Active**: Brand Crimson (`#E5322D` with subtle pulsing animation).
- **Completed**: Emerald (`#10B981` with celebratory micro-confetti for major tasks).

---

## 3. Typography Hierarchy

| Level | Size | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `text-4xl sm:text-5xl` | `font-black (900)` | `-0.03em` | Tool name & page title |
| **Section H2** | `text-2xl sm:text-3xl` | `font-black (900)` | `-0.02em` | How-To, FAQs, Category headers |
| **Card H3** | `text-base sm:text-lg` | `font-extrabold (800)` | `-0.01em` | Tool card titles & feature titles |
| **Body Large**| `text-base sm:text-lg` | `font-medium (500)` | `normal` | Hero subtitles & intros |
| **Body Small**| `text-xs sm:text-sm` | `font-medium (500)` | `normal` | Paragraphs, descriptions, FAQs |
| **Mono Meta** | `text-xs` | `font-mono (500)` | `normal` | File size, page range, Bates numbers |
| **Micro Tag** | `text-[10px] sm:text-xs`| `font-bold (700)` | `0.05em (caps)` | Category labels & status tags |

---

## 4. Component Blueprints

### A. 3-Step Progress Stepper
A compact, pill-shaped progress indicator placed above the hero H1:
```tsx
<div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-[11px] font-bold">
  <span className={stage === "upload" ? "bg-brand-600 text-white px-3 py-1 rounded-xl shadow-xs" : "text-slate-400 px-3 py-1"}>
    1. Upload
  </span>
  <ChevronRight className="w-3 h-3 text-slate-300" />
  <span className={stage === "workspace" ? "bg-brand-600 text-white px-3 py-1 rounded-xl shadow-xs" : "text-slate-400 px-3 py-1"}>
    2. Configure
  </span>
  <ChevronRight className="w-3 h-3 text-slate-300" />
  <span className={stage === "result" ? "bg-emerald-600 text-white px-3 py-1 rounded-xl shadow-xs" : "text-slate-400 px-3 py-1"}>
    3. Download
  </span>
</div>
```

### B. Drag-and-Drop File Uploader
The primary entry point on every tool:
- Generous padding (`py-16 sm:py-24`).
- Dashed border (`border-2 border-dashed border-slate-200 hover:border-brand-400`).
- Prominent Red Action CTA (`btn-primary text-base px-8 py-4 rounded-2xl shadow-lg shadow-brand-500/25`).
- Subtitle reassurance: *"100% on-device processing. No files leave your computer."*

### C. Workspace & Page Grid
- **Page Cards**: White cards with soft drop shadow, displaying page number in top-left badge.
- **Action Toolbar**: Floating pill toolbar (`sticky bottom-6 mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-2.5 shadow-xl`).
- **Interactive Controls**: Drag handle, 90° rotate button, delete button with red hover state.

### D. Result & Download Screen
- Success metric badge (e.g. *92% Smaller! 14.2 MB &rarr; 1.1 MB*).
- Primary Download Button with download icon and file size.
- Quick secondary actions: *"Download as ZIP"*, *"Start Over"*, *"Convert to another format"*.

### E. Trust & Compliance Strip
Three-column icon block on white background with 1px border:
1. **Instant Browser Execution** (WebAssembly icon, zero server latency).
2. **100% Privacy Guaranteed** (Shield icon, HIPAA & CCPA compliant).
3. **Free & Limitless** (Sparkles icon, no watermarks, no mandatory login).

---

## 5. Keyboard-First & Power-User Standards (Raycast Synergy)

Where applicable in workspaces, provide intuitive keyboard shortcuts:
- `Ctrl+K` / `Cmd+K`: Quick Tool Switcher modal.
- `Space`: Quick Preview of selected page thumbnail.
- `Delete` / `Backspace`: Remove selected page(s).
- `R`: Rotate selected page(s) 90° clockwise.
- `Cmd+Z` / `Ctrl+Z`: Undo last action in organizer / editor.

Visual shortcut hint:
```tsx
<kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
  ⌘K
</kbd>
```

---

## 6. Do's and Don'ts

### DO:
- **DO** use `rounded-3xl` for main page containers and `rounded-2xl` for interactive cards and buttons.
- **DO** maintain 100% client-side privacy messaging on all file upload and configuration screens.
- **DO** use subtle 1px borders (`border-slate-200/80`) to give structure to white cards against the `slate-50/60` background.
- **DO** format file sizes cleanly with one decimal place (`14.2 MB`, `198 KB`).
- **DO** ensure all buttons have tactile active/hover states with smooth `transition-all duration-150`.

### DON'T:
- **DON'T** use heavy, saturated dark themes on public marketing pages; reserve deep slate (`bg-slate-950`) strictly for the footer.
- **DON'T** introduce slow modal animations or blocking progress spinners for operations that finish in under 100ms.
- **DON'T** add generic stock vector illustrations; always prefer miniature, real-looking product UI previews.
- **DON'T** hide primary action buttons below the fold on mobile screens.
