import { Router } from 'express';
import { citizenDb } from '../citizenDb.js';
import { landDb } from '../landRecordsDb.js';

export const citizenRouter = Router();

// 1. Universal Land Search Engine (Feature 2)
citizenRouter.get('/search', (req, res) => {
  const {
    query = '',
    type = 'ALL',
    district,
    taluka,
    village,
    landType,
    verifiedOnly,
    minArea,
    maxArea,
  } = req.query;

  const q = String(query).trim().toLowerCase();
  let results = [...landDb.parcels];

  if (q) {
    results = results.filter((p) => {
      const matchSurvey = p.surveyNumber.toLowerCase().includes(q);
      const matchOwner = p.ownerName.toLowerCase().includes(q);
      const matchVillage = p.village.toLowerCase().includes(q);
      const matchTaluka = p.taluka.toLowerCase().includes(q);
      const matchUid = p.parcelUid.toLowerCase().includes(q);
      const matchLandType = (p.landType || '').toLowerCase().includes(q);
      return matchSurvey || matchOwner || matchVillage || matchTaluka || matchUid || matchLandType;
    });
  }

  if (district && district !== 'ALL') {
    results = results.filter((p) => (p.district || 'Pune').toLowerCase() === String(district).toLowerCase());
  }

  if (taluka && taluka !== 'ALL') {
    results = results.filter((p) => p.taluka.toLowerCase() === String(taluka).toLowerCase());
  }

  if (village && village !== 'ALL') {
    results = results.filter((p) => p.village.toLowerCase() === String(village).toLowerCase());
  }

  if (landType && landType !== 'ALL') {
    results = results.filter((p) => (p.landType || '').toLowerCase().includes(String(landType).toLowerCase()));
  }

  if (verifiedOnly === 'true') {
    results = results.filter((p) => p.status === 'VERIFIED');
  }

  if (minArea) {
    const min = parseFloat(String(minArea));
    if (!isNaN(min)) results = results.filter((p) => p.landAreaHa >= min);
  }

  if (maxArea) {
    const max = parseFloat(String(maxArea));
    if (!isNaN(max)) results = results.filter((p) => p.landAreaHa <= max);
  }

  // Map to Citizen-friendly Search Card structure
  const formattedResults = results.map((p) => {
    const cert = citizenDb.trustCertificates.find((c) => c.parcelUid === p.parcelUid);
    const trustScore = cert ? cert.trustScore : p.status === 'VERIFIED' ? 96 : 74;

    return {
      id: p.id,
      parcelUid: p.parcelUid,
      surveyNumber: p.surveyNumber,
      khataNumber: `KH-${p.surveyNumber.replace('/', '-')}`,
      khasraNumber: p.surveyNumber,
      ownerName: p.ownerName,
      maskedOwnerName: maskName(p.ownerName),
      village: p.village,
      taluka: p.taluka,
      district: p.district || 'Pune',
      areaHectares: p.landAreaHa,
      areaGunthas: Math.round(p.landAreaHa * 40),
      landType: p.landType || 'Agricultural Jirayat',
      status: p.status,
      trustScore,
      trustStatus: trustScore >= 85 ? 'VERIFIED' : trustScore >= 60 ? 'UNDER_REVIEW' : 'ATTENTION_REQUIRED',
      aiConfidence: cert ? cert.aiConfidence : 95.8,
      lastUpdated: '16 Sep 2026',
      gisCoordinates: p.dna?.centroid || { lat: 18.5793, lng: 73.9812 },
      has712Pdf: true,
      hasTrustCert: true,
    };
  });

  // Log recent search if query exists
  if (q && q.length > 2) {
    const existing = citizenDb.savedSearches.find((s) => s.query.toLowerCase() === q);
    if (!existing) {
      citizenDb.savedSearches.unshift({
        id: `search-${Date.now()}`,
        citizenId: citizenDb.profile.id,
        searchType: String(type),
        query: String(query),
        resultsCount: formattedResults.length,
        createdAt: new Date().toISOString(),
      });
      if (citizenDb.savedSearches.length > 10) citizenDb.savedSearches.pop();
    }
  }

  res.json({
    total: formattedResults.length,
    results: formattedResults,
    recentSearches: citizenDb.savedSearches.slice(0, 5),
  });
});

