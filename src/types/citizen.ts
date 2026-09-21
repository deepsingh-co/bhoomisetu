export interface CitizenParcel {
  id: string;
  parcelUid: string;
  surveyNumber: string;
  khataNumber?: string;
  khasraNumber?: string;
  ownerName: string;
  maskedOwnerName: string;
  village: string;
  taluka: string;
  district: string;
  areaHectares: number;
  areaGunthas: number;
  landType: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'UNDER_REVIEW';
  trustScore: number;
  trustStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'ATTENTION_REQUIRED';
  aiConfidence: number;
  lastUpdated: string;
  ownershipType?: 'OWNED' | 'INHERITED' | 'PENDING_MUTATION';
  isFavorite?: boolean;
  photoPlaceholder?: string;
  gisCoordinates?: { lat: number; lng: number };
}

export interface CitizenTrustPillar {
  id: string;
  name: string;
  score: number;
  status: 'PASSED' | 'PENDING' | 'ATTENTION';
  details: string;
}

export interface CitizenTrustData {
  overallScore: number;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'TAMPERED';
  trustCategory: 'GREEN_VERIFIED' | 'ORANGE_UNDER_REVIEW' | 'RED_ATTENTION_REQUIRED';
  parcelUid: string;
  surveyNumber: string;
  village: string;
  ownerName: string;
  maskedOwnerName: string;
  areaHectares: number;
  officerVerifiedBy: string;
  lastVerificationDate: string;
  qrHash: string;
  digitalSignature: string;
  pillars: CitizenTrustPillar[];
  timeline: { date: string; event: string }[];
}

export interface CitizenCorrectionItem {
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

export interface CitizenGrievanceItem {
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

export interface CitizenWalletDocument {
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

export interface CitizenTimelineEvent {
  id: string;
  year: number;
  date: string;
  category: 'OWNERSHIP' | 'MUTATION' | 'VERIFICATION' | 'INSPECTION' | 'SATELLITE_CHANGE' | 'CORRECTION' | 'DOWNLOAD';
  title: string;
  description: string;
  actor: string;
  status: string;
  hasMapSnapshot: boolean;
}

export type CitizenActiveTab =
  | 'dashboard'
  | 'search'
  | 'voice'
  | 'portfolio'
  | 'trust'
  | 'qr-verify'
  | 'timeline'
  | 'parcel-page'
  | 'correction'
  | 'grievance'
  | 'certificates'
  | 'wallet'
  | 'map'
  | 'notifications'
  | 'profile'
  | 'activity'
  | 'help';
