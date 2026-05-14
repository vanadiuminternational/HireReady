import React from 'react';
import { CheckCircle, XCircle, Info, MapPin } from 'lucide-react';

export default function TruthfulKeywords({ suggestions, keywordData }) {
  if (!suggestions && !keywordData) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">Paste a job description in Step 1 to see keyword analysis.</p>
      </div>
    );
  }

  const { matched = [], missing = [], suggestions: kSuggestions = [] } = suggestions || {};
  const total = matched.length + missing.length;
  const pct = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Match rate */}
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

      {/* Matched */}
      {matched.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={15} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Matched Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map((k, i) => (
              <span key={i} className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing with suggestions */}
      {kSuggestions.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <div className="flex items-center gap-2">
            <XCircle size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-foreground">Missing Keywords</span>
          </div>
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-xl">
            <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">Add only if these are truthful and relevant to your background.</p>
          </div>
          <div className="space-y-3">
            {kSuggestions.map((s, i) => (
              <div key={i} className="rounded-xl border border-border p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{s.keyword}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                    {s.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={11} className="text-primary flex-shrink-0" />
                  <span>Where to add: <span className="font-medium text-foreground">{s.where}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorized keywords from JD */}
      {keywordData && (
        <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Job Description Breakdown</p>
          {[
            { label: '💻 Hard Skills', items: keywordData.hardSkills },
            { label: '🔧 Tools & Software', items: keywordData.tools },
            { label: '🎓 Qualifications', items: keywordData.qualifications },
            { label: '📜 Certifications', items: keywordData.certifications },
            { label: '🤝 Soft Skills', items: keywordData.softSkills },
            { label: '🏭 Industry Terms', items: keywordData.industryTerms },
          ].filter(g => g.items?.length > 0).map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((k, i) => (
                  <span key={i} className="text-xs bg-secondary text-foreground rounded-full px-2.5 py-0.5">{k}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}