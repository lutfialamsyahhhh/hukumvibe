import type { ExtractionQuality } from "@/lib/types";

const LEGAL_KEYWORDS = [
  "perjanjian kerja",
  "kontrak kerja",
  "pkwt",
  "pkwtt",
  "pekerja",
  "pengusaha",
  "upah",
  "gaji",
  "masa kerja",
  "pemutusan hubungan kerja",
  "phk",
  "ketenagakerjaan",
  "cipta kerja",
  "pasal",
  "cuti",
  "lembur",
  "jaminan sosial"
];

export function assessExtractionQuality(text: string): ExtractionQuality {
  const normalized = text.toLowerCase();
  const keywordHits = LEGAL_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword)
  ).length;
  const lineCount = text.split("\n").filter((line) => line.trim()).length;
  const badCharacterRatio =
    text.length === 0 ? 1 : (text.match(/[�□■●]/g)?.length ?? 0) / text.length;

  const lengthScore = Math.min(text.length / 2500, 1) * 0.35;
  const keywordScore = Math.min(keywordHits / 8, 1) * 0.4;
  const structureScore = Math.min(lineCount / 80, 1) * 0.25;
  const score = Math.max(0, lengthScore + keywordScore + structureScore - badCharacterRatio);

  const warnings: string[] = [];
  if (text.length < 700) {
    warnings.push("Teks yang terbaca masih pendek; PDF mungkin berupa scan atau gambar.");
  }
  if (keywordHits < 3) {
    warnings.push("Sinyal hukum ketenagakerjaan yang terdeteksi masih sedikit.");
  }
  if (badCharacterRatio > 0.01) {
    warnings.push("Hasil ekstraksi memuat karakter pengganti; kualitas encoding sumber mungkin menurun.");
  }

  return {
    score: Number(score.toFixed(2)),
    keywordHits,
    warnings
  };
}
