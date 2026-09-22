// ============================================================================
// BhoomiSetu — Module 5: National Command Center In-Memory Datastore
// National Informatics Centre (NIC) & Department of Land Resources
// ============================================================================

export interface StateRecord {
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
  progressTrend: number; // monthly % change
}

export interface DistrictRecord {
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

export interface OfficerRecord {
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

export interface AiAgentMetric {
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

export interface FraudIncident {
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

export interface DisputeIncident {
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

export interface DisasterAlert {
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

export interface NationalAuditEvent {
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

export interface SystemSettingsConfig {
  aiConfidenceThreshold: number; // e.g. 85%
  is2faEnforcedNationwide: boolean;
  mutationSlaDays: number; // e.g. 15 days
  gisDiscrepancyToleranceMeters: number; // e.g. 0.5m
  autoEscalateDisputesAfterDays: number;
  enableDroneSurveySync: boolean;
  enableDigiLockerPush: boolean;
  activeLanguagePack: string[];
  allowedExportFormats: string[];
  maintenanceMode: boolean;
}

export interface RoleMatrixItem {
  roleType: string;
  roleLabel: string;
  securityClearance: number; // 1 to 7
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

export interface ReportItem {
  id: string;
  title: string;
  reportType: 'NATIONAL_DILRMP' | 'STATE_EXECUTIVE' | 'DISTRICT_PERFORMANCE' | 'FRAUD_FORENSICS' | 'GIS_CADASTRAL';
  scope: string; // "All India", "Maharashtra", "Pune District"
  generatedBy: string;
  generatedAt: string;
  fileFormat: 'PDF' | 'EXCEL' | 'CSV';
  fileSizeBytes: number;
  downloadUrl: string;
  status: 'READY' | 'GENERATING' | 'FAILED';
}

// ----------------------------------------------------------------------------
// SEED DATA STORE
// ----------------------------------------------------------------------------

export class NationalAdminDatabase {
  public states: StateRecord[] = [
    {
      code: 'MH',
      name: 'Maharashtra',
      capital: 'Mumbai',
      zone: 'WEST',
      totalDistricts: 36,
      totalParcels: 32450000,
      verifiedParcels: 29854000,
      pendingParcels: 2596000,
      fraudCasesCount: 142,
      activeDisputesCount: 680,
      satelliteAlertsCount: 48,
      verificationPercentage: 92.0,
      collectorAvgScore: 91.5,
      status: 'ACTIVE',
      progressTrend: +1.8,
    },
    {
      code: 'UP',
      name: 'Uttar Pradesh',
      capital: 'Lucknow',
      zone: 'NORTH',
      totalDistricts: 75,
      totalParcels: 48900000,
      verifiedParcels: 42543000,
      pendingParcels: 6357000,
      fraudCasesCount: 284,
      activeDisputesCount: 1240,
      satelliteAlertsCount: 92,
      verificationPercentage: 87.0,
      collectorAvgScore: 86.4,
      status: 'ACTIVE',
      progressTrend: +2.1,
    },
    {
      code: 'MP',
      name: 'Madhya Pradesh',
      capital: 'Bhopal',
      zone: 'CENTRAL',
      totalDistricts: 55,
      totalParcels: 28400000,
      verifiedParcels: 26128000,
      pendingParcels: 2272000,
      fraudCasesCount: 98,
      activeDisputesCount: 512,
      satelliteAlertsCount: 34,
      verificationPercentage: 92.0,
      collectorAvgScore: 89.2,
      status: 'ACTIVE',
      progressTrend: +1.4,
    },
    {
      code: 'GJ',
      name: 'Gujarat',
      capital: 'Gandhinagar',
      zone: 'WEST',
      totalDistricts: 33,
      totalParcels: 22100000,
      verifiedParcels: 20995000,
      pendingParcels: 1105000,
      fraudCasesCount: 62,
      activeDisputesCount: 340,
      satelliteAlertsCount: 22,
      verificationPercentage: 95.0,
      collectorAvgScore: 94.8,
      status: 'ACTIVE',
      progressTrend: +0.9,
    },
    {
      code: 'KA',
      name: 'Karnataka',
      capital: 'Bengaluru',
      zone: 'SOUTH',
      totalDistricts: 31,
      totalParcels: 25600000,
      verifiedParcels: 23808000,
      pendingParcels: 1792000,
      fraudCasesCount: 88,
      activeDisputesCount: 490,
      satelliteAlertsCount: 31,
      verificationPercentage: 93.0,
      collectorAvgScore: 92.1,
      status: 'ACTIVE',
      progressTrend: +1.2,
    },
    {
      code: 'TN',
      name: 'Tamil Nadu',
      capital: 'Chennai',
      zone: 'SOUTH',
      totalDistricts: 38,
      totalParcels: 27800000,
      verifiedParcels: 25854000,
      pendingParcels: 1946000,
      fraudCasesCount: 76,
      activeDisputesCount: 430,
      satelliteAlertsCount: 29,
      verificationPercentage: 93.0,
      collectorAvgScore: 93.2,
      status: 'ACTIVE',
      progressTrend: +1.1,
    },
    {
      code: 'RJ',
      name: 'Rajasthan',
      capital: 'Jaipur',
      zone: 'NORTH',
      totalDistricts: 50,
      totalParcels: 24200000,
      verifiedParcels: 20812000,
      pendingParcels: 3388000,
      fraudCasesCount: 165,
      activeDisputesCount: 720,
      satelliteAlertsCount: 45,
      verificationPercentage: 86.0,
      collectorAvgScore: 84.7,
      status: 'ACTIVE',
      progressTrend: +2.5,
    },
    {
      code: 'AP',
      name: 'Andhra Pradesh',
      capital: 'Amaravati',
      zone: 'SOUTH',
      totalDistricts: 26,
      totalParcels: 19500000,
      verifiedParcels: 18330000,
      pendingParcels: 1170000,
      fraudCasesCount: 54,
      activeDisputesCount: 310,
      satelliteAlertsCount: 18,
      verificationPercentage: 94.0,
      collectorAvgScore: 93.0,
      status: 'ACTIVE',
      progressTrend: +1.3,
    },
    {
      code: 'WB',
      name: 'West Bengal',
      capital: 'Kolkata',
      zone: 'EAST',
      totalDistricts: 23,
      totalParcels: 31200000,
      verifiedParcels: 25896000,
      pendingParcels: 5304000,
      fraudCasesCount: 210,
      activeDisputesCount: 890,
      satelliteAlertsCount: 62,
      verificationPercentage: 83.0,
      collectorAvgScore: 80.5,
      status: 'UNDER_REVIEW',
      progressTrend: +3.0,
    },
    {
      code: 'BR',
      name: 'Bihar',
      capital: 'Patna',
      zone: 'EAST',
      totalDistricts: 38,
      totalParcels: 34500000,
      verifiedParcels: 26220000,
      pendingParcels: 8280000,
      fraudCasesCount: 340,
      activeDisputesCount: 1450,
      satelliteAlertsCount: 78,
      verificationPercentage: 76.0,
      collectorAvgScore: 75.2,
      status: 'CRITICAL',
      progressTrend: +3.8,
    },
    {
      code: 'PB',
      name: 'Punjab',
      capital: 'Chandigarh',
      zone: 'NORTH',
      totalDistricts: 23,
      totalParcels: 14200000,
      verifiedParcels: 13632000,
      pendingParcels: 568000,
      fraudCasesCount: 42,
      activeDisputesCount: 220,
      satelliteAlertsCount: 15,
      verificationPercentage: 96.0,
      collectorAvgScore: 95.1,
      status: 'ACTIVE',
      progressTrend: +0.6,
    },
    {
      code: 'HR',
      name: 'Haryana',
      capital: 'Chandigarh',
      zone: 'NORTH',
      totalDistricts: 22,
      totalParcels: 12800000,
      verifiedParcels: 12288000,
      pendingParcels: 512000,
      fraudCasesCount: 38,
      activeDisputesCount: 195,
      satelliteAlertsCount: 12,
      verificationPercentage: 96.0,
      collectorAvgScore: 95.8,
      status: 'ACTIVE',
      progressTrend: +0.8,
    },
    {
      code: 'KL',
      name: 'Kerala',
      capital: 'Thiruvananthapuram',
      zone: 'SOUTH',
      totalDistricts: 14,
      totalParcels: 11200000,
      verifiedParcels: 10864000,
      pendingParcels: 336000,
      fraudCasesCount: 24,
      activeDisputesCount: 140,
      satelliteAlertsCount: 14,
      verificationPercentage: 97.0,
      collectorAvgScore: 96.4,
      status: 'ACTIVE',
      progressTrend: +0.5,
    },
    {
      code: 'OD',
      name: 'Odisha',
      capital: 'Bhubaneswar',
      zone: 'EAST',
      totalDistricts: 30,
      totalParcels: 18400000,
      verifiedParcels: 16192000,
      pendingParcels: 2208000,
      fraudCasesCount: 72,
      activeDisputesCount: 360,
      satelliteAlertsCount: 38,
      verificationPercentage: 88.0,
      collectorAvgScore: 87.3,
      status: 'ACTIVE',
      progressTrend: +1.9,
    },
    {
      code: 'TS',
      name: 'Telangana',
      capital: 'Hyderabad',
      zone: 'SOUTH',
      totalDistricts: 33,
      totalParcels: 16800000,
      verifiedParcels: 15792000,
      pendingParcels: 1008000,
      fraudCasesCount: 50,
      activeDisputesCount: 290,
      satelliteAlertsCount: 19,
      verificationPercentage: 94.0,
      collectorAvgScore: 92.8,
      status: 'ACTIVE',
      progressTrend: +1.2,
    },
    {
      code: 'AS',
      name: 'Assam',
      capital: 'Dispur',
      zone: 'NORTH_EAST',
      totalDistricts: 35,
      totalParcels: 15200000,
      verifiedParcels: 12464000,
      pendingParcels: 2736000,
      fraudCasesCount: 115,
      activeDisputesCount: 520,
      satelliteAlertsCount: 42,
      verificationPercentage: 82.0,
      collectorAvgScore: 81.0,
      status: 'UNDER_REVIEW',
      progressTrend: +2.8,
    },
  ];

