import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * HukumVibe Textarea — Premium multi-line input
 * Consistent with Input: same surface, border, focus system.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        // Layout
        "flex min-h-[96px] w-full",
        // Shape
        "rounded-lg",
        // Surface
        "bg-zinc-900 border border-zinc-700",
        // Spacing
        "px-3 py-2.5",
        // Typography
        "text-sm text-zinc-100 placeholder:text-zinc-500 leading-relaxed",
        "tracking-[-0.01em]",
        // Transitions
        "transition-all duration-150 ease-smooth",
        // Focus — mirrors Input focus system
        "focus-visible:outline-none",
        "focus-visible:border-blue-500/70 focus-visible:ring-2 focus-visible:ring-blue-500/20",
        // Hover
        "hover:border-zinc-600",
        // Resize — vertical only, predictable layout
        "resize-y",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-zinc-950",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
