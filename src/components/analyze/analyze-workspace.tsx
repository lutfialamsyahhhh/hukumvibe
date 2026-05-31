"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ChatBuddy } from "@/components/analyze/chat-buddy";
import { InsightCard } from "@/components/analyze/insight-card";
import { PDFViewer } from "@/components/analyze/pdf-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoredDocument } from "@/lib/documents/storage";
import type { StoredDocument } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

interface AnalyzeWorkspaceProps {
  documentId: string;
}

function formatExtractionStrategy(strategy: string) {
  if (strategy === "pdfjs-layout") return "pembacaan tata letak";
  if (strategy === "pdf-parse") return "pembacaan teks";
  return "pembacaan cadangan";
}

/* ─── Mobile Tab System ─────────────────────────────────────────────────── */
type MobileTab = "document" | "insights" | "chat";

/* ─── Score helpers ──────────────────────────────────────────────────────── */
function getScoreVariant(score: number): "safe" | "medium" | "high" {
  if (score >= 75) return "safe";
  if (score >= 50) return "medium";
  return "high";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Kontrak aman";
  if (score >= 50) return "Perlu dicermati";
  return "Risiko tinggi";
}

function getProgressVariant(score: number): "safe" | "medium" | "high" {
  if (score >= 75) return "safe";
  if (score >= 50) return "medium";
  return "high";
}

/* ─── Not Found state ────────────────────────────────────────────────────── */
function WorkspaceNotFound() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
            <FileText className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-white">
            Analisis tidak tersedia
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Riwayat analisis tersimpan di browser saat ini. Unggah ulang kontrak
            jika halaman dibuka dari perangkat lain atau data browser telah
            dibersihkan.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/analyze">Kembali ke Ruang Analisis</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main workspace ─────────────────────────────────────────────────────── */
