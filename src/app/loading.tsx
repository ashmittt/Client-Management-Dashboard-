import { CardSkeleton } from '@/components/ui/LoadingSkeleton';

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
          {/* Search & Filter Row Skeleton */}
          <div className="flex items-center gap-3 pb-3">
            <div className="h-8 w-56 bg-surface border border-border animate-pulse" />
            <div className="h-8 w-32 bg-surface border border-border animate-pulse" />
          </div>
        </div>
      </header>

      {/* Grid Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
