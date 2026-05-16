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
    <header className={cn('space-y-4 pb-3 pt-2', className)}>
      <div className="flex min-h-12 items-center justify-between gap-3">
        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex h-12 min-w-12 items-center justify-center rounded-[1.25rem] border border-black/[0.055] bg-white/82 text-charcoal shadow-[0_10px_24px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-transform active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </Link>
        ) : (
          <div className="h-12" />
        )}
        {action}
      </div>

      <div className="space-y-2.5">
        {eyebrow && (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-[22rem] text-[1.85rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-charcoal">
          {title}
        </h1>
        {description && (
          <p className="max-w-md text-[15px] leading-7 text-charcoal/58">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
