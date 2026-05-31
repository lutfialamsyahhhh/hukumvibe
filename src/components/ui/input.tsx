import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * HukumVibe Input — Premium enterprise text field
 * Spacious, readable, calm focus states. No harsh borders.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        // Layout
        "flex h-9 w-full",
        // Shape
        "rounded-lg",
        // Surface
        "bg-zinc-900 border border-zinc-700",
        // Spacing — generous horizontal padding for readability
        "px-3 py-2",
        // Typography
        "text-sm text-zinc-100 placeholder:text-zinc-500",
        "tracking-[-0.01em]",
        // Transitions — smooth, not instant
        "transition-all duration-150 ease-smooth",
        // Focus — blue ring, inset shadow for depth
        "focus-visible:outline-none",
        "focus-visible:border-blue-500/70 focus-visible:ring-2 focus-visible:ring-blue-500/20",
        "focus-visible:bg-zinc-900",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-300",
        // Hover — gentle border brightening
        "hover:border-zinc-600",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-zinc-950",
        // Read-only
        "read-only:bg-zinc-950 read-only:text-zinc-400",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
