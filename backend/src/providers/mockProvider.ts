import type { AiProvider, ProviderRequest, ProviderResponse } from './providerTypes.js';

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export const mockProvider: AiProvider = {
  id: 'mock',

  async runRecruiterXray(request: ProviderRequest): Promise<ProviderResponse> {
    const started = Date.now();
    const cvPreview = request.cvText.slice(0, 120).replace(/\s+/g, ' ').trim();
    const jobPreview = request.jobDescription.slice(0, 120).replace(/\s+/g, ' ').trim();

    return {
      provider: 'mock',
      model: 'mock-recruiter-xray-v1',
      result: {
        verdict: `Mock review: this CV appears broadly relevant, but the final version should show clearer evidence against the target job. CV sample: ${cvPreview || 'not provided'}. Job sample: ${jobPreview || 'not provided'}.`,
        fit_score: 74,
        top_concerns: [
          'Some claims may need measurable evidence.',
          'The CV should mirror the most important requirements from the job description.',
          'The opening profile should make the target role obvious within the first few lines.',
        ],
        likely_interview_questions: [
          'Can you give an example that proves your strongest claim in the CV?',
          'Which part of your experience best matches this role?',
          'What measurable result are you most proud of?',
        ],
        weakest_line: 'Responsible for various tasks and supported the team as needed.',
        rewritten_bullet: 'Coordinated weekly application-tracking activities, consolidated stakeholder updates, and improved follow-up visibility for priority tasks.',
        quick_wins: [
          'Add one measurable result to the professional summary.',
          'Move the most relevant skill group higher on the CV.',
          'Replace generic responsibility lines with action-and-result bullets.',
        ],
        risk_flags: ['generic_claims', 'missing_metrics'],
      },
      usage: {
        inputTokens: estimateTokens(request.cvText + request.jobDescription),
        outputTokens: 260,
        cachedInputTokens: 0,
        estimatedCostCents: 0,
      },
      latencyMs: Date.now() - started,
    };
  },
};