  public districts: DistrictRecord[] = [
    {
      id: 'dist-mh-pune',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      name: 'Pune',
      headquarters: 'Pune City',
      collectorName: 'Dr. Suhas Diwase, IAS',
      collectorEmail: 'collector.pune@gov.in',
      collectorPhone: '+91 20 2612 3344',
      totalTalukas: 14,
      totalVillages: 1872,
      totalParcels: 2450000,
      verifiedParcels: 2303000,
      pendingRecords: 147000,
      verificationQueueCount: 312,
      fraudQueueCount: 18,
      inspectionQueueCount: 45,
      disputeQueueCount: 38,
      mutationQueueCount: 184,
      aiAccuracyPercentage: 96.8,
      productivityIndex: 94.2,
      riskCategory: 'LOW',
      verificationPercentage: 94.0,
    },
    {
      id: 'dist-mh-nagpur',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      name: 'Nagpur',
      headquarters: 'Nagpur',
      collectorName: 'Dr. Vipin Itankar, IAS',
      collectorEmail: 'collector.nagpur@gov.in',
      collectorPhone: '+91 712 256 0524',
      totalTalukas: 14,
      totalVillages: 1640,
      totalParcels: 1820000,
      verifiedParcels: 1674400,
      pendingRecords: 145600,
      verificationQueueCount: 240,
      fraudQueueCount: 12,
      inspectionQueueCount: 32,
      disputeQueueCount: 26,
      mutationQueueCount: 120,
      aiAccuracyPercentage: 95.4,
      productivityIndex: 91.0,
      riskCategory: 'LOW',
      verificationPercentage: 92.0,
    },
    {
      id: 'dist-mh-nashik',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      name: 'Nashik',
      headquarters: 'Nashik',
      collectorName: 'Shri Jalaj Sharma, IAS',
      collectorEmail: 'collector.nashik@gov.in',
      collectorPhone: '+91 253 257 8501',
      totalTalukas: 15,
      totalVillages: 1920,
      totalParcels: 2150000,
      verifiedParcels: 1978000,
      pendingRecords: 172000,
      verificationQueueCount: 290,
      fraudQueueCount: 19,
      inspectionQueueCount: 38,
      disputeQueueCount: 42,
      mutationQueueCount: 165,
      aiAccuracyPercentage: 94.8,
      productivityIndex: 89.5,
      riskCategory: 'MEDIUM',
      verificationPercentage: 92.0,
    },
    {
      id: 'dist-mh-thane',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      name: 'Thane',
      headquarters: 'Thane',
      collectorName: 'Shri Ashok Shingare, IAS',
      collectorEmail: 'collector.thane@gov.in',
      collectorPhone: '+91 22 2534 4041',
      totalTalukas: 7,
      totalVillages: 840,
      totalParcels: 1420000,
      verifiedParcels: 1334800,
      pendingRecords: 85200,
      verificationQueueCount: 180,
      fraudQueueCount: 28,
      inspectionQueueCount: 50,
      disputeQueueCount: 58,
      mutationQueueCount: 140,
      aiAccuracyPercentage: 93.6,
      productivityIndex: 88.0,
      riskCategory: 'HIGH',
      verificationPercentage: 94.0,
    },
    {
      id: 'dist-up-lucknow',
      stateCode: 'UP',
      stateName: 'Uttar Pradesh',
      name: 'Lucknow',
      headquarters: 'Lucknow',
      collectorName: 'Shri Surya Pal Gangwar, IAS',
      collectorEmail: 'dm.lucknow@up.gov.in',
      collectorPhone: '+91 522 262 3022',
      totalTalukas: 5,
      totalVillages: 820,
      totalParcels: 1650000,
      verifiedParcels: 1485000,
      pendingRecords: 165000,
      verificationQueueCount: 410,
      fraudQueueCount: 34,
      inspectionQueueCount: 65,
      disputeQueueCount: 72,
      mutationQueueCount: 280,
      aiAccuracyPercentage: 92.5,
      productivityIndex: 87.2,
      riskCategory: 'MEDIUM',
      verificationPercentage: 90.0,
    },
    {
      id: 'dist-up-varanasi',
      stateCode: 'UP',
      stateName: 'Uttar Pradesh',
      name: 'Varanasi',
      headquarters: 'Varanasi',
      collectorName: 'Shri S. Rajalingam, IAS',
      collectorEmail: 'dm.varanasi@up.gov.in',
      collectorPhone: '+91 542 250 8555',
      totalTalukas: 3,
      totalVillages: 1320,
      totalParcels: 1280000,
      verifiedParcels: 1126400,
      pendingRecords: 153600,
      verificationQueueCount: 320,
      fraudQueueCount: 22,
      inspectionQueueCount: 40,
      disputeQueueCount: 48,
      mutationQueueCount: 190,
      aiAccuracyPercentage: 93.1,
      productivityIndex: 89.0,
      riskCategory: 'MEDIUM',
      verificationPercentage: 88.0,
    },
    {
      id: 'dist-mp-indore',
      stateCode: 'MP',
      stateName: 'Madhya Pradesh',
      name: 'Indore',
      headquarters: 'Indore',
      collectorName: 'Shri Asheesh Singh, IAS',
      collectorEmail: 'collector.indore@mp.gov.in',
      collectorPhone: '+91 731 244 9111',
      totalTalukas: 5,
      totalVillages: 640,
      totalParcels: 1480000,
      verifiedParcels: 1406000,
      pendingRecords: 74000,
      verificationQueueCount: 160,
      fraudQueueCount: 9,
      inspectionQueueCount: 24,
      disputeQueueCount: 18,
      mutationQueueCount: 95,
      aiAccuracyPercentage: 97.2,
      productivityIndex: 96.0,
      riskCategory: 'LOW',
      verificationPercentage: 95.0,
    },
    {
      id: 'dist-gj-ahmedabad',
      stateCode: 'GJ',
      stateName: 'Gujarat',
      name: 'Ahmedabad',
      headquarters: 'Ahmedabad',
      collectorName: 'Smt. Pravina D.K., IAS',
      collectorEmail: 'collector-ahm@gujarat.gov.in',
      collectorPhone: '+91 79 2755 1681',
      totalTalukas: 10,
      totalVillages: 550,
      totalParcels: 1950000,
      verifiedParcels: 1891500,
      pendingRecords: 58500,
      verificationQueueCount: 140,
      fraudQueueCount: 14,
      inspectionQueueCount: 28,
      disputeQueueCount: 24,
      mutationQueueCount: 110,
      aiAccuracyPercentage: 97.5,
      productivityIndex: 96.5,
      riskCategory: 'LOW',
      verificationPercentage: 97.0,
    },
    {
      id: 'dist-ka-bengaluru-u',
      stateCode: 'KA',
      stateName: 'Karnataka',
      name: 'Bengaluru Urban',
      headquarters: 'Bengaluru',
      collectorName: 'Shri Dayananda K.A., IAS',
      collectorEmail: 'dc.bengaluru@karnataka.gov.in',
      collectorPhone: '+91 80 2221 1292',
      totalTalukas: 5,
      totalVillages: 610,
      totalParcels: 2100000,
      verifiedParcels: 1995000,
      pendingRecords: 105000,
      verificationQueueCount: 310,
      fraudQueueCount: 32,
      inspectionQueueCount: 60,
      disputeQueueCount: 65,
      mutationQueueCount: 210,
      aiAccuracyPercentage: 94.2,
      productivityIndex: 90.0,
      riskCategory: 'HIGH',
      verificationPercentage: 95.0,
    },
    {
      id: 'dist-rj-jaipur',
      stateCode: 'RJ',
      stateName: 'Rajasthan',
      name: 'Jaipur',
      headquarters: 'Jaipur',
      collectorName: 'Shri Prakash Rajpurohit, IAS',
      collectorEmail: 'dm-jai-rj@nic.in',
      collectorPhone: '+91 141 220 1567',
      totalTalukas: 16,
      totalVillages: 2150,
      totalParcels: 2320000,
      verifiedParcels: 2018400,
      pendingRecords: 301600,
      verificationQueueCount: 480,
      fraudQueueCount: 29,
      inspectionQueueCount: 54,
      disputeQueueCount: 62,
      mutationQueueCount: 240,
      aiAccuracyPercentage: 91.8,
      productivityIndex: 85.0,
      riskCategory: 'MEDIUM',
      verificationPercentage: 87.0,
    },
  ];

