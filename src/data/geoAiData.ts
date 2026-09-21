import {
  GeoParcelFeature,
  VillageTwinData,
  GraphNode,
  GraphEdge,
  SatelliteComparisonData,
  EncroachmentCase,
  FieldInspectionRecord,
  GeoAlertItem,
} from '../types/geoAi';

export const MOCK_GEO_PARCELS: GeoParcelFeature[] = [
  {
    type: 'Feature',
    id: 'IN-MH-PUN-HAV-2024-00142-A',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9815, 18.5790],
          [73.9835, 18.5792],
          [73.9838, 18.5808],
          [73.9818, 18.5806],
          [73.9815, 18.5790]
        ]
      ]
    },
    properties: {
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/2A',
      khasraNumber: '142-ख',
      khataNumber: '884',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      owner: 'Smt. Sunita Ramesh Patil',
      coOwners: ['Ramesh D. Patil (Spouse)', 'Kiran R. Patil (Son)'],
      cadastralAreaHa: 1.84,
      observedAreaHa: 1.83,
      landUse: 'AGRICULTURE',
      verificationStatus: 'VERIFIED',
      trustScore: 94.8,
      riskLevel: 'LOW',
      hasEncroachment: false,
      pendingMutation: false,
      lastSatelliteSurvey: '2026-02-14 (Cartosat-3)',
      centroid: [18.5799, 73.9826],
    }
  },
  {
    type: 'Feature',
    id: 'IN-MH-PUN-BAR-2023-00088-B',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9840, 18.5791],
          [73.9860, 18.5793],
          [73.9858, 18.5810],
          [73.9839, 18.5808],
          [73.9840, 18.5791]
        ]
      ]
    },
    properties: {
      parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
      surveyNumber: '88/1B',
      khasraNumber: '88-क',
      khataNumber: '412',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      owner: 'Shri Vikram Chandrakant Shinde',
      coOwners: ['Pravin C. Shinde (Brother - Disputed Co-sharer)'],
      cadastralAreaHa: 2.15,
      observedAreaHa: 2.41,
      landUse: 'COMMERCIAL',
      verificationStatus: 'FLAGGED',
      trustScore: 42.0,
      riskLevel: 'CRITICAL',
      hasEncroachment: true,
      encroachmentType: 'Canal 50m Buffer Violation & Village Road Reserve',
      pendingMutation: true,
      hasCourtStay: true,
      lastSatelliteSurvey: '2026-03-01 (Cartosat-3 0.28m)',
      centroid: [18.5801, 73.9849],
    }
  },
  {
    type: 'Feature',
    id: 'IN-MH-PUN-MUL-2024-00214-0',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9805, 18.5815],
          [73.9825, 18.5818],
          [73.9822, 18.5832],
          [73.9802, 18.5828],
          [73.9805, 18.5815]
        ]
      ]
    },
    properties: {
      parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
      surveyNumber: '214/4',
      khasraNumber: '214-ग',
      khataNumber: '529',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      owner: 'M/s Sahyadri Agro Processing LLP',
      coOwners: ['Anand Deshmukh (Managing Partner)'],
      cadastralAreaHa: 3.40,
      observedAreaHa: 3.39,
      landUse: 'INDUSTRIAL',
      verificationStatus: 'UNDER_REVIEW',
      trustScore: 78.5,
      riskLevel: 'MEDIUM',
      hasEncroachment: false,
      pendingMutation: true,
      lastSatelliteSurvey: '2026-01-20 (Resourcesat-2A)',
      centroid: [18.5823, 73.9813],
    }
  },
  {
    type: 'Feature',
    id: 'IN-MH-PUN-HAV-2024-00305-C',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9785, 18.5780],
          [73.9805, 18.5782],
          [73.9802, 18.5798],
          [73.9782, 18.5796],
          [73.9785, 18.5780]
        ]
      ]
    },
    properties: {
      parcelUid: 'IN-MH-PUN-HAV-2024-00305-C',
      surveyNumber: '305/1',
      khasraNumber: '305-अ',
      khataNumber: '614',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      owner: 'Shri Dattatray Bapu Jagtap',
      coOwners: ['Laxman B. Jagtap (Brother)'],
      cadastralAreaHa: 1.10,
      observedAreaHa: 1.09,
      landUse: 'AGRICULTURE',
      verificationStatus: 'VERIFIED',
      trustScore: 96.0,
      riskLevel: 'LOW',
      hasEncroachment: false,
      pendingMutation: false,
      lastSatelliteSurvey: '2026-02-28 (Cartosat-3)',
      centroid: [18.5789, 73.9793],
    }
  },
  {
    type: 'Feature',
    id: 'IN-MH-PUN-HAV-2024-00109-D',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [73.9830, 18.5765],
          [73.9850, 18.5768],
          [73.9848, 18.5782],
          [73.9828, 18.5780],
          [73.9830, 18.5765]
        ]
      ]
    },
    properties: {
      parcelUid: 'IN-MH-PUN-HAV-2024-00109-D',
      surveyNumber: '109/3',
      khasraNumber: '109-क',
      khataNumber: '730',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      owner: 'Shri Santosh Mahadev Gaikwad',
      coOwners: ['Anita S. Gaikwad'],
      cadastralAreaHa: 1.45,
      observedAreaHa: 1.62,
      landUse: 'RESIDENTIAL',
      verificationStatus: 'PENDING',
      trustScore: 68.0,
      riskLevel: 'HIGH',
      hasEncroachment: true,
      encroachmentType: 'Boundary Fence Overlap with Plot #109/2 (315 sqm)',
      pendingMutation: true,
      lastSatelliteSurvey: '2026-03-02 (Drone SVAMITVA)',
      centroid: [18.5773, 73.9839],
    }
  }
];

