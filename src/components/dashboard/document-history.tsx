"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDocumentHistory } from "@/lib/documents/storage";
import type { DocumentHistoryItem } from "@/lib/types";
import { cn, formatBytes, formatDateTime } from "@/lib/utils";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getScoreVariant(score: number): "safe" | "medium" | "high" {
  if (score >= 75) return "safe";
  if (score >= 50) return "medium";
  return "high";
}

function getScoreLabel(score: number) {
  if (score >= 75) return "Aman";
  if (score >= 50) return "Perlu dicermati";
  return "Risiko tinggi";
}

function getRiskAccent(redFlagCount: number, safetyScore: number) {
  if (redFlagCount > 0 || safetyScore < 50) {
    return "border-l-rose-500/40";
  }
  if (safetyScore < 75) {
    return "border-l-amber-500/40";
  }
  return "border-l-emerald-500/30";
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-14 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
        <FileText className="h-5 w-5 text-zinc-600" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-zinc-400">
        Belum ada riwayat analisis
      </p>
      <p className="mt-1.5 max-w-[32ch] text-xs leading-relaxed text-zinc-600">
        Unggah kontrak kerja pertama Anda untuk melihat peta risiko dan riwayat analisis.
      </p>
    </div>
  );
}

/* ─── History card ───────────────────────────────────────────────────────── */
function HistoryCard({
  item,
  index,
}: {
  item: DocumentHistoryItem;
  index: number;
}) {
  const scoreVariant = getScoreVariant(item.safetyScore);
  const scoreLabel = getScoreLabel(item.safetyScore);
  const leftAccent = getRiskAccent(item.redFlagCount, item.safetyScore);
  const hasHighRisk = item.redFlagCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0, 0, 0.2, 1] }}
    >
      <Link
        href={`/analyze/${item.documentId}`}
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-xl"
        aria-label={`Buka analisis: ${item.fileName}`}
      >
        <div
          className={cn(
            // Base surface — overflow-hidden prevents any child from escaping
            "flex h-full flex-col gap-4 rounded-xl border border-l-2 bg-zinc-900 p-4 overflow-hidden",
            // Left accent — color-coded by risk level
            leftAccent,
            // Hover — subtle elevation + border
            "transition-[border-color,background-color,box-shadow] duration-150",
            "group-hover:border-zinc-700 group-hover:bg-zinc-800/50 group-hover:shadow-card",
          )}
        >
          {/* ── Row 1: Icon + filename + risk indicator ─────────────── */}
          <div className="flex items-start justify-between gap-3">
            {/* Left: doc icon + name */}
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                  "transition-[border-color,background-color] duration-150",
                  hasHighRisk
                    ? "border-rose-500/20 bg-rose-500/5 group-hover:border-rose-500/30"
                    : "border-zinc-700/60 bg-zinc-800 group-hover:border-zinc-600",
                )}
              >
                {hasHighRisk ? (
                  <ShieldAlert
                    className="h-3.5 w-3.5 text-rose-400"
                    aria-hidden="true"
                  />
                ) : (
                  <FileText
                    className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-400 transition-colors duration-150"
                    aria-hidden="true"
                  />
                )}
              </div>

              <p className="truncate text-sm font-semibold text-white leading-snug">
                {item.fileName}
              </p>
            </div>

            {/* Right: risk flag count — only shown when > 0 */}
            {hasHighRisk && (
              <Badge variant="warning" className="shrink-0">
                <AlertTriangle className="h-2.5 w-2.5" aria-hidden="true" />
                {item.redFlagCount} risiko
              </Badge>
            )}
            {!hasHighRisk && (
              <Badge variant="safe" className="shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5" aria-hidden="true" />
                Aman
              </Badge>
            )}
          </div>

          {/* ── Row 2: Safety score bar ──────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Skor keamanan
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    scoreVariant === "safe"
                      ? "text-emerald-400"
                      : scoreVariant === "medium"
                      ? "text-amber-400"
                      : "text-rose-400",
                  )}
                >
                  {item.safetyScore}
                </span>
                <span className="text-xs text-zinc-700">/100</span>
              </div>
            </div>
            <Progress value={item.safetyScore} variant={scoreVariant} size="sm" />
          </div>

          {/* ── Row 3: Contract type + score label ──────────────────── */}
          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
            {/* Contract type — can be very long: truncate inside pill */}
            <Badge
              variant="secondary"
              className="min-w-0 max-w-full truncate"
              title={item.contractType}
            >
              <span className="truncate">{item.contractType}</span>
            </Badge>
            {/* Score label — short fixed text, never shrinks */}
            <Badge variant={scoreVariant} className="shrink-0">
              {scoreLabel}
            </Badge>
          </div>

          {/* ── Row 4: Metadata footer ───────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-zinc-800/70 pt-3 text-[11px] text-zinc-600">
            <span>{formatBytes(item.size)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
              {formatDateTime(item.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export function DocumentHistory() {
  const [items, setItems] = useState<DocumentHistoryItem[]>([]);

  useEffect(() => {
    setItems(getDocumentHistory());
  }, []);

  if (items.length === 0) return <EmptyHistory />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <HistoryCard key={item.documentId} item={item} index={index} />
      ))}
    </div>
  );
}
