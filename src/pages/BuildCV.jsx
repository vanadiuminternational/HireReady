import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Wand2,
  Zap,
} from 'lucide-react';
import { getSampleJobDescription } from '@/data/sampleJobDescriptions';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import CVResult from './CVResult';
import { generateCv, generateCoverLetter, analyseJobDescription } from '@/services/cvEngineService';
import { getCVById } from '@/services/storageService';
import { buildCvRecommendation } from '@/engine/recommendations';
import { getStoredSmartStart } from '@/lib/smartStartStorage';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, label: 'Target Role' },
  { id: 2, label: 'Personal Details' },
  { id: 3, label: 'Summary' },
  { id: 4, label: 'Experience' },
  { id: 5, label: 'Education' },
  { id: 6, label: 'Skills' },
  { id: 7, label: 'Projects' },
  { id: 8, label: 'Generate' },
];

const stageToExperience = {
  student: 'Student',
  graduate: 'Graduate',
  early: 'Professional',
  professional: 'Professional',
  senior: 'Professional',
  executive: 'Professional',
  changer: 'Career Changer',
};

const marketLabels = {
  'uk-ireland': 'Ireland',
  us: 'USA',
  'germany-dach': 'EU',
  france: 'EU',
  'netherlands-scandinavia': 'EU',
  europass: 'EU',
  'uae-gcc': 'General',
  'australia-nz': 'General',
};

const sectionLabels = {
  profile: 'Profile',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  languages: 'Languages',
  technicalSkills: 'Technical skills',
  portfolio: 'Portfolio',
  licensesCertifications: 'Licences',
  clinicalSkills: 'Clinical skills',
  coreSkills: 'Core skills',
  executiveProfile: 'Executive profile',
  leadershipHighlights: 'Leadership',
  publications: 'Publications',
  researchProfile: 'Research profile',
  transferableSkills: 'Transferable skills',
};