export const MOCK_VILLAGES: VillageTwinData[] = [
  {
    id: 'v-wagholi-001',
    censusCode: '27-521-0428-00214',
    villageName: 'Wagholi (वाघोली)',
    taluka: 'Haveli (हवेली)',
    district: 'Pune (पुणे)',
    state: 'Maharashtra',
    pincode: '412207',
    totalAreaHa: 1420.5,
    totalParcels: 842,
    digitizedParcels: 824,
    verifiedParcels: 768,
    pendingVerification: 42,
    highRiskParcels: 14,
    disputeParcels: 18,
    mutationBacklog: 26,
    centerLat: 18.5793,
    centerLng: 73.9822,
    amenities: [
      { id: 'am-1', name: 'Gram Panchayat Karyalaya, Wagholi', type: 'PANCHAYAT_OFFICE', lat: 18.5796, lng: 73.9818, status: 'Active (Citizen Service Center)' },
      { id: 'am-2', name: 'Zilla Parishad Primary School (ZP Vidyamandir)', type: 'SCHOOL', lat: 18.5810, lng: 73.9835, status: 'Active (Govt Aided)' },
      { id: 'am-3', name: 'MSEDCL 33/11kV Substation', type: 'ELECTRICITY', lat: 18.5780, lng: 73.9850, status: 'Critical Power Grid Infra' },
      { id: 'am-4', name: 'Wagholi Gramin Community Water Tank & Well', type: 'WATER_BODY', lat: 18.5772, lng: 73.9790, status: 'Statutory 30m Water Buffer' },
      { id: 'am-5', name: 'Mutha Right Bank Canal Distributary #4', type: 'CANAL', lat: 18.5830, lng: 73.9760, status: 'State Irrigation 50m Protected Buffer' },
      { id: 'am-6', name: 'Primary Health Sub-Center (PHC Wagholi)', type: 'HEALTH_CENTER', lat: 18.5802, lng: 73.9841, status: 'Active Medical Post' },
      { id: 'am-7', name: 'Wagholi Gaothan Reserved Forest Patch', type: 'FOREST', lat: 18.5860, lng: 73.9890, status: 'Eco-Sensitive Forest Zone' },
      { id: 'am-8', name: 'Pune-Nagar Highway (SH-27) Express Corridor', type: 'ROAD', lat: 18.5760, lng: 73.9820, status: 'Major Arterial Highway (60m ROW)' },
    ],
    heatmaps: {
      verificationPct: 91.2,
      mutationDensity: 'High (North-East Growth Corridor)',
      fraudIncidence: 'Low (2 active flagged seals detected)',
      disputeHotspots: ['Survey #142/2A', 'Survey #88/1B', 'Survey #214/4'],
    }
  },
  {
    id: 'v-bavdhan-002',
    censusCode: '27-521-0428-00215',
    villageName: 'Bavdhan Budruk (बावधन बुद्रुक)',
    taluka: 'Mulshi (मुळशी)',
    district: 'Pune (पुणे)',
    state: 'Maharashtra',
    pincode: '411021',
    totalAreaHa: 1180.2,
    totalParcels: 612,
    digitizedParcels: 598,
    verifiedParcels: 540,
    pendingVerification: 46,
    highRiskParcels: 12,
    disputeParcels: 14,
    mutationBacklog: 18,
    centerLat: 18.5158,
    centerLng: 73.7707,
    amenities: [
      { id: 'bm-1', name: 'Bavdhan Gram Panchayat Office', type: 'PANCHAYAT_OFFICE', lat: 18.5160, lng: 73.7710, status: 'Active' },
      { id: 'bm-2', name: 'Ramnadi River Natural Drainage Channel', type: 'WATER_BODY', lat: 18.5140, lng: 73.7690, status: 'Protected Flood Basin' },
    ],
    heatmaps: {
      verificationPct: 88.2,
      mutationDensity: 'Moderate',
      fraudIncidence: 'Very Low',
      disputeHotspots: ['Survey #44/2', 'Survey #51/3'],
    }
  }
];

