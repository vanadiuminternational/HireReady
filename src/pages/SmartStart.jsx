import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronLeft,
  Code2,
  Crown,
  GraduationCap,
  HeartPulse,
  MapPin,
  Palette,
  Route,
  Sparkles,
  Store,
  UserRound,
} from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import AppShell from '@/components/app/AppShell';
import ChoiceCard from '@/components/app/ChoiceCard';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import StepProgress from '@/components/app/StepProgress';
import SmartBadge from '@/components/app/SmartBadge';
import { CATEGORY_OPTIONS } from '@/engine/categories';
import { REGION_OPTIONS } from '@/engine/regions';
import { PRIVACY_CONFIG } from '@/config/privacyConfig';
import { getStoredSmartStart, saveSmartStart } from '@/lib/smartStartStorage';

const TOTAL_STEPS = 4;

const careerStages = [
  { id: 'student', label: 'Student', detail: 'Study, projects, part-time work' },
  { id: 'graduate', label: 'Graduate', detail: 'First full-time role' },
  { id: 'early', label: 'Early career', detail: 'Building proof' },
  { id: 'professional', label: 'Professional', detail: 'Recent experience' },
  { id: 'senior', label: 'Senior', detail: 'Leadership and depth' },
  { id: 'executive', label: 'Executive', detail: 'Strategy and scale' },
  { id: 'changer', label: 'Career changer', detail: 'Transferable value' },
];

const categoryMeta = {
  'student-graduate': { icon: GraduationCap, detail: 'Education first' },
  professional: { icon: BriefcaseBusiness, detail: 'Balanced CV' },
  tech: { icon: Code2, detail: 'Skills and proof' },
  creative: { icon: Palette, detail: 'Portfolio-led' },
  healthcare: { icon: HeartPulse, detail: 'Clinical clarity' },
  'trades-hospitality-retail': { icon: Store, detail: 'Practical evidence' },
  executive: { icon: Crown, detail: 'Impact and scale' },
  academic: { icon: BookOpen, detail: 'Research record' },
  'career-changer': { icon: Route, detail: 'Transferable skills' },
};

function StepCard({ step, values, setValue }) {
  if (step === 1) {
    return (
      <PremiumCard className="space-y-4 p-4">
        <SectionHeader
          eyebrow="Target"
          title="What role should this CV win?"
          description="Use the role title. Add the job post only if you have it."
          action={<BriefcaseBusiness size={18} className="text-primary" />}
        />

        <div className="space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/45">
              Target role
            </label>
            <input
              value={values.targetRole}
              onChange={(event) => setValue('targetRole', event.target.value)}
              placeholder="Junior data analyst"
              className="min-h-[54px] w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-base font-bold text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/45">
                Job description
              </label>
              <button
                type="button"
                onClick={() => setValue('jobDescription', '')}
                className="text-xs font-bold text-primary"
              >
                Add later
              </button>
            </div>
            <textarea
              value={values.jobDescription}
              onChange={(event) => setValue('jobDescription', event.target.value)}
              placeholder="Optional. Paste the job post here."
              rows={4}
              className="w-full rounded-[1.25rem] border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-charcoal outline-none transition placeholder:text-charcoal/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <GuidanceNote variant="lock">{PRIVACY_CONFIG.privacyCopy.smartStart}</GuidanceNote>
      </PremiumCard>
    );
  }

  if (step === 2) {
    return (
      <PremiumCard className="space-y-4 p-4">
        <SectionHeader
          eyebrow="Market"
          title="Where will you apply?"
          description="This controls CV naming, page length, and personal-detail rules."
          action={<MapPin size={18} className="text-primary" />}
        />
        <div className="grid grid-cols-2 gap-2.5">
          {REGION_OPTIONS.map((region) => (
            <ChoiceCard
              key={region.id}
              compact
              selected={values.regionId === region.id}
              title={region.label}
              detail={region.documentName}
              icon={MapPin}
              onClick={() => setValue('regionId', region.id)}
            />
          ))}
        </div>
      </PremiumCard>
    );
  }

  if (step === 3) {
    return (
      <PremiumCard className="space-y-4 p-4">
        <SectionHeader
          eyebrow="CV type"
          title="Pick the closest path."
          description="You can still edit everything later in the builder."
          action={<GraduationCap size={18} className="text-primary" />}
        />
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_OPTIONS.map((category) => {
            const meta = categoryMeta[category.id] || { icon: BriefcaseBusiness, detail: category.bestFor };
            return (
              <ChoiceCard
                key={category.id}
                compact
                selected={values.categoryId === category.id}
                title={category.label}
                detail={meta.detail}
                icon={meta.icon}
                onClick={() => setValue('categoryId', category.id)}
              />
            );
          })}
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="space-y-4 p-4">
      <SectionHeader
        eyebrow="Stage"
        title="Where are you now?"
        description="This changes whether the CV leads with education, experience, leadership, or transition logic."
        action={<UserRound size={18} className="text-primary" />}
      />
      <div className="grid grid-cols-2 gap-2.5">
        {careerStages.map((stage) => (
          <ChoiceCard
            key={stage.id}
            compact
            selected={values.careerStage === stage.id}
            title={stage.label}
            detail={stage.detail}
            icon={UserRound}
            onClick={() => setValue('careerStage', stage.id)}
          />
        ))}
      </div>
    </PremiumCard>
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
    <AppShell withBottomNav={false} contentClassName="min-h-screen space-y-4 pb-5">
      <AppHeader
        eyebrow="Smart Start"
        title="Four answers. One clear CV plan."
        description="Fast local guidance before you write a word."
        backTo="/"
        action={<SmartBadge icon={Sparkles}>Local rules</SmartBadge>}
      />

      <StepProgress current={step} total={TOTAL_STEPS} />
      <StepCard step={step} values={values} setValue={setValue} />

      <div className="sticky bottom-3 z-20 grid grid-cols-[auto,1fr] gap-3 rounded-[1.65rem] border border-black/6 bg-[#faf7f0]/88 p-2 shadow-[0_18px_44px_rgba(55,45,30,0.12)] backdrop-blur">
        <SecondaryAction onClick={back} icon={ChevronLeft} className="px-4">
          Back
        </SecondaryAction>
        <PrimaryAction onClick={next} disabled={!canContinue} icon={ArrowRight}>
          {step === TOTAL_STEPS ? 'Show my CV plan' : 'Continue'}
        </PrimaryAction>
      </div>
    </AppShell>
  );
}
