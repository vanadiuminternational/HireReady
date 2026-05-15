import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Coins,
  Eye,
  FileText,
  Lightbulb,
  Loader2,
  LockKeyhole,
  MessageCircleQuestion,
  SearchCheck,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import { runRecruiterXRay } from '@/lib/aiClient';
import { AI_ACTIONS, getActionCostLabel } from '@/engine/credits';
import { planAiRequest } from '@/engine/ai-router';
import { getStoredSmartStart } from '@/lib/smartStartStorage';

const reviewChecks = [
  {
    title: 'Recruiter first impression',
    text: 'What a busy hiring manager may notice in the first scan.',
    icon: Eye,
  },
  {
    title: 'Interview pressure points',
    text: 'Questions your CV could trigger in an interview.',
    icon: MessageCircleQuestion,
  },
  {
    title: 'Weak or generic lines',
    text: 'Claims that need sharper evidence or measurable proof.',
    icon: AlertTriangle,
  },
  {
    title: 'Quick fixes',
    text: 'Small edits that could improve clarity before applying.',
    icon: Zap,
  },
];

function Textarea({ label, value, onChange, placeholder, rows = 6, hint }) {
  return (
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
}

function ReviewScopeCard() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {reviewChecks.map(({ title, text, icon: Icon }) => (
        <div key={title} className="rounded-[1.35rem] border border-black/7 bg-white/78 p-3 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon size={17} />
          </div>
          <p className="text-sm font-extrabold leading-5 text-charcoal">{title}</p>
          <p className="mt-1 text-xs font-medium leading-5 text-charcoal/55">{text}</p>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-3">
      {result.verdict && (
        <PremiumCard tone="dark" className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">The verdict</p>
          <p className="mt-2 text-sm font-bold leading-6 text-white/82">{result.verdict}</p>
        </PremiumCard>
      )}

      {Array.isArray(result.questions) && result.questions.length > 0 && (
        <PremiumCard className="space-y-3 p-4">
          <SectionHeader eyebrow="Interview" title="Questions they may ask" action={<MessageCircleQuestion size={18} className="text-primary" />} className="mb-0" />
          <ol className="space-y-2">
            {result.questions.map((question, index) => (
              <li key={index} className="flex gap-2 rounded-2xl bg-white/76 p-3 text-xs font-medium leading-5 text-charcoal/72">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-extrabold text-primary">{index + 1}</span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </PremiumCard>
      )}

      {result.weakest_line && (
        <PremiumCard className="space-y-3 border-orange-200 bg-orange-50/80 p-4">
          <SectionHeader eyebrow="Weak line" title="The line that needs evidence" action={<AlertTriangle size={18} className="text-orange-700" />} className="mb-0" />
          <p className="rounded-2xl bg-white/70 p-3 text-xs font-medium leading-5 text-orange-800">{result.weakest_line}</p>
        </PremiumCard>
      )}

      {result.rewritten_bullet && (
        <PremiumCard className="space-y-3 p-4">
          <SectionHeader eyebrow="Rewrite" title="Sharper version" action={<Wand2 size={18} className="text-primary" />} className="mb-0" />
          <p className="rounded-2xl bg-primary/5 p-3 text-xs font-bold leading-5 text-charcoal">{result.rewritten_bullet}</p>
        </PremiumCard>
      )}

      {Array.isArray(result.quick_wins) && result.quick_wins.length > 0 && (
        <PremiumCard className="space-y-3 p-4">
          <SectionHeader eyebrow="Quick wins" title="Ten-minute fixes" action={<Lightbulb size={18} className="text-primary" />} className="mb-0" />
          {result.quick_wins.map((win, index) => (
            <div key={index} className="flex gap-2 rounded-2xl bg-white/76 p-3 text-xs font-medium leading-5 text-charcoal/72">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>{win}</span>
            </div>
          ))}
        </PremiumCard>
      )}
    </div>
  );
}

export default function RecruiterXRay() {
  const smartStart = useMemo(() => getStoredSmartStart(), []);
  const action = AI_ACTIONS.recruiterXRay;
  const plan = planAiRequest('recruiterXRay');
  const [cv, setCv] = useState('');
  const [jobDescription, setJobDescription] = useState(smartStart.jobDescription || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const hasSmartStart = Boolean(smartStart.targetRole || smartStart.jobDescription || smartStart.recommendationTimestamp);
  const canRun = cv.trim() && jobDescription.trim();

  const handleRun = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await runRecruiterXRay({ cv, jobDescription });
      setResult(data);
    } catch (e) {
      setError(e.message || 'Recruiter X-Ray is waiting for the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Recruiter X-Ray</p>
              <h1 className="mt-2 text-[1.75rem] font-extrabold leading-tight text-white">
                See your CV through a hiring manager’s eyes.
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-white/58">
                A premium AI review mode planned for the VPS backend. No user API keys. No hidden credit use.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Eye size={22} />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Cost</p>
              <p className="mt-1 text-xs font-bold text-white/82">{action.credits} credits</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Mode</p>
              <p className="mt-1 text-xs font-bold text-white/82">Premium AI</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Status</p>
              <p className="mt-1 text-xs font-bold text-white/82">Planned</p>
            </div>
          </div>
        </div>
      </PremiumCard>

      {hasSmartStart ? (
        <PremiumCard className="space-y-3 p-4">
          <SectionHeader
            eyebrow="Smart Start linked"
            title="Using your application context"
            description={`${smartStart.targetRole || 'Target role'}${smartStart.jobDescription ? ' · job description prefilled' : ''}`}
            action={<SearchCheck size={18} className="text-primary" />}
            className="mb-0"
          />
          <div className="grid grid-cols-2 gap-2">
            <SecondaryAction to="/recommendation" className="justify-center">View CV plan</SecondaryAction>
            <SecondaryAction to="/smart-start" className="justify-center">Change answers</SecondaryAction>
          </div>
        </PremiumCard>
      ) : (
        <GuidanceNote variant="lock">
          Tip: complete Smart Start first to prefill the job description and keep this review aligned with your CV plan.
        </GuidanceNote>
      )}

      <PremiumCard className="space-y-4 p-4">
        <SectionHeader
          eyebrow="What it will check"
          title="A sharper pre-application review"
          description="This is the review scope for the future backend-powered X-Ray action."
          action={<Sparkles size={18} className="text-primary" />}
          className="mb-0"
        />
        <ReviewScopeCard />
      </PremiumCard>

      <PremiumCard className="space-y-4 p-4">
        <SectionHeader
          eyebrow="Inputs"
          title="Prepare the review"
          description="Paste the CV text and job post. The action will remain safe until backend credits are connected."
          action={<FileText size={18} className="text-primary" />}
          className="mb-0"
        />

        <Textarea
          label="Your CV"
          value={cv}
          onChange={setCv}
          placeholder="Paste your full CV text here..."
          rows={8}
          hint="Use the generated CV text or paste a version you plan to send."
        />
        <Textarea
          label="Job description"
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Paste the job posting you are targeting..."
          rows={7}
          hint={smartStart.jobDescription ? 'Prefilled from Smart Start. You can edit it.' : 'Required for a meaningful recruiter review.'}
        />

        <div className="rounded-[1.5rem] border border-black/7 bg-black/4 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Coins size={16} className="text-primary" />
            <p className="text-sm font-extrabold text-charcoal">Transparent AI action</p>
          </div>
          <p className="text-xs font-medium leading-5 text-charcoal/58">
            {getActionCostLabel('recruiterXRay')}. Planned provider route: {plan.provider || 'backend selected'} · model tier: {plan.modelTier}.
          </p>
        </div>

        <PrimaryAction onClick={handleRun} disabled={loading || !canRun} icon={loading ? Loader2 : Sparkles}>
          {loading ? 'Checking backend...' : `${action.label} · ${action.credits} credits`}
        </PrimaryAction>

        <GuidanceNote variant="lock">
          This button is wired to the safe backend facade. Until the VPS backend is connected, it will not send CV data to an AI provider.
        </GuidanceNote>
      </PremiumCard>

      {error && (
        <GuidanceNote variant="warning">
          <span className="inline-flex items-start gap-2">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </span>
        </GuidanceNote>
      )}

      <ResultCard result={result} />

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Privacy"
          title="Backend required before live AI"
          description="Provider keys, credit checks, caching, and rate limits must live on the VPS backend, not inside the Android app."
          action={<LockKeyhole size={18} className="text-primary" />}
          className="mb-0"
        />
        <GuidanceNote>No user-supplied API key is accepted. This keeps the Android app safer and easier for normal users.</GuidanceNote>
      </PremiumCard>
    </AppShell>
  );
}