// Helper to mask owner name for public-safe views
function maskName(name: string): string {
  const parts = name.split(' ');
  return parts
    .map((p, i) => {
      if (p.length <= 2) return p;
      if (i === 0) return p; // First name clear
      return `${p[0]}${'*'.repeat(Math.min(4, p.length - 2))}${p[p.length - 1]}`;
    })
    .join(' ');
}

// 2. Voice-Based Rural Land Search (Feature 3)
citizenRouter.post('/voice-search', (req, res) => {
  const { transcript = '', language = 'hi' } = req.body;
  const rawText = String(transcript).trim();

  // Natural Language & Voice Intent Extraction
  let parsedSurvey: string | null = null;
  let parsedVillage: string | null = null;
  let parsedOwner: string | null = null;
  let minArea: number | null = null;
  let verifiedOnly = false;

  const lower = rawText.toLowerCase();

  // Extract Survey / Khasra number
  const surveyMatch = lower.match(/(?:survey|khasra|gat|number|no|क्रमांक|नंबर|सर्वे)\s*(?:no\.?|number)?\s*(\d+(?:[\/\-]\d+)?)/i);
  if (surveyMatch) {
    parsedSurvey = surveyMatch[1].replace('-', '/');
  }

  // Extract Village
  if (lower.includes('wagholi') || lower.includes('वाघोली')) parsedVillage = 'Wagholi';
  else if (lower.includes('malegaon') || lower.includes('माळेगाव')) parsedVillage = 'Malegaon Budruk';
  else if (lower.includes('bavdhan') || lower.includes('बावधन')) parsedVillage = 'Bavdhan Khurd';
  else if (lower.includes('rampur') || lower.includes('रामपुर')) parsedVillage = 'Wagholi'; // Maps to demo village

  // Extract Owner / Relation
  if (lower.includes('ram singh') || lower.includes('राम सिंह') || lower.includes('pitaji') || lower.includes('पिताजी')) {
    parsedOwner = 'Ram Singh';
  } else if (lower.includes('patil') || lower.includes('पाटील') || lower.includes('rameshwar')) {
    parsedOwner = 'Rameshwar Patil';
  }

  // Extract Area constraints
  if (lower.includes('2 hectare') || lower.includes('२ हेक्टर')) {
    minArea = 2.0;
  } else if (lower.includes('1 hectare') || lower.includes('१ हेक्टर')) {
    minArea = 1.0;
  }

  if (lower.includes('verified') || lower.includes('सत्यापित') || lower.includes('पडताळणी')) {
    verifiedOnly = true;
  }

  // Filter against database
  let matches = [...landDb.parcels];

  if (parsedSurvey) {
    matches = matches.filter((p) => p.surveyNumber.includes(parsedSurvey!));
  }
  if (parsedVillage) {
    matches = matches.filter((p) => p.village.toLowerCase() === parsedVillage!.toLowerCase());
  }
  if (parsedOwner) {
    matches = matches.filter((p) => p.ownerName.toLowerCase().includes(parsedOwner!.toLowerCase()) || p.ownerName.includes('Patil'));
  }
  if (minArea !== null) {
    matches = matches.filter((p) => p.landAreaHa >= minArea!);
  }

  if (matches.length === 0) {
    // Fallback to top verified parcels so user always gets a helpful result
    matches = landDb.parcels.slice(0, 3);
  }

  const structuredFilters = {
    surveyNumber: parsedSurvey,
    village: parsedVillage,
    owner: parsedOwner,
    minArea,
    verifiedOnly,
  };

  // Log in voice_search_logs
  const logEntry = {
    id: `voice-${Date.now()}`,
    citizenId: citizenDb.profile.id,
    language,
    rawTranscript: rawText,
    structuredFilters,
    parsedSurvey: parsedSurvey || undefined,
    parsedVillage: parsedVillage || undefined,
    matchedCount: matches.length,
    timestamp: new Date().toISOString(),
  };
  citizenDb.voiceLogs.unshift(logEntry);

  res.json({
    success: true,
    language,
    transcript: rawText,
    structuredFilters,
    matchedCount: matches.length,
    results: matches.map((p) => ({
      id: p.id,
      parcelUid: p.parcelUid,
      surveyNumber: p.surveyNumber,
      ownerName: p.ownerName,
      maskedOwnerName: maskName(p.ownerName),
      village: p.village,
      taluka: p.taluka,
      areaHectares: p.landAreaHa,
      status: p.status,
      trustScore: p.status === 'VERIFIED' ? 98 : 72,
      landType: p.landType,
    })),
    voiceLogId: logEntry.id,
  });
});

