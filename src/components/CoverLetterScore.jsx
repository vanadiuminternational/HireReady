import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, AlertTriangle, CheckCircle, XCircle, Lightbulb, Info } from 'lucide-react';

const ScoreBar = ({ label, score, max }) => {
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

export default function CoverLetterScore({ scoreData, tips }) {
  const [showTips, setShowTips] = useState(true);
  const [showKeywords, setShowKeywords] = useState(false);

  if (!scoreData) return null;

  const { overall, categories, weakPhrases, matched, missing, wordCount } = scoreData;

  const getColor = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-blue-500' : s >= 40 ? 'text-yellow-500' : 'text-red-500';
  const getBg = (s) => s >= 80 ? 'bg-emerald-50 border-emerald-200' : s >= 60 ? 'bg-blue-50 border-blue-200' : s >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
  const getLabel = (s) => s >= 80 ? 'Strong' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Work';

  const circumference = 2 * Math.PI * 36;
  const dash = (overall / 100) * circumference;
  const strokeColor = overall >= 80 ? '#10b981' : overall >= 60 ? '#3b82f6' : overall >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-4">
      {/* Overall */}
      <div className={`rounded-2xl border p-5 ${getBg(overall)} flex items-center gap-5`}>
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="44" cy="44" r="36" fill="none" stroke={strokeColor} strokeWidth="8"
              strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getColor(overall)}`}>{overall}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <div>
          <p className={`text-xl font-bold ${getColor(overall)}`}>{getLabel(overall)}</p>
          <p className="text-sm text-muted-foreground">Cover Letter Score</p>
          {wordCount && <p className="text-xs text-muted-foreground mt-1">{wordCount} words</p>}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">Score Breakdown</p>
        <ScoreBar label="Role Relevance" score={categories.roleRelevance} max={25} />
        <ScoreBar label="Keyword Alignment" score={categories.keywordAlignment} max={20} />
        <ScoreBar label="Evidence & Achievements" score={categories.evidence} max={20} />
        <ScoreBar label="Motivation & Fit" score={categories.motivationFit} max={15} />
        <ScoreBar label="Readability" score={categories.readability} max={10} />
        <ScoreBar label="Professional Tone" score={categories.tone} max={10} />
      </div>

      {/* Tips */}
      {tips?.length > 0 && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <button className="flex items-center justify-between w-full" onClick={() => setShowTips(v => !v)}>
            <div className="flex items-center gap-2">
              <Target size={15} className="text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">Top Improvements</span>
            </div>
            {showTips ? <ChevronUp size={15} className="text-yellow-600" /> : <ChevronDown size={15} className="text-yellow-600" />}
          </button>
          {showTips && (
            <ol className="mt-3 space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs text-yellow-700 flex gap-2 items-start">
                  <span className="font-bold text-yellow-600 flex-shrink-0">{i + 1}.</span>{tip}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Weak phrases */}
      {weakPhrases?.length > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-orange-600" />
            <p className="text-sm font-bold text-orange-700">Weak Phrases Detected</p>
          </div>
          {weakPhrases.map((p, i) => (
            <p key={i} className="text-xs text-orange-700">• "{p}"</p>
          ))}
        </div>
      )}

      {/* Keywords */}
      {(matched?.length > 0 || missing?.length > 0) && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <button className="flex items-center justify-between w-full" onClick={() => setShowKeywords(v => !v)}>
            <p className="text-sm font-bold text-foreground">Keyword Analysis</p>
            {showKeywords ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
          </button>
          {showKeywords && (
            <div className="mt-3 space-y-3">
              {matched?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle size={13} className="text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700">Matched</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matched.map((k, i) => <span key={i} className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-0.5">{k}</span>)}
                  </div>
                </div>
              )}
              {missing?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <XCircle size={13} className="text-red-400" />
                    <p className="text-xs font-semibold text-red-600">Missing (add only if true)</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((k, i) => <span key={i} className="text-xs bg-red-50 text-red-500 rounded-full px-2.5 py-0.5">{k}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-slate-50 p-4 flex gap-3">
        <Info size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground italic">Scores reflect structure, keywords, and readability — not the quality of your actual experience. Always personalise before sending.</p>
      </div>
    </div>
  );
}