"use client";

import { BookOpenCheck, FileCheck2, Home, ListChecks, Menu, Scale, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",           label: "Beranda",       icon: Home },
  { href: "/cara-kerja", label: "Cara Kerja",    icon: ListChecks },
  { href: "/library",    label: "Perpustakaan",  icon: BookOpenCheck },
  { href: "/analyze",    label: "Analisis",      icon: FileCheck2 },
];

function useActiveHref() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/* ─── Desktop / Tablet top bar ───────────────────────────────────────────── */
export function Navbar() {
  const isActive = useActiveHref();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-[200]",
          "bg-zinc-950/90 backdrop-blur-xl",
          "border-b border-zinc-800/60",
          "transition-[border-color] duration-150",
        )}
      >
        <div className="flex h-14 max-w-7xl mx-auto items-center justify-between gap-4 px-4 md:px-6 lg:px-8">

          {/* ── Brand ──────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            aria-label="HukumVibe — Beranda"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-blue-600 text-white shadow-sm",
                "transition-[transform,background-color] duration-150 ease-out",
                "will-change-transform",
                "hover:bg-blue-500 hover:scale-105 active:scale-95",
              )}
            >
              <Scale className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-white tracking-tight">
              HukumVibe
            </span>
          </Link>

          {/* ── Desktop nav links ───────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Navigasi utama"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm",
                  "font-medium tracking-tight",
                  "transition-[color,background-color] duration-150 ease-smooth",
                  "outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70",
                  isActive(item.href) && "text-white bg-zinc-800 ring-1 ring-zinc-700",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ───────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Desktop CTA */}
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/analyze">
                <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                Mulai Analisis
              </Link>
            </Button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={cn(
                "md:hidden",
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "border border-zinc-800 bg-zinc-900 text-zinc-400",
                "transition-[color,background-color,border-color] duration-150",
                "hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              )}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen
                ? <X className="h-4 w-4" aria-hidden="true" />
                : <Menu className="h-4 w-4" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ──────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[199] bg-zinc-950/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu navigasi"
        aria-modal="true"
        className={cn(
          "fixed inset-x-0 top-14 z-[200] md:hidden",
          "border-b border-zinc-800 bg-zinc-950",
          "transition-[opacity,transform] duration-200 ease-out",
          mobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <nav
          className="flex flex-col px-4 py-3 gap-1"
          aria-label="Navigasi mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5",
                "text-sm font-medium",
                "transition-[color,background-color] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isActive(item.href)
                  ? "bg-zinc-800 text-white ring-1 ring-zinc-700"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive(item.href) ? "text-blue-400" : "text-zinc-500",
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          ))}

          {/* CTA row */}
          <div className="mt-1 border-t border-zinc-800 pt-3 pb-1">
            <Button asChild className="w-full" size="sm">
              <Link href="/analyze">
                <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                Mulai Analisis
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* ── Mobile bottom tab bar ────────────────────────────────────── */}
      {/* Always visible on mobile as persistent primary nav */}
      <nav
        className={cn(
          "fixed bottom-0 inset-x-0 z-[199] md:hidden",
          "border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl",
          "safe-area-inset-bottom",
        )}
        aria-label="Navigasi bawah"
      >
        <div className="grid grid-cols-4 px-2 py-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1",
                  "transition-[color,background-color] duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  active
                    ? "text-blue-400"
                    : "text-zinc-600 hover:text-zinc-400",
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    active && "scale-110",
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  active ? "text-blue-400" : "text-zinc-600",
                )}>
                  {item.label === "Perpustakaan" ? "Hukum" : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
