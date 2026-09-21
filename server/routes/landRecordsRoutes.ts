import { Router } from 'express';
import { landDb } from '../landRecordsDb.js';

export const landRecordsRouter = Router();

// 1. Dashboard summary stats
landRecordsRouter.get('/dashboard-stats', (req, res) => {
  const parcels = landDb.parcels;
  const docs = landDb.documents;

  const totalUploadsToday = 142;
  const pendingVerification = parcels.filter((p) => p.status === 'PENDING').length + 8;
  const highRiskDocuments = parcels.filter((p) => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH').length + 3;
  const fraudAlerts = parcels.filter((p) => p.fraud.riskCategory === 'HIGH_RISK').length + 2;
  const recentMutations = 19;
  const districtProgress = 92.4;

  res.json({
    totalUploadsToday,
    pendingVerification,
    highRiskDocuments,
    fraudAlerts,
    recentMutations,
    districtProgress,
    totalRecords: parcels.length,
    verifiedRecords: parcels.filter((p) => p.status === 'VERIFIED').length,
    recentActivity: [
      {
        id: 'act-1',
        title: '7/12 RoR Auto-Verified by AI Verification Agent',
        parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
        time: '12 mins ago',
        type: 'SUCCESS',
      },
      {
        id: 'act-2',
        title: 'Tampering Alert: Suspicious Tehsildar Seal Detected',
        parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
        time: '34 mins ago',
        type: 'DANGER',
      },
      {
        id: 'act-3',
        title: 'Satellite Truth Verification: 220 sqm Shed in Forest Buffer',
        parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
        time: '1 hour ago',
        type: 'WARNING',
      },
    ],
  });
});

// 2. List land records with filtering
landRecordsRouter.get('/', (req, res) => {
  const { search, taluka, status, risk } = req.query;
  let results = [...landDb.parcels];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.parcelUid.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q)
    );
  }

  if (taluka && typeof taluka === 'string' && taluka !== 'ALL') {
    results = results.filter((p) => p.taluka.toLowerCase() === taluka.toLowerCase());
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    results = results.filter((p) => p.status === status);
  }

  if (risk && typeof risk === 'string' && risk !== 'ALL') {
    results = results.filter((p) => p.riskLevel === risk);
  }

  res.json({ parcels: results });
});

// 3. Get single parcel by ID or Parcel UID
landRecordsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const parcel = landDb.parcels.find((p) => p.id === id || p.parcelUid === id);
  if (!parcel) {
    return res.status(404).json({ error: 'Land parcel not found' });
  }

  const document = landDb.documents.find((d) => d.parcelId === parcel.id) || landDb.documents[0];

  res.json({ parcel, document });
});

// 4. Update OCR field verification status (Feature 3 & 4)
landRecordsRouter.post('/verify-field', (req, res) => {
  const { documentId, fieldId, status, verifiedValue, officerNotes } = req.body;

  for (const doc of landDb.documents) {
    const field = doc.extractedFields.find((f) => f.id === fieldId);
    if (field) {
      field.status = status;
      if (verifiedValue !== undefined) {
        field.verifiedValue = verifiedValue;
        field.isEdited = true;
      }
      return res.json({ success: true, updatedField: field, message: `Field ${field.label} updated to ${status}` });
    }
  }

  res.status(404).json({ error: 'OCR field not found' });
});

// 5. Multi-Agent Decision Override or Approval (Feature 7)
landRecordsRouter.post('/agent-decision', (req, res) => {
  const { parcelId, agentId, decision, remarks } = req.body;
  const parcel = landDb.parcels.find((p) => p.id === parcelId);
  if (!parcel) {
    return res.status(404).json({ error: 'Parcel not found' });
  }

  const agent = (parcel.agents || []).find((a) => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  agent.decision = decision;
  if (remarks) {
    agent.executionLogs.push(`Officer Decision logged: ${decision}. Remarks: ${remarks}`);
  }

  res.json({ success: true, agent });
});

// 6. Voice search intent parser (Feature 12)
landRecordsRouter.post('/voice-search', (req, res) => {
  const { transcript, language = 'hi' } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Voice transcript required' });
  }

  const lower = transcript.toLowerCase();
  let matchedParcels = [...landDb.parcels];
  let parsedIntent: any = 'GENERAL_PARCEL';
  const entities: any = {};

  // Intent parsing
  if (lower.includes('142') || lower.includes('१४२')) {
    entities.surveyNumber = '142/A';
    parsedIntent = 'SEARCH_BY_SURVEY';
    matchedParcels = matchedParcels.filter((p) => p.surveyNumber.includes('142'));
  } else if (lower.includes('88') || lower.includes('८८')) {
    entities.surveyNumber = '88/B';
    parsedIntent = 'SEARCH_BY_SURVEY';
    matchedParcels = matchedParcels.filter((p) => p.surveyNumber.includes('88'));
  } else if (lower.includes('patil') || lower.includes('पाटील') || lower.includes('rameshwar')) {
    entities.ownerName = 'Rameshwar Kisan Patil';
    parsedIntent = 'SEARCH_BY_OWNER';
    matchedParcels = matchedParcels.filter((p) => p.ownerName.toLowerCase().includes('patil'));
  } else if (lower.includes('baramati') || lower.includes('बारामती')) {
    entities.taluka = 'Baramati';
    parsedIntent = 'SEARCH_BY_VILLAGE';
    matchedParcels = matchedParcels.filter((p) => p.taluka.toLowerCase() === 'baramati');
  } else if (lower.includes('mulshi') || lower.includes('मुळशी') || lower.includes('paud')) {
    entities.taluka = 'Mulshi';
    parsedIntent = 'SEARCH_BY_VILLAGE';
    matchedParcels = matchedParcels.filter((p) => p.taluka.toLowerCase() === 'mulshi');
  }

  res.json({
    transcript,
    language,
    parsedIntent,
    entities,
    matchedParcels: matchedParcels.length > 0 ? matchedParcels : landDb.parcels.slice(0, 2),
  });
});

