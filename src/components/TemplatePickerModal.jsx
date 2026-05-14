import React, { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import { PDF_TEMPLATES } from '@/services/pdfTemplates';

const PREVIEWS = {
  classic: (
    <div className="bg-white border border-gray-200 rounded p-2 h-28 overflow-hidden text-left">
      <p className="text-center text-[7px] font-bold text-gray-800 border-b border-gray-800 pb-0.5 mb-1">JANE SMITH</p>
      <p className="text-center text-[5px] text-gray-500 mb-1">jane@email.com | +353 87 123 4567</p>
      <div className="border-b border-gray-300 mb-1" />
      <p className="text-[6px] font-bold text-gray-700 mb-0.5">PROFESSIONAL SUMMARY</p>
      <p className="text-[5px] text-gray-500 leading-relaxed">Experienced professional with expertise in project management and stakeholder engagement...</p>
      <p className="text-[6px] font-bold text-gray-700 mt-1 mb-0.5">EXPERIENCE</p>
      <p className="text-[5px] text-gray-600">• Delivered €1.2m project on time and under budget</p>
    </div>
  ),
  modern: (
    <div className="bg-white border border-gray-200 rounded overflow-hidden h-28">
      <div className="bg-emerald-600 px-2 py-1.5">
        <p className="text-[8px] font-bold text-white">JANE SMITH</p>
        <p className="text-[5px] text-emerald-200">jane@email.com | +353 87 123 4567</p>
      </div>
      <div className="p-2">
        <div className="bg-emerald-600 rounded px-1.5 py-0.5 mb-1 inline-block">
          <p className="text-[5px] font-bold text-white">PROFESSIONAL SUMMARY</p>
        </div>
        <p className="text-[5px] text-gray-600 leading-relaxed">Experienced professional with strong record of delivery...</p>
        <div className="bg-emerald-600 rounded px-1.5 py-0.5 mb-1 mt-1 inline-block">
          <p className="text-[5px] font-bold text-white">EXPERIENCE</p>
        </div>
        <p className="text-[5px] text-gray-600">• Led cross-functional team of 8 to deliver 35% growth</p>
      </div>
    </div>
  ),
  executive: (
    <div className="bg-white border border-gray-200 rounded overflow-hidden h-28 flex">
      <div className="bg-slate-800 w-14 p-1.5 flex-shrink-0">
        <p className="text-[7px] font-bold text-white leading-tight">JANE SMITH</p>
        <div className="border-b border-yellow-400 my-1" />
        <p className="text-[4.5px] text-slate-300">jane@email.com</p>
        <p className="text-[4.5px] text-slate-300 mt-0.5">+353 87 123</p>
      </div>
      <div className="p-2 flex-1 overflow-hidden">
        <p className="text-[6px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-1">PROFESSIONAL SUMMARY</p>
        <p className="text-[5px] text-gray-600 leading-relaxed">Experienced professional with expertise...</p>
        <p className="text-[6px] font-bold text-slate-800 border-b border-slate-300 pb-0.5 mb-1 mt-1">EXPERIENCE</p>
        <p className="text-[5px] text-gray-600">• Managed €1.2m project delivery</p>
      </div>
    </div>
  ),
  minimal: (
    <div className="bg-white border border-gray-200 rounded p-2 h-28 overflow-hidden">
      <p className="text-[11px] font-bold text-gray-900 leading-none">Jane Smith</p>
      <div className="w-8 border-b-2 border-emerald-500 mt-0.5 mb-1" />
      <p className="text-[5px] text-gray-400 mb-2">jane@email.com | +353 87 123 4567</p>
      <p className="text-[5px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Summary</p>
      <div className="border-b border-gray-100 mb-1" />
      <p className="text-[5px] text-gray-600 leading-relaxed">Experienced professional...</p>
      <p className="text-[5px] font-bold text-emerald-600 uppercase tracking-wider mt-1 mb-0.5">Experience</p>
      <div className="border-b border-gray-100 mb-1" />
      <p className="text-[5px] text-gray-600">● Delivered €1.2m project on time</p>
    </div>
  ),
};

export default function TemplatePickerModal({ onExport, onClose }) {
  const [selected, setSelected] = useState('classic');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground text-sm">Choose a PDF Template</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your content, in a professionally designed layout</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
            <X size={16} />
          </button>
        </div>

        {/* Template grid */}
        <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {PDF_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`rounded-xl border-2 p-2 text-left transition-all ${selected === t.id ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}>
              {PREVIEWS[t.id]}
              <div className="mt-2 flex items-start justify-between gap-1">
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{t.desc}</p>
                </div>
                {selected === t.id && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <button onClick={() => onExport(selected)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-3 text-sm">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}