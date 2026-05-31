import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * HukumVibe Card — Enterprise surface hierarchy
 * Three elevation tiers: default (surface) → raised (elevated) → inset (recessed)
 */

// ─── Root Card ─────────────────────────────────────────────────────────────
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Visual elevation tier */
    variant?: "default" | "raised" | "inset" | "ghost";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    /** Default — zinc-900 surface with zinc-800 border */
    default: "bg-zinc-900 border border-zinc-800 shadow-card",
    /** Raised — slightly lighter surface, stronger shadow */
    raised:  "bg-zinc-800/70 border border-zinc-700/50 shadow-elevated",
    /** Inset — darker, recessed feel for nested content */
    inset:   "bg-zinc-950 border border-zinc-800",
    /** Ghost — invisible boundary, used in tight layouts */
    ghost:   "bg-transparent border border-zinc-800/50",
  } as const;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl text-zinc-100",
        // Motion — shadow & border transition only, no transform (cards don't lift by default)
        "transition-[box-shadow,border-color] duration-200 ease-out",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

// ─── Card Header ────────────────────────────────────────────────────────────
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 p-5 md:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ─── Card Title ─────────────────────────────────────────────────────────────
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-snug tracking-tight text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── Card Description ────────────────────────────────────────────────────────
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-relaxed text-zinc-400",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── Card Content ────────────────────────────────────────────────────────────
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0 md:p-6 md:pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ─── Card Footer ─────────────────────────────────────────────────────────────
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 border-t border-zinc-800 px-5 py-4 md:px-6",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
