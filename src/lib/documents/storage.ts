"use client";

import type { AnalyzeContractResponse, DocumentHistoryItem, StoredDocument } from "@/lib/types";

const HISTORY_KEY = "hukumvibe:history";
const DOCUMENT_KEY_PREFIX = "hukumvibe:document:";

function readJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function toHistoryItem(document: StoredDocument): DocumentHistoryItem {
  return {
    documentId: document.documentId,
    fileName: document.fileName,
    createdAt: document.createdAt,
    size: document.size,
    safetyScore: document.analysis.document_metadata.safety_score,
    redFlagCount: document.analysis.red_flag_count,
    contractType: document.analysis.document_metadata.contract_type,
    status: document.status
  };
}

export function getDocumentHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  return readJson<DocumentHistoryItem[]>(window.localStorage, HISTORY_KEY, []);
}

export function saveAnalyzedDocument(response: AnalyzeContractResponse, pdfUrl?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const document: StoredDocument = {
    ...response,
    pdfUrl,
    status: "analyzed"
  };

  window.sessionStorage.setItem(`${DOCUMENT_KEY_PREFIX}${response.documentId}`, JSON.stringify(document));

  const nextHistory = [
    toHistoryItem(document),
    ...getDocumentHistory().filter((item) => item.documentId !== response.documentId)
  ].slice(0, 12);

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
}

export function getStoredDocument(documentId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return readJson<StoredDocument | null>(
    window.sessionStorage,
    `${DOCUMENT_KEY_PREFIX}${documentId}`,
    null
  );
}