  public officers: OfficerRecord[] = [
    {
      id: 'off-001',
      employeeId: 'GOI-NIC-ADM-001',
      fullName: 'Dr. Ramesh Chandra Verma, IAS',
      officialEmail: 'dg.landrecords@nic.in',
      phoneNumber: '+91 11 2430 5000',
      roleType: 'SUPER_ADMIN',
      department: 'Department of Land Resources (DoLR), MoRD',
      designation: 'Director General & Additional Secretary',
      stateCode: 'MH',
      stateName: 'National (All States)',
      districtId: 'ALL',
      districtName: 'National Jurisdiction',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 2,
      performanceRating: 5.0,
      totalRecordsProcessed: 142500,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T08:30:00Z',
      createdAt: '2023-01-15T00:00:00Z',
    },
    {
      id: 'off-002',
      employeeId: 'MH-REV-ADM-042',
      fullName: 'Smt. Radhika P. Nambiar, IAS',
      officialEmail: 'comm.landrecords@maharashtra.gov.in',
      phoneNumber: '+91 20 2605 8420',
      roleType: 'STATE_ADMIN',
      department: 'Revenue & Forest Department, Maharashtra',
      designation: 'Settlement Commissioner & Director of Land Records',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      districtId: 'dist-mh-pune',
      districtName: 'All Maharashtra Districts',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 1,
      performanceRating: 4.9,
      totalRecordsProcessed: 89400,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T09:10:00Z',
      createdAt: '2023-04-10T00:00:00Z',
    },
    {
      id: 'off-003',
      employeeId: 'MH-PUN-COL-009',
      fullName: 'Dr. Suhas Diwase, IAS',
      officialEmail: 'collector.pune@gov.in',
      phoneNumber: '+91 20 2612 3344',
      roleType: 'DISTRICT_COLLECTOR',
      department: 'District Revenue Administration, Pune',
      designation: 'District Collector & District Magistrate',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 1,
      performanceRating: 4.9,
      totalRecordsProcessed: 42100,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T08:55:00Z',
      createdAt: '2023-06-01T00:00:00Z',
    },
    {
      id: 'off-004',
      employeeId: 'MH-HAV-VER-018',
      fullName: 'Shri Mahesh Gopal Kulkarni',
      officialEmail: 'mahesh.kulkarni@gov.in',
      phoneNumber: '+91 98220 12345',
      roleType: 'VERIFICATION_OFFICER',
      department: 'Sub-Divisional Revenue Office, Haveli',
      designation: 'Circle Officer / Naib Tehsildar (Land Records)',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      talukaName: 'Haveli',
      assignedVillages: ['Wagholi', 'Hadapsar', 'Manjari', 'Loni Kalbhor'],
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 1,
      performanceRating: 4.8,
      totalRecordsProcessed: 18450,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T09:15:00Z',
      createdAt: '2024-01-10T00:00:00Z',
    },
    {
      id: 'off-005',
      employeeId: 'MH-MUL-PAT-094',
      fullName: 'Shri Rameshwar Kisan Patil',
      officialEmail: 'rameshwar.patil@gov.in',
      phoneNumber: '+91 94230 54321',
      roleType: 'SURVEY_OFFICER',
      department: 'Talathi Saza Wagholi, Tehsil Haveli',
      designation: 'Talathi (Cadastral Patwari Level 4)',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      talukaName: 'Haveli',
      assignedVillages: ['Wagholi', 'Bakori'],
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 1,
      performanceRating: 4.7,
      totalRecordsProcessed: 12300,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T09:05:00Z',
      createdAt: '2024-02-15T00:00:00Z',
    },
    {
      id: 'off-006',
      employeeId: 'GOI-CAG-AUD-012',
      fullName: 'Smt. Vandana Subramanian, IA&AS',
      officialEmail: 'vandana.auditor@cag.gov.in',
      phoneNumber: '+91 11 2323 1100',
      roleType: 'AUDITOR',
      department: 'Comptroller & Auditor General of India (CAG)',
      designation: 'Principal Director of Audit (DILRMP)',
      stateCode: 'MH',
      stateName: 'National & State',
      districtId: 'ALL',
      districtName: 'All Jurisdictions',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'IDLE',
      activeDevicesCount: 1,
      performanceRating: 4.9,
      totalRecordsProcessed: 32000,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T07:45:00Z',
      createdAt: '2023-09-01T00:00:00Z',
    },
    {
      id: 'off-007',
      employeeId: 'NIC-AI-OPS-003',
      fullName: 'Er. Ankit Srivastava',
      officialEmail: 'ankit.ai@nic.in',
      phoneNumber: '+91 11 2430 5888',
      roleType: 'AI_OPS_ADMIN',
      department: 'NIC Artificial Intelligence Centre of Excellence',
      designation: 'Senior Technical Director (AI/ML Infra)',
      stateCode: 'MH',
      stateName: 'National',
      districtId: 'ALL',
      districtName: 'National AI Clusters',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'ONLINE',
      activeDevicesCount: 2,
      performanceRating: 5.0,
      totalRecordsProcessed: 520000,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-21T09:20:00Z',
      createdAt: '2023-03-20T00:00:00Z',
    },
    {
      id: 'off-008',
      employeeId: 'UP-LUK-COL-004',
      fullName: 'Shri Surya Pal Gangwar, IAS',
      officialEmail: 'dm.lucknow@up.gov.in',
      phoneNumber: '+91 522 262 3022',
      roleType: 'DISTRICT_COLLECTOR',
      department: 'District Revenue Administration, Lucknow',
      designation: 'District Magistrate & Collector',
      stateCode: 'UP',
      stateName: 'Uttar Pradesh',
      districtId: 'dist-up-lucknow',
      districtName: 'Lucknow',
      isActive: true,
      is2faEnforced: true,
      loginStatus: 'OFFLINE',
      activeDevicesCount: 1,
      performanceRating: 4.8,
      totalRecordsProcessed: 34500,
      approvalWorkflowStatus: 'APPROVED',
      lastLoginAt: '2026-09-20T17:30:00Z',
      createdAt: '2023-08-10T00:00:00Z',
    },
  ];

