export default function ClientDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Top Bar Skeleton */}
      <header className="border-b border-border bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">
            <div className="h-4 w-12 bg-surface rounded animate-pulse" />
            <span className="w-px h-4 bg-border" />
            <div className="h-4 w-32 bg-surface rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Client Info */}
        <section className="bg-surface border border-border p-6 animate-pulse">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="h-5 w-40 bg-[#1a1a1a] rounded mb-2" />
              <div className="h-3.5 w-24 bg-[#1a1a1a] rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-[#1a1a1a] rounded" />
              <div className="h-8 w-16 bg-[#1a1a1a] rounded" />
              <div className="h-8 w-20 bg-[#1a1a1a] rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-2.5 w-10 bg-[#1a1a1a] rounded mb-1.5" />
              <div className="h-4 w-36 bg-[#1a1a1a] rounded" />
            </div>
            <div>
              <div className="h-2.5 w-10 bg-[#1a1a1a] rounded mb-1.5" />
              <div className="h-4 w-28 bg-[#1a1a1a] rounded" />
            </div>
          </div>
        </section>

        {/* Notes Skeleton */}
        <section className="bg-surface border border-border p-6 animate-pulse">
          <div className="h-3 w-12 bg-[#1a1a1a] rounded mb-3" />
          <div className="h-32 w-full bg-[#0a0a0a] border border-border" />
        </section>

        {/* Files Skeleton */}
        <section className="bg-surface border border-border p-6 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-10 bg-[#1a1a1a] rounded" />
            <div className="h-7 w-20 bg-[#1a1a1a] rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-[#0a0a0a] border border-border" />
            <div className="h-10 bg-[#0a0a0a] border border-border" />
          </div>
        </section>

        {/* Invoices Skeleton */}
        <section className="bg-surface border border-border p-6 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-16 bg-[#1a1a1a] rounded" />
            <div className="h-7 w-24 bg-[#1a1a1a] rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-[#0a0a0a] border border-border" />
            <div className="h-12 bg-[#0a0a0a] border border-border" />
            <div className="h-12 bg-[#0a0a0a] border border-border" />
          </div>
        </section>
      </main>
    </div>
  );
}
