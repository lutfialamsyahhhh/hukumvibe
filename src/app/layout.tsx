import type { Metadata } from "next";

import "@/app/globals.css";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "HukumVibe | Analisis Kontrak Kerja Indonesia",
  description:
    "HukumVibe membantu pekerja dan tim memahami risiko kontrak kerja Indonesia dengan analisis hukum ketenagakerjaan berbantuan kecerdasan buatan.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-zinc-950 text-white antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
