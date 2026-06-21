'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateClientStatus } from '@/actions/clients';
import type { ClientStatus } from '@/types';

const statuses: { value: ClientStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const statusColors: Record<ClientStatus, string> = {
  active: 'border-status-active text-status-active bg-status-active/10',
  paused: 'border-status-paused text-status-paused bg-status-paused/10',
  completed:
    'border-status-completed text-status-completed bg-status-completed/10',
};

const statusInactive: Record<ClientStatus, string> = {
  active:
    'border-border text-text-muted hover:border-status-active/40 hover:text-status-active/60',
  paused:
    'border-border text-text-muted hover:border-status-paused/40 hover:text-status-paused/60',
  completed:
    'border-border text-text-muted hover:border-status-completed/40 hover:text-status-completed/60',
};

export default function StatusSelector({
  clientId,
  currentStatus,
}: {
  clientId: string;
  currentStatus: ClientStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus: ClientStatus) {
    if (newStatus === status) return;
    const prevStatus = status;
    setSaving(true);
    setStatus(newStatus); // Optimistic update

    const result = await updateClientStatus(clientId, newStatus);

    if (result.error) {
      setStatus(prevStatus); // Revert on error
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => handleChange(s.value)}
          disabled={saving}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors duration-150 disabled:opacity-50 ${
            status === s.value
              ? statusColors[s.value]
              : statusInactive[s.value]
          }`}
        >
          {s.label}
        </button>
      ))}
      {saving && (
        <span className="text-[11px] text-text-muted ml-1">Saving...</span>
      )}
    </div>
  );
}
