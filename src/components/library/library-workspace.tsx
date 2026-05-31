"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  FileCheck2,
  Scale,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const ALL_FILTER = "Semua";

const legalReferences = [
  {
    id: "uu-13-2003",
    title: "UU No. 13 Tahun 2003",
    shortTitle: "UU Ketenagakerjaan",
    category: "Undang-Undang",
    topic: "Ketenagakerjaan",
    status: "Rujukan Utama",
    statusVariant: "safe" as const,
    year: 2003,
    url: "https://peraturan.bpk.go.id/Home/Details/43013/kitab-undang-undang-hukum-pidana",
    summary:
      "Mengatur fondasi hubungan kerja, perlindungan pekerja, pengupahan, kesejahteraan, hubungan industrial, pengawasan, dan sanksi di bidang ketenagakerjaan Indonesia.",
    keyPoints: [
      "Syarat dan bentuk perjanjian kerja",
      "Perlindungan waktu kerja dan istirahat",
      "Hak pekerja atas upah dan tunjangan",
      "Tata cara pemutusan hubungan kerja",
    ],
    tags: ["Hubungan Kerja", "Hak Pekerja", "Pengawasan", "PKWT", "PHK"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "uu-6-2023",
    title: "UU No. 6 Tahun 2023",
    shortTitle: "UU Cipta Kerja",
    category: "Undang-Undang",
    topic: "Cipta Kerja",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2023,
    url: "https://peraturan.bpk.go.id/Home/Details/246523/uu-no-6-tahun-2023",
    summary:
      "Menetapkan Perpu No. 2 Tahun 2022 tentang Cipta Kerja menjadi undang-undang. Menjadi konteks penting perubahan aturan ketenagakerjaan modern Indonesia.",
    keyPoints: [
      "Perubahan ketentuan PKWT dan PKWTT",
      "Penyesuaian aturan pengupahan",
      "Kemudahan alih daya (outsourcing)",
      "Perubahan mekanisme pesangon PHK",
    ],
    tags: ["Cipta Kerja", "Perubahan Regulasi", "Kontrak", "Pesangon"],
    accentBorder: "border-l-emerald-500/50",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "pp-35-2021",
    title: "PP No. 35 Tahun 2021",
    shortTitle: "PP PKWT & PHK",
    category: "Peraturan Pemerintah",
    topic: "PKWT · Waktu Kerja · PHK",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2021,
    url: "https://peraturan.bpk.go.id/Details/161904/Pp-No-35-Tahun-2021",
    summary:
      "Memuat ketentuan PKWT, kompensasi pekerja kontrak, alih daya, waktu kerja, lembur, istirahat, tata cara PHK, pesangon, dan penggantian hak.",
    keyPoints: [
      "Jangka waktu dan perpanjangan PKWT",
      "Kompensasi saat PKWT berakhir",
      "Aturan lembur dan waktu istirahat",
      "Prosedur dan besaran pesangon PHK",
    ],
    tags: ["PKWT", "Lembur", "PHK", "Pesangon", "Alih Daya"],
    accentBorder: "border-l-amber-500/50",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "pp-36-2021",
    title: "PP No. 36 Tahun 2021",
    shortTitle: "PP Pengupahan",
    category: "Peraturan Pemerintah",
    topic: "Pengupahan",
    status: "Diubah",
    statusVariant: "medium" as const,
    year: 2021,
    url: "https://peraturan.bpk.go.id/Details/161909/pp-no-36-tahun-2021",
    summary:
      "Mengatur kebijakan pengupahan, struktur dan skala upah, upah minimum, pelindungan upah, cara pembayaran, dewan pengupahan, dan sanksi administratif.",
    keyPoints: [
      "Penetapan upah minimum provinsi dan kabupaten",
      "Struktur dan skala upah perusahaan",
      "Pelindungan upah dari pemotongan sepihak",
      "Tata cara dan waktu pembayaran upah",
    ],
    tags: ["Upah Minimum", "Struktur Upah", "Pembayaran", "Dewan Pengupahan"],
    accentBorder: "border-l-zinc-600/50",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-zinc-400",
    tagColor: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },
  {
    id: "pp-37-2021",
    title: "PP No. 37 Tahun 2021",
    shortTitle: "PP JKP",
    category: "Peraturan Pemerintah",
    topic: "Jaminan Kehilangan Pekerjaan",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2021,
    url: "https://peraturan.bpk.go.id/Home/Details/161919/pp-no-37-tahun-2021",
    summary:
      "Mengatur program JKP bagi pekerja yang mengalami PHK, termasuk manfaat uang tunai, akses informasi pasar kerja, pelatihan, kepesertaan, dan penyelenggaraan.",
    keyPoints: [
      "Kriteria penerima manfaat JKP",
      "Besaran dan durasi manfaat uang tunai",
      "Akses pelatihan kerja pasca-PHK",
      "Kepesertaan BPJS Ketenagakerjaan",
    ],
    tags: ["JKP", "PHK", "BPJS Ketenagakerjaan", "Pelatihan"],
    accentBorder: "border-l-zinc-600/50",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-zinc-400",
    tagColor: "text-zinc-400 bg-zinc-800 border-zinc-700",
  },
  {
    id: "uu-21-2000",
    title: "UU No. 21 Tahun 2000",
    shortTitle: "UU Serikat Pekerja",
    category: "Undang-Undang",
    topic: "Hubungan Industrial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2000,
    url: "https://peraturan.bpk.go.id/Details/45276/uu-no-21-tahun-2000",
    summary: "Mengatur kebebasan berserikat, pembentukan, dan perlindungan bagi serikat pekerja/buruh dalam memperjuangkan hak-hak pekerja di perusahaan.",
    keyPoints: [
      "Hak membentuk serikat pekerja",
      "Fungsi dan peran serikat pekerja",
      "Perlindungan hak berorganisasi",
      "Penyelesaian perselisihan"
    ],
    tags: ["Serikat Pekerja", "Hak Berorganisasi"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "uu-2-2004",
    title: "UU No. 2 Tahun 2004",
    shortTitle: "UU PPHI",
    category: "Undang-Undang",
    topic: "Hubungan Industrial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2004,
    url: "https://peraturan.bpk.go.id/Details/40722/uu-no-2-tahun-2004",
    summary: "Mengatur tata cara penyelesaian perselisihan hubungan industrial melalui musyawarah, mediasi, konsiliasi, arbitrase, hingga Pengadilan Hubungan Industrial.",
    keyPoints: [
      "Perselisihan hak dan kepentingan",
      "Perselisihan PHK",
      "Mekanisme bipartit dan tripartit",
      "Pengadilan Hubungan Industrial"
    ],
    tags: ["Perselisihan", "Mediasi", "PHI", "PHK"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "uu-40-2004",
    title: "UU No. 40 Tahun 2004",
    shortTitle: "UU SJSN",
    category: "Undang-Undang",
    topic: "Jaminan Sosial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2004,
    url: "https://peraturan.bpk.go.id/Details/40772/uu-no-40-tahun-2004",
    summary: "Sistem Jaminan Sosial Nasional yang memberikan kepastian perlindungan dan kesejahteraan sosial bagi seluruh rakyat Indonesia, termasuk pekerja.",
    keyPoints: [
      "Prinsip asuransi sosial dan ekuitas",
      "Program Jaminan Kesehatan",
      "Jaminan Kecelakaan Kerja & Kematian",
      "Jaminan Hari Tua & Pensiun"
    ],
    tags: ["Jaminan Sosial", "SJSN", "Kesejahteraan Pekerja"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "uu-24-2011",
    title: "UU No. 24 Tahun 2011",
    shortTitle: "UU BPJS",
    category: "Undang-Undang",
    topic: "Jaminan Sosial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2011,
    url: "https://peraturan.bpk.go.id/Details/39272/uu-no-24-tahun-2011",
    summary: "Membentuk Badan Penyelenggara Jaminan Sosial (BPJS Kesehatan dan BPJS Ketenagakerjaan) yang wajib bagi seluruh pekerja dan perusahaan.",
    keyPoints: [
      "Kewajiban pemberi kerja mendaftarkan pekerja",
      "Hak pekerja atas jaminan sosial",
      "Sanksi tidak mendaftar BPJS",
      "Fungsi dan tugas BPJS"
    ],
    tags: ["BPJS", "Kesehatan", "Ketenagakerjaan", "Kewajiban Perusahaan"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "uu-1-1970",
    title: "UU No. 1 Tahun 1970",
    shortTitle: "UU Keselamatan Kerja",
    category: "Undang-Undang",
    topic: "K3",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 1970,
    url: "https://peraturan.bpk.go.id/Details/47039/uu-no-1-tahun-1970",
    summary: "Aturan dasar keselamatan kerja di segala tempat kerja guna mencegah kecelakaan dan penyakit akibat kerja serta melindungi tenaga kerja.",
    keyPoints: [
      "Syarat-syarat keselamatan kerja",
      "Kewajiban pengurus/perusahaan",
      "Kewajiban dan hak tenaga kerja",
      "Pemeriksaan kesehatan badan"
    ],
    tags: ["K3", "Keselamatan", "Kecelakaan Kerja"],
    accentBorder: "border-l-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "pp-34-2021",
    title: "PP No. 34 Tahun 2021",
    shortTitle: "PP TKA",
    category: "Peraturan Pemerintah",
    topic: "Tenaga Kerja Asing",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2021,
    url: "https://peraturan.bpk.go.id/Details/161901/pp-no-34-tahun-2021",
    summary: "Mengatur syarat, prosedur, dan kewajiban penggunaan tenaga kerja asing di Indonesia agar tetap memprioritaskan tenaga kerja lokal.",
    keyPoints: [
      "Kewajiban memiliki RPTKA",
      "Pembatasan jabatan bagi TKA",
      "Kewajiban alih teknologi ke tenaga kerja lokal",
      "Dana Kompensasi Penggunaan TKA (DKPTKA)"
    ],
    tags: ["TKA", "Ekspatriat", "RPTKA"],
    accentBorder: "border-l-amber-500/50",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "pp-44-2015",
    title: "PP No. 44 Tahun 2015",
    shortTitle: "PP JKK & JKM",
    category: "Peraturan Pemerintah",
    topic: "Jaminan Sosial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2015,
    url: "https://peraturan.bpk.go.id/Details/5574/pp-no-44-tahun-2015",
    summary: "Penyelenggaraan Program Jaminan Kecelakaan Kerja (JKK) dan Jaminan Kematian (JKM) yang memberikan perlindungan atas risiko di tempat kerja.",
    keyPoints: [
      "Manfaat medis kecelakaan kerja",
      "Santunan cacat atau kematian",
      "Beasiswa bagi anak pekerja",
      "Iuran program JKK dan JKM"
    ],
    tags: ["JKK", "JKM", "Kecelakaan Kerja", "BPJS"],
    accentBorder: "border-l-amber-500/50",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "permenaker-6-2016",
    title: "Permenaker No. 6 Tahun 2016",
    shortTitle: "Permenaker THR",
    category: "Peraturan Menteri",
    topic: "THR",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2016,
    url: "https://jdih.kemnaker.go.id/katalog-1279-Peraturan%20Menteri.html",
    summary: "Mengatur Tunjangan Hari Raya (THR) Keagamaan bagi pekerja/buruh di perusahaan, termasuk pekerja dengan masa kerja 1 bulan.",
    keyPoints: [
      "Pekerja 1 bulan berhak THR proporsional",
      "Pembayaran maksimal H-7 hari raya",
      "Besaran THR pekerja harian lepas",
      "Denda keterlambatan pembayaran THR"
    ],
    tags: ["THR", "Tunjangan", "Hari Raya"],
    accentBorder: "border-l-emerald-500/50",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "permenaker-4-2022",
    title: "Permenaker No. 4 Tahun 2022",
    shortTitle: "Permenaker JHT",
    category: "Peraturan Menteri",
    topic: "Jaminan Sosial",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2022,
    url: "https://jdih.kemnaker.go.id/katalog-2258-Peraturan%20Menteri.html",
    summary: "Tata cara dan persyaratan pembayaran manfaat Jaminan Hari Tua (JHT), mengatur pencairan JHT bagi peserta yang resign, di-PHK, atau pensiun.",
    keyPoints: [
      "JHT dapat dicairkan saat resign atau PHK",
      "Pencairan tidak perlu menunggu usia pensiun",
      "Persyaratan dokumen pencairan JHT",
      "Mekanisme klaim online"
    ],
    tags: ["JHT", "Pencairan", "Resign", "PHK", "BPJS"],
    accentBorder: "border-l-emerald-500/50",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "permenaker-1-2017",
    title: "Permenaker No. 1 Tahun 2017",
    shortTitle: "Permenaker Skala Upah",
    category: "Peraturan Menteri",
    topic: "Pengupahan",
    status: "Berlaku",
    statusVariant: "safe" as const,
    year: 2017,
    url: "https://jdih.kemnaker.go.id/katalog-1406-Peraturan%20Menteri.html",
    summary: "Mewajibkan penyusunan dan penerapan struktur dan skala upah bagi perusahaan, berpedoman pada golongan, jabatan, dan masa kerja.",
    keyPoints: [
      "Wajib menyusun skala upah transparan",
      "Diberitahukan kepada seluruh pekerja",
      "Tahapan penyusunan struktur upah",
      "Sanksi bila tidak menyusun"
    ],
    tags: ["Struktur Upah", "Skala Upah", "Transparansi"],
    accentBorder: "border-l-emerald-500/50",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  }
];

/* ─── Filter categories ──────────────────────────────────────────────────── */
const CATEGORIES = [
  ALL_FILTER,
  "Undang-Undang",
  "Peraturan Pemerintah",
  "Peraturan Menteri"
];

const TOPIC_FILTERS = [
  ALL_FILTER,
  "PKWT",
  "PHK",
  "Lembur",
  "Pengupahan",
  "Cipta Kerja",
  "Jaminan Sosial",
  "Hubungan Industrial",
  "THR"
];

/* ─── LegalCard ─────────────────────────────────────────────────────────── */
interface LegalCardProps {
  ref_: (typeof legalReferences)[0];
  index: number;
}

function LegalCard({ ref_, index }: LegalCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.28, delay: index * 0.05, ease: "easeOut" }}
      className={cn(
        "group flex flex-col rounded-xl border border-l-2 bg-zinc-900",
        "border-zinc-800 transition-colors duration-150",
        "hover:border-zinc-700",
        ref_.accentBorder,
      )}
      aria-label={ref_.title}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
              ref_.iconBg,
            )}
          >
            <Scale className={cn("h-4 w-4", ref_.iconColor)} aria-hidden="true" />
          </div>

          {/* Title block */}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {ref_.category} · {ref_.year}
            </p>
            <h3 className="mt-0.5 text-sm font-semibold leading-snug text-white">
              {ref_.title}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500">{ref_.shortTitle}</p>
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={ref_.statusVariant} className="shrink-0">
          {ref_.status}
        </Badge>
      </div>

      {/* ── Summary ──────────────────────────────────────────────── */}
      <div className="border-t border-zinc-800 px-5 py-4">
        <p className="text-xs leading-relaxed text-zinc-500">{ref_.summary}</p>
      </div>

      {/* ── Key points (expandable) ───────────────────────────────── */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg",
            "border border-zinc-800 bg-zinc-800/40 px-3 py-2",
            "text-xs font-medium text-zinc-500",
            "transition-colors duration-150 hover:border-zinc-700 hover:text-zinc-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
          )}
          aria-expanded={expanded}
        >
          <span>Poin utama regulasi</span>
          <span
            className={cn(
              "text-zinc-700 transition-transform duration-200",
              expanded && "rotate-180",
            )}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 overflow-hidden space-y-1.5"
              aria-label={`Poin utama ${ref_.title}`}
            >
              {ref_.keyPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-800/30 px-3 py-2 text-xs text-zinc-400"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-600" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tags ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-4">
        {ref_.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] font-medium",
              ref_.tagColor,
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ── Footer link ──────────────────────────────────────────── */}
      <div className="mt-auto border-t border-zinc-800 px-5 py-3">
        <a
          href={ref_.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium",
            "text-blue-400 transition-colors hover:text-blue-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded",
          )}
        >
          Buka sumber resmi BPK
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

