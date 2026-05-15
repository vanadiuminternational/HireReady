import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, Loader2, AlertCircle, ArrowLeft, Sparkles,
  MessageCircleQuestion, AlertTriangle, Wand2, Zap, CheckCircle2, Coins,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { runRecruiterXRay } from '@/lib/aiClient';
import { getActionCostLabel, AI_ACTIONS } from '@/engine/credits';

export default function RecruiterXRay() {
  const [cv, setCv] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const action = AI_ACTIONS.recruiterXRay;

  const handleRun = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await runRecruiterXRay({ cv, jobDescription });
      setResult(data);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-background px-5 pt-12 pb-7">
        <div className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-4">
            <ArrowLeft size={14} /> Back home
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Eye size={16} className="text-accent-foreground" />
            </div>
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">Recruiter X-Ray</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight mb-2">
            See your CV through a<br />
            <span className="text-accent">hiring manager's eyes</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste your CV and a job description. A blunt-but-fair AI hiring manager will later review the fit, questions, weak lines, and quick fixes.
          </p>
        </div>
      </div>

      <div className="px-5 pt-6 max-w-lg mx-auto space-y-5">
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Coins size={15} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Transparent AI cost</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getActionCostLabel('recruiterXRay')}. This will run through the future HireReady VPS backend, with provider credentials kept off the device.
          </p>
          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            Backend status: not connected yet. The button is intentionally wired to the safe backend facade so provider credentials stay off the device.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Your CV</label>
            <textarea
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Paste your full CV text here..."
              rows={7}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting you're targeting..."
              rows={6}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          <button
            onClick={handleRun}
            disabled={loading || !cv.trim() || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 disabled:opacity-40 disabled:shadow-none transition-opacity"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Reading your CV...</>
            ) : (
              <><Sparkles size={16} /> {action.label} · {action.credits} credits</>
            )}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">This will activate after the VPS backend is added.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="bg-charcoal text-white rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-1">The verdict</p>
              <p className="text-sm leading-relaxed font-medium">{result.verdict}</p>
            </div>

            {Array.isArray(result.questions) && result.questions.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <MessageCircleQuestion size={16} className="text-accent" />
                  <p className="text-sm font-semibold text-foreground">Questions they'd grill you on</p>
                </div>
                <ol className="space-y-2">
                  {result.questions.map((q, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-foreground leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-[11px]">{i + 1}</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {result.weakest_line && (
              <div className="bg-white rounded-2xl border border-destructive/30 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-destructive" />
                  <p className="text-sm font-semibold text-foreground">The line that's hurting you</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.weakest_line}</p>
              </div>
            )}

            {result.rewritten_bullet && (
              <div className="bg-white rounded-2xl border border-primary/30 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 size={16} className="text-primary" />
                  <p className="text-sm font-semibold text-foreground">Sharpened version</p>
                </div>
                <p className="text-xs text-foreground leading-relaxed bg-primary/5 rounded-xl p-3">{result.rewritten_bullet}</p>
              </div>
            )}

            {Array.isArray(result.quick_wins) && result.quick_wins.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2.5">
                  <Zap size={16} className="text-accent" />
                  <p className="text-sm font-semibold text-foreground">Ten-minute fixes</p>
                </div>
                <ul className="space-y-2">
                  {result.quick_wins.map((w, i) => (
                    <li key={i} className="flex gap-2 text-xs text-foreground leading-relaxed">
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