export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'n-parcel', label: 'Parcel Survey #88/1B', type: 'PARCEL', color: '#123A78', details: 'Area: 2.15 Ha, Village: Wagholi, ULPIN: IN-MH-PUN-BAR-2023-00088-B', x: 260, y: 190 },
  { id: 'n-owner-curr', label: 'Vikram C. Shinde', type: 'OWNER', color: '#0B7A3B', details: 'Current Registered Co-owner (50% share on 7/12 RoR)', x: 120, y: 90 },
  { id: 'n-owner-co', label: 'Pravin C. Shinde', type: 'OWNER', color: '#B42318', details: 'Disputed Co-sharer (Suit #2024/712 in Civil Court)', x: 120, y: 290 },
  { id: 'n-owner-prev', label: 'Chandrakant B. Shinde (Dec.)', type: 'FAMILY', color: '#64748B', details: 'Father & Original Registered Titleholder (Settlement 1978)', x: 30, y: 190 },
  { id: 'n-village', label: 'Wagholi Village #214', type: 'VILLAGE', color: '#0284C7', details: 'Haveli Taluka, Pune District (Census #27-521-0428-00214)', x: 420, y: 70 },
  { id: 'n-mutation', label: 'Mutation Ferfar #4120', type: 'MUTATION', color: '#B26A00', details: 'Waris Ferfar Partition (Contested - Pending Notice)', x: 420, y: 210 },
  { id: 'n-court', label: 'Civil Injunction #94/2024', type: 'COURT_CASE', color: '#DC2626', details: 'Stay on Alienation & Third Party Rights Creation', x: 260, y: 340 },
  { id: 'n-inspection', label: 'Geo Inspection #GI-2026-081', type: 'INSPECTION', color: '#8B5CF6', details: 'Ground Truth Verification with GPS Lock (Thorat, Talathi)', x: 440, y: 310 },
  { id: 'n-bank-loan', label: 'SBI Agri Hypothecation', type: 'LOAN_HYPOTHECATION', color: '#D97706', details: '₹14,50,000 Crop Loan Charge Recorded in RoR Col 12', x: 140, y: 380 },
  { id: 'n-doc-ror', label: 'Digital 7/12 RoR (Bhoomi)', type: 'DOCUMENT', color: '#475569', details: 'Cryptographically Verified with SHA-256 Stamp', x: 260, y: 50 },
];

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { source: 'n-owner-curr', target: 'n-parcel', label: 'OWNS (50% share)', type: 'OWNS' },
  { source: 'n-owner-co', target: 'n-parcel', label: 'CLAIMS SHARE', type: 'DISPUTE' },
  { source: 'n-owner-prev', target: 'n-owner-curr', label: 'FATHER OF', type: 'FAMILY' },
  { source: 'n-owner-prev', target: 'n-owner-co', label: 'FATHER OF', type: 'FAMILY' },
  { source: 'n-owner-prev', target: 'n-parcel', label: 'OWNED (1978-2016)', type: 'PREVIOUS_OWNER' },
  { source: 'n-parcel', target: 'n-village', label: 'LOCATED IN', type: 'LOCATION' },
  { source: 'n-mutation', target: 'n-parcel', label: 'APPLIED TO', type: 'MUTATION' },
  { source: 'n-court', target: 'n-parcel', label: 'INJUNCTION ON', type: 'INJUNCTION' },
  { source: 'n-inspection', target: 'n-parcel', label: 'INSPECTED', type: 'INSPECTION' },
  { source: 'n-bank-loan', target: 'n-parcel', label: 'HYPOTHECATED', type: 'LOAN' },
  { source: 'n-doc-ror', target: 'n-parcel', label: 'TITLE FOR', type: 'DOCUMENT' },
];

