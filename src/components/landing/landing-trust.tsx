"use client";

import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const features = [
  "Analisis berbasis Gemini Pro model AI terdepan Google",
  "Referensi pasal UU Ketenagakerjaan & PP terkini",
  "Tidak menyimpan dokumen Anda di server",
  "Tersedia dalam Bahasa Indonesia yang lugas",
  "Laporan risiko terstruktur dalam tiga level keparahan",
  "Terintegrasi dengan AI Legal Assistant untuk tanya jawab lanjutan",
];

const legalAreas = [
  "PKWT / PKWTT",
  "Pengupahan & Lembur",
  "Cuti & Izin",
  "Pemutusan Hubungan Kerja",
  "Jaminan Sosial (BPJS)",
  "Klausul Non-Kompetisi",
];

/**
 * LandingTrust — Social proof and feature credibility section
 */
export function LandingTrust() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t border-zinc-800 bg-zinc-900/40"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

          {/* ── Left: Feature checklist ─────────────────────────────── */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-widest text-blue-500"
            >
              Mengapa HukumVibe
            </motion.p>

            <motion.h2
              id="trust-heading"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.07 }}
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Dibangun khusus untuk kontrak kerja Indonesia.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="mt-4 text-sm leading-relaxed text-zinc-500 max-w-[44ch]"
            >
              Bukan alat hukum generik. HukumVibe dirancang dengan konteks
              regulasi ketenagakerjaan Indonesia secara spesifik.
            </motion.p>

            <ul className="mt-8 flex flex-col gap-3" aria-label="Fitur utama">
              {features.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm text-zinc-400"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                    aria-hidden="true"
                  />
                  {feat}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Right: Legal coverage card ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={cn(
              "rounded-xl border border-zinc-800 bg-zinc-900 p-6 md:p-8",
              "flex flex-col gap-6",
            )}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Cakupan Analisis
              </p>
              <h3 className="mt-2 text-base font-semibold text-white">
                Area hukum yang dianalisis
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Setiap temuan dikaitkan dengan klausul kontrak aktual
                dan peraturan perundang-undangan yang berlaku.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {legalAreas.map((area, i) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.04 }}
                  className={cn(
                    "rounded-lg border border-zinc-800 bg-zinc-800/50",
                    "px-3 py-2",
                    "text-xs font-medium text-zinc-400",
                  )}
                >
                  {area}
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="border-t border-zinc-800 pt-4 text-xs leading-relaxed text-zinc-600">
              HukumVibe adalah alat bantu edukasi hukum. Untuk keputusan hukum
              yang mengikat, selalu konsultasikan dengan advokat berlisensi.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
