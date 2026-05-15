import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronLeft,
  CopyCheck,
  Download,
  FileText,
  KeyRound,
  LetterText,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import CvPreview from '@/components/CvPreview';
import TruthfulKeywords from '@/components/TruthfulKeywords';
import FullScoreBreakdown from '@/components/FullScoreBreakdown';
import TemplatePickerModal from '@/components/TemplatePickerModal';
import { saveCV, getAllCVs } from '@/services/storageService';
import { buildFilename } from '@/services/exportService';
import { exportWithTemplate } from '@/services/pdfTemplates';
import { useProAccess } from '@/hooks/useProAccess';
import { toast } from 'sonner';

const tabs = [
  { id: 'cv', label: 'CV', icon: FileText },
  { id: 'score', label: 'Score', icon: Award },
  { id: 'keywords', label: 'Keywords', icon: KeyRound },
  { id: 'cover', label: 'Cover', icon: LetterText },
];

function StatPill({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/10 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-white/82">{value || '—'}</p>
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, children, locked = false, variant = 'primary', disabled = false }) {
  const base = 'flex min-h-11 items-center justify-center gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-extrabold transition active:scale-[0.99] disabled:opacity-60';
  const styles = variant === 'primary'
    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/15'
    : 'bg-white/82 text-charcoal shadow-sm border border-black/7';

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {locked ? <Lock size={15} /> : <Icon size={15} />}
      {children}
    </button>
  );
}

export default function CVResult({ result, userInput, onRebuild }) {
  const navigate = useNavigate();
  const [cvText, setCvText] = useState(result?.cvText || '');
  const [saved, setSaved] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const { isPro } = useProAccess();

  const score = result?.atsResult?.score || result?.fullBreakdown?.overallScore || result?.atsScore || null;
  const scoreLabel = score ? `${score}%` : 'Ready';
  const keywordCount = result?.keywordSuggestions?.length || result?.jobAnalysis?.matchedKeywords?.length || 0;
  const cvLines = useMemo(() => (cvText || '').split('\n').filter((line) => line.trim()).length, [cvText]);

  const handleExport = (templateId) => {
    const filename = buildFilename(userInput);
    exportWithTemplate(templateId, cvText, filename);
    setShowTemplatePicker(false);
    toast.success('PDF downloaded!');
  };

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

  if (!result) {
    return (
      <AppShell contentClassName="flex min-h-[70vh] items-center justify-center">
        <PremiumCard className="w-full space-y-4 p-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={22} />
          </div>
          <SectionHeader
            eyebrow="No CV yet"
            title="Build your CV first"
            description="Generate a CV from your profile, then come back here to preview, save, and export."
            className="mb-0 items-center text-center"
          />
          <PrimaryAction onClick={() => navigate('/build')}>
            Build a CV
          </PrimaryAction>
        </PremiumCard>
      </AppShell>
    );
  }

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard className="sticky top-3 z-20 border-black/6 bg-[#faf7f0]/90 p-3 shadow-[0_18px_44px_rgba(55,45,30,0.10)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button onClick={onRebuild} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-charcoal shadow-sm">
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Generated CV</p>
            <p className="truncate text-sm font-extrabold text-charcoal">{userInput?.targetJobTitle || 'Your CV'}</p>
          </div>
          <CreditPill>{scoreLabel}</CreditPill>
        </div>
      </PremiumCard>

      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Ready to review</p>
              <h1 className="mt-2 text-[1.55rem] font-extrabold leading-tight text-white">
                Your CV pack is ready.
              </h1>
              {result.template && (
                <p className="mt-2 text-sm font-medium leading-5 text-white/58">Template: {result.template.name}</p>
              )}
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Sparkles size={22} />
            </span>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <StatPill label="ATS" value={scoreLabel} />
            <StatPill label="Lines" value={cvLines} />
            <StatPill label="Keywords" value={keywordCount || 'Check'} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {!saved ? (
              <ActionButton onClick={handleSave} icon={Save} variant="secondary">Save CV</ActionButton>
            ) : (
              <ActionButton disabled icon={CopyCheck} variant="secondary">Saved</ActionButton>
            )}
            <ActionButton
              onClick={() => {
                if (!isPro) {
                  toast.error('PDF export will unlock with the future credit/pro system. Copy is available now.');
                  return;
                }
                setShowTemplatePicker(true);
              }}
              icon={Download}
              locked={!isPro}
              variant="primary"
            >
              PDF {isPro ? '' : 'Later'}
            </ActionButton>
          </div>
        </div>
      </PremiumCard>

      <GuidanceNote variant="lock">
        Preview, copy, edit, save locally, and review the score now. PDF export is kept behind the future credit/pro system until payments are implemented.
      </GuidanceNote>

      <Tabs defaultValue="cv" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 gap-1 rounded-[1.35rem] bg-white/70 p-1 shadow-sm border border-black/7">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex min-h-11 flex-col gap-1 rounded-[1.05rem] text-[11px] font-extrabold data-[state=active]:bg-charcoal data-[state=active]:text-white"
            >
              <Icon size={14} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="cv" className="mt-0">
          <PremiumCard className="space-y-3 p-4">
            <SectionHeader
              eyebrow="Preview"
              title="Review and edit your CV"
              description="Copy it now, or make small edits before saving/exporting."
              action={<FileText size={18} className="text-primary" />}
              className="mb-0"
            />
            <CvPreview cvText={cvText} onTextChange={setCvText} />
          </PremiumCard>
        </TabsContent>

        <TabsContent value="score" className="mt-0">
          <PremiumCard className="space-y-3 p-4">
            <SectionHeader
              eyebrow="Quality"
              title="ATS and readability breakdown"
              description="Use this as guidance, not as a guarantee of interview success."
              action={<Award size={18} className="text-primary" />}
              className="mb-0"
            />
            <FullScoreBreakdown breakdown={result.fullBreakdown} />
          </PremiumCard>
        </TabsContent>

        <TabsContent value="keywords" className="mt-0">
          <PremiumCard className="space-y-3 p-4">
            <SectionHeader
              eyebrow="Keywords"
              title="Truthful keyword opportunities"
              description="Only add keywords you can support with real evidence."
              action={<ShieldCheck size={18} className="text-primary" />}
              className="mb-0"
            />
            <TruthfulKeywords
              suggestions={result.keywordSuggestions}
              keywordData={result.jobAnalysis}
            />
          </PremiumCard>
        </TabsContent>

        <TabsContent value="cover" className="mt-0">
          <PremiumCard className="space-y-3 p-4">
            <SectionHeader
              eyebrow="Cover letter"
              title="Role-matched draft"
              description="Generated from the same local profile and job context."
              action={<LetterText size={18} className="text-primary" />}
              className="mb-0"
            />
            <CvPreview cvText={result.coverLetter || 'Complete your profile to generate a cover letter.'} />
          </PremiumCard>
        </TabsContent>
      </Tabs>

      <SecondaryAction onClick={onRebuild} icon={RotateCcw} className="w-full justify-center">
        Rebuild CV with changes
      </SecondaryAction>

      {showTemplatePicker && (
        <TemplatePickerModal
          onExport={handleExport}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </AppShell>
  );
}
