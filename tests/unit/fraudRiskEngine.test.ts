// Unit Test: Fraud & Dispute Engines (Feature 30)
import { describe, it, expect } from 'vitest';
import { fraudAndDisputeEngine } from '../../server/infrastructure/fraudAndDisputeEngine.js';

describe('Fraud & Dispute Engine Unit Tests', () => {
  it('should analyze document fraud and produce risk score under 20 for genuine document', () => {
    const analysis = fraudAndDisputeEngine.analyzeDocumentFraud({
      documentId: 'TEST-DEED-GENUINE',
      parcelUid: 'MH-PUN-HAV-2026-00421',
    });

    expect(analysis.fraudRiskScore).toBeLessThan(20);
    expect(analysis.riskCategory).toBe('CLEAN');
    expect(analysis.sealSimilarityPercentage).toBeGreaterThan(95);
  });

  it('should predict dispute risk with breakdown recommendations', () => {
    const dispute = fraudAndDisputeEngine.predictDisputeRisk('MH-PUN-HAV-2026-00421');

    expect(dispute.disputeRiskScore).toBeLessThan(25);
    expect(dispute.disputeProbability).toBe('VERY_LOW');
    expect(dispute.riskFactors.length).toBeGreaterThanOrEqual(2);
  });
});
