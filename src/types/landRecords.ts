// TypeScript definitions for BhoomiSetu - Module 2 (Land Records Intelligence)

export type LandRecordType =
  | '7/12_ROR'
  | '8A_HOLDING'
  | 'SALE_DEED'
  | 'MUTATION_ENTRY'
  | 'KHASRA_KHATAUNI'
  | 'JAMABANDI'
  | 'CADATRAL_MAP';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FLAGGED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TrustBadge = 'VERIFIED_GOLD' | 'VERIFIED_SILVER' | 'UNDER_REVIEW' | 'HIGH_ATTENTION';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  page?: number;
}

export interface OcrExtractedField {
  id: string;
  fieldName: string;
  label: string;
  extractedValue: string;
  verifiedValue?: string;
  confidence: number; // 0-100
  boundingBox: BoundingBox;
  rawOcrText: string;
  aiExplanation: string;
  isHandwritten: boolean;
  isEdited?: boolean;
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_EDIT' | 'PENDING';
  historicalValue?: string;
  historicalYear?: number;
}

export interface DocumentRecord {
  id: string;
  parcelId: string;
  recordType: LandRecordType;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  ocrConfidence: number;
  uploadedAt: string;
  uploadedByName: string;
  uploadedByOfficerId: string;
  district: string;
  taluka: string;
  village: string;
  documentYear: number;
  extractedFields: OcrExtractedField[];
  isDuplicate?: boolean;
  version: number;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ParcelDNA {
  parcelUid: string;
  dnaHash: string; // SHA-384
  centroid: GeoPoint;
  polygon: GeoPoint[];
  elevationMeters: number;
  soilType: string;
  encumbranceStatus: 'UNENCUMBERED' | 'BANK_MORTGAGE' | 'COURT_STAY' | 'GOV_ACQUISITION';
  totalMutations: number;
  totalInspections: number;
  riskScore: number; // 0-100
  lastDroneSurveyDate: string;
}

export interface TimelineYearEvent {
  year: number;
  date: string;
  type:
    | 'OWNERSHIP_CHANGE'
    | 'MUTATION_APPROVAL'
    | 'SUBDIVISION'
    | 'MERGE'
    | 'GOV_ACQUISITION'
    | 'COURT_DISPUTE'
    | 'SATELLITE_SNAPSHOT'
    | 'VERIFICATION';
  title: string;
  description: string;
  ownerName: string;
  mutationNo?: string;
  areaHectares: number;
  isDisputed?: boolean;
  satelliteImageUrl?: string;
}

export interface AiAgentOfficer {
  id: string;
  code: 'OCR_OFFICER' | 'VERIFICATION_OFFICER' | 'GIS_OFFICER' | 'FRAUD_OFFICER' | 'LEGAL_OFFICER';
  name: string;
  role: string;
  model: string;
  status: 'ANALYZING' | 'APPROVED' | 'FLAGGED' | 'COMPLETED';
  confidence: number;
  recommendation: string;
  evidence: string[];
  executionLogs: string[];
  decision?: 'PENDING' | 'OFFICER_APPROVED' | 'OFFICER_REJECTED';
}

export interface GisVerificationData {
  parcelUid: string;
  statedAreaHa: number;
  cadastralAreaHa: number;
  satelliteAreaHa: number;
  areaDiscrepancyPercent: number;
  encroachmentDetected: boolean;
  encroachmentDetails?: {
    areaSqm: number;
    encroachmentType: 'CONSTRUCTION' | 'ROAD_WIDENING' | 'FARM_OVERSTEP';
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  };
  landUseStated: string;
  landUseDetected: string;
  landUseMatch: boolean;
  cadastralPolygon: GeoPoint[];
  satelliteObservedPolygon: GeoPoint[];
  statedPolygon: GeoPoint[];
  certificateId: string;
  verifiedAt: string;
}

export interface FraudFingerprint {
  score: number; // 0-100 (high = fraud)
  riskCategory: 'CLEAN' | 'SUSPICIOUS' | 'HIGH_RISK';
  checks: {
    editedPdf: boolean;
    metadataMismatch: boolean;
    duplicateUpload: boolean;
    sealMismatch: boolean;
    signatureSimilarity: number; // percentage
    imageManipulation: boolean;
    ocrOverwrite: boolean;
  };
  suspiciousRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    severity: 'MEDIUM' | 'HIGH';
  }>;
  forensicSummary: string;
  manualReviewStatus: 'QUEUED' | 'CLEARED' | 'REFERRED_TO_ACB';
}

export interface DisputePrediction {
  riskIndex: number; // 0-100
  riskCategory: RiskLevel;
  reasons: string[];
  evidenceItems: string[];
  suggestedActions: string[];
  pendingCourtCases: string[];
  collectorAlerted: boolean;
}

