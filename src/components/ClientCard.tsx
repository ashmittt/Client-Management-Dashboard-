import Link from "next/link";
import { Client } from "@/lib/supabase";
import StatusBadge from "./StatusBadge";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Link
      href={`/clients/${client.id}`}
      className="block bg-surface border border-border p-5 transition-colors duration-150 hover:border-border-hover hover:bg-[#161616] group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-white">
          {client.name}
        </h3>
        <StatusBadge status={client.status} />
      </div>

      {client.company && (
        <p className="text-xs text-text-secondary mb-3 truncate">
          {client.company}
        </p>
      )}

      <p className="text-[11px] text-text-muted">
        Updated {formatDate(client.updated_at)}
      </p>
    </Link>
  );
}
