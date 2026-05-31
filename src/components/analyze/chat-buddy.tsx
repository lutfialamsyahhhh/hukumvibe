"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, SendHorizontal, Sparkles, UserRound } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage, ContractAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatBuddyProps {
  documentText: string;
  analysis: ContractAnalysis;
}

export function ChatBuddy({ documentText, analysis }: ChatBuddyProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Core chat logic (unchanged) ─────────────────────────────────── */
  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    const assistantId = crypto.randomUUID();

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          documentText,
          analysisSummary: JSON.stringify(analysis),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response
          .json()
          .catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(
          payload?.error?.message ?? "AI Legal Assistant belum bisa menjawab pertanyaan ini."
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId
              ? { ...m, content: `${m.content}${chunk}` }
              : m
          )
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "AI Legal Assistant belum bisa menjawab pertanyaan ini.";
      setMessages((current) =>
        current.map((m) =>
          m.id === assistantId ? { ...m, content: message } : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">

      {/* ── Panel header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
          <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">AI Legal Assistant</h2>
          <p className="text-xs text-zinc-600">Tanya jawab berbasis dokumen ini</p>
        </div>
        {isStreaming && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse-subtle" aria-hidden="true" />
            Menyusun jawaban
          </div>
        )}
      </div>

      {/* ── Message area ──────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 overflow-auto p-4",
          hasMessages ? "max-h-96 space-y-3" : "space-y-2"
        )}
        role="log"
        aria-live="polite"
        aria-label="Percakapan AI Legal Assistant"
      >
        {!hasMessages ? (
          /* ── Suggested questions ─── */
          <AnimatePresence>
            <div className="space-y-2">
              <p className="mb-3 text-xs text-zinc-600">
                Pertanyaan yang disarankan berdasarkan kontrak ini:
              </p>
              {analysis.suggested_questions.map((question, i) => (
                <motion.button
                  key={question}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  type="button"
                  className={cn(
                    "block w-full rounded-lg border border-zinc-800 bg-zinc-800/40",
                    "px-3.5 py-3 text-left text-sm leading-relaxed text-zinc-400",
                    // Targeted transition for instant feel
                    "transition-[border-color,background-color,color] duration-150",
                    "hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  )}
                  onClick={() => void ask(question)}
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          /* ── Chat messages ─── */
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2.5",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-blue-600"
                      : "border border-zinc-700 bg-zinc-800"
                  )}
                >
                  {message.role === "user" ? (
                    <UserRound className="h-3 w-3 text-white" aria-hidden="true" />
                  ) : (
                    <Bot className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-800 bg-zinc-800/60 text-zinc-300"
                  )}
                >
                  <p className="whitespace-pre-wrap">
                    {message.content || (
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Menyusun jawaban...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Input form ────────────────────────────────────────────── */}
      <form
        onSubmit={submit}
        className="border-t border-zinc-800 p-3"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void ask(input);
            }
          }}
          placeholder="Tanya soal pesangon, lembur, PKWT, upah, cuti, atau klausul lain..."
          disabled={isStreaming}
          className="min-h-[72px] resize-none text-xs"
          aria-label="Pertanyaan untuk AI Legal Assistant"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-zinc-600">Enter untuk kirim · Shift+Enter baris baru</p>
          <Button
            type="submit"
            size="sm"
            disabled={isStreaming || !input.trim()}
          >
            {isStreaming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <SendHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Kirim
          </Button>
        </div>
      </form>
    </div>
  );
}
