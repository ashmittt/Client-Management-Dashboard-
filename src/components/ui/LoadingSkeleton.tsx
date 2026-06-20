export function CardSkeleton() {
  return (
    <div className="bg-surface border border-border p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-28 bg-[#1a1a1a] rounded" />
        <div className="h-5 w-16 bg-[#1a1a1a] rounded-full" />
      </div>
      <div className="h-3 w-20 bg-[#1a1a1a] rounded mb-3" />
      <div className="h-2.5 w-16 bg-[#1a1a1a] rounded" />
    </div>
  );
}

export function LineSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-10 bg-[#0a0a0a] border border-border animate-pulse"
        />
      ))}
    </div>
  );
}

export function TextBlockSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-12 bg-[#1a1a1a] rounded mb-3" />
      <div className="h-32 w-full bg-[#0a0a0a] border border-border" />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="animate-pulse">
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
    </div>
  );
}

export function SectionSkeleton({
  headerWidth = 'w-16',
  buttonWidth = 'w-24',
  lines = 3,
  lineHeight = 'h-12',
}: {
  headerWidth?: string;
  buttonWidth?: string;
  lines?: number;
  lineHeight?: string;
}) {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-3 ${headerWidth} bg-[#1a1a1a] rounded`} />
        <div className={`h-7 ${buttonWidth} bg-[#1a1a1a] rounded`} />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${lineHeight} bg-[#0a0a0a] border border-border`}
          />
        ))}
      </div>
    </div>
  );
}
