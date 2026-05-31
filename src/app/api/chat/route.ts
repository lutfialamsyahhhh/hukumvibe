import { NextResponse } from "next/server";

import { streamLegalChat } from "@/lib/ai/gemini";
import { sanitizeAIInput, sanitizeUserPrompt } from "@/lib/sanitize";
import type { ApiErrorResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequestBody {
  question?: unknown;
  documentText?: unknown;
  analysisSummary?: unknown;
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json<ApiErrorResponse>(
    {
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const question = typeof body.question === "string" ? sanitizeUserPrompt(body.question) : "";
    const documentText = typeof body.documentText === "string" ? sanitizeAIInput(body.documentText) : "";
    const analysisSummary =
      typeof body.analysisSummary === "string" ? sanitizeAIInput(body.analysisSummary) : "";

    if (!question) {
      return jsonError(400, "MISSING_QUESTION", "Pertanyaan wajib diisi.");
    }

    if (!documentText || !analysisSummary) {
      return jsonError(400, "MISSING_CONTEXT", "Konteks dokumen dan hasil analisis wajib tersedia.");
    }

    const result = await streamLegalChat({
      question,
      documentText,
      analysisSummary
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform"
      }
    });
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "ChatBuddy belum berhasil menjawab.";
    const message = rawMessage.includes("GEMINI_API_KEY")
      ? "Konfigurasi GEMINI_API_KEY belum tersedia."
      : "ChatBuddy belum berhasil menjawab. Coba kirim pertanyaan yang lebih singkat.";
    const status = rawMessage.includes("GEMINI_API_KEY") ? 503 : 500;

    return jsonError(status, "CHAT_FAILED", message);
  }
}
