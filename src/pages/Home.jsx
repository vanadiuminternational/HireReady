import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Search, Target, ArrowRight, Sparkles, MessageSquare, Mic, Shield, Eye } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const features = [
  { icon: '✅', title: 'ATS-Friendly Structure', desc: 'One-column layout, no graphics, clean headings — safe for all ATS systems.' },
  { icon: '🎯', title: '12 Smart Templates', desc: 'Student, Graduate, Admin, IT Support, Healthcare, Retail, Hospitality & more.' },
  { icon: '🔍', title: 'Keyword Matching', desc: 'Extracts keywords from job descriptions and matches them to your profile.' },
  { icon: '💡', title: 'Achievement Bullet Builder', desc: 'Turns your experience into strong, action-driven bullet points.' },
  { icon: '📊', title: 'ATS Readiness Score', desc: 'Instant 5-category score with warnings and top 5 fixes.' },
  { icon: '✉️', title: 'Cover Letter Generator', desc: '8 cover letter types tailored to your role and industry.' },
  { icon: '🎤', title: 'Interview Prep', desc: '20 interview questions, STAR method guide, example answers & checklist.' },
  { icon: '🤖', title: 'AI Recruiter X-Ray', desc: 'A blunt AI hiring manager reacts to your CV against a real job description.' },
  { icon: '🔒', title: 'Fully Offline & Private', desc: 'No account, no server, no tracking. All data stays on your device.' },
];

const quickLinks = [
  { to: '/build', icon: FileText, label: 'Build CV', primary: true },
  { to: '/x-ray', icon: Eye, label: 'Recruiter X-Ray', primary: false },
  { to: '/cover-letter', icon: MessageSquare, label: 'Cover Letter', primary: false },
  { to: '/interview', icon: Mic, label: 'Interview Prep', primary: false },
  { to: '/templates', icon: Target, label: 'Templates', primary: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background px-5 pt-14 pb-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">HireReady CV Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-3">
            Build an ATS-Friendly CV<br />
            <span className="text-primary">That Gets More Interviews</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-7">
            Offline-first CV builder. No account needed. All data stays on your device. Professional templates, ATS scoring, cover letters, and interview prep — all in one app.
          </p>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(({ to, icon: Icon, label, primary }) => (
              <Link key={to} to={to}
                className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 ${primary ? 'bg-primary text-primary-foreground shadow-primary/20 col-span-2 py-4 text-base shadow-lg' : 'bg-white border border-border text-foreground'}`}>
                <Icon size={primary ? 18 : 15} /> {label} {primary && <ArrowRight size={16} />}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-5 pt-8 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" /> What's Inside
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 flex gap-4 items-start shadow-sm">
              <span className="text-2xl mt-0.5 flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy badge */}
        <Link to="/privacy" className="mt-5 flex items-center gap-3 bg-muted rounded-2xl p-4">
          <Shield size={18} className="text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-foreground">Your data stays on your device</p>
            <p className="text-xs text-muted-foreground">No account, no server, no tracking. Tap to read the privacy policy.</p>
          </div>
          <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}