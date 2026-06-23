'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Invoice } from '@/types';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceFormModal from '@/components/invoices/InvoiceFormModal';
import { LineSkeleton } from '@/components/ui/LoadingSkeleton';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function InvoicesSection({
  clientId,
}: {
  clientId: string;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (!error) {
      setInvoices(data || []);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  function handleEditInvoice(invoice: Invoice) {
    setEditingInvoice(invoice);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingInvoice(null);
  }

  // Compute totals
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'unpaid' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Invoices
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingInvoice(null);
            setShowModal(true);
          }}
          className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150"
        >
          Add invoice
        </button>
      </div>

      {/* Totals */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#0a0a0a] border border-border px-3 py-2.5">
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
              Total invoiced
            </p>
            <p className="text-sm font-medium text-text-primary font-mono">
              {formatCurrency(totalInvoiced)}
            </p>
          </div>
          <div className="bg-[#0a0a0a] border border-border px-3 py-2.5">
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
              Paid
            </p>
            <p className="text-sm font-medium text-status-active font-mono">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="bg-[#0a0a0a] border border-border px-3 py-2.5">
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
              Outstanding
            </p>
            <p className="text-sm font-medium text-status-paused font-mono">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showModal && (
        <InvoiceFormModal
          clientId={clientId}
          invoice={editingInvoice}
          onClose={handleCloseModal}
          onSaved={fetchInvoices}
        />
      )}

      {/* Invoices List */}
      {loading ? (
        <LineSkeleton count={3} />
      ) : (
        <InvoiceTable
          invoices={invoices}
          clientId={clientId}
          onInvoiceChanged={fetchInvoices}
          onEditInvoice={handleEditInvoice}
        />
      )}
    </div>
  );
}
