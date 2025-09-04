export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-blue-500 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title */}
          <div className="h-12 w-96 bg-gray-200 rounded animate-pulse"></div>
          
          {/* Content blocks */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
