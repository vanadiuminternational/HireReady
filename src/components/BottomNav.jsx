import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Layout, Bookmark, Eye, MoreHorizontal, X, MessageSquare, Mic, Shield } from 'lucide-react';

const primaryNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/build', icon: FileText, label: 'Build' },
  { path: '/cover-letter', icon: MessageSquare, label: 'Letter' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/templates', icon: Layout, label: 'Pro' },
];

const moreItems = [
  { path: '/x-ray', icon: Eye, label: 'Recruiter X-Ray' },
  { path: '/interview', icon: Mic, label: 'Interview Prep' },
  { path: '/privacy', icon: Shield, label: 'Privacy' },
];

export default function BottomNav() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const isMoreActive = moreItems.some((item) => location.pathname === item.path);

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 bg-charcoal/25 backdrop-blur-sm" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-24 left-0 right-0 mx-auto max-w-lg px-5" onClick={(event) => event.stopPropagation()}>
            <div className="rounded-[1.6rem] border border-black/[0.06] bg-white/95 p-2.5 shadow-[0_24px_55px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              {moreItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 rounded-[1.15rem] px-4 py-3 transition-all ${
                    location.pathname === path ? 'bg-primary/10 text-primary' : 'text-charcoal/75 hover:bg-black/[0.035]'
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/8">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/[0.055] bg-white/88 shadow-[0_-14px_34px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.7rem] max-w-lg items-center justify-around px-3 pb-[env(safe-area-inset-bottom)]">
          {primaryNav.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.25rem] py-2 transition-all ${active ? 'text-primary' : 'text-charcoal/45'}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${active ? 'bg-primary/10 shadow-[0_8px_18px_rgba(21,128,107,0.16)]' : 'bg-transparent'}`}>
                  <Icon size={21} strokeWidth={active ? 2.6 : 1.9} />
                </span>
                <span className="text-[10.5px] font-extrabold leading-none">{label}</span>
              </Link>
            );
          })}
          <button onClick={() => setShowMore((value) => !value)} className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.25rem] py-2 transition-all ${isMoreActive || showMore ? 'text-primary' : 'text-charcoal/45'}`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all ${isMoreActive || showMore ? 'bg-primary/10 shadow-[0_8px_18px_rgba(21,128,107,0.16)]' : 'bg-transparent'}`}>
              {showMore ? <X size={21} strokeWidth={2.6} /> : <MoreHorizontal size={21} strokeWidth={1.9} />}
            </span>
            <span className="text-[10.5px] font-extrabold leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
