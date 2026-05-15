import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import AppHeader from '@/components/app/AppHeader';
import AppShell from '@/components/app/AppShell';
import CreditPill from '@/components/app/CreditPill';
import GuidanceNote from '@/components/app/GuidanceNote';
import PremiumCard from '@/components/app/PremiumCard';
import PrimaryAction from '@/components/app/PrimaryAction';
import RecommendationCard from '@/components/app/RecommendationCard';
import SecondaryAction from '@/components/app/SecondaryAction';
import SectionHeader from '@/components/app/SectionHeader';
import { getActionCostLabel } from '@/engine/credits';
import { planAiRequest } from '@/engine/ai-router';
import { buildCvRecommendation } from '@/engine/recommendations';
import { MONETIZATION_CONFIG } from '@/config/monetizationConfig';
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
  licensesCertifications: 'Licences',
  clinicalSkills: 'Clinical skills',
  training: 'Training',
  coreSkills: 'Core skills',
  certificationsTickets: 'Tickets',
  availability: 'Availability',
  executiveProfile: 'Executive profile',
  leadershipHighlights: 'Leadership',
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
  selectedAchievements: 'Achievements',
};

function humanize(value) {
  if (!value) return '';
  return sectionLabels[value] || value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function EvidenceRow({ children, icon: Icon = CheckCircle2 }) {
  return (
    <div className="flex gap-2.5 rounded-2xl bg-white/68 px-3.5 py-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-primary" />
      <p className="text-sm font-medium leading-5 text-charcoal/72">{children}</p>
    </div>
  );
}

export default function Recommendation() {
  const smartStart = getStoredSmartStart();
  const recommendation = buildCvRecommendation(smartStart);
  const skeletonPlan = planAiRequest('buildSkeleton');
  const avoidItems = [
    ...recommendation.avoid.map((item) => `Avoid ${item}.`),
    ...recommendation.warnings,
  ].slice(0, 3);
  const requiredSet = new Set(recommendation.requiredSections);
  const sectionOrder = recommendation.sectionOrder.slice(0, 10);
  const aiOpportunities = recommendation.aiOpportunities.slice(0, 3).map(humanize);

  return (
    <AppShell withBottomNav={false} contentClassName="space-y-4 pb-5">
      <AppHeader
        eyebrow="Recommendation"
        title="This is the CV path to start with."
        description="A focused local recommendation based on your answers."
        backTo="/smart-start"
        action={<CreditPill>{MONETIZATION_CONFIG.uiCopy.ruleOnly}</CreditPill>}
      />

      <RecommendationCard
        mode={recommendation.recommendedMode}
        targetRole={smartStart.targetRole}
        region={recommendation.region.label}
        stage={recommendation.stageLabel}
        template={humanize(recommendation.templateRecommendation)}
      />

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Why"
          title="Why this fits"
          description="The engine matched your market, CV type, and stage."
          action={<Sparkles size={18} className="text-primary" />}
          className="mb-0"
        />
        <div className="space-y-2.5">
          {recommendation.explanation.slice(0, 3).map((item) => (
            <EvidenceRow key={item}>{item}</EvidenceRow>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Structure"
          title="Recommended sections"
          description="Dark chips are required for this CV path."
          action={<Layers3 size={18} className="text-primary" />}
          className="mb-0"
        />

        <div className="grid grid-cols-2 gap-2">
          {sectionOrder.map((section, index) => {
            const required = requiredSet.has(section);
            return (
              <div
                key={section}
                className={`flex min-h-12 items-center gap-2 rounded-2xl px-3 py-2.5 ${
                  required ? 'bg-charcoal text-white' : 'bg-black/5 text-charcoal'
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                  required ? 'bg-white text-charcoal' : 'bg-white text-charcoal/55'
                }`}>
                  {index + 1}
                </span>
                <span className="min-w-0 truncate text-xs font-bold">{humanize(section)}</span>
              </div>
            );
          })}
        </div>
      </PremiumCard>

      <PremiumCard tone="warm" className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Watch outs"
          title="Keep it safe for this market"
          description="Helpful guardrails, not blockers."
          action={<ShieldCheck size={18} className="text-primary" />}
          className="mb-0"
        />
        <div className="space-y-2.5">
          {(avoidItems.length ? avoidItems : ['Avoid generic claims that are not supported by evidence.']).map((item) => (
            <GuidanceNote key={item} variant="warning">
              {item}
            </GuidanceNote>
          ))}
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Template"
          title={humanize(recommendation.templateRecommendation)}
          description="The best visual starting point for this path."
          action={<Lightbulb size={18} className="text-primary" />}
          className="mb-0"
        />
        <GuidanceNote variant="success">
          Start with this structure, then tune details inside Build CV.
        </GuidanceNote>
      </PremiumCard>

      <PremiumCard tone="accent" className="space-y-3 p-4">
        <SectionHeader
          eyebrow="Later"
          title="AI opportunities"
          description={MONETIZATION_CONFIG.uiCopy.backendRequired}
          action={<Wand2 size={18} className="text-primary" />}
          className="mb-0"
        />
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/78 px-3 py-1.5 text-xs font-bold text-charcoal">
            {getActionCostLabel('buildSkeleton')}
          </span>
          {aiOpportunities.map((item) => (
            <span key={item} className="rounded-full bg-white/78 px-3 py-1.5 text-xs font-bold text-charcoal/68">
              {item}
            </span>
          ))}
        </div>
        <GuidanceNote variant="lock">{skeletonPlan.message}</GuidanceNote>
      </PremiumCard>

      <div className="sticky bottom-3 z-20 grid grid-cols-[auto,1fr] gap-3 rounded-[1.65rem] border border-black/6 bg-[#faf7f0]/88 p-2 shadow-[0_18px_44px_rgba(55,45,30,0.12)] backdrop-blur">
        <SecondaryAction to="/smart-start" icon={RotateCcw} className="px-4">
          Change
        </SecondaryAction>
        <PrimaryAction to="/build" icon={ArrowRight}>
          Build this CV
        </PrimaryAction>
      </div>
    </AppShell>
  );
}
