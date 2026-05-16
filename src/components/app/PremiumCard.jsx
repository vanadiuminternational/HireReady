import { cn } from '@/lib/utils';

export default function PremiumCard({ children, className = '', tone = 'light' }) {
  const tones = {
    light: 'border-black/[0.055] bg-white/92 shadow-[0_14px_34px_rgba(31,41,55,0.09),0_2px_8px_rgba(31,41,55,0.045)]',
    warm: 'border-amber-900/10 bg-[#fff8eb]/92 shadow-[0_14px_34px_rgba(88,64,32,0.09),0_2px_8px_rgba(88,64,32,0.045)]',
    dark: 'border-white/10 bg-charcoal text-white shadow-[0_20px_50px_rgba(16,24,39,0.22)]',
    accent: 'border-primary/15 bg-primary/[0.075] shadow-[0_14px_34px_rgba(21,128,107,0.11),0_2px_8px_rgba(21,128,107,0.05)]',
    green: 'border-primary/10 bg-primary text-white shadow-[0_20px_55px_rgba(21,128,107,0.24)]',
  };

  return (
    <section className={cn('rounded-[1.8rem] border p-5 backdrop-blur-xl transition-transform duration-200 active:scale-[0.992]', tones[tone] || tones.light, className)}>
      {children}
    </section>
  );
}
