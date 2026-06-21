import type { Client } from '@/types';
import StatusSelector from '@/components/clients/StatusSelector';

export default function ClientHeader({ client }: { client: Client }) {
  return (
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
  );
}
