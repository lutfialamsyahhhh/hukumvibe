"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  FileCheck2,
  FileUp,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStream } from "@/hooks/use-analysis-stream";
import { useFileUpload } from "@/hooks/use-file-upload";
import { saveAnalyzedDocument } from "@/lib/documents/storage";
import { cn, formatBytes } from "@/lib/utils";

/* ─── Loading phases display ─────────────────────────────────────────────── */
const PHASE_LABELS: Record<string, string> = {
  "Memuat...":             "Memuat file PDF...",
  "Mengekstrak teks...":   "Mengekstrak teks dari dokumen...",
  "Memvalidasi dokumen...":"Memvalidasi sinyal hukum ketenagakerjaan...",
  "Menganalisis...":       "AI sedang menganalisis klausul kontrak...",
  "Menyusun temuan...":    "Menyusun peta risiko dan rekomendasi...",
};

export function DocumentUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { state, error, isUploading, uploadContract } = useFileUpload();
  const progress = useAnalysisStream(isUploading);

  function pickFile(file: File | undefined) {
    if (!file) return;
    setSelectedFile(file);
  }

  async function analyze() {
    if (!selectedFile) {
      inputRef.current?.click();
      return;
    }

    try {
      const pdfUrl = URL.createObjectURL(selectedFile);
      const response = await uploadContract(selectedFile);
      sessionStorage.setItem(`pdf_url_${response.documentId}`, pdfUrl);
      saveAnalyzedDocument(response, pdfUrl);
      router.push(`/analyze/${response.documentId}`);
    } catch {
      // Error is surfaced by the upload hook
    }
  }

  const phaseLabel = PHASE_LABELS[progress.phase] ?? progress.phase;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        pickFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "relative rounded-xl border-2 border-dashed",
        "transition-[border-color,background-color] duration-200",
        isDragging
          ? "border-blue-500/50 bg-blue-500/5"
          : "border-zinc-700/80 bg-zinc-900 hover:border-zinc-600",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => pickFile(e.target.files?.[0])}
      />

      <div className="p-6 md:p-8">
        {/* ── Idle state ──────────────────────────────────────────── */}
        {!isUploading && (
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left: icon + copy */}
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  "border border-zinc-700 bg-zinc-800 transition-colors duration-150",
                  isDragging && "border-blue-500/50 bg-blue-500/10",
                )}
              >
                <UploadCloud
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isDragging ? "text-blue-400" : "text-zinc-500"
                  )}
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-sm font-semibold text-white">
                  Unggah dokumen kontrak kerja
                </h2>
                <p className="max-w-md text-xs leading-relaxed text-zinc-500">
                  Tarik file PDF ke area ini atau pilih dari perangkat Anda.
                  Maks. 12 MB. HukumVibe membaca teks, memeriksa sinyal hukum,
                  dan membuat peta risiko.
                </p>

                {/* Selected file pill */}
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center gap-2"
                  >
                    <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300">
                      <FileUp className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                      {selectedFile.name}
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{formatBytes(selectedFile.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="rounded-md p-1 text-zinc-600 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Hapus file yang dipilih"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                Pilih PDF
              </Button>
              <Button
                size="sm"
                onClick={analyze}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {selectedFile ? "Mulai Analisis" : "Pilih & Analisis"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Uploading / AI processing state ─────────────────────── */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Phase label + percentage */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" aria-hidden="true" />
                <span className="text-sm font-medium text-zinc-300">
                  {phaseLabel}
                </span>
              </div>
              <span className="text-sm font-semibold text-white">
                {progress.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <Progress value={progress.progress} variant="default" />

            {/* Skeleton preview cards */}
            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="card" className="h-20" />
              ))}
            </div>

            <p className="text-center text-xs text-zinc-600">
              AI sedang membaca dan menganalisis klausul kontrak Anda...
            </p>
          </motion.div>
        )}

        {/* ── Error state ─────────────────────────────────────────── */}
        {state === "error" && error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-xl border border-rose-500/15 bg-rose-500/6 px-4 py-3.5"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-rose-300">Gagal memproses dokumen</p>
              <p className="mt-0.5 text-xs leading-relaxed text-rose-400/80">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
