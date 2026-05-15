import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function SecondaryAction({
  children,
  to,
  onClick,
  type = 'button',
  icon: Icon,
  className = '',
}) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/75 px-4 py-2.5 text-sm font-semibold text-charcoal shadow-sm transition active:scale-[0.99]',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {Icon && <Icon size={16} />}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
}
