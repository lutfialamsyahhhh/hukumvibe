import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * HukumVibe Button — Premium enterprise variant system
 * Inspired by Linear, Vercel, Stripe
 */
const buttonVariants = cva(
  // Base — shared across all variants
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium text-sm tracking-[-0.01em]",
    "rounded-lg border border-transparent",
    // Motion — crisp, premium, no bounce
    "transition-all duration-150 ease-smooth",
    "will-change-transform",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:pointer-events-none disabled:opacity-40 disabled:will-change-auto",
    "select-none",
    // Crisp active press — no spring, just clean deceleration
    "active:scale-[0.975] active:duration-75",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Primary — solid blue fill. Main CTA. */
        default: [
          "bg-blue-600 text-white border-blue-600",
          "hover:bg-blue-500 hover:border-blue-500 hover:shadow-md",
          "shadow-sm",
        ].join(" "),

        /** Secondary — zinc surface. Supporting actions. */
        secondary: [
          "bg-zinc-800 text-zinc-100 border-zinc-700",
          "hover:bg-zinc-700 hover:border-zinc-600 hover:text-white",
        ].join(" "),

        /** Outline — bordered ghost. Mid-weight actions. */
        outline: [
          "bg-transparent text-zinc-200 border-zinc-700",
          "hover:bg-zinc-800 hover:text-white hover:border-zinc-600",
        ].join(" "),

        /** Ghost — invisible until interacted. Tertiary actions. */
        ghost: [
          "bg-transparent text-zinc-400 border-transparent",
          "hover:bg-zinc-800 hover:text-zinc-100",
        ].join(" "),

        /** Destructive — rose danger. Irreversible actions. */
        destructive: [
          "bg-rose-600 text-white border-rose-600",
          "hover:bg-rose-500 hover:border-rose-500",
          "shadow-sm",
        ].join(" "),

        /** Link — text-only. Navigation-style. */
        link: [
          "bg-transparent text-blue-400 border-transparent underline-offset-4",
          "hover:text-blue-300 hover:underline",
          "px-0 h-auto",
        ].join(" "),
      },

      size: {
        xs:      "h-7 rounded-md px-2.5 py-1 text-xs gap-1.5",
        sm:      "h-8 rounded-lg px-3 py-1.5 text-sm",
        default: "h-9 px-4 py-2 text-sm",
        lg:      "h-10 rounded-lg px-5 py-2.5 text-sm font-semibold",
        xl:      "h-11 rounded-lg px-6 py-3 text-base font-semibold",
        icon:    "h-9 w-9 rounded-lg px-0",
        "icon-sm": "h-7 w-7 rounded-md px-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
