import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Info, Lightbulb, Target } from 'lucide-react';
import GuidanceNote from '@/components/app/GuidanceNote';
import SectionHeader from '@/components/app/SectionHeader';

const ScoreBar = ({ label, score, max }) => {
  const pct = Math.round((score / max) * 100);
  const barClass = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-primary' : pct >= 30 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="space-y-1.5 rounded-2xl bg-white/76 p-3">
      <div className="flex justify-between gap-3 text-xs">
        <span className="font-bold text-charcoal/58">{label}</span>
        <span className="font-extrabold text-charcoal">{score}/{max}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/7">
        <div className={`h-full rounded-full transition-all ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

function ExpandablePanel({ title, icon: Icon, children, open, onToggle, tone = 'primary' }) {
  const toneClass = tone === 'warning' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-primary bg-white/82 border-black/7';

  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-sm ${toneClass}`}>
      <button className="flex w-full items-center justify-between gap-3" onClick={onToggle}>
        <div className="flex min-w-0 items-center gap-2">
          <Icon size={16} className="shrink-0" />
          <span className="truncate text-sm font-extrabold">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FullScoreBreakdown({ breakdown }) {
  const [showFixes, setShowFixes] = useState(true);
  const [showBullets, setShowBullets] = useState(false);

  if (!breakdown) {
    return <GuidanceNote>No score breakdown is available for this CV.</GuidanceNote>;
  }

  const { overall, categories, top5Fixes, bulletSuggestions, atsWarnings, exportGuidance, lengthInfo } = breakdown;
  const getLabel = (score) => score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';
  const getScoreColor = (score) => score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-primary' : score >= 40 ? 'text-amber-600' : 'text-red-500';
  const circumference = 2 * Math.PI * 36;
  const dash = (overall / 100) * circumference;
  const strokeColor = overall >= 80 ? '#10b981' : overall >= 60 ? '#15806b' : overall >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-4">
      <div className="rounded-[1.6rem] border border-black/7 bg-white/82 p-5 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(17,24,39,0.08)" strokeWidth="8" />
              <circle cx="44" cy="44" r="36" fill="none" stroke={strokeColor} strokeWidth="8" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-extrabold ${getScoreColor(overall)}`}>{overall}</span>
              <span className="text-[11px] font-bold text-charcoal/42">/100</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className={`text-xl font-extrabold ${getScoreColor(overall)}`}>{getLabel(overall)}</p>
            <p className="mt-1 text-sm font-bold text-charcoal">Overall CV score</p>
            {lengthInfo && <p className="mt-1 text-xs leading-5 text-charcoal/55">{lengthInfo[1]}</p>}
          </div>
        </div>
      </div>

      {categories && (
        <div className="space-y-3 rounded-[1.5rem] border border-black/7 bg-black/4 p-4">
          <SectionHeader eyebrow="Breakdown" title="What shaped the score" description="Use this to prioritise small improvements." className="mb-0" />
          <ScoreBar label="ATS Formatting Safety" score={categories.ats} max={25} />
          <ScoreBar label="Keyword Relevance" score={categories.keywords} max={25} />
          <ScoreBar label="Recruiter Readability" score={categories.readability} max={20} />
          <ScoreBar label="Achievement Strength" score={categories.achievements} max={20} />
          <ScoreBar label="Contact & Structure" score={categories.contact} max={10} />
        </div>
      )}

      {top5Fixes?.length > 0 && (
        <ExpandablePanel title={`Top ${top5Fixes.length} fixes`} icon={Target} open={showFixes} onToggle={() => setShowFixes((value) => !value)} tone="warning">
          <ol className="space-y-2">
            {top5Fixes.map((fix, index) => (
              <li key={index} className="flex gap-2 rounded-2xl bg-white/70 p-3 text-xs font-medium leading-5 text-amber-800">
                <span className="shrink-0 font-extrabold">{index + 1}.</span>
                <span>{fix}</span>
              </li>
            ))}
          </ol>
        </ExpandablePanel>
      )}

      {bulletSuggestions?.filter((item) => item.improved).length > 0 && (
        <ExpandablePanel title="Bullet rewrite ideas" icon={Lightbulb} open={showBullets} onToggle={() => setShowBullets((value) => !value)}>
          <div className="space-y-3">
            {bulletSuggestions.filter((item) => item.improved).map((item, index) => (
              <div key={index} className="space-y-2 rounded-2xl bg-white/76 p-3 text-xs leading-5">
                <p className="text-red-600/75 line-through">• {item.original}</p>
                <p className="font-bold text-charcoal">• {item.improved}</p>
              </div>
            ))}
          </div>
        </ExpandablePanel>
      )}

      {atsWarnings?.length > 0 && (
        <div className="space-y-2.5 rounded-[1.5rem] border border-orange-200 bg-orange-50/80 p-4">
          <SectionHeader eyebrow="ATS safety" title="Warnings to review" action={<AlertTriangle size={18} className="text-orange-700" />} className="mb-0" />
          {atsWarnings.map((warning, index) => (
            <GuidanceNote key={index} variant="warning">{warning}</GuidanceNote>
          ))}
        </div>
      )}

      {exportGuidance && (
        <div className="space-y-2.5 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
          <SectionHeader eyebrow="Export" title="Suggested filename and tips" description={`${exportGuidance.filename}.pdf`} className="mb-0" />
          {exportGuidance.tips.map((tip, index) => (
            <GuidanceNote key={index}>{tip}</GuidanceNote>
          ))}
        </div>
      )}

      <div className="flex gap-2 rounded-[1.5rem] border border-black/7 bg-white/70 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs font-medium leading-5 text-charcoal/58">
          This score improves structure, clarity, ATS readability, and keyword alignment. It does not guarantee interviews or job offers.
        </p>
      </div>
    </div>
  );
}
