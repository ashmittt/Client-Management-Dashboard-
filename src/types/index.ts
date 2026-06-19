// ── Client Types ──────────────────────────────────────────────

export type ClientStatus = 'active' | 'paused' | 'completed';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
}

// ── Invoice Types ─────────────────────────────────────────────

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
}

export interface CreateInvoicePayload {
  client_id: string;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
}

export interface UpdateInvoicePayload {
  amount?: number;
  due_date?: string;
  status?: InvoiceStatus;
}

// ── File Types ────────────────────────────────────────────────

export interface FileItem {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

// ── Dashboard Types ───────────────────────────────────────────

export interface DashboardSearchParams {
  search?: string;
  status?: ClientStatus | 'all';
}
