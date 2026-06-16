export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Top Bar Skeleton */}
      <header className="border-b border-border bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="h-4 w-16 bg-surface rounded animate-pulse" />
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Grid Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border p-5 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-4 w-28 bg-[#1a1a1a] rounded" />
                <div className="h-5 w-16 bg-[#1a1a1a] rounded-full" />
              </div>
              <div className="h-3 w-20 bg-[#1a1a1a] rounded mb-3" />
              <div className="h-2.5 w-16 bg-[#1a1a1a] rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
