import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  FileText,
  Globe2,
  Layers3,
  MessageSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Eye,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SmartBadge from '@/components/app/SmartBadge';
import CreditPill from '@/components/app/CreditPill';
import { getAllCVs } from '@/services/storageService';

const intelligence = [
  {
    icon: Globe2,
    label: 'Region-aware',
    detail: 'UK, Ireland, US, EU, GCC, and more use different CV rules.',
  },
  {
    icon: Layers3,
    label: 'Category-aware',
    detail: 'Section order adapts for students, tech, healthcare, executive, and other paths.',
  },
  {
    icon: ShieldCheck,
    label: 'ATS-safe',
    detail: 'Clean structure first, then styling that stays readable on mobile and export.',
  },
];

const secondaryActions = [
  { to: '/saved', icon: Bookmark, label: 'Continue existing CV', detail: 'Open saved CVs' },
  { to: '/cover-letter', icon: MessageSquare, label: 'Cover Letter', detail: 'Draft support for the same role' },
  { to: '/interview', icon: Mic, label: 'Interview Prep', detail: 'Practice for the next step' },
  { to: '/x-ray', icon: Eye, label: 'Recruiter X-Ray', detail: 'Review fit later through credits' },
];

export default function Home() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getAllCVs().length);
  }, []);

  return (
    <AppShell contentClassName="space-y-5">
      <section className="pt-4">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SmartBadge icon={Sparkles}>CV Intelligence Engine</SmartBadge>
          <CreditPill>AI credits later</CreditPill>
        </div>

        <div className="space-y-4">
          <h1 className="max-w-sm text-[2.35rem] font-extrabold leading-[1.02] text-charcoal">
            Build the right CV for your role, market, and career stage.
          </h1>
          <p className="max-w-md text-[15px] leading-6 text-charcoal/70">
            HireReady turns a few answers into a practical CV plan before you write. Start with the structure that fits your target job.
          </p>
        </div>
      </section>

      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.35),transparent_14rem)] p-5">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Smart Start</p>
              <h2 className="text-2xl font-bold leading-tight text-white">Let the app choose the right CV path.</h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Wand2 size={22} />
            </div>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2 text-center">
            {['Role', 'Region', 'Stage'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-2 py-3">
                <p className="text-[11px] font-semibold text-white/70">{item}</p>
              </div>
            ))}
          </div>

          <PrimaryAction to="/smart-start" className="bg-white text-charcoal shadow-none" icon={ArrowRight}>
            Start Smart CV
          </PrimaryAction>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-2 gap-3">
        <SecondaryAction to="/build" icon={FileText} className="justify-start">
          Build manually
        </SecondaryAction>
        <SecondaryAction to="/templates" icon={Target} className="justify-start">
          Templates
        </SecondaryAction>
      </div>

      <PremiumCard className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal/50">Continue</p>
            <h2 className="mt-1 text-lg font-bold text-charcoal">Your application tools</h2>
          </div>
          <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold text-charcoal/60">
            {savedCount} saved
          </span>
        </div>

        <div className="space-y-2.5">
          {secondaryActions.map(({ to, icon: Icon, label, detail }) => (
            <SecondaryAction key={to} to={to} className="w-full justify-between px-4 py-3.5">
              <span className="flex min-w-0 items-center gap-3 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-charcoal">{label}</span>
                  <span className="block truncate text-xs font-medium text-charcoal/50">{detail}</span>
                </span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-charcoal/40" />
            </SecondaryAction>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard tone="warm" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">Guidance before generation</h2>
            <p className="mt-1 text-sm leading-6 text-charcoal/70">
              Smart Start recommends the CV mode, sections, warnings, and starting template before any AI action is needed.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {intelligence.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/70 text-primary">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-charcoal">{label}</p>
                <p className="text-xs leading-5 text-charcoal/60">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </AppShell>
  );
}
