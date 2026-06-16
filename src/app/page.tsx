import { supabase, Client } from "@/lib/supabase";
import ClientCard from "@/components/ClientCard";
import AddClientModal from "@/components/AddClientModal";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching clients:", error.message);
    return [];
  }

  return data || [];
}

export default async function Dashboard() {
  const clients = await getClients();

  const activeCount = clients.filter((c) => c.status === "active").length;
  const pausedCount = clients.filter((c) => c.status === "paused").length;
  const completedCount = clients.filter((c) => c.status === "completed").length;

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
                  <span className="text-status-active">{activeCount} active</span>
                  <span className="text-status-paused">{pausedCount} paused</span>
                  <span className="text-status-completed">{completedCount} done</span>
                </div>
              )}
            </div>
            <AddClientModal />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {clients.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No clients yet"
            description="Add your first client to get started."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
