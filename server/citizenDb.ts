// In-memory persistent database store for BhoomiSetu Citizen Portal
// Mirrors PostgreSQL schema for high-speed offline/online operation

export interface CitizenProfileData {
  id: string;
  aadharMasked: string;
  phone: string;
  fullName: string;
  email?: string;
  district: string;
  taluka: string;
  village: string;
  preferredLanguage: 'en' | 'hi' | 'mr';
  isOtpVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearchItem {
  id: string;
  citizenId: string;
  searchType: string;
  query: string;
  filters?: any;
  resultsCount: number;
  createdAt: string;
}

export interface VoiceSearchLogItem {
  id: string;
  citizenId?: string;
  language: string;
  rawTranscript: string;
  structuredFilters: any;
  parsedSurvey?: string;
  parsedVillage?: string;
  matchedCount: number;
  timestamp: string;
}

export interface TrustCertificateItem {
  id: string;
  certificateNumber: string;
  parcelUid: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  district: string;
  areaHectares: number;
  trustScore: number;
  aiConfidence: number;
  officerVerifiedBy: string;
  qrHash: string;
  digitalSignature: string;
  issuedAt: string;
  expiresAt: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'TAMPERED';
}

export interface CorrectionRequestItem {
  id: string;
  trackingId: string;
  citizenId: string;
  parcelUid: string;
  surveyNumber: string;
  village: string;
  requestType: 'OWNER_NAME' | 'AREA' | 'BOUNDARY' | 'MUTATION' | 'DUPLICATE' | 'DOCUMENT_UPLOAD';
  currentDetails: string;
  requestedCorrection: string;
  evidenceFiles: string[];
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'FIELD_VERIFICATION' | 'RESOLVED' | 'REJECTED';
  assignedOfficer: string;
  officerRemarks?: string;
  citizenReplies?: { date: string; message: string; author: string }[];
  submittedAt: string;
  updatedAt: string;
}

export interface GrievanceTicketItem {
  id: string;
  ticketNumber: string;
  citizenId: string;
  category: 'LAND_RECORD_ISSUE' | 'VERIFICATION_DELAY' | 'FRAUD_REPORT' | 'GIS_ERROR' | 'MUTATION_DELAY' | 'TECHNICAL_ISSUE';
  subject: string;
  description: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'INVESTIGATING' | 'ACTION_TAKEN' | 'CLOSED';
  assignedOfficer?: string;
  resolutionNotes?: string;
  satisfactionRating?: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CitizenDocumentItem {
  id: string;
  citizenId: string;
  parcelUid: string;
  surveyNumber: string;
  title: string;
  documentType: 'ROR_7_12' | 'TRUST_CERT' | 'TIMELINE_REPORT' | 'MUTATION_SUMMARY' | 'INSPECTION_REPORT' | 'SURVEY_MAP';
  folder: 'VERIFIED_RECORDS' | 'DOWNLOADED_REPORTS' | 'PENDING_DOCS' | 'SHARED_CERTS' | 'FAVORITES';
  fileSize: string;
  fileFormat: string;
  downloadUrl: string;
  verificationHash: string;
  qrCodeUrl?: string;
  isArchived: boolean;
  isFavorite: boolean;
  issuedAt: string;
}

export interface CitizenNotificationItem {
  id: string;
  citizenId: string;
  title: string;
  message: string;
  type: 'VERIFICATION_COMPLETED' | 'CORRECTION_UPDATE' | 'MUTATION_APPROVED' | 'CERTIFICATE_READY' | 'TRUST_UPDATED' | 'GRIEVANCE_RESPONSE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'INFO';
  isRead: boolean;
  isArchive: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface DownloadHistoryItem {
  id: string;
  citizenId: string;
  documentTitle: string;
  documentType: string;
  parcelUid: string;
  ipAddress: string;
  downloadedAt: string;
}

export interface QrVerificationLogItem {
  id: string;
  qrHash: string;
  parcelUid?: string;
  verificationResult: 'VALID' | 'EXPIRED' | 'REVOKED' | 'TAMPERED';
  scannedAt: string;
  ipAddress: string;
  userAgent?: string;
  notes?: string;
}

export interface PortfolioParcelItem {
  id: string;
  citizenId: string;
  parcelUid: string;
  surveyNumber: string;
  village: string;
  taluka: string;
  district: string;
  areaHectares: number;
  landType: string;
  ownershipType: 'OWNED' | 'INHERITED' | 'PENDING_MUTATION';
  trustScore: number;
  verificationStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'ATTENTION_REQUIRED';
  isFavorite: boolean;
  photoPlaceholder: string;
  lastUpdated: string;
  addedAt: string;
}

class CitizenDatabase {
  public profile: CitizenProfileData = {
    id: 'citizen-user-001',
    aadharMasked: 'XXXX-XXXX-8421',
    phone: '9822019482',
    fullName: 'Rameshwar Dnyaneshwar Patil',
    email: 'rameshwar.patil@kisan.gov.in',
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Wagholi',
    preferredLanguage: 'hi',
    isOtpVerified: true,
    createdAt: '2025-04-10T10:00:00.000Z',
    updatedAt: '2026-09-20T08:30:00.000Z',
  };

