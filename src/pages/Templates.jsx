import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ChevronDown, ChevronUp, Copy, Check, ArrowRight, Shield } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { TEMPLATE_RULES } from '@/data/templateRules';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  navy: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
};

function TemplateCard({ template, onUse }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);
  const colors = colorMap[template.color] || colorMap.blue;

  const handleCopy = async (text, setter) => {
    const copiedToClipboard = await copyToClipboard(text);
    if (copiedToClipboard) {
      setter(true);
      toast.success('Copied!');
      setTimeout(() => setter(false), 2000);
    } else {
      toast.error('Copy failed. Select the text manually.');
    }
  };

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-4`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">{template.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{template.bestFor}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ml-2 ${colors.badge}`}>
          <Shield size={10} /> {template.atsLabel}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{template.description}</p>

      {/* Section order */}
      <div className="mb-3">
        <p className="text-xs font-medium text-foreground mb-1.5">Section order:</p>
        <div className="flex flex-wrap gap-1.5">
          {template.sectionOrder.map((s, i) => (
            <span key={i} className="text-xs bg-white border border-border rounded-full px-2.5 py-0.5 text-foreground capitalize">
              {s.replace(/([A-Z])/g, ' $1')}
            </span>
          ))}
        </div>
      </div>

      {/* Expand for examples */}
      <button onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-3">
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? 'Hide examples' : 'Show examples & skills'}
      </button>

      {expanded && (
        <div className="space-y-3 mb-3">
          {/* Example summary */}
          <div className="bg-white rounded-xl border border-border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-foreground">Example Summary</p>
              <button onClick={() => handleCopy(template.exampleSummary, setCopiedSummary)}
                className="flex items-center gap-1 text-xs text-primary font-medium">
                {copiedSummary ? <Check size={11} /> : <Copy size={11} />} Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{template.exampleSummary}"</p>
          </div>

          {/* Example skills */}
          <div className="bg-white rounded-xl border border-border p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">Example Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {template.exampleSkills.map((skill, i) => (
                <span key={i} className="text-xs bg-muted rounded-full px-2.5 py-0.5 text-foreground">{skill}</span>
              ))}
            </div>
          </div>

          {/* Example bullets */}
          <div className="bg-white rounded-xl border border-border p-3 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-foreground">Example Bullet Points</p>
              <button onClick={() => handleCopy(template.exampleBullets.map(b => `• ${b}`).join('\n'), setCopiedBullets)}
                className="flex items-center gap-1 text-xs text-primary font-medium">
                {copiedBullets ? <Check size={11} /> : <Copy size={11} />} Copy
              </button>
            </div>
            {template.exampleBullets.map((b, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {b}</p>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => onUse && onUse(template)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl py-2.5 transition-opacity hover:opacity-90">
        Use This Template <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const templates = Object.values(TEMPLATE_RULES);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Layout size={20} className="text-primary" />
          <div>
            <h1 className="text-base font-bold text-foreground">CV Templates</h1>
            <p className="text-xs text-muted-foreground">{templates.length} ATS-safe templates</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-4">
        {templates.map(t => (
          <TemplateCard key={t.id} template={t} onUse={(tmpl) => navigate(`/build?template=${tmpl.id}`)} />
        ))}
        <p className="text-xs text-muted-foreground text-center pb-4">
          All templates use one-column, ATS-safe formatting. No tables, photos, or graphics.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
