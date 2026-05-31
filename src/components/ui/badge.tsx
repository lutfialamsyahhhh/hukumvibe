import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HukumVibe Badge — Semantic status & label system
 *
 * Design principles:
 * - Muted, enterprise-grade colors (no harsh bright backgrounds)
 * - Consistent pill shape with soft border
 * - Generous horizontal padding for legibility
 * - Icon + text gap precisely aligned to text baseline
 * - Never feels "alarming" — informative and calm
 */
const badgeVariants = cva(
  [
    // Shape
    "inline-flex items-center gap-1.5 rounded-full border",
    // Spacing — generous px for pill feel, tight py for compactness
    "px-2.5 py-0.5",
    // Typography
    "text-[11px] font-medium leading-none tracking-wide",
    // Behavior — min-w-0 allows truncation when className="truncate" is passed
    "select-none",
    "transition-colors duration-150",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default — blue. Primary tagging & informational. */
        default:
          "bg-blue-500/8 text-blue-400 border-blue-500/15",

        /** Secondary — zinc neutral. Metadata & contract type. */
        secondary:
          "bg-zinc-800/80 text-zinc-400 border-zinc-700/60",

        /** Outline — ghost. Minimal context tags. */
        outline:
          "bg-transparent text-zinc-500 border-zinc-700/50",

        /** Muted — for disabled / inactive states. */
        muted:
          "bg-zinc-900 text-zinc-600 border-zinc-800",

        /**
         * SAFE / Low risk — emerald.
         * Calm, not celebratory. Reads as "no action needed."
         */
        safe:
          "bg-emerald-500/8 text-emerald-400 border-emerald-500/15",

        /**
         * MEDIUM / Moderate risk — amber.
         * Warm caution. Reads as "worth reviewing."
         */
        medium:
          "bg-amber-500/8 text-amber-400 border-amber-500/15",

        /**
         * HIGH / Critical risk — rose.
         * Muted rose, NOT bright red. Reads as "needs attention"
         * without being alarming or creating visual noise.
         */
        high:
          "bg-rose-500/8 text-rose-400 border-rose-500/15",

        /**
         * Warning — distinct from high risk.
         * Used for count indicators e.g. "2 tinggi".
         * Slightly more prominent than high variant.
         */
        warning:
          "bg-rose-500/10 text-rose-300 border-rose-400/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> { }

/**
 * Usage examples:
 * <Badge variant="safe">Aman</Badge>
 * <Badge variant="high"><AlertTriangle className="h-3 w-3" /> Risiko Tinggi</Badge>
 * <Badge variant="warning"><AlertTriangle className="h-3 w-3" /> 2 tinggi</Badge>
 * <Badge variant="secondary">PKWT</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
