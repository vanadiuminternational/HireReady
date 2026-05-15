import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { getAction, listAiActions } from '../orchestrator/actions.js';
import { getCacheStats, setCachedResult } from '../orchestrator/cache.js';
import { checkCostGuard } from '../orchestrator/costGuard.js';
import { chargeCredits, refundCredits, reserveCredits } from '../orchestrator/credits.js';
import { buildActionInputHash } from '../orchestrator/hash.js';
import { createRequestLog, getRequestLogStats, updateRequestLog } from '../orchestrator/requestLog.js';
import { planRoute } from '../orchestrator/router.js';
import { validateRecruiterXrayResult } from '../orchestrator/validator.js';
import { mockProvider } from '../providers/mockProvider.js';
import { recruiterXrayRequestSchema } from '../schemas/recruiterXray.js';
import { aiStorage } from '../storage/storageFactory.js';

export const aiRouter = Router();

aiRouter.get('/actions', (_req: Request, res: Response) => {
  res.json({ actions: listAiActions() });
});

async function getLatestRequest(requestId: string) {
  const recent = await aiStorage.getRecentRequests(25);
  return recent.find((entry) => entry.requestId === requestId) ?? recent[0] ?? null;
}

aiRouter.get('/debug/stats', async (_req: Request, res: Response) => {
  res.json({
    memoryCache: getCacheStats(),
    memoryRequests: getRequestLogStats(),
    recentRequests: await aiStorage.getRecentRequests(10),
    storage: await aiStorage.getStats(),
    scaffold: {
      liveAi: false,
      note: 'Storage-backed scaffold stats. Use authenticated observability before production live AI.',
    },
  });
});

