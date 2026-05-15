import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  Copy,
  Download,
  FileText,
  LetterText,
  LockKeyhole,
  RotateCcw,
  Save,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from 'lucide-react';
import { getSampleJobDescription } from '@/data/sampleJobDescriptions';
import { copyToClipboard, exportToPdf } from '@/services/exportService';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import CoverLetterScore from '@/components/CoverLetterScore';
import { generateCoverLetter, scoreCoverLetter, generateCoverLetterTips } from '@/services/coverLetterEngineService';
import { analyseJobDescription } from '@/services/cvEngineService';
import { TONES, COVER_LETTER_TYPES } from '@/config/appConfig';
import { getStoredSmartStart } from '@/lib/smartStartStorage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

const COVER_LETTER_STORAGE_KEY = 'hireready_cover_letters';
const LEGACY_COVER_LETTER_STORAGE_KEY = 'hirereready_cover_letters';

const STEPS = [
  { id: 1, label: 'Role & Company' },
  { id: 2, label: 'Your Details' },
  { id: 3, label: 'Tone & Type' },
  { id: 4, label: 'Generate' },
];

function createForm(smartStart = {}) {
  return {
    fullName: '',
    email: '',
    phone: '',
    targetJobTitle: smartStart.targetRole || '',
    companyName: '',
    hiringManagerName: '',
    currentRole: '',
    yearsExperience: '',
    coverLetterType: 'general',
    tone: 'professional',
    topStrengths: '',
    relevantExperience: '',
    mainAchievement: '',
    motivationForApplying: '',
    jobDescription: smartStart.jobDescription || '',
  };
}

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-[52px] w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{label}</label>
    {hint && <p className="text-xs font-medium leading-5 text-charcoal/55">{hint}</p>}
    <textarea
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

function OptionGrid({ label, options, value, onChange, getDescription }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{label}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`min-h-[76px] rounded-[1.35rem] border p-3 text-left transition active:scale-[0.99] ${
                selected
                  ? 'border-charcoal bg-charcoal text-white shadow-[0_16px_34px_rgba(17,24,39,0.16)]'
                  : 'border-black/7 bg-white/82 text-charcoal shadow-sm'
              }`}
            >
              <span className={`block text-sm font-extrabold ${selected ? 'text-white' : 'text-charcoal'}`}>{option.label}</span>
              <span className={`mt-1 block text-xs leading-5 ${selected ? 'text-white/58' : 'text-charcoal/58'}`}>
                {getDescription ? getDescription(option) : option.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LetterPreview({ letterText, setLetterText }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(letterText || '');
  const [copied, setCopied] = useState(false);
  const words = letterText.trim() ? letterText.trim().split(/\s+/).length : 0;

  const copy = async () => {
    const copiedToClipboard = await copyToClipboard(letterText || '');
    if (copiedToClipboard) {
      setCopied(true);
      toast.success('Copied to clipboard.');
      setTimeout(() => setCopied(false), 1800);
    } else {
      toast.error('Copy failed. Select the text manually.');
    }
  };

  const saveEdit = () => {
    setLetterText(draft);
    setEditing(false);
    toast.success('Letter updated.');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-charcoal">Letter preview</p>
          <p className="text-xs font-medium text-charcoal/50">{words} words · personalise before sending</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => { setDraft(letterText || ''); setEditing(true); }} className="rounded-2xl border border-black/7 bg-white/82 px-3 py-2 text-xs font-extrabold text-charcoal shadow-sm">
                Edit
              </button>
              <button onClick={copy} className="flex items-center gap-1.5 rounded-2xl bg-charcoal px-3 py-2 text-xs font-extrabold text-white shadow-sm">
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(false)} className="rounded-2xl border border-black/7 bg-white/82 px-3 py-2 text-xs font-extrabold text-charcoal shadow-sm">
                Cancel
              </button>
              <button onClick={saveEdit} className="rounded-2xl bg-charcoal px-3 py-2 text-xs font-extrabold text-white shadow-sm">
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="h-[58vh] w-full resize-none rounded-[1.5rem] border border-black/10 bg-white/90 p-4 font-mono text-xs leading-relaxed text-charcoal outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
      ) : (
        <div className="max-h-[58vh] overflow-auto rounded-[1.5rem] border border-black/8 bg-[#fffdf8] p-4 shadow-inner">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-charcoal/88">{letterText}</pre>
        </div>
      )}
    </div>
  );
}

