import React, { useState } from 'react';
import { Copy, Check, Edit3, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CvPreview({ cvText, onTextChange }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(cvText);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cvText);
    setCopied(true);
    toast.success('CV copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onTextChange && onTextChange(editText);
    setEditing(false);
    toast.success('CV updated.');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-foreground">CV Preview</span>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => { setEditText(cvText); setEditing(true); }}
                className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 font-medium">
                <Edit3 size={13} /> Edit
              </button>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 font-medium">
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border rounded-lg px-3 py-1.5 font-medium">
                <X size={13} /> Cancel
              </button>
              <button onClick={handleSaveEdit}
                className="flex items-center gap-1.5 text-xs text-white bg-primary rounded-lg px-3 py-1.5 font-medium">
                <Check size={13} /> Save
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={editText}
          onChange={e => setEditText(e.target.value)}
          className="w-full h-[60vh] font-mono text-xs p-4 rounded-2xl border border-border bg-white resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <div className="rounded-2xl border border-border bg-white p-5 overflow-auto max-h-[60vh]">
          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">{cvText}</pre>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        PDF/DOCX export available in Pro · Copy and paste into a document now
      </p>
    </div>
  );
}