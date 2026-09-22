// Express Routes for Module 6: AI Infrastructure, Enterprise Backend, Security & Observability
import { Router, Request, Response } from 'express';
import { aiOrchestrator } from '../infrastructure/aiOrchestrator.js';
import { multiAgentOrchestrator } from '../infrastructure/multiAgentOrchestrator.js';
import { ocrPipelineEngine } from '../infrastructure/ocrEngine.js';
import { vectorAndRagEngine } from '../infrastructure/vectorAndRagEngine.js';
import { knowledgeGraphEngine } from '../infrastructure/knowledgeGraphEngine.js';
import { geoAndSatelliteEngine } from '../infrastructure/geoAndSatelliteEngine.js';
import { fraudAndDisputeEngine } from '../infrastructure/fraudAndDisputeEngine.js';
import { timelineAndVoiceEngine } from '../infrastructure/timelineAndVoiceEngine.js';
import { reportAndNotificationEngine } from '../infrastructure/reportAndNotificationEngine.js';
import { queueAndCacheService } from '../infrastructure/queueAndCacheService.js';
import { securityAndStorageEngine } from '../infrastructure/securityAndStorageEngine.js';
import { observabilityAndMetrics } from '../infrastructure/observabilityAndMetrics.js';
import { openApiSpecification } from '../infrastructure/swaggerDoc.js';

export const infrastructureRouter = Router();

// 1. AI Models & Orchestrator
infrastructureRouter.get('/ai/models', (req: Request, res: Response) => {
  res.json({ success: true, models: aiOrchestrator.getModelRegistry() });
});

