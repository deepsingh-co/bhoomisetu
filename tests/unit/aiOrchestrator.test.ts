// Unit Test: AI Orchestrator & Model Registry (Feature 30)
import { describe, it, expect } from '../testHarness.js';
import { aiOrchestrator } from '../../server/infrastructure/aiOrchestrator.js';

describe('AI Orchestrator Unit Tests', () => {
  it('should initialize with standard NIC-approved AI models', () => {
    const models = aiOrchestrator.getModelRegistry();
    expect(models.length).toBeGreaterThanOrEqual(4);
    const llama = models.find((m) => m.id === 'llama3:8b');
    expect(llama).toBeDefined();
    expect(llama?.gpuAccelerated).toBe(true);
  });

  it('should pick best model according to task type', () => {
    const fraudModel = aiOrchestrator.getBestModelForTask('FRAUD_ANALYSIS');
    expect(fraudModel.id).toBe('llama3:70b');

    const ragModel = aiOrchestrator.getBestModelForTask('LEGAL_RAG');
    expect(ragModel.id).toBe('mistral:7b');
  });

  it('should run inference and return latency and token counts', async () => {
    const result = await aiOrchestrator.runInference({
      model: 'llama3:8b',
      prompt: 'Check mutation objection period for Maharashtra.',
      jsonMode: true,
    });
    expect(result.tokensGenerated).toBeGreaterThan(0);
    expect(result.latencyMs).toBeGreaterThan(0);
    expect(result.text).toContain('ANALYZED');
  });
});
