// Types for Module 6: Enterprise AI Infrastructure, Microservices, Security & Deployment

export type SupportedAiModel =
  | 'llama3:8b'
  | 'llama3:70b'
  | 'gemma2:9b'
  | 'mistral:7b'
  | 'phi3:mini'
  | 'deepseek-coder:6.7b';

export interface ModelRegistryItem {
  id: SupportedAiModel;
  name: string;
  provider: 'Ollama-Local' | 'Groq-Accelerator' | 'NIC-AI-Cloud';
  contextLength: number;
  parameterSize: string;
  quantization: string;
  isAvailable: boolean;
  gpuAccelerated: boolean;
  defaultForTask: 'GENERAL' | 'LEGAL_RAG' | 'OCR_PARSE' | 'FRAUD_ANALYSIS' | 'DISPUTE_PREDICTION';
  vramRequiredGb: number;
}

export type AgentRole =
  | 'OCR_AGENT'
  | 'VERIFICATION_AGENT'
  | 'GIS_AGENT'
  | 'FRAUD_AGENT'
  | 'LEGAL_AGENT'
  | 'TIMELINE_AGENT'
  | 'VOICE_SEARCH_AGENT'
  | 'SEARCH_AGENT';

export interface AgentExecutionRequest {
  agentType: AgentRole;
  targetParcelUid?: string;
  payload: Record<string, any>;
  promptOverride?: string;
  requireHumanSignoff?: boolean;
}

export interface AgentExecutionResponse {
  taskId: string;
  agentType: AgentRole;
  status: 'SUCCESS' | 'FLAGGED_FOR_HUMAN_REVIEW' | 'FAILED';
  confidenceScore: number;
  executionMs: number;
  evidence: Array<{
    type: string;
    description: string;
    confidence: number;
    referenceUrl?: string;
  }>;
  summary: string;
  structuredOutput: Record<string, any>;
  timestamp: string;
}

export interface OcrJobPayload {
  documentId: string;
  fileUrl: string;
  fileBase64?: string;
  state: string;
  languageHint: 'hi' | 'mr' | 'en';
  ocrEngine: 'PaddleOCR' | 'TrOCR' | 'Hybrid';
}

export interface OcrExtractedField {
  fieldName: string;
  value: string;
  confidence: number;
  boundingBox: [number, number, number, number]; // [x1, y1, x2, y2]
  isManuallyOverridden?: boolean;
  verificationRulePassed: boolean;
}

export interface OcrJobResult {
  jobId: string;
  documentId: string;
  status: 'COMPLETED' | 'FAILED';
  overallConfidence: number;
  processingTimeMs: number;
  detectedLanguage: string;
  engineUsed: string;
  layoutType: '7/12 Extract' | 'Khatauni' | 'Patta' | 'Sale Deed' | 'Mutation Order';
  fields: OcrExtractedField[];
  rawText: string;
  tableRows?: Array<Record<string, string>>;
  sealDetected: boolean;
  signatureDetected: boolean;
}

export interface VectorSearchResult {
  id: string;
  collection: string;
  entityId: string;
  similarityScore: number;
  content: string;
  metadata: Record<string, any>;
}

export interface RagLegalQuery {
  queryText: string;
  stateCode?: string;
  revenueCodeSection?: string;
  topK?: number;
}

