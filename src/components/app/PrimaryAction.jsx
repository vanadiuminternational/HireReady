import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PrimaryAction({
  children,
  to,
  onClick,
  type = 'button',
  icon: Icon = ArrowRight,
  disabled = false,
  className = '',
}) {
  const classes = cn(
    'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-5 py-3 text-sm font-bold text-white shadow-[0_16px_28px_rgba(17,24,39,0.18)] transition active:scale-[0.99]',
    disabled && 'pointer-events-none opacity-45 shadow-none',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        <span>{children}</span>
        {Icon && <Icon size={17} />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      <span>{children}</span>
      {Icon && <Icon size={17} />}
    </button>
  );
}
