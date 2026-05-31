import * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 percentage value */
  value: number;
  /** Color variant — maps to legal risk signal system */
  variant?: "default" | "safe" | "medium" | "high";
  /** Track height */
  size?: "sm" | "default" | "lg";
}

/**
 * HukumVibe Progress — Semantic risk-aware progress bar
 */
export function Progress({
  value,
  variant = "default",
  size = "default",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), 100);

  const trackSizes = {
    sm:      "h-1",
    default: "h-1.5",
    lg:      "h-2",
  } as const;

  const fillColors = {
    default: "bg-blue-500",
    safe:    "bg-emerald-500",
    medium:  "bg-amber-500",
    high:    "bg-rose-500",
  } as const;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-zinc-800",
        trackSizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          "will-change-[width]",
          fillColors[variant]
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
