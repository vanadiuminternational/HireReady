import React, { useState } from 'react';
import { Crown, Zap, FileText, MessageSquare, Mic, Star, Check, Loader2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { base44 } from '@/api/base44Client';
import { useProAccess } from '@/hooks/useProAccess';
import { toast } from 'sonner';

const MONTHLY_PRICE_ID = 'price_1TVcRzAxJaUfIpUPoEC3ISo5';
const LIFETIME_PRICE_ID = 'price_1TVcRzAxJaUfIpUPNbfZrscM';

const proFeatures = [
  { icon: Zap, label: 'AI CV Rewrite', desc: 'One-tap AI-powered CV enhancement using your job description.' },
  { icon: MessageSquare, label: 'All Cover Letter Tones', desc: 'Warm, confident, graduate, career changer — every tone unlocked.' },
  { icon: Star, label: 'LinkedIn Summary Generator', desc: 'Auto-generate a professional LinkedIn About section from your CV.' },
  { icon: Mic, label: 'Interview Answer Generator', desc: 'Tailored STAR-method answers for any job description.' },
  { icon: FileText, label: 'Premium PDF Templates', desc: 'Export with Classic, Modern, Executive, and Minimal designs.' },
  { icon: Crown, label: 'Unlimited Saves', desc: 'Save unlimited CVs, cover letters, and application packs.' },
];

export default function Pro() {
  const { isPro, loading } = useProAccess();
  const [checkingOut, setCheckingOut] = useState(null);

  const handleCheckout = async (priceId, label) => {
    // Block checkout in iframe (preview mode)
    if (window.self !== window.top) {
      alert('Checkout only works from the published app, not the preview.');
      return;
    }

    try {
      setCheckingOut(priceId);
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const res = await base44.functions.invoke('createCheckout', {
        priceId,
        successUrl: window.location.origin + '/pro?success=1',
        cancelUrl: window.location.origin + '/pro',
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Could not start checkout. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(null);
    }
  };

  // Success redirect
  const isSuccess = new URLSearchParams(window.location.search).get('success') === '1';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background px-5 pt-12 pb-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Crown size={28} className="text-primary-foreground" />
          </div>
          {loading ? (
            <div className="h-8 flex items-center justify-center"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
          ) : isPro ? (
            <>
              <h1 className="text-2xl font-extrabold text-foreground">You're on Pro 🎉</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">All Pro features are unlocked. Enjoy!</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-foreground">Upgrade to Pro</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                Unlock AI tools, premium PDF templates, unlimited saves, and more.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="px-5 max-w-lg mx-auto space-y-5">

        {/* Success banner */}
        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <Check size={18} className="text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">Payment successful! Pro features are now active.</p>
          </div>
        )}

        {/* Pricing cards — only show if not Pro */}
        {!loading && !isPro && (
          <div className="space-y-3">
            {/* Monthly */}
            <div className="bg-white rounded-2xl border-2 border-primary p-5 shadow-sm relative overflow-hidden">
              <span className="absolute top-3 right-3 text-xs font-bold bg-primary text-primary-foreground rounded-full px-2.5 py-1">Popular</span>
              <p className="text-base font-extrabold text-foreground">Monthly</p>
              <div className="flex items-end gap-1 mt-1 mb-3">
                <span className="text-3xl font-extrabold text-primary">$7.99</span>
                <span className="text-sm text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Cancel anytime. Billed monthly.</p>
              <button
                onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'Monthly Pro')}
                disabled={!!checkingOut}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold rounded-xl py-3.5 text-sm disabled:opacity-60"
              >
                {checkingOut === MONTHLY_PRICE_ID ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} />}
                Get Pro Monthly
              </button>
            </div>

            {/* Lifetime */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <p className="text-base font-extrabold text-foreground">Lifetime Access</p>
              <div className="flex items-end gap-1 mt-1 mb-3">
                <span className="text-3xl font-extrabold text-foreground">$59.99</span>
                <span className="text-sm text-muted-foreground mb-1">one-time</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Pay once, use forever. No subscription.</p>
              <button
                onClick={() => handleCheckout(LIFETIME_PRICE_ID, 'Lifetime Pro')}
                disabled={!!checkingOut}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold rounded-xl py-3.5 text-sm disabled:opacity-60"
              >
                {checkingOut === LIFETIME_PRICE_ID ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                Get Lifetime Access
              </button>
            </div>
          </div>
        )}

        {/* Pro features list */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">What's included in Pro</p>
          <div className="space-y-3">
            {proFeatures.map(({ icon: Icon, label, desc }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-3 items-start shadow-sm">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
                {isPro && <Check size={16} className="text-emerald-500 flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-4">
          Secure checkout powered by Stripe · Cancel anytime
        </p>
      </div>

      <BottomNav />
    </div>
  );
}