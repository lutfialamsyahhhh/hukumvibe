"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  FileCheck2,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Fade helpers — calibrated for premium Apple-like reveal ─────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)" },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

/* ─── Trust strip items ─────────────────────────────────────────────────── */
const trustItems = [
  { icon: ShieldCheck, label: "Validasi PDF otomatis" },
  { icon: Scale,       label: "Referensi UU Ketenagakerjaan" },
  { icon: Sparkles,    label: "Analisis Gemini AI" },
  { icon: Zap,         label: "Hasil dalam hitungan detik" },
];

/**
 * LandingHero — Cinematic full-viewport hero
 * No background image dependency (pure CSS noise + gradient).
 */
export function LandingHero() {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        "bg-zinc-950",
        // Minimum height: full viewport minus navbar
        "min-h-[calc(100svh-3.5rem)]",
        "flex flex-col",
      )}
      aria-labelledby="hero-heading"
    >

      {/* ── Ambient background glow — subtle, not neon ─────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Radial glow — top left */}
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
        {/* Radial glow — bottom right */}
        <div className="absolute -bottom-48 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(215,20%,65%) 1px, transparent 1px), linear-gradient(90deg, hsl(215,20%,65%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="container relative mx-auto flex flex-1 flex-col justify-center px-4 py-16 sm:px-5 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-4xl">

          {/* Eyebrow badge */}
          <motion.div {...fadeUp(0)}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900 px-3.5 py-1.5">
              <span className="flex h-4 w-4 items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-subtle" />
              </span>
              <span className="text-xs font-medium tracking-wide text-zinc-400">
                Didukung Gemini AI · Hukum Ketenagakerjaan Indonesia
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            {...fadeUp(0.08)}
            className={cn(
              "text-balance",
              // Fluid scale: starts at 3xl on mobile, grows to 6xl on desktop
              "text-3xl font-semibold leading-[1.1] tracking-tighter text-white",
              "sm:text-5xl lg:text-6xl",
            )}
          >
            Pahami risiko kontrak kerja
            <br className="hidden sm:block" />
            <span className="text-gradient-blue"> sebelum Anda menandatangani.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-[52ch] text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            HukumVibe menganalisis PDF kontrak kerja Anda, menemukan klausul berisiko,
            dan menyajikannya dalam bahasa yang mudah dipahami — bukan bahasa langit.
          </motion.p>

          {/* CTA group */}
          <motion.div
            {...fadeUp(0.24)}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {/* Full-width on mobile, auto-width on sm+ */}
            <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
              <Link href="/analyze">
                <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Analisis Kontrak Gratis
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
              <Link href="/cara-kerja">
                Lihat Cara Kerja
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>

          {/* Micro trust note */}
          <motion.p {...fadeUp(0.32)} className="mt-5 text-xs text-zinc-600">
            Tidak perlu akun. Tidak ada data yang disimpan di server kami.
          </motion.p>

        </div>
      </div>

      {/* ── Trust strip ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative hidden border-t border-zinc-800/70 bg-zinc-900/50 backdrop-blur-sm sm:block"
      >
        <div className="container mx-auto grid grid-cols-2 gap-4 px-5 py-4 lg:px-8 sm:grid-cols-4">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-sm text-zinc-500"
            >
              <Icon className="h-4 w-4 shrink-0 text-blue-500/70" aria-hidden="true" />
              <span className="font-medium text-xs sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
