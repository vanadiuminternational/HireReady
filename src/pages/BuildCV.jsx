import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Loader2, Zap, Wand2 } from 'lucide-react';
import { getSampleJobDescription } from '@/data/sampleJobDescriptions';
import BottomNav from '@/components/BottomNav';
import CVResult from './CVResult';
import { generateCv, generateCoverLetter, analyseJobDescription } from '@/services/cvEngineService';
import { getCVById } from '@/services/storageService';
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

const Input = ({ label, value, onChange, placeholder, type = 'text', required }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground">{label}</label>
    <select value={value || ''} onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const emptyExp = () => ({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', currentRole: false, responsibilities: '', achievements: '', tools: '', metrics: '' });
const emptyEdu = () => ({ degree: '', institution: '', location: '', startDate: '', endDate: '', modules: '', project: '' });
const emptyProject = () => ({ name: '', context: '', action: '', result: '', skills: '' });

export default function BuildCV() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [userInput, setUserInput] = useState({
    targetJobTitle: '', country: '', industry: '', experienceLevel: '',
    jobDescription: '', fullName: '', email: '', phone: '', cityCountry: '',
    linkedin: '', portfolio: '', currentRole: '', yearsExperience: '',
    topSkills: '', mainAchievement: '', careerGoal: '',
    experience: [emptyExp()], education: [emptyEdu()], projects: [emptyProject()],
    technicalSkills: '', toolsSoftware: '', softSkills: '', languages: '', certifications: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId) {
      const cv = getCVById(editId);
      if (cv?.userInput) setUserInput(cv.userInput);
    }
  }, []);

  const set = (field) => (val) => setUserInput(prev => ({ ...prev, [field]: val }));

  const updateList = (field, index, subField, value) => {
    setUserInput(prev => {
      const arr = [...(prev[field] || [])];
      arr[index] = { ...arr[index], [subField]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field, empty) => setUserInput(prev => ({ ...prev, [field]: [...(prev[field] || []), empty()] }));
  const removeItem = (field, index) => setUserInput(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : null}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${step > 1 ? 'bg-muted' : 'opacity-0 pointer-events-none'}`}>
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold text-primary">Step {step} of {STEPS.length}</p>
              <p className="text-sm font-bold text-foreground">{STEPS[step - 1].label}</p>
            </div>
            <div className="w-8" />
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-5">
        {/* Step 1: Target Role */}
        {step === 1 && (
          <>
            <Input label="Target Job Title" value={userInput.targetJobTitle} onChange={set('targetJobTitle')} placeholder="e.g. Marketing Manager" required />
            <Select label="Country / Market" value={userInput.country} onChange={set('country')} options={['Ireland','UK','EU','USA','General']} />
            <Input label="Industry" value={userInput.industry} onChange={set('industry')} placeholder="e.g. Software, Healthcare, Finance" />
            <Select label="Experience Level" value={userInput.experienceLevel} onChange={set('experienceLevel')} options={['Student','Graduate','Professional','Career Changer']} />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Job Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                <button
                  onClick={() => {
                    const sample = getSampleJobDescription(userInput.targetJobTitle, userInput.industry);
                    set('jobDescription')(sample);
                    toast.success('Sample job description added! Edit it to match your actual role.');
                  }}
                  className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 rounded-lg px-3 py-1.5 transition-opacity hover:opacity-80"
                >
                  <Wand2 size={12} /> Auto-fill
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Paste your job description for keyword matching — or tap Auto-fill to generate one based on your target role.</p>
              <textarea value={userInput.jobDescription || ''} onChange={e => set('jobDescription')(e.target.value)}
                placeholder="Paste the full job description here..." rows={5}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <>
            <Input label="Full Name" value={userInput.fullName} onChange={set('fullName')} placeholder="Jane Smith" required />
            <Input label="Email" value={userInput.email} onChange={set('email')} placeholder="jane@email.com" type="email" required />
            <Input label="Phone" value={userInput.phone} onChange={set('phone')} placeholder="+353 87 123 4567" />
            <Input label="City / Country" value={userInput.cityCountry} onChange={set('cityCountry')} placeholder="Dublin, Ireland" />
            <Input label="LinkedIn URL" value={userInput.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/janesmith" />
            <Input label="Portfolio URL (optional)" value={userInput.portfolio} onChange={set('portfolio')} placeholder="janesmith.com" />
          </>
        )}

        {/* Step 3: Summary Inputs */}
        {step === 3 && (
          <>
            <Input label="Current Role / Background" value={userInput.currentRole} onChange={set('currentRole')} placeholder="e.g. Marketing Coordinator" />
            <Input label="Years of Experience" value={userInput.yearsExperience} onChange={set('yearsExperience')} placeholder="e.g. 5" />
            <Input label="Top 3 Skills (comma-separated)" value={userInput.topSkills} onChange={set('topSkills')} placeholder="e.g. Project Management, Data Analysis, Communication" />
            <Textarea label="Main Achievement" value={userInput.mainAchievement} onChange={set('mainAchievement')} placeholder="e.g. Led a team that reduced operational costs by 20% through process improvements." />
            <Input label="Career Goal" value={userInput.careerGoal} onChange={set('careerGoal')} placeholder="e.g. To grow into a senior marketing role in the tech sector" />
          </>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
          <>
            {(userInput.experience || []).map((exp, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-foreground">Role {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('experience', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Job Title" value={exp.jobTitle} onChange={v => updateList('experience', i, 'jobTitle', v)} placeholder="Marketing Manager" />
                <Input label="Company" value={exp.company} onChange={v => updateList('experience', i, 'company', v)} placeholder="Acme Ltd" />
                <Input label="Location" value={exp.location} onChange={v => updateList('experience', i, 'location', v)} placeholder="Dublin, Ireland" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start Date" value={exp.startDate} onChange={v => updateList('experience', i, 'startDate', v)} placeholder="Jan 2022" />
                  <Input label="End Date" value={exp.endDate} onChange={v => updateList('experience', i, 'endDate', v)} placeholder="Dec 2024" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={exp.currentRole} onChange={e => updateList('experience', i, 'currentRole', e.target.checked)} className="rounded" />
                  <span className="text-xs text-foreground">This is my current role</span>
                </div>
                <Textarea label="Responsibilities (one per line)" value={exp.responsibilities} onChange={v => updateList('experience', i, 'responsibilities', v)} placeholder="Managed social media accounts..." rows={3} />
                <Textarea label="Achievements (one per line)" value={exp.achievements} onChange={v => updateList('experience', i, 'achievements', v)} placeholder="Increased engagement by 40%..." rows={3} />
                <Input label="Tools Used" value={exp.tools} onChange={v => updateList('experience', i, 'tools', v)} placeholder="Excel, HubSpot, Slack" />
                <Input label="Metrics / Results" value={exp.metrics} onChange={v => updateList('experience', i, 'metrics', v)} placeholder="50% increase in leads, €100k budget managed" />
              </div>
            ))}
            <button onClick={() => addItem('experience', emptyExp)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl py-4 text-sm font-medium text-muted-foreground">
              <Plus size={16} /> Add Another Role
            </button>
          </>
        )}

        {/* Step 5: Education */}
        {step === 5 && (
          <>
            {(userInput.education || []).map((edu, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-foreground">Education {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('education', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Degree / Course" value={edu.degree} onChange={v => updateList('education', i, 'degree', v)} placeholder="BSc Computer Science" />
                <Input label="Institution" value={edu.institution} onChange={v => updateList('education', i, 'institution', v)} placeholder="University College Dublin" />
                <Input label="Location" value={edu.location} onChange={v => updateList('education', i, 'location', v)} placeholder="Dublin, Ireland" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Start Date" value={edu.startDate} onChange={v => updateList('education', i, 'startDate', v)} placeholder="Sep 2019" />
                  <Input label="End Date" value={edu.endDate} onChange={v => updateList('education', i, 'endDate', v)} placeholder="May 2023" />
                </div>
                <Input label="Key Modules / Projects" value={edu.modules} onChange={v => updateList('education', i, 'modules', v)} placeholder="Data Structures, Machine Learning, UX Design" />
                <Input label="Dissertation / Final Project (optional)" value={edu.project} onChange={v => updateList('education', i, 'project', v)} placeholder="Analysis of renewable energy policy in Ireland" />
              </div>
            ))}
            <button onClick={() => addItem('education', emptyEdu)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl py-4 text-sm font-medium text-muted-foreground">
              <Plus size={16} /> Add Another Qualification
            </button>
          </>
        )}

        {/* Step 6: Skills */}
        {step === 6 && (
          <>
            <Textarea label="Technical Skills" value={userInput.technicalSkills} onChange={set('technicalSkills')} placeholder="Python, SQL, Excel, Power BI, React..." rows={2} />
            <Textarea label="Tools & Software" value={userInput.toolsSoftware} onChange={set('toolsSoftware')} placeholder="Salesforce, HubSpot, Jira, Slack, Figma..." rows={2} />
            <Textarea label="Soft Skills" value={userInput.softSkills} onChange={set('softSkills')} placeholder="Communication, Leadership, Problem-solving..." rows={2} />
            <Input label="Languages" value={userInput.languages} onChange={set('languages')} placeholder="English (Native), French (B2), Spanish (Conversational)" />
            <Textarea label="Certifications" value={userInput.certifications} onChange={set('certifications')} placeholder="Google Analytics Certified, AWS Cloud Practitioner..." rows={2} />
          </>
        )}

        {/* Step 7: Projects */}
        {step === 7 && (
          <>
            {(userInput.projects || []).map((proj, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-foreground">Project {i + 1}</p>
                  {i > 0 && <button onClick={() => removeItem('projects', i)} className="text-red-400"><Trash2 size={15} /></button>}
                </div>
                <Input label="Project Name" value={proj.name} onChange={v => updateList('projects', i, 'name', v)} placeholder="Customer Churn Prediction Model" />
                <Input label="Context" value={proj.context} onChange={v => updateList('projects', i, 'context', v)} placeholder="Final year university project / Work initiative" />
                <Textarea label="Action Taken" value={proj.action} onChange={v => updateList('projects', i, 'action', v)} placeholder="Built a machine learning model to predict customer churn using Python and scikit-learn" rows={2} />
                <Input label="Result / Impact" value={proj.result} onChange={v => updateList('projects', i, 'result', v)} placeholder="Achieved 87% prediction accuracy, reducing churn by 15%" />
                <Input label="Skills Demonstrated" value={proj.skills} onChange={v => updateList('projects', i, 'skills', v)} placeholder="Python, Machine Learning, Data Analysis" />
              </div>
            ))}
            <button onClick={() => addItem('projects', emptyProject)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl py-4 text-sm font-medium text-muted-foreground">
              <Plus size={16} /> Add Another Project
            </button>
          </>
        )}

        {/* Step 8: Generate */}
        {step === 8 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
              <h2 className="font-bold text-foreground">Ready to Generate</h2>
              <div className="space-y-2">
                {[
                  ['Target Role', userInput.targetJobTitle || '—'],
                  ['Experience Level', userInput.experienceLevel || '—'],
                  ['Industry', userInput.industry || '—'],
                  ['Name', userInput.fullName || '—'],
                  ['Experience Entries', (userInput.experience || []).filter(e => e.jobTitle).length],
                  ['Education Entries', (userInput.education || []).filter(e => e.degree).length],
                  ['Job Description', userInput.jobDescription ? '✅ Provided (keyword matching enabled)' : '—'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground text-right max-w-[60%] truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={generating}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold rounded-2xl py-5 text-base shadow-lg shadow-primary/20 disabled:opacity-60">
              {generating ? <><Loader2 size={20} className="animate-spin" /> Generating your CV...</> : <><Zap size={20} fill="currentColor" /> Generate My CV</>}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Your CV will be generated based on your inputs using ATS-safe formatting. No data is sent to any server.
            </p>
          </div>
        )}

        {/* Nav Buttons */}
        {step < 8 && (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-2xl py-4 text-sm mt-4">
            Continue <ChevronRight size={16} />
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}