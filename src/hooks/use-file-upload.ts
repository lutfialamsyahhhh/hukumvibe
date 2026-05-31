"use client";

import { useCallback, useState } from "react";

import type { AnalyzeContractResponse, ApiErrorResponse } from "@/lib/types";

type UploadState = "idle" | "uploading" | "success" | "error";

export function useFileUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const uploadContract = useCallback(async (file: File): Promise<AnalyzeContractResponse> => {
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as ApiErrorResponse | null;
      const message = payload?.error.message ?? "PDF ini belum bisa dianalisis.";
      setState("error");
      setError(message);
      throw new Error(message);
    }

    const payload = (await response.json()) as AnalyzeContractResponse;
    setState("success");
    return payload;
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  return {
    state,
    error,
    isUploading: state === "uploading",
    uploadContract,
    reset
  };
}
