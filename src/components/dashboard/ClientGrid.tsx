import type { Client } from '@/types';
import ClientCard from '@/components/clients/ClientCard';
import EmptyState from '@/components/ui/EmptyState';

export default function ClientGrid({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="No clients yet"
        description="Add your first client to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
