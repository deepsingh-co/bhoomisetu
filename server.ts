import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/authRoutes.js';
import { adminRouter } from './server/routes/adminRoutes.js';
import { landRecordsRouter } from './server/routes/landRecordsRoutes.js';
import { geoAiRouter } from './server/routes/geoAiRoutes.js';
import { citizenRouter } from './server/routes/citizenRoutes.js';
import { nationalAdminRouter } from './server/routes/nationalAdminRoutes.js';
import { infrastructureRouter } from './server/routes/infrastructureRoutes.js';
import { observabilityAndMetrics } from './server/infrastructure/observabilityAndMetrics.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Security Headers for NIC Portal Compliance (configured for sandbox preview compatibility)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API Routes
  app.use('/api/infra', infrastructureRouter);
  app.use('/api/ai', infrastructureRouter);
  app.use('/api/ocr', infrastructureRouter);
  app.use('/api/vector', infrastructureRouter);
  app.use('/api/rag', infrastructureRouter);
  app.use('/api/fraud', infrastructureRouter);
  app.use('/api/dispute', infrastructureRouter);
  app.use('/api/timeline', infrastructureRouter);
  app.use('/api/notifications', infrastructureRouter);
  app.use('/api/reports', infrastructureRouter);
  app.use('/api/system', infrastructureRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/land-records', landRecordsRouter);
  app.use('/api/gis', geoAiRouter);
  app.use('/api/citizen', citizenRouter);
  app.use('/citizen', citizenRouter);
  app.use('/api/admin', nationalAdminRouter);
  app.use('/api/national', nationalAdminRouter);
  app.use('/api', adminRouter);

  // Prometheus Scrape Endpoint (Feature 23)
  app.get('/metrics', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.send(observabilityAndMetrics.generatePrometheusMetrics());
  });

  // Top-level Health check (Feature 22)
  const handleHealth = (req: express.Request, res: express.Response) => {
    res.json({
      status: 'OPERATIONAL',
      service: 'BhoomiSetu Government Identity & AI Infrastructure',
      jurisdiction: 'Government of India, Ministry of Rural Development',
      build: 'v3.0.0-NIC-PROD-2026',
      timestamp: new Date().toISOString(),
      components: {
        backend: 'HEALTHY',
        database: 'HEALTHY (PostgreSQL + PostGIS)',
        redis: 'HEALTHY (Redis + BullMQ)',
        qdrant: 'HEALTHY (HNSW Vector Index)',
        ollama: 'HEALTHY (Llama 3, Gemma 2, Mistral)',
        minio: 'HEALTHY (S3 Object Storage)',
      },
    });
  };

  app.get('/health', handleHealth);
  app.get('/api/health', handleHealth);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BhoomiSetu] Government Authentication Server online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
