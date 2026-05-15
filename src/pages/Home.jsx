import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  FileText,
  LayoutTemplate,
  LockKeyhole,
  MessageSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Eye,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import SmartBadge from '@/components/app/SmartBadge';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { MONETIZATION_CONFIG } from '@/config/monetizationConfig';
import { PRIVACY_CONFIG } from '@/config/privacyConfig';
import { getAllCVs } from '@/services/storageService';

const smartSignals = [
  { label: 'Market', value: 'UK, US, EU' },
  { label: 'Path', value: 'All stages' },
  { label: 'Format', value: 'ATS-safe' },
];

const toolLinks = [
  { flag: 'savedCvsEnabled', to: '/saved', icon: Bookmark, label: 'Saved CVs', detail: 'Continue work' },
  { flag: 'coverLetterEnabled', to: '/cover-letter', icon: MessageSquare, label: 'Cover Letter', detail: 'Match the role' },
  { flag: 'interviewPrepEnabled', to: '/interview', icon: Mic, label: 'Interview Prep', detail: 'Practice answers' },
  { flag: 'recruiterXRayEnabled', to: '/x-ray', icon: Eye, label: 'Recruiter X-Ray', detail: 'Review fit later' },
  { flag: 'templatesEnabled', to: '/templates', icon: LayoutTemplate, label: 'Templates', detail: 'Browse starts' },
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
    <AppShell contentClassName="space-y-4 pb-5">
      <section className="space-y-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <SmartBadge icon={Sparkles}>HireReady</SmartBadge>
          <CreditPill>{MONETIZATION_CONFIG.uiCopy.aiCreditsLater}</CreditPill>
        </div>

        <div className="space-y-2.5">
          <h1 className="max-w-[20rem] text-[2.05rem] font-extrabold leading-[1.04] text-charcoal">
            Know the right CV before you write it.
          </h1>
          <p className="max-w-sm text-sm leading-6 text-charcoal/64">
            Smart Start chooses the CV structure for your role, region, and career stage.
          </p>
        </div>
      </section>

      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Smart CV plan</p>
              <h2 className="mt-2 text-[1.55rem] font-extrabold leading-tight text-white">
                Role-fit guidance in four taps.
              </h2>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Wand2 size={22} />
            </span>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2">
            {smartSignals.map((item) => (
              <div key={item.label} className="min-w-0 rounded-2xl bg-white/9 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">{item.label}</p>
                <p className="mt-1 truncate text-xs font-bold text-white/82">{item.value}</p>
              </div>
            ))}
          </div>

          <PrimaryAction to="/smart-start" icon={ArrowRight} className="bg-white text-charcoal shadow-none">
            Start Smart CV
          </PrimaryAction>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-2 gap-3">
        <SecondaryAction to="/saved" icon={Bookmark} className="justify-start">
          {savedCount ? `${savedCount} saved CV${savedCount === 1 ? '' : 's'}` : 'Saved CVs'}
        </SecondaryAction>
        <SecondaryAction to="/build" icon={FileText} className="justify-start">
          Build manually
        </SecondaryAction>
      </div>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Tools"
          title="Application tools"
          action={<Target size={18} className="text-primary" />}
          className="mb-1"
        />

        <div className="grid grid-cols-2 gap-2.5">
          {visibleTools.slice(1).map(({ to, icon: Icon, label, detail }) => (
            <SecondaryAction key={to} to={to} className="min-h-[76px] flex-col items-start justify-center rounded-[1.35rem] px-3.5 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/9 text-primary">
                <Icon size={17} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-bold leading-tight">{label}</span>
                <span className="mt-0.5 block text-xs font-medium text-charcoal/48">{detail}</span>
              </span>
            </SecondaryAction>
          ))}
        </div>
      </PremiumCard>

      <div className="grid grid-cols-[auto,1fr] gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/78 text-primary shadow-sm">
          <ShieldCheck size={20} />
        </div>
        <GuidanceNote variant="lock" className="min-h-11">
          {PRIVACY_CONFIG.privacyCopy.oneLiner}
        </GuidanceNote>
      </div>

      <div className="flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal/38">
        <LockKeyhole size={13} />
        <span>No backend, no live AI, no payments in this flow</span>
      </div>
    </AppShell>
  );
}
