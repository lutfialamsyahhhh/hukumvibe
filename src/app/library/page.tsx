import type { Metadata } from "next";

import { LibraryWorkspace } from "@/components/library/library-workspace";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "Perpustakaan Hukum - HukumVibe",
  description:
    "Basis data regulasi ketenagakerjaan Indonesia. Telusuri UU Ketenagakerjaan, Cipta Kerja, PKWT, Pengupahan, dan JKP dengan filter topik dan pencarian teks.",
  openGraph: {
    title: "Perpustakaan Hukum - HukumVibe",
    description:
      "Rujukan singkat regulasi ketenagakerjaan Indonesia untuk membaca kontrak kerja.",
    type: "website",
  },
};

export default function LibraryPage() {
  return (
    <AppShell>
      <LibraryWorkspace />
    </AppShell>
  );
}
