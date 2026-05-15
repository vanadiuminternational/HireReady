import { cn } from '@/lib/utils';

export default function SmartBadge({ children, icon: Icon, className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary', className)}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}
