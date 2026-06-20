'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef, useCallback, useEffect, useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearch(newValue);
    }, 300);
  }

  // Sync with URL if it changes externally
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== value) {
      setValue(urlSearch);
    }
    // Only re-sync when searchParams change, not when value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search clients..."
      aria-label="Search clients"
      className="bg-[#0a0a0a] border border-border px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none w-full sm:w-56"
    />
  );
}
