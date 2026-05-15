import { AlertTriangle, CheckCircle2, Info, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  info: {
    icon: Info,
    className: 'border-black/6 bg-white/68 text-charcoal/68',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-primary/14 bg-primary/8 text-primary',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-300/40 bg-amber-50/80 text-amber-900',
  },
  lock: {
    icon: Lock,
    className: 'border-black/6 bg-charcoal/6 text-charcoal/62',
  },
};

export default function GuidanceNote({ children, text, variant = 'info', className = '' }) {
  const style = variants[variant] || variants.info;
  const Icon = style.icon;

  return (
    <div className={cn('flex items-start gap-2.5 rounded-2xl border px-3.5 py-3', style.className, className)}>
      <Icon size={15} className="mt-0.5 shrink-0 opacity-80" />
      <p className="text-xs font-medium leading-5">{children || text}</p>
    </div>
  );
}
