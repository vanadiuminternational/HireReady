import React, { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Edit3, FileText, X } from 'lucide-react';
import GuidanceNote from '@/components/app/GuidanceNote';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

function PreviewAction({ onClick, icon: Icon, children, variant = 'light' }) {
  const styles = variant === 'dark'
    ? 'bg-charcoal text-white border-charcoal'
    : 'bg-white/82 text-charcoal border-black/7';

  return (
    <button
      onClick={onClick}
      className={`flex min-h-9 items-center justify-center gap-1.5 rounded-2xl border px-3 text-xs font-extrabold shadow-sm transition active:scale-[0.98] ${styles}`}
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

export default function CvPreview({ cvText, onTextChange }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(cvText || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!editing) setEditText(cvText || '');
  }, [cvText, editing]);

  const stats = useMemo(() => {
    const text = cvText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').filter((line) => line.trim()).length;
    return { words, lines };
  }, [cvText]);

  const handleCopy = async () => {
    const copiedToClipboard = await copyToClipboard(cvText || '');
    if (copiedToClipboard) {
      setCopied(true);
      toast.success('Copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Copy failed. Select the text manually.');
    }
  };

  const handleSaveEdit = () => {
    onTextChange && onTextChange(editText);
    setEditing(false);
    toast.success('CV updated.');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={18} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-charcoal">Document preview</p>
            <p className="text-xs font-medium text-charcoal/50">{stats.words} words · {stats.lines} filled lines</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {!editing ? (
            <>
              {onTextChange && (
                <PreviewAction onClick={() => { setEditText(cvText || ''); setEditing(true); }} icon={Edit3}>
                  Edit
                </PreviewAction>
              )}
              <PreviewAction onClick={handleCopy} icon={copied ? Check : Copy} variant="dark">
                {copied ? 'Copied' : 'Copy'}
              </PreviewAction>
            </>
          ) : (
            <>
              <PreviewAction onClick={() => setEditing(false)} icon={X}>
                Cancel
              </PreviewAction>
              <PreviewAction onClick={handleSaveEdit} icon={Check} variant="dark">
                Save
              </PreviewAction>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="h-[58vh] w-full resize-none rounded-[1.5rem] border border-black/10 bg-white/90 p-4 font-mono text-xs leading-relaxed text-charcoal outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      ) : (
        <div className="max-h-[58vh] overflow-auto rounded-[1.5rem] border border-black/8 bg-[#fffdf8] p-4 shadow-inner">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-charcoal/88">{cvText}</pre>
        </div>
      )}

      <GuidanceNote variant="lock">
        Copy and edit are available now. PDF export unlocks later through the planned credit/pro system.
      </GuidanceNote>
    </div>
  );
}