  public portfolio: PortfolioParcelItem[] = [
    {
      id: 'port-1',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      areaHectares: 1.84,
      landType: 'Jirayat (Dry Crop Agricultural)',
      ownershipType: 'OWNED',
      trustScore: 98,
      verificationStatus: 'VERIFIED',
      isFavorite: true,
      photoPlaceholder: 'Agricultural Farmland with Drip Irrigation Border',
      lastUpdated: '12 Sep 2026',
      addedAt: '2025-05-14T09:00:00.000Z',
    },
    {
      id: 'port-2',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-C',
      surveyNumber: '142/2',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      areaHectares: 0.92,
      landType: 'Bagayat (Perennial Irrigated)',
      ownershipType: 'INHERITED',
      trustScore: 94,
      verificationStatus: 'VERIFIED',
      isFavorite: true,
      photoPlaceholder: 'Sugarcane Plot along North Feeder Canal',
      lastUpdated: '04 Aug 2026',
      addedAt: '2025-06-20T11:15:00.000Z',
    },
    {
      id: 'port-3',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
      surveyNumber: '88/4',
      village: 'Malegaon Budruk',
      taluka: 'Baramati',
      district: 'Pune',
      areaHectares: 2.10,
      landType: 'Agricultural cum Farmhouse',
      ownershipType: 'PENDING_MUTATION',
      trustScore: 68,
      verificationStatus: 'UNDER_REVIEW',
      isFavorite: false,
      photoPlaceholder: 'Boundary demarcated with stone pegs and tree line',
      lastUpdated: '18 Sep 2026',
      addedAt: '2026-02-10T14:20:00.000Z',
    },
  ];

  public savedSearches: SavedSearchItem[] = [
    {
      id: 'search-1',
      citizenId: 'citizen-user-001',
      searchType: 'SURVEY_NUMBER',
      query: 'Survey 142 Wagholi Haveli',
      resultsCount: 3,
      createdAt: '2026-09-15T08:12:00.000Z',
    },
    {
      id: 'search-2',
      citizenId: 'citizen-user-001',
      searchType: 'OWNER_NAME',
      query: 'Patil Rameshwar Dnyaneshwar',
      resultsCount: 2,
      createdAt: '2026-09-18T14:25:00.000Z',
    },
    {
      id: 'search-3',
      citizenId: 'citizen-user-001',
      searchType: 'NATURAL_LANGUAGE',
      query: 'Verified agricultural land above 1 hectare in Wagholi',
      resultsCount: 5,
      createdAt: '2026-09-20T09:40:00.000Z',
    },
  ];

  public voiceLogs: VoiceSearchLogItem[] = [
    {
      id: 'voice-1',
      citizenId: 'citizen-user-001',
      language: 'hi',
      rawTranscript: 'Mere pitaji Ram Singh ki zameen dikhao Wagholi mein',
      structuredFilters: {
        owner: 'Ram Singh',
        village: 'Wagholi',
        relationship: 'father',
      },
      parsedSurvey: '142',
      parsedVillage: 'Wagholi',
      matchedCount: 2,
      timestamp: '2026-09-20T10:14:00.000Z',
    },
    {
      id: 'voice-2',
      citizenId: 'citizen-user-001',
      language: 'mr',
      rawTranscript: 'वाघोली मधील गट क्रमांक १४२ चा सातबारा दाखवा',
      structuredFilters: {
        village: 'Wagholi',
        surveyNumber: '142',
        documentType: '7_12',
      },
      parsedSurvey: '142',
      parsedVillage: 'Wagholi',
      matchedCount: 2,
      timestamp: '2026-09-19T16:02:00.000Z',
    },
  ];

