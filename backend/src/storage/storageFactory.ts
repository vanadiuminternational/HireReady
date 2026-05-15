import { config } from '../config.js';
import { MemoryAiStorage } from './memoryStorage.js';
import { SQLiteAiStorage } from './sqliteStorage.js';
import type { AiStorage } from './types.js';

export function createAiStorage(): AiStorage {
  if (config.storageDriver === 'sqlite') {
    return new SQLiteAiStorage(config.sqlitePath);
  }

  return new MemoryAiStorage();
}

export const aiStorage = createAiStorage();