export interface RagLegalResponse {
  answer: string;
  confidence: number;
  legalCitations: Array<{
    statute: string;
    section: string;
    state: string;
    circularNumber?: string;
    excerpt: string;
  }>;
  retrievedPassages: VectorSearchResult[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Parcel' | 'Owner' | 'Village' | 'Mutation' | 'Officer' | 'Inspection' | 'FraudCase';
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | 'OWNS'
    | 'TRANSFERRED_TO'
    | 'VERIFIED_BY'
    | 'LOCATED_IN'
    | 'INSPECTED_BY'
    | 'RELATED_MUTATION'
    | 'DISPUTED_WITH';
  properties?: Record<string, any>;
}

export interface GeoAiAnalysisRequest {
  polygonGeoJson: any;
  villageCode?: string;
  toleranceMeters?: number;
}

export interface GeoAiAnalysisResult {
  isValidGeoJson: boolean;
  totalAreaHectares: number;
  totalAreaAcres: number;
  perimeterMeters: number;
  intersectingParcels: Array<{
    parcelUid: string;
    overlapPercentage: number;
    overlapAreaHectares: number;
  }>;
  adjacentParcels: string[];
  centroidCoordinates: [number, number]; // [lat, lng]
  spatialIndexValid: boolean;
}

export interface SatelliteChangeDetectionResult {
  parcelUid: string;
  baselineDate: string;
  comparisonDate: string;
  changeDetected: boolean;
  confidenceScore: number;
  vegetationIndexChangeNdvi: number;
  builtUpAreaExpansionSqMeters: number;
  encroachmentAlert: boolean;
  differenceLayerGeoJson: any;
  satelliteMetadata: {
    satelliteName: 'ISRO Cartosat-3' | 'Sentinel-2' | 'Landsat-9';
    cloudCoverPercentage: number;
    spatialResolutionMeters: number;
  };
}

export interface FraudAnalysisResult {
  documentId: string;
  parcelUid: string;
  fraudRiskScore: number; // 0 - 100
  riskCategory: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tamperSignals: Array<{
    code: string;
    description: string;
    weight: number;
    detected: boolean;
  }>;
  duplicateHashMatch?: {
    matchedDocumentId: string;
    matchedParcelUid: string;
    registrationDate: string;
  };
  sealSimilarityPercentage: number;
  signatureSimilarityPercentage: number;
  recommendedAction: 'AUTO_APPROVE' | 'FLAG_FOR_TEHSILDAR' | 'SUBMIT_TO_ACB_INVESTIGATION';
}

export interface DisputeRiskResult {
  parcelUid: string;
  disputeRiskScore: number; // 0 - 100
  disputeProbability: 'VERY_LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  riskFactors: Array<{
    factor: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }>;
  recommendations: string[];
  historicalLitigationCount: number;
}

export interface TimelineEvent {
  id: string;
  parcelUid: string;
  eventType:
    | 'UPLOAD'
    | 'OCR'
    | 'VERIFICATION'
    | 'CORRECTION'
    | 'MUTATION'
    | 'INSPECTION'
    | 'TRUST_UPDATE'
    | 'DOWNLOAD'
    | 'FRAUD_ALERT'
    | 'SATELLITE_UPDATE';
  title: string;
  description: string;
  officerOrCitizen: string;
  ipAddress: string;
  cryptographicHash: string;
  previousHash: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface VoiceSearchQuery {
  audioBase64?: string;
  transcriptText?: string;
  language: 'hi' | 'mr' | 'en' | 'auto';
}

export interface VoiceSearchOutput {
  rawTranscript: string;
  detectedLanguage: string;
  intent: 'SEARCH_PARCEL' | 'CHECK_MUTATION_STATUS' | 'DOWNLOAD_ROR' | 'REPORT_GRIEVANCE';
  extractedEntities: {
    surveyNumber?: string;
    ownerName?: string;
    village?: string;
    taluka?: string;
    district?: string;
  };
  queryConfidence: number;
}

export interface ReportGenerationRequest {
  reportType:
    | 'PARCEL_REPORT'
    | 'VERIFICATION_REPORT'
    | 'TRUST_CERTIFICATE'
    | 'INSPECTION_REPORT'
    | 'TIMELINE_REPORT'
    | 'DISTRICT_ANALYTICS';
  targetEntityId: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  watermarkGovt: boolean;
}

export interface NotificationPayload {
  channel: 'IN_APP' | 'SMS' | 'EMAIL' | 'PUSH';
  recipientId: string;
  recipientPhoneOrEmail?: string;
  title: string;
  body: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  templateId: 'VERIFICATION_COMPLETE' | 'FRAUD_ALERT' | 'DISPUTE_ALERT' | 'INSPECTION_ASSIGNED' | 'COLLECTOR_BROADCAST';
  metadata?: Record<string, any>;
}

export interface JobQueueMetrics {
  queueName: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export interface SystemDevOpsStatus {
  version: string;
  environment: 'development' | 'production' | 'staging';
  uptimeSeconds: number;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  containers: Array<{
    name: string;
    status: 'RUNNING' | 'STOPPED' | 'RESTARTING';
    port: number;
    memoryMb: number;
    cpuPercent: number;
  }>;
  aiModelsLoaded: Array<{
    model: string;
    status: 'ONLINE' | 'STANDBY';
    memoryUsageMb: number;
    latencyMs: number;
  }>;
  database: {
    connected: boolean;
    poolConnections: number;
    activeTransactions: number;
    postgisActive: boolean;
  };
  redis: {
    connected: boolean;
    memoryUsedMb: number;
    cachedKeysCount: number;
    hitRatePercentage: number;
  };
  qdrantVectorDb: {
    connected: boolean;
    totalVectorsIndexed: number;
    collections: string[];
  };
  minioStorage: {
    connected: boolean;
    bucketsCount: number;
    totalStorageUsedMb: number;
  };
}
