"use client";

import { motion, useInView } from "framer-motion";
import {
  FileSearch,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const capabilities = [
  {
    icon: ShieldCheck,
    title: "Validasi dokumen lebih dulu",
    copy: "PDF diperiksa untuk memastikan isinya relevan dengan kontrak kerja Indonesia sebelum analisis berjalan.",
    accent: "text-blue-400",
    bg: "bg-blue-500/8",
  },
  {
    icon: FileSearch,
    title: "Temuan terhubung ke sumber",
    copy: "Setiap kartu risiko menyimpan kutipan klausul agar Anda bisa mengecek konteksnya tanpa menebak-nebak.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/8",
  },
  {
    icon: Scale,
    title: "Rujukan hukum yang tertata",
    copy: "Analisis mengacu pada UU Ketenagakerjaan, Cipta Kerja, PKWT, pengupahan, lembur, dan PHK.",
    accent: "text-amber-400",
    bg: "bg-amber-500/8",
  },
  {
    icon: LockKeyhole,
    title: "Ruang kerja privat",
    copy: "Riwayat analisis tersimpan di browser Anda, sementara kunci API tetap berada di sisi server.",
    accent: "text-zinc-400",
    bg: "bg-zinc-700/30",
  },
];

/* ─── Bento Card ────────────────────────────────────────────────────────── */
function CapabilityCard({
  icon: Icon,
  title,
  copy,
  accent,
  bg,
  delay,
}: (typeof capabilities)[0] & { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0, 0, 0.2, 1], delay }}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl",
        "border border-zinc-800 bg-zinc-900",
        "p-6",
        // Narrow transition for instant color feedback
        "transition-[border-color,background-color] duration-150 hover:border-zinc-700 hover:bg-zinc-800/60",
      )}
    >
      {/* Icon — scales up gently on card hover */}
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          "will-change-transform transition-transform duration-200 ease-out",
          "group-hover:scale-110",
          bg,
        )}
      >
        <Icon className={cn("h-5 w-5", accent)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-500">{copy}</p>
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
export function LandingCapabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-t border-zinc-800 bg-zinc-950"
      aria-labelledby="capabilities-heading"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">

        {/* Header */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-widest text-blue-500"
          >
            Dirancang untuk ketenangan
          </motion.p>
          <motion.h2
            id="capabilities-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.07 }}
            className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Teknologi hukum yang terasa rapi, bukan rumit.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="mt-4 text-sm leading-relaxed text-zinc-500"
          >
            HukumVibe mengubah kontrak kerja yang padat menjadi daftar risiko yang mudah
            ditinjau, tanpa menghilangkan jejak klausul asli.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.title} {...cap} delay={i * 0.06} />
          ))}
        </div>

      </div>
    </section>
  );
}
