import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Trash2, Copy, Edit, Download, FileText, Pencil, Check, X } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getAllCVs, deleteCV, duplicateCV, renameCV } from '@/services/storageService';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

export default function SavedCVs() {
  const [cvs, setCvs] = useState([]);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => { setCvs(getAllCVs()); }, []);

  const handleDelete = (id) => {
    deleteCV(id);
    setCvs(getAllCVs());
    toast.success('CV deleted.');
  };

  const handleDuplicate = (id) => {
    duplicateCV(id);
    setCvs(getAllCVs());
    toast.success('CV duplicated.');
  };

  const handleEdit = (cv) => navigate(`/build?edit=${cv.id}`);

  const startRename = (cv) => { setRenamingId(cv.id); setRenameValue(cv.name || ''); };
  const confirmRename = (id) => {
    renameCV(id, renameValue.trim() || 'Untitled CV');
    setCvs(getAllCVs());
    setRenamingId(null);
    toast.success('Renamed.');
  };

  const handleCopyCV = async (cv) => {
    const copiedToClipboard = await copyToClipboard(cv.cvText || '');
    if (copiedToClipboard) toast.success('CV text copied to clipboard!');
    else toast.error('Copy failed. Select the text manually.');
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bookmark size={20} className="text-primary" />
            <div>
              <h1 className="text-base font-bold text-foreground">Saved CVs</h1>
              <p className="text-xs text-muted-foreground">{cvs.length} CV{cvs.length !== 1 ? 's' : ''} saved locally</p>
            </div>
          </div>
          <button onClick={() => navigate('/build')}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl px-3 py-2">
            <Plus size={14} /> New CV
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-4">
        {cvs.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm font-medium text-muted-foreground">No saved CVs yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-6">Build your first CV to see it here.</p>
            <button onClick={() => navigate('/build')}
              className="bg-primary text-primary-foreground text-sm font-semibold rounded-xl px-6 py-3">
              Build My First CV
            </button>
          </div>
        ) : (
          cvs.map(cv => (
            <div key={cv.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              {/* Name row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  {renamingId === cv.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') confirmRename(cv.id); if (e.key === 'Escape') setRenamingId(null); }}
                        className="flex-1 text-sm font-semibold border-b border-primary bg-transparent outline-none min-w-0"
                        autoFocus
                      />
                      <button onClick={() => confirmRename(cv.id)} className="text-primary"><Check size={14} /></button>
                      <button onClick={() => setRenamingId(null)} className="text-muted-foreground"><X size={14} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm truncate">{cv.name || 'Untitled CV'}</p>
                      <button onClick={() => startRename(cv)} className="text-muted-foreground flex-shrink-0"><Pencil size={12} /></button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{cv.userInput?.targetJobTitle || 'No target role'}</p>
                </div>
                {cv.atsScore != null && (
                  <span className={`text-sm font-bold ml-3 ${getScoreColor(cv.atsScore)}`}>{cv.atsScore}/100</span>
                )}
              </div>

              <div className="flex gap-3 text-xs text-muted-foreground mb-4">
                <span>{formatDate(cv.createdAt)}</span>
                {cv.template && <span>• {cv.template.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button onClick={() => handleEdit(cv)}
                  className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary text-xs font-medium rounded-xl py-2">
                  <Edit size={13} /> Edit
                </button>
                <button onClick={() => handleCopyCV(cv)}
                  className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-xl py-2">
                  <Copy size={13} /> Copy CV
                </button>
                <button onClick={() => handleDuplicate(cv.id)}
                  className="flex items-center justify-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-xl py-2">
                  <Copy size={13} /> Duplicate
                </button>
                <button onClick={() => toast.info('PDF export available in Pro')}
                  className="flex items-center justify-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-xl py-2">
                  <Download size={13} /> Export
                </button>
              </div>

              <button onClick={() => handleDelete(cv.id)}
                className="w-full flex items-center justify-center gap-1.5 text-red-400 text-xs font-medium py-2 rounded-xl hover:bg-red-50 transition-colors">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