// 3. My Land Portfolio (Feature 4)
citizenRouter.get('/portfolio', (req, res) => {
  const { district, village, landType, verifiedOnly } = req.query;
  let items = [...citizenDb.portfolio];

  if (district && district !== 'ALL') {
    items = items.filter((p) => p.district.toLowerCase() === String(district).toLowerCase());
  }
  if (village && village !== 'ALL') {
    items = items.filter((p) => p.village.toLowerCase() === String(village).toLowerCase());
  }
  if (landType && landType !== 'ALL') {
    items = items.filter((p) => p.landType.toLowerCase().includes(String(landType).toLowerCase()));
  }
  if (verifiedOnly === 'true') {
    items = items.filter((p) => p.verificationStatus === 'VERIFIED');
  }

  const summary = {
    totalParcels: citizenDb.portfolio.length,
    ownedCount: citizenDb.portfolio.filter((p) => p.ownershipType === 'OWNED').length,
    inheritedCount: citizenDb.portfolio.filter((p) => p.ownershipType === 'INHERITED').length,
    pendingMutationCount: citizenDb.portfolio.filter((p) => p.ownershipType === 'PENDING_MUTATION').length,
    totalAreaHectares: Number(citizenDb.portfolio.reduce((sum, p) => sum + p.areaHectares, 0).toFixed(2)),
    averageTrustScore: Math.round(
      citizenDb.portfolio.reduce((sum, p) => sum + p.trustScore, 0) / citizenDb.portfolio.length
    ),
  };

  res.json({
    summary,
    parcels: items,
    citizen: citizenDb.profile,
  });
});

