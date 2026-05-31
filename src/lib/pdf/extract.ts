import { sanitizeExtractedText } from "@/lib/sanitize";
import type { PdfExtractionResult, TextPage } from "@/lib/types";
import { assessExtractionQuality } from "./quality";

interface LayoutTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

interface PdfJsTextItem {
  str: string;
  transform: number[];
  width?: number;
}

function splitSyntheticPages(text: string): TextPage[] {
  const chunks = text
    .split(/\f|\n\s*Halaman\s+\d+\s*\n/gi)
    .map((page) => page.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return [{ pageNumber: 1, text }];
  }

  return chunks.map((page, index) => ({
    pageNumber: index + 1,
    text: page
  }));
}

function reconstructLayout(items: LayoutTextItem[]) {
  const rows: Array<{ y: number; items: LayoutTextItem[] }> = [];
  const rowTolerance = 4;

  for (const item of items.sort((a, b) => b.y - a.y || a.x - b.x)) {
    const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= rowTolerance);
    if (row) {
      row.items.push(item);
      row.y = (row.y + item.y) / 2;
    } else {
      rows.push({ y: item.y, items: [item] });
    }
  }

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) => {
      const ordered = row.items.sort((a, b) => a.x - b.x);
      let previousEnd = 0;

      return ordered
        .map((item, index) => {
          const gap = index === 0 ? 0 : item.x - previousEnd;
          previousEnd = item.x + item.width;

          if (index === 0) {
            return item.str.trim();
          }
          if (gap > 96) {
            return `  |  ${item.str.trim()}`;
          }
          if (gap > 24) {
            return `${" ".repeat(Math.min(Math.round(gap / 8), 10))}${item.str.trim()}`;
          }

          return ` ${item.str.trim()}`;
        })
        .join("")
        .replace(/[ \t]+/g, " ")
        .trim();
    })
    .filter(Boolean)
    .join("\n");
}

async function parseWithPdfParse(buffer: Buffer): Promise<PdfExtractionResult> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule.default ?? pdfParseModule;
  const parsed = await pdfParse(buffer);
  const text = sanitizeExtractedText(parsed.text ?? "");
  const quality = assessExtractionQuality(text);

  return {
    text,
    pages: splitSyntheticPages(text),
    strategy: "pdf-parse",
    quality,
    pageCount: parsed.numpages
  };
}

async function parseWithPdfJs(buffer: Buffer): Promise<PdfExtractionResult> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    useSystemFonts: true
  });
  const document = await loadingTask.promise;
  const pages: TextPage[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const items = content.items
      .flatMap((item) => {
        const candidate = item as unknown as Partial<PdfJsTextItem>;
        if (typeof candidate.str !== "string" || !Array.isArray(candidate.transform)) {
          return [];
        }

        return [
          {
            str: candidate.str,
            x: candidate.transform[4] ?? 0,
            y: candidate.transform[5] ?? 0,
            width: candidate.width ?? candidate.str.length * 5
          }
        ];
      })
      .filter((item) => item.str.trim().length > 0);

    pages.push({
      pageNumber,
      text: reconstructLayout(items)
    });
  }

  const text = sanitizeExtractedText(
    pages.map((page) => `Halaman ${page.pageNumber}\n${page.text}`).join("\n\n")
  );

  return {
    text,
    pages,
    strategy: "pdfjs-layout",
    quality: assessExtractionQuality(text),
    pageCount: document.numPages
  };
}

export async function extractPdfText(buffer: Buffer): Promise<PdfExtractionResult> {
  const attempts: PdfExtractionResult[] = [];

  try {
    const parsed = await parseWithPdfParse(buffer);
    attempts.push(parsed);
    if (parsed.quality.score >= 0.68 && parsed.text.length >= 700) {
      return parsed;
    }
  } catch {
    // The PDF.js path below is intentionally quiet; callers receive the final extraction status.
  }

  try {
    const parsed = await parseWithPdfJs(buffer);
    attempts.push(parsed);
    return attempts.sort((a, b) => b.quality.score - a.quality.score)[0] ?? parsed;
  } catch {
    const fallback = attempts[0];
    if (fallback) {
      return fallback;
    }

    return {
      text: "",
      pages: [],
      strategy: "fallback",
      quality: {
        score: 0,
        keywordHits: 0,
        warnings: ["Unable to extract text from the PDF."]
      }
    };
  }
}