  public aiAgents: AiAgentMetric[] = [
    {
      agentId: 'ai-ocr-01',
      agentName: 'OCR Officer AI',
      category: 'OCR',
      modelVersion: 'v3.2-Devanagari-Handwritten',
      status: 'RUNNING',
      accuracyPercentage: 98.4,
      queueLength: 14,
      avgResponseTimeMs: 420,
      requestsProcessedToday: 4820,
      errorCountToday: 3,
      suggestionsAcceptedCount: 4740,
      suggestionsRejectedCount: 77,
      manualOverridesCount: 38,
      lastHealthCheck: '2026-09-21T09:30:00Z',
    },
    {
      agentId: 'ai-ver-02',
      agentName: 'Verification AI Agent',
      category: 'VERIFICATION',
      modelVersion: 'v3.4-CrossRepository-Match',
      status: 'RUNNING',
      accuracyPercentage: 99.1,
      queueLength: 8,
      avgResponseTimeMs: 280,
      requestsProcessedToday: 3950,
      errorCountToday: 1,
      suggestionsAcceptedCount: 3915,
      suggestionsRejectedCount: 34,
      manualOverridesCount: 16,
      lastHealthCheck: '2026-09-21T09:30:00Z',
    },
    {
      agentId: 'ai-gis-03',
      agentName: 'ISRO GeoAI Cadastral Agent',
      category: 'GIS',
      modelVersion: 'v4.0-Cartosat-Sentinel2',
      status: 'RUNNING',
      accuracyPercentage: 97.6,
      queueLength: 22,
      avgResponseTimeMs: 840,
      requestsProcessedToday: 2150,
      errorCountToday: 5,
      suggestionsAcceptedCount: 2098,
      suggestionsRejectedCount: 47,
      manualOverridesCount: 24,
      lastHealthCheck: '2026-09-21T09:30:00Z',
    },
    {
      agentId: 'ai-frd-04',
      agentName: 'Forensic Fraud AI',
      category: 'FRAUD',
      modelVersion: 'v2.8-SealTamper-SignatureGAN',
      status: 'RUNNING',
      accuracyPercentage: 96.9,
      queueLength: 5,
      avgResponseTimeMs: 650,
      requestsProcessedToday: 3120,
      errorCountToday: 2,
      suggestionsAcceptedCount: 3020,
      suggestionsRejectedCount: 98,
      manualOverridesCount: 42,
      lastHealthCheck: '2026-09-21T09:30:00Z',
    },
    {
      agentId: 'ai-leg-05',
      agentName: 'Legal & Succession AI',
      category: 'LEGAL',
      modelVersion: 'v2.1-MLRC-HinduSuccession',
      status: 'RUNNING',
      accuracyPercentage: 98.2,
      queueLength: 11,
      avgResponseTimeMs: 510,
      requestsProcessedToday: 1840,
      errorCountToday: 0,
      suggestionsAcceptedCount: 1805,
      suggestionsRejectedCount: 35,
      manualOverridesCount: 18,
      lastHealthCheck: '2026-09-21T09:30:00Z',
    },
  ];

