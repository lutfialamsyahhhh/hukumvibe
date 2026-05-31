import { Github, Linkedin, Mail, Scale } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

const productLinks = [
  { href: "/analyze",    label: "Mulai Analisis" },
  { href: "/cara-kerja", label: "Cara Kerja" },
  { href: "/library",    label: "Perpustakaan Hukum" },
];

const techStack = ["Next.js 14", "Gemini AI", "TypeScript"];

const socialLinks = [
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Github,   label: "GitHub" },
  { href: "#", icon: Mail,     label: "Email" },
];

/**
 * HukumVibe Footer — Minimal, professional, spacious
 * Consistent with Vercel / Stripe footer aesthetics
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* ── Main Content Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link
              href="/"
              className="flex w-fit items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="HukumVibe — Beranda"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <Scale className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white tracking-tight">
                HukumVibe
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-500 max-w-[22ch]">
              Teknologi AI untuk mendemokratisasi pemahaman kontrak kerja Indonesia.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition-colors duration-150 hover:text-zinc-300 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Product */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Produk
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer produk">
              {productLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-200 outline-none focus-visible:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Developer */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Pengembang
            </h3>
            <div className="flex flex-col gap-1 text-sm text-zinc-500">
              <span className="text-zinc-300 font-medium">Muhammad Lutfi Alamsyah</span>
              <span>Teknik Informatika</span>
              <span>Institut Teknologi Nasional Bandung</span>
            </div>
          </div>

          {/* Column 4 — Legal Disclaimer */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-rose-500/80">
              Sanggahan Penting
            </h3>
            <p className="text-xs leading-relaxed text-zinc-600">
              HukumVibe adalah platform edukasi dan literasi hukum berbantuan AI.
              Informasi yang dihasilkan{" "}
              <strong className="text-zinc-500 font-semibold">
                tidak menggantikan nasihat hukum profesional
              </strong>{" "}
              dari advokat berlisensi.
            </p>
          </div>

        </div>

        <Separator />

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">

          <p className="text-xs text-zinc-600">
            &copy; {year} HukumVibe. Dibangun untuk keputusan kerja yang lebih tenang.
          </p>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-700">Powered by</span>
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-500"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}