// ============================================================================
// Bhulekh AI v3 — Module 5: National Command Center TypeScript Definitions
// National Informatics Centre (NIC) & Department of Land Resources (DoLR)
// ============================================================================

export type AdminActiveTab =
  | 'national-overview'
  | 'india-map'
  | 'state-admin'
  | 'district-collector'
  | 'officer-management'
  | 'ai-operations'
  | 'fraud-intelligence'
  | 'dispute-intelligence'
  | 'disaster-emergency'
  | 'audit-transparency'
  | 'analytics-reports'
  | 'system-settings'
  | 'role-matrix'
  | 'data-quality';

export type UserRolePerspective =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DISTRICT_COLLECTOR'
  | 'AI_OPS_ADMIN'
  | 'AUDITOR';

export interface NationalStateItem {
  code: string;
  name: string;
  capital: string;
  zone: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTRAL' | 'NORTH_EAST';
  totalDistricts: number;
  totalParcels: number;
  verifiedParcels: number;
  pendingParcels: number;
  fraudCasesCount: number;
  activeDisputesCount: number;
  satelliteAlertsCount: number;
  verificationPercentage: number;
  collectorAvgScore: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'CRITICAL';
  progressTrend: number;
}

export interface NationalDistrictItem {
  id: string;
  stateCode: string;
  stateName: string;
  name: string;
  headquarters: string;
  collectorName: string;
  collectorEmail: string;
  collectorPhone: string;
  totalTalukas: number;
  totalVillages: number;
  totalParcels: number;
  verifiedParcels: number;
  pendingRecords: number;
  verificationQueueCount: number;
  fraudQueueCount: number;
  inspectionQueueCount: number;
  disputeQueueCount: number;
  mutationQueueCount: number;
  aiAccuracyPercentage: number;
  productivityIndex: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verificationPercentage: number;
}

export interface NationalOfficerItem {
  id: string;
  employeeId: string;
  fullName: string;
  officialEmail: string;
  phoneNumber: string;
  roleType:
    | 'SUPER_ADMIN'
    | 'STATE_ADMIN'
    | 'DISTRICT_COLLECTOR'
    | 'VERIFICATION_OFFICER'
    | 'SURVEY_OFFICER'
    | 'AUDITOR'
    | 'AI_OPS_ADMIN';
  department: string;
  designation: string;
  stateCode: string;
  stateName: string;
  districtId: string;
  districtName: string;
  talukaName?: string;
  assignedVillages?: string[];
  isActive: boolean;
  is2faEnforced: boolean;
  loginStatus: 'ONLINE' | 'IDLE' | 'OFFLINE';
  activeDevicesCount: number;
  performanceRating: number;
  totalRecordsProcessed: number;
  approvalWorkflowStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
}

export interface NationalAiAgentItem {
  agentId: string;
  agentName: string;
  category: 'OCR' | 'VERIFICATION' | 'GIS' | 'FRAUD' | 'LEGAL';
  modelVersion: string;
  status: 'RUNNING' | 'IDLE' | 'DEGRADED' | 'FAILED';
  accuracyPercentage: number;
  queueLength: number;
  avgResponseTimeMs: number;
  requestsProcessedToday: number;
  errorCountToday: number;
  suggestionsAcceptedCount: number;
  suggestionsRejectedCount: number;
  manualOverridesCount: number;
  lastHealthCheck: string;
}

