import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronUp, Copy, Layout, Shield } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import { TEMPLATE_RULES } from '@/data/templateRules';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

function formatSection(section) {
  return section.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

function TemplateCard({ template, onUse }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);

  const handleCopy = async (text, setter) => {
    const copiedToClipboard = await copyToClipboard(text);
    if (copiedToClipboard) {
      setter(true);
      toast.success('Copied.');
      setTimeout(() => setter(false), 1800);
    } else {
      toast.error('Copy failed. Select the text manually.');
    }
  };

  return (
    <PremiumCard className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-charcoal">{template.name}</p>
          <p className="mt-1 text-xs font-medium leading-5 text-charcoal/55">{template.bestFor}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary">
          <Shield size={11} /> {template.atsLabel}
        </span>
      </div>

      <p className="text-xs font-medium leading-5 text-charcoal/58">{template.description}</p>

      <div className="rounded-[1.25rem] bg-black/4 p-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal/42">Section order</p>
        <div className="flex flex-wrap gap-1.5">
          {template.sectionOrder.map((section, index) => (
            <span key={`${section}-${index}`} className="rounded-full border border-black/7 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-charcoal/65">
              {formatSection(section)}
            </span>
          ))}
        </div>
      </div>

      <button onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-between rounded-2xl border border-black/7 bg-white/78 px-3 py-3 text-xs font-extrabold text-charcoal shadow-sm">
        <span>{expanded ? 'Hide examples' : 'Show examples and skills'}</span>
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {expanded && (
        <div className="space-y-3">
          <div className="rounded-[1.35rem] border border-black/7 bg-white/82 p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-charcoal">Example summary</p>
              <button onClick={() => handleCopy(template.exampleSummary, setCopiedSummary)} className="flex items-center gap-1 text-xs font-extrabold text-primary">
                {copiedSummary ? <Check size={12} /> : <Copy size={12} />} Copy
              </button>
            </div>
            <p className="text-xs italic leading-5 text-charcoal/58">“{template.exampleSummary}”</p>
          </div>

          <div className="rounded-[1.35rem] border border-black/7 bg-white/82 p-3 shadow-sm">
            <p className="mb-2 text-xs font-extrabold text-charcoal">Example skills</p>
            <div className="flex flex-wrap gap-1.5">
              {template.exampleSkills.map((skill, index) => (
                <span key={`${skill}-${index}`} className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-charcoal/68">{skill}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-black/7 bg-white/82 p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold text-charcoal">Example bullet points</p>
              <button onClick={() => handleCopy(template.exampleBullets.map((bullet) => `• ${bullet}`).join('\n'), setCopiedBullets)} className="flex items-center gap-1 text-xs font-extrabold text-primary">
                {copiedBullets ? <Check size={12} /> : <Copy size={12} />} Copy
              </button>
            </div>
            <div className="space-y-2">
              {template.exampleBullets.map((bullet, index) => (
                <p key={`${bullet}-${index}`} className="text-xs font-medium leading-5 text-charcoal/58">• {bullet}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <PrimaryAction onClick={() => onUse && onUse(template)} icon={ArrowRight}>
        Use this template
      </PrimaryAction>
    </PremiumCard>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const templates = Object.values(TEMPLATE_RULES);

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">ATS-safe library</p>
              <h1 className="mt-2 text-[1.65rem] font-extrabold leading-tight text-white">Choose the right CV structure.</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                Clean one-column templates with safe section order and practical examples.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Layout size={22} />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Templates</p>
              <p className="mt-1 text-xs font-bold text-white/82">{templates.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Format</p>
              <p className="mt-1 text-xs font-bold text-white/82">ATS-safe</p>
            </div>
          </div>
        </div>
      </PremiumCard>

      <GuidanceNote variant="lock">
        These are structure rules and examples. Export styling still happens through the CV result screen.
      </GuidanceNote>

      <div className="space-y-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} onUse={(selected) => navigate(`/build?template=${selected.id}`)} />
        ))}
      </div>

      <PremiumCard className="p-4">
        <SectionHeader
          eyebrow="Safety note"
          title="Simple beats over-designed"
          description="All templates avoid tables, photos, heavy graphics, and layout tricks that can confuse ATS parsing."
          action={<Shield size={18} className="text-primary" />}
          className="mb-0"
        />
      </PremiumCard>
    </AppShell>
  );
}
