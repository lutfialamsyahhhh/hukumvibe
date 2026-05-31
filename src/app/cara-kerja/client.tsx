"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Bot,
  FileCheck2,
  FileText,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Shared motion primitives ───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0,  filter: "blur(0px)" },
  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const, delay },
});

/* ─── Scroll section hook ────────────────────────────────────────────────── */
function useSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, inView };
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const workflow = [
  {
    step: "01",
    icon: FileText,
    title: "Unggah dokumen kontrak kerja",
    copy: "Pilih file PDF hingga 12 MB. Sistem membaca teks, memisahkan halaman, dan menyiapkan pratinjau sumber untuk pelacakan klausul.",
    accent: "border-blue-500/20",
    bg: "bg-blue-500/5",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    connector: "bg-blue-500/20",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Validasi konteks hukum",
    copy: "HukumVibe mencari sinyal ketenagakerjaan — hubungan kerja, upah, PKWT, cuti, lembur, dan PHK — untuk memastikan relevansi dokumen.",
    accent: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    connector: "bg-emerald-500/20",
  },
  {
    step: "03",
    icon: FileCheck2,
    title: "Analisis risiko klausul",
    copy: "Temuan ditandai risiko tinggi, sedang, atau aman — dilengkapi ringkasan bahasa awam, rujukan hukum, dan langkah praktis.",
    accent: "border-amber-500/20",
    bg: "bg-amber-500/5",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    connector: "bg-amber-500/20",
  },
  {
    step: "04",
    icon: SearchCheck,
    title: "Lacak kutipan asli",
    copy: "Klik kartu risiko untuk menyorot potongan teks yang menjadi dasar temuan di tampilan dokumen asli — tanpa tebak-tebakan.",
    accent: "border-zinc-700/40",
    bg: "bg-zinc-800/30",
    iconColor: "text-zinc-400",
    iconBg: "bg-zinc-800 border-zinc-700",
    connector: "bg-zinc-700/40",
  },
  {
    step: "05",
    icon: Bot,
    title: "Tanya jawab lanjutan dengan AI",
    copy: "AI Legal Assistant menjelaskan isu seperti kompensasi PKWT, lembur, masa percobaan, upah, dan pemutusan hubungan kerja secara mendalam.",
    accent: "border-blue-500/20",
    bg: "bg-blue-500/5",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    connector: "",
  },
];

const principles = [
  {
    icon: MessageSquareText,
    title: "Bahasa yang jelas",
    copy: "Ringkasan risiko ditulis untuk pekerja, tim HR, dan pendiri usaha — bukan ahli hukum.",
    accent: "text-blue-400",
    bg: "bg-blue-500/8 border-blue-500/15",
  },
  {
    icon: ShieldCheck,
    title: "Konteks, bukan pengganti advokat",
    copy: "Rujukan hukum ditampilkan sebagai konteks dan panduan awal, bukan nasihat hukum yang mengikat.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/8 border-emerald-500/15",
  },
  {
    icon: Sparkles,
    title: "Privat dan lokal",
    copy: "Riwayat analisis tersimpan di browser Anda dan tidak dikirim ke server kami.",
    accent: "text-zinc-400",
    bg: "bg-zinc-800/60 border-zinc-700/40",
  },
];

