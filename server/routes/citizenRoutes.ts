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

  if (!rawText) {
    return res.json({
      success: true,
      language,
      transcript: '',
      structuredFilters: null,
      matchedCount: 0,
      results: [],
      message: "Sorry, we don't find any data from this name.",
    });
  }

  // Normalize Devanagari numerals to standard digits (e.g. १४२ -> 142)
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let normalizedText = rawText;
  devanagariDigits.forEach((d, i) => {
    normalizedText = normalizedText.split(d).join(String(i));
  });

  const lower = normalizedText.toLowerCase();

  // Natural Language & Voice Intent Extraction
  let parsedSurvey: string | null = null;
  let parsedVillage: string | null = null;
  let parsedOwner: string | null = null;
  let minArea: number | null = null;
  let verifiedOnly = false;

  // Extract Survey / Khasra / Gat number (e.g. 142/A, 142, 214, 305/C, 419, 88/B)
  const surveyMatch = lower.match(/(?:survey|khasra|gat|number|no|क्रमांक|नंबर|सर्वे|सर्व्हे|गट)\s*(?:no\.?|number)?\s*([0-9]+(?:[\/\-][0-9a-zA-Z]+)?)/i);
  if (surveyMatch) {
    parsedSurvey = surveyMatch[1].replace('-', '/').toUpperCase();
  } else {
    // Check if standalone survey-like number exists (e.g. "142/A", "142", "214", "305/c", "419")
    const standAloneNumMatch = lower.match(/\b([0-9]{2,4}(?:[\/\-][0-9a-zA-Z]+)?)\b/);
    if (standAloneNumMatch) {
      parsedSurvey = standAloneNumMatch[1].replace('-', '/').toUpperCase();
    }
  }

  // Extract Village / Taluka
  if (lower.includes('wagholi') || lower.includes('वाघोली')) parsedVillage = 'Wagholi';
  else if (lower.includes('paud') || lower.includes('पौड')) parsedVillage = 'Paud';
  else if (lower.includes('chakan') || lower.includes('चाकण')) parsedVillage = 'Chakan';
  else if (lower.includes('hadapsar') || lower.includes('हडपसर')) parsedVillage = 'Hadapsar';
  else if (lower.includes('baramati') || lower.includes('बारामती')) parsedVillage = 'Baramati';
  else if (lower.includes('malegaon') || lower.includes('माळेगाव')) parsedVillage = 'Malegaon Budruk';
  else if (lower.includes('bavdhan') || lower.includes('बावधन')) parsedVillage = 'Bavdhan Khurd';
  else if (lower.includes('mulshi') || lower.includes('मुळशी')) parsedVillage = 'Paud';
  else if (lower.includes('rampur') || lower.includes('रामपुर')) parsedVillage = 'Wagholi';

  // Extract Known Database Owners & Surnames
  if (lower.includes('ram singh') || lower.includes('राम सिंह') || lower.includes('रामसिंह') || lower.includes('ramsingh') || lower.includes('thakur') || lower.includes('ठाकूर')) {
    parsedOwner = 'Ram Singh';
  } else if (lower.includes('rameshwar') || lower.includes('रमेशवर') || lower.includes('patil') || lower.includes('पाटील') || lower.includes('kisan patil')) {
    parsedOwner = 'Patil';
  } else if (lower.includes('shinde') || lower.includes('शिंदे') || lower.includes('sanjay') || lower.includes('संजय')) {
    parsedOwner = 'Shinde';
  } else if (lower.includes('deshmukh') || lower.includes('देशमुख') || lower.includes('dattatraya') || lower.includes('दत्तात्रय') || lower.includes('balwant')) {
    parsedOwner = 'Deshmukh';
  } else if (lower.includes('kadam') || lower.includes('कदम') || lower.includes('vitthal') || lower.includes('विठ्ठल') || lower.includes('anita') || lower.includes('विजय') || lower.includes('vijay')) {
    parsedOwner = 'Kadam';
  } else if (lower.includes('pitaji') || lower.includes('पिताजी') || lower.includes('वडिलांची') || lower.includes('father')) {
    // If father is mentioned along with any name or context
    const nameNearRelation = lower.match(/(?:पिताजी|pitaji|वडिलांचे|father|my|मेरे)\s+([a-zA-Z\u0900-\u097F]+(?:\s+[a-zA-Z\u0900-\u097F]+)?)/i);
    if (nameNearRelation && nameNearRelation[1]) {
      parsedOwner = nameNearRelation[1].trim();
    }
  } else {
    // Generic name extraction: Check if user said "name is X", "named X", "owner X", "X की जमीन", "X ची जमीन", "जमीन X"
    const nameIntentMatch = lower.match(/(?:name\s+is|named|owner|नाम|नावे|नाव|श्री|shri|mr\.?)\s+([a-zA-Z\u0900-\u097F]{3,25})/i) ||
                           lower.match(/([a-zA-Z\u0900-\u097F]{3,20})\s+(?:की\s+जमीन|ची\s+जमीन|चे\s+रेकॉर्ड|ka\s+record|ki\s+zameen|land)/i);
    if (nameIntentMatch && nameIntentMatch[1]) {
      const candidate = nameIntentMatch[1].trim();
      const ignoreWords = ['survey', 'khasra', 'zameen', 'jamin', 'land', 'satbara', 'verified', 'record', 'dikhao', 'dakhva', 'show', 'mera', 'meri', 'mera'];
      if (!ignoreWords.includes(candidate.toLowerCase())) {
        parsedOwner = candidate;
      }
    }
  }

  // Extract Area constraints
  if (lower.includes('2 hectare') || lower.includes('2 हेक्टर') || lower.includes('२ हेक्टर')) {
    minArea = 2.0;
  } else if (lower.includes('1 hectare') || lower.includes('1 हेक्टर') || lower.includes('१ हेक्टर')) {
    minArea = 1.0;
  }

  if (lower.includes('verified') || lower.includes('सत्यापित') || lower.includes('पडताळणी') || lower.includes('certified')) {
    verifiedOnly = true;
  }

  // Filter against land parcels database
  let matches = [...landDb.parcels];

  // If specific filters were identified:
  let hasSpecificFilter = false;

  if (parsedSurvey) {
    hasSpecificFilter = true;
    matches = matches.filter((p) =>
      p.surveyNumber.toUpperCase().includes(parsedSurvey!) ||
      (p.khasraNumber && p.khasraNumber.toUpperCase().includes(parsedSurvey!)) ||
      (p.khataNumber && p.khataNumber.includes(parsedSurvey!))
    );
  }

  if (parsedVillage) {
    hasSpecificFilter = true;
    matches = matches.filter((p) =>
      p.village.toLowerCase() === parsedVillage!.toLowerCase() ||
      p.taluka.toLowerCase() === parsedVillage!.toLowerCase()
    );
  }

  if (parsedOwner) {
    hasSpecificFilter = true;
    const ownerQuery = parsedOwner.toLowerCase();
    matches = matches.filter((p) => {
      const matchOwner = p.ownerName.toLowerCase().includes(ownerQuery);
      const matchFather = (p.fatherName || '').toLowerCase().includes(ownerQuery);
      const matchCoSharers = (p.coSharers || []).some((cs) => cs.name.toLowerCase().includes(ownerQuery));
      return matchOwner || matchFather || matchCoSharers;
    });
  }

  if (minArea !== null) {
    matches = matches.filter((p) => p.landAreaHa >= minArea!);
  }

  if (verifiedOnly) {
    matches = matches.filter((p) => p.status === 'VERIFIED');
  }

  // If no specific parsed filter, or if user spoke freeform keywords:
  if (!hasSpecificFilter) {
    // Extract non-stopword tokens from user's voice input
    const stopWords = new Set([
      'the', 'is', 'a', 'an', 'in', 'at', 'of', 'for', 'to', 'show', 'find', 'search', 'get', 'me', 'please',
      'की', 'का', 'के', 'में', 'पर', 'को', 'से', 'दिखाओ', 'बताओ', 'खोजो', 'जमीन', 'सातबारा',
      'चा', 'ची', 'चे', 'च्या', 'मधील', 'दाखवा', 'द्या', 'आहे', 'काढा'
    ]);

    const words = lower.split(/[\s,।.]+/).filter((w) => w.length >= 3 && !stopWords.has(w));

    if (words.length > 0) {
      matches = matches.filter((p) => {
        const pTokens = [
          p.ownerName.toLowerCase(),
          (p.fatherName || '').toLowerCase(),
          p.village.toLowerCase(),
          p.taluka.toLowerCase(),
          p.district.toLowerCase(),
          p.surveyNumber.toLowerCase(),
          p.parcelUid.toLowerCase(),
          ...(p.coSharers || []).map((cs) => cs.name.toLowerCase()),
        ].join(' ');

        return words.some((word) => pTokens.includes(word));
      });
    } else {
      // Nothing meaningful in query
      matches = [];
    }
  }

  // If no matches found, do NOT fallback to random parcels! Return empty array so UI can apologize accurately.
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

  const responseMessage =
    matches.length > 0
      ? `Found ${matches.length} land record${matches.length > 1 ? 's' : ''} matching your voice search.`
      : "Sorry, we don't find any data from this name.";

  res.json({
    success: true,
    language,
    transcript: rawText,
    structuredFilters,
    matchedCount: matches.length,
    message: responseMessage,
    results: matches.map((p) => ({
      id: p.id,
      parcelUid: p.parcelUid,
      surveyNumber: p.surveyNumber,
      ownerName: p.ownerName,
      maskedOwnerName: maskName(p.ownerName),
      village: p.village,
      taluka: p.taluka,
      district: p.district || 'Pune',
      areaHectares: p.landAreaHa,
      status: p.status,
      trustScore: p.status === 'VERIFIED' ? 98 : p.status === 'FLAGGED' ? 32 : 78,
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

// Helper: Haversine distance in meters
function computeHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// 4b. Citizen Parcel GIS & Real Satellite Boundary Dossier
citizenRouter.get('/parcel-gis/:parcelId', (req, res) => {
  const { parcelId } = req.params;
  const cleanId = String(parcelId).trim().toLowerCase();

  const parcel =
    landDb.parcels.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.parcelUid.toLowerCase() === cleanId ||
        p.surveyNumber.toLowerCase() === cleanId ||
        (p.khasraNumber && p.khasraNumber.toLowerCase() === cleanId) ||
        p.surveyNumber.toLowerCase().replace('/', '-') === cleanId
    ) ||
    landDb.parcels.find((p) => cleanId.includes(p.surveyNumber.toLowerCase())) ||
    landDb.parcels[0];

  const centroid = parcel.dna?.centroid || { lat: 18.5793, lng: 73.9821 };

  // Base polygon points
  let rawPolygon: Array<{ lat: number; lng: number }> =
    parcel.gis?.cadastralPolygon || parcel.dna?.polygon || [];

  if (!rawPolygon || rawPolygon.length < 3) {
    rawPolygon = [
      { lat: centroid.lat + 0.0018, lng: centroid.lng - 0.0016 },
      { lat: centroid.lat + 0.0022, lng: centroid.lng + 0.0014 },
      { lat: centroid.lat - 0.0013, lng: centroid.lng + 0.0019 },
      { lat: centroid.lat - 0.0021, lng: centroid.lng - 0.0009 },
    ];
  }

  const cornerLabels = [
    { label: 'Corner P1 (North-East)', name: 'P1', dir: 'NE', desc: 'Main Road / Cart Track Entrance Pillar' },
    { label: 'Corner P2 (South-East)', name: 'P2', dir: 'SE', desc: 'Canal Buffer Boundary Stone' },
    { label: 'Corner P3 (South-West)', name: 'P3', dir: 'SW', desc: 'Adjoining Farmland Boundary Bund (धुरा)' },
    { label: 'Corner P4 (North-West)', name: 'P4', dir: 'NW', desc: 'Western Survey Line Stone Pillar' },
  ];

  const corners = rawPolygon.map((pt, idx) => {
    const meta = cornerLabels[idx % cornerLabels.length];
    const baseElev = parcel.dna?.elevationMeters || 562.4;
    const elevOffsets = [1.8, -0.6, -1.9, 0.7];
    return {
      id: `P${idx + 1}`,
      code: `P${idx + 1}`,
      label: meta.label,
      direction: meta.dir,
      lat: Number(pt.lat.toFixed(6)),
      lng: Number(pt.lng.toFixed(6)),
      elevationMeters: Number((baseElev + (elevOffsets[idx] || 0)).toFixed(1)),
      pillarType: 'Survey of India Standard Geo-Pillar (Concrete Monument with GPS Brass Pin)',
      pillarStatus: 'INTACT & VERIFIED',
      soiPillarId: `SOI-MH-${(parcel.district || 'PUN').substring(0, 3).toUpperCase()}-${parcel.surveyNumber.replace('/', '-')}-P${idx + 1}`,
      description: meta.desc,
    };
  });

  // Calculate boundary edges between corners
  const boundaryEdges = corners.map((c1, idx) => {
    const nextIdx = (idx + 1) % corners.length;
    const c2 = corners[nextIdx];
    const lengthM = computeHaversineMeters(c1.lat, c1.lng, c2.lat, c2.lng);
    const lengthFt = Math.round(lengthM * 3.28084);

    const edgeNames = ['East Boundary', 'South Boundary', 'West Boundary', 'North Boundary'];
    const adjoiningHoldings = [
      `Survey ${parcel.surveyNumber}/B & 6m Cart Road`,
      'Mutha Canal Feeder Branch Buffer (50m Clear)',
      'Survey 139 (Shinde Holdings)',
      'Survey 141 (Jadhav Holdings) & Cart Track',
    ];

    return {
      id: `E${idx + 1}`,
      fromCorner: c1.code,
      toCorner: c2.code,
      name: edgeNames[idx % edgeNames.length],
      lengthMeters: lengthM,
      lengthFeet: lengthFt,
      adjoining: adjoiningHoldings[idx % adjoiningHoldings.length],
      boundaryType: idx === 0 ? 'Paved Farm Approach & Live Hedge' : 'Survey Trench & Stone Bund (धुरा)',
      encroachmentStatus: parcel.status === 'FLAGGED' && idx === 1 ? 'FLAGGED_BUFFER_OVERSTEP' : 'CLEAR',
    };
  });

  const totalPerimeterMeters = boundaryEdges.reduce((sum, e) => sum + e.lengthMeters, 0);
  const totalPerimeterFeet = Math.round(totalPerimeterMeters * 3.28084);
  const areaGunthas = Number((parcel.landAreaHa * 40).toFixed(1));

  res.json({
    success: true,
    parcel: {
      id: parcel.id,
      parcelUid: parcel.parcelUid,
      surveyNumber: parcel.surveyNumber,
      khasraNumber: parcel.khasraNumber || parcel.surveyNumber,
      khataNumber: parcel.khataNumber || '518',
      village: parcel.village,
      taluka: parcel.taluka,
      district: parcel.district || 'Pune',
      state: parcel.state || 'Maharashtra',
      ownerName: parcel.ownerName,
      maskedOwnerName: maskName(parcel.ownerName),
      fatherName: parcel.fatherName || '',
      areaHectares: parcel.landAreaHa,
      areaGunthas,
      areaSqft: parcel.landAreaSqft || Math.round(parcel.landAreaHa * 107639),
      landType: parcel.landType,
      soilType: parcel.dna?.soilType || 'Medium Black Cotton (काळी माती)',
      elevationMeters: parcel.dna?.elevationMeters || 562.4,
      status: parcel.status,
      trustIndex: parcel.trustIndex || 98.4,
      centroid,
      polygon: corners.map((c) => ({ lat: c.lat, lng: c.lng })),
      corners,
      boundaryEdges,
      perimeterMeters: totalPerimeterMeters,
      perimeterFeet: totalPerimeterFeet,
      approachRoad: `${parcel.village} Revenue Panand / Farm Road (6m wide)`,
      nearestHighway: 'Pune-Nagar Highway (SH-27, 2.4 km)',
      landmarks: [
        { name: 'Public Paved Farm Approach (Panand / शेतरस्ता)', distance: 'Direct North Access', type: 'Access Path' },
        { name: 'Mutha Right Bank Canal Channel', distance: '85 meters South', type: 'Waterway' },
        { name: `${parcel.village} Gram Panchayat Office`, distance: '750 meters West', type: 'Administrative Node' },
        { name: 'MSEDCL 33kV Rural Transformer Pole T-14', distance: '25 meters North-East', type: 'Electrical Node' },
      ],
      googleMapsNavUrl: `https://www.google.com/maps/dir/?api=1&destination=${centroid.lat},${centroid.lng}`,
      satelliteProvider: 'ISRO Cartosat-3 & Bhuvan High-Resolution Optical / Esri World Imagery (0.28m GSD)',
      lastDroneSurvey: parcel.dna?.lastDroneSurveyDate || '14 Nov 2025',
      cadastralSheetNo: `MH-PUN-${parcel.taluka.substring(0, 3).toUpperCase()}-SHT-04`,
    },
  });
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

// 13. High-Precision GIS Satellite & Boundary Corners API
citizenRouter.get('/parcel-gis/:id', (req, res) => {
  const { id } = req.params;
  const parcel =
    landDb.parcels.find((p) => p.parcelUid === id || p.id === id || p.surveyNumber === id) ||
    landDb.parcels[0];

  const centroid = parcel.dna?.centroid || { lat: 18.5793, lng: 73.9821 };
  const rawPolygon = parcel.dna?.polygon && parcel.dna.polygon.length >= 3
    ? parcel.dna.polygon
    : [
        { lat: centroid.lat + 0.0017, lng: centroid.lng - 0.0016 },
        { lat: centroid.lat + 0.0022, lng: centroid.lng + 0.0014 },
        { lat: centroid.lat - 0.0013, lng: centroid.lng + 0.0019 },
        { lat: centroid.lat - 0.0021, lng: centroid.lng - 0.0009 },
      ];

  const corners = [
    {
      id: `c-p1-${parcel.id}`,
      code: 'P1',
      label: 'North-East Corner Pillar (P1)',
      direction: 'North-East',
      lat: rawPolygon[0].lat,
      lng: rawPolygon[0].lng,
      elevationMeters: Math.round((parcel.dna?.elevationMeters || 562) + 1.2),
      pillarType: 'RCC Pillar with Brass Centerpin (Class-A SOI)',
      pillarStatus: 'VERIFIED_INTACT',
      soiPillarId: `SOI-BM-${parcel.surveyNumber.replace(/[^a-zA-Z0-9]/g, '')}-P1`,
      description: 'Main entrance marker abutting the 6m public revenue panand road.',
    },
    {
      id: `c-p2-${parcel.id}`,
      code: 'P2',
      label: 'South-East Corner Pillar (P2)',
      direction: 'South-East',
      lat: rawPolygon[1].lat,
      lng: rawPolygon[1].lng,
      elevationMeters: Math.round(parcel.dna?.elevationMeters || 562),
      pillarType: 'Granite Boundary Stone with Cross Mark',
      pillarStatus: 'VERIFIED_INTACT',
      soiPillarId: `SOI-BM-${parcel.surveyNumber.replace(/[^a-zA-Z0-9]/g, '')}-P2`,
      description: 'Adjacent to irrigation canal buffer ring (50m regulatory setback).',
    },
    {
      id: `c-p3-${parcel.id}`,
      code: 'P3',
      label: 'South-West Corner Pillar (P3)',
      direction: 'South-West',
      lat: rawPolygon[2].lat,
      lng: rawPolygon[2].lng,
      elevationMeters: Math.round((parcel.dna?.elevationMeters || 562) - 0.8),
      pillarType: 'RCC Pillar with DILRMP Barcode Plate',
      pillarStatus: 'VERIFIED_INTACT',
      soiPillarId: `SOI-BM-${parcel.surveyNumber.replace(/[^a-zA-Z0-9]/g, '')}-P3`,
      description: 'Natural stone bund (धुरा) dividing neighboring sub-division.',
    },
    {
      id: `c-p4-${parcel.id}`,
      code: 'P4',
      label: 'North-West Corner Pillar (P4)',
      direction: 'North-West',
      lat: rawPolygon[3].lat,
      lng: rawPolygon[3].lng,
      elevationMeters: Math.round((parcel.dna?.elevationMeters || 562) + 0.4),
      pillarType: 'Standard Revenue Survey Stone',
      pillarStatus: 'VERIFIED_INTACT',
      soiPillarId: `SOI-BM-${parcel.surveyNumber.replace(/[^a-zA-Z0-9]/g, '')}-P4`,
      description: 'Survey trench marker aligned with Village Cadastral Sheet grid.',
    },
  ];

  // Helper for haversine
  const calcDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const l1 = calcDist(corners[0].lat, corners[0].lng, corners[1].lat, corners[1].lng) || 395;
  const l2 = calcDist(corners[1].lat, corners[1].lng, corners[2].lat, corners[2].lng) || 310;
  const l3 = calcDist(corners[2].lat, corners[2].lng, corners[3].lat, corners[3].lng) || 430;
  const l4 = calcDist(corners[3].lat, corners[3].lng, corners[0].lat, corners[0].lng) || 320;

  const perimeterMeters = l1 + l2 + l3 + l4;
  const perimeterFeet = Math.round(perimeterMeters * 3.28084);

  const boundaryEdges = [
    {
      id: 'edge-1',
      fromCorner: 'P1',
      toCorner: 'P2',
      name: 'North Boundary',
      lengthMeters: l1,
      lengthFeet: Math.round(l1 * 3.28084),
      adjoining: 'Revenue Cart Track (6m Panand)',
      boundaryType: 'Public Road',
      encroachmentStatus: 'CLEAR',
    },
    {
      id: 'edge-2',
      fromCorner: 'P2',
      toCorner: 'P3',
      name: 'East Boundary',
      lengthMeters: l2,
      lengthFeet: Math.round(l2 * 3.28084),
      adjoining: 'Survey No. 142/B (Anil Shinde)',
      boundaryType: 'Natural Bund & Tree Line',
      encroachmentStatus: 'CLEAR',
    },
    {
      id: 'edge-3',
      fromCorner: 'P3',
      toCorner: 'P4',
      name: 'South Boundary',
      lengthMeters: l3,
      lengthFeet: Math.round(l3 * 3.28084),
      adjoining: 'Minor Irrigation Sub-Canal',
      boundaryType: 'Waterway Setback Buffer',
      encroachmentStatus: 'CLEAR',
    },
    {
      id: 'edge-4',
      fromCorner: 'P4',
      toCorner: 'P1',
      name: 'West Boundary',
      lengthMeters: l4,
      lengthFeet: Math.round(l4 * 3.28084),
      adjoining: 'Survey No. 139 (Kashinath Gaikwad)',
      boundaryType: 'Cadastral Boundary Trench',
      encroachmentStatus: 'CLEAR',
    },
  ];

  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${centroid.lat},${centroid.lng}&travelmode=driving`;

  res.json({
    success: true,
    parcel: {
      id: parcel.id,
      parcelUid: parcel.parcelUid,
      surveyNumber: parcel.surveyNumber,
      khasraNumber: parcel.khasraNumber,
      khataNumber: parcel.khataNumber,
      village: parcel.village,
      taluka: parcel.taluka,
      district: parcel.district,
      state: parcel.state,
      ownerName: parcel.ownerName,
      maskedOwnerName: parcel.ownerName.replace(/(\w{2})\w+(\w{2})/g, '$1***$2'),
      fatherName: parcel.fatherName || 'Late Shri Kisan Patil',
      areaHectares: parcel.landAreaHa,
      areaGunthas: Math.round(parcel.landAreaHa * 40),
      areaSqft: parcel.landAreaSqft,
      landType: parcel.landType,
      soilType: parcel.dna?.soilType || 'Medium Black Cotton (Regur)',
      elevationMeters: parcel.dna?.elevationMeters || 562,
      status: parcel.status,
      trustIndex: parcel.trustIndex || 98,
      centroid,
      polygon: rawPolygon,
      corners,
      boundaryEdges,
      perimeterMeters,
      perimeterFeet,
      approachRoad: 'Revenue Panand / Farm Cart Track (6m wide, paved till 300m)',
      nearestHighway: 'Pune-Nagar Highway (SH-27, 2.4 km via Wagholi-Bakori road)',
      landmarks: [
        { name: 'Wagholi Gram Panchayat Office', distance: '1.8 km North-West', type: 'CIVIC' },
        { name: 'Survey of India Benchmark Pillar BM-104', distance: '220 m East', type: 'SURVEY_STONE' },
        { name: 'Bakori Minor Irrigation Canal', distance: '65 m South', type: 'WATERWAY' },
        { name: 'MSEDCL Agri Transformer 42-B', distance: '40 m North-East', type: 'UTILITY' },
      ],
      googleMapsNavUrl,
      satelliteProvider: 'Cartosat-3 High-Resolution & Esri World Imagery (0.28m GSD)',
      lastDroneSurvey: '14 Nov 2025 (DILRMP-ETS Verified)',
      cadastralSheetNo: `MH-PUN-${parcel.taluka.toUpperCase()}-CS-084`,
    },
  });
});
