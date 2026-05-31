import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { analyzeContractWithGemini } from "@/lib/ai/gemini";
import { extractPdfText } from "@/lib/pdf/extract";
import { validateLegalContract } from "@/lib/pdf/validate";
import { sanitizeFilename } from "@/lib/sanitize";
import type { AnalyzeContractResponse, ApiErrorResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024;

// 1. Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

function jsonError(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError(400, "MISSING_FILE", "Unggah dokumen kontrak kerja dalam format PDF terlebih dahulu.");
    }

    if (!isPdf(file)) {
      return jsonError(415, "UNSUPPORTED_FILE", "Saat ini hanya file PDF yang didukung.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError(413, "FILE_TOO_LARGE", "Ukuran PDF harus 12 MB atau lebih kecil.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extraction = await extractPdfText(buffer);

    if (!extraction.text || extraction.text.length < 300) {
      return jsonError(422, "EXTRACTION_FAILED", "Teks dari PDF belum cukup terbaca untuk dianalisis.", {
        extraction
      });
    }

    const validation = validateLegalContract(extraction.text);
    if (!validation.isLegalContract) {
      return jsonError(
        422,
        "NOT_LEGAL_CONTRACT",
        "Dokumen ini belum terdeteksi sebagai kontrak kerja Indonesia.",
        validation
      );
    }

    const safeFileName = sanitizeFilename(file.name);

    // 2. Buat nama file unik untuk Supabase Storage
    const uniqueFileName = `${Date.now()}-${safeFileName}`;

    // 3. Eksekusi unggah ke bucket "contracts-temp"
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contracts-temp")
      .upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return jsonError(500, "UPLOAD_FAILED", "Gagal mengunggah dokumen ke penyimpanan awan.");
    }

    // 4. Dapatkan Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("contracts-temp")
      .getPublicUrl(uniqueFileName);

    // 5. Jalankan AI Reasoning ke Gemini 
    const analysis = await analyzeContractWithGemini({
      documentText: extraction.text,
      fileName: safeFileName
    });

    // 6. Rangkai respons akhir (Perhatikan penambahan fileUrl)
    // Tipe diperluas secara dinamis agar TypeScript tidak protes jika fileUrl belum ada di tipe asal
    const response: AnalyzeContractResponse & { fileUrl: string } = {
      documentId: nanoid(12),
      fileName: safeFileName,
      mimeType: file.type || "application/pdf",
      size: file.size,
      createdAt: new Date().toISOString(),
      extraction: {
        strategy: extraction.strategy,
        quality: extraction.quality,
        pageCount: extraction.pageCount
      },
      validation,
      extractedText: extraction.text,
      analysis,
      pages: extraction.pages,
      fileUrl: publicUrl, // URL ini dikirim ke frontend untuk komponen <PdfViewer />
    };

    return NextResponse.json(response);
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Analisis belum berhasil diproses.";
    const message = rawMessage.includes("GEMINI_API_KEY")
      ? "Konfigurasi GEMINI_API_KEY belum tersedia."
      : "Analisis belum berhasil diproses. Pastikan PDF terbaca jelas lalu coba lagi.";
    const status = rawMessage.includes("GEMINI_API_KEY") ? 503 : 500;

    return jsonError(status, "ANALYSIS_FAILED", message);
  }
}