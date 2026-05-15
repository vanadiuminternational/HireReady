export default function StepProgress({ current = 1, total = 1 }) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 1), safeTotal);

  return (
    <div className="space-y-2" aria-label={`Step ${safeCurrent} of ${safeTotal}`}>
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal/50">
        <span>Step {safeCurrent}</span>
        <span>{safeTotal}</span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))` }}>
        {Array.from({ length: safeTotal }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full ${index < safeCurrent ? 'bg-primary' : 'bg-black/10'}`}
          />
        ))}
      </div>
    </div>
  );
}
