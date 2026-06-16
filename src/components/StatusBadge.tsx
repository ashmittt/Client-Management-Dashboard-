import { ClientStatus } from "@/lib/supabase";

const statusConfig: Record<
  ClientStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: "Active",
    bg: "bg-status-active/10",
    text: "text-status-active",
    dot: "bg-status-active",
  },
  paused: {
    label: "Paused",
    bg: "bg-status-paused/10",
    text: "text-status-paused",
    dot: "bg-status-paused",
  },
  completed: {
    label: "Completed",
    bg: "bg-status-completed/10",
    text: "text-status-completed",
    dot: "bg-status-completed",
  },
};

export default function StatusBadge({ status }: { status: ClientStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
