import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ClipboardCheck, Copy, MessageCircleQuestion, Sparkles, Star, UserRoundCheck } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import SectionHeader from '@/components/app/SectionHeader';
import { INTERVIEW_QUESTIONS, STAR_GUIDE, EXAMPLE_ANSWERS, QUESTIONS_TO_ASK, INTERVIEW_CHECKLIST } from '@/data/interviewData';
import { copyToClipboard } from '@/services/exportService';
import { toast } from 'sonner';

const TABS = ['Questions', 'STAR Method', 'Example Answers', 'Ask Them', 'Checklist'];

const tabIcons = {
  Questions: MessageCircleQuestion,
  'STAR Method': Star,
  'Example Answers': Sparkles,
  'Ask Them': UserRoundCheck,
  Checklist: ClipboardCheck,
};

const categoryStyles = {
  'About You': 'bg-blue-50 text-blue-700 border-blue-200',
  Motivation: 'bg-purple-50 text-purple-700 border-purple-200',
  Behavioural: 'bg-amber-50 text-amber-700 border-amber-200',
  'Role-Specific': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Closing: 'bg-slate-50 text-slate-700 border-slate-200',
};

function CategoryBadge({ cat }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${categoryStyles[cat] || 'border-black/7 bg-white/80 text-charcoal/60'}`}>
      {cat}
    </span>
  );
}

function QuestionCard({ q }) {
  const [open, setOpen] = useState(false);
  return (
    <PremiumCard className="p-4">
      <button className="flex w-full items-start justify-between gap-3" onClick={() => setOpen((value) => !value)}>
        <div className="min-w-0 flex-1 text-left">
          <CategoryBadge cat={q.category} />
          <p className="mt-2 text-sm font-extrabold leading-5 text-charcoal">{q.question}</p>
        </div>
        {open ? <ChevronUp size={16} className="mt-1 shrink-0 text-charcoal/45" /> : <ChevronDown size={16} className="mt-1 shrink-0 text-charcoal/45" />}
      </button>
      {open && (
        <div className="mt-3 border-t border-black/7 pt-3">
          <GuidanceNote>{q.tip}</GuidanceNote>
        </div>
      )}
    </PremiumCard>
  );
}

function AnswerCard({ item }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    const copiedToClipboard = await copyToClipboard(item.answer);
    if (copiedToClipboard) {
      setCopied(true);
      toast.success('Answer copied.');
      setTimeout(() => setCopied(false), 1800);
    } else {
      toast.error('Copy failed. Select the text manually.');
    }
  };

  return (
    <PremiumCard className="p-4">
      <button className="flex w-full items-start justify-between gap-3" onClick={() => setOpen((value) => !value)}>
        <p className="min-w-0 flex-1 text-left text-sm font-extrabold leading-5 text-charcoal">{item.question}</p>
        {open ? <ChevronUp size={16} className="shrink-0 text-charcoal/45" /> : <ChevronDown size={16} className="shrink-0 text-charcoal/45" />}
      </button>
      {open && (
        <div className="mt-3 space-y-3 border-t border-black/7 pt-3">
          <p className="text-xs font-medium leading-5 text-charcoal/65">{item.answer}</p>
          <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-2xl bg-primary/10 px-3 py-2 text-xs font-extrabold text-primary">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>
      )}
    </PremiumCard>
  );
}

function ChecklistSection({ section }) {
  const [checked, setChecked] = useState({});
  const completed = Object.values(checked).filter(Boolean).length;
  const toggle = (index) => setChecked((previous) => ({ ...previous, [index]: !previous[index] }));

  return (
    <PremiumCard className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-charcoal">{section.category}</p>
        <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-extrabold text-charcoal/52">{completed}/{section.items.length}</span>
      </div>
      <div className="space-y-2.5">
        {section.items.map((item, index) => (
          <button key={index} onClick={() => toggle(index)} className="flex w-full items-start gap-3 rounded-2xl bg-white/76 p-3 text-left shadow-sm">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${checked[index] ? 'border-primary bg-primary' : 'border-black/12 bg-white'}`}>
              {checked[index] && <Check size={12} className="text-white" />}
            </div>
            <span className={`text-xs font-medium leading-5 ${checked[index] ? 'text-charcoal/35 line-through' : 'text-charcoal/72'}`}>{item}</span>
          </button>
        ))}
      </div>
    </PremiumCard>
  );
}

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('Questions');
  const ActiveIcon = tabIcons[activeTab] || MessageCircleQuestion;

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Interview prep</p>
              <h1 className="mt-2 text-[1.65rem] font-extrabold leading-tight text-white">Practise before the call.</h1>
              <p className="mt-2 text-sm font-medium leading-6 text-white/58">
                STAR prompts, example answers, questions to ask, and a simple readiness checklist.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <MessageCircleQuestion size={22} />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Questions</p>
              <p className="mt-1 text-xs font-bold text-white/82">{INTERVIEW_QUESTIONS.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Examples</p>
              <p className="mt-1 text-xs font-bold text-white/82">{EXAMPLE_ANSWERS.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">Method</p>
              <p className="mt-1 text-xs font-bold text-white/82">STAR</p>
            </div>
          </div>
        </div>
      </PremiumCard>

      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex min-w-max gap-2">
          {TABS.map((tab) => {
            const Icon = tabIcons[tab] || MessageCircleQuestion;
            const selected = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-xs font-extrabold transition active:scale-[0.99] ${selected ? 'bg-charcoal text-white shadow-[0_12px_26px_rgba(17,24,39,0.16)]' : 'border border-black/7 bg-white/78 text-charcoal/60 shadow-sm'}`}>
                <Icon size={14} />
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <PremiumCard className="p-4">
        <SectionHeader
          eyebrow={activeTab}
          title={activeTab === 'Questions' ? 'Common questions to practise' : activeTab === 'STAR Method' ? STAR_GUIDE.title : activeTab === 'Example Answers' ? 'Adapt examples to your own evidence' : activeTab === 'Ask Them' ? 'Questions for the interviewer' : 'Pre-interview checklist'}
          description={activeTab === 'STAR Method' ? STAR_GUIDE.description : 'Use this as a preparation aid. Keep answers truthful and specific.'}
          action={<ActiveIcon size={18} className="text-primary" />}
          className="mb-0"
        />
      </PremiumCard>

      {activeTab === 'Questions' && (
        <div className="space-y-3">
          <GuidanceNote>Tap a question to see the answer tip.</GuidanceNote>
          {INTERVIEW_QUESTIONS.map((question) => <QuestionCard key={question.id} q={question} />)}
        </div>
      )}

      {activeTab === 'STAR Method' && (
        <div className="space-y-3">
          {STAR_GUIDE.steps.map((step, index) => (
            <PremiumCard key={index} className="flex gap-4 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-xs font-extrabold text-white">{index + 1}</div>
              <div>
                <p className="text-sm font-extrabold text-charcoal">{step.label}</p>
                <p className="mt-1 text-xs font-medium leading-5 text-charcoal/58">{step.desc}</p>
              </div>
            </PremiumCard>
          ))}
          <GuidanceNote variant="success">{STAR_GUIDE.tip}</GuidanceNote>
        </div>
      )}

      {activeTab === 'Example Answers' && (
        <div className="space-y-3">
          <GuidanceNote variant="warning">Do not copy examples word-for-word. Replace them with your own evidence.</GuidanceNote>
          {EXAMPLE_ANSWERS.map((item, index) => <AnswerCard key={index} item={item} />)}
        </div>
      )}

      {activeTab === 'Ask Them' && (
        <div className="space-y-3">
          <GuidanceNote>Prepare 2–3 questions. It shows genuine interest and helps you judge the role.</GuidanceNote>
          {QUESTIONS_TO_ASK.map((question, index) => (
            <PremiumCard key={index} className="flex items-start gap-3 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xs font-extrabold text-primary">{index + 1}</span>
              <p className="text-sm font-medium leading-6 text-charcoal/75">{question}</p>
            </PremiumCard>
          ))}
        </div>
      )}

      {activeTab === 'Checklist' && (
        <div className="space-y-3">
          <GuidanceNote variant="lock">Progress is local to this screen and resets on refresh.</GuidanceNote>
          {INTERVIEW_CHECKLIST.map((section, index) => <ChecklistSection key={index} section={section} />)}
        </div>
      )}
    </AppShell>
  );
}
