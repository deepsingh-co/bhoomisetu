import { Router } from 'express';

export const geoAiRouter = Router();

// Mock GeoJSON Village Boundaries and Parcels
const VILLAGE_DIGITAL_TWIN = {
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
    { id: 'am-1', name: 'Gram Panchayat Karyalaya, Wagholi', type: 'PANCHAYAT_OFFICE', lat: 18.5796, lng: 73.9818, status: 'Active' },
    { id: 'am-2', name: 'Zilla Parishad Primary School (ZP Vidyamandir)', type: 'SCHOOL', lat: 18.5810, lng: 73.9835, status: 'Active' },
    { id: 'am-3', name: 'MSEDCL 33/11kV Power Substation', type: 'ELECTRICITY', lat: 18.5780, lng: 73.9850, status: 'Critical Infra' },
    { id: 'am-4', name: 'Wagholi Gramin Community Water Tank & Well', type: 'WATER_BODY', lat: 18.5772, lng: 73.9790, status: 'Protected' },
    { id: 'am-5', name: 'Mutha Right Bank Canal Distributary #4', type: 'CANAL', lat: 18.5830, lng: 73.9760, status: 'Irrigation Buffer' },
    { id: 'am-6', name: 'Primary Health Sub-Center (PHC Wagholi)', type: 'HEALTH_CENTER', lat: 18.5802, lng: 73.9841, status: 'Active' },
    { id: 'am-7', name: 'Wagholi Gaothan Reserved Forest Patch', type: 'FOREST', lat: 18.5860, lng: 73.9890, status: 'Eco-Sensitive' },
  ],
  heatmaps: {
    verificationPct: 91.2,
    mutationDensity: 'High (North-East Growth Corridor)',
    fraudIncidence: 'Low (2 active flagged seals)',
    disputeHotspots: ['Survey #142/2A', 'Survey #88/1', 'Survey #214'],
  }
};

// 1. GET /api/gis/villages
geoAiRouter.get('/villages', (req, res) => {
  res.json({
    success: true,
    total: 3,
    villages: [
      VILLAGE_DIGITAL_TWIN,
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
      },
      {
        id: 'v-baramati-003',
        censusCode: '27-521-0430-00109',
        villageName: 'Malegaon Budruk (माळेगाव बुद्रुक)',
        taluka: 'Baramati (बारामती)',
        district: 'Pune (पुणे)',
        state: 'Maharashtra',
        pincode: '413115',
        totalAreaHa: 2240.8,
        totalParcels: 1120,
        digitizedParcels: 1098,
        verifiedParcels: 1040,
        pendingVerification: 55,
        highRiskParcels: 8,
        disputeParcels: 17,
        mutationBacklog: 31,
        centerLat: 18.1520,
        centerLng: 74.5760,
      }
    ]
  });
});

// 2. GET /api/gis/parcels - List parcels with GeoJSON and filtering
geoAiRouter.get('/parcels', (req, res) => {
  const { village, search, status, risk } = req.query;

  const geoJsonFeatures = [
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
        landUse: 'RESIDENTIAL_EXPANSION',
        verificationStatus: 'FLAGGED',
        trustScore: 42.0,
        riskLevel: 'CRITICAL',
        hasEncroachment: true,
        encroachmentType: 'CANAL_BUFFER_AND_GOVT_RESERVE',
        pendingMutation: true,
        lastSatelliteSurvey: '2026-03-01 (Cartosat-3 0.28m)',
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
        landUse: 'AGRO_INDUSTRIAL',
        verificationStatus: 'UNDER_REVIEW',
        trustScore: 78.5,
        riskLevel: 'MEDIUM',
        hasEncroachment: false,
        pendingMutation: true,
        lastSatelliteSurvey: '2026-01-20 (Resourcesat-2A)',
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
      }
    }
  ];

  res.json({
    type: 'FeatureCollection',
    totalFeatures: geoJsonFeatures.length,
    features: geoJsonFeatures,
  });
});

// 3. GET /api/gis/parcel/:id
geoAiRouter.get('/parcel/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    parcel: {
      parcelUid: id,
      surveyNumber: '88/1B',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      ownerName: 'Shri Vikram Chandrakant Shinde',
      coOwners: ['Pravin Chandrakant Shinde (Brother - Disputed Co-sharer)'],
      khataNumber: '412',
      khasraNumber: '88-क',
      totalAreaCadastralHa: 2.15,
      totalAreaObservedHa: 2.41,
      varianceSqm: 2600,
      currentLandUse: 'Commercial / Residential Plotted Extension',
      registeredLandUse: 'Jirayat (Dry Crop Agriculture)',
      trustScorePct: 42.0,
      verificationStatus: 'FLAGGED',
      disputeRisk: 'CRITICAL',
      aiEncroachmentAlert: 'Active overlap detected with Mutha Canal 50m green buffer zone (480 sqm) and road reserve (320 sqm).',
      dnaHash: '0x8f7d92a1c4e5b308e7a6f21c9b0e3d5a7f8e9a2b1c3d4e5f6a7b8c9d0e1f2a3b',
      environmental: {
        floodRisk: 'Moderate (Canal Overflow Zone)',
        riverBufferViolation: true,
        forestProximityMeters: 450,
        elevationMeters: 582,
        annualRainfallMm: 720,
        droughtIndex: 'Normal',
      },
      verificationOfficers: [
        { role: 'Talathi', name: 'R. K. Thorat', date: '2026-01-14', status: 'Approved' },
        { role: 'Circle Officer', name: 'V. S. Kulkarni', date: '2026-02-02', status: 'Flagged Mismatch' },
        { role: 'Tehsildar AI Review', name: 'Bhulekh AI Agent v3', date: '2026-02-24', status: 'Encroachment Hold' },
      ]
    }
  });
});

