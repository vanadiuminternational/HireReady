import React from 'react';
import { Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ExportGuidance({ guidance }) {
  if (!guidance) return null;
  return (
    <div className="rounded-2xl border border-border bg-white p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Download size={16} className="text-primary" />
        <span className="text-sm font-bold text-foreground">Export Guidance</span>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
          <FileText size={18} className="text-emerald-600 mx-auto mb-1" />
          <p className="text-xs font-bold text-emerald-700">DOCX</p>
          <p className="text-xs text-emerald-600 mt-0.5">Recommended</p>
        </div>
        <div className="flex-1 rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
          <FileText size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-blue-600">PDF</p>
          <p className="text-xs text-blue-500 mt-0.5">Text-based only</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {guidance.guidance.map((g, i) => (
          <div key={i} className="flex gap-2 items-start">
            {i === 2
              ? <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
              : <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />}
            <p className="text-xs text-muted-foreground">{g}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-muted/40 p-3">
        <p className="text-xs font-semibold text-foreground mb-1">Recommended filename:</p>
        <p className="text-xs font-mono text-primary">{guidance.examples[0]}</p>
      </div>
    </div>
  );
}