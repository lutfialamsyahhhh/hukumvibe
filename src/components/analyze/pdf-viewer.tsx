"use client";

import { FileText, SearchCheck } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import type { TextPage } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface PDFViewerProps {
  pages: TextPage[];
  fileName: string;
  activeSnippet: string | null;
  /** Optional blob URL for rendering native PDF via iframe */
  pdfUrl?: string | null;
}

interface HighlightRange {
  pageNumber: number;
  start: number;
  end: number;
}

/* ─── Text processing helpers (unchanged business logic) ─────────────────── */
function buildNormalizedMap(text: string) {
  let normalized = "";
  const map: number[] = [];
  let previousWasSpace = true;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (/\s/.test(char)) {
      if (!previousWasSpace) {
        normalized += " ";
        map.push(index);
      }
      previousWasSpace = true;
      continue;
    }
    normalized += char.toLowerCase();
    map.push(index);
    previousWasSpace = false;
  }

  if (normalized.endsWith(" ")) {
    normalized = normalized.slice(0, -1);
    map.pop();
  }

  return { normalized, map };
}

function normalizeSnippet(snippet: string) {
  return snippet.toLowerCase().replace(/\s+/g, " ").trim();
}

function findHighlightRange(
  pages: TextPage[],
  snippet: string | null
): HighlightRange | null {
  if (!snippet) return null;

  const normalizedSnippet = normalizeSnippet(snippet);
  const candidates = [
    normalizedSnippet,
    normalizedSnippet.slice(0, 180),
    normalizedSnippet.slice(0, 100),
  ].filter((c) => c.length >= 24);

  for (const page of pages) {
    const { normalized, map } = buildNormalizedMap(page.text);
    for (const candidate of candidates) {
      const start = normalized.indexOf(candidate);
      if (start >= 0) {
        const sourceStart = map[start] ?? 0;
        const sourceEnd = (map[start + candidate.length - 1] ?? sourceStart) + 1;
        return { pageNumber: page.pageNumber, start: sourceStart, end: sourceEnd };
      }
    }
  }

  return null;
}

function renderPageText(
  text: string,
  range: HighlightRange | null,
  pageNumber: number
) {
  if (!range || range.pageNumber !== pageNumber) return text;

  return (
    <>
      {text.slice(0, range.start)}
      <mark className="pdf-highlight">{text.slice(range.start, range.end)}</mark>
      {text.slice(range.end)}
    </>
  );
}

/* ─── PDFViewer ──────────────────────────────────────────────────────────── */
export function PDFViewer({
  pages,
  fileName,
  activeSnippet,
  pdfUrl,
}: PDFViewerProps) {
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const range = useMemo(
    () => findHighlightRange(pages, activeSnippet),
    [activeSnippet, pages]
  );

  /* Auto-scroll to highlighted page */
  useEffect(() => {
    if (!range) return;
    pageRefs.current[range.pageNumber]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [range]);

  /* Build iframe src for native PDF viewing */
  const iframeSrc = useMemo(() => {
    if (!pdfUrl) return null;
    let src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    if (activeSnippet) {
      const keyword = activeSnippet
        .split(" ")
        .slice(0, 6)
        .join(" ")
        .replace(/\n/g, " ");
      src += `&search=${encodeURIComponent(keyword)}`;
    }
    return src;
  }, [pdfUrl, activeSnippet]);

  return (
    <section
      className={cn(
        "flex h-full min-h-[680px] flex-col overflow-hidden",
        "rounded-xl border border-zinc-800 bg-zinc-900",
        "shadow-workspace",
      )}
      aria-label={`PDF viewer — ${fileName}`}
    >
      {/* ── Viewer Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
            <FileText className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-white">{fileName}</h2>
            <p className="text-xs text-zinc-600">
              {pages.length} halaman · teks terekstrak
            </p>
          </div>
        </div>

        <Badge variant={range ? "safe" : "secondary"}>
          <SearchCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
          {range ? `Hlm. ${range.pageNumber}` : "Tampilan sumber"}
        </Badge>
      </div>

      {/* ── Viewer Body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto bg-zinc-950/60 p-4">

        {/* Mode A: Native PDF iframe */}
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="h-full min-h-[640px] w-full rounded-lg border border-zinc-800"
            title={`PDF asli — ${fileName}`}
          />
        ) : (
          /* Mode B: Extracted text render */
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                ref={(node) => {
                  pageRefs.current[page.pageNumber] = node;
                }}
                className={cn(
                  "min-h-[560px] rounded-xl border bg-zinc-900 p-6 shadow-card",
                  "transition-all duration-200",
                  range?.pageNumber === page.pageNumber
                    ? "border-blue-500/30 ring-1 ring-blue-500/20"
                    : "border-zinc-800"
                )}
              >
                {/* Page label */}
                <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                    Teks Terekstrak · HukumVibe
                  </span>
                  <span className="rounded-md border border-zinc-800 bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                    Halaman {page.pageNumber}
                  </span>
                </div>

                {/* Page content */}
                <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-7 text-zinc-300">
                  {renderPageText(page.text, range, page.pageNumber)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
