import BottomNav from '@/components/BottomNav';
import { PLATFORM_CONFIG } from '@/config/platformConfig';
import { cn } from '@/lib/utils';

export default function AppShell({ children, withBottomNav = true, className = '', contentClassName = '' }) {
  return (
    <div
      className={cn('min-h-screen bg-[#faf7f0] text-charcoal', withBottomNav ? 'pb-24' : 'pb-8', className)}
      style={{ paddingTop: PLATFORM_CONFIG.safeArea.top }}
    >
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(21,128,107,0.13),transparent_28rem),linear-gradient(180deg,#fffaf0_0%,#f8f3ea_44%,#f4efe7_100%)]">
        <main className={cn('mx-auto w-full max-w-lg px-5 pt-5', contentClassName)}>
          {children}
        </main>
      </div>
      {withBottomNav && <BottomNav />}
    </div>
  );
}
