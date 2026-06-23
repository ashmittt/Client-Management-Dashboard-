'use client';

import { updateInvoice, deleteInvoice } from '@/actions/invoices';
import type { Invoice, InvoiceStatus } from '@/types';

const invoiceStatusConfig: Record<
  InvoiceStatus,
  { label: string; classes: string }
> = {
  unpaid: { label: 'Unpaid', classes: 'bg-yellow-500/10 text-yellow-500' },
  paid: { label: 'Paid', classes: 'bg-green-500/10 text-green-500' },
  overdue: { label: 'Overdue', classes: 'bg-red-500/10 text-red-400' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function InvoiceTable({
  invoices,
  clientId,
  onInvoiceChanged,
  onEditInvoice,
}: {
  invoices: Invoice[];
  clientId: string;
  onInvoiceChanged: () => void;
  onEditInvoice: (invoice: Invoice) => void;
}) {
  async function handleStatusChange(
    invoiceId: string,
    newStatus: InvoiceStatus
  ) {
    await updateInvoice(invoiceId, clientId, { status: newStatus });
    onInvoiceChanged();
  }

  async function handleDelete(invoiceId: string) {
    const confirmed = window.confirm(
      'Delete this invoice? This cannot be undone.'
    );
    if (!confirmed) return;

    await deleteInvoice(invoiceId, clientId);
    onInvoiceChanged();
  }

  if (invoices.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-text-muted text-xs">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-3 py-1.5 text-[11px] text-text-muted uppercase tracking-wider">
        <span>Amount</span>
        <span>Due date</span>
        <span>Status</span>
        <span className="w-8" />
        <span className="w-12" />
      </div>

      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 items-start sm:items-center px-3 py-2.5 bg-[#0a0a0a] border border-border hover:border-border-hover transition-colors duration-150 group"
        >
          <span className="text-sm font-medium text-text-primary font-mono">
            {formatCurrency(Number(invoice.amount))}
          </span>
          <span className="text-sm text-text-secondary">
            {formatDate(invoice.due_date)}
          </span>
          <select
            value={invoice.status}
            onChange={(e) =>
              handleStatusChange(
                invoice.id,
                e.target.value as InvoiceStatus
              )
            }
            className={`text-[11px] font-medium rounded-full px-2.5 py-1 border-none outline-none cursor-pointer appearance-none ${
              invoiceStatusConfig[invoice.status].classes
            }`}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            type="button"
            onClick={() => onEditInvoice(invoice)}
            className="text-[11px] text-text-muted hover:text-text-primary transition-colors duration-150 sm:opacity-0 sm:group-hover:opacity-100 w-8 text-center"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(invoice.id)}
            className="text-[11px] text-text-muted hover:text-red-400 transition-colors duration-150 sm:opacity-0 sm:group-hover:opacity-100 w-12 text-right"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
