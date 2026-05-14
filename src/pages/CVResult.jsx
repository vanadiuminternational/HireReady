import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Download, RotateCcw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BottomNav from '@/components/BottomNav';
import CvPreview from '@/components/CvPreview';
import TruthfulKeywords from '@/components/TruthfulKeywords';
import FullScoreBreakdown from '@/components/FullScoreBreakdown';
import TemplatePickerModal from '@/components/TemplatePickerModal';
import { saveCV, getAllCVs } from '@/services/storageService';
import { buildFilename } from '@/services/exportService';
import { exportWithTemplate } from '@/services/pdfTemplates';
import { useProAccess } from '@/hooks/useProAccess';
import { toast } from 'sonner';

export default function CVResult({ result, userInput, onRebuild }) {
  const navigate = useNavigate();
  const [cvText, setCvText] = useState(result?.cvText || '');
  const [saved, setSaved] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const { isPro } = useProAccess();

  const handleExport = (templateId) => {
    const filename = buildFilename(userInput);
    exportWithTemplate(templateId, cvText, filename);
    setShowTemplatePicker(false);
    toast.success('PDF downloaded!');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-muted-foreground text-sm">No CV generated yet.</p>
        <button onClick={() => navigate('/build')} className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold">Build a CV</button>
        <BottomNav />
      </div>
    );
  }

  const handleSave = () => {
    const existing = getAllCVs();
    if (!isPro && existing.length >= 3) {
      toast.error('Free plan allows up to 3 saved CVs. Upgrade to Pro for unlimited saves.');
      return;
    }
    saveCV({
      id: Date.now().toString(),
      name: `${userInput?.targetJobTitle || 'My CV'} — ${new Date().toLocaleDateString('en-GB')}`,
      cvText,
      userInput,
      template: result.template,
      atsScore: result.atsResult?.score,
    });
    setSaved(true);
    toast.success('CV saved!');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onRebuild} className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
              <ChevronLeft size={18} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-foreground">Your CV</h1>
              {result.template && <p className="text-xs text-muted-foreground">{result.template.name}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            {!saved && (
              <button onClick={handleSave} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl px-3 py-2">
                <Save size={13} /> Save
              </button>
            )}
            <button
              onClick={() => {
                if (!isPro) { toast.error('PDF export is a Pro feature. Upgrade to unlock it.'); return; }
                setShowTemplatePicker(true);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-2 ${isPro ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Download size={13} /> PDF {!isPro && '🔒'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 max-w-lg mx-auto">
        <Tabs defaultValue="cv">
          <TabsList className="w-full mb-5 rounded-xl bg-muted p-1 grid grid-cols-4 gap-1">
            <TabsTrigger value="cv" className="text-xs rounded-lg">CV</TabsTrigger>
            <TabsTrigger value="score" className="text-xs rounded-lg">Score</TabsTrigger>
            <TabsTrigger value="keywords" className="text-xs rounded-lg">Keywords</TabsTrigger>
            <TabsTrigger value="cover" className="text-xs rounded-lg">Cover</TabsTrigger>
          </TabsList>

          <TabsContent value="cv">
            <CvPreview cvText={cvText} onTextChange={setCvText} />
          </TabsContent>

          <TabsContent value="score">
            <FullScoreBreakdown breakdown={result.fullBreakdown} />
          </TabsContent>

          <TabsContent value="keywords">
            <TruthfulKeywords
              suggestions={result.keywordSuggestions}
              keywordData={result.jobAnalysis}
            />
          </TabsContent>

          <TabsContent value="cover">
            <CvPreview cvText={result.coverLetter || 'Complete your profile to generate a cover letter.'} />
          </TabsContent>
        </Tabs>

        <button onClick={onRebuild} className="w-full flex items-center justify-center gap-2 mt-4 text-sm text-primary font-medium py-3">
          <RotateCcw size={15} /> Rebuild CV with changes
        </button>
      </div>

      {showTemplatePicker && (
        <TemplatePickerModal
          onExport={handleExport}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}