// 4. Citizen Trust Score System (Feature 5)
citizenRouter.get('/trust/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  const parcel =
    landDb.parcels.find((p) => p.id === parcelId || p.parcelUid === parcelId || p.surveyNumber === parcelId) ||
    landDb.parcels[0];

  const cert =
    citizenDb.trustCertificates.find((c) => c.parcelUid === parcel.parcelUid) || citizenDb.trustCertificates[0];

  const trustBreakdown = {
    overallScore: cert.trustScore,
    status: cert.status,
    trustCategory:
      cert.trustScore >= 85 ? 'GREEN_VERIFIED' : cert.trustScore >= 60 ? 'ORANGE_UNDER_REVIEW' : 'RED_ATTENTION_REQUIRED',
    parcelUid: parcel.parcelUid,
    surveyNumber: parcel.surveyNumber,
    village: parcel.village,
    ownerName: parcel.ownerName,
    maskedOwnerName: maskName(parcel.ownerName),
    areaHectares: parcel.landAreaHa,
    officerVerifiedBy: cert.officerVerifiedBy,
    lastVerificationDate: '15 Aug 2026',
    qrHash: cert.qrHash,
    digitalSignature: cert.digitalSignature,

    // The 6 Government Pillars of Trust
    pillars: [
      {
        id: 'ai-verification',
        name: 'AI Document Cross-Verification',
        score: 99,
        status: 'PASSED',
        details: '100% OCR field-level cross-match against Mahabhulekh Central Repository and 2012 Sale Deed.',
      },
      {
        id: 'officer-verification',
        name: 'Officer Field Panchnama Verification',
        score: 98,
        status: 'PASSED',
        details: 'Inspected on-site by Talathi S. M. Kulkarni and confirmed by Tehsildar Haveli.',
      },
      {
        id: 'gis-verification',
        name: 'GIS & Satellite Truth Verification',
        score: 97,
        status: 'PASSED',
        details: 'Cartosat-3 (0.28m) boundary match; zero encroachment on 50m canal buffer and social forestry.',
      },
      {
        id: 'fraud-check',
        name: 'Forensic Fraud & Stamp Tamper Check',
        score: 100,
        status: 'PASSED',
        details: 'Zero forgery detected on Tehsildar rubber seal; physical paper watermarks confirmed.',
      },
      {
        id: 'timeline-verification',
        name: '70-Year Ownership Chain Verification',
        score: 96,
        status: 'PASSED',
        details: 'Unbroken chain of 5 revenue mutations from 1954 to 2026 without any civil injunction stay.',
      },
      {
        id: 'document-integrity',
        name: 'Cryptographic Document Integrity',
        score: 100,
        status: 'PASSED',
        details: 'NIC National Blockchain Hash anchored; SHA-256 digital certificate matches registry master.',
      },
    ],

    timeline: [
      { date: '1954', event: 'First Survey Settlement Record (Khasra Bandobast)' },
      { date: '1982', event: 'Heirship Mutation Ferfar No. 1208 Sanctioned' },
      { date: '2012', event: 'Registered Sale Deed with Sub-Registrar Haveli' },
      { date: '2024', event: 'High-Precision Electronic Total Station (ETS) Survey' },
      { date: '2026', event: 'DILRMP AI National Trust Certificate Issued (Score: 98/100)' },
    ],
  };

  res.json(trustBreakdown);
});

// 5. QR-Based Verification Center (Feature 6)
citizenRouter.post('/qr/verify', (req, res) => {
  const { qrHash = '', parcelUid = '' } = req.body;
  const hash = String(qrHash).trim();

  let matchedCert = citizenDb.trustCertificates.find(
    (c) => c.qrHash.toLowerCase() === hash.toLowerCase() || c.certificateNumber.toLowerCase() === hash.toLowerCase()
  );

  // If searching by parcel UID directly
  if (!matchedCert && parcelUid) {
    matchedCert = citizenDb.trustCertificates.find((c) => c.parcelUid === parcelUid);
  }

  // Handle Tampered / Unknown QR codes
  if (!matchedCert) {
    const isTampered = hash.includes('TAMPER') || hash.includes('FAKE') || hash.length < 8;
    const resultStatus = isTampered ? 'TAMPERED' : 'EXPIRED';

    const logItem = {
      id: `qr-${Date.now()}`,
      qrHash: hash || 'UNKNOWN_QR',
      verificationResult: resultStatus as any,
      scannedAt: new Date().toISOString(),
      ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      notes: isTampered ? 'CRITICAL: Digital cryptographic hash does not match NIC ledger!' : 'Certificate expired.',
    };
    citizenDb.qrLogs.unshift(logItem);

    return res.json({
      success: false,
      status: resultStatus,
      message:
        resultStatus === 'TAMPERED'
          ? 'WARNING: Security seal mismatch! The certificate appears to be altered or counterfeit.'
          : 'Certificate record not found or expired.',
      scannedHash: hash,
    });
  }

  // Log scan
  const logItem = {
    id: `qr-${Date.now()}`,
    qrHash: matchedCert.qrHash,
    parcelUid: matchedCert.parcelUid,
    verificationResult: matchedCert.status,
    scannedAt: new Date().toISOString(),
    ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    notes: `Verified against State Cadastral Ledger. Status: ${matchedCert.status}`,
  };
  citizenDb.qrLogs.unshift(logItem);

  res.json({
    success: true,
    status: matchedCert.status,
    certificate: matchedCert,
    maskedOwnerName: maskName(matchedCert.ownerName),
    verificationMessage:
      matchedCert.status === 'VALID'
        ? 'Official Government of India Digital Trust Certificate Verified.'
        : matchedCert.status === 'EXPIRED'
        ? 'Certificate validity expired. Please request renewed 7/12 RoR.'
        : 'Notice: This certificate has been revoked due to ongoing revenue litigation.',
  });
});