export interface NationalFraudItem {
  id: string;
  caseNumber: string;
  stateCode: string;
  districtId: string;
  districtName: string;
  villageName: string;
  surveyNumber: string;
  fraudCategory:
    | 'DUPLICATE_RECORD'
    | 'EDITED_DOCUMENT'
    | 'SEAL_MISMATCH'
    | 'SIGNATURE_FORGERY'
    | 'AREA_MANIPULATION'
    | 'BOUNDARY_ENCROACHMENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiConfidence: number;
  status: 'DETECTED' | 'INVESTIGATION_QUEUED' | 'ACB_REFERRED' | 'RESOLVED' | 'DISMISSED';
  investigatingOfficer: string;
  description: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface NationalDisputeItem {
  id: string;
  disputeNumber: string;
  stateCode: string;
  districtId: string;
  districtName: string;
  villageName: string;
  surveyNumber: string;
  disputeType:
    | 'BOUNDARY_OVERLAP'
    | 'HEIRSHIP_CONFLICT'
    | 'COURT_STAY'
    | 'MORTGAGE_DEFAULT'
    | 'GOV_LAND_CLAIM';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiRiskScore: number;
  status: 'PREDICTED' | 'MEDIATION_SCHEDULED' | 'REFERRED_TO_REVENUE_COURT' | 'SETTLED';
  partiesInvolved: string[];
  courtCaseRef?: string;
  summary: string;
  loggedAt: string;
}

export interface NationalDisasterAlertItem {
  id: string;
  alertCode: string;
  incidentType:
    | 'FLOOD'
    | 'LANDSLIDE'
    | 'RIVER_OVERFLOW'
    | 'FOREST_ENCROACHMENT'
    | 'CYCLONE'
    | 'DROUGHT';
  severity: 'WATCH' | 'ADVISORY' | 'WARNING' | 'CRITICAL_EMERGENCY';
  stateCode: string;
  stateName: string;
  affectedDistricts: string[];
  affectedVillagesCount: number;
  affectedParcelsCount: number;
  isroSatelliteSource: string;
  description: string;
  collectorActionRequired: string;
  inspectionsDispatched: number;
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
  issuedAt: string;
}

export interface NationalAuditItem {
  id: string;
  eventTimestamp: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  actionType:
    | 'LOGIN'
    | 'APPROVAL'
    | 'CORRECTION'
    | 'MUTATION'
    | 'EXPORT'
    | 'ROLE_CHANGE'
    | 'TRANSFER'
    | 'EMERGENCY_BROADCAST';
  resourceType: string;
  resourceId: string;
  stateCode?: string;
  districtId?: string;
  ipAddress: string;
  deviceInfo: string;
  justificationReason: string;
  cryptographicHash: string;
}

export interface NationalSystemSettings {
  aiConfidenceThreshold: number;
  is2faEnforcedNationwide: boolean;
  mutationSlaDays: number;
  gisDiscrepancyToleranceMeters: number;
  autoEscalateDisputesAfterDays: number;
  enableDroneSurveySync: boolean;
  enableDigiLockerPush: boolean;
  activeLanguagePack: string[];
  allowedExportFormats: string[];
  maintenanceMode: boolean;
}

export interface NationalRoleMatrixRow {
  roleType: string;
  roleLabel: string;
  securityClearance: number;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
  canManageAi: boolean;
  canManageGis: boolean;
  canManageReports: boolean;
  canAuditAccess: boolean;
  canEmergencyBroadcast: boolean;
}

export interface NationalReportItem {
  id: string;
  title: string;
  reportType: 'NATIONAL_DILRMP' | 'STATE_EXECUTIVE' | 'DISTRICT_PERFORMANCE' | 'FRAUD_FORENSICS' | 'GIS_CADASTRAL';
  scope: string;
  generatedBy: string;
  generatedAt: string;
  fileFormat: 'PDF' | 'EXCEL' | 'CSV';
  fileSizeBytes: number;
  downloadUrl: string;
  status: 'READY' | 'GENERATING' | 'FAILED';
}

export type NationalAdminTab =
  | 'national-overview'
  | 'gis-cadastre'
  | 'state-console'
  | 'district-collector'
  | 'officer-management'
  | 'ai-operations'
  | 'fraud-intelligence'
  | 'dispute-intelligence'
  | 'disaster-monitoring'
  | 'audit-transparency'
  | 'analytics-reports'
  | 'system-settings'
  | 'role-matrix'
  | 'data-quality';

export interface NationalAdminOverviewData {
  states: NationalStateItem[];
  recentAudits: NationalAuditItem[];
  disasters: NationalDisasterAlertItem[];
  summary: {
    totalStates: number;
    totalParcels: number;
    verifiedParcels: number;
    pendingParcels: number;
    totalFraudCases: number;
    totalDisputes: number;
    nationalVerificationPercentage: number;
    activeOfficersCount: number;
    aiAccuracyAvg: number;
  };
}
