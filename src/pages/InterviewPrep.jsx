import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { INTERVIEW_QUESTIONS, STAR_GUIDE, EXAMPLE_ANSWERS, QUESTIONS_TO_ASK, INTERVIEW_CHECKLIST } from '@/data/interviewData';
import { toast } from 'sonner';

const TABS = ['Questions', 'STAR Method', 'Example Answers', 'Ask Them', 'Checklist'];

const CategoryBadge = ({ cat }) => {
  const colors = {
    'About You': 'bg-blue-100 text-blue-700',
    'Motivation': 'bg-purple-100 text-purple-700',
    'Behavioural': 'bg-amber-100 text-amber-700',
    'Role-Specific': 'bg-emerald-100 text-emerald-700',
    'Closing': 'bg-slate-100 text-slate-700',
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[cat] || 'bg-muted text-muted-foreground'}`}>{cat}</span>;
};

const QuestionCard = ({ q }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <button className="flex items-start justify-between w-full gap-3" onClick={() => setOpen(v => !v)}>
        <div className="text-left flex-1">
          <CategoryBadge cat={q.category} />
          <p className="text-sm font-semibold text-foreground mt-2">{q.question}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0 mt-1" />}
      </button>
      {open && <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">💡 {q.tip}</p>}
    </div>
  );
};

const AnswerCard = ({ item }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(item.answer);
    setCopied(true);
    toast.success('Answer copied!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <button className="flex items-start justify-between w-full gap-3" onClick={() => setOpen(v => !v)}>
        <p className="text-sm font-semibold text-foreground text-left flex-1">{item.question}</p>
        {open ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          <p className="text-xs text-foreground leading-relaxed">{item.answer}</p>
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-primary font-medium">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>
      )}
    </div>
  );
};

const ChecklistSection = ({ section }) => {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  return (
    <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
      <p className="text-sm font-bold text-foreground mb-3">{section.category}</p>
      <div className="space-y-2.5">
        {section.items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)} className="flex items-start gap-3 w-full text-left">
            <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${checked[i] ? 'bg-primary border-primary' : 'border-border'}`}>
              {checked[i] && <Check size={12} className="text-white" />}
            </div>
            <span className={`text-xs leading-relaxed ${checked[i] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('Questions');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-5 py-4">
          <h1 className="text-base font-bold text-foreground">Interview Prep</h1>
          <p className="text-xs text-muted-foreground">STAR method, questions, answers & checklist</p>
        </div>
        <div className="flex gap-1 px-5 pb-3 overflow-x-auto scrollbar-hide max-w-lg mx-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-3">

        {activeTab === 'Questions' && (
          <>
            <p className="text-xs text-muted-foreground mb-1">Tap a question to see the answer tip.</p>
            {INTERVIEW_QUESTIONS.map(q => <QuestionCard key={q.id} q={q} />)}
          </>
        )}

        {activeTab === 'STAR Method' && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h2 className="text-base font-bold text-foreground mb-1">{STAR_GUIDE.title}</h2>
              <p className="text-xs text-muted-foreground">{STAR_GUIDE.description}</p>
            </div>
            {STAR_GUIDE.steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 shadow-sm flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs text-amber-700 font-medium">💡 {STAR_GUIDE.tip}</p>
            </div>
          </div>
        )}

        {activeTab === 'Example Answers' && (
          <>
            <p className="text-xs text-muted-foreground mb-1">Tap to read the example answer. Adapt it to your own experience.</p>
            {EXAMPLE_ANSWERS.map((item, i) => <AnswerCard key={i} item={item} />)}
          </>
        )}

        {activeTab === 'Ask Them' && (
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-sm font-bold text-foreground">Questions to ask the interviewer</p>
              <p className="text-xs text-muted-foreground mt-1">Always prepare 2–3 questions. It shows genuine interest and initiative.</p>
            </div>
            {QUESTIONS_TO_ASK.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3 shadow-sm">
                <span className="text-xs font-bold text-primary w-5 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-foreground">{q}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Checklist' && (
          <>
            <p className="text-xs text-muted-foreground mb-1">Tap items to mark them done. Progress resets on refresh.</p>
            {INTERVIEW_CHECKLIST.map((section, i) => <ChecklistSection key={i} section={section} />)}
          </>
        )}

      </div>

      <BottomNav />
    </div>
  );
}