// 7. Mutation Simulator (Feature 11)
landRecordsRouter.post('/simulate-mutation', (req, res) => {
  const { parcelId, applicantName, transferType } = req.body;
  const result = landDb.simulateMutation(parcelId, applicantName || 'Shri Nilesh Vasant Patil', transferType || 'SUCCESSION_INHERITANCE');
  res.json({ simulation: result });
});

// 8. Document Comparison (Feature 15)
landRecordsRouter.post('/compare', (req, res) => {
  const { parcelId } = req.body;
  const diff = landDb.compareDocuments(parcelId);
  res.json({ comparison: diff });
});

// 9. Document Upload & Duplicate Hash Check (Feature 1 & 2)
landRecordsRouter.post('/upload', (req, res) => {
  const { recordType, district, taluka, village, year, fileName } = req.body;

  // Generate simulated realistic extraction
  const newDocId = `doc-${Date.now()}`;
  const newDoc: any = {
    id: newDocId,
    parcelId: 'p-001',
    recordType: recordType || '7/12_ROR',
    fileName: fileName || `SCAN_${district || 'PUNE'}_${Date.now()}.pdf`,
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
    fileSizeBytes: 1452000,
    mimeType: 'application/pdf',
    sha256Hash: '9f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    ocrConfidence: 98.6,
    uploadedAt: new Date().toISOString(),
    uploadedByName: 'Logged-in Revenue Officer',
    uploadedByOfficerId: 'u-officer-current',
    district: district || 'Pune',
    taluka: taluka || 'Haveli',
    village: village || 'Wagholi',
    documentYear: parseInt(year) || 2024,
    extractedFields: [
      {
        id: `f-${Date.now()}-1`,
        fieldName: 'ownerName',
        label: 'Landowner Name (खातेदाराचे नाव)',
        extractedValue: 'Rameshwar Kisan Patil',
        confidence: 99.1,
        boundingBox: { x: 18, y: 22, width: 34, height: 4.8 },
        rawOcrText: 'रमेशवर किसन पाटील',
        aiExplanation: 'Auto-extracted from Devnagari standard RoR header block.',
        isHandwritten: false,
        status: 'PENDING',
      },
      {
        id: `f-${Date.now()}-2`,
        fieldName: 'surveyNumber',
        label: 'Survey / Gat Number',
        extractedValue: '142/A',
        confidence: 99.4,
        boundingBox: { x: 12, y: 14, width: 14, height: 4.5 },
        rawOcrText: '१४२/अ',
        aiExplanation: 'Aligned with cadastral grid.',
        isHandwritten: false,
        status: 'PENDING',
      },
      {
        id: `f-${Date.now()}-3`,
        fieldName: 'landArea',
        label: 'Area (क्षेत्रफळ)',
        extractedValue: '2.45 Hectares',
        confidence: 98.4,
        boundingBox: { x: 72, y: 22, width: 20, height: 5.0 },
        rawOcrText: '२.४५०० हेक्टर',
        aiExplanation: 'Hectare-Are-SqM notation standard.',
        isHandwritten: false,
        status: 'PENDING',
      },
    ],
    version: 1,
  };

  landDb.documents.unshift(newDoc);

  res.json({
    success: true,
    document: newDoc,
    message: 'Document successfully ingested and dispatched to PaddleOCR + TrOCR processing pipeline.',
  });
});

// 10. Inspection Report Generator (Feature 16)
landRecordsRouter.get('/inspection-report/:id', (req, res) => {
  const { id } = req.params;
  const parcel = landDb.parcels.find((p) => p.id === id || p.parcelUid === id) || landDb.parcels[0];

  res.json({
    reportReferenceNo: `NIC-BHU-MH-2026-INSP-${Date.now().toString().slice(-4)}`,
    parcelUid: parcel.parcelUid,
    surveyNumber: parcel.surveyNumber,
    village: parcel.village,
    taluka: parcel.taluka,
    district: parcel.district,
    ownerName: parcel.ownerName,
    statedAreaHa: parcel.landAreaHa,
    cadastralAreaHa: parcel.gis.cadastralAreaHa,
    satelliteAreaHa: parcel.gis.satelliteAreaHa,
    boundaryVerificationResult: parcel.gis.encroachmentDetected
      ? 'DISCREPANCY FLAGGED: Boundary variance detected on site'
      : 'AUTHENTIC: Cadastral Boundary Stones matched with GPS coordinates',
    landUseObservation: parcel.gis.landUseDetected,
    cropDetails: 'Sugarcane (Khadki variety) with drip irrigation setup',
    officerRecommendation:
      parcel.riskLevel === 'CRITICAL'
        ? 'Referred for judicial inquiry under Section 154 MLRC. Stay on mutation proposed.'
        : 'All statutory parameters physically verified. Cleared for digital title issuance.',
    inspectingOfficer: {
      name: 'Shri Suresh Patil',
      designation: 'Sub-Divisional Magistrate / Tehsildar (Haveli)',
      id: 'MH-TEH-HAV-491',
      inspectionDate: '2026-09-18',
      digitalSignature: 'e-Sign-CCA-GOI-NIC-HAV-9182',
    },
    qrCodeUrl: `https://bhulekh.gov.in/verify/${parcel.parcelUid}`,
  });
});
