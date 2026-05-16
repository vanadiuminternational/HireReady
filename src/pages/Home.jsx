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
  Sparkles,
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
    detail: 'UK, US, Germany, UAE — every market has different CV rules. HireReady knows them.',
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

const toolLinks = [
  { flag: 'savedCvsEnabled', to: '/saved', icon: Bookmark, label: 'Saved CVs', detail: 'Continue work' },
  { flag: 'coverLetterEnabled', to: '/cover-letter', icon: Mail, label: 'Cover Letter', detail: 'Tailored letter in minutes' },
];

export default function Home() {
  const [savedCount, setSavedCount] = useState(0);
  const visibleTools = useMemo(
    () => toolLinks.filter((item) => FEATURE_FLAGS[item.flag] !== false),
    [],
  );

  useEffect(() => {
    setSavedCount(getAllCVs().length);
  }, []);

  return (
    <AppShell contentClassName="space-y-7 pb-7">
      <section className="space-y-5 pt-2">
        <div className="space-y-3">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-primary">HireReady</p>
          <h1 className="max-w-[22rem] text-[2.62rem] font-extrabold leading-[1.04] tracking-[-0.055em] text-charcoal sm:text-[2.85rem]">
            Build the right CV for your role and market.
          </h1>
          <p className="text-[17px] leading-7 text-charcoal/46">
            Region-aware. ATS-safe. Guided from the start.
          </p>
        </div>

        <Link to="/smart-start" className="block rounded-[1.8rem] focus:outline-none focus:ring-4 focus:ring-primary/15">
          <PremiumCard tone="green" className="relative overflow-hidden p-0">
            <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/16 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 left-4 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4 p-6">
              <div className="min-w-0">
                <h2 className="text-[1.25rem] font-extrabold leading-tight text-white">Smart CV Start</h2>
                <p className="mt-2 max-w-[15rem] text-[15px] font-medium leading-6 text-white/68">
                  Tell us your role and market. We'll build the right structure.
                </p>
              </div>
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.55rem] bg-white/14 text-white shadow-inner">
                <Zap size={30} fill="currentColor" />
              </span>
            </div>
          </PremiumCard>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <SecondaryAction to="/saved" icon={Bookmark} className="min-h-[4.7rem] justify-center rounded-[1.45rem] bg-white/95 text-[1rem] shadow-[0_12px_28px_rgba(15,23,42,0.11)]">
            {savedCount ? `${savedCount} saved CV${savedCount === 1 ? '' : 's'}` : 'Saved CVs'}
          </SecondaryAction>
          <SecondaryAction to="/build" icon={FileText} className="min-h-[4.7rem] justify-center rounded-[1.45rem] bg-white/95 text-[1rem] shadow-[0_12px_28px_rgba(15,23,42,0.11)]">
            Build manually
          </SecondaryAction>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader eyebrow="Why HireReady" />
        <div className="space-y-3.5">
          {trustCards.map(({ icon: Icon, emoji, title, detail }) => (
            <PremiumCard key={title} className="flex items-start gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-primary/8 text-2xl text-primary">
                <span aria-hidden="true">{emoji}</span>
                <Icon className="sr-only" size={20} />
              </span>
              <span className="min-w-0">
                <h3 className="text-[1.05rem] font-extrabold leading-tight tracking-[-0.02em] text-charcoal">{title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-7 text-charcoal/44">{detail}</p>
              </span>
            </PremiumCard>
          ))}
        </div>
      </section>

      <section className="space-y-3 pb-2">
        <SectionHeader eyebrow="All tools" />
        <div className="space-y-3.5">
          <SecondaryAction to="/build" icon={FileText} className="min-h-[5.4rem] justify-start rounded-[1.55rem] bg-white/94 px-5 shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
            <span className="text-left">
              <span className="block text-[1.05rem] font-extrabold text-charcoal">Build CV</span>
              <span className="mt-1 block text-[15px] font-medium text-charcoal/45">Step-by-step builder with ATS scoring</span>
            </span>
          </SecondaryAction>
          {visibleTools.slice(1).map(({ to, icon: Icon, label, detail }) => (
            <SecondaryAction key={to} to={to} icon={Icon} className="min-h-[5.4rem] justify-start rounded-[1.55rem] bg-white/94 px-5 shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
              <span className="text-left">
                <span className="block text-[1.05rem] font-extrabold text-charcoal">{label}</span>
                <span className="mt-1 block text-[15px] font-medium text-charcoal/45">{detail}</span>
              </span>
            </SecondaryAction>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-2 pb-1 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-charcoal/30">
        <ShieldCheck size={13} />
        <span>Private by default</span>
      </div>
    </AppShell>
  );
}