// 4. GET /api/gis/satellite/compare - Before & After Satellite Comparison
geoAiRouter.get('/satellite/compare', (req, res) => {
  const { parcelUid = 'IN-MH-PUN-BAR-2023-00088-B' } = req.query;
  res.json({
    parcelUid,
    baselineYear: 2018,
    baselineSensor: 'Resourcesat-2A (LISS-IV 5.8m)',
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
  });
});

// 5. GET /api/gis/graph/:parcelId - Knowledge Graph with Nodes and Relationships
geoAiRouter.get('/graph/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  res.json({
    parcelId,
    nodes: [
      { id: 'n-parcel', label: `Parcel Survey #${parcelId}`, type: 'PARCEL', color: '#123A78', details: 'Area: 2.15 Ha, Village: Wagholi' },
      { id: 'n-owner-curr', label: 'Vikram C. Shinde', type: 'OWNER', color: '#0B7A3B', details: 'Current Registered Co-owner (Share: 50%)' },
      { id: 'n-owner-co', label: 'Pravin C. Shinde', type: 'OWNER', color: '#B42318', details: 'Disputed Co-sharer (Suit #2024/712)' },
      { id: 'n-owner-prev', label: 'Chandrakant B. Shinde (Deceased)', type: 'FAMILY', color: '#64748B', details: 'Father & Original Titleholder (1978)' },
      { id: 'n-village', label: 'Wagholi Village #214', type: 'VILLAGE', color: '#0284C7', details: 'Haveli Taluka, Pune District' },
      { id: 'n-mutation', label: 'Mutation Ferfar #4120', type: 'MUTATION', color: '#B26A00', details: 'Waris Ferfar Partition (Contested)' },
      { id: 'n-court', label: 'Civil Court Stay Order #94/2024', type: 'COURT_CASE', color: '#DC2626', details: 'Interim Injunction against Third-party Alienation' },
      { id: 'n-inspection', label: 'Geo Inspection #GI-2026-081', type: 'INSPECTION', color: '#8B5CF6', details: 'Ground Truth Verification with GPS check-in' },
      { id: 'n-bank-loan', label: 'SBI Agri Hypothecation (₹14.5L)', type: 'LOAN_HYPOTHECATION', color: '#D97706', details: 'Charge registered on 7/12 RoR (Bhoomi)' },
      { id: 'n-doc-ror', label: 'Digital RoR 7/12 (Mahabhulekh)', type: 'DOCUMENT', color: '#475569', details: 'Cryptographically Verified Document' },
    ],
    edges: [
      { source: 'n-owner-curr', target: 'n-parcel', label: 'OWNS (50% share)', type: 'OWNS' },
      { source: 'n-owner-co', target: 'n-parcel', label: 'CLAIMS SHARE', type: 'DISPUTE' },
      { source: 'n-owner-prev', target: 'n-owner-curr', label: 'FATHER OF', type: 'FAMILY_TREE' },
      { source: 'n-owner-prev', target: 'n-owner-co', label: 'FATHER OF', type: 'FAMILY_TREE' },
      { source: 'n-owner-prev', target: 'n-parcel', label: 'OWNED PREVIOUSLY (1978-2016)', type: 'OWNED_PREVIOUSLY' },
      { source: 'n-parcel', target: 'n-village', label: 'LOCATED IN', type: 'LOCATED_IN' },
      { source: 'n-mutation', target: 'n-parcel', label: 'MUTATION APPLIED TO', type: 'LINKED_MUTATION' },
      { source: 'n-court', target: 'n-parcel', label: 'CIVIL INJUNCTION ON', type: 'HAS_INJUNCTION' },
      { source: 'n-inspection', target: 'n-parcel', label: 'FIELD INSPECTED', type: 'INSPECTED_BY' },
      { source: 'n-bank-loan', target: 'n-parcel', label: 'ENCUMBRANCE REGISTERED', type: 'HAS_ENCUMBRANCE' },
      { source: 'n-doc-ror', target: 'n-parcel', label: 'LEGAL RECORD FOR', type: 'LINKED_DOCUMENT' },
    ],
    aiInsights: [
      'Pravin C. Shinde and Vikram C. Shinde inherited jointly under succession entry #3104; omission of Pravin\'s consent in Mutation #4120 triggered Civil Court Injunction #94/2024.',
      'SBI Agriculture Mortgage of ₹14,50,000 remains undischarged in the other rights column (इतर अधिकार).',
      'Ground Inspection #GI-2026-081 matches 100% with the satellite change anomaly detected by ISRO Cartosat-3.'
    ]
  });
});

