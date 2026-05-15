import { cn } from '@/lib/utils';

export default function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <div className={cn('mb-3 flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal/42">
            {eyebrow}
          </p>
        )}
        {title && <h2 className="mt-1 text-lg font-extrabold leading-tight text-charcoal">{title}</h2>}
        {description && <p className="mt-1 text-xs leading-5 text-charcoal/58">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
