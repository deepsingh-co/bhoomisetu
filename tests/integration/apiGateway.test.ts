// Integration Test: API Gateway & Service Endpoints (Feature 30)
import { describe, it, expect } from 'vitest';
import { vectorAndRagEngine } from '../../server/infrastructure/vectorAndRagEngine.js';
import { timelineAndVoiceEngine } from '../../server/infrastructure/timelineAndVoiceEngine.js';
import { queueAndCacheService } from '../../server/infrastructure/queueAndCacheService.js';
import { observabilityAndMetrics } from '../../server/infrastructure/observabilityAndMetrics.js';

describe('API Gateway & Backend Services Integration', () => {
  it('should execute Land Law RAG query and return verified legal citations', async () => {
    const rag = await vectorAndRagEngine.queryLandLawRag({
      queryText: 'Notice period for acquisition of land rights under MLRC',
      stateCode: 'MH',
    });

    expect(rag.confidence).toBeGreaterThan(0.85);
    expect(rag.legalCitations.length).toBeGreaterThan(0);
    expect(rag.answer).toContain('notice');
  });

  it('should retrieve cryptographic timeline blocks with SHA-256 integrity', () => {
    const events = timelineAndVoiceEngine.getTimelineForParcel('MH-PUN-HAV-2026-00421');
    expect(events.length).toBeGreaterThanOrEqual(3);

    for (let i = 1; i < events.length; i++) {
      expect(events[i].previousHash).toBe(events[i - 1].cryptographicHash);
    }
  });

  it('should track background BullMQ queues and cache hit ratios', () => {
    const metrics = queueAndCacheService.getAllQueueMetrics();
    expect(metrics.length).toBeGreaterThanOrEqual(5);

    const cacheStats = queueAndCacheService.getCacheStats();
    expect(cacheStats.hitRate).toBeDefined();
  });

  it('should generate valid Prometheus text format metrics', () => {
    const prom = observabilityAndMetrics.generatePrometheusMetrics();
    expect(prom).toContain('bhulekh_uptime_seconds');
    expect(prom).toContain('bhulekh_ocr_requests_total');
    expect(prom).toContain('bhulekh_ai_inference_duration_seconds');
  });
});
