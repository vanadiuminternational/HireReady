import { getRegion } from '../regions';
import { getCategory } from '../categories';

const STAGE_LABELS = {
  student: 'Student',
  graduate: 'Graduate',
  early: 'Early career',
  professional: 'Professional',
  senior: 'Senior',
  executive: 'Executive',
  changer: 'Career changer',
};

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

export function buildCvRecommendation({
  regionId = 'uk-ireland',
  categoryId = 'professional',
  careerStage = 'professional',
  targetRole = '',
} = {}) {
  const region = getRegion(regionId);
  const category = getCategory(categoryId);
  const stageLabel = STAGE_LABELS[careerStage] || careerStage || 'Professional';

  const recommendedMode = `${region.label} ${category.label} ${region.documentName}`;
  const sectionOrder = unique(category.sectionOrder);
  const requiredSections = unique(category.requiredSections);
  const optionalSections = unique(category.optionalSections);

  const visibleFields = {
    photo: ['common', 'often-expected', 'optional-common', 'optional'].includes(region.photo),
    dateOfBirth: ['common', 'optional'].includes(region.personalInfo.dateOfBirth),
    nationality: ['common', 'optional'].includes(region.personalInfo.nationality),
    maritalStatus: ['common', 'optional'].includes(region.personalInfo.maritalStatus),
    visaStatus: ['common', 'useful-if-relevant', 'only-if-relevant'].includes(region.personalInfo.visaStatus),
    fullAddress: ['common', 'optional'].includes(region.personalInfo.fullAddress),
    portfolio: ['tech', 'creative'].includes(category.id),
    publications: category.id === 'academic',
    licenses: category.id === 'healthcare',
    availability: category.id === 'trades-hospitality-retail',
  };

  const avoid = [];
  if (region.photo === 'never' || region.photo === 'discouraged') avoid.push('photo');
  if (['never', 'discouraged'].includes(region.personalInfo.dateOfBirth)) avoid.push('date of birth');
  if (['never', 'discouraged'].includes(region.personalInfo.maritalStatus)) avoid.push('marital status');
  if (['never', 'discouraged'].includes(region.personalInfo.nationality)) avoid.push('nationality unless required');

  const explanation = [
    `${region.label} rules shape the document name, length, personal-information fields, spelling, and export expectations.`,
    `${category.label} rules shape the section order, emphasis, and template style.`,
    `${stageLabel} stage influences how strongly the CV should emphasise education, experience, leadership, or transferable skills.`,
  ];

  if (targetRole) {
    explanation.push(`Target role context: ${targetRole}. The builder should keep the CV focused on this role while avoiding unsupported claims.`);
  }

  return {
    recommendedMode,
    region,
    category,
    careerStage,
    stageLabel,
    sectionOrder,
    requiredSections,
    optionalSections,
    visibleFields,
    avoid,
    templateRecommendation: category.templateRecommendation,
    warnings: unique([...(region.warnings || []), ...(category.commonMistakes || [])]),
    notes: unique([...(region.notes || []), `Recommended tone: ${category.recommendedTone}.`]),
    aiOpportunities: unique(category.aiOpportunities),
    explanation,
  };
}
