import * as React from "react";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant */
  variant?: "default" | "text" | "circle" | "card";
}

/**
 * HukumVibe Skeleton — Premium loading placeholder
 * Uses pseudo-element sweep animation for GPU-composited shimmer.
 * No background-position animation (avoids paint).
 */
function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const variants = {
    default: "rounded-lg",
    text:    "rounded-md h-4",
    circle:  "rounded-full aspect-square",
    card:    "rounded-xl",
  } as const;

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Base surface
        "bg-zinc-800/80",
        // Pseudo-element sweep shimmer from globals.css
        "shimmer",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
