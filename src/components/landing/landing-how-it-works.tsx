"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, MessageSquare, ScanSearch, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Steps data ────────────────────────────────────────────────────────── */
const steps = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Unggah kontrak PDF",
    copy: "Masukkan dokumen kontrak kerja Anda. HukumVibe mengekstrak teks dan menilai kualitas baca dokumen secara otomatis.",
    accent: "border-blue-500/30 bg-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    step: "02",
    icon: ScanSearch,
    title: "Baca peta risiko",
    copy: "Temuan dikelompokkan menjadi risiko tinggi, sedang, atau aman lengkap dengan alasan dan rujukan hukum yang spesifik.",
    accent: "border-amber-500/30 bg-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Tindak lanjuti dengan percaya diri",
    copy: "Gunakan saran pertanyaan dan AI Legal Assistant untuk memahami klausul gaji, PKWT, lembur, cuti, atau PHK secara mendalam.",
    accent: "border-emerald-500/30 bg-emerald-500/5",
    iconColor: "text-emerald-400",
  },
];

/* ─── Step card ──────────────────────────────────────────────────────────── */
function StepCard({
  step,
  icon: Icon,
  title,
  copy,
  accent,
  iconColor,
  index,
}: (typeof steps)[0] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0, 0, 0.2, 1], delay: index * 0.1 }}
      className={cn(
        "group relative flex gap-5 rounded-xl border p-5",
        accent,
      )}
    >
      {/* Step icon — gentle scale on hover */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "border border-zinc-700 bg-zinc-900",
            "will-change-transform transition-transform duration-200 ease-out",
            "group-hover:scale-110",
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
        </div>
        {/* Connector line */}
        {index < steps.length - 1 && (
          <div className="mt-3 h-full w-px bg-zinc-800" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 pt-1 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Langkah {step}
        </p>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-500">{copy}</p>
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export function LandingHowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-t border-zinc-800 bg-zinc-950"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20">

          {/* ── Left: copy ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-0">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-widest text-blue-500"
            >
              Cara Kerja
            </motion.p>

            <motion.h2
              id="how-heading"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.07 }}
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Dari PDF ke keputusan yang lebih jelas.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="mt-4 text-sm leading-relaxed text-zinc-500 max-w-[44ch]"
            >
              Alur HukumVibe dirancang untuk membantu Anda membaca kontrak secara
              bertahap: dari validasi dokumen, penilaian risiko, hingga tanya jawab
              lanjutan bersama AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="mt-8"
            >
              <Button asChild variant="secondary">
                <Link href="/cara-kerja">
                  Pelajari Alurnya
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>

            {/* ── Stat indicators ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-8"
            >
              {[
                { stat: "3 langkah", label: "dari upload ke hasil" },
                { stat: "< 60 detik", label: "estimasi waktu analisis" },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex flex-col gap-1">
                  <span className="text-xl font-semibold tracking-tight text-white">
                    {stat}
                  </span>
                  <span className="text-xs text-zinc-600">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Steps ───────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <StepCard key={step.step} {...step} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
