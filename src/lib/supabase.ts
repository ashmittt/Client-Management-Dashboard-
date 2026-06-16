import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    // Return a dummy client that won't crash at build time
    // but will fail gracefully at runtime
    return createClient('https://placeholder.supabase.co', 'placeholder');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();

// Type definitions
export type ClientStatus = 'active' | 'paused' | 'completed';
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';

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

export interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
}
