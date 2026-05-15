import React, { useState } from 'react';
import { Copy, Check, Zap, ChevronLeft, Save, Wand2, Download } from 'lucide-react';
import { getSampleJobDescription } from '@/data/sampleJobDescriptions';
import { exportToPdf } from '@/services/exportService';
import BottomNav from '@/components/BottomNav';
import CoverLetterScore from '@/components/CoverLetterScore';
import { generateCoverLetter, scoreCoverLetter, generateCoverLetterTips } from '@/services/coverLetterEngineService';
import { analyseJobDescription } from '@/services/cvEngineService';
import { TONES, COVER_LETTER_TYPES } from '@/config/appConfig';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Shared form field components
const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
  </div>
);

const STEPS = [
  { id: 1, label: 'Role & Company' },
  { id: 2, label: 'Your Details' },
  { id: 3, label: 'Tone & Type' },
  { id: 4, label: 'Generate' },
];

const emptyForm = () => ({
  fullName: '', email: '', phone: '',
  targetJobTitle: '', companyName: '', hiringManagerName: '',
  currentRole: '', yearsExperience: '',
  coverLetterType: 'general', tone: 'professional',
  topStrengths: '', relevantExperience: '', mainAchievement: '',
  motivationForApplying: '', jobDescription: '',
});

