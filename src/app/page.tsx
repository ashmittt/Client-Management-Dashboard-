import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import type { Client } from '@/types';
import ClientGrid from '@/components/dashboard/ClientGrid';
import SearchBar from '@/components/dashboard/SearchBar';
import StatusFilter from '@/components/dashboard/StatusFilter';
import AddClientModal from '@/components/clients/AddClientModal';

export const dynamic = 'force-dynamic';

async function getClients(
  search?: string,
  status?: string
): Promise<Client[]> {
  let query = supabase
    .from('clients')
    .select('*')
    .order('updated_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clients:', error.message);
    return [];
  }

  return data || [];
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const clients = await getClients(search, status);

  const activeCount = clients.filter(
    (c) => c.status === 'active'
  ).length;
  const pausedCount = clients.filter(
    (c) => c.status === 'paused'
  ).length;
  const completedCount = clients.filter(
    (c) => c.status === 'completed'
  ).length;

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="border-b border-border bg-[#0a0a0a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <h1 className="text-sm font-semibold text-text-primary tracking-tight">
                Clients
              </h1>
              {clients.length > 0 && (
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-text-muted">
                  <span>{clients.length} total</span>
                  <span className="w-px h-3 bg-border" />
                  <span className="text-status-active">
                    {activeCount} active
                  </span>
                  <span className="text-status-paused">
                    {pausedCount} paused
                  </span>
                  <span className="text-status-completed">
                    {completedCount} done
                  </span>
                </div>
              )}
            </div>
            <AddClientModal />
          </div>

          {/* Search & Filter Row */}
          <div className="flex items-center gap-3 pb-3">
            <Suspense>
              <SearchBar />
            </Suspense>
            <Suspense>
              <StatusFilter />
            </Suspense>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {search || status ? (
          // Show filtered results with context
          <div>
            {clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <span className="text-4xl mb-4 opacity-40">🔍</span>
                <p className="text-text-secondary text-sm font-medium">
                  No clients found
                </p>
                <p className="text-text-muted text-xs mt-1.5">
                  Try adjusting your search or filter.
                </p>
              </div>
            ) : (
              <ClientGrid clients={clients} />
            )}
          </div>
        ) : (
          <ClientGrid clients={clients} />
        )}
      </main>
    </div>
  );
}