  public fraudCases: FraudIncident[] = [
    {
      id: 'frd-001',
      caseNumber: 'NIC-FRD-2026-00412',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      villageName: 'Wagholi',
      surveyNumber: '88/B',
      fraudCategory: 'SEAL_MISMATCH',
      severity: 'CRITICAL',
      aiConfidence: 98.6,
      status: 'INVESTIGATION_QUEUED',
      investigatingOfficer: 'Shri Mahesh Gopal Kulkarni',
      description: 'Tehsildar official seal hologram mismatch detected via forensic Fourier transform. Seal circle diameter diverges by 1.8mm from State Cadre master template.',
      reportedAt: '2026-09-18T11:20:00Z',
    },
    {
      id: 'frd-002',
      caseNumber: 'NIC-FRD-2026-00389',
      stateCode: 'MH',
      districtId: 'dist-mh-thane',
      districtName: 'Thane',
      villageName: 'Kalyan Rural',
      surveyNumber: '214/1',
      fraudCategory: 'AREA_MANIPULATION',
      severity: 'HIGH',
      aiConfidence: 97.2,
      status: 'ACB_REFERRED',
      investigatingOfficer: 'ACB Special Cell Thane',
      description: 'Stated area in uploaded 1998 deed altered from 0.45 Ha to 1.45 Ha. OCR forensic layer identified digital stroke overwrite under 12x magnification.',
      reportedAt: '2026-09-15T09:40:00Z',
    },
    {
      id: 'frd-003',
      caseNumber: 'NIC-FRD-2026-00341',
      stateCode: 'UP',
      districtId: 'dist-up-lucknow',
      districtName: 'Lucknow',
      villageName: 'Bakshi Ka Talab',
      surveyNumber: '405',
      fraudCategory: 'DUPLICATE_RECORD',
      severity: 'HIGH',
      aiConfidence: 99.4,
      status: 'INVESTIGATION_QUEUED',
      investigatingOfficer: 'ADM Revenue Lucknow',
      description: 'Identical Khatauni certificate uploaded under two separate mutation requests with altered applicant names.',
      reportedAt: '2026-09-12T14:15:00Z',
    },
    {
      id: 'frd-004',
      caseNumber: 'NIC-FRD-2026-00295',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      villageName: 'Hadapsar',
      surveyNumber: '305/C',
      fraudCategory: 'BOUNDARY_ENCROACHMENT',
      severity: 'MEDIUM',
      aiConfidence: 94.5,
      status: 'RESOLVED',
      investigatingOfficer: 'Shri Prakash Shinde',
      description: 'Plot boundary boundary stones shifted by 3.2m onto PWD public road right-of-way. Confirmed via SVAMITVA drone survey; boundary restored.',
      reportedAt: '2026-08-28T16:00:00Z',
      resolvedAt: '2026-09-10T12:00:00Z',
    },
  ];

