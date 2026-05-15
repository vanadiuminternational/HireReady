import React from 'react';
import { CheckCircle, Info, KeyRound, MapPin, ShieldCheck, XCircle } from 'lucide-react';
import GuidanceNote from '@/components/app/GuidanceNote';
import SectionHeader from '@/components/app/SectionHeader';

function KeywordChip({ children, tone = 'neutral' }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-white/80 text-charcoal/72 border-black/7',
    danger: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${styles[tone] || styles.neutral}`}>
      {children}
    </span>
  );
}

export default function TruthfulKeywords({ suggestions, keywordData }) {
  if (!suggestions && !keywordData) {
    return (
      <div className="rounded-[1.5rem] border border-black/7 bg-white/70 p-5 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <KeyRound size={20} />
        </div>
        <p className="text-sm font-extrabold text-charcoal">No job description yet</p>
        <p className="mt-1 text-xs leading-5 text-charcoal/55">Paste a job description in Step 1 to see keyword matching and safe suggestions.</p>
      </div>
    );
  }

  const { matched = [], missing = [], suggestions: kSuggestions = [] } = suggestions || {};
  const total = matched.length + missing.length;
  const pct = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/42">Keyword match</p>
            <p className="mt-1 text-lg font-extrabold text-charcoal">{pct}% matched</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound size={20} />
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-black/7">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs font-medium text-charcoal/55">{matched.length} of {total || matched.length} tracked keywords matched.</p>
      </div>

      <GuidanceNote variant="lock">
        Add missing keywords only when they truthfully match your experience. Do not stuff the CV with unsupported terms.
      </GuidanceNote>

      {matched.length > 0 && (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/80 p-4">
          <SectionHeader
            eyebrow="Already covered"
            title="Matched keywords"
            description="These are already visible in your CV draft."
            action={<CheckCircle size={18} className="text-emerald-700" />}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {matched.map((keyword, index) => (
              <KeywordChip key={`${keyword}-${index}`} tone="success">{keyword}</KeywordChip>
            ))}
          </div>
        </div>
      )}

      {kSuggestions.length > 0 && (
        <div className="space-y-3 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
          <SectionHeader
            eyebrow="Careful additions"
            title="Missing keyword opportunities"
            description="Only add these where the evidence exists."
            action={<XCircle size={18} className="text-red-500" />}
            className="mb-0"
          />
          <div className="space-y-2.5">
            {kSuggestions.map((item, index) => (
              <div key={`${item.keyword}-${index}`} className="rounded-2xl border border-black/7 bg-white/78 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-charcoal">{item.keyword}</p>
                  <KeywordChip tone={item.priority === 'high' ? 'danger' : 'warning'}>
                    {item.priority === 'high' ? 'High' : 'Medium'}
                  </KeywordChip>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-charcoal/58">
                  <MapPin size={12} className="shrink-0 text-primary" />
                  <span>Add in: <span className="font-extrabold text-charcoal/75">{item.where}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {keywordData && (
        <div className="space-y-3 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
          <SectionHeader
            eyebrow="Job post"
            title="Keyword groups found"
            description="This helps you see what the role appears to value."
            action={<ShieldCheck size={18} className="text-primary" />}
            className="mb-0"
          />
          {[
            { label: 'Hard Skills', items: keywordData.hardSkills },
            { label: 'Tools & Software', items: keywordData.tools },
            { label: 'Qualifications', items: keywordData.qualifications },
            { label: 'Certifications', items: keywordData.certifications },
            { label: 'Soft Skills', items: keywordData.softSkills },
            { label: 'Industry Terms', items: keywordData.industryTerms },
          ].filter((group) => group.items?.length > 0).map(({ label, items }) => (
            <div key={label} className="rounded-2xl bg-black/4 p-3">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-charcoal/42">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((keyword, index) => (
                  <KeywordChip key={`${label}-${keyword}-${index}`}>{keyword}</KeywordChip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 rounded-[1.5rem] border border-black/7 bg-white/70 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs font-medium leading-5 text-charcoal/58">
          Keyword matching is guidance, not a guarantee. A readable and truthful CV is more important than matching every term.
        </p>
      </div>
    </div>
  );
}
