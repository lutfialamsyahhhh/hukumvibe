"use client";

import { BookOpenCheck, FileSearch, Home, ListChecks, Scale } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/",           label: "Beranda",           icon: Home },
  { href: "/cara-kerja", label: "Cara Kerja",         icon: ListChecks },
  { href: "/library",    label: "Perpustakaan Hukum", icon: BookOpenCheck },
  { href: "/analyze",    label: "Analisis",           icon: FileSearch },
];

/**
 * HukumVibe Sidebar — Enterprise app navigation
 * Linear-inspired · Clean hierarchy · Professional active states
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex",
        "w-56 shrink-0 flex-col",
        // Surface — zinc-950 to contrast main content
        "bg-zinc-950 border-r border-zinc-800",
        "min-h-screen",
      )}
    >
      <div className="sticky top-0 flex h-screen flex-col">

        {/* ── Brand Header ──────────────────────────────────────── */}
        <Link
          href="/"
          className={cn(
            "flex h-14 items-center gap-2.5 border-b border-zinc-800 px-4",
            "outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
            "transition-opacity duration-150 hover:opacity-90",
          )}
          aria-label="HukumVibe — Beranda"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shrink-0">
            <Scale className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-white tracking-tight">
            HukumVibe
          </span>
        </Link>

        {/* ── Navigation ────────────────────────────────────────── */}
        <nav
          className="flex flex-1 flex-col gap-0.5 px-2 py-3"
          aria-label="Navigasi sidebar"
        >
          {/* Section label */}
          <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 select-none">
            Menu
          </p>

          {items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // Base
                  "group flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                  "text-sm font-medium tracking-tight",
                  "transition-all duration-150 ease-smooth",
                  "outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  // Inactive
                  "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/70",
                  // Active — clear blue accent
                  active
                    ? "text-white bg-zinc-800 ring-1 ring-zinc-700"
                    : "",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-150",
                    active ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300",
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer — legal disclaimer ─────────────────────────── */}
        <div className="border-t border-zinc-800 p-4">
          <p className="text-[11px] leading-[1.6] text-zinc-600">
            Selalu verifikasi analisis AI dengan penasihat hukum berlisensi untuk keputusan penting.
          </p>
        </div>

      </div>
    </aside>
  );
}
