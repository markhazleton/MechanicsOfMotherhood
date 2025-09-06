import { Settings, Utensils } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
    <Settings className="text-brand-tool text-4xl animate-spin-slow opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-2 mechanical-shadow">
      <Utensils className="text-brand-orange text-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