  public disputeCases: DisputeIncident[] = [
    {
      id: 'dsp-001',
      disputeNumber: 'NIC-DSP-2026-00188',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      villageName: 'Paud',
      surveyNumber: '142/A',
      disputeType: 'HEIRSHIP_CONFLICT',
      riskLevel: 'HIGH',
      aiRiskScore: 84.5,
      status: 'MEDIATION_SCHEDULED',
      partiesInvolved: ['Rameshwar Kisan Patil', 'Suresh Kisan Patil (Sibling co-sharer)'],
      courtCaseRef: 'Civil Suit No. 412/2025 (Civil Judge Junior Division Pune)',
      summary: 'Succession dispute under Hindu Succession Act Section 6; coparcenary share percentage disputed following demise of original title holder.',
      loggedAt: '2026-09-10T10:00:00Z',
    },
    {
      id: 'dsp-002',
      disputeNumber: 'NIC-DSP-2026-00142',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      districtName: 'Pune',
      villageName: 'Hadapsar',
      surveyNumber: '419',
      disputeType: 'COURT_STAY',
      riskLevel: 'CRITICAL',
      aiRiskScore: 92.0,
      status: 'REFERRED_TO_REVENUE_COURT',
      partiesInvolved: ['Vitthal Raoji Kadam Heirs', 'MHADA Urban Housing Board'],
      courtCaseRef: 'High Court Writ Petition 8891/2024',
      summary: 'Statutory injunction on land mutation pending determination of compensation under Land Acquisition Act Section 24(2).',
      loggedAt: '2026-08-15T15:30:00Z',
    },
    {
      id: 'dsp-003',
      disputeNumber: 'NIC-DSP-2026-00098',
      stateCode: 'UP',
      districtId: 'dist-up-lucknow',
      districtName: 'Lucknow',
      villageName: 'Sarojini Nagar',
      surveyNumber: '210/B',
      disputeType: 'BOUNDARY_OVERLAP',
      riskLevel: 'MEDIUM',
      aiRiskScore: 68.4,
      status: 'PREDICTED',
      partiesInvolved: ['Ram Kumar Yadav', 'Shyam Lal Sharma'],
      summary: 'Adjacent cadastral boundaries overlap by 14.5 sq meters due to legacy chain survey discrepancy from 1974 settlement.',
      loggedAt: '2026-09-02T11:45:00Z',
    },
  ];

