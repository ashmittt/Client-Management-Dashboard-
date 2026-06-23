'use client';

import { useRef, useEffect, useState, useTransition } from 'react';
import { createInvoice, updateInvoice } from '@/actions/invoices';
import type { Invoice, InvoiceStatus } from '@/types';

interface InvoiceFormModalProps {
  clientId: string;
  invoice?: Invoice | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function InvoiceFormModal({
  clientId,
  invoice,
  onClose,
  onSaved,
}: InvoiceFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const isEditing = !!invoice;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();

    // Light-dismiss fallback
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isInside) return;
        onClose();
      };
      dialog.addEventListener('click', handleClick);
      return () => dialog.removeEventListener('click', handleClick);
    }
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (isEditing && invoice) {
        const amount = parseFloat(formData.get('amount') as string);
        const due_date = formData.get('due_date') as string;
        const status = formData.get('status') as InvoiceStatus;

        if (isNaN(amount) || amount <= 0) {
          setError('Enter a valid amount');
          return;
        }

        const result = await updateInvoice(invoice.id, clientId, {
          amount,
          due_date,
          status,
        });

        if (result.error) {
          setError(result.error);
          return;
        }
      } else {
        formData.set('client_id', clientId);
        const result = await createInvoice(formData);

        if (result.error) {
          setError(result.error);
          return;
        }
      }

      onSaved();
      onClose();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="invoice-form-title"
      className="w-full max-w-md"
    >
      <div className="bg-surface border border-border p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2
            id="invoice-form-title"
            className="text-sm font-medium text-text-primary"
          >
            {isEditing ? 'Edit invoice' : 'Add invoice'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary transition-colors duration-150 text-lg leading-none"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="invoice-modal-amount"
              className="block text-xs text-text-secondary mb-1.5"
            >
              Amount ($) *
            </label>
            <input
              id="invoice-modal-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={invoice ? Number(invoice.amount) : ''}
              placeholder="0.00"
              className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="invoice-modal-due-date"
              className="block text-xs text-text-secondary mb-1.5"
            >
              Due date *
            </label>
            <input
              id="invoice-modal-due-date"
              name="due_date"
              type="date"
              required
              defaultValue={invoice?.due_date || ''}
              className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none [color-scheme:dark]"
            />
          </div>

          <div>
            <label
              htmlFor="invoice-modal-status"
              className="block text-xs text-text-secondary mb-1.5"
            >
              Status
            </label>
            <select
              id="invoice-modal-status"
              name="status"
              defaultValue={invoice?.status || 'unpaid'}
              className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none appearance-none cursor-pointer"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Adding...'
                : isEditing
                  ? 'Save changes'
                  : 'Add invoice'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-border text-text-secondary text-sm rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
