import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Lightbulb, Target, Info } from 'lucide-react';

const ScoreBar = ({ label, score, max, color }) => {
  const pct = Math.round((score / max) * 100);
  const colorClass = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 30 ? 'bg-yellow-500' : 'bg-red-400';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold text-foreground">{score}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default function FullScoreBreakdown({ breakdown }) {
  const [showFixes, setShowFixes] = useState(true);
  const [showBullets, setShowBullets] = useState(false);

  if (!breakdown) return null;

  const { overall, categories, top5Fixes, bulletSuggestions, atsWarnings, exportGuidance, lengthInfo, disclaimer } = breakdown;

  const getOverallColor = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-blue-500' : s >= 40 ? 'text-yellow-500' : 'text-red-500';
  const getOverallBg = (s) => s >= 80 ? 'bg-emerald-50 border-emerald-200' : s >= 60 ? 'bg-blue-50 border-blue-200' : s >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
  const getLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Work';

  const circumference = 2 * Math.PI * 36;
  const dash = (overall / 100) * circumference;
  const strokeColor = overall >= 80 ? '#10b981' : overall >= 60 ? '#3b82f6' : overall >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className={`rounded-2xl border p-5 ${getOverallBg(overall)} flex items-center gap-5`}>
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="44" cy="44" r="36" fill="none" stroke={strokeColor} strokeWidth="8"
              strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getOverallColor(overall)}`}>{overall}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <div>
          <p className={`text-xl font-bold ${getOverallColor(overall)}`}>{getLabel(overall)}</p>
          <p className="text-sm text-muted-foreground mt-1">Overall CV Score</p>
          {lengthInfo && <p className="text-xs text-muted-foreground mt-1">{lengthInfo[1]}</p>}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">Score Breakdown</p>
        <ScoreBar label="ATS Formatting Safety" score={categories.ats} max={25} />
        <ScoreBar label="Keyword Relevance" score={categories.keywords} max={25} />
        <ScoreBar label="Recruiter Readability" score={categories.readability} max={20} />
        <ScoreBar label="Achievement Strength" score={categories.achievements} max={20} />
        <ScoreBar label="Contact & Structure" score={categories.contact} max={10} />
      </div>

      {/* Top 5 Fixes */}
      {top5Fixes?.length > 0 && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <button className="flex items-center justify-between w-full" onClick={() => setShowFixes(v => !v)}>
            <div className="flex items-center gap-2">
              <Target size={15} className="text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">Top {top5Fixes.length} Fixes</span>
            </div>
            {showFixes ? <ChevronUp size={15} className="text-yellow-600" /> : <ChevronDown size={15} className="text-yellow-600" />}
          </button>
          {showFixes && (
            <ol className="mt-3 space-y-2">
              {top5Fixes.map((fix, i) => (
                <li key={i} className="text-xs text-yellow-700 flex gap-2 items-start">
                  <span className="font-bold text-yellow-600 flex-shrink-0">{i + 1}.</span>{fix}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Bullet Suggestions */}
      {bulletSuggestions?.filter(b => b.improved).length > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <button className="flex items-center justify-between w-full" onClick={() => setShowBullets(v => !v)}>
            <div className="flex items-center gap-2">
              <Lightbulb size={15} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Bullet Rewrites</span>
            </div>
            {showBullets ? <ChevronUp size={15} className="text-blue-600" /> : <ChevronDown size={15} className="text-blue-600" />}
          </button>
          {showBullets && (
            <div className="mt-3 space-y-3">
              {bulletSuggestions.filter(b => b.improved).map((b, i) => (
                <div key={i} className="text-xs space-y-1">
                  <p className="text-red-600 line-through opacity-70">• {b.original}</p>
                  <p className="text-blue-700 font-medium">• {b.improved}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ATS Warnings */}
      {atsWarnings?.length > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-orange-600" />
            <span className="text-sm font-bold text-orange-700">ATS Safety Warnings</span>
          </div>
          {atsWarnings.map((w, i) => (
            <p key={i} className="text-xs text-orange-700 flex gap-2"><span>•</span>{w}</p>
          ))}
        </div>
      )}

      {/* Export Guidance */}
      {exportGuidance && (
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
          <p className="text-sm font-bold text-foreground">Export Guidance</p>
          <p className="text-xs font-medium text-primary">📁 {exportGuidance.filename}.pdf</p>
          {exportGuidance.tips.map((t, i) => (
            <p key={i} className="text-xs text-muted-foreground flex gap-2"><span>•</span>{t}</p>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-border bg-slate-50 p-4 flex gap-3">
        <Info size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground italic">
          This tool improves CV structure, clarity, ATS readability, and keyword alignment. It does not guarantee interviews or job offers.
        </p>
      </div>
    </div>
  );
}