/* ─── Main workspace ─────────────────────────────────────────────────────── */
export function LibraryWorkspace() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [activeTopic, setActiveTopic] = useState(ALL_FILTER);

  /* Derived filtered list */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return legalReferences.filter((ref) => {
      const matchCategory =
        activeCategory === ALL_FILTER || ref.category === activeCategory;
      const matchTopic =
        activeTopic === ALL_FILTER ||
        ref.tags.some((t) => t.toLowerCase().includes(activeTopic.toLowerCase())) ||
        ref.topic.toLowerCase().includes(activeTopic.toLowerCase());
      const matchQuery =
        !q ||
        ref.title.toLowerCase().includes(q) ||
        ref.shortTitle.toLowerCase().includes(q) ||
        ref.summary.toLowerCase().includes(q) ||
        ref.tags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchTopic && matchQuery;
    });
  }, [query, activeCategory, activeTopic]);

  const hasFilters =
    query || activeCategory !== ALL_FILTER || activeTopic !== ALL_FILTER;

  function clearFilters() {
    setQuery("");
    setActiveCategory(ALL_FILTER);
    setActiveTopic(ALL_FILTER);
  }

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-xl">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <BookOpenCheck className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                Perpustakaan Hukum
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Basis data regulasi ketenagakerjaan Indonesia.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-[50ch]">
                Rujukan terstruktur untuk membantu Anda memahami hukum yang
                mengatur kontrak kerja. Telusuri, filter, dan buka dokumen asli
                dari sumber resmi BPK.
              </p>

              {/* Stats strip */}
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-600">
                <span>
                  <span className="font-semibold text-zinc-400">{legalReferences.length}</span>{" "}
                  regulasi tersedia
                </span>
                <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-zinc-400">
                    {legalReferences.filter(r => r.category === "Undang-Undang").length}
                  </span> undang-undang
                </span>
                <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-zinc-400">
                    {legalReferences.filter(r => r.category === "Peraturan Pemerintah").length}
                  </span> peraturan pemerintah
                </span>
                <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-zinc-400">
                    {legalReferences.filter(r => r.category === "Peraturan Menteri").length}
                  </span> peraturan menteri
                </span>
              </div>
            </div>

            <Button asChild size="sm" className="shrink-0">
              <Link href="/analyze">
                <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                Analisis Kontrak
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── Search + Filter bar ──────────────────────────────────────── */}
      <div className="sticky top-14 z-10 border-b border-zinc-800/70 bg-zinc-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 py-3 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Search input */}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari regulasi, topik, atau kata kunci..."
                className={cn(
                  "w-full rounded-lg border border-zinc-800 bg-zinc-900",
                  "py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-600",
                  "transition-colors duration-150",
                  "hover:border-zinc-700",
                  "focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30",
                )}
                aria-label="Cari regulasi"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-600 hover:text-zinc-300 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Filter icon label */}
            <div className="flex items-center gap-1 shrink-0 text-xs text-zinc-600">
              <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
              Filter
            </div>

          </div>

          {/* Filter chips row */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {/* Category filters */}
            <div
              role="group"
              aria-label="Filter kategori"
              className="flex items-center gap-1"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    activeCategory === cat
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300",
                  )}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />

            {/* Topic filters */}
            <div
              role="group"
              aria-label="Filter topik"
              className="flex flex-wrap items-center gap-1"
            >
              {TOPIC_FILTERS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    activeTopic === topic
                      ? "border-zinc-600 bg-zinc-800 text-zinc-200"
                      : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300",
                  )}
                  aria-pressed={activeTopic === topic}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Clear all */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Hapus filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results area ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">

        {/* Result count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-400">{filtered.length}</span>{" "}
            dari {legalReferences.length} regulasi
            {hasFilters && (
              <span className="text-zinc-700"> · berdasarkan filter aktif</span>
            )}
          </p>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((ref, i) => (
                <LegalCard key={ref.id} ref_={ref} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 px-6 text-center"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                <Search className="h-4 w-4 text-zinc-600" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-zinc-400">
                Tidak ada regulasi yang cocok
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Coba ubah kata kunci atau hapus filter yang aktif.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Hapus semua filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legal disclaimer */}
        <div className="mt-8 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-5 py-4">
          <p className="text-xs leading-relaxed text-zinc-700">
            <span className="font-medium text-zinc-600">Catatan: </span>
            Perpustakaan ini bersifat informatif dan tidak menggantikan nasihat hukum
            dari advokat atau konsultan ketenagakerjaan berlisensi. Selalu verifikasi
            dengan dokumen sumber resmi yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
}
