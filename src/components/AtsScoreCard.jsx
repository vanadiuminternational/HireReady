import React from 'react';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

export default function AtsScoreCard({ atsResult }) {
  if (!atsResult) return null;
  const { score, warnings, tips } = atsResult;

  const getColor = (s) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-blue-500';
    if (s >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBg = (s) => {
    if (s >= 80) return 'bg-emerald-50 border-emerald-200';
    if (s >= 60) return 'bg-blue-50 border-blue-200';
    if (s >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Work';
  };

  const circumference = 2 * Math.PI * 36;
  const dash = (score / 100) * circumference;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-5 ${getBg(score)} flex items-center gap-5`}>
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="44" cy="44" r="36" fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getColor(score)}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <div>
          <p className={`text-xl font-bold ${getColor(score)}`}>{getLabel(score)}</p>
          <p className="text-sm text-muted-foreground mt-1">ATS Readiness Score</p>
          <p className="text-xs text-muted-foreground mt-1">Designed to improve CV clarity and recruiter readability.</p>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">Warnings</span>
          </div>
          {warnings.map((w, i) => (
            <p key={i} className="text-xs text-yellow-700 flex gap-2"><span>•</span>{w}</p>
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Improvement Tips</span>
          </div>
          {tips.map((t, i) => (
            <p key={i} className="text-xs text-blue-700 flex gap-2"><span>•</span>{t}</p>
          ))}
        </div>
      )}
    </div>
  );
}