"use client";

import { motion, useInView } from "framer-motion";
import { FileStack, Gauge, ShieldCheck, FileCheck2, Clock3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { DocumentHistory } from "@/components/dashboard/document-history";
import { DocumentUploader } from "@/components/dashboard/document-uploader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDocumentHistory } from "@/lib/documents/storage";
import type { DocumentHistoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─── Capability stats ────────────────────────────────────────────────────── */
const capabilities = [
  {
    label: "Mode Ekstraksi",
    value: "2 Layer",
    helper: "PDF-parse + PDF.js tata letak",
    icon: FileStack,
    accent: "text-blue-400",
  },
  {
    label: "Level Risiko",
    value: "3 Tier",
    helper: "Tinggi · Sedang · Aman",
    icon: Gauge,
    accent: "text-amber-400",
  },
  {
    label: "Validasi Hukum",
    value: "Aktif",
    helper: "Sinyal ketenagakerjaan terdeteksi",
    icon: ShieldCheck,
    accent: "text-emerald-400",
  },
];

/* ─── Dynamic summary from history ──────────────────────────────────────── */
function useDashboardSummary() {
  const [items, setItems] = useState<DocumentHistoryItem[]>([]);

  useEffect(() => {
    setItems(getDocumentHistory());
  }, []);

  const totalContracts = items.length;
  const highRiskCount = items.filter((i) => i.redFlagCount > 0).length;
  const avgScore =
    items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.safetyScore, 0) / items.length)
      : null;

  return { items, totalContracts, highRiskCount, avgScore };
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function DashboardWorkspace() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { totalContracts, highRiskCount, avgScore } = useDashboardSummary();

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:py-14">

        {/* ── Page header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-2"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Ruang Analisis
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Unggah kontrak kerja dan lihat peta risikonya.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
            HukumVibe mengekstrak isi PDF, memvalidasi sinyal hukum ketenagakerjaan,
            lalu menyusun temuan yang bisa ditelusuri kembali ke klausul asli.
          </p>
        </motion.div>

        {/* ── Capability cards ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className="mt-8 grid gap-3 sm:grid-cols-3"
        >
          {capabilities.map(({ label, value, helper, icon: Icon, accent }) => (
            <div
              key={label}
              className={cn(
                "group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4",
                // Hover refinement — border brightens, no transform
                "transition-[border-color] duration-150 hover:border-zinc-700",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">{label}</span>
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    "transition-transform duration-200 ease-out group-hover:scale-110",
                    accent,
                  )}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-0.5 text-xs text-zinc-600">{helper}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Activity summary strip (only when history exists) ─────── */}
        {totalContracts > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <FileCheck2 className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
              <span>
                <span className="font-semibold text-zinc-300">{totalContracts}</span>{" "}
                kontrak dianalisis
              </span>
            </div>
            {highRiskCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-zinc-300">{highRiskCount}</span>{" "}
                  dengan risiko tinggi
                </span>
              </div>
            )}
            {avgScore !== null && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>
                  Rata-rata skor keamanan{" "}
                  <span className="font-semibold text-zinc-300">{avgScore}</span>
                </span>
              </div>
            )}
            <Link
              href="#history"
              className="ml-auto flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-zinc-300"
            >
              Lihat riwayat
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </motion.div>
        )}

        {/* ── Upload zone ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
          className="mt-6"
        >
          <DocumentUploader />
        </motion.div>

        {/* ── Quick guide strip ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="mt-4 grid grid-cols-3 gap-2 text-center"
        >
          {[
            { step: "01", label: "Unggah PDF kontrak" },
            { step: "02", label: "AI menganalisis klausul" },
            { step: "03", label: "Baca peta risiko" },
          ].map(({ step, label }) => (
            <div
              key={step}
              className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/50">
                {step}
              </span>
              <span className="text-xs font-medium text-zinc-400">{label}</span>
            </div>
          ))}
        </motion.div>

        <Separator className="my-8" />

        {/* ── History section ───────────────────────────────────────── */}
        <section
          id="history"
          ref={ref}
          aria-labelledby="history-heading"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="history-heading"
                className="text-base font-semibold text-white"
              >
                Riwayat analisis
              </h2>
              <p className="mt-0.5 text-xs text-zinc-600">
                Tersimpan di browser ini · Tidak diunggah ke server
              </p>
            </div>

            {totalContracts > 0 && (
              <div className="flex items-center gap-1 text-xs text-zinc-600">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                {totalContracts} dokumen
              </div>
            )}
          </div>

          <DocumentHistory />
        </section>

      </div>
    </div>
  );
}