export default function CoverLetter() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm());
  const [result, setResult] = useState(null);
  const [letterText, setLetterText] = useState('');
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleGenerate = () => {
    const jobAnalysis = form.jobDescription ? analyseJobDescription(form.jobDescription) : null;
    const letter = generateCoverLetter(form, jobAnalysis);
    const score = scoreCoverLetter(letter, jobAnalysis);
    const tips = generateCoverLetterTips(letter, jobAnalysis);
    setLetterText(letter);
    setResult({ score, tips, jobAnalysis });
    setStep('result');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const key = 'hirereready_cover_letters';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        id: Date.now().toString(),
        name: `${form.targetJobTitle || 'Cover Letter'} — ${form.companyName || new Date().toLocaleDateString('en-GB')}`,
        letterText,
        form,
        score: result?.score?.overall,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing));
      setSaved(true);
      toast.success('Cover letter saved!');
    } catch {
      toast.error('Could not save. Storage may be full.');
    }
  };

  const progress = step === 'result' ? 100 : ((step - 1) / (STEPS.length - 1)) * 100;

  // ── Result View ──────────────────────────────────────────────────────────────
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(4)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
                <ChevronLeft size={18} />
              </button>
              <div>
                <h1 className="text-sm font-bold text-foreground">Cover Letter</h1>
                <p className="text-xs text-muted-foreground">{form.targetJobTitle || 'Your letter'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!saved && (
                <button onClick={handleSave} className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl px-3 py-2">
                  <Save size={13} /> Save
                </button>
              )}
              <button onClick={() => { exportToPdf(letterText, `Cover_Letter_${form.targetJobTitle || 'Letter'}_${new Date().getFullYear()}`); toast.success('PDF downloaded!'); }}
                className="flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-xl px-3 py-2">
                <Download size={13} /> PDF
              </button>
              <button onClick={handleCopy} className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-xl px-3 py-2">
                {copied ? <Check size={13} /> : <Copy size={13} />} Copy
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 max-w-lg mx-auto">
          <Tabs defaultValue="letter">
            <TabsList className="w-full mb-5 rounded-xl bg-muted p-1 grid grid-cols-3 gap-1">
              <TabsTrigger value="letter" className="text-xs rounded-lg">Letter</TabsTrigger>
              <TabsTrigger value="score" className="text-xs rounded-lg">Score</TabsTrigger>
              <TabsTrigger value="tips" className="text-xs rounded-lg">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="letter">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">{letterText.split(/\s+/).filter(Boolean).length} words</p>
                  <button onClick={() => setEditing(v => !v)} className="text-xs text-blue-600 font-medium">
                    {editing ? 'Done editing' : 'Edit letter'}
                  </button>
                </div>
                {editing ? (
                  <textarea value={letterText} onChange={e => setLetterText(e.target.value)}
                    className="w-full h-[65vh] font-mono text-xs p-4 rounded-2xl border border-border bg-white resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
                ) : (
                  <div className="bg-white rounded-2xl border border-border p-5 max-h-[65vh] overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">{letterText}</pre>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center">Always personalise before sending.</p>
              </div>
            </TabsContent>

            <TabsContent value="score">
              <CoverLetterScore scoreData={result?.score} tips={result?.tips} />
            </TabsContent>

            <TabsContent value="tips">
              <div className="space-y-3">
                {(result?.tips || []).map((tip, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-3">
                    <span className="text-xs font-bold text-primary flex-shrink-0">{i + 1}.</span>
                    <p className="text-xs text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
                <div className="bg-muted rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground text-center">These tips are rule-based. AI-powered rewrites are coming in Pro.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <button onClick={() => { setStep(1); setResult(null); setForm(emptyForm()); setSaved(false); }}
            className="w-full text-sm text-primary font-medium py-4 text-center">
            Start a new cover letter
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Builder Wizard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : null}
              className={`w-8 h-8 flex items-center justify-center rounded-lg bg-muted ${step <= 1 ? 'opacity-0 pointer-events-none' : ''}`}>
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold text-primary">Step {step} of {STEPS.length}</p>
              <p className="text-sm font-bold text-foreground">{STEPS[step - 1]?.label}</p>
            </div>
            <div className="w-8" />
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-4">

        {/* Step 1: Role & Company */}
        {step === 1 && (
          <>
            <Input label="Target Job Title *" value={form.targetJobTitle} onChange={set('targetJobTitle')} placeholder="e.g. Project Officer" />
            <Input label="Company Name (optional)" value={form.companyName} onChange={set('companyName')} placeholder="e.g. Acme Ltd" />
            <Input label="Hiring Manager Name (optional)" value={form.hiringManagerName} onChange={set('hiringManagerName')} placeholder="e.g. Sarah Murphy" />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Job Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                <button
                  onClick={() => {
                    const sample = getSampleJobDescription(form.targetJobTitle, '');
                    set('jobDescription')(sample);
                    toast.success('Sample job description added! Edit it to match the actual role.');
                  }}
                  className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 rounded-lg px-3 py-1.5 transition-opacity hover:opacity-80"
                >
                  <Wand2 size={12} /> Auto-fill
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Paste for keyword matching — or tap Auto-fill for a sample based on your target role.</p>
              <textarea value={form.jobDescription || ''} onChange={e => set('jobDescription')(e.target.value)}
                placeholder="Paste the full job description here..." rows={5}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </>
        )}

        {/* Step 2: Your Details */}
        {step === 2 && (
          <>
            <Input label="Full Name *" value={form.fullName} onChange={set('fullName')} placeholder="Jane Smith" />
            <Input label="Email" value={form.email} onChange={set('email')} placeholder="jane@email.com" type="email" />
            <Input label="Phone (optional)" value={form.phone} onChange={set('phone')} placeholder="+353 87 123 4567" />
            <Input label="Current / Previous Role" value={form.currentRole} onChange={set('currentRole')} placeholder="Office Administrator" />
            <Input label="Years of Experience (optional)" value={form.yearsExperience} onChange={set('yearsExperience')} placeholder="4" />
            <Input label="Top 3 Strengths (comma-separated)" value={form.topStrengths} onChange={set('topStrengths')} placeholder="Organisation, Communication, Excel" />
            <Textarea label="Relevant Experience" value={form.relevantExperience} onChange={set('relevantExperience')}
              placeholder="Briefly describe your most relevant experience for this role..." rows={3} />
            <Textarea label="Main Achievement (optional)" value={form.mainAchievement} onChange={set('mainAchievement')}
              placeholder="e.g. Managed a project that reduced processing time by 20%" rows={2} />
            <Textarea label="Why This Role / Company? (optional)" value={form.motivationForApplying} onChange={set('motivationForApplying')}
              hint="If left blank, a neutral professional reason will be used."
              placeholder="e.g. I have followed the company's work in digital inclusion for several years..." rows={3} />
          </>
        )}

        {/* Step 3: Tone & Type */}
        {step === 3 && (
          <>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Letter Type</p>
              <div className="grid grid-cols-2 gap-2">
                {COVER_LETTER_TYPES.map(t => (
                  <button key={t.id} onClick={() => set('coverLetterType')(t.id)}
                    className={`text-xs font-medium rounded-xl py-2.5 px-3 border transition-colors text-left ${form.coverLetterType === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-foreground'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Tone</p>
              <div className="space-y-2">
                {TONES.map(t => (
                  <button key={t.id} onClick={() => set('tone')(t.id)}
                    className={`w-full text-left rounded-xl py-3 px-4 border transition-colors ${form.tone === t.id ? 'bg-primary/10 border-primary' : 'bg-white border-border'}`}>
                    <p className={`text-sm font-semibold ${form.tone === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 4: Review & Generate */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-2">
              <p className="font-bold text-foreground text-sm mb-3">Ready to Generate</p>
              {[
                ['Target Role', form.targetJobTitle || '—'],
                ['Company', form.companyName || '—'],
                ['Hiring Manager', form.hiringManagerName || 'Not specified (will use "Dear Hiring Manager,")'],
                ['Letter Type', COVER_LETTER_TYPES.find(t => t.id === form.coverLetterType)?.label || '—'],
                ['Tone', TONES.find(t => t.id === form.tone)?.label || '—'],
                ['Job Description', form.jobDescription ? '✅ Provided (keyword matching enabled)' : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm gap-3">
                  <span className="text-muted-foreground flex-shrink-0">{label}</span>
                  <span className="font-medium text-foreground text-right text-xs">{val}</span>
                </div>
              ))}
            </div>

            <button onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold rounded-2xl py-5 text-base shadow-lg shadow-primary/20">
              <Zap size={20} fill="currentColor" /> Generate Cover Letter
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Generated offline · No data sent to any server · Always personalise before sending
            </p>
          </div>
        )}

        {/* Continue button */}
        {step < 4 && (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-2xl py-4 text-sm mt-2">
            Continue
          </button>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