  public trustCertificates: TrustCertificateItem[] = [
    {
      id: 'cert-1',
      certificateNumber: 'DILRMP-MH-PUN-2026-981274',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      ownerName: 'Rameshwar Dnyaneshwar Patil',
      surveyNumber: '142/1',
      village: 'Wagholi',
      district: 'Pune',
      areaHectares: 1.84,
      trustScore: 98,
      aiConfidence: 99.4,
      officerVerifiedBy: 'Dr. Suhas Diwase, IAS (Collector & District Magistrate, Pune)',
      qrHash: 'BHULEKH-VERIFY-981274-PUN-HAV-142-A',
      digitalSignature: 'SHA256:8f4b1e9c7d2a5e8f0b3c6d9a1e4f7b2c5d8a0e3f6b9c2d5e8a1f4b7c0d3e6a9',
      issuedAt: '2026-08-15T00:00:00.000Z',
      expiresAt: '2027-08-14T23:59:59.000Z',
      status: 'VALID',
    },
    {
      id: 'cert-2',
      certificateNumber: 'DILRMP-MH-PUN-2025-410291',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-C',
      ownerName: 'Rameshwar Dnyaneshwar Patil & Brothers',
      surveyNumber: '142/2',
      village: 'Wagholi',
      district: 'Pune',
      areaHectares: 0.92,
      trustScore: 94,
      aiConfidence: 96.8,
      officerVerifiedBy: 'Anand Rayate, IAS (Sub-Divisional Officer, Haveli)',
      qrHash: 'BHULEKH-VERIFY-410291-PUN-HAV-142-C',
      digitalSignature: 'SHA256:7c3a0d8b6f1e4d7a9c2e5f8b0d3a6c9e1f4b7d0a3c6e9f2b5d8a1c4e7f0b3d6',
      issuedAt: '2025-09-01T00:00:00.000Z',
      expiresAt: '2026-08-31T23:59:59.000Z',
      status: 'EXPIRED',
    },
    {
      id: 'cert-3',
      certificateNumber: 'DILRMP-MH-PUN-2024-118490',
      parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
      ownerName: 'Vikramaditya Harishchandra Jadhav',
      surveyNumber: '88/4',
      village: 'Malegaon Budruk',
      district: 'Pune',
      areaHectares: 2.10,
      trustScore: 68,
      aiConfidence: 81.2,
      officerVerifiedBy: 'Tehsildar Office, Baramati',
      qrHash: 'BHULEKH-REVOKED-118490-BAR-88-B',
      digitalSignature: 'SHA256:REVOKED-UNDER-CIVIL-SUIT-104-2024',
      issuedAt: '2024-03-10T00:00:00.000Z',
      expiresAt: '2027-03-10T00:00:00.000Z',
      status: 'REVOKED',
    },
    {
      id: 'cert-4',
      certificateNumber: 'DILRMP-MH-PUN-2023-FAKE-999',
      parcelUid: 'IN-MH-PUN-FRAUD-00099',
      ownerName: 'Unknown Counterfeit Claim',
      surveyNumber: '99/X',
      village: 'Unauthorized Settlement',
      district: 'Pune',
      areaHectares: 0.50,
      trustScore: 12,
      aiConfidence: 18.0,
      officerVerifiedBy: 'Forged Seal Detected',
      qrHash: 'BHULEKH-TAMPERED-DETECTED-SEAL-MISMATCH',
      digitalSignature: 'SHA256:TAMPERED-HASH-DOES-NOT-MATCH-BLOCKCHAIN-ROOT',
      issuedAt: '2023-01-01T00:00:00.000Z',
      expiresAt: '2024-01-01T00:00:00.000Z',
      status: 'TAMPERED',
    },
  ];