  public disasterAlerts: DisasterAlert[] = [
    {
      id: 'dis-001',
      alertCode: 'NDMA-ISRO-FLD-2026-08',
      incidentType: 'FLOOD',
      severity: 'CRITICAL_EMERGENCY',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      affectedDistricts: ['Pune', 'Satara', 'Kolhapur', 'Raigad'],
      affectedVillagesCount: 48,
      affectedParcelsCount: 3840,
      isroSatelliteSource: 'RISAT-1A SAR & Cartosat-3 High Resolution Water Inundation Mask',
      description: 'Heavy discharge of 45,000 cusecs from Khadakwasla & Radhanagari reservoirs. Mutha & Panchganga riverbanks inundated. High agricultural siltation risk.',
      collectorActionRequired: 'Activate Taluka disaster units, freeze non-essential title mutations in flood zones, schedule drone cadastral resurvey.',
      inspectionsDispatched: 18,
      status: 'ACTIVE',
      issuedAt: '2026-09-20T06:00:00Z',
    },
    {
      id: 'dis-002',
      alertCode: 'NDMA-ISRO-LND-2026-03',
      incidentType: 'LANDSLIDE',
      severity: 'WARNING',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      affectedDistricts: ['Pune', 'Raigad'],
      affectedVillagesCount: 6,
      affectedParcelsCount: 420,
      isroSatelliteSource: 'Cartosat-3 Digital Elevation Model (DEM) Slope Stability InSAR',
      description: 'Western Ghats slope displacement detected near Malin-Bhimashankar belt. Terrain deformation rate exceeds 22mm/day.',
      collectorActionRequired: 'Notify Sub-Divisional Officer Khed and dispatch geotechnical inspection squad immediately.',
      inspectionsDispatched: 4,
      status: 'ACTIVE',
      issuedAt: '2026-09-19T14:30:00Z',
    },
    {
      id: 'dis-003',
      alertCode: 'NDMA-ISRO-ENC-2026-11',
      incidentType: 'FOREST_ENCROACHMENT',
      severity: 'ADVISORY',
      stateCode: 'MH',
      stateName: 'Maharashtra',
      affectedDistricts: ['Thane', 'Palghar'],
      affectedVillagesCount: 12,
      affectedParcelsCount: 180,
      isroSatelliteSource: 'Sentinel-2 Normalized Difference Vegetation Index (NDVI) Change Layer',
      description: 'Unauthorized clearing of 14 hectares of Reserved Forest buffer identified adjacent to Survey 110/A.',
      collectorActionRequired: 'Joint inspection order issued to Deputy Conservator of Forests and Tehsildar.',
      inspectionsDispatched: 6,
      status: 'CONTAINED',
      issuedAt: '2026-09-14T09:15:00Z',
    },
  ];

  public auditEvents: NationalAuditEvent[] = [
    {
      id: 'aud-001',
      eventTimestamp: '2026-09-21T09:25:12Z',
      actorId: 'off-001',
      actorName: 'Dr. Ramesh Chandra Verma, IAS',
      actorEmail: 'dg.landrecords@nic.in',
      actorRole: 'SUPER_ADMIN',
      actionType: 'EXPORT',
      resourceType: 'NATIONAL_DILRMP_REPORT',
      resourceId: 'rep-dilrmp-q3-2026',
      ipAddress: '10.24.112.5 (NIC VPN Gateway)',
      deviceInfo: 'Government Secure Workstation (HP EliteDesk, Ubuntu NIC OS)',
      justificationReason: 'Quarterly review presentation for Ministry of Rural Development.',
      cryptographicHash: 'a8f5c3b2e9d4a1f78c2e6b9a4d1f8c3e7b2a9d4e1f8c3b7a9d4e2f1c8b3a7d9',
    },
    {
      id: 'aud-002',
      eventTimestamp: '2026-09-21T09:18:40Z',
      actorId: 'off-003',
      actorName: 'Dr. Suhas Diwase, IAS',
      actorEmail: 'collector.pune@gov.in',
      actorRole: 'DISTRICT_COLLECTOR',
      actionType: 'APPROVAL',
      resourceType: 'MUTATION_ORDER',
      resourceId: 'MUT-MH-PUN-HAV-2026-8812',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      ipAddress: '14.139.112.44 (Collectorate LAN)',
      deviceInfo: 'Apple MacBook Pro (e-Office Mobile Token)',
      justificationReason: 'Statutory succession mutation cleared under Maharashtra Land Revenue Code Section 149.',
      cryptographicHash: 'f4d2c8a1e7b9d3f6a2c8e1b7d4f9a3c6e2b8d1f7a4c9e3b6d2f8a1c7e4b9d3f',
    },
    {
      id: 'aud-003',
      eventTimestamp: '2026-09-21T09:05:18Z',
      actorId: 'off-004',
      actorName: 'Shri Mahesh Gopal Kulkarni',
      actorEmail: 'mahesh.kulkarni@gov.in',
      actorRole: 'VERIFICATION_OFFICER',
      actionType: 'CORRECTION',
      resourceType: 'FORM_8B_RECTIFICATION',
      resourceId: 'CORR-2026-0042',
      stateCode: 'MH',
      districtId: 'dist-mh-pune',
      ipAddress: '10.15.82.11 (Haveli Tehsil e-Chavdi)',
      deviceInfo: 'Windows 11 Enterprise (NIC Token ID #9982)',
      justificationReason: 'Corrected Hindi typographical error in owner patronymic name pursuant to MLRC Section 155.',
      cryptographicHash: 'c7e2b8d1f4a9c3e6b2d8f1a7c4e9b3d6f2a8c1e7b4d9f3a6c2e8b1d7f4a9c3e',
    },
    {
      id: 'aud-004',
      eventTimestamp: '2026-09-21T08:30:00Z',
      actorId: 'off-007',
      actorName: 'Er. Ankit Srivastava',
      actorEmail: 'ankit.ai@nic.in',
      actorRole: 'AI_OPS_ADMIN',
      actionType: 'ROLE_CHANGE',
      resourceType: 'SYSTEM_SETTINGS',
      resourceId: 'CONFIG_AI_THRESHOLD',
      ipAddress: '10.200.4.12 (NIC AI CoE Server)',
      deviceInfo: 'Dell Precision Linux Server',
      justificationReason: 'Increased minimum OCR cross-verification confidence threshold from 80% to 85%.',
      cryptographicHash: '1f8c3b7a9d4e2f1c8b3a7d9a8f5c3b2e9d4a1f78c2e6b9a4d1f8c3e7b2a9d4e',
    },
  ];