// 6. POST /api/gis/inspection - Schedule or Record Field Geo Inspection
geoAiRouter.post('/inspection', (req, res) => {
  const { parcelUid, inspectorName, latitude, longitude, remarks, checklist } = req.body;
  res.json({
    success: true,
    inspectionId: `GI-${Date.now().toString().slice(-6)}`,
    status: 'RECORDED_TO_LAND_DNA',
    timestamp: new Date().toISOString(),
    hash: '0x' + Math.random().toString(16).substring(2, 42),
    message: 'Field inspection successfully verified with GPS coordinate lock and committed to the official Land DNA blockchain ledger.'
  });
});

// 7. GET /api/gis/district-analytics - Collector Command Center Metrics
geoAiRouter.get('/district-analytics', (req, res) => {
  res.json({
    district: 'Pune District (पुणे जिल्हा)',
    state: 'Maharashtra',
    reportingDate: '2026-09-21',
    collectorName: 'Dr. Suhas Diwase, IAS (District Collector & Magistrate)',
    summary: {
      totalTalukas: 14,
      totalVillages: 1872,
      totalParcels: 1420850,
      parcelsDigitized: 1398200,
      digitizationPct: 98.4,
      parcelsVerified: 1284500,
      verificationPct: 90.4,
      highRiskParcels: 3410,
      activeEncroachments: 842,
      satelliteAlertsThisMonth: 128,
      avgResolutionDays: 11.4,
    },
    talukaRankings: [
      { taluka: 'Haveli', totalParcels: 164200, verifiedPct: 94.2, backlog: 412, fraudHotspots: 14, score: 92 },
      { taluka: 'Baramati', totalParcels: 142100, verifiedPct: 92.8, backlog: 290, fraudHotspots: 8, score: 90 },
      { taluka: 'Mulshi', totalParcels: 98400, verifiedPct: 88.5, backlog: 384, fraudHotspots: 19, score: 84 },
      { taluka: 'Khed (Rajgurunagar)', totalParcels: 122000, verifiedPct: 87.2, backlog: 420, fraudHotspots: 16, score: 82 },
      { taluka: 'Shirur', totalParcels: 110500, verifiedPct: 89.1, backlog: 310, fraudHotspots: 11, score: 85 },
      { taluka: 'Maval', totalParcels: 88200, verifiedPct: 86.4, backlog: 490, fraudHotspots: 23, score: 80 },
    ],
    fraudTrends: [
      { month: 'Apr 2026', detected: 42, resolved: 38 },
      { month: 'May 2026', detected: 51, resolved: 46 },
      { month: 'Jun 2026', detected: 39, resolved: 41 },
      { month: 'Jul 2026', detected: 47, resolved: 44 },
      { month: 'Aug 2026', detected: 33, resolved: 36 },
      { month: 'Sep 2026', detected: 28, resolved: 31 },
    ]
  });
});

// 8. GET /api/gis/encroachments
geoAiRouter.get('/encroachments', (req, res) => {
  res.json({
    total: 3,
    encroachments: [
      {
        id: 'enc-1',
        parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
        surveyNumber: '88/1B',
        village: 'Wagholi',
        type: 'CANAL_BUFFER_AND_ROAD_RESERVE',
        severity: 'CRITICAL',
        overlapAreaSqm: 800,
        infringedFeature: 'Mutha Canal 50m Statutory Green Buffer + Haveli ZP Road',
        confidenceScore: 98.2,
        detectedVia: 'ISRO Cartosat-3 0.28m PAN-Sharpened',
        inspectionStatus: 'INSPECTION_REQUISITIONED',
        actionRequired: 'Issue Section 53 MRTP Notice & Demolition Hold'
      },
      {
        id: 'enc-2',
        parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
        surveyNumber: '214/4',
        village: 'Wagholi',
        type: 'FOREST_BOUNDARY_PROXIMITY',
        severity: 'MEDIUM',
        overlapAreaSqm: 120,
        infringedFeature: 'Gaothan Social Forestry Compartment #42',
        confidenceScore: 89.4,
        detectedVia: 'Resourcesat-2A LISS-IV',
        inspectionStatus: 'TALATHI_REVIEW_PENDING',
        actionRequired: 'Joint Demarcation Survey with Forest Department'
      },
      {
        id: 'enc-3',
        parcelUid: 'IN-MH-PUN-HAV-2024-00109-D',
        surveyNumber: '109/3',
        village: 'Wagholi',
        type: 'NEIGHBORING_PARCEL_OVERLAP',
        severity: 'HIGH',
        overlapAreaSqm: 315,
        infringedFeature: 'Survey #109/2 Boundary Line (Encroached Fencing)',
        confidenceScore: 94.6,
        detectedVia: 'Drone SVAMITVA ETS Orthomosaic',
        inspectionStatus: 'HEARING_SCHEDULED',
        actionRequired: 'Boundary Rectification Hearing before Tehsildar'
      }
    ]
  });
});
