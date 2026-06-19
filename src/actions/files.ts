'use server';

import { supabase } from '@/lib/supabase';

export async function deleteFile(
  clientId: string,
  fileName: string
): Promise<{ error?: string }> {
  const { error } = await supabase.storage
    .from('client-files')
    .remove([`${clientId}/${fileName}`]);

  if (error) {
    return { error: error.message };
  }

  return {};
}
