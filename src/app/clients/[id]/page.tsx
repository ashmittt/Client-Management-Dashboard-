import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Client } from '@/types';
import ClientHeader from '@/components/clients/ClientHeader';
import NotesSection from '@/components/clients/NotesSection';
import FilesSection from '@/components/files/FilesSection';
import InvoicesSection from '@/components/invoices/InvoicesSection';

export const dynamic = 'force-dynamic';

async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  return {
    title: client
      ? `${client.name} — Clients`
      : 'Client Not Found — Clients',
  };
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-border bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">
            <Link
              href="/"
              className="text-text-muted hover:text-text-secondary transition-colors duration-150 text-sm"
            >
              ← Back
            </Link>
            <span className="w-px h-4 bg-border" />
            <h1 className="text-sm font-semibold text-text-primary truncate">
              {client.name}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Client Info */}
        <ClientHeader client={client} />

        {/* Notes */}
        <section className="bg-surface border border-border p-6">
          <NotesSection clientId={client.id} initialNotes={client.notes} />
        </section>

        {/* Files */}
        <section className="bg-surface border border-border p-6">
          <FilesSection clientId={client.id} />
        </section>

        {/* Invoices */}
        <section className="bg-surface border border-border p-6">
          <InvoicesSection clientId={client.id} />
        </section>
      </main>
    </div>
  );
}
