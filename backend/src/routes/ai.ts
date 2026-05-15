import { Router } from 'express';
import { z } from 'zod';
import { getAction, listAiActions } from '../orchestrator/actions.js';
import { checkCostGuard } from '../orchestrator/costGuard.js';
import { chargeCredits, refundCredits, reserveCredits } from '../orchestrator/credits.js';
import { planRoute } from '../orchestrator/router.js';
import { validateRecruiterXrayResult } from '../orchestrator/validator.js';
import { mockProvider } from '../providers/mockProvider.js';
import { recruiterXrayRequestSchema } from '../schemas/recruiterXray.js';

export const aiRouter = Router();

aiRouter.get('/actions', (_req, res) => {
  res.json({ actions: listAiActions() });
});

aiRouter.post('/recruiter-xray', async (req, res) => {
  const action = getAction('recruiter_xray');
  if (!action) {
    res.status(500).json({ error: 'Recruiter X-Ray action is not registered.' });
    return;
  }

  const parsed = recruiterXrayRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid request.',
      details: parsed.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
    });
    return;
  }

  const { cvText, jobDescription } = parsed.data;
  const guard = checkCostGuard({ action, cvText, jobDescription });
  if (!guard.ok) {
    res.status(400).json({
      error: guard.reason,
      inputChars: guard.inputChars,
      maxInputChars: guard.maxInputChars,
    });
    return;
  }

  const routePlan = planRoute(action);
  const reservation = reserveCredits(action.actionId, action.creditCost);

  try {
    const providerResponse = await mockProvider.runRecruiterXray({
      actionId: action.actionId,
      cvText,
      jobDescription,
      modelTier: routePlan.modelTier,
      maxOutputTokens: action.maxOutputTokens,
    });

    const validation = validateRecruiterXrayResult(providerResponse.result);
    if (!validation.ok || !validation.result) {
      const refunded = refundCredits(reservation);
      res.status(502).json({
        error: 'AI response failed validation.',
        validationError: validation.reason,
        credits: refunded,
      });
      return;
    }

    const charged = chargeCredits(reservation);
    res.json({
      action: {
        actionId: action.actionId,
        label: action.label,
        credits: action.creditCost,
      },
      route: routePlan,
      credits: charged,
      result: validation.result,
      provider: {
        id: providerResponse.provider,
        model: providerResponse.model,
        usage: providerResponse.usage,
        latencyMs: providerResponse.latencyMs,
      },
      scaffold: {
        liveAi: false,
        note: 'Mock provider only. No live AI provider was called.',
      },
    });
  } catch (error) {
    const refunded = refundCredits(reservation);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Recruiter X-Ray failed.',
      credits: refunded,
    });
  }
});

aiRouter.use((err: unknown, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: 'Invalid request.', details: err.issues });
    return;
  }

  res.status(500).json({ error: 'Unexpected AI route error.' });
});
