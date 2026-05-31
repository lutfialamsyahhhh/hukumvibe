"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult, RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─── Risk config ────────────────────────────────────────────────────────── */
const riskConfig: Record<
  RiskLevel,
  {
    label: string;
    badge: "high" | "medium" | "safe";
    icon: typeof AlertTriangle;
    /** Left border accent */
    accent: string;
    /** Icon color */
    iconColor: string;
  }
> = {
  HIGH: {
    label: "Risiko Tinggi",
    badge: "high",
    icon: AlertTriangle,
    accent: "border-l-rose-500/60",
    iconColor: "text-rose-400",
  },
  MEDIUM: {
    label: "Risiko Sedang",
    badge: "medium",
    icon: CircleAlert,
    accent: "border-l-amber-500/60",
    iconColor: "text-amber-400",
  },
  SAFE: {
    label: "Aman",
    badge: "safe",
    icon: CheckCircle2,
    accent: "border-l-emerald-500/60",
    iconColor: "text-emerald-400",
  },
};

interface InsightCardProps {
  insight: AnalysisResult;
  active: boolean;
  onSelect: (snippet: string) => void;
}

export function InsightCard({ insight, active, onSelect }: InsightCardProps) {
  const config = riskConfig[insight.risk_level];
  const Icon = config.icon;
  const confidence = Math.round(insight.confidence_score * 100);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group rounded-xl border border-l-2 bg-zinc-900",
        // Targeted transition — border-color and shadow only
        "transition-[border-color,box-shadow] duration-150",
        // Left accent border
        config.accent,
        // Border state
        active
          ? "border-zinc-700 shadow-elevated"
          : "border-zinc-800 hover:border-zinc-700",
      )}
    >
      {/* ── Clickable summary row ──────────────────────────────────── */}
      <button
        type="button"
        onClick={() => {
          onSelect(insight.original_text_snippet);
          setExpanded((v) => !v);
        }}
        className="flex w-full items-start gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset rounded-xl"
        aria-expanded={expanded}
      >
        {/* Icon */}
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("h-4 w-4", config.iconColor)} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {insight.category}
            </span>
            <Badge variant={config.badge}>
              {config.label}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-white leading-snug">
            {insight.clause_title}
          </p>
          {!expanded && (
            <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
              {insight.vibe_explanation}
            </p>
          )}
        </div>

        {/* Expand toggle — smooth rotate */}
        <div
          className={cn(
            "ml-1 shrink-0 transition-[color,transform] duration-150",
            "text-zinc-600 group-hover:text-zinc-400",
            expanded && "rotate-180",
          )}
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {/* ── Expanded detail ────────────────────────────────────────── */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3.5">
            {/* Explanation */}
            <p className="text-sm leading-relaxed text-zinc-400">
              {insight.vibe_explanation}
            </p>

            {/* Source snippet */}
            <blockquote className="rounded-lg border-l-2 border-zinc-700 bg-zinc-800/40 py-2.5 pl-4 pr-3 text-xs leading-relaxed text-zinc-500 italic not-italic">
              <span className="font-mono text-[10px] text-zinc-600 not-italic block mb-1">Kutipan klausul</span>
              <span className="text-zinc-500">&ldquo;{insight.original_text_snippet}&rdquo;</span>
            </blockquote>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  Rujukan
                </span>
                <span className="text-xs text-zinc-400">
                  {insight.legal_reference}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                  Keyakinan AI
                </span>
                <div className="flex items-center gap-2">
                  <Progress
                    value={confidence}
                    size="sm"
                    variant={
                      confidence >= 75 ? "safe" : confidence >= 50 ? "medium" : "high"
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-zinc-500">{confidence}%</span>
                </div>
              </div>
            </div>

            {/* Action step */}
            <div className="flex flex-col gap-1 rounded-lg border border-blue-500/10 bg-blue-500/5 px-3.5 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500/60">
                Langkah berikutnya
              </span>
              <span className="text-xs leading-relaxed text-zinc-400">{insight.action_step}</span>
            </div>

            {/* Source link */}
            <button
              type="button"
              onClick={() => onSelect(insight.original_text_snippet)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              Sorot di dokumen
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