infrastructureRouter.post(['/ai/run', '/run'], async (req: Request, res: Response) => {
  try {
    const { model, prompt, systemPrompt, temperature, jsonMode } = req.body;
    const result = await aiOrchestrator.runInference({
      model,
      prompt: prompt || 'Analyze land parcel title parameters.',
      systemPrompt,
      temperature,
      jsonMode,
      clientIp: req.ip,
    });
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Multi-Agent Orchestrator
infrastructureRouter.post('/agent/execute', async (req: Request, res: Response) => {
  try {
    const { agentType, targetParcelUid, payload, promptOverride } = req.body;
    const response = await multiAgentOrchestrator.executeAgent({
      agentType: agentType || 'VERIFICATION_AGENT',
      targetParcelUid,
      payload: payload || {},
      promptOverride,
    });
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

infrastructureRouter.get('/agent/history', (req: Request, res: Response) => {
  res.json({ success: true, history: multiAgentOrchestrator.getRecentExecutions() });
});

// 3. OCR Pipeline Engine
infrastructureRouter.post(['/ocr/process', '/process'], async (req: Request, res: Response) => {
  try {
    const { documentId, state, languageHint, ocrEngine } = req.body;
    const result = await ocrPipelineEngine.processDocument({
      documentId: documentId || `DOC-${Date.now()}`,
      fileUrl: '/uploads/sample_7_12.pdf',
      state: state || 'MH',
      languageHint: languageHint || 'mr',
      ocrEngine: ocrEngine || 'PaddleOCR',
    });
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Vector Search & RAG
infrastructureRouter.post(['/vector/search', '/search'], async (req: Request, res: Response) => {
  try {
    const { collection, query, topK, threshold } = req.body;
    const results = await vectorAndRagEngine.semanticSearch({
      collection: collection || 'land_laws',
      query: query || 'mutation procedure',
      topK,
      threshold,
    });
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

infrastructureRouter.post(['/rag/query', '/query'], async (req: Request, res: Response) => {
  try {
    const { queryText, stateCode, revenueCodeSection, topK } = req.body;
    const response = await vectorAndRagEngine.queryLandLawRag({
      queryText: queryText || 'What is the mandatory objection period for mutation in Maharashtra?',
      stateCode,
      revenueCodeSection,
      topK,
    });
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Knowledge Graph
infrastructureRouter.get('/graph/data', (req: Request, res: Response) => {
  res.json({ success: true, graph: knowledgeGraphEngine.getFullGraph() });
});

infrastructureRouter.get('/graph/entity/:id', (req: Request, res: Response) => {
  res.json({ success: true, graph: knowledgeGraphEngine.getSubGraphForEntity(req.params.id) });
});

// 6. Geo AI & Satellite
infrastructureRouter.post('/gis/analyze', (req: Request, res: Response) => {
  const result = geoAndSatelliteEngine.analyzeParcelPolygon(req.body);
  res.json({ success: true, result });
});

infrastructureRouter.post('/satellite/analyze', (req: Request, res: Response) => {
  const { parcelUid, baselineDate, comparisonDate } = req.body;
  const result = geoAndSatelliteEngine.runSatelliteChangeDetection({
    parcelUid: parcelUid || 'MH-PUN-HAV-2026-00421',
    baselineDate,
    comparisonDate,
  });
  res.json({ success: true, result });
});

// 7. Fraud & Dispute
infrastructureRouter.post(['/fraud/analyze', '/fraud'], (req: Request, res: Response) => {
  const { documentId, parcelUid, rawDocumentHash } = req.body;
  const result = fraudAndDisputeEngine.analyzeDocumentFraud({
    documentId: documentId || 'DOC-DEED-44-2',
    parcelUid: parcelUid || 'MH-PUN-HAV-2026-00421',
    rawDocumentHash,
  });
  res.json({ success: true, result });
});

infrastructureRouter.post(['/dispute/analyze', '/dispute'], (req: Request, res: Response) => {
  const { parcelUid } = req.body;
  const result = fraudAndDisputeEngine.predictDisputeRisk(parcelUid || 'MH-PUN-HAV-2026-00421');
  res.json({ success: true, result });
});

// 8. Timeline & Voice
infrastructureRouter.get(['/timeline/events', '/timeline'], (req: Request, res: Response) => {
  const parcelUid = (req.query.parcelUid as string) || 'MH-PUN-HAV-2026-00421';
  const events = timelineAndVoiceEngine.getTimelineForParcel(parcelUid);
  res.json({ success: true, parcelUid, events });
});

infrastructureRouter.post('/voice/process', (req: Request, res: Response) => {
  const result = timelineAndVoiceEngine.processVoiceQuery(req.body);
  res.json({ success: true, result });
});

// 9. Reports & Notifications
infrastructureRouter.post(['/reports/generate', '/reports'], (req: Request, res: Response) => {
  const { reportType, targetEntityId, format, watermarkGovt } = req.body;
  const result = reportAndNotificationEngine.generateReport({
    reportType: reportType || 'PARCEL_REPORT',
    targetEntityId: targetEntityId || 'MH-PUN-HAV-2026-00421',
    format: format || 'PDF',
    watermarkGovt: watermarkGovt !== false,
  });
  res.json({ success: true, result });
});

infrastructureRouter.post(['/notifications/send', '/notifications'], (req: Request, res: Response) => {
  const result = reportAndNotificationEngine.dispatchNotification(req.body);
  res.json({ success: true, result });
});

// 10. Queues & Cache
infrastructureRouter.get('/queues/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    queues: queueAndCacheService.getAllQueueMetrics(),
    deadLetterQueue: queueAndCacheService.getDeadLetterJobs(),
  });
});

infrastructureRouter.post('/queues/dlq/retry', (req: Request, res: Response) => {
  const { jobId } = req.body;
  const success = queueAndCacheService.retryDeadLetterJob(jobId);
  res.json({ success, message: success ? 'Job re-enqueued to active worker' : 'Job not found' });
});

infrastructureRouter.get('/cache/stats', (req: Request, res: Response) => {
  res.json({ success: true, cache: queueAndCacheService.getCacheStats() });
});

// 11. Security, Audit, Files, Prompts & Backups
infrastructureRouter.get('/audit/records', (req: Request, res: Response) => {
  res.json({ success: true, audits: securityAndStorageEngine.getAuditRecords() });
});

infrastructureRouter.get('/files', (req: Request, res: Response) => {
  res.json({ success: true, files: securityAndStorageEngine.listFiles() });
});

infrastructureRouter.get('/prompts', (req: Request, res: Response) => {
  res.json({ success: true, prompts: securityAndStorageEngine.getPrompts() });
});

infrastructureRouter.get('/backups', (req: Request, res: Response) => {
  res.json({ success: true, backups: securityAndStorageEngine.getBackups() });
});

infrastructureRouter.post('/backups/trigger', (req: Request, res: Response) => {
  const type = req.body.type === 'INCREMENTAL' ? 'INCREMENTAL' : 'FULL';
  const snapshot = securityAndStorageEngine.triggerBackup(type);
  res.json({ success: true, snapshot });
});

// 12. Observability, Benchmarks & DevOps
infrastructureRouter.get('/devops/status', (req: Request, res: Response) => {
  res.json({ success: true, status: observabilityAndMetrics.getDevOpsStatus() });
});

infrastructureRouter.get('/benchmarks', (req: Request, res: Response) => {
  res.json({ success: true, benchmarks: observabilityAndMetrics.getBenchmarks() });
});

infrastructureRouter.get('/logs', (req: Request, res: Response) => {
  res.json({ success: true, errorLogs: observabilityAndMetrics.getErrorLogs() });
});

// 13. OpenAPI Documentation
infrastructureRouter.get('/swagger', (req: Request, res: Response) => {
  res.json(openApiSpecification);
});
