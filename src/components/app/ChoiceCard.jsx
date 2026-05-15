import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChoiceCard({
  title,
  detail,
  meta,
  icon: Icon,
  selected = false,
  compact = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-start gap-3 rounded-[1.35rem] border text-left transition active:scale-[0.99]',
        compact ? 'min-h-[76px] p-3.5' : 'min-h-[92px] p-4',
        selected
          ? 'border-charcoal bg-charcoal text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)]'
          : 'border-black/7 bg-white/82 text-charcoal shadow-sm',
        className,
      )}
      aria-pressed={selected}
    >
      {Icon && (
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
            selected ? 'bg-white/12 text-white' : 'bg-primary/9 text-primary',
          )}
        >
          <Icon size={18} />
        </span>
      )}

      <span className="min-w-0 flex-1">
        {meta && (
          <span className={cn('mb-1 block text-[10px] font-bold uppercase tracking-[0.14em]', selected ? 'text-white/45' : 'text-charcoal/38')}>
            {meta}
          </span>
        )}
        <span className={cn('block font-bold leading-snug', compact ? 'text-sm' : 'text-[15px]', selected ? 'text-white' : 'text-charcoal')}>
          {title}
        </span>
        {detail && (
          <span className={cn('mt-1 block leading-5', compact ? 'text-xs' : 'text-[13px]', selected ? 'text-white/58' : 'text-charcoal/58')}>
            {detail}
          </span>
        )}
      </span>

      <span
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition',
          selected ? 'border-white/40 bg-white text-charcoal' : 'border-black/12 bg-white/80 text-transparent',
        )}
      >
        <Check size={14} strokeWidth={3} />
      </span>
    </button>
  );
}
