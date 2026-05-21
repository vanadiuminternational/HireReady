import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  CheckSquare,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import PremiumCard from '@/components/app/PremiumCard';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { getAllCVs } from '@/services/storageService';

const trustCards = [
  {
    icon: Globe2,
    emoji: '🌍',
    title: 'Region-aware rules',
    detail: 'UK, US, Germany, UAE — every market has different CV rules. GradSharp knows them.',
  },
  {
    icon: CheckSquare,
    emoji: '✅',
    title: 'ATS-safe structure',
    detail: 'Built for real applicant tracking systems, not just visual appeal.',
  },
  {
    icon: LockKeyhole,
    emoji: '🔒',
    title: 'Stays on your device',
    detail: 'Your CV stays on this device unless you choose to export or sync later.',
  },
];

const quickActions = [
  { title: 'Smart Start', detail: 'Answer 6 prompts and get the right CV path.', to: '/smart-start', icon: Zap, accent: 'from-primary to-emerald-500' },
  { title: 'Build CV', detail: 'Create a clean ATS-safe CV.', to: '/build', icon: FileText, accent: 'from-charcoal to-slate-600' },
  { title: 'Cover letter', detail: 'Generate a targeted letter draft.', to: '/cover-letter', icon: Mail, accent: 'from-amber-500 to-orange-500' },
  { title: 'Saved CVs', detail: 'Open drafts stored on your device.', to: '/saved', icon: Bookmark, accent: 'from-cyan-500 to-blue-500' },
];

function ProgressPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function Home() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getAllCVs().length);
  }, []);

  const primaryCta = useMemo(() => {
    if (savedCount > 0) return { label: 'Continue latest CV', to: '/saved' };
    return { label: 'Start Smart Start', to: '/smart-start' };
  }, [savedCount]);

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <Link to={primaryCta.to} className="block bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.25),transparent_13rem)] p-5 active:scale-[0.995]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">GradSharp</p>
              <h1 className="mt-2 text-[1.85rem] font-extrabold leading-[1.02] text-white">
                Build a sharper CV before you apply.
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-white/58">
                Smart Start picks the right CV path, then helps you write clean, ATS-safe application content.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <ShieldCheck size={23} />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ProgressPill label="Saved" value={savedCount} />
            <ProgressPill label="Mode" value={FEATURE_FLAGS.aiAssistance ? 'AI' : 'Local'} />
            <ProgressPill label="Privacy" value="Local" />
          </div>
        </Link>
      </PremiumCard>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map(({ title, detail, to, icon: Icon, accent }) => (
          <Link key={title} to={to} className="group block rounded-[1.5rem] border border-black/[0.055] bg-white/82 p-3.5 shadow-[0_16px_36px_rgba(15,23,42,0.07)] active:scale-[0.985]">
            <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg shadow-black/10`}>
              <Icon size={18} />
            </span>
            <p className="text-sm font-extrabold text-charcoal">{title}</p>
            <p className="mt-1 text-xs font-medium leading-5 text-charcoal/54">{detail}</p>
          </Link>
        ))}
      </div>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader eyebrow="Trusted workflow" title="Application tools that stay practical" className="mb-0" />
        <div className="space-y-2.5">
          {trustCards.map(({ icon: Icon, emoji, title, detail }) => (
            <div key={title} className="flex gap-3 rounded-[1.25rem] bg-black/[0.025] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="text-lg" aria-hidden="true">{emoji}</span>
                <Icon size={0} className="sr-only" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-charcoal">{title}</p>
                <p className="mt-0.5 text-xs font-medium leading-5 text-charcoal/55">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>

      <SecondaryAction to="/privacy" className="justify-center">Privacy and local-first design</SecondaryAction>
    </AppShell>
  );
}
