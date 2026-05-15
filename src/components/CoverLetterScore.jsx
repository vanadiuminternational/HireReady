import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Info, Target, XCircle } from 'lucide-react';
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

function KeywordChip({ children, tone = 'neutral' }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    neutral: 'bg-white/80 text-charcoal/72 border-black/7',
  };
  return <span className={`rounded-full border px-3 py-1.5 text-xs font-extrabold ${styles[tone]}`}>{children}</span>;
}

export default function CoverLetterScore({ scoreData, tips }) {
  const [showTips, setShowTips] = useState(true);
  const [showKeywords, setShowKeywords] = useState(false);

  if (!scoreData) return <GuidanceNote>No cover-letter score is available yet.</GuidanceNote>;

  const { overall, categories, weakPhrases, matched, missing, wordCount } = scoreData;
  const getLabel = (score) => score >= 80 ? 'Strong' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';
  const getColor = (score) => score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-primary' : score >= 40 ? 'text-amber-600' : 'text-red-500';
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
              <span className={`text-2xl font-extrabold ${getColor(overall)}`}>{overall}</span>
              <span className="text-[11px] font-bold text-charcoal/42">/100</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className={`text-xl font-extrabold ${getColor(overall)}`}>{getLabel(overall)}</p>
            <p className="mt-1 text-sm font-bold text-charcoal">Cover letter score</p>
            {wordCount && <p className="mt-1 text-xs leading-5 text-charcoal/55">{wordCount} words</p>}
          </div>
        </div>
      </div>

      {categories && (
        <div className="space-y-3 rounded-[1.5rem] border border-black/7 bg-black/4 p-4">
          <SectionHeader eyebrow="Breakdown" title="What shaped the score" description="Use this to tighten the draft before sending." className="mb-0" />
          <ScoreBar label="Role Relevance" score={categories.roleRelevance} max={25} />
          <ScoreBar label="Keyword Alignment" score={categories.keywordAlignment} max={20} />
          <ScoreBar label="Evidence & Achievements" score={categories.evidence} max={20} />
          <ScoreBar label="Motivation & Fit" score={categories.motivationFit} max={15} />
          <ScoreBar label="Readability" score={categories.readability} max={10} />
          <ScoreBar label="Professional Tone" score={categories.tone} max={10} />
        </div>
      )}

      {tips?.length > 0 && (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <button className="flex w-full items-center justify-between gap-3" onClick={() => setShowTips((value) => !value)}>
            <div className="flex items-center gap-2 text-amber-700">
              <Target size={16} />
              <span className="text-sm font-extrabold">Top improvements</span>
            </div>
            {showTips ? <ChevronUp size={16} className="text-amber-700" /> : <ChevronDown size={16} className="text-amber-700" />}
          </button>
          {showTips && (
            <ol className="mt-3 space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex gap-2 rounded-2xl bg-white/70 p-3 text-xs font-medium leading-5 text-amber-800">
                  <span className="shrink-0 font-extrabold">{index + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {weakPhrases?.length > 0 && (
        <div className="space-y-2.5 rounded-[1.5rem] border border-orange-200 bg-orange-50/80 p-4">
          <SectionHeader eyebrow="Phrases" title="Weak wording to review" action={<AlertTriangle size={18} className="text-orange-700" />} className="mb-0" />
          {weakPhrases.map((phrase, index) => (
            <GuidanceNote key={index} variant="warning">“{phrase}” may sound generic. Replace it with a specific example where possible.</GuidanceNote>
          ))}
        </div>
      )}

      {(matched?.length > 0 || missing?.length > 0) && (
        <div className="rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
          <button className="flex w-full items-center justify-between gap-3" onClick={() => setShowKeywords((value) => !value)}>
            <p className="text-sm font-extrabold text-charcoal">Keyword analysis</p>
            {showKeywords ? <ChevronUp size={16} className="text-charcoal/55" /> : <ChevronDown size={16} className="text-charcoal/55" />}
          </button>
          {showKeywords && (
            <div className="mt-3 space-y-3">
              {matched?.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <p className="text-xs font-extrabold text-emerald-700">Matched</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matched.map((keyword, index) => <KeywordChip key={index} tone="success">{keyword}</KeywordChip>)}
                  </div>
                </div>
              )}
              {missing?.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5">
                    <XCircle size={14} className="text-red-500" />
                    <p className="text-xs font-extrabold text-red-600">Missing, add only if true</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((keyword, index) => <KeywordChip key={index} tone="danger">{keyword}</KeywordChip>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 rounded-[1.5rem] border border-black/7 bg-white/70 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs font-medium leading-5 text-charcoal/58">
          Scores reflect structure, keywords, evidence, and readability. They do not measure the quality of your actual experience.
        </p>
      </div>
    </div>
  );
}
