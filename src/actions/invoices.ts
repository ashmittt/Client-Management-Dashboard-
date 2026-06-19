'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { InvoiceStatus } from '@/types';

export async function createInvoice(formData: FormData): Promise<{ error?: string }> {
  const client_id = formData.get('client_id') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const due_date = formData.get('due_date') as string;
  const status = (formData.get('status') as InvoiceStatus) || 'unpaid';

  if (!client_id) {
    return { error: 'Client ID is required' };
  }

  if (isNaN(amount) || amount <= 0) {
    return { error: 'Enter a valid amount' };
  }

  if (!due_date) {
    return { error: 'Due date is required' };
  }

  const { error } = await supabase.from('invoices').insert({
    client_id,
    amount,
    due_date,
    status,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/clients/${client_id}`);
  return {};
}

export async function updateInvoice(
  invoiceId: string,
  clientId: string,
  data: { amount?: number; due_date?: string; status?: InvoiceStatus }
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('invoices')
    .update(data)
    .eq('id', invoiceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/clients/${clientId}`);
  return {};
}

export async function deleteInvoice(
  invoiceId: string,
  clientId: string
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/clients/${clientId}`);
  return {};
}
