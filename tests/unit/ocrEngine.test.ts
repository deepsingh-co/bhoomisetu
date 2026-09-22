// Unit Test: OCR Pipeline Engine (Feature 30)
import { describe, it, expect } from '../testHarness.js';
import { ocrPipelineEngine } from '../../server/infrastructure/ocrEngine.js';

describe('OCR Pipeline Engine Unit Tests', () => {
  it('should process 7/12 land extract with high confidence', async () => {
    const res = await ocrPipelineEngine.processDocument({
      documentId: 'TEST-DOC-712',
      fileUrl: '/uploads/sample_7_12.pdf',
      state: 'MH',
      languageHint: 'mr',
      ocrEngine: 'PaddleOCR',
    });

    expect(res.status).toBe('COMPLETED');
    expect(res.overallConfidence).toBeGreaterThan(0.9);
    expect(res.sealDetected).toBe(true);
    expect(res.fields.length).toBeGreaterThanOrEqual(5);

    const surveyField = res.fields.find((f) => f.fieldName.includes('Survey'));
    expect(surveyField).toBeDefined();
    expect(surveyField?.verificationRulePassed).toBe(true);
  });
});
