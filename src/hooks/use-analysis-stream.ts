"use client";

import { useEffect, useMemo, useState } from "react";

const phases = [
  { label: "Mengunggah PDF", progress: 18 },
  { label: "Membaca klausul", progress: 42 },
  { label: "Memvalidasi sinyal hukum", progress: 61 },
  { label: "Menyusun temuan analisis", progress: 82 }
];

export function useAnalysisStream(isActive: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => Math.min(current + 1, phases.length - 1));
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isActive]);

  return useMemo(
    () => ({
      phase: isActive ? phases[index].label : "Siap",
      progress: isActive ? phases[index].progress : 0
    }),
    [index, isActive]
  );
}
