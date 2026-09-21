export interface GeoParcelFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    parcelUid: string;
    surveyNumber: string;
    khasraNumber: string;
    khataNumber: string;
    village: string;
    taluka: string;
    district: string;
    owner: string;
    coOwners: string[];
    cadastralAreaHa: number;
    observedAreaHa: number;
    landUse: 'AGRICULTURE' | 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'FOREST' | 'WATER_BODY' | 'BARREN';
    verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'UNDER_REVIEW';
    trustScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    hasEncroachment: boolean;
    encroachmentType?: string;
    pendingMutation: boolean;
    hasCourtStay?: boolean;
    lastSatelliteSurvey: string;
    centroid: [number, number]; // [lat, lng]
  };
}

export interface VillageTwinData {
  id: string;
  censusCode: string;
  villageName: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  totalAreaHa: number;
  totalParcels: number;
  digitizedParcels: number;
  verifiedParcels: number;
  pendingVerification: number;
  highRiskParcels: number;
  disputeParcels: number;
  mutationBacklog: number;
  centerLat: number;
  centerLng: number;
  amenities: VillageAmenity[];
  heatmaps: {
    verificationPct: number;
    mutationDensity: string;
    fraudIncidence: string;
    disputeHotspots: string[];
  };
}

export interface VillageAmenity {
  id: string;
  name: string;
  type: 'PANCHAYAT_OFFICE' | 'SCHOOL' | 'ELECTRICITY' | 'WATER_BODY' | 'CANAL' | 'HEALTH_CENTER' | 'FOREST' | 'ROAD';
  lat: number;
  lng: number;
  status: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'PARCEL' | 'OWNER' | 'FAMILY' | 'VILLAGE' | 'MUTATION' | 'VERIFICATION' | 'INSPECTION' | 'LOAN_HYPOTHECATION' | 'COURT_CASE' | 'DOCUMENT';
  color: string;
  details: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  type: string;
}

export interface SatelliteComparisonData {
  parcelUid: string;
  baselineYear: number;
  baselineSensor: string;
  baselineCaptureDate: string;
  baselineLandUse: string;
  baselineBuiltUpPct: number;
  currentYear: number;
  currentSensor: string;
  currentCaptureDate: string;
  currentLandUse: string;
  currentBuiltUpPct: number;
  changeMetrics: {
    netChangePct: number;
    builtUpIncreaseSqm: number;
    vegetationDepletionSqm: number;
    aiConfidence: number;
    unauthorizedConversionFlag: boolean;
    detectionModel: string;
  };
  aiSummary: string;
}

export interface EncroachmentCase {
  id: string;
  parcelUid: string;
  surveyNumber: string;
  village: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  overlapAreaSqm: number;
  infringedFeature: string;
  confidenceScore: number;
  detectedVia: string;
  inspectionStatus: string;
  actionRequired: string;
}

export interface FieldInspectionRecord {
  id: string;
  inspectionCode: string;
  parcelUid: string;
  surveyNumber: string;
  inspectorName: string;
  inspectorDesignation: string;
  date: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED';
  gpsCoordinates: { lat: number; lng: number; accuracyM: number };
  compassBearing: number;
  checklist: {
    boundaryMarkersVerified: boolean;
    ownerPresent: boolean;
    landmarkMatched: boolean;
    photoCaptured: boolean;
    encroachmentConfirmed: boolean;
  };
  geoPhotos: Array<{ url: string; caption: string; timestamp: string }>;
  remarks: string;
  voiceNoteUrl?: string;
}

export interface GeoAlertItem {
  id: string;
  alertCode: string;
  parcelUid: string;
  surveyNumber: string;
  village: string;
  title: string;
  description: string;
  category: 'SATELLITE_CHANGE' | 'ENCROACHMENT' | 'DISPUTE_RISK' | 'MUTATION_ALERT' | 'ENVIRONMENTAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  timestamp: string;
  isAcknowledged: boolean;
}
