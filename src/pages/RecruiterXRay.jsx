import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Loader2,
  MessageCircleQuestion,
  Wand2,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import { runRecruiterXRay } from '@/lib/aiClient';
import { getStoredSmartStart } from '@/lib/smartStartStorage';

function findSpecificLine(cv) {
  const lines = cv
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 8);

  return (
    lines.find((line) => /helped|responsible|worked|assisted|supported/i.test(line)) ||
    lines.find((line) => !/[0-9£%]/.test(line)) ||
    lines[0] ||
    'Add one clear achievement line before sending.'
  );
}

function makeLocalReview(cv, jobDescription, smartStart) {
  const weakLine = findSpecificLine(cv);
  const role = smartStart.targetRole || jobDescription.split('\n')[0]?.slice(0, 80) || 'this role';
  const hasNumber = /[0-9£%]/.test(weakLine);

  return {
    reviewedAgainst: role,
    verdict: hasNumber
      ? 'Your CV has evidence, but one claim still needs clearer ownership before sending.'
      : 'Your CV may get a second look, but one claim will be questioned because it reads like a duty.',
    weakest_line: weakLine,
    line_reason: hasNumber
      ? 'This has proof, but the recruiter still needs to see what you personally changed.'
      : 'This sounds like a duty, not an achievement. They will ask what changed because of you.',
    rewritten_bullet: hasNumber
      ? `Improved the result behind this work by clarifying your role, action, and outcome: ${weakLine}`
      : `Turn this into an achievement with one number: ${weakLine}`,
    question: `You mention “${weakLine.slice(0, 58)}${weakLine.length > 58 ? '…' : ''}” — what did you personally do, and what changed after it?`,
    action: 'Add one number to this section. Hours per week, users supported, customers per shift, budget size, grade, percentage, or turnaround time all count.',
  };
}

function Textarea({ id, label, value, onChange, placeholder, rows = 7, hint }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-[0.14em] text-charcoal/45">
        {label}
      </label>
      <textarea
        id={id}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-[1.35rem] border border-black/[0.08] bg-white/95 px-4 py-3 text-[15px] leading-6 text-charcoal outline-none transition placeholder:text-charcoal/28 focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
      />
      {hint && <p className="text-xs italic leading-5 text-charcoal/45">{hint}</p>}
    </div>
  );
}

function ResultCard({ result }) {
  const [showRewrite, setShowRewrite] = useState(false);
  if (!result) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-medium leading-5 text-charcoal/45">Reviewed against:</p>
        <p className="text-sm font-bold leading-5 text-charcoal/70">{result.reviewedAgainst || 'the job you pasted'}</p>
        <h1 className="pt-2 text-[1.55rem] font-extrabold leading-tight tracking-[-0.035em] text-charcoal">
          {result.verdict}
        </h1>
      </div>

      <PremiumCard className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-charcoal">
          <AlertTriangle size={17} className="text-orange-700" />
          <span>The line a recruiter will stop on</span>
        </div>
        <p className="rounded-[1.2rem] bg-orange-50 p-3 text-sm font-bold leading-6 text-orange-900">
          “{result.weakest_line}”
        </p>
        <p className="text-sm font-medium leading-6 text-charcoal/58">{result.line_reason}</p>
        {showRewrite && (
          <p className="rounded-[1.2rem] bg-primary/7 p-3 text-sm font-bold leading-6 text-charcoal">
            {result.rewritten_bullet}
          </p>
        )}
        <SecondaryAction onClick={() => setShowRewrite((value) => !value)} icon={Wand2} className="w-full justify-center">
          {showRewrite ? 'Hide rewrite' : 'Rewrite this line'}
        </SecondaryAction>
      </PremiumCard>

      <PremiumCard className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-charcoal">
          <MessageCircleQuestion size={17} className="text-primary" />
          <span>The question they will ask in interview</span>
        </div>
        <p className="text-sm font-medium leading-6 text-charcoal/64">{result.question}</p>
        <SecondaryAction to="/build" className="w-full justify-center">Open Write CV</SecondaryAction>
      </PremiumCard>

      <PremiumCard className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-charcoal">
          <CheckCircle2 size={17} className="text-primary" />
          <span>The one thing to do before sending</span>
        </div>
        <p className="text-sm font-medium leading-6 text-charcoal/64">{result.action}</p>
        <SecondaryAction to="/build" className="w-full justify-center">Open Write CV</SecondaryAction>
      </PremiumCard>

      <p className="pb-1 text-xs font-medium text-charcoal/38">Reviewed in a few seconds · Re-run</p>
    </div>
  );
}

