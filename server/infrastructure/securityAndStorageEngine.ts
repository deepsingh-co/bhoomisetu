// Feature 15: Audit, Feature 18: API Gateway, Feature 19: RBAC, Feature 20: Security Center, Feature 21: Storage, Feature 26: Prompts, Feature 32: Backup
import crypto from 'crypto';

export interface AuditLogRecord {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  previousHash: string;
  sha256Hash: string;
}

export interface StoredFileRecord {
  id: string;
  bucket: 'land-records' | 'inspection-photos' | 'certificates' | 'reports' | 'ai-snapshots';
  key: string;
  filename: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
  uploadedBy: string;
  version: number;
}

export interface PromptTemplateItem {
  id: string;
  key: string;
  title: string;
  version: string;
  systemPrompt: string;
  userTemplate: string;
  variables: string[];
}

export interface BackupSnapshot {
  id: string;
  createdAt: string;
  backupType: 'FULL' | 'INCREMENTAL';
  sizeBytes: number;
  tablesBackedUp: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'RESTORED';
  checksum: string;
}

export class SecurityAndStorageEngine {
  private static instance: SecurityAndStorageEngine;
  private auditLedger: AuditLogRecord[] = [];
  private storedFiles: StoredFileRecord[] = [];
  private promptTemplates: PromptTemplateItem[] = [];
  private backupSnapshots: BackupSnapshot[] = [];

  private constructor() {
    this.seedPrompts();
    this.seedAuditLedger();
    this.seedFiles();
    this.seedBackups();
  }

  public static getInstance(): SecurityAndStorageEngine {
    if (!SecurityAndStorageEngine.instance) {
      SecurityAndStorageEngine.instance = new SecurityAndStorageEngine();
    }
    return SecurityAndStorageEngine.instance;
  }

  private seedPrompts() {
    this.promptTemplates = [
      {
        id: 'pmt-1',
        key: 'OCR_EXTRACTION',
        title: '7/12 & Khatauni Multi-lingual OCR Extraction',
        version: '2.1.0',
        systemPrompt: 'You are an expert Government Revenue Land Officer specialized in Devanagari 7/12 extracts and Jamabandi ledgers. Output strict JSON with confidence scores.',
        userTemplate: 'Parse the provided OCR bounding boxes for document: {{documentText}} in state {{stateCode}}.',
        variables: ['documentText', 'stateCode'],
      },
      {
        id: 'pmt-2',
        key: 'FRAUD_ANALYSIS',
        title: 'Benami & Duplicate Sale Deed Detector',
        version: '1.4.0',
        systemPrompt: 'You are a forensic legal auditor under the Prevention of Benami Property Transactions Act. Examine conveyancing velocity and identify any strawman purchaser signals.',
        userTemplate: 'Evaluate the ownership transfer history for ULPIN {{ulpin}} over the past {{historyYears}} years: {{transferHistory}}.',
        variables: ['ulpin', 'historyYears', 'transferHistory'],
      },
      {
        id: 'pmt-3',
        key: 'DISPUTE_PREDICTION',
        title: 'Cadastral Boundary Dispute Predictor',
        version: '1.1.0',
        systemPrompt: 'Evaluate boundary overlap metrics against adjacent plots and historic revenue court litigation patterns.',
        userTemplate: 'Predict boundary dispute likelihood for plot {{plotNo}} with overlap delta {{overlapMeters}}m.',
        variables: ['plotNo', 'overlapMeters'],
      },
    ];
  }

  private seedAuditLedger() {
    let lastHash = 'GENESIS_SEC_AUDIT_0000000000000000000000000000000000000000000000000000';
    const actions = [
      { user: 'usr-collector-pune', role: 'DISTRICT_COLLECTOR', action: 'APPROVE_MUTATION', res: 'PARCEL:MH-PUN-HAV-2026-00421' },
      { user: 'usr-talathi-42', role: 'GOVERNMENT_OFFICER', action: 'VERIFY_DOCUMENTS', res: 'DOC:SALE-DEED-2024-99' },
      { user: 'usr-survey-drone', role: 'SURVEY_OFFICER', action: 'UPLOAD_GEOJSON_CADASTRE', res: 'GIS:VILLAGE-WAGHOLI-LAYER' },
    ];

    actions.forEach((a, i) => {
      const ts = new Date(Date.now() - (3 - i) * 86400000).toISOString();
      const hash = crypto.createHash('sha256').update(`${lastHash}:${a.user}:${a.action}:${ts}`).digest('hex');
      this.auditLedger.push({
        id: `audit-${i + 1}`,
        userId: a.user,
        userRole: a.role,
        action: a.action,
        resource: a.res,
        ipAddress: '10.24.10.15',
        userAgent: 'NIC-Enterprise-Agent/3.0',
        timestamp: ts,
        previousHash: lastHash,
        sha256Hash: hash,
      });
      lastHash = hash;
    });
  }

