import React from 'react';
import { Database, Info, LockKeyhole, Shield, Trash2, User, Wifi } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import SectionHeader from '@/components/app/SectionHeader';

const points = [
  {
    icon: Wifi,
    title: 'Local-first app',
    desc: 'HireReady works without a user account or cloud sync in this version. CV building, cover letters, interview prep, and saved drafts run on the device.',
  },
  {
    icon: Database,
    title: 'Data stored on your device',
    desc: 'Saved CVs, cover letters, and app state are stored locally in the app WebView storage on your device.',
  },
  {
    icon: User,
    title: 'No account required',
    desc: 'This version does not require sign-in, email registration, or profile creation to use the core tools.',
  },
  {
    icon: Shield,
    title: 'No CV upload in this version',
    desc: 'The current release does not upload CV text, cover letters, or personal profile details to a HireReady server.',
  },
  {
    icon: Trash2,
    title: 'Delete your drafts anytime',
    desc: 'Saved CVs can be deleted from the Saved CVs screen. Uninstalling the app or clearing app storage removes local data from this device.',
  },
  {
    icon: Info,
    title: 'Future AI and cloud features',
    desc: 'If live AI, analytics, subscriptions, cloud sync, or account features are added later, the privacy policy and Google Play Data Safety declaration must be updated before those features go live.',
  },
];

export default function Privacy() {
  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Privacy</p>
              <h1 className="mt-2 text-[1.65rem] font-extrabold leading-tight text-white">Local-first by design.</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                HireReady is designed so your career documents stay on your device in this release.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Shield size={22} />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Account</p>
              <p className="mt-1 text-xs font-bold text-white/82">Not required</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">CV data</p>
              <p className="mt-1 text-xs font-bold text-white/82">Local only</p>
            </div>
          </div>
        </div>
      </PremiumCard>

      <GuidanceNote variant="lock">
        Last updated: May 2026. This wording applies to the current local-first Android release before live AI, cloud sync, analytics, or subscriptions are enabled.
      </GuidanceNote>

      <div className="space-y-3">
        {points.map(({ icon: Icon, title, desc }) => (
          <PremiumCard key={title} className="flex gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-charcoal">{title}</p>
              <p className="mt-1 text-xs font-medium leading-5 text-charcoal/58">{desc}</p>
            </div>
          </PremiumCard>
        ))}
      </div>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Third-party services"
          title="No tracking SDKs in this release"
          description="This version does not use third-party advertising SDKs, analytics SDKs, or social tracking pixels. If this changes later, the policy and Data Safety form must be updated first."
          action={<LockKeyhole size={18} className="text-primary" />}
          className="mb-0"
        />
      </PremiumCard>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Contact"
          title="Privacy questions"
          description="For store release, add the support email and privacy-policy URL used in the Google Play Console listing."
          action={<Info size={18} className="text-primary" />}
          className="mb-0"
        />
      </PremiumCard>

      <p className="pb-4 text-center text-xs font-medium text-charcoal/42">HireReady · Privacy Policy · v1.0</p>
    </AppShell>
  );
}