// 6. Citizen AI Timeline (Feature 7)
citizenRouter.get('/timeline/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  const parcel =
    landDb.parcels.find((p) => p.id === parcelId || p.parcelUid === parcelId) || landDb.parcels[0];

  const events = [
    {
      id: 'ev-1',
      year: 1954,
      date: '14 May 1954',
      category: 'OWNERSHIP',
      title: 'First Post-Independence Cadastral Settlement',
      description: 'Original settlement entries recorded under Bombay Land Revenue Code. Allotted to Patil ancestral family.',
      actor: 'Settlement Commissioner, Poona Division',
      status: 'VERIFIED',
      hasMapSnapshot: true,
    },
    {
      id: 'ev-2',
      year: 1982,
      date: '22 Oct 1982',
      category: 'MUTATION',
      title: 'Heirship Partition Mutation Ferfar No. 1208',
      description: 'Division of ancestral holding between 3 legal heirs sanctioned after statutory 15-day notice period.',
      actor: 'Talathi Wagholi, Circle Haveli',
      status: 'SANCTIONED',
      hasMapSnapshot: false,
    },
    {
      id: 'ev-3',
      year: 2012,
      date: '10 Feb 2012',
      category: 'OWNERSHIP',
      title: 'Registered Sale Deed with Stamp Office',
      description: 'Registration No. 892/2012 at Sub-Registrar Haveli 4. Stamp duty paid ₹1,42,000.',
      actor: 'Joint Sub-Registrar Haveli',
      status: 'REGISTERED',
      hasMapSnapshot: true,
    },
    {
      id: 'ev-4',
      year: 2021,
      date: '08 Nov 2021',
      category: 'INSPECTION',
      title: 'Drone Cadastral Survey (SVAMITVA Mission)',
      description: 'High-precision RTK drone flight flown by Survey of India. 5cm GSD ortho-mosaic generated.',
      actor: 'Survey of India & Revenue Dept',
      status: 'COMPLETED',
      hasMapSnapshot: true,
    },
    {
      id: 'ev-5',
      year: 2024,
      date: '17 Jun 2024',
      category: 'SATELLITE_CHANGE',
      title: 'Cartosat-3 Spatial Green Buffer Compliance Check',
      description: 'AI spatial analysis verified 50m waterbody clearance from Mutha canal feeder channel.',
      actor: 'ISRO NRSC Spatial Intelligence AI',
      status: 'PASSED',
      hasMapSnapshot: true,
    },
    {
      id: 'ev-6',
      year: 2026,
      date: '15 Aug 2026',
      category: 'VERIFICATION',
      title: 'National AI Land Trust Certificate Sanctioned',
      description: 'Digitally signed by District Collector Pune. Trust score 98/100 recorded on DILRMP portal.',
      actor: 'Dr. Suhas Diwase, IAS (Collector Pune)',
      status: 'SANCTIONED',
      hasMapSnapshot: false,
    },
  ];

  res.json({
    parcelUid: parcel.parcelUid,
    surveyNumber: parcel.surveyNumber,
    village: parcel.village,
    totalEvents: events.length,
    events,
  });
});