  public correctionRequests: CorrectionRequestItem[] = [
    {
      id: 'corr-1',
      trackingId: 'CR-MH-2026-89412',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      village: 'Wagholi',
      requestType: 'OWNER_NAME',
      currentDetails: 'Ramesh Patil (Spelling omission in middle name)',
      requestedCorrection: 'Rameshwar Dnyaneshwar Patil as per Aadhaar & 2012 Sale Deed',
      evidenceFiles: ['Aadhaar_Card_Verified.pdf', 'SaleDeed_2012_Registered.pdf'],
      status: 'FIELD_VERIFICATION',
      assignedOfficer: 'Talathi S. M. Kulkarni (Haveli Circle)',
      officerRemarks: 'Aadhaar matching 100%. Field panchnama scheduled for 24 Sep 2026.',
      citizenReplies: [
        {
          date: '18 Sep 2026',
          author: 'Rameshwar Patil',
          message: 'Original sale deed photocopy submitted to Talathi office Wagholi.',
        },
      ],
      submittedAt: '2026-09-14T11:20:00.000Z',
      updatedAt: '2026-09-18T15:45:00.000Z',
    },
    {
      id: 'corr-2',
      trackingId: 'CR-MH-2026-44109',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-C',
      surveyNumber: '142/2',
      village: 'Wagholi',
      requestType: 'BOUNDARY',
      currentDetails: 'Eastern canal boundary peg shifted by 1.2 meters during road paving',
      requestedCorrection: 'Restore ETS survey coordinate pegs as per 2019 Cadastral Map',
      evidenceFiles: ['ETS_Survey_Map_2019.pdf', 'Site_Photo_Canal_Peg.jpg'],
      status: 'UNDER_REVIEW',
      assignedOfficer: 'Circle Officer Haveli',
      officerRemarks: 'Cadastral GIS overlay requested from DILRMP Pune cell.',
      submittedAt: '2026-09-02T10:00:00.000Z',
      updatedAt: '2026-09-05T12:30:00.000Z',
    },
  ];

  public grievances: GrievanceTicketItem[] = [
    {
      id: 'grv-1',
      ticketNumber: 'GRV-PUN-2026-00431',
      citizenId: 'citizen-user-001',
      category: 'MUTATION_DELAY',
      subject: 'Delay in sanction of Heirship Mutation Notice No. 8419',
      description: 'Heirship notice was published 30 days ago. 15-day statutory notice period has lapsed without any third-party objection. Requesting Tehsildar approval.',
      priority: 'HIGH',
      status: 'INVESTIGATING',
      assignedOfficer: 'Naib Tehsildar (Land Records), Haveli',
      resolutionNotes: 'File scrutinized. Objection period cleared on 12 Sep 2026. Forwarded for digital signature.',
      satisfactionRating: 4,
      attachments: ['Ferfar_Notice_8419.pdf', 'GramPanchayat_NOC.pdf'],
      createdAt: '2026-09-10T14:30:00.000Z',
      updatedAt: '2026-09-19T11:00:00.000Z',
    },
  ];

  public documents: CitizenDocumentItem[] = [
    {
      id: 'doc-1',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      title: 'Digital 7/12 RoR (Record of Rights) with QR',
      documentType: 'ROR_7_12',
      folder: 'VERIFIED_RECORDS',
      fileSize: '1.4 MB',
      fileFormat: 'PDF',
      downloadUrl: '/api/citizen/download/doc-1',
      verificationHash: 'SHA256:712-WAGHOLI-142-1-VERIFIED-2026',
      qrCodeUrl: 'BHULEKH-DOC-712-142-1',
      isArchived: false,
      isFavorite: true,
      issuedAt: '2026-09-15T09:30:00.000Z',
    },
    {
      id: 'doc-2',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      title: 'National AI Trust Certificate (DILRMP 98/100)',
      documentType: 'TRUST_CERT',
      folder: 'VERIFIED_RECORDS',
      fileSize: '890 KB',
      fileFormat: 'PDF',
      downloadUrl: '/api/citizen/download/doc-2',
      verificationHash: 'SHA256:TRUST-CERT-981274-PUN-HAV',
      qrCodeUrl: 'BHULEKH-VERIFY-981274-PUN-HAV-142-A',
      isArchived: false,
      isFavorite: true,
      issuedAt: '2026-08-15T00:00:00.000Z',
    },
    {
      id: 'doc-3',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      title: '70-Year Ownership Lineage & Timeline Dossier',
      documentType: 'TIMELINE_REPORT',
      folder: 'DOWNLOADED_REPORTS',
      fileSize: '3.2 MB',
      fileFormat: 'PDF',
      downloadUrl: '/api/citizen/download/doc-3',
      verificationHash: 'SHA256:LINEAGE-DOSSIER-1954-2026',
      qrCodeUrl: 'BHULEKH-TIMELINE-142-1',
      isArchived: false,
      isFavorite: false,
      issuedAt: '2026-09-10T16:20:00.000Z',
    },
    {
      id: 'doc-4',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-C',
      surveyNumber: '142/2',
      title: 'Mutation Ferfar Entry No. 8419 (Heirship Partition)',
      documentType: 'MUTATION_SUMMARY',
      folder: 'PENDING_DOCS',
      fileSize: '1.1 MB',
      fileFormat: 'PDF',
      downloadUrl: '/api/citizen/download/doc-4',
      verificationHash: 'SHA256:FERFAR-8419-WAGHOLI-PENDING',
      qrCodeUrl: 'BHULEKH-FERFAR-8419',
      isArchived: false,
      isFavorite: false,
      issuedAt: '2026-08-20T14:10:00.000Z',
    },
    {
      id: 'doc-5',
      citizenId: 'citizen-user-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/1',
      title: 'High-Resolution Drone Cadastral Survey Map (1:500)',
      documentType: 'SURVEY_MAP',
      folder: 'FAVORITES',
      fileSize: '4.8 MB',
      fileFormat: 'PDF',
      downloadUrl: '/api/citizen/download/doc-5',
      verificationHash: 'SHA256:CADASTRAL-MAP-142-1-ETS-2026',
      qrCodeUrl: 'BHULEKH-MAP-142-1',
      isArchived: false,
      isFavorite: true,
      issuedAt: '2026-07-11T12:00:00.000Z',
    },
  ];

