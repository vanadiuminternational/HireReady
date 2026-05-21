import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import PremiumCard from '@/components/app/PremiumCard';

export default function Privacy() {
  return (
    <AppShell contentClassName="space-y-5 pb-6">
      <section className="space-y-3 pt-2">
        <p className="text-xs font-medium leading-5 text-charcoal/45">Privacy</p>
        <h1 className="text-[1.85rem] font-extrabold leading-tight tracking-[-0.04em] text-charcoal">
          Your CV stays yours.
        </h1>
      </section>

      <PremiumCard className="space-y-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-primary">
          <Shield size={22} />
        </div>
        <p className="text-[15px] font-medium leading-7 text-charcoal/64">
          GradSharp runs on your phone. Your CV stays in your browser unless you ask for a recruiter review, which sends it once to our server for analysis and isn't stored. We don't ask for your API keys. We don't have your email. If you delete the app, your data goes with it.
        </p>
      </PremiumCard>

      <Link
        to="/"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-[1.35rem] bg-charcoal px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_36px_rgba(17,24,39,0.18)]"
      >
        Back to Home
      </Link>
    </AppShell>
  );
}
