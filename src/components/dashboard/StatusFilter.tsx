'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
] as const;

export default function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === 'all') {
      params.delete('status');
    } else {
      params.set('status', e.target.value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      aria-label="Filter by status"
      className="bg-[#0a0a0a] border border-border px-3 py-1.5 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none appearance-none cursor-pointer"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
