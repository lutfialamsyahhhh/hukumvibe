import type { Config } from "tailwindcss";

/* =====================================================================
   HukumVibe — Tailwind Config
   Premium Enterprise AI SaaS · Extended Design Token System
   ===================================================================== */

const config: Config = {
  darkMode: ["class"],

  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}"
  ],

  theme: {
    /* ── Container — enterprise-grade centered layout ── */
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "3rem"
      },
      screens: {
        "2xl": "1280px"
      }
    },

    extend: {
      /* ──────────────────────────────────────────────────────────
         COLORS — mapped from CSS custom properties
         ────────────────────────────────────────────────────────── */
      colors: {
        /* Shadcn UI required aliases */
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },

        /* ── HukumVibe brand semantic tokens ── */
        hv: {
          bg:          "#09090b",  /* zinc-950 */
          surface:     "#18181b",  /* zinc-900 */
          elevated:    "#27272a",  /* zinc-800 */
          border:      "#27272a",  /* zinc-800 */
          "border-sub":"#3f3f46",  /* zinc-700 */
          text:        "#ffffff",
          "text-sec":  "#a1a1aa",  /* zinc-400 */
          "text-muted":"#71717a",  /* zinc-500 */
          accent:      "#3b82f6",  /* blue-500 */
          "accent-lt": "#60a5fa",  /* blue-400 */
          success:     "#10b981",  /* emerald-500 */
          warning:     "#f59e0b",  /* amber-500 */
          danger:      "#f43f5e",  /* rose-500 */
        },

        /* ── Signal system — legal risk levels ── */
        signal: {
          safe:    "#10b981",  /* emerald-500 */
          medium:  "#f59e0b",  /* amber-500 */
          high:    "#f43f5e",  /* rose-500 */
        },
      },

      /* ──────────────────────────────────────────────────────────
         FONT FAMILIES
         ────────────────────────────────────────────────────────── */
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system",
               "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "Fira Code",
               "ui-monospace", "monospace"],
      },

      /* ──────────────────────────────────────────────────────────
         FONT SIZES — fluid scale
         ────────────────────────────────────────────────────────── */
      fontSize: {
        "2xs":    ["0.625rem",  { lineHeight: "1rem" }],
        xs:       ["0.75rem",   { lineHeight: "1.25rem" }],
        sm:       ["0.875rem",  { lineHeight: "1.5rem" }],
        base:     ["1rem",      { lineHeight: "1.65rem" }],
        lg:       ["1.125rem",  { lineHeight: "1.75rem" }],
        xl:       ["1.25rem",   { lineHeight: "1.875rem" }],
        "2xl":    ["1.5rem",    { lineHeight: "1.875rem" }],
        "3xl":    ["1.875rem",  { lineHeight: "2.25rem" }],
        "4xl":    ["2.25rem",   { lineHeight: "2.5rem" }],
        "5xl":    ["3rem",      { lineHeight: "1.15" }],
        "6xl":    ["3.75rem",   { lineHeight: "1.1" }],
      },

      /* ──────────────────────────────────────────────────────────
         LETTER SPACING — headline-tight to normal
         ────────────────────────────────────────────────────────── */
      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.03em",
        tight:    "-0.02em",
        snug:     "-0.015em",
        normal:   "-0.011em",
        wide:     "0.01em",
        wider:    "0.05em",
        widest:   "0.08em",
      },

      /* ──────────────────────────────────────────────────────────
         BORDER RADIUS — from tokens
         ────────────────────────────────────────────────────────── */
      borderRadius: {
        sm:   "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl":"var(--radius-2xl)",
        full: "var(--radius-full)",
      },

      /* ──────────────────────────────────────────────────────────
         BOX SHADOWS — soft, elegant, depth-layered
         ────────────────────────────────────────────────────────── */
      boxShadow: {
        "xs":        "var(--shadow-xs)",
        "sm":        "var(--shadow-sm)",
        DEFAULT:     "var(--shadow-md)",
        "md":        "var(--shadow-md)",
        "lg":        "var(--shadow-lg)",
        "xl":        "var(--shadow-xl)",
        "2xl":       "var(--shadow-2xl)",
        "card":      "var(--shadow-card)",
        "elevated":  "var(--shadow-elevated)",
        "workspace": "var(--shadow-workspace)",
        /* Accent ring glow — blue only, used sparingly */
        "ring-blue": "0 0 0 3px hsl(217 91% 60% / 0.15)",
      },

      /* ──────────────────────────────────────────────────────────
         SPACING — consistent vertical rhythm
         ────────────────────────────────────────────────────────── */
      spacing: {
        "4.5":  "1.125rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "section": "8rem",
      },

      /* ──────────────────────────────────────────────────────────
         MAX WIDTHS — content and prose
         ────────────────────────────────────────────────────────── */
      maxWidth: {
        "prose":   "65ch",
        "content": "80ch",
        "reading": "72ch",
      },

      /* ──────────────────────────────────────────────────────────
         KEYFRAME ANIMATIONS — cinematic, purposeful
         ────────────────────────────────────────────────────────── */
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" }
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" }
        },
        "fade-down": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to:   { opacity: "1", transform: "translateY(0)" }
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(8px)", transform: "translateY(8px)" },
          to:   { opacity: "1", filter: "blur(0)",   transform: "translateY(0)" }
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" }
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to:   { opacity: "1", transform: "translateX(0)" }
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to:   { opacity: "1", transform: "translateX(0)" }
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" }
        },
        /* Accordion (Shadcn UI) */
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" }
        },
      },

      /* ──────────────────────────────────────────────────────────
         ANIMATION CLASSES — with cinematic durations
         ────────────────────────────────────────────────────────── */
      animation: {
        "fade-in":        "fade-in 250ms cubic-bezier(0,0,0.2,1) both",
        "fade-up":        "fade-up 400ms cubic-bezier(0,0,0.2,1) both",
        "fade-down":      "fade-down 400ms cubic-bezier(0,0,0.2,1) both",
        "blur-in":        "blur-in 600ms cubic-bezier(0,0,0.2,1) both",
        "scale-in":       "scale-in 250ms cubic-bezier(0,0,0.2,1) both",
        "slide-in-right": "slide-in-right 400ms cubic-bezier(0,0,0.2,1) both",
        "slide-in-left":  "slide-in-left 400ms cubic-bezier(0,0,0.2,1) both",
        "shimmer":        "shimmer 1.5s linear infinite",
        "pulse-subtle":   "pulse-subtle 2s ease-in-out infinite",
        "accordion-down": "accordion-down 200ms ease-out",
        "accordion-up":   "accordion-up 200ms ease-out",
      },

      /* ──────────────────────────────────────────────────────────
         TRANSITION DURATIONS & TIMING
         ────────────────────────────────────────────────────────── */
      transitionDuration: {
        "fast":      "150ms",
        "base":      "250ms",
        "slow":      "400ms",
        "cinematic": "600ms",
      },

      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "out":    "cubic-bezier(0, 0, 0.2, 1)",
        "in":     "cubic-bezier(0.4, 0, 1, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      /* ──────────────────────────────────────────────────────────
         OPACITY — semantic scale
         ────────────────────────────────────────────────────────── */
      opacity: {
        "2":  "0.02",
        "4":  "0.04",
        "6":  "0.06",
        "8":  "0.08",
        "12": "0.12",
        "15": "0.15",
        "35": "0.35",
        "45": "0.45",
        "55": "0.55",
        "65": "0.65",
        "85": "0.85",
        "95": "0.95",
      },

      /* ──────────────────────────────────────────────────────────
         Z-INDEX SCALE — semantic
         ────────────────────────────────────────────────────────── */
      zIndex: {
        "behind":   "-1",
        "base":     "0",
        "raised":   "10",
        "dropdown": "100",
        "sticky":   "200",
        "overlay":  "300",
        "modal":    "400",
        "toast":    "500",
        "tooltip":  "600",
      },
    }
  },

  plugins: [require("tailwindcss-animate")]
};

export default config;
