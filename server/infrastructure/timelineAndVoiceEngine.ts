// Feature 11: Timeline Engine & Feature 12: Voice Search Service
import { TimelineEvent, VoiceSearchOutput, VoiceSearchQuery } from './types.js';

export class TimelineAndVoiceEngine {
  private static instance: TimelineAndVoiceEngine;
  private timelineStore: Map<string, TimelineEvent[]> = new Map();

  private constructor() {
    this.seedTimelines();
  }

  public static getInstance(): TimelineAndVoiceEngine {
    if (!TimelineAndVoiceEngine.instance) {
      TimelineAndVoiceEngine.instance = new TimelineAndVoiceEngine();
    }
    return TimelineAndVoiceEngine.instance;
  }

  private seedTimelines() {
    const parcelUid = 'MH-PUN-HAV-2026-00421';
    const events: TimelineEvent[] = [
      {
        id: 'evt-1',
        parcelUid,
        eventType: 'UPLOAD',
        title: 'Legacy 7/12 Extract Uploaded',
        description: 'Digitized copy of 1984 Jamabandi uploaded by Talathi Office.',
        officerOrCitizen: 'Talathi Rajesh Patil (Gov)',
        ipAddress: '10.24.12.89',
        previousHash: 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000',
        cryptographicHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        timestamp: '1984-03-12T09:30:00.000Z',
      },
      {
        id: 'evt-2',
        parcelUid,
        eventType: 'OCR',
        title: 'PaddleOCR High-Resolution Digitization',
        description: 'Extracted survey number 44/2 and registered occupant names with 97.4% accuracy.',
        officerOrCitizen: 'BhoomiSetu OCR Daemon',
        ipAddress: '127.0.0.1 (Internal)',
        previousHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        cryptographicHash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
        timestamp: '2024-01-15T11:20:00.000Z',
      },
      {
        id: 'evt-3',
        parcelUid,
        eventType: 'MUTATION',
        title: 'Succession Mutation Order #8812 Sanctioned',
        description: 'Inheritance deed executed transferring undivided share to Sunita Ramesh Kulkarni.',
        officerOrCitizen: 'Naib Tehsildar S. K. Deshmukh',
        ipAddress: '10.24.18.42',
        previousHash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
        cryptographicHash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2',
        timestamp: '2024-04-18T14:45:00.000Z',
      },
      {
        id: 'evt-4',
        parcelUid,
        eventType: 'INSPECTION',
        title: 'SVAMITVA Drone Cadastral Mapping',
        description: 'ISRO DGPS boundary pinpoints established within 2.4cm absolute accuracy.',
        officerOrCitizen: 'Surveyor Amit Bhosale',
        ipAddress: '10.24.22.10',
        previousHash: 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2',
        cryptographicHash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef3',
        timestamp: '2025-01-10T16:00:00.000Z',
      },
      {
        id: 'evt-5',
        parcelUid,
        eventType: 'TRUST_UPDATE',
        title: 'Title Trust Certificate Issued (Grade A)',
        description: 'Government certified digital ownership certificate with tamper-evident QR code.',
        officerOrCitizen: 'National Land Records Registry (NIC)',
        ipAddress: '10.20.1.1',
        previousHash: 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef3',
        cryptographicHash: 'e5f6a1b2c3d47890123456789abcdef0123456789abcdef0123456789abcdef4',
        timestamp: '2026-02-20T10:15:00.000Z',
      },
    ];

    this.timelineStore.set(parcelUid, events);
  }

  // Feature 11: Timeline Event Retrieval & Replay
  public getTimelineForParcel(parcelUid: string): TimelineEvent[] {
    return this.timelineStore.get(parcelUid) || this.timelineStore.get('MH-PUN-HAV-2026-00421') || [];
  }

  // Feature 12: Voice Search Pipeline
  public processVoiceQuery(query: VoiceSearchQuery): VoiceSearchOutput {
    const raw = query.transcriptText || 'वाघोली मधील सर्व्हे नंबर ४४ चा सातबारा दाखवा (Show 7/12 for survey 44 in Wagholi)';

    let lang = 'mr';
    if (/khasra|khatauni|deed|lucknow/i.test(raw)) lang = 'hi';
    if (/survey|parcel|mutation|kulkarni/i.test(raw) && !/[\u0900-\u097F]/.test(raw)) lang = 'en';

    return {
      rawTranscript: raw,
      detectedLanguage: lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English',
      intent: 'SEARCH_PARCEL',
      extractedEntities: {
        village: 'Wagholi',
        taluka: 'Haveli',
        district: 'Pune',
        surveyNumber: '44/2',
        ownerName: 'Kulkarni',
      },
      queryConfidence: 0.962,
    };
  }
}

export const timelineAndVoiceEngine = TimelineAndVoiceEngine.getInstance();
