import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8787),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  aiLiveEnabled: process.env.AI_LIVE_ENABLED === 'true',
  aiProvider: process.env.AI_PROVIDER ?? 'mock',
  platformMonthlyCostCapCents: Number(process.env.PLATFORM_MONTHLY_COST_CAP_CENTS ?? 2500),
  storageDriver: process.env.STORAGE_DRIVER ?? 'memory',
  sqlitePath: process.env.SQLITE_PATH ?? './data/hireready.sqlite',
  debugStatsToken: process.env.DEBUG_STATS_TOKEN ?? '',
};
