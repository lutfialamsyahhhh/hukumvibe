import type { Metadata } from "next";
import { CaraKerjaClient } from "./client";

export const metadata: Metadata = {
  title: "Cara Kerja — HukumVibe",
  description:
    "Pelajari bagaimana HukumVibe menganalisis kontrak kerja Indonesia secara transparan: dari ekstraksi PDF, validasi hukum, hingga peta risiko yang bisa ditelusuri.",
  openGraph: {
    title: "Cara Kerja — HukumVibe",
    description:
      "Transparansi analisis kontrak kerja: dari PDF ke peta risiko yang terverifikasi.",
    type: "website",
  },
};

export default function CaraKerjaPage() {
  return <CaraKerjaClient />;
}
