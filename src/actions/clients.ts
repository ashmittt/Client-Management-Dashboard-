'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { ClientStatus } from '@/types';

export async function createClient(formData: FormData): Promise<{ error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const company = (formData.get('company') as string)?.trim() || '';
  const email = (formData.get('email') as string)?.trim() || '';
  const phone = (formData.get('phone') as string)?.trim() || '';
  const status = (formData.get('status') as ClientStatus) || 'active';

  if (!name) {
    return { error: 'Client name is required' };
  }

  const { error } = await supabase.from('clients').insert({
    name,
    company,
    email,
    phone,
    status,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return {};
}

export async function updateClientStatus(
  clientId: string,
  status: ClientStatus
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('clients')
    .update({ status })
    .eq('id', clientId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath(`/clients/${clientId}`);
  return {};
}

export async function updateClientNotes(
  clientId: string,
  notes: string
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId);

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function deleteClient(clientId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return {};
}
