import {
  HeaderSkeleton,
  TextBlockSkeleton,
  SectionSkeleton,
} from '@/components/ui/LoadingSkeleton';

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
        <section className="bg-surface border border-border p-6">
          <HeaderSkeleton />
        </section>

        {/* Notes Skeleton */}
        <section className="bg-surface border border-border p-6">
          <TextBlockSkeleton />
        </section>

        {/* Files Skeleton */}
        <section className="bg-surface border border-border p-6">
          <SectionSkeleton
            headerWidth="w-10"
            buttonWidth="w-20"
            lines={2}
            lineHeight="h-10"
          />
        </section>

        {/* Invoices Skeleton */}
        <section className="bg-surface border border-border p-6">
          <SectionSkeleton
            headerWidth="w-16"
            buttonWidth="w-24"
            lines={3}
            lineHeight="h-12"
          />
        </section>
      </main>
    </div>
  );
}
