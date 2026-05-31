import type { LegalDocumentValidation } from "@/lib/types";

const CONTRACT_SIGNALS: Array<{ label: string; pattern: RegExp; weight: number }> = [
  {
    label: "Judul perjanjian kerja",
    pattern: /(perjanjian|kontrak)\s+(kerja|karyawan|pegawai)/i,
    weight: 3
  },
  {
    label: "Tipe hubungan kerja",
    pattern: /\b(PKWT|PKWTT|perjanjian kerja waktu tertentu|perjanjian kerja waktu tidak tertentu)\b/i,
    weight: 3
  },
  {
    label: "Pihak pekerja dan pengusaha",
    pattern: /(pekerja|karyawan|buruh).{0,120}(pengusaha|perusahaan|pemberi kerja)|(?:pengusaha|perusahaan|pemberi kerja).{0,120}(pekerja|karyawan|buruh)/is,
    weight: 2
  },
  {
    label: "Klausul upah",
    pattern: /(upah|gaji|tunjangan|kompensasi|salary)/i,
    weight: 2
  },
  {
    label: "Masa kerja atau jabatan",
    pattern: /(masa kerja|jangka waktu|jabatan|posisi|mulai bekerja|tanggal efektif)/i,
    weight: 2
  },
  {
    label: "Rujukan pasal hukum",
    pattern: /(pasal|undang-undang|uu ketenagakerjaan|uu cipta kerja|peraturan pemerintah)/i,
    weight: 2
  },
  {
    label: "Tanda tangan para pihak",
    pattern: /(ditandatangani|materai|pihak pertama|pihak kedua|yang bertanda tangan)/i,
    weight: 2
  }
];

export function validateLegalContract(text: string): LegalDocumentValidation {
  const matched = CONTRACT_SIGNALS.filter((signal) => signal.pattern.test(text));
  const score = matched.reduce((total, signal) => total + signal.weight, 0);
  const confidence = Math.min(score / 12, 1);
  const isLongEnough = text.trim().length >= 700;
  const isLegalContract = isLongEnough && score >= 7;

  return {
    isLegalContract,
    confidence: Number(confidence.toFixed(2)),
    matchedSignals: matched.map((signal) => signal.label),
    reason: isLegalContract
      ? "Dokumen terdeteksi sebagai kontrak atau perjanjian kerja."
      : "Dokumen belum cukup kuat terdeteksi sebagai kontrak kerja Indonesia. Pastikan file berisi teks kontrak, bukan scan gambar kosong atau dokumen non-legal."
  };
}
