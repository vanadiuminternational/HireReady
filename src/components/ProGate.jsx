import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';

/**
 * Wrap any Pro-only feature with this component.
 * Shows a lock overlay if user is not Pro.
 */
export default function ProGate({ isPro, loading, children, featureName }) {
  if (loading) return null;
  if (isPro) return children;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-40 blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-2xl z-10 px-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
          <Crown size={22} className="text-primary" />
        </div>
        <p className="text-sm font-bold text-foreground mb-1">Pro Feature</p>
        {featureName && <p className="text-xs text-muted-foreground mb-3">{featureName} is available on Pro.</p>}
        <Link to="/pro"
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl px-4 py-2.5">
          <Lock size={12} /> Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}