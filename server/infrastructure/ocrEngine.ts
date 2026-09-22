// Feature 3: OCR Pipeline Engine (PaddleOCR + TrOCR layout parsing)
import { OcrJobPayload, OcrJobResult, OcrExtractedField } from './types.js';

export class OcrPipelineEngine {
  private static instance: OcrPipelineEngine;
  private jobResults: Map<string, OcrJobResult> = new Map();

  private constructor() {}

  public static getInstance(): OcrPipelineEngine {
    if (!OcrPipelineEngine.instance) {
      OcrPipelineEngine.instance = new OcrPipelineEngine();
    }
    return OcrPipelineEngine.instance;
  }

  public async processDocument(payload: OcrJobPayload): Promise<OcrJobResult> {
    const start = Date.now();
    const jobId = `ocr-job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Simulate Image Enhancement, PaddleOCR text detection, and TrOCR handwritten recognizer
    const state = (payload.state || 'MH').toUpperCase();
    const layoutType = state === 'MH' ? '7/12 Extract' : state === 'UP' ? 'Khatauni' : 'Sale Deed';

    const fields: OcrExtractedField[] = [
      {
        fieldName: 'Survey / Khasra Number',
        value: '44/2-A',
        confidence: 0.985,
        boundingBox: [120, 240, 260, 275],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Recorded Landholder Name',
        value: payload.languageHint === 'mr' ? 'सुनीता रमेश कुलकर्णी' : 'Sunita Ramesh Kulkarni',
        confidence: 0.974,
        boundingBox: [280, 240, 680, 280],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Total Parcel Area',
        value: '1.8400 Hectares (4.54 Acres)',
        confidence: 0.991,
        boundingBox: [120, 310, 340, 345],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Land Revenue Assessment (आकारणी)',
        value: '₹ 14.50 per annum',
        confidence: 0.962,
        boundingBox: [360, 310, 520, 345],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Tenure Classification (खातेदार वर्ग)',
        value: 'Bhumiswami Class 1 (Occupant Class 1 / भोगवटादार वर्ग १)',
        confidence: 0.953,
        boundingBox: [120, 380, 680, 415],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Other Rights / Encumbrances (इतर हक्क व बोजा)',
        value: 'State Bank of India KCC Loan ₹ 1,50,000/- (Sanctioned 2024, Valid)',
        confidence: 0.941,
        boundingBox: [120, 450, 700, 520],
        verificationRulePassed: true,
      },
      {
        fieldName: 'Issuing Officer & Talathi Seal',
        value: 'Talathi Office Wagholi, Haveli Taluka, Dist Pune (Certified)',
        confidence: 0.989,
        boundingBox: [550, 680, 750, 820],
        verificationRulePassed: true,
      },
    ];

    const result: OcrJobResult = {
      jobId,
      documentId: payload.documentId,
      status: 'COMPLETED',
      overallConfidence: 0.971,
      processingTimeMs: Math.max(120, Date.now() - start + 85),
      detectedLanguage: payload.languageHint === 'mr' ? 'Marathi (मराठी)' : payload.languageHint === 'hi' ? 'Hindi (हिन्दी)' : 'English',
      engineUsed: `${payload.ocrEngine || 'PaddleOCR v3'} + TrOCR Handwritten Fine-tuned Model`,
      layoutType,
      fields,
      rawText: fields.map((f) => `${f.fieldName}: ${f.value}`).join('\n'),
      sealDetected: true,
      signatureDetected: true,
    };

    this.jobResults.set(jobId, result);
    return result;
  }

  public getJobResult(jobId: string): OcrJobResult | undefined {
    return this.jobResults.get(jobId);
  }
}

export const ocrPipelineEngine = OcrPipelineEngine.getInstance();
