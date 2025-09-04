// Lightweight performance monitoring & web vitals collection
// Sends data to console now; can be adapted to remote analytics later.
import { onCLS, onFID, onLCP, onINP, onTTFB } from "web-vitals";

export interface PerformanceMetric {
  name: string;
  value: number;
  rating?: string;
  id?: string;
}

function logMetric(metric: PerformanceMetric) {
  // Basic console logging; swap with network/beacon call if needed
  if (import.meta.env.DEV) {
    console.info("[perf]", metric.name, metric.value, metric.rating);
  }
  // Example beacon placeholder
  // navigator.sendBeacon('/__perf', JSON.stringify(metric));
}

export function initPerformanceMonitoring() {
  // Wrap to avoid execution during SSR (if ever added)
  if (typeof window === "undefined") return;
  try {
    onCLS(logMetric);
    onFID(logMetric);
    onLCP(logMetric);
    onINP?.(logMetric as any);
    onTTFB(logMetric);
  } catch (e) {
    console.warn("Performance monitoring init failed", e);
  }
}
