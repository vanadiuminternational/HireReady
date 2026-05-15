import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  GraduationCap,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import AppShell from '@/components/app/AppShell';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import StepProgress from '@/components/app/StepProgress';
import SmartBadge from '@/components/app/SmartBadge';
import { CATEGORY_OPTIONS } from '@/engine/categories';
import { REGION_OPTIONS } from '@/engine/regions';
import { getStoredSmartStart, saveSmartStart } from '@/lib/smartStartStorage';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;

const careerStages = [
  { id: 'student', label: 'Student', detail: 'Coursework, projects, part-time work' },
  { id: 'graduate', label: 'Graduate', detail: 'First full-time role or graduate scheme' },
  { id: 'early', label: 'Early career', detail: 'Building proof across your first roles' },
  { id: 'professional', label: 'Professional', detail: 'Clear recent experience and achievements' },
  { id: 'senior', label: 'Senior', detail: 'Leadership, ownership, and specialist depth' },
  { id: 'executive', label: 'Executive', detail: 'Strategic impact and scale' },
  { id: 'changer', label: 'Career changer', detail: 'Transferable skills and a clear move' },
];

function ChoiceCard({ selected, title, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-16 w-full items-start gap-3 rounded-3xl border p-4 text-left transition active:scale-[0.99]',
        selected
          ? 'border-primary/40 bg-primary/10 shadow-[0_14px_30px_rgba(21,128,107,0.12)]'
          : 'border-black/10 bg-white/75 shadow-sm',
      )}
    >
      <span className={cn(
        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
        selected ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white text-transparent',
      )}>
        <Check size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-charcoal">{title}</span>
        {detail && <span className="mt-1 block text-xs leading-5 text-charcoal/60">{detail}</span>}
      </span>
    </button>
  );
}

function FieldLabel({ icon: Icon, title, hint }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-xl font-bold leading-tight text-charcoal">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-charcoal/60">{hint}</p>
      </div>
    </div>
  );
}

export default function SmartStart() {
  const navigate = useNavigate();
  const initialValues = useMemo(() => getStoredSmartStart(), []);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState(initialValues);

  const setValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const canContinue = step !== 1 || values.targetRole.trim().length > 1;

  const next = () => {
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    saveSmartStart(values);
    navigate('/recommendation');
  };

  const back = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/');
  };

  return (
    <AppShell withBottomNav={false} contentClassName="min-h-screen space-y-5 pb-8">
      <AppHeader
        eyebrow="Smart Start"
        title="Answer four questions. Get the right CV plan."
        description="No account, no backend, and no AI call. HireReady uses local CV rules first."
        backTo="/"
        action={<SmartBadge icon={Sparkles}>Local guidance</SmartBadge>}
      />

      <StepProgress current={step} total={TOTAL_STEPS} />

      <PremiumCard className="space-y-5">
        {step === 1 && (
          <div>
            <FieldLabel
              icon={BriefcaseBusiness}
              title="What are you applying for?"
              hint="A target role helps the recommendation stay specific without inventing experience."
            />
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-charcoal/50">
                  Target role
                </label>
                <input
                  value={values.targetRole}
                  onChange={(event) => setValue('targetRole', event.target.value)}
                  placeholder="Example: Junior data analyst"
                  className="min-h-[52px] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base font-semibold text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className="block text-xs font-bold uppercase tracking-[0.14em] text-charcoal/50">
                    Job description
                  </label>
                  <button
                    type="button"
                    onClick={() => setValue('jobDescription', '')}
                    className="text-xs font-bold text-primary"
                  >
                    I'll add this later
                  </button>
                </div>
                <textarea
                  value={values.jobDescription}
                  onChange={(event) => setValue('jobDescription', event.target.value)}
                  placeholder="Optional. Paste a job post if you have one."
                  rows={6}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <FieldLabel
              icon={MapPin}
              title="Where are you applying?"
              hint="Different markets expect different document names, personal details, and warning signs."
            />
            <div className="space-y-2.5">
              {REGION_OPTIONS.map((region) => (
                <ChoiceCard
                  key={region.id}
                  selected={values.regionId === region.id}
                  title={region.label}
                  detail={`${region.documentName} guidance`}
                  onClick={() => setValue('regionId', region.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <FieldLabel
              icon={GraduationCap}
              title="What kind of CV do you need?"
              hint="The app adjusts the section order and emphasis around the CV category."
            />
            <div className="space-y-2.5">
              {CATEGORY_OPTIONS.map((category) => (
                <ChoiceCard
                  key={category.id}
                  selected={values.categoryId === category.id}
                  title={category.label}
                  detail={category.bestFor}
                  onClick={() => setValue('categoryId', category.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <FieldLabel
              icon={UserRound}
              title="What career stage are you in?"
              hint="This changes how strongly the plan should emphasise education, experience, leadership, or transferable skills."
            />
            <div className="space-y-2.5">
              {careerStages.map((stage) => (
                <ChoiceCard
                  key={stage.id}
                  selected={values.careerStage === stage.id}
                  title={stage.label}
                  detail={stage.detail}
                  onClick={() => setValue('careerStage', stage.id)}
                />
              ))}
            </div>
          </div>
        )}
      </PremiumCard>

      <div className="grid grid-cols-[auto,1fr] gap-3 pb-3">
        <SecondaryAction onClick={back} icon={ChevronLeft} className="px-4">
          Back
        </SecondaryAction>
        <PrimaryAction onClick={next} disabled={!canContinue} icon={ArrowRight}>
          {step === TOTAL_STEPS ? 'Show my recommended CV' : 'Continue'}
        </PrimaryAction>
      </div>
    </AppShell>
  );
}
