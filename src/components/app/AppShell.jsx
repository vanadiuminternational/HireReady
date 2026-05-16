import BottomNav from '@/components/BottomNav';
import { PLATFORM_CONFIG } from '@/config/platformConfig';
import { cn } from '@/lib/utils';

export default function AppShell({ children, withBottomNav = true, className = '', contentClassName = '' }) {
  return (
    <div
      className={cn('min-h-screen overflow-x-hidden bg-[#fbfaf7] text-charcoal', withBottomNav ? 'pb-24' : 'pb-7', className)}
      style={{ paddingTop: PLATFORM_CONFIG.safeArea.top }}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(47,151,112,0.16),transparent_16rem),radial-gradient(circle_at_92%_12%,rgba(255,183,116,0.13),transparent_14rem),linear-gradient(180deg,#fffdfa_0%,#fbfaf7_42%,#f7f4ef_100%)]" />
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <main className={cn('mx-auto w-full max-w-lg px-5 pt-5', contentClassName)}>
        {children}
      </main>
      {withBottomNav && <BottomNav />}
    </div>
  );
}
