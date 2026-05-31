import * as React from "react";

import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** Optional extra className on the shell wrapper */
  className?: string;
}

/**
 * HukumVibe AppShell — Main content area wrapper
 * Accounts for:
 *  - Navbar height (h-14 = 3.5rem)
 *  - Mobile bottom tab bar (≈ 72px + safe area) via pb-20 md:pb-0
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "min-h-[calc(100svh-3.5rem)]",
        "bg-zinc-950",
        // Push content above the fixed bottom tab bar on mobile
        "pb-20 md:pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
