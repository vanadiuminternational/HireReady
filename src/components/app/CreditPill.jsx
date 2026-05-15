import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreditPill({ children = 'Credits later', className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-amber-800', className)}>
      <Coins size={13} />
      {children}
    </span>
  );
}
