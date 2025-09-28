import { Settings, Utensils } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
  <Settings className="text-gray-400 text-4xl animate-spin-slow opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white rounded-full p-2 shadow">
    <Utensils className="text-orange-500 text-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
