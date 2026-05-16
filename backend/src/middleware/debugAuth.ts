import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';

function isLocalDevelopment() {
  return config.nodeEnv !== 'production' && !config.debugStatsToken;
}

export function requireDebugStatsAccess(req: Request, res: Response, next: NextFunction) {
  if (isLocalDevelopment()) {
    next();
    return;
  }

  if (!config.debugStatsToken) {
    res.status(404).json({ error: 'Not found.' });
    return;
  }

  const headerToken = req.header('x-debug-token');
  const bearerToken = req.header('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const suppliedToken = headerToken || bearerToken;

  if (suppliedToken !== config.debugStatsToken) {
    res.status(403).json({ error: 'Debug access denied.' });
    return;
  }

  next();
}