  public systemSettings: SystemSettingsConfig = {
    aiConfidenceThreshold: 85,
    is2faEnforcedNationwide: true,
    mutationSlaDays: 15,
    gisDiscrepancyToleranceMeters: 0.5,
    autoEscalateDisputesAfterDays: 30,
    enableDroneSurveySync: true,
    enableDigiLockerPush: true,
    activeLanguagePack: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn'],
    allowedExportFormats: ['PDF', 'EXCEL', 'CSV', 'GEOJSON'],
    maintenanceMode: false,
  };

  public roleMatrix: RoleMatrixItem[] = [
    {
      roleType: 'SUPER_ADMIN',
      roleLabel: 'Super Admin (GoI / MoRD)',
      securityClearance: 7,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      canExport: true,
      canManageAi: true,
      canManageGis: true,
      canManageReports: true,
      canAuditAccess: true,
      canEmergencyBroadcast: true,
    },
    {
      roleType: 'STATE_ADMIN',
      roleLabel: 'State Admin (Settlement Commissioner)',
      securityClearance: 6,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canExport: true,
      canManageAi: false,
      canManageGis: true,
      canManageReports: true,
      canAuditAccess: true,
      canEmergencyBroadcast: true,
    },
    {
      roleType: 'DISTRICT_COLLECTOR',
      roleLabel: 'District Collector & DM',
      securityClearance: 5,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canExport: true,
      canManageAi: false,
      canManageGis: true,
      canManageReports: true,
      canAuditAccess: true,
      canEmergencyBroadcast: true,
    },
    {
      roleType: 'VERIFICATION_OFFICER',
      roleLabel: 'Verification Officer (Circle / Tehsildar)',
      securityClearance: 4,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canExport: true,
      canManageAi: false,
      canManageGis: false,
      canManageReports: true,
      canAuditAccess: false,
      canEmergencyBroadcast: false,
    },
    {
      roleType: 'SURVEY_OFFICER',
      roleLabel: 'Survey Officer / Patwari (Talathi)',
      securityClearance: 3,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canManageAi: false,
      canManageGis: true,
      canManageReports: false,
      canAuditAccess: false,
      canEmergencyBroadcast: false,
    },
    {
      roleType: 'AUDITOR',
      roleLabel: 'Statutory Auditor (CAG / Vigilance)',
      securityClearance: 5,
      canRead: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canManageAi: false,
      canManageGis: false,
      canManageReports: true,
      canAuditAccess: true,
      canEmergencyBroadcast: false,
    },
    {
      roleType: 'AI_OPS_ADMIN',
      roleLabel: 'AI Operations Administrator (NIC CoE)',
      securityClearance: 6,
      canRead: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canExport: true,
      canManageAi: true,
      canManageGis: true,
      canManageReports: true,
      canAuditAccess: true,
      canEmergencyBroadcast: false,
    },
  ];

  public reports: ReportItem[] = [
    {
      id: 'rep-001',
      title: 'DILRMP National Land Records Digitization Status (Q3 2026)',
      reportType: 'NATIONAL_DILRMP',
      scope: 'All India (28 States & 8 UTs)',
      generatedBy: 'Dr. Ramesh Chandra Verma, IAS',
      generatedAt: '2026-09-20T10:00:00Z',
      fileFormat: 'PDF',
      fileSizeBytes: 4820000,
      downloadUrl: '/api/admin/reports/download/rep-001.pdf',
      status: 'READY',
    },
    {
      id: 'rep-002',
      title: 'Maharashtra State Cadastral & SVAMITVA Audit Summary',
      reportType: 'STATE_EXECUTIVE',
      scope: 'Maharashtra State (36 Districts)',
      generatedBy: 'Smt. Radhika P. Nambiar, IAS',
      generatedAt: '2026-09-19T14:30:00Z',
      fileFormat: 'EXCEL',
      fileSizeBytes: 2150000,
      downloadUrl: '/api/admin/reports/download/rep-002.xlsx',
      status: 'READY',
    },
    {
      id: 'rep-003',
      title: 'Pune District Land Title Verification & Mutation SLA Compliance',
      reportType: 'DISTRICT_PERFORMANCE',
      scope: 'Pune District (14 Talukas)',
      generatedBy: 'Dr. Suhas Diwase, IAS',
      generatedAt: '2026-09-18T16:00:00Z',
      fileFormat: 'PDF',
      fileSizeBytes: 1850000,
      downloadUrl: '/api/admin/reports/download/rep-003.pdf',
      status: 'READY',
    },
    {
      id: 'rep-004',
      title: 'National Forensic Fraud Analysis & Seal Tamper Trends',
      reportType: 'FRAUD_FORENSICS',
      scope: 'National Jurisdiction',
      generatedBy: 'Er. Ankit Srivastava',
      generatedAt: '2026-09-16T11:20:00Z',
      fileFormat: 'PDF',
      fileSizeBytes: 3420000,
      downloadUrl: '/api/admin/reports/download/rep-004.pdf',
      status: 'READY',
    },
  ];
}

export const nationalAdminDb = new NationalAdminDatabase();