export const MOCK_SATELLITE_COMPARISON: SatelliteComparisonData = {
  parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
  baselineYear: 2018,
  baselineSensor: 'Resourcesat-2A (LISS-IV 5.8m Multi-Spectral)',
  baselineCaptureDate: '2018-04-12',
  baselineLandUse: 'Intensive Agriculture (Sugarcane & Fallow)',
  baselineBuiltUpPct: 2.4,
  currentYear: 2026,
  currentSensor: 'ISRO Cartosat-3 (PAN 0.28m + MS 1.12m Ortho)',
  currentCaptureDate: '2026-02-28',
  currentLandUse: 'Commercial Plotted Shed & Road Encroachment',
  currentBuiltUpPct: 34.8,
  changeMetrics: {
    netChangePct: 32.4,
    builtUpIncreaseSqm: 3240,
    vegetationDepletionSqm: 2850,
    aiConfidence: 97.4,
    unauthorizedConversionFlag: true,
    detectionModel: 'DeepResNet-LULC-v4.2 trained on NRSC-Bhuvan Geo-Tiles',
  },
  aiSummary: 'Autonomous spatial comparison between 2018 LISS-IV baseline and 2026 Cartosat-3 orthorectified imagery detects a +32.4% unauthorized land use shift from agricultural crop cover to semi-permanent commercial godowns, including 320 sqm construction directly infringing upon the public village road easement.'
};

export const MOCK_ENCROACHMENTS: EncroachmentCase[] = [
  {
    id: 'enc-1',
    parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
    surveyNumber: '88/1B',
    village: 'Wagholi',
    type: 'CANAL_BUFFER_AND_ROAD_RESERVE',
    severity: 'CRITICAL',
    overlapAreaSqm: 800,
    infringedFeature: 'Mutha Canal 50m Statutory Green Buffer (480 sqm) + Haveli ZP Road (320 sqm)',
    confidenceScore: 98.2,
    detectedVia: 'ISRO Cartosat-3 0.28m PAN-Sharpened',
    inspectionStatus: 'INSPECTION_REQUISITIONED',
    actionRequired: 'Issue Section 53 MRTP Act Demolition Notice and freeze online mutation transfer.'
  },
  {
    id: 'enc-2',
    parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
    surveyNumber: '214/4',
    village: 'Wagholi',
    type: 'FOREST_BOUNDARY_PROXIMITY',
    severity: 'MEDIUM',
    overlapAreaSqm: 120,
    infringedFeature: 'Gaothan Social Forestry Compartment #42 boundary buffer',
    confidenceScore: 89.4,
    detectedVia: 'Resourcesat-2A LISS-IV Multi-Spectral',
    inspectionStatus: 'TALATHI_REVIEW_PENDING',
    actionRequired: 'Joint demarcation survey scheduled with Forest Range Officer.'
  },
  {
    id: 'enc-3',
    parcelUid: 'IN-MH-PUN-HAV-2024-00109-D',
    surveyNumber: '109/3',
    village: 'Wagholi',
    type: 'NEIGHBORING_PARCEL_OVERLAP',
    severity: 'HIGH',
    overlapAreaSqm: 315,
    infringedFeature: 'Survey #109/2 Cadastral Boundary Line (Physical Wire Fencing Overlap)',
    confidenceScore: 94.6,
    detectedVia: 'Drone SVAMITVA High-Res Orthomosaic',
    inspectionStatus: 'HEARING_SCHEDULED',
    actionRequired: 'Boundary Rectification Hearing before Sub-Divisional Officer (SDO) under Section 138.'
  }
];

