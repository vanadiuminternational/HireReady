import { FileText } from 'lucide-react';
import PrimaryAction from './PrimaryAction';

export default function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-[1.75rem] border border-black/5 bg-white/90 p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={22} />
      </div>
      <h2 className="text-lg font-bold text-charcoal">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-charcoal/70">{description}</p>}
      {actionLabel && actionTo && (
        <div className="mt-5">
          <PrimaryAction to={actionTo}>{actionLabel}</PrimaryAction>
        </div>
      )}
    </div>
  );
}