// 7. Correction Request System (Feature 9)
citizenRouter.post('/correction', (req, res) => {
  const {
    parcelUid = 'IN-MH-PUN-HAV-2024-00142-A',
    surveyNumber = '142/1',
    village = 'Wagholi',
    requestType = 'OWNER_NAME',
    currentDetails = '',
    requestedCorrection = '',
    evidenceFiles = [],
  } = req.body;

  const trackingId = `CR-MH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newRequest: any = {
    id: `corr-${Date.now()}`,
    trackingId,
    citizenId: citizenDb.profile.id,
    parcelUid,
    surveyNumber,
    village,
    requestType,
    currentDetails,
    requestedCorrection,
    evidenceFiles: evidenceFiles.length > 0 ? evidenceFiles : ['Citizen_Aadhaar_Copy.pdf', 'Supporting_Evidence.pdf'],
    status: 'SUBMITTED',
    assignedOfficer: 'Revenue Inspector Haveli Circle',
    officerRemarks: 'Application received online. Preliminary document validation pending.',
    citizenReplies: [],
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  citizenDb.correctionRequests.unshift(newRequest);

  // Trigger Notification
  citizenDb.notifications.unshift({
    id: `notif-${Date.now()}`,
    citizenId: citizenDb.profile.id,
    title: 'Correction Request Submitted Successfully',
    message: `Application ${trackingId} for Survey ${surveyNumber} submitted. Official SLA: 15 working days.`,
    type: 'CORRECTION_UPDATE',
    priority: 'MEDIUM',
    isRead: false,
    isArchive: false,
    actionUrl: '/citizen/corrections',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    trackingId,
    request: newRequest,
    message: 'Correction request submitted with Government of India DILRMP tracking receipt.',
  });
});

citizenRouter.get('/corrections', (req, res) => {
  res.json({
    requests: citizenDb.correctionRequests,
  });
});

// 8. Grievance Portal (Feature 10)
citizenRouter.post('/grievance', (req, res) => {
  const { category, subject, description, priority = 'MEDIUM', attachments = [] } = req.body;

  const ticketNumber = `GRV-PUN-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newTicket: any = {
    id: `grv-${Date.now()}`,
    ticketNumber,
    citizenId: citizenDb.profile.id,
    category,
    subject,
    description,
    priority,
    status: 'OPEN',
    assignedOfficer: 'District Grievance Officer, Pune Collectorate',
    resolutionNotes: 'Complaint received through Citizen Portal. Forwarded to Sub-Divisional Officer for inquiry.',
    satisfactionRating: null,
    attachments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  citizenDb.grievances.unshift(newTicket);

  res.json({
    success: true,
    ticketNumber,
    grievance: newTicket,
    message: 'Official Government Grievance ticket created under Public Grievance Redressal Mechanism.',
  });
});

citizenRouter.get('/grievances', (req, res) => {
  res.json({
    tickets: citizenDb.grievances,
  });
});

// 9. Document Wallet & Digital Certificate Center (Features 11 & 12)
citizenRouter.get('/documents', (req, res) => {
  const { folder, search } = req.query;
  let docs = [...citizenDb.documents];

  if (folder && folder !== 'ALL') {
    docs = docs.filter((d) => d.folder === folder);
  }

  if (search) {
    const q = String(search).toLowerCase();
    docs = docs.filter((d) => d.title.toLowerCase().includes(q) || d.surveyNumber.includes(q));
  }

  res.json({
    folders: [
      { id: 'VERIFIED_RECORDS', label: 'Verified Land Records (7/12 & 8A)', count: citizenDb.documents.filter((d) => d.folder === 'VERIFIED_RECORDS').length },
      { id: 'DOWNLOADED_REPORTS', label: 'Downloaded AI Inspection Reports', count: citizenDb.documents.filter((d) => d.folder === 'DOWNLOADED_REPORTS').length },
      { id: 'PENDING_DOCS', label: 'Pending Mutations & Ferfars', count: citizenDb.documents.filter((d) => d.folder === 'PENDING_DOCS').length },
      { id: 'SHARED_CERTS', label: 'Shared Verification Certificates', count: citizenDb.documents.filter((d) => d.folder === 'SHARED_CERTS').length },
      { id: 'FAVORITES', label: 'Starred & Favorite Documents', count: citizenDb.documents.filter((d) => d.isFavorite).length },
    ],
    documents: docs,
  });
});

citizenRouter.get('/certificate/:id', (req, res) => {
  const { id } = req.params;
  const cert =
    citizenDb.trustCertificates.find((c) => c.id === id || c.certificateNumber === id || c.parcelUid === id) ||
    citizenDb.trustCertificates[0];

  res.json({
    certificate: cert,
    issuer: {
      authority: 'Government of India, Ministry of Rural Development',
      agency: 'Department of Land Resources (DoLR) & NIC',
      districtMagistrate: 'Dr. Suhas Diwase, IAS (Collector Pune)',
      verificationPortal: 'https://bhulekh.nic.in/verify',
    },
  });
});

// 10. Citizen Notifications (Feature 17)
citizenRouter.get('/notifications', (req, res) => {
  res.json({
    notifications: citizenDb.notifications,
    unreadCount: citizenDb.notifications.filter((n) => !n.isRead).length,
  });
});

citizenRouter.post('/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = citizenDb.notifications.find((n) => n.id === id);
  if (notif) notif.isRead = true;
  res.json({ success: true });
});

