import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecommendationCard({
  mode,
  targetRole,
  region,
  stage,
  template,
  className = '',
}) {
  return (
    <section className={cn('overflow-hidden rounded-[1.65rem] bg-charcoal text-white shadow-[0_22px_46px_rgba(17,24,39,0.18)]', className)}>
      <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.24),transparent_13rem)] p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Recommended CV</p>
            <h2 className="mt-2 text-[1.35rem] font-extrabold leading-tight">{mode}</h2>
            {targetRole && <p className="mt-1 truncate text-sm font-medium text-white/58">for {targetRole}</p>}
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <FileText size={20} />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ['Market', region],
            ['Stage', stage],
            ['Start', template],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-2xl bg-white/9 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">{label}</p>
              <p className="mt-1 truncate text-xs font-bold text-white/86">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
