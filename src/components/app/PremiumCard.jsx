import { cn } from '@/lib/utils';

export default function PremiumCard({ children, className = '', tone = 'light' }) {
  const tones = {
    light: 'border-black/5 bg-white/90 shadow-[0_18px_45px_rgba(40,35,25,0.08)]',
    warm: 'border-amber-900/10 bg-[#fff8eb]/90 shadow-[0_18px_45px_rgba(88,64,32,0.08)]',
    dark: 'border-white/10 bg-charcoal text-white shadow-[0_20px_50px_rgba(16,24,39,0.22)]',
    accent: 'border-primary/20 bg-primary/10 shadow-[0_18px_45px_rgba(21,128,107,0.1)]',
  };

  return (
    <section className={cn('rounded-[1.75rem] border p-5 backdrop-blur', tones[tone] || tones.light, className)}>
      {children}
    </section>
  );
}