function humanize(value) {
  if (!value) return '';
  return sectionLabels[value] || value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const Input = ({ label, value, onChange, placeholder, type = 'text', required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[52px] w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{label}</label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{label}</label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[52px] w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-charcoal outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
    >
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const emptyExp = () => ({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', currentRole: false, responsibilities: '', achievements: '', tools: '', metrics: '' });
const emptyEdu = () => ({ degree: '', institution: '', location: '', startDate: '', endDate: '', modules: '', project: '' });
const emptyProject = () => ({ name: '', context: '', action: '', result: '', skills: '' });

function createInitialInput(smartStart, recommendation) {
  return {
    targetJobTitle: smartStart.targetRole || '',
    country: marketLabels[smartStart.regionId] || recommendation?.region?.label || '',
    industry: recommendation?.category?.label || '',
    experienceLevel: stageToExperience[smartStart.careerStage] || 'Professional',
    jobDescription: smartStart.jobDescription || '',
    fullName: '',
    email: '',
    phone: '',
    cityCountry: '',
    linkedin: '',
    portfolio: '',
    currentRole: '',
    yearsExperience: '',
    topSkills: '',
    mainAchievement: '',
    careerGoal: '',
    experience: [emptyExp()],
    education: [emptyEdu()],
    projects: [emptyProject()],
    technicalSkills: '',
    toolsSoftware: '',
    softSkills: '',
    languages: '',
    certifications: '',
  };
}

function SmartPlanCard({ smartStart, recommendation }) {
  const hasPlan = Boolean(smartStart.targetRole || smartStart.recommendationTimestamp);
  const notes = [
    ...(recommendation.notes || []),
    ...(recommendation.warnings || []),
  ].slice(0, 3);

  if (!hasPlan) {
    return (
      <PremiumCard tone="accent" className="space-y-4 p-4">
        <SectionHeader
          eyebrow="Smarter start"
          title="Start with a CV plan first"
          description="Answer four quick questions so GradSharp can recommend the right structure before you build."
          action={<Sparkles size={18} className="text-primary" />}
          className="mb-0"
        />
        <div className="grid grid-cols-[1fr,auto] gap-3">
          <PrimaryAction to="/smart-start" icon={Sparkles}>Start Smart CV</PrimaryAction>
          <SecondaryAction onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-4">Manual</SecondaryAction>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard tone="dark" className="overflow-hidden p-0">
      <div className="bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_13rem)] p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">Your CV plan</p>
            <h2 className="mt-2 text-[1.45rem] font-extrabold leading-tight text-white">
              {recommendation.recommendedMode}
            </h2>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
            <FileText size={22} />
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            ['Role', smartStart.targetRole || 'General'],
            ['Market', recommendation.region.label],
            ['Stage', recommendation.stageLabel],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-2xl bg-white/9 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">{label}</p>
              <p className="mt-1 truncate text-xs font-bold text-white/82">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white/82">
            {humanize(recommendation.templateRecommendation)}
          </span>
          {recommendation.requiredSections.slice(0, 3).map((section) => (
            <span key={section} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/65">
              {humanize(section)}
            </span>
          ))}
        </div>

        {notes.length > 0 && (
          <div className="mb-4 space-y-2">
            {notes.map((note) => (
              <p key={note} className="rounded-2xl bg-white/9 px-3 py-2 text-xs font-medium leading-5 text-white/68">
                {note}
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <SecondaryAction to="/smart-start" icon={RotateCcw} className="bg-white/10 text-white hover:bg-white/15">
            Change plan
          </SecondaryAction>
          <SecondaryAction to="/recommendation" icon={FileText} className="bg-white text-charcoal hover:bg-white/92">
            View plan
          </SecondaryAction>
        </div>
      </div>
    </PremiumCard>
  );
}

function StepGuidance({ step, recommendation }) {
  if (step === 1) {
    return <GuidanceNote variant="success">Your target role and market guide the CV structure. You can still change anything manually.</GuidanceNote>;
  }
  if (step === 2 && recommendation.avoid.length) {
    return <GuidanceNote variant="warning">For this market, be careful with: {recommendation.avoid.slice(0, 3).join(', ')}.</GuidanceNote>;
  }
  if (step === 3) {
    return <GuidanceNote>Recommended tone: {recommendation.category.recommendedTone}.</GuidanceNote>;
  }
  if (step === 4) {
    return <GuidanceNote variant="success">Prioritise {recommendation.category.priority.slice(0, 3).map(humanize).join(', ')} in your experience examples.</GuidanceNote>;
  }
  if (step === 6) {
    return <GuidanceNote>Keep skills easy to scan. Match the role, but do not add skills you cannot evidence.</GuidanceNote>;
  }
  if (step === 8) {
    return <GuidanceNote variant="lock">Generation is local and rule-based in this phase. No CV data is sent to a server.</GuidanceNote>;
  }
  return null;
}

export default function BuildCV() {
  const smartStart = useMemo(() => getStoredSmartStart(), []);
  const recommendation = useMemo(() => buildCvRecommendation(smartStart), [smartStart]);
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [userInput, setUserInput] = useState(() => createInitialInput(smartStart, recommendation));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId) {
      const cv = getCVById(editId);
      if (cv?.userInput) setUserInput(cv.userInput);
    }
  }, []);

  const set = (field) => (val) => setUserInput((prev) => ({ ...prev, [field]: val }));

  const updateList = (field, index, subField, value) => {
    setUserInput((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = { ...arr[index], [subField]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field, empty) => setUserInput((prev) => ({ ...prev, [field]: [...(prev[field] || []), empty()] }));
  const removeItem = (field, index) => setUserInput((prev) => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));

  const handleGenerate = () => {
    if (!userInput.fullName || !userInput.email) {
      toast.error('Please fill in your name and email before generating.');
      setStep(2);
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const cv = generateCv(userInput);
      const jobAnalysis = userInput.jobDescription ? analyseJobDescription(userInput.jobDescription) : null;
      const coverLetter = generateCoverLetter(userInput, jobAnalysis);
      setResult({ ...cv, coverLetter });
      setGenerating(false);
    }, 1200);
  };

  if (result) return <CVResult result={result} userInput={userInput} onRebuild={() => setResult(null)} />;

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <AppShell contentClassName="space-y-4 pb-5">
      <PremiumCard className="sticky top-3 z-20 space-y-3 border-black/6 bg-[#faf7f0]/90 p-3 shadow-[0_18px_44px_rgba(55,45,30,0.10)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => (step > 1 ? setStep((s) => s - 1) : null)}
            className={`flex h-9 w-9 items-center justify-center rounded-2xl ${step > 1 ? 'bg-white text-charcoal shadow-sm' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Step {step} of {STEPS.length}</p>
            <p className="truncate text-sm font-extrabold text-charcoal">{STEPS[step - 1].label}</p>
          </div>
          <CreditPill>{Math.round(progress)}%</CreditPill>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/7">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </PremiumCard>

      <SmartPlanCard smartStart={smartStart} recommendation={recommendation} />
      <StepGuidance step={step} recommendation={recommendation} />

      <PremiumCard className="space-y-4 p-4">
        {step === 1 && (
          <>
            <SectionHeader
              eyebrow="Target"
              title="Confirm the role details"
              description="These fields were prefilled from Smart Start where available."
              action={<Sparkles size={18} className="text-primary" />}
              className="mb-0"
            />
            <Input label="Target Job Title" value={userInput.targetJobTitle} onChange={set('targetJobTitle')} placeholder="e.g. Marketing Manager" required />
            <Select label="Country / Market" value={userInput.country} onChange={set('country')} options={['Ireland', 'UK', 'EU', 'USA', 'General']} />
            <Input label="Industry" value={userInput.industry} onChange={set('industry')} placeholder="e.g. Software, Healthcare, Finance" />
            <Select label="Experience Level" value={userInput.experienceLevel} onChange={set('experienceLevel')} options={['Student', 'Graduate', 'Professional', 'Career Changer']} />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Job Description <span className="font-semibold normal-case tracking-normal text-charcoal/45">(optional)</span></label>
                <button
                  onClick={() => {
                    const sample = getSampleJobDescription(userInput.targetJobTitle, userInput.industry);
                    set('jobDescription')(sample);
                    toast.success('Sample job description added! Edit it to match your actual role.');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-opacity hover:opacity-80"
                >
                  <Wand2 size={12} /> Auto-fill
                </button>
              </div>
              <p className="text-xs leading-5 text-charcoal/55">Paste your job description for keyword matching, or use Auto-fill for a starting sample.</p>
              <textarea
                value={userInput.jobDescription || ''}
                onChange={(e) => set('jobDescription')(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={5}
                className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionHeader eyebrow="Identity" title="Add your contact details" description="Keep it professional and easy for recruiters to contact you." className="mb-0" />
            <Input label="Full Name" value={userInput.fullName} onChange={set('fullName')} placeholder="Jane Smith" required />
            <Input label="Email" value={userInput.email} onChange={set('email')} placeholder="jane@email.com" type="email" required />
            <Input label="Phone" value={userInput.phone} onChange={set('phone')} placeholder="+353 87 123 4567" />
            <Input label="City / Country" value={userInput.cityCountry} onChange={set('cityCountry')} placeholder="Dublin, Ireland" />
            <Input label="LinkedIn URL" value={userInput.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/janesmith" />
            <Input label="Portfolio URL (optional)" value={userInput.portfolio} onChange={set('portfolio')} placeholder="janesmith.com" />
          </>
        )}

        {step === 3 && (
          <>
            <SectionHeader eyebrow="Profile" title="Shape your professional summary" description="Give the engine honest evidence to work with." className="mb-0" />
            <Input label="Current Role / Background" value={userInput.currentRole} onChange={set('currentRole')} placeholder="e.g. Marketing Coordinator" />
            <Input label="Years of Experience" value={userInput.yearsExperience} onChange={set('yearsExperience')} placeholder="e.g. 5" />
            <Input label="Top 3 Skills (comma-separated)" value={userInput.topSkills} onChange={set('topSkills')} placeholder="e.g. Project Management, Data Analysis, Communication" />
            <Textarea label="Main Achievement" value={userInput.mainAchievement} onChange={set('mainAchievement')} placeholder="e.g. Led a team that reduced operational costs by 20% through process improvements." />
            <Input label="Career Goal" value={userInput.careerGoal} onChange={set('careerGoal')} placeholder="e.g. To grow into a senior marketing role in the tech sector" />
          </>
        )}

        {step === 4 && (
          <>
            <SectionHeader eyebrow="Experience" title="Add your work evidence" description="Use duties, achievements, tools, and metrics. Specific beats generic." className="mb-0" />
            {(userInput.experience || []).map((exp, i) => (
              <div key={i} className="space-y-4 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-charcoal">Role {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('experience', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Job Title" value={exp.jobTitle} onChange={(v) => updateList('experience', i, 'jobTitle', v)} placeholder="Marketing Manager" />
                <Input label="Company" value={exp.company} onChange={(v) => updateList('experience', i, 'company', v)} placeholder="Acme Ltd" />
                <Input label="Location" value={exp.location} onChange={(v) => updateList('experience', i, 'location', v)} placeholder="Dublin, Ireland" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start Date" value={exp.startDate} onChange={(v) => updateList('experience', i, 'startDate', v)} placeholder="Jan 2022" />
                  <Input label="End Date" value={exp.endDate} onChange={(v) => updateList('experience', i, 'endDate', v)} placeholder="Dec 2024" />
                </div>
                <label className="flex items-center gap-2 rounded-2xl bg-black/5 px-3 py-3">
                  <input type="checkbox" checked={exp.currentRole} onChange={(e) => updateList('experience', i, 'currentRole', e.target.checked)} className="rounded" />
                  <span className="text-xs font-semibold text-charcoal">This is my current role</span>
                </label>
                <Textarea label="Responsibilities (one per line)" value={exp.responsibilities} onChange={(v) => updateList('experience', i, 'responsibilities', v)} placeholder="Managed social media accounts..." rows={3} />
                <Textarea label="Achievements (one per line)" value={exp.achievements} onChange={(v) => updateList('experience', i, 'achievements', v)} placeholder="Increased engagement by 40%..." rows={3} />
                <Input label="Tools Used" value={exp.tools} onChange={(v) => updateList('experience', i, 'tools', v)} placeholder="Excel, HubSpot, Slack" />
                <Input label="Metrics / Results" value={exp.metrics} onChange={(v) => updateList('experience', i, 'metrics', v)} placeholder="50% increase in leads, €100k budget managed" />
              </div>
            ))}
            <SecondaryAction onClick={() => addItem('experience', emptyExp)} icon={Plus} className="w-full justify-center border-2 border-dashed border-black/10 bg-white/60">
              Add Another Role
            </SecondaryAction>
          </>
        )}

        {step === 5 && (
          <>
            <SectionHeader eyebrow="Education" title="Add qualifications" description="Include relevant modules, projects, and credentials where useful." className="mb-0" />
            {(userInput.education || []).map((edu, i) => (
              <div key={i} className="space-y-4 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-charcoal">Education {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('education', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Degree / Course" value={edu.degree} onChange={(v) => updateList('education', i, 'degree', v)} placeholder="BSc Computer Science" />
                <Input label="Institution" value={edu.institution} onChange={(v) => updateList('education', i, 'institution', v)} placeholder="University College Dublin" />
                <Input label="Location" value={edu.location} onChange={(v) => updateList('education', i, 'location', v)} placeholder="Dublin, Ireland" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start Date" value={edu.startDate} onChange={(v) => updateList('education', i, 'startDate', v)} placeholder="Sep 2019" />
                  <Input label="End Date" value={edu.endDate} onChange={(v) => updateList('education', i, 'endDate', v)} placeholder="May 2023" />
                </div>
                <Input label="Key Modules / Projects" value={edu.modules} onChange={(v) => updateList('education', i, 'modules', v)} placeholder="Data Structures, Machine Learning, UX Design" />
                <Input label="Dissertation / Final Project (optional)" value={edu.project} onChange={(v) => updateList('education', i, 'project', v)} placeholder="Analysis of renewable energy policy in Ireland" />
              </div>
            ))}
            <SecondaryAction onClick={() => addItem('education', emptyEdu)} icon={Plus} className="w-full justify-center border-2 border-dashed border-black/10 bg-white/60">
              Add Another Qualification
            </SecondaryAction>
          </>
        )}

        {step === 6 && (
          <>
            <SectionHeader eyebrow="Skills" title="Make your strengths scan fast" description="Group skills clearly so ATS and recruiters can find them." className="mb-0" />
            <Textarea label="Technical Skills" value={userInput.technicalSkills} onChange={set('technicalSkills')} placeholder="Python, SQL, Excel, Power BI, React..." rows={2} />
            <Textarea label="Tools & Software" value={userInput.toolsSoftware} onChange={set('toolsSoftware')} placeholder="Salesforce, HubSpot, Jira, Slack, Figma..." rows={2} />
            <Textarea label="Soft Skills" value={userInput.softSkills} onChange={set('softSkills')} placeholder="Communication, Leadership, Problem-solving..." rows={2} />
            <Input label="Languages" value={userInput.languages} onChange={set('languages')} placeholder="English (Native), French (B2), Spanish (Conversational)" />
            <Textarea label="Certifications" value={userInput.certifications} onChange={set('certifications')} placeholder="Google Analytics Certified, AWS Cloud Practitioner..." rows={2} />
          </>
        )}

        {step === 7 && (
          <>
            <SectionHeader eyebrow="Projects" title="Add project proof" description="Useful for tech, students, career changers, and portfolio-led roles." className="mb-0" />
            {(userInput.projects || []).map((proj, i) => (
              <div key={i} className="space-y-4 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-charcoal">Project {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('projects', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Project Name" value={proj.name} onChange={(v) => updateList('projects', i, 'name', v)} placeholder="Customer Churn Prediction Model" />
                <Input label="Context" value={proj.context} onChange={(v) => updateList('projects', i, 'context', v)} placeholder="Final year university project / Work initiative" />
                <Textarea label="Action Taken" value={proj.action} onChange={(v) => updateList('projects', i, 'action', v)} placeholder="Built a machine learning model to predict customer churn using Python and scikit-learn" rows={2} />
                <Input label="Result / Impact" value={proj.result} onChange={(v) => updateList('projects', i, 'result', v)} placeholder="Achieved 87% prediction accuracy, reducing churn by 15%" />
                <Input label="Skills Demonstrated" value={proj.skills} onChange={(v) => updateList('projects', i, 'skills', v)} placeholder="Python, Machine Learning, Data Analysis" />
              </div>
            ))}
            <SecondaryAction onClick={() => addItem('projects', emptyProject)} icon={Plus} className="w-full justify-center border-2 border-dashed border-black/10 bg-white/60">
              Add Another Project
            </SecondaryAction>
          </>
        )}

        {step === 8 && (
          <div className="space-y-5">
            <SectionHeader eyebrow="Generate" title="Ready to generate" description="Review the essentials, then create the CV and cover letter locally." className="mb-0" />
            <div className="space-y-2 rounded-[1.5rem] border border-black/7 bg-white/82 p-4 shadow-sm">
              {[
                ['Target Role', userInput.targetJobTitle || '—'],
                ['Experience Level', userInput.experienceLevel || '—'],
                ['Industry', userInput.industry || '—'],
                ['Name', userInput.fullName || '—'],
                ['Experience Entries', (userInput.experience || []).filter((e) => e.jobTitle).length],
                ['Education Entries', (userInput.education || []).filter((e) => e.degree).length],
                ['Job Description', userInput.jobDescription ? 'Provided' : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-3 text-sm">
                  <span className="text-charcoal/55">{label}</span>
                  <span className="max-w-[60%] truncate text-right font-bold text-charcoal">{val}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-primary py-5 text-base font-extrabold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-60"
            >
              {generating ? <><Loader2 size={20} className="animate-spin" /> Generating your CV...</> : <><Zap size={20} fill="currentColor" /> Generate My CV</>}
            </button>
          </div>
        )}
      </PremiumCard>

      {step < 8 && (
        <div className="sticky bottom-24 z-20 rounded-[1.65rem] border border-black/6 bg-[#faf7f0]/88 p-2 shadow-[0_18px_44px_rgba(55,45,30,0.12)] backdrop-blur">
          <PrimaryAction onClick={() => setStep((s) => s + 1)} icon={ChevronRight}>
            Continue
          </PrimaryAction>
        </div>
      )}
    </AppShell>
  );
}
