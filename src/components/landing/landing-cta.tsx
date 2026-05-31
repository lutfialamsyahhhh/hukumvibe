"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

/**
 * LandingCTA — Final conversion section
 * Calm, confident, enterprise-grade. Not a hard sell.
 */
export function LandingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t border-zinc-800 bg-zinc-950"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Label */}
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Mulai sekarang
          </p>

          {/* Heading */}
          <h2
            id="cta-heading"
            className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Siap memeriksa kontrak kerja Anda?
          </h2>

          {/* Subtext */}
          <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-relaxed text-zinc-500">
            Mulai dari satu dokumen PDF dan dapatkan peta risiko, rujukan hukum,
            serta saran langkah berikutnya — semuanya dalam satu ruang kerja.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-[180px]">
              <Link href="/analyze">
                <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Mulai Analisis Gratis
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
              <Link href="/library">
                Perpustakaan Hukum
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Sub-note */}
          <p className="mt-5 text-xs text-zinc-700">
            Tidak perlu mendaftar. Tidak ada biaya. Tidak ada dokumen yang disimpan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
