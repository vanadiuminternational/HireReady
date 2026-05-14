import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400', badge: 'bg-blue-100 text-blue-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  navy: { bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700' },
};

export default function TemplateCard({ template, onUse }) {
  const colors = colorMap[template.color] || colorMap.blue;
  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm">{template.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{template.bestFor}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${colors.badge}`}>
          <Shield size={10} /> {template.atsLabel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground mb-1.5">Section order:</p>
        <div className="flex flex-wrap gap-1.5">
          {template.sectionOrder.map((s, i) => (
            <span key={i} className="text-xs bg-white border border-border rounded-full px-2.5 py-0.5 text-foreground capitalize">{s.replace(/([A-Z])/g, ' $1')}</span>
          ))}
        </div>
      </div>
      <button onClick={() => onUse && onUse(template)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl py-2.5 transition-opacity hover:opacity-90">
        Use This Template <ArrowRight size={15} />
      </button>
    </div>
  );
}