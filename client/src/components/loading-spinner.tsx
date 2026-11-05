import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8" role="status">
      <Loader2 className="size-8 animate-spin text-primary-ink" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