export default function RecruiterXRay() {
  const smartStart = useMemo(() => getStoredSmartStart(), []);
  const [cv, setCv] = useState('');
  const [jobDescription, setJobDescription] = useState(smartStart.jobDescription || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const runId = useRef(0);

  const canRun = cv.trim().length > 20 && jobDescription.trim().length > 10;

  const handleRun = async () => {
    const currentRun = runId.current + 1;
    runId.current = currentRun;
    setLoading(true);
    setResult(null);

    const localResult = makeLocalReview(cv, jobDescription, smartStart);
    const localTimer = window.setTimeout(() => {
      if (runId.current === currentRun) {
        setResult(localResult);
        setLoading(false);
      }
    }, 650);

    try {
      const data = await runRecruiterXRay({ cv, jobDescription });
      window.clearTimeout(localTimer);
      if (runId.current === currentRun) {
        setResult({
          ...localResult,
          verdict: data.verdict || localResult.verdict,
          weakest_line: data.weakest_line || localResult.weakest_line,
          rewritten_bullet: data.rewritten_bullet || localResult.rewritten_bullet,
          question: data.questions?.[0] || localResult.question,
          action: data.quick_wins?.[0] || localResult.action,
        });
        setLoading(false);
      }
    } catch {
      window.clearTimeout(localTimer);
      if (runId.current === currentRun) {
        setResult(localResult);
        setLoading(false);
      }
    }
  };

  return (
    <AppShell contentClassName="space-y-5 pb-6">
      <section className="space-y-3 pt-2">
        <p className="text-xs font-medium leading-5 text-charcoal/45">Recruiter review</p>
        <h1 className="text-[1.85rem] font-extrabold leading-tight tracking-[-0.04em] text-charcoal">
          Reviewed line by line against the job.
        </h1>
        <p className="text-[15px] font-medium leading-7 text-charcoal/52">
          Paste your CV and the job you are targeting. GradSharp will show the line most likely to be questioned before you send it.
        </p>
      </section>

      <PremiumCard className="space-y-4 p-4">
        <Textarea
          id="xray-cv"
          label="Your CV"
          value={cv}
          onChange={setCv}
          placeholder="Paste your full CV text here..."
          rows={8}
          hint="Use the CV text you plan to send."
        />
        <Textarea
          id="xray-job"
          label="Paste the job you're targeting"
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Paste the full job posting here..."
          rows={7}
          hint={smartStart.jobDescription ? 'Filled from Quick setup. You can edit it.' : 'Paste it once and the review will stay focused on this exact role.'}
        />
        <PrimaryAction onClick={handleRun} disabled={loading || !canRun} icon={loading ? Loader2 : Eye}>
          {loading ? 'Reviewing...' : 'Review against this job'}
        </PrimaryAction>
      </PremiumCard>

      {!result && !loading && (
        <div className="rounded-[1.45rem] border border-black/[0.06] bg-white/70 p-4 text-sm font-medium leading-6 text-charcoal/52">
          Paste both boxes to see the line a recruiter may challenge, the interview question it may trigger, and the one edit to make before sending.
        </div>
      )}

      <ResultCard result={result} />
    </AppShell>
  );
}
