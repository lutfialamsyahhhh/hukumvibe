import type { Metadata } from "next";

import { LandingCapabilities } from "@/components/landing/landing-capabilities";
import { LandingCTA } from "@/components/landing/landing-cta";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingTrust } from "@/components/landing/landing-trust";

export const metadata: Metadata = {
  title: "HukumVibe - Analisis Kontrak Kerja Indonesia dengan AI",
  description:
    "Unggah kontrak kerja PDF Anda dan dapatkan peta risiko, rujukan UU Ketenagakerjaan, serta bantuan AI Legal Assistant - dalam Bahasa Indonesia yang lugas.",
  openGraph: {
    title: "HukumVibe - Analisis Kontrak Kerja Indonesia dengan AI",
    description:
      "Pahami risiko kontrak kerja sebelum Anda menandatangani. Didukung Gemini AI.",
    type: "website",
  },
};

/**
 * HukumVibe — Landing Page
 * World-class AI LegalTech SaaS homepage
 *
 * Section order:
 * 1. Hero          — cinematic full-viewport entry
 * 2. Capabilities  — bento grid feature overview
 * 3. How It Works  — 3-step process with stats
 * 4. Trust         — feature checklist + legal coverage card
 * 5. CTA           — calm conversion closer
 */
export default function LandingPage() {
  return (
    <main>
      {/* 1 · Cinematic hero with trust strip */}
      <LandingHero />

      {/* 2 · Bento capabilities */}
      <LandingCapabilities />

      {/* 3 · How it works — 3-step process */}
      <LandingHowItWorks />

      {/* 4 · Trust & credibility */}
      <LandingTrust />

      {/* 5 · Final CTA */}
      <LandingCTA />
    </main>
  );
}
