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
    'inline-flex min-h-[3.7rem] w-full items-center justify-center gap-2 rounded-[1.55rem] bg-charcoal px-5 py-3 text-[15px] font-extrabold text-white shadow-[0_18px_36px_rgba(17,24,39,0.18)] transition-all duration-200 active:scale-[0.985]',
    disabled && 'pointer-events-none opacity-42 shadow-none grayscale',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        <span>{children}</span>
        {Icon && <Icon size={18} />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      <span>{children}</span>
      {Icon && <Icon size={18} />}
    </button>
  );
}