aiRouter.post('/recruiter-xray', async (req: Request, res: Response) => {
  const started = Date.now();
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

  const inputHash = buildActionInputHash(action.actionId, cvText, jobDescription);
  const requestLog = createRequestLog(action.actionId, inputHash);
  await aiStorage.createRequest({ ...requestLog });
  const routePlan = planRoute(action);
  updateRequestLog(requestLog.requestId, {
    routeProvider: routePlan.provider,
    modelTier: routePlan.modelTier,
  });
  await aiStorage.updateRequest(requestLog.requestId, {
    routeProvider: routePlan.provider,
    modelTier: routePlan.modelTier,
  });

  const cached = action.cacheable ? await aiStorage.getCacheEntry(inputHash) : null;
  if (cached) {
    updateRequestLog(requestLog.requestId, {
      status: 'cache_hit',
      cacheHit: true,
      creditsReserved: 0,
      creditsCharged: 0,
      latencyMs: Date.now() - started,
    });
    await aiStorage.updateRequest(requestLog.requestId, {
      status: 'cache_hit',
      cacheHit: true,
      creditsReserved: 0,
      creditsCharged: 0,
      latencyMs: Date.now() - started,
    });

    res.json({
      action: {
        actionId: action.actionId,
        label: action.label,
        credits: 0,
        originalCredits: action.creditCost,
      },
      route: routePlan,
      credits: {
        reservationId: `cache_${requestLog.requestId}`,
        creditsReserved: 0,
        status: 'charged',
        note: 'Cache hit. No simulated credits charged in scaffold.',
      },
      result: cached.result,
      provider: {
        id: 'cache',
        model: 'storage-backed-cache',
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cachedInputTokens: 0,
          estimatedCostCents: 0,
        },
        latencyMs: Date.now() - started,
      },
      cache: {
        hit: true,
        inputHash,
        createdAt: cached.createdAt,
        hits: cached.hits,
        source: 'selected-storage-driver',
      },
      request: await getLatestRequest(requestLog.requestId),
      scaffold: {
        liveAi: false,
        note: 'Returned from selected storage driver cache. No live AI provider was called.',
      },
    });
    return;
  }

  const reservation = reserveCredits(action.actionId, action.creditCost);
  updateRequestLog(requestLog.requestId, {
    status: 'provider_called',
    cacheHit: false,
    creditsReserved: reservation.creditsReserved,
  });
  await aiStorage.updateRequest(requestLog.requestId, {
    status: 'provider_called',
    cacheHit: false,
    creditsReserved: reservation.creditsReserved,
  });
  await aiStorage.recordCreditEvent({
    eventId: `${reservation.reservationId}_reserved`,
    requestId: requestLog.requestId,
    actionId: action.actionId,
    type: 'reserved',
    credits: reservation.creditsReserved,
    createdAt: new Date().toISOString(),
  });

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
      updateRequestLog(requestLog.requestId, {
        status: 'refunded',
        creditsCharged: 0,
        errorType: 'validation_failed',
        latencyMs: Date.now() - started,
      });
      await aiStorage.updateRequest(requestLog.requestId, {
        status: 'refunded',
        creditsCharged: 0,
        errorType: 'validation_failed',
        latencyMs: Date.now() - started,
      });
      await aiStorage.recordCreditEvent({
        eventId: `${reservation.reservationId}_refunded`,
        requestId: requestLog.requestId,
        actionId: action.actionId,
        type: 'refunded',
        credits: refunded.creditsReserved,
        createdAt: new Date().toISOString(),
      });
      res.status(502).json({
        error: 'AI response failed validation.',
        validationError: validation.reason,
        credits: refunded,
      });
      return;
    }

    updateRequestLog(requestLog.requestId, { status: 'validated' });
    await aiStorage.updateRequest(requestLog.requestId, { status: 'validated' });
    const cachedResult = action.cacheable
      ? setCachedResult({ inputHash, actionId: action.actionId, result: validation.result })
      : null;
    if (cachedResult) {
      await aiStorage.setCacheEntry({ ...cachedResult });
    }
    await aiStorage.saveResult({
      resultId: `result_${requestLog.requestId}`,
      requestId: requestLog.requestId,
      actionId: action.actionId,
      inputHash,
      resultJson: validation.result,
      resultSummary: validation.result.verdict,
      createdAt: new Date().toISOString(),
    });
    const charged = chargeCredits(reservation);
    updateRequestLog(requestLog.requestId, {
      status: 'charged',
      creditsCharged: charged.creditsReserved,
      latencyMs: Date.now() - started,
    });
    await aiStorage.updateRequest(requestLog.requestId, {
      status: 'charged',
      creditsCharged: charged.creditsReserved,
      latencyMs: Date.now() - started,
    });
    await aiStorage.recordCreditEvent({
      eventId: `${reservation.reservationId}_charged`,
      requestId: requestLog.requestId,
      actionId: action.actionId,
      type: 'charged',
      credits: charged.creditsReserved,
      createdAt: new Date().toISOString(),
    });

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
      cache: {
        hit: false,
        inputHash,
        stored: Boolean(cachedResult),
        source: 'selected-storage-driver',
      },
      request: await getLatestRequest(requestLog.requestId),
      scaffold: {
        liveAi: false,
        note: 'Mock provider only. No live AI provider was called.',
      },
    });
  } catch (error) {
    const refunded = refundCredits(reservation);
    updateRequestLog(requestLog.requestId, {
      status: 'failed',
      creditsCharged: 0,
      errorType: error instanceof Error ? error.name : 'unknown_error',
      latencyMs: Date.now() - started,
    });
    await aiStorage.updateRequest(requestLog.requestId, {
      status: 'failed',
      creditsCharged: 0,
      errorType: error instanceof Error ? error.name : 'unknown_error',
      latencyMs: Date.now() - started,
    });
    await aiStorage.recordCreditEvent({
      eventId: `${reservation.reservationId}_refunded`,
      requestId: requestLog.requestId,
      actionId: action.actionId,
      type: 'refunded',
      credits: refunded.creditsReserved,
      createdAt: new Date().toISOString(),
    });
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Recruiter X-Ray failed.',
      credits: refunded,
    });
  }
});

aiRouter.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: 'Invalid request.', details: err.issues });
    return;
  }

  res.status(500).json({ error: 'Unexpected AI route error.' });
});
