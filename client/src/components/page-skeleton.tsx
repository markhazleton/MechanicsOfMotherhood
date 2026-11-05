export default function PageSkeleton() {
  const block = "animate-pulse rounded-md bg-muted";
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading page">
      {/* Header */}
      <div className="border-b border-border-subtle">
        <div className="site-container flex h-[72px] items-center gap-3">
          <div className={`${block} size-10`} />
          <div className={`${block} h-6 w-40`} />
        </div>
      </div>

      {/* Page heading */}
      <div className="site-container space-y-4 py-12 md:py-16">
        <div className={`${block} h-4 w-32`} />
        <div className={`${block} h-12 w-full max-w-xl`} />
        <div className={`${block} h-5 w-full max-w-lg`} />
      </div>

      {/* Card grid */}
      <div className="site-container grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className={`${block} aspect-[4/3] w-full rounded-none`} />
            <div className="space-y-3 p-5">
              <div className={`${block} h-5 w-3/4`} />
              <div className={`${block} h-4 w-full`} />
              <div className={`${block} h-4 w-2/3`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
