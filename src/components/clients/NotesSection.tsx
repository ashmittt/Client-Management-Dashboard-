'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { updateClientNotes } from '@/actions/clients';

export default function NotesSection({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  );
  const lastSavedRef = useRef(initialNotes || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const savedIndicatorRef = useRef<NodeJS.Timeout | null>(null);

  const saveNotes = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (trimmed === lastSavedRef.current.trim()) return;

      setSaveState('saving');

      const result = await updateClientNotes(clientId, trimmed);

      if (!result.error) {
        lastSavedRef.current = trimmed;
        setSaveState('saved');

        // Clear "Saved" indicator after 2 seconds
        if (savedIndicatorRef.current)
          clearTimeout(savedIndicatorRef.current);
        savedIndicatorRef.current = setTimeout(
          () => setSaveState('idle'),
          2000
        );
      } else {
        setSaveState('idle');
      }
    },
    [clientId]
  );

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    setNotes(newValue);

    // Debounce auto-save during typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNotes(newValue);
    }, 1000);
  }

  function handleBlur() {
    // Immediate save on blur
    if (debounceRef.current) clearTimeout(debounceRef.current);
    saveNotes(notes);
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedIndicatorRef.current) clearTimeout(savedIndicatorRef.current);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Notes
        </h3>
        {saveState === 'saving' && (
          <span className="text-[11px] text-text-muted">Saving...</span>
        )}
        {saveState === 'saved' && (
          <span className="text-[11px] text-status-active">Saved</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Add notes about this client..."
        rows={6}
        className="w-full bg-[#0a0a0a] border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none resize-y min-h-[120px] font-sans"
      />
    </div>
  );
}
