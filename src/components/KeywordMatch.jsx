import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function KeywordMatch({ keywordAnalysis }) {
  if (!keywordAnalysis) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">Paste a job description in Step 1 to see keyword analysis.</p>
      </div>
    );
  }

  const { matched, missing } = keywordAnalysis;
  const total = matched.length + missing.length;
  const pct = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-white p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-foreground">Keyword Match Rate</span>
          <span className={`text-sm font-bold ${pct >= 60 ? 'text-emerald-600' : 'text-yellow-600'}`}>{pct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{matched.length} of {total} keywords matched</p>
      </div>

      {matched.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Matched Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map((k, i) => (
              <span key={i} className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-red-600">Missing Keywords</span>
          </div>
          <p className="text-xs text-red-500 mb-3">Add these only if genuinely relevant to your background.</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((k, i) => (
              <span key={i} className="text-xs bg-red-100 text-red-600 rounded-full px-3 py-1 font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}