function SmartContextCard({ smartStart }) {
  const hasSmartStart = Boolean(smartStart.targetRole || smartStart.jobDescription || smartStart.recommendationTimestamp);

  if (!hasSmartStart) {
    return (
      <GuidanceNote variant="lock">
        Tip: use Smart Start first if you want the cover letter to follow the same role and job description as your CV.
      </GuidanceNote>
    );
  }

  return (
    <PremiumCard tone="dark" className="overflow-hidden p-0">
      <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Smart Start context</p>
            <h2 className="mt-2 text-[1.35rem] font-extrabold leading-tight text-white">
              Matching your CV plan.
            </h2>
            <p className="mt-2 text-sm font-medium leading-5 text-white/58">
              {smartStart.targetRole || 'Target role'} {smartStart.jobDescription ? '· job post included' : '· add job post if needed'}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Sparkles size={22} />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SecondaryAction to="/recommendation" className="bg-white/10 text-white hover:bg-white/15">
            View CV plan
          </SecondaryAction>
          <SecondaryAction to="/smart-start" className="bg-white text-charcoal hover:bg-white/92">
            Change plan
          </SecondaryAction>
        </div>
      </div>
    </PremiumCard>
  );
}

export default function CoverLetter() {
  const smartStart = useMemo(() => getStoredSmartStart(), []);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => createForm(smartStart));
  const [result, setResult] = useState(null);
  const [letterText, setLetterText] = useState('');
  const [saved, setSaved] = useState(false);

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleGenerate = () => {
    const jobAnalysis = form.jobDescription ? analyseJobDescription(form.jobDescription) : null;
    const letter = generateCoverLetter(form, jobAnalysis);
    const score = scoreCoverLetter(letter, jobAnalysis);
    const tips = generateCoverLetterTips(letter, jobAnalysis);
    setLetterText(letter);
    setResult({ score, tips, jobAnalysis });
    setStep('result');
  };

  const handleSave = () => {
    try {
      const current = JSON.parse(localStorage.getItem(COVER_LETTER_STORAGE_KEY) || localStorage.getItem(LEGACY_COVER_LETTER_STORAGE_KEY) || '[]');
      const next = [{
        id: Date.now().toString(),
        name: `${form.targetJobTitle || 'Cover Letter'} — ${form.companyName || new Date().toLocaleDateString('en-GB')}`,
        letterText,
        form,
        score: result?.score?.overall,
        createdAt: new Date().toISOString(),
      }, ...current];
      localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(next));
      setSaved(true);
      toast.success('Cover letter saved.');
    } catch {
      toast.error('Could not save. Storage may be full.');
    }
  };

  const startNew = () => {
    setStep(1);
    setResult(null);
    setForm(createForm(smartStart));
    setLetterText('');
    setSaved(false);
  };

  const progress = step === 'result' ? 100 : ((step - 1) / (STEPS.length - 1)) * 100;

  if (step === 'result') {
    return (
      <AppShell contentClassName="space-y-4 pb-5">
        <PremiumCard className="sticky top-3 z-20 border-black/6 bg-[#faf7f0]/90 p-3 shadow-[0_18px_44px_rgba(55,45,30,0.10)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setStep(4)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-charcoal shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Cover letter</p>
              <p className="truncate text-sm font-extrabold text-charcoal">{form.targetJobTitle || 'Your letter'}</p>
            </div>
            <CreditPill>{result?.score?.overall ? `${result.score.overall}%` : 'Ready'}</CreditPill>
          </div>
        </PremiumCard>

        <PremiumCard tone="dark" className="overflow-hidden p-0">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Ready to review</p>
                <h1 className="mt-2 text-[1.55rem] font-extrabold leading-tight text-white">Your letter is ready.</h1>
                <p className="mt-2 text-sm font-medium leading-5 text-white/58">
                  {form.companyName ? `${form.companyName} · ` : ''}{form.targetJobTitle || 'Target role'}
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <LetterText size={22} />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-2xl bg-white/10 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Score</p>
                <p className="mt-1 text-xs font-bold text-white/82">{result?.score?.overall || '—'}%</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Tone</p>
                <p className="mt-1 truncate text-xs font-bold text-white/82">{TONES.find((tone) => tone.id === form.tone)?.label}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Words</p>
                <p className="mt-1 text-xs font-bold text-white/82">{letterText.trim().split(/\s+/).filter(Boolean).length}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {!saved ? (
                <SecondaryAction onClick={handleSave} icon={Save} className="bg-white/10 text-white hover:bg-white/15">Save</SecondaryAction>
              ) : (
                <SecondaryAction className="bg-white/10 text-white/70">Saved</SecondaryAction>
              )}
              <SecondaryAction
                onClick={async () => {
                  const copiedToClipboard = await copyToClipboard(letterText);
                  if (copiedToClipboard) toast.success('Copied to clipboard.');
                  else toast.error('Copy failed. Select the text manually.');
                }}
                icon={Copy}
                className="bg-white/10 text-white hover:bg-white/15"
              >
                Copy
              </SecondaryAction>
              <SecondaryAction onClick={() => { exportToPdf(letterText, `Cover_Letter_${form.targetJobTitle || 'Letter'}_${new Date().getFullYear()}`); toast.success('PDF downloaded.'); }} icon={Download} className="bg-white text-charcoal hover:bg-white/92">PDF</SecondaryAction>
            </div>
          </div>
        </PremiumCard>

        <GuidanceNote variant="lock">This is a rule-based local draft. Always personalise it before sending.</GuidanceNote>

        <Tabs defaultValue="letter" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 gap-1 rounded-[1.35rem] bg-white/70 p-1 shadow-sm border border-black/7">
            <TabsTrigger value="letter" className="rounded-[1.05rem] text-xs font-extrabold data-[state=active]:bg-charcoal data-[state=active]:text-white">Letter</TabsTrigger>
            <TabsTrigger value="score" className="rounded-[1.05rem] text-xs font-extrabold data-[state=active]:bg-charcoal data-[state=active]:text-white">Score</TabsTrigger>
            <TabsTrigger value="tips" className="rounded-[1.05rem] text-xs font-extrabold data-[state=active]:bg-charcoal data-[state=active]:text-white">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="letter" className="mt-0">
            <PremiumCard className="space-y-3 p-4">
              <SectionHeader eyebrow="Preview" title="Review and edit your letter" description="Make it sound specific before sending." action={<FileText size={18} className="text-primary" />} className="mb-0" />
              <LetterPreview letterText={letterText} setLetterText={setLetterText} />
            </PremiumCard>
          </TabsContent>

          <TabsContent value="score" className="mt-0">
            <PremiumCard className="space-y-3 p-4">
              <SectionHeader eyebrow="Quality" title="Cover letter score" description="Rule-based scoring for relevance, tone, and evidence." action={<Target size={18} className="text-primary" />} className="mb-0" />
              <CoverLetterScore scoreData={result?.score} tips={result?.tips} />
            </PremiumCard>
          </TabsContent>

          <TabsContent value="tips" className="mt-0">
            <PremiumCard className="space-y-3 p-4">
              <SectionHeader eyebrow="Improve" title="Personalisation tips" description="Small changes that make the draft less generic." action={<Wand2 size={18} className="text-primary" />} className="mb-0" />
              {(result?.tips || []).map((tip, index) => (
                <GuidanceNote key={index}>{index + 1}. {tip}</GuidanceNote>
              ))}
              <GuidanceNote variant="lock">AI-powered rewrites will come later after backend credit enforcement.</GuidanceNote>
            </PremiumCard>
          </TabsContent>
        </Tabs>

        <SecondaryAction onClick={startNew} icon={RotateCcw} className="w-full justify-center">Start a new cover letter</SecondaryAction>
      </AppShell>
    );
  }

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard className="sticky top-3 z-20 space-y-3 border-black/6 bg-[#faf7f0]/90 p-3 shadow-[0_18px_44px_rgba(55,45,30,0.10)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => (step > 1 ? setStep((current) => current - 1) : null)} className={`flex h-9 w-9 items-center justify-center rounded-2xl ${step > 1 ? 'bg-white text-charcoal shadow-sm' : 'opacity-0 pointer-events-none'}`}>
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Step {step} of {STEPS.length}</p>
            <p className="truncate text-sm font-extrabold text-charcoal">{STEPS[step - 1]?.label}</p>
          </div>
          <CreditPill>{Math.round(progress)}%</CreditPill>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/7">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </PremiumCard>

      <SmartContextCard smartStart={smartStart} />

      <PremiumCard className="space-y-4 p-4">
        {step === 1 && (
          <>
            <SectionHeader eyebrow="Role" title="Who is this letter for?" description="Start from the same target role as your CV, then add company details." action={<LetterText size={18} className="text-primary" />} className="mb-0" />
            <Input label="Target Job Title *" value={form.targetJobTitle} onChange={set('targetJobTitle')} placeholder="e.g. Project Officer" />
            <Input label="Company Name (optional)" value={form.companyName} onChange={set('companyName')} placeholder="e.g. Acme Ltd" />
            <Input label="Hiring Manager Name (optional)" value={form.hiringManagerName} onChange={set('hiringManagerName')} placeholder="e.g. Sarah Murphy" />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Job Description <span className="font-semibold normal-case tracking-normal text-charcoal/45">(optional)</span></label>
                <button onClick={() => { const sample = getSampleJobDescription(form.targetJobTitle, ''); set('jobDescription')(sample); toast.success('Sample job description added.'); }} className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-opacity hover:opacity-80">
                  <Wand2 size={12} /> Auto-fill
                </button>
              </div>
              <p className="text-xs leading-5 text-charcoal/55">Paste for keyword matching, or use Auto-fill for a sample based on the target role.</p>
              <textarea value={form.jobDescription || ''} onChange={(event) => set('jobDescription')(event.target.value)} placeholder="Paste the full job description here..." rows={5} className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionHeader eyebrow="You" title="What should the letter prove?" description="Give the draft real evidence so it does not sound generic." action={<Target size={18} className="text-primary" />} className="mb-0" />
            <Input label="Full Name *" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
            <Input label="Email" value={form.email} onChange={set('email')} placeholder="jane@email.com" type="email" />
            <Input label="Phone (optional)" value={form.phone} onChange={set('phone')} placeholder="+353 87 123 4567" />
            <Input label="Current / Previous Role" value={form.currentRole} onChange={set('currentRole')} placeholder="Office Administrator" />
            <Input label="Years of Experience (optional)" value={form.yearsExperience} onChange={set('yearsExperience')} placeholder="4" />
            <Input label="Top 3 Strengths" value={form.topStrengths} onChange={set('topStrengths')} placeholder="Organisation, Communication, Excel" />
            <Textarea label="Relevant Experience" value={form.relevantExperience} onChange={set('relevantExperience')} placeholder="Briefly describe your most relevant experience for this role..." rows={3} />
            <Textarea label="Main Achievement (optional)" value={form.mainAchievement} onChange={set('mainAchievement')} placeholder="e.g. Managed a project that reduced processing time by 20%" rows={2} />
            <Textarea label="Why This Role / Company?" value={form.motivationForApplying} onChange={set('motivationForApplying')} hint="If left blank, a neutral professional reason will be used." placeholder="e.g. I have followed the company's work in digital inclusion for several years..." rows={3} />
          </>
        )}

        {step === 3 && (
          <>
            <SectionHeader eyebrow="Style" title="Choose type and tone" description="Keep it professional, but match the application context." action={<Wand2 size={18} className="text-primary" />} className="mb-0" />
            <OptionGrid label="Letter Type" options={COVER_LETTER_TYPES} value={form.coverLetterType} onChange={set('coverLetterType')} getDescription={(option) => option.desc || 'Cover letter format'} />
            <OptionGrid label="Tone" options={TONES} value={form.tone} onChange={set('tone')} getDescription={(option) => option.desc} />
          </>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <SectionHeader eyebrow="Generate" title="Ready to generate" description="The draft is created locally from your answers and job context." action={<LockKeyhole size={18} className="text-primary" />} className="mb-0" />
            <div className="space-y-2 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
              {[
                ['Target Role', form.targetJobTitle || '—'],
                ['Company', form.companyName || '—'],
                ['Hiring Manager', form.hiringManagerName || 'Dear Hiring Manager'],
                ['Letter Type', COVER_LETTER_TYPES.find((type) => type.id === form.coverLetterType)?.label || '—'],
                ['Tone', TONES.find((tone) => tone.id === form.tone)?.label || '—'],
                ['Job Description', form.jobDescription ? 'Provided' : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 text-sm">
                  <span className="text-charcoal/55">{label}</span>
                  <span className="max-w-[60%] truncate text-right font-bold text-charcoal">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleGenerate} className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-primary py-5 text-base font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
              <Zap size={20} fill="currentColor" /> Generate Cover Letter
            </button>
            <GuidanceNote variant="lock">Generated locally. No data is sent to any server in this phase.</GuidanceNote>
          </div>
        )}
      </PremiumCard>

      {step < 4 && (
        <div className="sticky bottom-24 z-20 rounded-[1.65rem] border border-black/6 bg-[#faf7f0]/88 p-2 shadow-[0_18px_44px_rgba(55,45,30,0.12)] backdrop-blur">
          <PrimaryAction onClick={() => setStep((current) => current + 1)}>Continue</PrimaryAction>
        </div>
      )}
    </AppShell>
  );
}
