import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  ListChecks,
  RotateCcw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import SecondaryAction from '@/components/app/SecondaryAction';
import SmartBadge from '@/components/app/SmartBadge';
import { AI_TIERS, getActionCostLabel } from '@/engine/credits';
import { planAiRequest } from '@/engine/ai-router';
import { buildCvRecommendation } from '@/engine/recommendations';
import { getStoredSmartStart } from '@/lib/smartStartStorage';

const sectionLabels = {
  profile: 'Profile',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  languages: 'Languages',
  volunteering: 'Volunteering',
  technicalSkills: 'Technical skills',
  portfolio: 'Portfolio',
  selectedProjects: 'Selected projects',
  awards: 'Awards',
  licensesCertifications: 'Licences and certifications',
  clinicalSkills: 'Clinical skills',
  training: 'Training',
  coreSkills: 'Core skills',
  certificationsTickets: 'Certifications and tickets',
  availability: 'Availability',
  executiveProfile: 'Executive profile',
  leadershipHighlights: 'Leadership highlights',
  boardAdvisory: 'Board advisory',
  publications: 'Publications',
  researchProfile: 'Research profile',
  appointments: 'Appointments',
  grants: 'Grants',
  teaching: 'Teaching',
  researchProjects: 'Research projects',
  conferences: 'Conferences',
  service: 'Service',
  transferableSkills: 'Transferable skills',
  selectedAchievements: 'Selected achievements',
};

function humanize(value) {
  if (!value) return '';
  return sectionLabels[value] || value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function InfoList({ items, icon: Icon = CheckCircle2, muted = false }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item} className="flex gap-2.5">
          <Icon size={16} className={muted ? 'mt-0.5 shrink-0 text-charcoal/50' : 'mt-0.5 shrink-0 text-primary'} />
          <p className="text-sm leading-5 text-charcoal/70">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default function Recommendation() {
  const smartStart = getStoredSmartStart();
  const recommendation = buildCvRecommendation(smartStart);
  const createdAt = smartStart.recommendationTimestamp
    ? new Date(smartStart.recommendationTimestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;

  const skeletonPlan = planAiRequest('buildSkeleton');
  const tailorPlan = planAiRequest('tailorCvToJob');
  const summaryPlan = planAiRequest('rewriteSummary');
  const aiOpportunities = recommendation.aiOpportunities.slice(0, 4).map(humanize);
  const avoidItems = [
    ...recommendation.avoid.map((item) => `Avoid ${item}.`),
    ...recommendation.warnings.slice(0, 3),
  ];

  return (
    <AppShell withBottomNav={false} contentClassName="space-y-5 pb-8">
      <AppHeader
        eyebrow="Recommendation"
        title="Your best starting CV path is ready."
        description="This is a local rules recommendation. AI actions are planned for later credit-backed backend work."
        backTo="/smart-start"
        action={<CreditPill>{AI_TIERS.rule.label}</CreditPill>}
      />

      <PremiumCard tone="dark" className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.35),transparent_15rem)] p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Recommended CV mode</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">
                {recommendation.recommendedMode}
              </h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <FileText size={22} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/60">Target</p>
              <p className="mt-1 truncate text-sm font-bold text-white">{smartStart.targetRole || 'General role'}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/60">Stage</p>
              <p className="mt-1 truncate text-sm font-bold text-white">{recommendation.stageLabel}</p>
            </div>
          </div>

          {createdAt && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/60">
              <Clock3 size={14} />
              Saved {createdAt}
            </div>
          )}
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-3">
          <SmartBadge icon={Sparkles}>Why this fits</SmartBadge>
        </div>
        <InfoList items={recommendation.explanation} />
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ListChecks size={19} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">Recommended sections</h2>
            <p className="text-xs leading-5 text-charcoal/60">Required sections are highlighted first.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendation.requiredSections.map((section) => (
            <span key={section} className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">
              {humanize(section)}
            </span>
          ))}
        </div>

        <div className="space-y-2.5">
          {recommendation.sectionOrder.map((section, index) => (
            <div key={section} className="flex items-center gap-3 rounded-2xl bg-black/5 px-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-charcoal/60">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-charcoal">{humanize(section)}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard tone="warm" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">Things to avoid</h2>
            <p className="text-xs leading-5 text-charcoal/60">These rules come from the selected region and CV category.</p>
          </div>
        </div>
        <InfoList items={avoidItems.length ? avoidItems : ['Avoid generic claims that are not supported by evidence.']} icon={AlertTriangle} muted />
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers3 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">Best starting template</h2>
            <p className="mt-1 text-sm font-bold text-primary">{humanize(recommendation.templateRecommendation)}</p>
            <p className="mt-1 text-xs leading-5 text-charcoal/60">
              Start here, then tune the content around your target role and evidence.
            </p>
          </div>
        </div>
      </PremiumCard>

      <PremiumCard tone="accent" className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary">
            <Wand2 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal">AI actions later</h2>
            <p className="mt-1 text-xs leading-5 text-charcoal/60">
              {skeletonPlan.message} Premium actions will wait for backend credit enforcement.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-2xl bg-white/75 p-3">
            <p className="text-sm font-bold text-charcoal">{getActionCostLabel('buildSkeleton')}</p>
            <p className="mt-1 text-xs leading-5 text-charcoal/60">{skeletonPlan.action.reason}</p>
          </div>
          <div className="rounded-2xl bg-white/75 p-3">
            <p className="text-sm font-bold text-charcoal">{getActionCostLabel('rewriteSummary')}</p>
            <p className="mt-1 text-xs leading-5 text-charcoal/60">{summaryPlan.message}</p>
          </div>
          <div className="rounded-2xl bg-white/75 p-3">
            <p className="text-sm font-bold text-charcoal">{getActionCostLabel('tailorCvToJob')}</p>
            <p className="mt-1 text-xs leading-5 text-charcoal/60">{tailorPlan.message}</p>
          </div>
        </div>

        {aiOpportunities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aiOpportunities.map((item) => (
              <span key={item} className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold text-charcoal/70">
                {item}
              </span>
            ))}
          </div>
        )}
      </PremiumCard>

      <div className="grid grid-cols-[auto,1fr] gap-3 pb-3">
        <SecondaryAction to="/smart-start" icon={RotateCcw} className="px-4">
          Change
        </SecondaryAction>
        <PrimaryAction to="/build" icon={ArrowRight}>
          Build this CV
        </PrimaryAction>
      </div>

      <Link to="/" className="block pb-2 text-center text-xs font-bold text-charcoal/50">
        Back to Home
      </Link>
    </AppShell>
  );
}
