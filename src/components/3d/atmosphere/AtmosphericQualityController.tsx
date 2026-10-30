import { useEffect, useState, useCallback } from "react";

export type QualityPreset = "high" | "medium" | "low";

export function useAtmosphericQuality(reducedMotion: boolean = false): {
  quality: QualityPreset;
  setQuality: (q: QualityPreset) => void;
  cycleQuality: () => void;
} {
  const [quality, setQualityState] = useState<QualityPreset>(() => {
    const saved = localStorage.getItem("kingdom-quality-v4") as QualityPreset | null;
    if (saved === "high" || saved === "medium" || saved === "low") {
      return saved;
    }
    // Auto-detect based on client hardware and mobile status
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
      if (isMobile) return "low";
      if (lowCores) return "medium";
    }
    return "high";
  });

  const setQuality = useCallback((newQuality: QualityPreset) => {
    setQualityState(newQuality);
    localStorage.setItem("kingdom-quality-v4", newQuality);
    document.documentElement.dataset.atmosphereQuality = newQuality;
  }, []);

  const cycleQuality = useCallback(() => {
    setQualityState((prev) => {
      const next: QualityPreset = prev === "high" ? "medium" : prev === "medium" ? "low" : "high";
      localStorage.setItem("kingdom-quality-v4", next);
      document.documentElement.dataset.atmosphereQuality = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.dataset.atmosphereQuality = "low";
    } else {
      document.documentElement.dataset.atmosphereQuality = quality;
    }
  }, [reducedMotion, quality]);

  return { quality: reducedMotion ? "low" : quality, setQuality, cycleQuality };
}