// 11. Profile & Security (Feature 18)
citizenRouter.get('/profile', (req, res) => {
  res.json({
    profile: citizenDb.profile,
    trustedDevices: [
      { id: 'dev-1', name: 'Redmi Note 12 (Citizen Mobile App / PWA)', lastActive: 'Just now', ip: '49.36.120.18', isCurrent: true },
      { id: 'dev-2', name: 'Chrome Browser (Gram Panchayat Kiosk Wagholi)', lastActive: 'Yesterday, 16:30', ip: '103.14.88.42', isCurrent: false },
    ],
  });
});

citizenRouter.put('/profile', (req, res) => {
  const { fullName, email, preferredLanguage, district, taluka, village } = req.body;
  if (fullName) citizenDb.profile.fullName = fullName;
  if (email) citizenDb.profile.email = email;
  if (preferredLanguage) citizenDb.profile.preferredLanguage = preferredLanguage;
  if (district) citizenDb.profile.district = district;
  if (taluka) citizenDb.profile.taluka = taluka;
  if (village) citizenDb.profile.village = village;
  citizenDb.profile.updatedAt = new Date().toISOString();

  res.json({ success: true, profile: citizenDb.profile });
});

// 12. Unified Citizen Activity History (Feature 19)
citizenRouter.get('/activity', (req, res) => {
  const activities = [
    { id: 'act-1', type: 'SEARCH', title: 'Universal Search: "Survey 142 Wagholi"', timestamp: '15 mins ago', status: 'SUCCESS' },
    { id: 'act-2', type: 'DOWNLOAD', title: 'Downloaded Digital 7/12 RoR (Survey 142/1)', timestamp: '2 hours ago', status: 'SUCCESS' },
    { id: 'act-3', type: 'QR_SCAN', title: 'Scanned Certificate QR Code: DILRMP-MH-PUN-2026-981274', timestamp: 'Yesterday', status: 'VALID' },
    { id: 'act-4', type: 'VOICE_SEARCH', title: 'Voice Search: "Mere pitaji Ram Singh ki zameen dikhao"', timestamp: '2 days ago', status: 'PARSED' },
    { id: 'act-5', type: 'CORRECTION', title: 'Submitted Correction Request CR-MH-2026-89412', timestamp: '5 days ago', status: 'FIELD_VERIFICATION' },
    { id: 'act-6', type: 'SHARE', title: 'Generated Public Verification Link for Bank Loan Verification', timestamp: '1 week ago', status: 'SHARED' },
  ];

  res.json({ activities });
});
