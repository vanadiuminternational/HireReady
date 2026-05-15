import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Check, Copy, Download, Edit, FileText, Pencil, Plus, Trash2, X } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import { getAllCVs, deleteCV, duplicateCV, renameCV } from '@/services/storageService';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

export default function SavedCVs() {
  const [cvs, setCvs] = useState([]);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => { setCvs(getAllCVs()); }, []);

  const refresh = () => setCvs(getAllCVs());

  const handleDelete = (id) => {
    deleteCV(id);
    refresh();
    toast.success('CV deleted.');
  };

  const handleDuplicate = (id) => {
    duplicateCV(id);
    refresh();
    toast.success('CV duplicated.');
  };

  const handleEdit = (cv) => navigate(`/build?edit=${cv.id}`);

  const startRename = (cv) => {
    setRenamingId(cv.id);
    setRenameValue(cv.name || '');
  };

  const confirmRename = (id) => {
    renameCV(id, renameValue.trim() || 'Untitled CV');
    refresh();
    setRenamingId(null);
    toast.success('Renamed.');
  };

  const handleCopyCV = async (cv) => {
    const copiedToClipboard = await copyToClipboard(cv.cvText || '');
    if (copiedToClipboard) toast.success('CV text copied to clipboard.');
    else toast.error('Copy failed. Select the text manually.');
  };

  const getScoreTone = (score) => {
    if (!score) return 'Ready';
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs work';
  };

  const formatDate = (iso) => {
    if (!iso) return 'Saved locally';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Saved locally</p>
              <h1 className="mt-2 text-[1.65rem] font-extrabold leading-tight text-white">Your CV workspace.</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                Keep versions, duplicate drafts, copy text, and return to editing when needed.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Bookmark size={22} />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Saved</p>
              <p className="mt-1 text-xs font-bold text-white/82">{cvs.length} CV{cvs.length === 1 ? '' : 's'}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Storage</p>
              <p className="mt-1 text-xs font-bold text-white/82">On device</p>
            </div>
          </div>
        </div>
      </PremiumCard>

      <PrimaryAction onClick={() => navigate('/build')} icon={Plus}>Build a new CV</PrimaryAction>

      {cvs.length === 0 ? (
        <PremiumCard className="space-y-4 p-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <FileText size={24} />
          </div>
          <SectionHeader
            eyebrow="Empty workspace"
            title="No saved CVs yet"
            description="Generate and save your first CV. It will appear here for editing, copying, and versioning."
            className="mb-0 items-center text-center"
          />
          <PrimaryAction onClick={() => navigate('/smart-start')}>Start Smart CV</PrimaryAction>
          <SecondaryAction onClick={() => navigate('/build')} className="w-full justify-center">Build manually</SecondaryAction>
        </PremiumCard>
      ) : (
        <div className="space-y-3">
          {cvs.map((cv) => (
            <PremiumCard key={cv.id} className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {renamingId === cv.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={renameValue}
                        onChange={(event) => setRenameValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') confirmRename(cv.id);
                          if (event.key === 'Escape') setRenamingId(null);
                        }}
                        className="min-h-10 flex-1 rounded-2xl border border-primary/30 bg-white px-3 text-sm font-extrabold text-charcoal outline-none"
                        autoFocus
                      />
                      <button onClick={() => confirmRename(cv.id)} className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white"><Check size={14} /></button>
                      <button onClick={() => setRenamingId(null)} className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/5 text-charcoal/60"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-extrabold text-charcoal">{cv.name || 'Untitled CV'}</p>
                      <button onClick={() => startRename(cv)} className="shrink-0 text-charcoal/42"><Pencil size={13} /></button>
                    </div>
                  )}
                  <p className="mt-1 truncate text-xs font-medium text-charcoal/55">{cv.userInput?.targetJobTitle || 'No target role'} · {formatDate(cv.createdAt)}</p>
                  {cv.template && <p className="mt-1 text-xs font-bold text-primary">{cv.template.name}</p>}
                </div>
                <CreditPill>{cv.atsScore != null ? `${cv.atsScore}%` : getScoreTone(cv.atsScore)}</CreditPill>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <SecondaryAction onClick={() => handleEdit(cv)} icon={Edit} className="justify-center">Edit</SecondaryAction>
                <SecondaryAction onClick={() => handleCopyCV(cv)} icon={Copy} className="justify-center">Copy</SecondaryAction>
                <SecondaryAction onClick={() => handleDuplicate(cv.id)} icon={Copy} className="justify-center">Duplicate</SecondaryAction>
                <SecondaryAction onClick={() => toast.info('PDF export will use the future credit/pro system.')} icon={Download} className="justify-center">Export</SecondaryAction>
              </div>

              <button onClick={() => handleDelete(cv.id)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3 text-xs font-extrabold text-red-500 transition active:scale-[0.99]">
                <Trash2 size={14} /> Delete CV
              </button>
            </PremiumCard>
          ))}
        </div>
      )}

      <GuidanceNote variant="lock">Saved CVs are stored locally on this device in the current version.</GuidanceNote>
    </AppShell>
  );
}