export function AnalyzeWorkspace({ documentId }: AnalyzeWorkspaceProps) {
  const [document, setDocument] = useState<StoredDocument | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("document");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow skeleton render
    const timer = setTimeout(() => {
      const stored = getStoredDocument(documentId);
      setDocument(stored);
      setActiveSnippet(
        stored?.analysis.analysis_results[0]?.original_text_snippet ?? null
      );
      const localPdf = sessionStorage.getItem(`pdf_url_${documentId}`);
      if (localPdf) {
        setPdfUrl(localPdf);
      } else if ((stored as any)?.fileUrl) {
        setPdfUrl((stored as any).fileUrl);
      }
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [documentId]);

  const score = document?.analysis.document_metadata.safety_score ?? 0;
  const riskVariant = useMemo(() => getScoreVariant(score), [score]);
  const progressVariant = useMemo(() => getProgressVariant(score), [score]);

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton variant="text" className="h-4 w-40" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" className="h-28" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <Skeleton variant="card" className="min-h-[600px]" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="card" className="h-40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) return <WorkspaceNotFound />;

  const insights = document.analysis.analysis_results;
  const highCount = insights.filter((i) => i.risk_level === "HIGH").length;
  const medCount = insights.filter((i) => i.risk_level === "MEDIUM").length;

  /* ─── Tabs config (mobile) ─── */
  const tabs: { id: MobileTab; label: string; icon: typeof FileText }[] = [
    { id: "document", label: "Dokumen", icon: FileText },
    { id: "insights", label: `Temuan (${insights.length})`, icon: ShieldCheck },
    { id: "chat", label: "Tanya AI", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 md:pb-0">

      {/* ── Workspace Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-14 z-dropdown border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-3 md:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: breadcrumb + title */}
            <div className="flex min-w-0 flex-col gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit text-zinc-500 hover:text-zinc-200"
              >
                <Link href="/analyze">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Ruang Analisis
                </Link>
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="max-w-[20ch] truncate text-sm font-semibold text-white sm:max-w-xs md:text-base">
                  {document.fileName}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Contract type — always visible, establishes document context */}
                  <Badge variant="secondary">
                    {document.analysis.document_metadata.contract_type}
                  </Badge>
                  {/* Score status — muted color, not alarming */}
                  <Badge variant={riskVariant}>
                    {getScoreLabel(score)}
                  </Badge>
                  {/* High risk count — 'warning' variant for stronger signal, only when needed */}
                  {highCount > 0 && (
                    <Badge variant="warning">
                      <AlertTriangle className="h-2.5 w-2.5" aria-hidden="true" />
                      {highCount} risiko tinggi
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Right: meta */}
            <p className="shrink-0 text-xs text-zinc-600">
              Dianalisis {formatDateTime(document.createdAt)} ·{" "}
              {formatExtractionStrategy(document.extraction.strategy)}
            </p>
          </div>

          {/* Safety score bar */}
          <div className="mt-3 flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Skor keamanan
            </span>
            <Progress
              value={score}
              variant={progressVariant}
              size="sm"
              className="flex-1"
            />
            <span
              className={cn(
                "shrink-0 text-xs font-semibold tabular-nums",
                progressVariant === "safe"
                  ? "text-emerald-400"
                  : progressVariant === "medium"
                    ? "text-amber-400"
                    : "text-rose-400",
              )}
            >
              {score}
              <span className="font-normal text-zinc-700">/100</span>
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 lg:px-8">

        {/* ── Metric cards ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="grid gap-3 grid-cols-1 sm:grid-cols-3"
        >
          {/* Summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Ringkasan utama</span>
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              {document.analysis.overall_summary}
            </p>
          </div>

          {/* Extraction quality */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Kualitas ekstraksi</span>
              <Gauge className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-white">
              {Math.round(document.extraction.quality.score * 100)}%
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              {document.extraction.quality.keywordHits} sinyal hukum terdeteksi
            </p>
          </div>

          {/* Risk distribution */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Distribusi risiko</span>
              <AlertTriangle className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-rose-400">{highCount}</span>
                <span className="text-xs text-zinc-600">Tinggi</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-amber-400">{medCount}</span>
                <span className="text-xs text-zinc-600">Sedang</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-emerald-400">
                  {insights.length - highCount - medCount}
                </span>
                <span className="text-xs text-zinc-600">Aman</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-600">{document.validation.reason}</p>
          </div>
        </motion.div>

        {/* ── Mobile tab bar ────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Panel navigasi workspace"
          className="mt-5 flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-1 xl:hidden"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={mobileTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setMobileTab(id)}
              className={cn(
                // Min touch target 44px
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg min-h-[44px] px-2 text-xs font-medium",
                "transition-[color,background-color] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
                mobileTab === id
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* ── Main workspace split ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,0.7fr)] xl:items-start"
        >
          {/* ── Left: PDF Viewer ────────────────────────────────────── */}
          <div
            role="tabpanel"
            id="panel-document"
            aria-labelledby="tab-document"
            className={cn(
              "xl:block xl:sticky xl:top-[9rem]",
              mobileTab === "document" ? "block" : "hidden xl:block",
            )}
          >
            <PDFViewer
              pages={document.pages}
              fileName={document.fileName}
              activeSnippet={activeSnippet}
              pdfUrl={pdfUrl}
            />
          </div>

          {/* ── Right: Insights + Chat ───────────────────────────────── */}
          <aside
            className={cn(
              "flex flex-col gap-4",
              // On xl show always; on mobile/tablet show when not on document tab
              mobileTab === "document" ? "hidden xl:flex" : "flex",
            )}
          >
            {/* Insight cards */}
            <div
              role="tabpanel"
              id="panel-insights"
              aria-labelledby="tab-insights"
              className={cn(
                mobileTab === "chat" ? "hidden xl:block" : "block"
              )}
            >
              {/* Panel header */}
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                  Temuan AI
                </h2>
                <span className="text-xs text-zinc-600">
                  {insights.length} klausul diperiksa
                </span>
              </div>

              <AnimatePresence>
                <div className="flex flex-col gap-3">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={`${insight.category}-${insight.clause_title}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.04,
                        ease: "easeOut",
                      }}
                    >
                      <InsightCard
                        insight={insight}
                        active={activeSnippet === insight.original_text_snippet}
                        onSelect={setActiveSnippet}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>

            {/* Chat */}
            <div
              role="tabpanel"
              id="panel-chat"
              aria-labelledby="tab-chat"
              className={cn(
                mobileTab === "insights" ? "hidden xl:block" : "block"
              )}
            >
              <ChatBuddy
                documentText={document.extractedText}
                analysis={document.analysis}
              />
            </div>
          </aside>
        </motion.div>

      </div>
    </div>
  );
}
