export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <span className="text-4xl mb-4 opacity-40">{icon}</span>}
      <p className="text-text-secondary text-sm font-medium">{title}</p>
      {description && (
        <p className="text-text-muted text-xs mt-1.5">{description}</p>
      )}
    </div>
  );
}