  public notifications: CitizenNotificationItem[] = [
    {
      id: 'notif-c-1',
      citizenId: 'citizen-user-001',
      title: 'Digital 7/12 RoR Verification Completed',
      message: 'Survey No. 142/1, Wagholi has achieved 98/100 AI Trust Score with zero encumbrance.',
      type: 'VERIFICATION_COMPLETED',
      priority: 'HIGH',
      isRead: false,
      isArchive: false,
      actionUrl: '/citizen/trust',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-c-2',
      citizenId: 'citizen-user-001',
      title: 'Correction Request Under Field Verification',
      message: 'Application CR-MH-2026-89412 assigned to Talathi S. M. Kulkarni. Panchnama on 24 Sep.',
      type: 'CORRECTION_UPDATE',
      priority: 'MEDIUM',
      isRead: false,
      isArchive: false,
      actionUrl: '/citizen/corrections',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'notif-c-3',
      citizenId: 'citizen-user-001',
      title: 'Mutation Heirship Notice Sanctioned',
      message: 'Notice period completed for Ferfar No. 8419. Digital certificate ready for download.',
      type: 'MUTATION_APPROVED',
      priority: 'INFO',
      isRead: true,
      isArchive: false,
      actionUrl: '/citizen/documents',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'notif-c-4',
      citizenId: 'citizen-user-001',
      title: 'New Drone Cadastral Map Available',
      message: 'Swamitva drone survey 5cm resolution layer updated for Wagholi revenue block.',
      type: 'CERTIFICATE_READY',
      priority: 'INFO',
      isRead: true,
      isArchive: false,
      actionUrl: '/citizen/portfolio',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  public downloadHistory: DownloadHistoryItem[] = [
    {
      id: 'down-1',
      citizenId: 'citizen-user-001',
      documentTitle: 'Digital 7/12 RoR (Survey 142/1 Wagholi)',
      documentType: 'ROR_7_12',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      ipAddress: '103.14.88.42',
      downloadedAt: '2026-09-18T14:10:00.000Z',
    },
    {
      id: 'down-2',
      citizenId: 'citizen-user-001',
      documentTitle: 'National AI Trust Certificate',
      documentType: 'TRUST_CERT',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      ipAddress: '103.14.88.42',
      downloadedAt: '2026-09-15T09:45:00.000Z',
    },
  ];

  public qrLogs: QrVerificationLogItem[] = [
    {
      id: 'qrlog-1',
      qrHash: 'BHULEKH-VERIFY-981274-PUN-HAV-142-A',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      verificationResult: 'VALID',
      scannedAt: '2026-09-19T11:20:00.000Z',
      ipAddress: '49.36.120.18',
      userAgent: 'Citizen Mobile PWA Scanner (Android 14)',
      notes: 'Cryptographic SHA-256 digital signature verified against NIC Maharashtra State node.',
    },
  ];

  // Syncs officer uploaded & verified land record into the Citizen Portal
  public syncVerifiedParcel(data: {
    parcelUid: string;
    surveyNumber: string;
    ownerName: string;
    village: string;
    taluka: string;
    district: string;
    areaHectares: number;
    landType?: string;
    trustScore?: number;
    status?: 'VERIFIED' | 'UNDER_REVIEW' | 'ATTENTION_REQUIRED';
    mutationNumber?: string;
    documentYear?: number;
  }) {
    const existingIndex = this.portfolio.findIndex(
      (p) => p.parcelUid === data.parcelUid || p.surveyNumber === data.surveyNumber
    );

    const score = data.trustScore ?? 98;
    const nowIso = new Date().toISOString();
    const verStatus = data.status || 'VERIFIED';

    if (existingIndex >= 0) {
      // Update existing portfolio parcel
      this.portfolio[existingIndex] = {
        ...this.portfolio[existingIndex],
        surveyNumber: data.surveyNumber,
        village: data.village,
        taluka: data.taluka,
        district: data.district,
        areaHectares: data.areaHectares,
        landType: data.landType || this.portfolio[existingIndex].landType,
        trustScore: score,
        verificationStatus: verStatus,
        lastUpdated: 'Just now (Officer Ingested)',
      };
    } else {
      // Prepend newly ingested parcel to citizen portfolio
      const newPortfolioItem: PortfolioParcelItem = {
        id: `port-${Date.now()}`,
        citizenId: this.profile.id,
        parcelUid: data.parcelUid,
        surveyNumber: data.surveyNumber,
        village: data.village,
        taluka: data.taluka,
        district: data.district,
        areaHectares: data.areaHectares,
        landType: data.landType || 'Jirayat Agricultural Farmland',
        ownershipType: 'OWNED',
        trustScore: score,
        verificationStatus: verStatus,
        isFavorite: true,
        photoPlaceholder: 'Agricultural Farmland with Drip Irrigation Border',
        lastUpdated: 'Just now (Officer Ingested)',
        addedAt: nowIso,
      };
      this.portfolio.unshift(newPortfolioItem);
    }

    // Add / Update Trust Certificate
    const existingCertIndex = this.trustCertificates.findIndex(
      (c) => c.parcelUid === data.parcelUid || c.surveyNumber === data.surveyNumber
    );
    const certItem: TrustCertificateItem = {
      id: `cert-${Date.now()}`,
      certificateNumber: `NIC-BHU-CERT-${Date.now().toString().slice(-6)}`,
      parcelUid: data.parcelUid,
      ownerName: data.ownerName,
      surveyNumber: data.surveyNumber,
      village: data.village,
      district: data.district,
      areaHectares: data.areaHectares,
      trustScore: score,
      aiConfidence: 99.4,
      officerVerifiedBy: 'Sub-Divisional Revenue Officer / Tehsildar',
      qrHash: `BHULEKH-VERIFY-${Date.now()}-${data.surveyNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
      digitalSignature: `SHA256-NIC-GOV-MAHA-${Date.now()}`,
      issuedAt: nowIso,
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      status: 'VALID',
    };
    if (existingCertIndex >= 0) {
      this.trustCertificates[existingCertIndex] = certItem;
    } else {
      this.trustCertificates.unshift(certItem);
    }

    // Add Official 7/12 RoR to Citizen Document Wallet
    this.documents.unshift({
      id: `doc-c-${Date.now()}`,
      citizenId: this.profile.id,
      parcelUid: data.parcelUid,
      surveyNumber: data.surveyNumber,
      title: `Digital 7/12 RoR Extract (Survey ${data.surveyNumber} ${data.village})`,
      documentType: 'ROR_7_12',
      folder: 'VERIFIED_RECORDS',
      fileSize: '1.4 MB',
      fileFormat: 'PDF (Digital Sign)',
      downloadUrl: `/api/citizen/712-pdf/${data.parcelUid}`,
      verificationHash: `SHA-256-${Date.now()}`,
      qrCodeUrl: `https://bhulekh.gov.in/verify/${data.parcelUid}`,
      isArchived: false,
      isFavorite: true,
      issuedAt: nowIso,
    });

    // Send High-Priority Citizen Notification
    this.notifications.unshift({
      id: `notif-c-${Date.now()}`,
      citizenId: this.profile.id,
      title: `Land Record Ingested & Verified: Survey ${data.surveyNumber}`,
      message: `Land parcel in ${data.village}, ${data.taluka} has been processed through all 6 AI verification steps by the Revenue Officer and synced to your Citizen Dossier.`,
      type: 'VERIFICATION_COMPLETED',
      priority: 'HIGH',
      isRead: false,
      isArchive: false,
      actionUrl: '/citizen/portfolio',
      createdAt: nowIso,
    });
  }
}

export const citizenDb = new CitizenDatabase();
