import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { aiRouter } from './routes/ai.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'hireready-ai-backend',
    mode: 'mock-ai-scaffold',
    liveAiEnabled: false,
  });
});

app.use('/api/ai', aiRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(config.port, () => {
  console.log(`HireReady AI backend scaffold listening on port ${config.port}`);
  console.log('Live AI is disabled in this scaffold. Mock provider only.');
});