export interface CitizenTrustProfile {
  parcelUid: string;
  overallScore: number; // e.g. 98.4
  badge: TrustBadge;
  aiVerificationScore: number;
  officerVerificationBadge: {
    officerName: string;
    designation: string;
    officerId: string;
    signatureHash: string;
    date: string;
  };
  districtSeal: string;
  fraudClearance: boolean;
  qrVerificationUrl: string;
  digitalSignatureHash: string;
  lastVerifiedDate: string;
}

export interface MutationSimulationResult {
  mutationNumber: string;
  applicantName: string;
  transferType: 'SUCCESSION_INHERITANCE' | 'SALE_DEED' | 'FAMILY_PARTITION' | 'GIFT_DEED';
  beforeMutation: {
    totalAreaHa: number;
    owners: Array<{ name: string; sharePercent: number; relation?: string }>;
    khataNo: string;
    encumbrances: string[];
  };
  afterMutation: {
    totalAreaHa: number;
    owners: Array<{ name: string; sharePercent: number; relation?: string }>;
    khataNo: string;
    encumbrances: string[];
    fragmentationWarning?: string;
  };
  legalPreCheckPassed: boolean;
  statutoryWarnings: string[];
  suggestedOrderText: string;
}

export interface AgentStatus {
  agentId: string;
  agentName: string;
  role: string;
  status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW' | 'FLAGGED';
  confidence: number;
  executionTimeMs: number;
  findings: string[];
  evidencePayload?: Record<string, any>;
  officerOverride?: {
    overriddenBy: string;
    reason: string;
    timestamp: string;
  };
}

export interface LandParcelDetail {
  id: string;
  parcelUid: string;
  surveyNumber: string;
  khasraNumber?: string;
  khataNumber: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  subDivision?: string;
  landAreaHa: number;
  landAreaSqft: number;
  landType: string;
  revenueAssessmentInr?: number;
  ownerName: string;
  fatherName: string;
  coSharers: Array<{ name: string; share: string; aadhaarLinked: boolean }>;
  mutationNumber: string;
  registrationNumber?: string;
  documentYear?: number;
  status: any;
  riskLevel: any;
  trustIndex?: number;
  confidenceScore?: number;
  lastUpdated?: string;
  dna: any;
  timeline: any[];
  agents?: AiAgentOfficer[];
  agentDecisions?: AgentStatus[];
  gis: any;
  fraud: any;
  dispute: any;
  trust: any;
  nearbyParcels?: Array<{
    direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
    surveyNo: string;
    ownerName: string;
    areaHa: number;
  }>;
  recentInspections?: Array<{
    date: string;
    officerName: string;
    result: string;
    photoUrl: string;
  }>;
}

export interface DashboardStats {
  todayUploads: {
    total: number;
    ror712Count: number;
    ror8aCount: number;
    saleDeedCount: number;
    mutationCount: number;
  };
  pendingVerification: {
    total: number;
    autoApproved: number;
    needsHumanReview: number;
    flaggedCritical: number;
  };
  highRiskDocumentsCount: number;
  activeFraudAlertsCount: number;
  recentMutations: Array<{
    id: string;
    mutationNumber: string;
    village: string;
    applicantName: string;
    type: string;
    status: string;
    date: string;
  }>;
  districtProgress: {
    districtName: string;
    villagesDigitized: number;
    totalVillages: number;
    completionPercentage: number;
    geoReferencedParcels: number;
  };
}

export interface RecentVerificationItem {
  id: string;
  documentName: string;
  surveyNumber: string;
  village: string;
  taluka: string;
  uploadedBy: string;
  timestamp: string;
  confidence: number;
  status: 'AUTO_APPROVED' | 'NEEDS_REVIEW' | 'FLAGGED_FRAUD';
  fraudProbability: number;
  parcelId: string;
}

export interface VoiceSearchIntent {
  rawTranscript: string;
  recognizedLanguage: string;
  extractedEntities: {
    village?: string;
    taluka?: string;
    surveyNumber?: string;
    ownerName?: string;
  };
  intentType: string;
  confidence: number;
}

export interface VoiceSearchIntentResult {
  transcript: string;
  language: 'hi' | 'mr' | 'en';
  parsedIntent: 'SEARCH_BY_OWNER' | 'SEARCH_BY_SURVEY' | 'SEARCH_BY_VILLAGE' | 'GENERAL_PARCEL';
  entities: {
    ownerName?: string;
    surveyNumber?: string;
    khasraNumber?: string;
    village?: string;
    taluka?: string;
  };
  matchedParcels: LandParcelDetail[];
}

export interface DocumentDiffComparison {
  docA: { title: string; year: number; type: string };
  docB: { title: string; year: number; type: string };
  differences: Array<{
    field: string;
    oldValue: string;
    newValue: string;
    diffType: 'CHANGED' | 'ADDED' | 'REMOVED' | 'SAME';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  areaDiffHa: number;
  ownershipDiffSummary: string;
}