/* ─── Timeline Step ──────────────────────────────────────────────────────── */
function TimelineStep({
  step, icon: Icon, title, copy,
  accent, bg, iconColor, iconBg, connector,
  index, inView,
}: (typeof workflow)[0] & { index: number; inView: boolean }) {
  const isLast = !connector;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.1 + index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Left: icon + connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            "will-change-transform transition-transform duration-200 ease-out",
            "group-hover:scale-105",
            iconBg,
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
        </div>
        {!isLast && (
          <div
            className={cn("mt-3 w-px flex-1", connector)}
            style={{ minHeight: "2.5rem" }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Right: content card */}
      <div
        className={cn(
          "group mb-4 flex-1 rounded-xl border p-5",
          "transition-[border-color] duration-150 hover:border-zinc-600",
          accent, bg,
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-white">
            {title}
          </h3>
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
            {step}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{copy}</p>
      </div>
    </motion.div>
  );
}

/* ─── Animated mockup card ───────────────────────────────────────────────── */
function MockupCard({ inView }: { inView: boolean }) {
  const risks = [
    {
      level: "TINGGI",
      color: "text-rose-400",
      dot: "bg-rose-500",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
      title: "Klausul Denda Pengunduran Diri",
      desc: "Dapat membebani pekerja secara tidak proporsional. Tinjau Pasal 62 PP No. 35/2021.",
      delay: 0.5,
    },
    {
      level: "SEDANG",
      color: "text-amber-400",
      dot: "bg-amber-500",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5",
      title: "Klausul Non-Compete Pasca-Kerja",
      desc: "Perlu dicermati batasannya. Rujuk ketentuan kebebasan bekerja dalam UU Ketenagakerjaan.",
      delay: 0.7,
    },
    {
      level: "AMAN",
      color: "text-emerald-400",
      dot: "bg-emerald-500",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      title: "Ketentuan Upah & Pembayaran",
      desc: "Sesuai dengan PP No. 36/2021 tentang pengupahan. Tidak ditemukan pelanggaran.",
      delay: 0.9,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.55, ease: [0, 0, 0.2, 1], delay: 0.25 }}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-workspace"
    >
      {/* Card chrome */}
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-5 py-3.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
            <MessageSquareText className="h-3 w-3 text-white" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold text-zinc-400">Contoh hasil analisis · Kontrak PKWT</p>
        </div>
      </div>

      {/* Score strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex items-center gap-3 border-b border-zinc-800/60 px-5 py-3"
      >
        <span className="text-xs text-zinc-600">Skor keamanan</span>
        <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={inView ? { width: "68%" } : {}}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.55 }}
            className="h-full rounded-full bg-amber-500"
          />
        </div>
        <span className="text-xs font-semibold text-zinc-400">68/100</span>
      </motion.div>

      {/* Risk cards */}
      <div className="space-y-2.5 p-4">
        {risks.map(({ level, color, dot, border, bg, title, desc, delay }) => (
          <motion.div
            key={level}
            initial={{ opacity: 0, x: 8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, ease: [0, 0, 0.2, 1], delay }}
            className={cn("rounded-xl border p-4", border, bg)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden="true" />
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", color)}>
                Risiko {level}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Source highlight strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.1 }}
        className="flex items-center gap-2 border-t border-zinc-800/60 px-5 py-3"
      >
        <SearchCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" aria-hidden="true" />
        <p className="text-xs text-zinc-600">
          Klik kartu untuk menyorot kutipan asli di dokumen
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main client component ──────────────────────────────────────────────── */
export function CaraKerjaClient() {
  const hero = useSection();
  const workflowSection = useSection();
  const principlesSection = useSection();
  const ctaSection = useSection();

  return (
    <main className="bg-zinc-950 pb-20 md:pb-0">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={hero.ref}
        className="border-b border-zinc-800"
        aria-labelledby="cara-kerja-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">

            {/* Left: copy */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={hero.inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4 }}
                className="text-xs font-semibold uppercase tracking-widest text-blue-500"
              >
                Cara Kerja
              </motion.p>

              <motion.h1
                id="cara-kerja-heading"
                {...fadeUp(0.07)}
                animate={hero.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                Analisis kontrak yang transparan dari awal sampai akhir.
              </motion.h1>

              <motion.p
                {...fadeUp(0.15)}
                animate={hero.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                className="mt-4 max-w-[48ch] text-sm leading-relaxed text-zinc-500"
              >
                HukumVibe tidak hanya memberi skor. Aplikasi ini menunjukkan
                alasan, rujukan, dan potongan klausul agar setiap temuan dapat
                diperiksa ulang secara mandiri.
              </motion.p>

              {/* Stat row */}
              <motion.div
                {...fadeIn(0.22)}
                animate={hero.inView ? { opacity: 1 } : {}}
                className="mt-8 flex items-center gap-6"
              >
                {[
                  { val: "5 langkah", label: "alur analisis" },
                  { val: "< 60 dtk", label: "waktu rata-rata" },
                  { val: "3 tier", label: "level risiko" },
                ].map(({ val, label }) => (
                  <div key={val} className="flex flex-col gap-0.5">
                    <span className="text-base font-semibold tracking-tight text-white">{val}</span>
                    <span className="text-xs text-zinc-600">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                {...fadeUp(0.28)}
                animate={hero.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/analyze">
                    Unggah Kontrak
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Link href="/library">Buka Perpustakaan Hukum</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: mockup card */}
            <MockupCard inView={hero.inView} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WORKFLOW TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={workflowSection.ref}
        className="border-b border-zinc-800"
        aria-labelledby="workflow-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">

          {/* Section header */}
          <div className="mx-auto max-w-xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={workflowSection.inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-widest text-blue-500"
            >
              Alur Produk
            </motion.p>
            <motion.h2
              id="workflow-heading"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={workflowSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.07 }}
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Lima langkah yang menjaga analisis tetap dapat ditelusuri.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={workflowSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.14 }}
              className="mt-3 text-sm leading-relaxed text-zinc-500"
            >
              Setiap langkah dirancang untuk memberikan transparansi penuh —
              dari dokumen mentah hingga rekomendasi yang terverifikasi.
            </motion.p>
          </div>

          {/* Timeline — single column with connector lines */}
          <div className="mt-12 grid gap-0 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Left column: steps 1,3,5 */}
            <div className="flex flex-col">
              {workflow.filter((_, i) => i % 2 === 0).map((step, colIdx) => {
                const globalIndex = colIdx * 2;
                return (
                  <TimelineStep
                    key={step.step}
                    {...step}
                    index={globalIndex}
                    inView={workflowSection.inView}
                  />
                );
              })}
            </div>
            {/* Right column: steps 2,4 — offset top for visual rhythm */}
            <div className="flex flex-col sm:mt-16">
              {workflow.filter((_, i) => i % 2 === 1).map((step, colIdx) => {
                const globalIndex = colIdx * 2 + 1;
                return (
                  <TimelineStep
                    key={step.step}
                    {...step}
                    index={globalIndex}
                    inView={workflowSection.inView}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={principlesSection.ref}
        className="border-b border-zinc-800"
        aria-labelledby="principles-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">

          {/* Section header */}
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={principlesSection.inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-widest text-blue-500"
            >
              Prinsip
            </motion.p>
            <motion.h2
              id="principles-heading"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={principlesSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.07 }}
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Membantu membaca, bukan menggantikan pertimbangan hukum.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={principlesSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.14 }}
              className="mt-3 text-sm leading-relaxed text-zinc-500 max-w-[42ch]"
            >
              HukumVibe dirancang sebagai alat literasi hukum. Selalu verifikasi
              temuan penting dengan advokat berlisensi.
            </motion.p>
          </div>

          {/* Principles grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, copy, accent, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={principlesSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.1 + i * 0.1 }}
                className={cn(
                  "group flex flex-col gap-4 rounded-xl border p-6",
                  "transition-[border-color] duration-150 hover:border-zinc-600",
                  bg,
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    "will-change-transform transition-transform duration-200 ease-out",
                    "group-hover:scale-110",
                    bg,
                  )}
                >
                  <Icon className={cn("h-4 w-4", accent)} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaSection.ref}
        aria-labelledby="cta-cara-kerja-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={ctaSection.inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Mulai sekarang
            </p>
            <h2
              id="cta-cara-kerja-heading"
              className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Siap membaca kontrak kerja Anda dengan lebih percaya diri?
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-relaxed text-zinc-500">
              Mulai dari satu PDF dan dapatkan peta risiko yang terverifikasi
              dalam hitungan detik. Tidak perlu akun, tidak ada biaya.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
                <Link href="/analyze">
                  <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Analisis Kontrak Sekarang
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
                <Link href="/library">
                  Perpustakaan Hukum
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-zinc-700">
              Tidak perlu mendaftar. Tidak ada dokumen yang disimpan di server kami.
            </p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
