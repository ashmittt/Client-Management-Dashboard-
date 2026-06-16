import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase, Client } from "@/lib/supabase";
import StatusSelector from "@/components/StatusSelector";
import NotesSection from "@/components/NotesSection";
import FilesSection from "@/components/FilesSection";
import InvoicesSection from "@/components/InvoicesSection";

export const dynamic = "force-dynamic";

async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClient(params.id);
  return {
    title: client
      ? `${client.name} — Clients`
      : "Client Not Found — Clients",
  };
}

export default async function ClientPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClient(params.id);

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
        <section className="bg-surface border border-border p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {client.name}
              </h2>
              {client.company && (
                <p className="text-sm text-text-secondary">{client.company}</p>
              )}
            </div>
            <StatusSelector
              clientId={client.id}
              currentStatus={client.status}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {client.email && (
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${client.email}`}
                  className="text-sm text-text-primary hover:text-white transition-colors duration-150"
                >
                  {client.email}
                </a>
              </div>
            )}
            {client.phone && (
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block mb-1">
                  Phone
                </span>
                <a
                  href={`tel:${client.phone}`}
                  className="text-sm text-text-primary hover:text-white transition-colors duration-150"
                >
                  {client.phone}
                </a>
              </div>
            )}
          </div>

          {!client.email && !client.phone && (
            <p className="text-xs text-text-muted">
              No contact information added yet.
            </p>
          )}
        </section>

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
