import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Layout, Bookmark, Star, MoreHorizontal, X, MessageSquare, Mic, Shield, Eye } from 'lucide-react';

const primaryNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/build', icon: FileText, label: 'Build' },
  { path: '/templates', icon: Layout, label: 'Templates' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/pro', icon: Star, label: 'Pro' },
];

const moreItems = [
  { path: '/x-ray', icon: Eye, label: 'Recruiter X-Ray' },
  { path: '/cover-letter', icon: MessageSquare, label: 'Cover Letter' },
  { path: '/interview', icon: Mic, label: 'Interview Prep' },
  { path: '/privacy', icon: Shield, label: 'Privacy' },
];

export default function BottomNav() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <>
      {/* More drawer */}
      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 max-w-lg mx-auto px-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-2xl border border-border shadow-xl p-4 space-y-1">
              {moreItems.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path} onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === path ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}>
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {primaryNav.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-0.5 flex-1 py-2 transition-all">
                <Icon size={22} className={active ? 'text-primary' : 'text-muted-foreground'} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
              </Link>
            );
          })}
          <button onClick={() => setShowMore(v => !v)} className="flex flex-col items-center gap-0.5 flex-1 py-2 transition-all">
            {showMore ? (
              <X size={22} className="text-primary" strokeWidth={2.5} />
            ) : (
              <MoreHorizontal size={22} className={isMoreActive ? 'text-primary' : 'text-muted-foreground'} strokeWidth={1.8} />
            )}
            <span className={`text-[10px] font-medium ${isMoreActive || showMore ? 'text-primary' : 'text-muted-foreground'}`}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}