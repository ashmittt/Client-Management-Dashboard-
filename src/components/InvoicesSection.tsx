"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, Invoice, InvoiceStatus } from "@/lib/supabase";

const invoiceStatusConfig: Record<
  InvoiceStatus,
  { label: string; classes: string }
> = {
  unpaid: { label: "Unpaid", classes: "bg-yellow-500/10 text-yellow-500" },
  paid: { label: "Paid", classes: "bg-green-500/10 text-green-500" },
  overdue: { label: "Overdue", classes: "bg-red-500/10 text-red-400" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvoicesSection({ clientId }: { clientId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setInvoices(data || []);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const due_date = formData.get("due_date") as string;
    const status = formData.get("status") as InvoiceStatus;

    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("invoices").insert({
      client_id: clientId,
      amount,
      due_date,
      status,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      await fetchInvoices();
    }

    setSubmitting(false);
  }

  async function handleStatusChange(
    invoiceId: string,
    newStatus: InvoiceStatus
  ) {
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status: newStatus })
      .eq("id", invoiceId);

    if (!updateError) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      );
    }
  }

  async function handleDelete(invoiceId: string) {
    const confirmed = window.confirm(
      "Delete this invoice? This cannot be undone."
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId);

    if (!deleteError) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    }
  }

  // Calculate total
  const totalUnpaid = invoices
    .filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Invoices
          </h3>
          {totalUnpaid > 0 && (
            <span className="text-[11px] text-text-muted">
              {formatCurrency(totalUnpaid)} outstanding
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150"
        >
          {showForm ? "Cancel" : "Add invoice"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-3">{error}</p>
      )}

      {/* Add Invoice Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0a0a0a] border border-border p-4 mb-3 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="invoice-amount" className="block text-[11px] text-text-muted mb-1">
                Amount ($)
              </label>
              <input
                id="invoice-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none"
              />
            </div>
            <div>
              <label htmlFor="invoice-due-date" className="block text-[11px] text-text-muted mb-1">
                Due date
              </label>
              <input
                id="invoice-due-date"
                name="due_date"
                type="date"
                required
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="invoice-status" className="block text-[11px] text-text-muted mb-1">
                Status
              </label>
              <select
                id="invoice-status"
                name="status"
                defaultValue="unpaid"
                className="w-full bg-surface border border-border px-3 py-2 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none appearance-none cursor-pointer"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-white text-black text-xs font-medium rounded hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add invoice"}
          </button>
        </form>
      )}

      {/* Invoices List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-[#0a0a0a] border border-border animate-pulse"
            />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-text-muted text-xs">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-3 py-1.5 text-[11px] text-text-muted uppercase tracking-wider">
            <span>Amount</span>
            <span>Due date</span>
            <span>Status</span>
            <span className="w-12" />
          </div>

          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto] gap-2 sm:gap-4 items-start sm:items-center px-3 py-2.5 bg-[#0a0a0a] border border-border hover:border-border-hover transition-colors duration-150 group"
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
                onClick={() => handleDelete(invoice.id)}
                className="text-[11px] text-text-muted hover:text-red-400 transition-colors duration-150 sm:opacity-0 sm:group-hover:opacity-100 w-12 text-right"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
