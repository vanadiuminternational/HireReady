import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppHeader({
  eyebrow,
  title,
  description,
  backTo,
  action,
  className = '',
}) {
  return (
    <header className={cn('space-y-3 pb-3 pt-2', className)}>
      <div className="flex min-h-10 items-center justify-between gap-3">
        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/75 text-charcoal shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </Link>
        ) : (
          <div className="h-10" />
        )}
        {action}
      </div>

      <div className="space-y-2.5">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[1.68rem] font-extrabold leading-[1.08] text-charcoal">
          {title}
        </h1>
        {description && (
          <p className="max-w-md text-sm leading-6 text-charcoal/70">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