  private seedFiles() {
    this.storedFiles = [
      {
        id: 'f-1',
        bucket: 'land-records',
        key: 'mh/pune/haveli/wagholi/44_2_ror_certified.pdf',
        filename: '44_2_ror_certified.pdf',
        sizeBytes: 1845000,
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploadedAt: '2026-02-10T12:00:00Z',
        uploadedBy: 'Talathi Wagholi',
        version: 2,
      },
      {
        id: 'f-2',
        bucket: 'certificates',
        key: 'certificates/TITLE_TRUST_CERT_MH-PUN-HAV-2026-00421.pdf',
        filename: 'TITLE_TRUST_CERT_MH-PUN-HAV-2026-00421.pdf',
        sizeBytes: 420000,
        sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        uploadedAt: '2026-02-20T10:15:00Z',
        uploadedBy: 'NIC Signer Daemon',
        version: 1,
      },
    ];
  }

  private seedBackups() {
    this.backupSnapshots = [
      {
        id: 'snap-20260920-nightly',
        createdAt: '2026-09-20T23:59:00Z',
        backupType: 'FULL',
        sizeBytes: 4820000000, // 4.8 GB
        tablesBackedUp: 42,
        status: 'COMPLETED',
        checksum: 'sha256:4a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
      },
      {
        id: 'snap-20260921-hourly-1200',
        createdAt: '2026-09-21T12:00:00Z',
        backupType: 'INCREMENTAL',
        sizeBytes: 142000000, // 142 MB
        tablesBackedUp: 14,
        status: 'COMPLETED',
        checksum: 'sha256:1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      },
    ];
  }

  // Feature 15: Audit Ledger
  public logAuditEvent(record: Omit<AuditLogRecord, 'id' | 'timestamp' | 'previousHash' | 'sha256Hash'>): AuditLogRecord {
    const last = this.auditLedger[this.auditLedger.length - 1];
    const prevHash = last ? last.sha256Hash : 'GENESIS';
    const ts = new Date().toISOString();
    const hash = crypto.createHash('sha256').update(`${prevHash}:${record.userId}:${record.action}:${ts}`).digest('hex');

    const entry: AuditLogRecord = {
      ...record,
      id: `audit-${this.auditLedger.length + 1}`,
      timestamp: ts,
      previousHash: prevHash,
      sha256Hash: hash,
    };

    this.auditLedger.unshift(entry);
    return entry;
  }

  public getAuditRecords(): AuditLogRecord[] {
    return this.auditLedger;
  }

  // Feature 21: File Storage
  public listFiles() {
    return this.storedFiles;
  }

  // Feature 26: Prompts
  public getPrompts() {
    return this.promptTemplates;
  }

  // Feature 32: Backup Snapshots
  public getBackups() {
    return this.backupSnapshots;
  }

  public triggerBackup(type: 'FULL' | 'INCREMENTAL'): BackupSnapshot {
    const snap: BackupSnapshot = {
      id: `snap-${Date.now()}-${type.toLowerCase()}`,
      createdAt: new Date().toISOString(),
      backupType: type,
      sizeBytes: type === 'FULL' ? 4900000000 : 150000000,
      tablesBackedUp: type === 'FULL' ? 42 : 12,
      status: 'COMPLETED',
      checksum: `sha256:${crypto.randomBytes(32).toString('hex')}`,
    };
    this.backupSnapshots.unshift(snap);
    return snap;
  }
}

export const securityAndStorageEngine = SecurityAndStorageEngine.getInstance();
