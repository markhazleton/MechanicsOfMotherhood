import { useCallback } from "react";

/**
 * Hook to send accessible announcements to the global polite live region (#app-live-region).
 * Falls back gracefully if region not found.
 */
export function useAnnounce() {
  return useCallback((message: string) => {
    if (!message) return;
    const region = document.getElementById("app-live-region");
    if (region) {
      // Clear first to ensure repeated messages announce
      region.textContent = "";
      window.requestAnimationFrame(() => {
        region.textContent = message;
      });
    }
  }, []);
}

export default useAnnounce;