export const MOCK_INSPECTIONS: FieldInspectionRecord[] = [
  {
    id: 'insp-101',
    inspectionCode: 'GI-2026-081',
    parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
    surveyNumber: '88/1B',
    inspectorName: 'R. K. Thorat',
    inspectorDesignation: 'Talathi, Wagholi Saja #3',
    date: '2026-02-24',
    status: 'COMPLETED',
    gpsCoordinates: { lat: 18.5801, lng: 73.9849, accuracyM: 2.1 },
    compassBearing: 48.5,
    checklist: {
      boundaryMarkersVerified: true,
      ownerPresent: true,
      landmarkMatched: true,
      photoCaptured: true,
      encroachmentConfirmed: true,
    },
    geoPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        caption: 'North-East Corner Boundary Pillar #4 with RCC Shed Infringing upon PWD Road (320 sqm)',
        timestamp: '2026-02-24 11:42 AM'
      },
      {
        url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80',
        caption: 'Mutha Canal Embankment Boundary Marker with concrete footing over stepping stones',
        timestamp: '2026-02-24 11:58 AM'
      }
    ],
    remarks: 'Ground inspection carried out in presence of panchas and applicant. Observed unauthorized commercial godown structure with tin roof extending beyond registered survey boundary by 22.4 meters.',
  }
];

export const MOCK_GEO_ALERTS: GeoAlertItem[] = [
  {
    id: 'alt-1',
    alertCode: 'GA-2026-0041',
    parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
    surveyNumber: '88/1B',
    village: 'Wagholi',
    title: 'High Risk: Satellite Detected 320 sqm Road Encroachment',
    description: 'Cartosat-3 high-resolution raster detects structural footprint expansion across surveyed village road right-of-way.',
    category: 'ENCROACHMENT',
    priority: 'URGENT',
    timestamp: '15 mins ago',
    isAcknowledged: false,
  },
  {
    id: 'alt-2',
    alertCode: 'GA-2026-0038',
    parcelUid: 'IN-MH-PUN-HAV-2024-00109-D',
    surveyNumber: '109/3',
    village: 'Wagholi',
    title: 'Boundary Variance: 11.7% Area Discrepancy Flagged',
    description: 'Cadastral RoR states 1.45 Ha while drone SVAMITVA parcel polygon measures 1.62 Ha.',
    category: 'SATELLITE_CHANGE',
    priority: 'HIGH',
    timestamp: '1 hour ago',
    isAcknowledged: false,
  },
  {
    id: 'alt-3',
    alertCode: 'GA-2026-0029',
    parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
    surveyNumber: '214/4',
    village: 'Wagholi',
    title: 'Eco-Buffer Alert: Commercial Building in Forest Vicinity',
    description: 'New industrial agro-shed constructed within 100m of Social Forestry patch without non-agricultural forest clearance.',
    category: 'ENVIRONMENTAL',
    priority: 'MEDIUM',
    timestamp: '3 hours ago',
    isAcknowledged: true,
  }
];
