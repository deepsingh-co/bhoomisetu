import {
  LandParcelDetail,
  DocumentRecord,
  AiAgentOfficer,
  MutationSimulationResult,
  DocumentDiffComparison,
} from '../src/types/landRecords.js';
import { citizenDb } from './citizenDb.js';

class LandRecordsDatabase {
  parcels: LandParcelDetail[] = [];
  documents: DocumentRecord[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 1. Parcel 1: Haveli (Wagholi) - Clean Exemplar
    const parcel1: LandParcelDetail = {
      id: 'p-001',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      surveyNumber: '142/A',
      khasraNumber: '142/A',
      khataNumber: '518',
      village: 'Wagholi',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      landAreaHa: 2.45,
      landAreaSqft: 263715.75,
      landType: 'Perennially Irrigated Agricultural (Jirayat / Bagayat)',
      revenueAssessmentInr: 48.5,
      ownerName: 'Rameshwar Kisan Patil',
      fatherName: 'Kisan Dhondiba Patil',
      coSharers: [
        { name: 'Rameshwar Kisan Patil', share: '50% (1.225 Ha)', aadhaarLinked: true },
        { name: 'Sunanda Rameshwar Patil', share: '50% (1.225 Ha)', aadhaarLinked: true },
      ],
      mutationNumber: 'MH-HAV-2024-M918',
      registrationNumber: 'PUN-HAV-REG-2024-7712',
      documentYear: 2024,
      status: 'VERIFIED',
      riskLevel: 'LOW',
      trustIndex: 98.4,
      dna: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
        dnaHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e9cf41',
        centroid: { lat: 18.5793, lng: 73.9821 },
        polygon: [
          { lat: 18.581, lng: 73.9805 },
          { lat: 18.5815, lng: 73.9835 },
          { lat: 18.578, lng: 73.984 },
          { lat: 18.5772, lng: 73.9812 },
        ],
        elevationMeters: 562.4,
        soilType: 'Medium Black Cotton (Regur)',
        encumbranceStatus: 'UNENCUMBERED',
        totalMutations: 4,
        totalInspections: 3,
        riskScore: 6,
        lastDroneSurveyDate: '2025-11-14',
      },
      timeline: [
        {
          year: 1952,
          date: '1952-06-15',
          type: 'OWNERSHIP_CHANGE',
          title: 'Post-Independence Cadastral Settlement',
          description: 'Original agricultural holding settled under Bombay Tenancy & Agricultural Lands Act.',
          ownerName: 'Dhondiba Ramji Patil',
          areaHectares: 4.9,
        },
        {
          year: 1978,
          date: '1978-03-22',
          type: 'MUTATION_APPROVAL',
          title: 'Succession Mutation (Ferfar No. 114)',
          description: 'Succession sanctioned in favor of Kisan Dhondiba Patil following demise of original holder.',
          ownerName: 'Kisan Dhondiba Patil',
          mutationNo: 'HAV-M-114',
          areaHectares: 4.9,
        },
        {
          year: 1999,
          date: '1999-11-04',
          type: 'SUBDIVISION',
          title: 'Amicable Family Partition (Hissa Phodni)',
          description: 'Survey 142 partitioned into 142/A (2.45 Ha) and 142/B (2.45 Ha).',
          ownerName: 'Rameshwar Kisan Patil',
          mutationNo: 'HAV-M-482',
          areaHectares: 2.45,
        },
        {
          year: 2016,
          date: '2016-08-10',
          type: 'SATELLITE_SNAPSHOT',
          title: 'ISRO Bhuvan High-Res Cadastral Boundary Sync',
          description: 'Cartosat-2 satellite cadastral georeferencing successfully completed with zero boundary overlap.',
          ownerName: 'Rameshwar Kisan Patil',
          areaHectares: 2.45,
          satelliteImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
        },
        {
          year: 2024,
          date: '2024-04-18',
          type: 'VERIFICATION',
          title: 'Digital RoR Modernization & Digital Sign-off',
          description: 'e-Mahabhulekh RoR digital synchronization verified by Tehsildar Haveli.',
          ownerName: 'Rameshwar Kisan Patil & Sunanda R. Patil',
          areaHectares: 2.45,
        },
      ],
      agents: [
        {
          id: 'ag-1',
          code: 'OCR_OFFICER',
          name: 'AI Document OCR Specialist',
          role: 'Scans & transcribes Devanagari script, Modi script annotations, and tabular RoR fields.',
          model: 'PaddleOCR-v4 + TrOCR Indic',
          status: 'APPROVED',
          confidence: 99.2,
          recommendation: 'All 14 statutory fields in 7/12 extract match official gazette standards with 0 ambiguity.',
          evidence: [
            'Devnagari Ligature confidence: 99.4%',
            'Survey 142/A bounding box coordinates aligned',
            'Watermark integrity score: 100%',
          ],
          executionLogs: [
            'Loaded 300 DPI scan of 7/12 RoR.',
            'Binarization and skew correction (-0.4°).',
            'Extracted Owner: रमेशवर किसन पाटील.',
            'Extracted Khasra: १४२/अ, Area: २.४५ हेक्टर.',
          ],
          decision: 'OFFICER_APPROVED',
        },
        {
          id: 'ag-2',
          code: 'VERIFICATION_OFFICER',
          name: 'AI Land Record Title Verifier',
          role: 'Performs statutory cross-checks against Central DILRMP database & e-Panchayat registers.',
          model: 'National Cadastral RuleEngine v3',
          status: 'APPROVED',
          confidence: 98.6,
          recommendation: 'Ownership lineage unbroken from 1952. No pending liens or bank injunctions found.',
          evidence: [
            'Revenue Khata 518 linked to active tax roll',
            'CERSAI Registry confirms nil bank mortgages',
            'Aadhaar e-KYC matches owner identity',
          ],
          executionLogs: [
            'Cross-queried State Revenue Central Node.',
            'Validated Mutation No. MH-HAV-2024-M918.',
            'Title continuity verified across 72 years.',
          ],
          decision: 'OFFICER_APPROVED',
        },
        {
          id: 'ag-3',
          code: 'GIS_OFFICER',
          name: 'AI Cadastral & GIS Cartographer',
          role: 'Correlates stated document dimensions against Bhuvan-ISRO high-resolution satellite imagery.',
          model: 'ISRO Geospatial Cadastral Net',
          status: 'APPROVED',
          confidence: 97.9,
          recommendation: 'Documented 2.45 Ha matches satellite geometry of 2.448 Ha (<0.1% delta). Boundaries clear.',
          evidence: [
            'Stated Area: 2.45 Ha | Satellite Polygon: 2.448 Ha',
            'Encroachment index: 0.00% (No unauthorized structures)',
            'Gat bund marks clearly visible in multi-spectral NIR band',
          ],
          executionLogs: [
            'Retrieved Sentinel-2 and Cartosat-3 ortho-rectified imagery.',
            'Generated boundary overlay on OpenStreetMap cadastral base.',
            'No road or canal right-of-way infringement detected.',
          ],
          decision: 'OFFICER_APPROVED',
        },
        {
          id: 'ag-4',
          code: 'FRAUD_OFFICER',
          name: 'AI Forensic Document Inspector',
          role: 'Inspects PDF byte structures, font kerning, seal geometry, and signature anomalies.',
          model: 'ForensicDoc-Shield v2.8',
          status: 'APPROVED',
          confidence: 99.8,
          recommendation: 'No metadata alterations, digital splicing, or stamp discrepancies detected. Clean authentic deed.',
          evidence: [
            'PDF creation tools: Official NIC WebScan Suite',
            'No Photoshop or Illustrator ghost markers',
            'Tehsildar official seal diameter: 38.1mm (Exact match to standard)',
          ],
          executionLogs: [
            'Hex scan of file headers completed.',
            'Vector path analysis on seal imprint: Verified circularity 0.998.',
            'Digest hash registered on MeitY verification ledger.',
          ],
          decision: 'OFFICER_APPROVED',
        },
        {
          id: 'ag-5',
          code: 'LEGAL_OFFICER',
          name: 'AI Revenue Code & Legal Advisor',
          role: 'Validates compliance with Maharashtra Land Revenue Code 1966 & Tenancy Acts.',
          model: 'Indian Land Law NLP Assistant',
          status: 'APPROVED',
          confidence: 98.1,
          recommendation: 'Full compliance with Section 148-A of MLRC 1966. Joint holder succession lawful.',
          evidence: [
            'Section 148 MLRC: Timely intimation recorded',
            'Bombay Prevention of Fragmentation Act: Area 2.45 Ha safely exceeds 0.40 Ha standard limit',
          ],
          executionLogs: [
            'Validated legal minimum plot threshold.',
            'No prohibited tribal transfer (Section 36A MLRC) triggered.',
            'Notice issued under Form 24 without objections.',
          ],
          decision: 'OFFICER_APPROVED',
        },
      ],
      gis: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
        statedAreaHa: 2.45,
        cadastralAreaHa: 2.45,
        satelliteAreaHa: 2.448,
        areaDiscrepancyPercent: -0.08,
        encroachmentDetected: false,
        landUseStated: 'Agricultural (Double Cropped Sugarcane & Wheat)',
        landUseDetected: 'Active Cropland (Normalized Difference Vegetation Index 0.74)',
        landUseMatch: true,
        cadastralPolygon: [
          { lat: 18.581, lng: 73.9805 },
          { lat: 18.5815, lng: 73.9835 },
          { lat: 18.578, lng: 73.984 },
          { lat: 18.5772, lng: 73.9812 },
        ],
        satelliteObservedPolygon: [
          { lat: 18.5809, lng: 73.9806 },
          { lat: 18.5814, lng: 73.9834 },
          { lat: 18.5781, lng: 73.9839 },
          { lat: 18.5773, lng: 73.9813 },
        ],
        statedPolygon: [
          { lat: 18.581, lng: 73.9805 },
          { lat: 18.5815, lng: 73.9835 },
          { lat: 18.578, lng: 73.984 },
          { lat: 18.5772, lng: 73.9812 },
        ],
        certificateId: 'GIS-NIC-MH-2024-C9921',
        verifiedAt: '2026-09-18T10:15:00.000Z',
      },
      fraud: {
        score: 4,
        riskCategory: 'CLEAN',
        checks: {
          editedPdf: false,
          metadataMismatch: false,
          duplicateUpload: false,
          sealMismatch: false,
          signatureSimilarity: 98.4,
          imageManipulation: false,
          ocrOverwrite: false,
        },
        suspiciousRegions: [],
        forensicSummary: 'Forensic integrity tests passed. Document exhibits authentic cryptographic NIC signatures.',
        manualReviewStatus: 'CLEARED',
      },
      dispute: {
        riskIndex: 8,
        riskCategory: 'LOW',
        reasons: ['No civil litigation or stay orders found across District Court e-Courts API.'],
        evidenceItems: ['72-year unblemished record', 'Co-sharers signed mutual consent form in e-Panchayat portal.'],
        suggestedActions: ['Safe for standard digital mutation sanctioning.'],
        pendingCourtCases: [],
        collectorAlerted: false,
      },
      trust: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
        overallScore: 98.4,
        badge: 'VERIFIED_GOLD',
        aiVerificationScore: 98.8,
        officerVerificationBadge: {
          officerName: 'Shri Suresh Patil',
          designation: 'Sub-Divisional Magistrate / Tehsildar (Haveli)',
          officerId: 'MH-TEH-HAV-491',
          signatureHash: 'e-Sign-CCA-IN-2024-HAV-891024',
          date: '2024-04-18',
        },
        districtSeal: 'District Collectorate Pune (NIC Official Certified)',
        fraudClearance: true,
        qrVerificationUrl: 'https://bhulekh.gov.in/verify/IN-MH-PUN-HAV-2024-00142-A',
        digitalSignatureHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        lastVerifiedDate: '2026-09-18',
      },
      nearbyParcels: [
        { direction: 'NORTH', surveyNo: '141', ownerName: 'Vitthal Pandurang Jadhav', areaHa: 1.85 },
        { direction: 'SOUTH', surveyNo: '143', ownerName: 'Wagholi Village Gram Panchayat Canal', areaHa: 0.4 },
        { direction: 'EAST', surveyNo: '142/B', ownerName: 'Baban Kisan Patil', areaHa: 2.45 },
        { direction: 'WEST', surveyNo: '139', ownerName: 'Shantabai Narayan Shinde', areaHa: 3.1 },
      ],
      recentInspections: [
        {
          date: '2025-11-14',
          officerName: 'Er. Arun Kumar Singh (Surveyor)',
          result: 'Boundary pillars (Gat Raje) physically intact and georeferenced.',
          photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
        },
      ],
    };

    // 2. Parcel 2: Baramati (Malegaon Khurd) - High Fraud & Dispute Risk Exemplar
    const parcel2: LandParcelDetail = {
      id: 'p-002',
      parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
      surveyNumber: '88/B',
      khasraNumber: '88/B',
      khataNumber: '204',
      village: 'Malegaon Khurd',
      taluka: 'Baramati',
      district: 'Pune',
      state: 'Maharashtra',
      landAreaHa: 3.1,
      landAreaSqft: 333681.1,
      landType: 'Agricultural (Sugarcane)',
      revenueAssessmentInr: 62.0,
      ownerName: 'Sanjay Jagannath Shinde',
      fatherName: 'Jagannath Vitthal Shinde',
      coSharers: [{ name: 'Sanjay Jagannath Shinde', share: '100% (Purported)', aadhaarLinked: false }],
      mutationNumber: 'MH-BAR-2023-M411-FLAG',
      registrationNumber: 'PUN-BAR-REG-2023-1190',
      documentYear: 2023,
      status: 'FLAGGED',
      riskLevel: 'CRITICAL',
      trustIndex: 32.5,
      dna: {
        parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
        dnaHash: 'a7c9381e4b8549bcde1284a19349dfbc0928371948baedfe8347102938472918',
        centroid: { lat: 18.1524, lng: 74.5821 },
        polygon: [
          { lat: 18.154, lng: 74.58 },
          { lat: 18.1545, lng: 74.584 },
          { lat: 18.151, lng: 74.5845 },
          { lat: 18.1505, lng: 74.5805 },
        ],
        elevationMeters: 538.0,
        soilType: 'Deep Heavy Black Soil',
        encumbranceStatus: 'COURT_STAY',
        totalMutations: 7,
        totalInspections: 1,
        riskScore: 88,
        lastDroneSurveyDate: '2024-03-20',
      },
      timeline: [
        {
          year: 1968,
          date: '1968-02-14',
          type: 'OWNERSHIP_CHANGE',
          title: 'Ancestral Purchase Deed',
          description: 'Acquired by Jagannath Vitthal Shinde via registered conveyance.',
          ownerName: 'Jagannath Vitthal Shinde',
          areaHectares: 3.1,
        },
        {
          year: 2018,
          date: '2018-09-10',
          type: 'OWNERSHIP_CHANGE',
          title: 'Demise of Patriarch Jagannath Shinde',
          description: 'Legal heirs include widow, 1 son (Sanjay), and 2 daughters (Lata & Meena).',
          ownerName: 'Heirs of Jagannath Shinde',
          areaHectares: 3.1,
        },
        {
          year: 2023,
          date: '2023-07-15',
          type: 'MUTATION_APPROVAL',
          title: 'Suspicious Sole Mutation Entry (Ferfar No. 411)',
          description: 'Uploaded mutation claims sole ownership by Sanjay Shinde, omitting sisters.',
          ownerName: 'Sanjay Jagannath Shinde',
          mutationNo: 'MH-BAR-2023-M411',
          areaHectares: 3.1,
          isDisputed: true,
        },
        {
          year: 2024,
          date: '2024-02-08',
          type: 'COURT_DISPUTE',
          title: 'Civil Injunction Issued by Baramati Civil Court',
          description: 'Regular Civil Suit No. 104/2023. Interim stay order restraining alienation of land.',
          ownerName: 'Litigation Pending (Lata Shinde vs Sanjay Shinde)',
          areaHectares: 3.1,
          isDisputed: true,
        },
      ],
      agents: [
        {
          id: 'ag-201',
          code: 'OCR_OFFICER',
          name: 'AI Document OCR Specialist',
          role: 'Scans & transcribes Devanagari script and tabular RoR fields.',
          model: 'PaddleOCR-v4 + TrOCR Indic',
          status: 'FLAGGED',
          confidence: 76.4,
          recommendation: 'Low confidence detected in Area column. Numbers exhibit font typeface mismatch.',
          evidence: [
            'Detected different font baseline in "३.१०" (3.10 Ha)',
            'Possible manual overwrite over original "२.०५" (2.05 Ha)',
            'Compression artifacts localized around mutation number',
          ],
          executionLogs: [
            'Scanned document page 1.',
            'OCR raw output: "३.१०" has low confidence 68.2%.',
            'Character contour analysis indicates digital splicing.',
          ],
          decision: 'PENDING',
        },
        {
          id: 'ag-202',
          code: 'FRAUD_OFFICER',
          name: 'AI Forensic Document Inspector',
          role: 'Inspects PDF byte structures, seal geometry, and signature anomalies.',
          model: 'ForensicDoc-Shield v2.8',
          status: 'FLAGGED',
          confidence: 94.2,
          recommendation: 'CRITICAL FRAUD: PDF edited using Adobe Illustrator. Government Tehsildar seal is fraudulent replica.',
          evidence: [
            'PDF Metadata tag: "CreatorTool: Adobe Illustrator 27.2 (Windows)"',
            'Circular seal radius deformed by 4.2% (Elliptical artifact from scanned sticker)',
            'Signature similarity to official Tehsildar bank only 41.2% (Likely tracing)',
          ],
          executionLogs: [
            'XMP metadata extraction executed.',
            'Found historical revision history with 3 separate saves in graphic editor.',
            'Circular Hough Transform failed official seal geometry check.',
          ],
          decision: 'PENDING',
        },
        {
          id: 'ag-203',
          code: 'LEGAL_OFFICER',
          name: 'AI Revenue Code & Legal Advisor',
          role: 'Validates compliance with Maharashtra Land Revenue Code 1966 & Hindu Succession Act.',
          model: 'Indian Land Law NLP Assistant',
          status: 'FLAGGED',
          confidence: 96.0,
          recommendation: 'Violates Section 6 of Hindu Succession Act (Coparcenary rights of daughters). Notice under Form 24 not served.',
          evidence: [
            'No registered Release Deed (Haq Sod Patra) from sisters Lata & Meena Shinde',
            'Court stay active under RCS No. 104/2023',
          ],
          executionLogs: [
            'Checked e-Courts API: Civil Suit active in Senior Division Baramati.',
            'Dispute status set to CRITICAL.',
          ],
          decision: 'PENDING',
        },
      ],
      gis: {
        parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
        statedAreaHa: 3.1,
        cadastralAreaHa: 2.85,
        satelliteAreaHa: 2.842,
        areaDiscrepancyPercent: -8.06,
        encroachmentDetected: true,
        encroachmentDetails: {
          areaSqm: 2580,
          encroachmentType: 'FARM_OVERSTEP',
          severity: 'CRITICAL',
        },
        landUseStated: 'Agricultural',
        landUseDetected: 'Agricultural + Illegal Brick Kiln (Bhatta)',
        landUseMatch: false,
        cadastralPolygon: [
          { lat: 18.154, lng: 74.58 },
          { lat: 18.1545, lng: 74.584 },
          { lat: 18.151, lng: 74.5845 },
          { lat: 18.1505, lng: 74.5805 },
        ],
        satelliteObservedPolygon: [
          { lat: 18.1538, lng: 74.5802 },
          { lat: 18.1543, lng: 74.5838 },
          { lat: 18.1512, lng: 74.5842 },
          { lat: 18.1507, lng: 74.5807 },
        ],
        statedPolygon: [
          { lat: 18.1545, lng: 74.5795 },
          { lat: 18.155, lng: 74.5845 },
          { lat: 18.1505, lng: 74.585 },
          { lat: 18.15, lng: 74.58 },
        ],
        certificateId: 'GIS-NIC-MH-2023-FLAG-881',
        verifiedAt: '2026-09-15T14:30:00.000Z',
      },
      fraud: {
        score: 82,
        riskCategory: 'HIGH_RISK',
        checks: {
          editedPdf: true,
          metadataMismatch: true,
          duplicateUpload: false,
          sealMismatch: true,
          signatureSimilarity: 41.2,
          imageManipulation: true,
          ocrOverwrite: true,
        },
        suspiciousRegions: [
          { x: 62, y: 78, width: 28, height: 16, label: 'Altered Tehsildar Seal & Traced Signature', severity: 'HIGH' },
          { x: 45, y: 32, width: 22, height: 10, label: 'Font Inconsistency in Area (3.10 Ha)', severity: 'HIGH' },
          { x: 12, y: 55, width: 35, height: 12, label: 'Omission of Co-sharer Heirs in Ferfar text', severity: 'MEDIUM' },
        ],
        forensicSummary:
          'High probability of document fabrication. PDF metadata reveals third-party editor intervention, stamp circularity fails tolerance, and active litigation is pending.',
        manualReviewStatus: 'QUEUED',
      },
      dispute: {
        riskIndex: 88,
        riskCategory: 'CRITICAL',
        reasons: [
          'Omission of female coparcenary legal heirs in mutation application.',
          'Active Civil Suit RCS No. 104/2023 with temporary injunction order.',
          'Document stated area (3.10 Ha) exceeds official village cadastral area (2.85 Ha) by 0.25 Ha.',
        ],
        evidenceItems: [
          'Certified copy of Regular Civil Suit 104/2023',
          'RTI application filed by sister Lata Shinde',
          'Area measurement discrepancy of 2,580 sq. meters on ground.',
        ],
        suggestedActions: [
          'Freeze digital mutation entry immediately under Section 154 MLRC.',
          'Issue summons to applicant Sanjay Shinde.',
          'Refer forged seal matter to District Anti-Corruption Cell / Police.',
        ],
        pendingCourtCases: ['RCS-104-2023-CJSD-BARAMATI'],
        collectorAlerted: true,
      },
      trust: {
        parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
        overallScore: 32.5,
        badge: 'HIGH_ATTENTION',
        aiVerificationScore: 48.0,
        officerVerificationBadge: {
          officerName: 'Verification Pending Review',
          designation: 'Special Investigation Officer (Collectorate)',
          officerId: 'AUD-LR-PUN-039',
          signatureHash: 'STAYED-BY-ORDER-ADM-2023',
          date: '2023-08-01',
        },
        districtSeal: 'HELD UNDER ADVERSE NOTICE (Pune Collectorate)',
        fraudClearance: false,
        qrVerificationUrl: 'https://bhulekh.gov.in/verify/IN-MH-PUN-BAR-2023-00088-B',
        digitalSignatureHash: 'UNVERIFIED-SIGNATURE-FLAGGED-CCA',
        lastVerifiedDate: '2026-09-15',
      },
      nearbyParcels: [
        { direction: 'NORTH', surveyNo: '87', ownerName: 'Vitthalrao Baburao Patil', areaHa: 2.1 },
        { direction: 'SOUTH', surveyNo: '89', ownerName: 'Nira Canal Left Bank Branch', areaHa: 0.8 },
        { direction: 'EAST', surveyNo: '88/A', ownerName: 'Baburao Vitthal Shinde', areaHa: 2.85 },
        { direction: 'WEST', surveyNo: '86', ownerName: 'Dnyandev Kisan Pawar', areaHa: 1.95 },
      ],
      recentInspections: [
        {
          date: '2024-03-20',
          officerName: 'Circle Officer Baramati',
          result: 'On-site notice pasted regarding civil court stay order.',
          photoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        },
      ],
    };

    // 3. Parcel 3: Mulshi (Paud) - Boundary & Encroachment Exemplar
    const parcel3: LandParcelDetail = {
      id: 'p-003',
      parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
      surveyNumber: '214',
      khasraNumber: '214',
      khataNumber: '312',
      village: 'Paud',
      taluka: 'Mulshi',
      district: 'Pune',
      state: 'Maharashtra',
      landAreaHa: 1.8,
      landAreaSqft: 193750.4,
      landType: 'Paddy / Hilly Watershed',
      revenueAssessmentInr: 28.0,
      ownerName: 'Ram Singh Thakur',
      fatherName: 'Bhavani Singh Thakur',
      coSharers: [{ name: 'Ram Singh Thakur', share: '100%', aadhaarLinked: true }],
      mutationNumber: 'MH-MUL-2024-M108',
      registrationNumber: 'PUN-MUL-REG-2024-0412',
      documentYear: 2024,
      status: 'PENDING',
      riskLevel: 'MEDIUM',
      trustIndex: 78.5,
      dna: {
        parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
        dnaHash: 'f4b1029384756acbe01928374659102938475610293847561029384756102938',
        centroid: { lat: 18.528, lng: 73.612 },
        polygon: [
          { lat: 18.5295, lng: 73.6105 },
          { lat: 18.53, lng: 73.6135 },
          { lat: 18.527, lng: 73.614 },
          { lat: 18.5265, lng: 73.611 },
        ],
        elevationMeters: 624.5,
        soilType: 'Red Lateritic Soil (Tambada Murum)',
        encumbranceStatus: 'UNENCUMBERED',
        totalMutations: 3,
        totalInspections: 2,
        riskScore: 38,
        lastDroneSurveyDate: '2026-01-18',
      },
      timeline: [
        {
          year: 1984,
          date: '1984-05-10',
          type: 'OWNERSHIP_CHANGE',
          title: 'Allotment under Watershed Development Programme',
          description: 'Allotted for terrace paddy farming.',
          ownerName: 'Bhavani Singh Thakur',
          areaHectares: 1.8,
        },
        {
          year: 2011,
          date: '2011-10-25',
          type: 'MUTATION_APPROVAL',
          title: 'Succession Mutation to Ram Singh Thakur',
          description: 'Sanctioned without dispute by Tehsildar Mulshi.',
          ownerName: 'Ram Singh Thakur',
          mutationNo: 'MUL-M-77',
          areaHectares: 1.8,
        },
        {
          year: 2024,
          date: '2024-06-02',
          type: 'SATELLITE_SNAPSHOT',
          title: 'Drone Survey Flagged Construction Activity',
          description: 'Semi-permanent tin shed detected along north-eastern boundary.',
          ownerName: 'Ram Singh Thakur',
          areaHectares: 1.8,
          satelliteImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
        },
      ],
      agents: [
        {
          id: 'ag-301',
          code: 'GIS_OFFICER',
          name: 'AI Cadastral & GIS Cartographer',
          role: 'Correlates stated document dimensions against Bhuvan-ISRO satellite imagery.',
          model: 'ISRO Geospatial Cadastral Net',
          status: 'FLAGGED',
          confidence: 91.5,
          recommendation: 'Encroachment alert: Tin shed structure extends 220 sqm past cadastral boundary into Gat 215.',
          evidence: [
            'Structure footprint: 220 sqm on eastern edge',
            'Cadastral boundary overlap into Forest Reserve corridor',
          ],
          executionLogs: ['Superimposed drone survey layer over master revenue village map.'],
          decision: 'PENDING',
        },
      ],
      gis: {
        parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
        statedAreaHa: 1.8,
        cadastralAreaHa: 1.8,
        satelliteAreaHa: 1.822,
        areaDiscrepancyPercent: 1.22,
        encroachmentDetected: true,
        encroachmentDetails: {
          areaSqm: 220,
          encroachmentType: 'CONSTRUCTION',
          severity: 'MEDIUM',
        },
        landUseStated: 'Paddy Agriculture',
        landUseDetected: 'Paddy Agriculture + Commercial Shed (Non-Agri Activity)',
        landUseMatch: false,
        cadastralPolygon: [
          { lat: 18.5295, lng: 73.6105 },
          { lat: 18.53, lng: 73.6135 },
          { lat: 18.527, lng: 73.614 },
          { lat: 18.5265, lng: 73.611 },
        ],
        satelliteObservedPolygon: [
          { lat: 18.5296, lng: 73.6104 },
          { lat: 18.5302, lng: 73.6139 },
          { lat: 18.5271, lng: 73.6142 },
          { lat: 18.5264, lng: 73.6109 },
        ],
        statedPolygon: [
          { lat: 18.5295, lng: 73.6105 },
          { lat: 18.53, lng: 73.6135 },
          { lat: 18.527, lng: 73.614 },
          { lat: 18.5265, lng: 73.611 },
        ],
        certificateId: 'GIS-NIC-MH-2024-M214',
        verifiedAt: '2026-09-17T11:00:00.000Z',
      },
      fraud: {
        score: 18,
        riskCategory: 'CLEAN',
        checks: {
          editedPdf: false,
          metadataMismatch: false,
          duplicateUpload: false,
          sealMismatch: false,
          signatureSimilarity: 94.0,
          imageManipulation: false,
          ocrOverwrite: false,
        },
        suspiciousRegions: [],
        forensicSummary: 'Document is authentic. Physical boundary demarcation required on ground.',
        manualReviewStatus: 'CLEARED',
      },
      dispute: {
        riskIndex: 38,
        riskCategory: 'MEDIUM',
        reasons: ['Boundary structure overlaps forest buffer zone boundary by 4 meters.'],
        evidenceItems: ['Drone ortho-mosaic map dated Jan 2026', 'Cadastral Gat Sheet No. 4 of Paud Village'],
        suggestedActions: ['Joint site inspection with Forest Range Officer Paud.', 'Issue notice under Section 50 MLRC.'],
        pendingCourtCases: [],
        collectorAlerted: false,
      },
      trust: {
        parcelUid: 'IN-MH-PUN-MUL-2024-00214-0',
        overallScore: 78.5,
        badge: 'UNDER_REVIEW',
        aiVerificationScore: 84.0,
        officerVerificationBadge: {
          officerName: 'Inspection Scheduled',
          designation: 'Taluka Inspector of Land Records (TILR Mulshi)',
          officerId: 'SOI-MH-DRN-201',
          signatureHash: 'PENDING-SITE-SURVEY-2024',
          date: '2024-06-10',
        },
        districtSeal: 'Pune Collectorate (Interim Verification)',
        fraudClearance: true,
        qrVerificationUrl: 'https://bhulekh.gov.in/verify/IN-MH-PUN-MUL-2024-00214-0',
        digitalSignatureHash: 'DIGITAL-SIGNATURE-INTERIM-MH-7718',
        lastVerifiedDate: '2026-09-17',
      },
      nearbyParcels: [
        { direction: 'NORTH', surveyNo: '213', ownerName: 'Paud Village Common Grazing Land (Gairan)', areaHa: 5.2 },
        { direction: 'SOUTH', surveyNo: '215', ownerName: 'Maharashtra State Forest Reserve', areaHa: 14.8 },
        { direction: 'EAST', surveyNo: '216', ownerName: 'Anant Govind Marathe', areaHa: 2.1 },
        { direction: 'WEST', surveyNo: '211', ownerName: 'Sudhir V. Kadam', areaHa: 1.4 },
      ],
      recentInspections: [
        {
          date: '2026-01-18',
          officerName: 'Er. Arun Kumar Singh (Surveyor)',
          result: 'GPS coordinates recorded for boundary markers 1, 2, 3, 4.',
          photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
        },
      ],
    };

    // 4. Parcel 4: Khed (Chakan) - Industrial Corridor
    const parcel4: LandParcelDetail = {
      id: 'p-004',
      parcelUid: 'IN-MH-PUN-KHD-2022-00305-C',
      surveyNumber: '305/C',
      khasraNumber: '305/C',
      khataNumber: '119',
      village: 'Chakan',
      taluka: 'Khed',
      district: 'Pune',
      state: 'Maharashtra',
      landAreaHa: 4.2,
      landAreaSqft: 452084.2,
      landType: 'Non-Agricultural (Industrial Zone / MIDC Phase 2)',
      revenueAssessmentInr: 184.0,
      ownerName: 'Dattatraya Balwant Deshmukh',
      fatherName: 'Balwant R. Deshmukh',
      coSharers: [{ name: 'Dattatraya Balwant Deshmukh', share: '100%', aadhaarLinked: true }],
      mutationNumber: 'MH-KHD-2022-M892',
      registrationNumber: 'PUN-KHD-REG-2022-3341',
      documentYear: 2022,
      status: 'VERIFIED',
      riskLevel: 'LOW',
      trustIndex: 94.2,
      dna: {
        parcelUid: 'IN-MH-PUN-KHD-2022-00305-C',
        dnaHash: '9827346102938475610293847561029384756102938475610293847561029384',
        centroid: { lat: 18.758, lng: 73.856 },
        polygon: [
          { lat: 18.76, lng: 73.854 },
          { lat: 18.761, lng: 73.858 },
          { lat: 18.756, lng: 73.859 },
          { lat: 18.755, lng: 73.855 },
        ],
        elevationMeters: 610.0,
        soilType: 'Hard Basalt Rock / Clayey Loam',
        encumbranceStatus: 'UNENCUMBERED',
        totalMutations: 5,
        totalInspections: 4,
        riskScore: 12,
        lastDroneSurveyDate: '2025-08-12',
      },
      timeline: [
        {
          year: 1974,
          date: '1974-04-12',
          type: 'OWNERSHIP_CHANGE',
          title: 'Agricultural Allotment',
          description: 'Inherited agricultural holding.',
          ownerName: 'Balwant R. Deshmukh',
          areaHectares: 4.2,
        },
        {
          year: 2012,
          date: '2012-09-18',
          type: 'GOV_ACQUISITION',
          title: 'NA Conversion & MIDC Notification',
          description: 'Converted from Agri to Industrial use under Section 44 MLRC.',
          ownerName: 'Dattatraya Balwant Deshmukh',
          areaHectares: 4.2,
        },
        {
          year: 2022,
          date: '2022-11-20',
          type: 'VERIFICATION',
          title: 'Industrial Cadastral Boundary Formalized',
          description: 'MIDC Joint Survey completed with boundary stones erected.',
          ownerName: 'Dattatraya Balwant Deshmukh',
          areaHectares: 4.2,
        },
      ],
      agents: [
        {
          id: 'ag-401',
          code: 'OCR_OFFICER',
          name: 'AI Document OCR Specialist',
          role: 'Scans & transcribes Devanagari script and tabular RoR fields.',
          model: 'PaddleOCR-v4 + TrOCR Indic',
          status: 'APPROVED',
          confidence: 99.0,
          recommendation: 'Full match with Chakan Industrial Land Register.',
          evidence: ['Clear print quality', 'Digital Sanad verification valid'],
          executionLogs: ['Extracted NA Sanad Order No. 44/2012.'],
          decision: 'OFFICER_APPROVED',
        },
      ],
      gis: {
        parcelUid: 'IN-MH-PUN-KHD-2022-00305-C',
        statedAreaHa: 4.2,
        cadastralAreaHa: 4.2,
        satelliteAreaHa: 4.195,
        areaDiscrepancyPercent: -0.12,
        encroachmentDetected: false,
        landUseStated: 'Industrial Zone (MIDC Approved)',
        landUseDetected: 'Industrial Warehouse & Logistics Yard',
        landUseMatch: true,
        cadastralPolygon: [
          { lat: 18.76, lng: 73.854 },
          { lat: 18.761, lng: 73.858 },
          { lat: 18.756, lng: 73.859 },
          { lat: 18.755, lng: 73.855 },
        ],
        satelliteObservedPolygon: [
          { lat: 18.76, lng: 73.854 },
          { lat: 18.761, lng: 73.858 },
          { lat: 18.756, lng: 73.859 },
          { lat: 18.755, lng: 73.855 },
        ],
        statedPolygon: [
          { lat: 18.76, lng: 73.854 },
          { lat: 18.761, lng: 73.858 },
          { lat: 18.756, lng: 73.859 },
          { lat: 18.755, lng: 73.855 },
        ],
        certificateId: 'GIS-NIC-MH-2022-K305',
        verifiedAt: '2025-08-12T16:00:00.000Z',
      },
      fraud: {
        score: 5,
        riskCategory: 'CLEAN',
        checks: {
          editedPdf: false,
          metadataMismatch: false,
          duplicateUpload: false,
          sealMismatch: false,
          signatureSimilarity: 99.1,
          imageManipulation: false,
          ocrOverwrite: false,
        },
        suspiciousRegions: [],
        forensicSummary: 'No anomalies. Standard industrial parcel.',
        manualReviewStatus: 'CLEARED',
      },
      dispute: {
        riskIndex: 12,
        riskCategory: 'LOW',
        reasons: ['Clean title with direct MIDC non-agricultural Sanad.'],
        evidenceItems: ['NA Sanad Certificate issued by Collector Pune.'],
        suggestedActions: ['Ready for routine transaction.'],
        pendingCourtCases: [],
        collectorAlerted: false,
      },
      trust: {
        parcelUid: 'IN-MH-PUN-KHD-2022-00305-C',
        overallScore: 94.2,
        badge: 'VERIFIED_GOLD',
        aiVerificationScore: 96.0,
        officerVerificationBadge: {
          officerName: 'Dr. Rajesh Verma, IAS',
          designation: 'Mission Director / Collector Pune',
          officerId: 'NIC-GOI-001',
          signatureHash: 'e-Sign-CCA-IN-2022-KHD-0918',
          date: '2022-11-20',
        },
        districtSeal: 'District Collectorate Pune (NIC Cadastral Node)',
        fraudClearance: true,
        qrVerificationUrl: 'https://bhulekh.gov.in/verify/IN-MH-PUN-KHD-2022-00305-C',
        digitalSignatureHash: 'DIGITAL-CERT-KHED-CHAKAN-99281',
        lastVerifiedDate: '2025-08-12',
      },
      nearbyParcels: [
        { direction: 'NORTH', surveyNo: '304', ownerName: 'MIDC 45-Meter Arterial Highway', areaHa: 3.0 },
        { direction: 'SOUTH', surveyNo: '306', ownerName: 'Mahindra Logistics Hub', areaHa: 6.5 },
        { direction: 'EAST', surveyNo: '305/B', ownerName: 'Chakan Industrial Park Ltd', areaHa: 4.0 },
        { direction: 'WEST', surveyNo: '305/D', ownerName: 'Private Holding', areaHa: 2.1 },
      ],
      recentInspections: [
        {
          date: '2025-08-12',
          officerName: 'Er. Arun Kumar Singh (Surveyor)',
          result: 'MIDC boundary walls surveyed with high precision RTK GPS.',
          photoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        },
      ],
    };

    // 5. Parcel 5: Hadapsar, Haveli - Mutation Simulation Pending
    const parcel5: LandParcelDetail = {
      id: 'p-005',
      parcelUid: 'IN-MH-PUN-HAV-2024-00419-X',
      surveyNumber: '419',
      khasraNumber: '419',
      khataNumber: '884',
      village: 'Hadapsar',
      taluka: 'Haveli',
      district: 'Pune',
      state: 'Maharashtra',
      landAreaHa: 0.95,
      landAreaSqft: 102257.1,
      landType: 'Semi-Urban Agricultural (Peri-Urban Fringe)',
      revenueAssessmentInr: 22.0,
      ownerName: 'Late Vitthal Raoji Kadam (Rep. by legal heirs)',
      fatherName: 'Raoji Kadam',
      coSharers: [
        { name: 'Vijay Vitthal Kadam (Son)', share: '33.33%', aadhaarLinked: true },
        { name: 'Anita Vitthal Kadam (Daughter)', share: '33.33%', aadhaarLinked: true },
        { name: 'Prakash Vitthal Kadam (Son)', share: '33.34%', aadhaarLinked: true },
      ],
      mutationNumber: 'MH-HAV-2024-M-SIM-12',
      registrationNumber: 'PUN-HAV-REG-2024-9918',
      documentYear: 2024,
      status: 'PENDING',
      riskLevel: 'LOW',
      trustIndex: 91.0,
      dna: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00419-X',
        dnaHash: '8371948576201938475610293847561029384756102938475610293847561029',
        centroid: { lat: 18.502, lng: 73.928 },
        polygon: [
          { lat: 18.503, lng: 73.927 },
          { lat: 18.5035, lng: 73.9295 },
          { lat: 18.501, lng: 73.929 },
          { lat: 18.5005, lng: 73.9275 },
        ],
        elevationMeters: 554.0,
        soilType: 'Black Clayey',
        encumbranceStatus: 'UNENCUMBERED',
        totalMutations: 2,
        totalInspections: 1,
        riskScore: 14,
        lastDroneSurveyDate: '2026-02-10',
      },
      timeline: [
        {
          year: 1982,
          date: '1982-08-19',
          type: 'OWNERSHIP_CHANGE',
          title: 'Registered Sale Deed',
          description: 'Purchased by Vitthal Raoji Kadam.',
          ownerName: 'Vitthal Raoji Kadam',
          areaHectares: 0.95,
        },
        {
          year: 2024,
          date: '2024-01-14',
          type: 'MUTATION_APPROVAL',
          title: 'Succession Mutation Application Form 12',
          description: 'Joint application by all 3 legal heirs under Section 149 MLRC 1966.',
          ownerName: 'Heirs of Vitthal Kadam',
          mutationNo: 'MH-HAV-2024-M-SIM-12',
          areaHectares: 0.95,
        },
      ],
      agents: [
        {
          id: 'ag-501',
          code: 'LEGAL_OFFICER',
          name: 'AI Revenue Code & Legal Advisor',
          role: 'Validates compliance with Maharashtra Land Revenue Code 1966 & Hindu Succession Act.',
          model: 'Indian Land Law NLP Assistant',
          status: 'APPROVED',
          confidence: 97.5,
          recommendation: 'All statutory heirs included with 1/3rd equal share. No fragmentation below ceiling.',
          evidence: ['Aadhaar authenticated death certificate', 'Vanshavali (Genealogy tree) verified by Talathi'],
          executionLogs: ['Verified legal heirs against Talathi report.'],
          decision: 'OFFICER_APPROVED',
        },
      ],
      gis: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00419-X',
        statedAreaHa: 0.95,
        cadastralAreaHa: 0.95,
        satelliteAreaHa: 0.949,
        areaDiscrepancyPercent: -0.1,
        encroachmentDetected: false,
        landUseStated: 'Agricultural',
        landUseDetected: 'Vegetable Farming',
        landUseMatch: true,
        cadastralPolygon: [
          { lat: 18.503, lng: 73.927 },
          { lat: 18.5035, lng: 73.9295 },
          { lat: 18.501, lng: 73.929 },
          { lat: 18.5005, lng: 73.9275 },
        ],
        satelliteObservedPolygon: [
          { lat: 18.503, lng: 73.927 },
          { lat: 18.5035, lng: 73.9295 },
          { lat: 18.501, lng: 73.929 },
          { lat: 18.5005, lng: 73.9275 },
        ],
        statedPolygon: [
          { lat: 18.503, lng: 73.927 },
          { lat: 18.5035, lng: 73.9295 },
          { lat: 18.501, lng: 73.929 },
          { lat: 18.5005, lng: 73.9275 },
        ],
        certificateId: 'GIS-NIC-MH-2024-H419',
        verifiedAt: '2026-02-10T09:00:00.000Z',
      },
      fraud: {
        score: 6,
        riskCategory: 'CLEAN',
        checks: {
          editedPdf: false,
          metadataMismatch: false,
          duplicateUpload: false,
          sealMismatch: false,
          signatureSimilarity: 97.8,
          imageManipulation: false,
          ocrOverwrite: false,
        },
        suspiciousRegions: [],
        forensicSummary: 'Clean succession application.',
        manualReviewStatus: 'CLEARED',
      },
      dispute: {
        riskIndex: 10,
        riskCategory: 'LOW',
        reasons: ['Consensual application with all legal heirs as co-applicants.'],
        evidenceItems: ['Joint affidavit filed on non-judicial stamp paper INR 500.'],
        suggestedActions: ['Sanction mutation order Form 12.'],
        pendingCourtCases: [],
        collectorAlerted: false,
      },
      trust: {
        parcelUid: 'IN-MH-PUN-HAV-2024-00419-X',
        overallScore: 91.0,
        badge: 'VERIFIED_SILVER',
        aiVerificationScore: 94.0,
        officerVerificationBadge: {
          officerName: 'Shri Suresh Patil',
          designation: 'Sub-Divisional Magistrate / Tehsildar (Haveli)',
          officerId: 'MH-TEH-HAV-491',
          signatureHash: 'e-Sign-CCA-IN-2024-HAV-4190',
          date: '2024-01-20',
        },
        districtSeal: 'Pune Collectorate (NIC Node)',
        fraudClearance: true,
        qrVerificationUrl: 'https://bhulekh.gov.in/verify/IN-MH-PUN-HAV-2024-00419-X',
        digitalSignatureHash: 'DIGITAL-SIGN-HADAPSAR-419-2024',
        lastVerifiedDate: '2026-02-10',
      },
      nearbyParcels: [
        { direction: 'NORTH', surveyNo: '418', ownerName: 'Hadapsar DP Road Reserve', areaHa: 0.2 },
        { direction: 'SOUTH', surveyNo: '420', ownerName: 'Kadam Brothers Agri Trust', areaHa: 1.5 },
        { direction: 'EAST', surveyNo: '419/B', ownerName: 'Ganesh Sakharam Shinde', areaHa: 0.8 },
        { direction: 'WEST', surveyNo: '417', ownerName: 'Laxman Pandurang Pawar', areaHa: 1.1 },
      ],
      recentInspections: [
        {
          date: '2026-02-10',
          officerName: 'Talathi Haveli (Hadapsar Saja)',
          result: 'On-site inquiry verified possession with 3 surviving heirs.',
          photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60',
        },
      ],
    };

    this.parcels = [parcel1, parcel2, parcel3, parcel4, parcel5];

    // Seed Documents for parcel 1 & 2
    this.documents = [
      {
        id: 'doc-001',
        parcelId: 'p-001',
        recordType: '7/12_ROR',
        fileName: 'ROR_7_12_HAVELI_WAGHOLI_142A_2024.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        fileSizeBytes: 1845200,
        mimeType: 'application/pdf',
        sha256Hash: 'a7b9841e4b8549bcde1284a19349dfbc0928371948baedfe8347102938472918',
        ocrConfidence: 99.2,
        uploadedAt: '2026-09-18T09:40:00.000Z',
        uploadedByName: 'Shri Suresh Patil',
        uploadedByOfficerId: 'u-govt-officer-04',
        district: 'Pune',
        taluka: 'Haveli',
        village: 'Wagholi',
        documentYear: 2024,
        extractedFields: [
          {
            id: 'f-1',
            fieldName: 'ownerName',
            label: 'Landowner Name (खातेदाराचे नाव)',
            extractedValue: 'Rameshwar Kisan Patil',
            verifiedValue: 'Rameshwar Kisan Patil',
            confidence: 99.4,
            boundingBox: { x: 18, y: 22, width: 34, height: 4.8 },
            rawOcrText: 'रमेशवर किसन पाटील',
            aiExplanation: 'Matched Devnagari cursive ligature with RoR Gazette index with 99.4% confidence.',
            isHandwritten: false,
            status: 'APPROVED',
            historicalValue: 'Kisan Dhondiba Patil',
            historicalYear: 1978,
          },
          {
            id: 'f-2',
            fieldName: 'fatherName',
            label: "Father's / Husband's Name (वडिलांचे नाव)",
            extractedValue: 'Kisan Dhondiba Patil',
            verifiedValue: 'Kisan Dhondiba Patil',
            confidence: 98.8,
            boundingBox: { x: 18, y: 27.5, width: 28, height: 4.5 },
            rawOcrText: 'किसन धोंडीबा पाटील',
            aiExplanation: 'Continuous patronymic lineage verified from Ferfar No. 114.',
            isHandwritten: false,
            status: 'APPROVED',
          },
          {
            id: 'f-3',
            fieldName: 'surveyNumber',
            label: 'Survey / Gat Number (गट / सर्व्हे क्र.)',
            extractedValue: '142/A',
            verifiedValue: '142/A',
            confidence: 99.7,
            boundingBox: { x: 12, y: 14, width: 14, height: 4.5 },
            rawOcrText: '१४२/अ',
            aiExplanation: 'Subdivision "A" matches Haveli cadastral village sheet layout.',
            isHandwritten: false,
            status: 'APPROVED',
          },
          {
            id: 'f-4',
            fieldName: 'khataNumber',
            label: 'Khata Number (खाते क्र.)',
            extractedValue: '518',
            verifiedValue: '518',
            confidence: 99.1,
            boundingBox: { x: 55, y: 14, width: 12, height: 4.5 },
            rawOcrText: '५१८',
            aiExplanation: 'Revenue assessment account number indexed in Treasury ledger.',
            isHandwritten: false,
            status: 'APPROVED',
          },
          {
            id: 'f-5',
            fieldName: 'landArea',
            label: 'Total Land Area (एकूण क्षेत्रफळ)',
            extractedValue: '2.45 Hectares (2.4500 Ha)',
            verifiedValue: '2.45 Hectares',
            confidence: 98.9,
            boundingBox: { x: 72, y: 22, width: 20, height: 5.0 },
            rawOcrText: '२.४५०० हेक्टर',
            aiExplanation: 'Standard decimal hectare notation confirmed against Patwari roznamcha.',
            isHandwritten: false,
            status: 'APPROVED',
            historicalValue: '4.90 Hectares (Pre-subdivision)',
            historicalYear: 1999,
          },
          {
            id: 'f-6',
            fieldName: 'landType',
            label: 'Land Classification (जमिनीचा प्रकार)',
            extractedValue: 'Jirayat / Bagayat (Irrigated)',
            verifiedValue: 'Jirayat / Bagayat (Irrigated)',
            confidence: 97.4,
            boundingBox: { x: 72, y: 28, width: 22, height: 4.5 },
            rawOcrText: 'जिरायत / बागायत',
            aiExplanation: 'Well & canal irrigation rights logged under Column 12 (Pik Pahani).',
            isHandwritten: false,
            status: 'APPROVED',
          },
          {
            id: 'f-7',
            fieldName: 'mutationNumber',
            label: 'Latest Mutation Entry (फेरफार क्र.)',
            extractedValue: 'MH-HAV-2024-M918',
            verifiedValue: 'MH-HAV-2024-M918',
            confidence: 99.3,
            boundingBox: { x: 18, y: 44, width: 26, height: 4.8 },
            rawOcrText: '९१८ (प्रमाणित)',
            aiExplanation: 'Certified mutation order signed by Circle Officer on 18/04/2024.',
            isHandwritten: true,
            status: 'APPROVED',
          },
        ],
        version: 1,
      },
      {
        id: 'doc-002',
        parcelId: 'p-002',
        recordType: '7/12_ROR',
        fileName: 'SUSPICIOUS_MUTATION_BARAMATI_88B.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=60',
        fileSizeBytes: 2410290,
        mimeType: 'application/pdf',
        sha256Hash: 'ba83918237461928374659102938475610293847561029384756102938475610',
        ocrConfidence: 76.4,
        uploadedAt: '2026-09-15T12:00:00.000Z',
        uploadedByName: 'External Portal Submission',
        uploadedByOfficerId: 'u-citizen-07',
        district: 'Pune',
        taluka: 'Baramati',
        village: 'Malegaon Khurd',
        documentYear: 2023,
        extractedFields: [
          {
            id: 'f-201',
            fieldName: 'ownerName',
            label: 'Landowner Name (खातेदाराचे नाव)',
            extractedValue: 'Sanjay Jagannath Shinde',
            confidence: 81.2,
            boundingBox: { x: 18, y: 22, width: 34, height: 4.8 },
            rawOcrText: 'संजय जगन्नाथ शिंदे',
            aiExplanation: 'Co-heir sisters omitted in succession entry contrary to 2018 record.',
            isHandwritten: false,
            status: 'REJECTED',
            historicalValue: 'Heirs of Jagannath Shinde (3 co-sharers)',
            historicalYear: 2018,
          },
          {
            id: 'f-202',
            fieldName: 'landArea',
            label: 'Total Land Area (एकूण क्षेत्रफळ)',
            extractedValue: '3.10 Hectares (3.1000 Ha)',
            confidence: 68.2,
            boundingBox: { x: 72, y: 22, width: 20, height: 5.0 },
            rawOcrText: '३.१० (Alteration Flagged)',
            aiExplanation: 'Font mismatch and OCR overwrite detected. Baseline shifted by 3.4 pixels.',
            isHandwritten: false,
            status: 'REJECTED',
            historicalValue: '2.85 Hectares',
            historicalYear: 1968,
          },
          {
            id: 'f-203',
            fieldName: 'sealAuthentication',
            label: 'Tehsildar Seal & Stamp',
            extractedValue: 'Official Circular Seal (Flagged Discrepancy)',
            confidence: 42.0,
            boundingBox: { x: 62, y: 78, width: 28, height: 16 },
            rawOcrText: 'तहसीलदार बारामती (अनधिकृत प्रति)',
            aiExplanation: 'Seal circularity is 0.88 (elliptical sticker overlay). Signature similarity 41.2%.',
            isHandwritten: true,
            status: 'REJECTED',
          },
        ],
        version: 1,
      },
    ];
  }

  // Simulation generator for mutation
  simulateMutation(parcelId: string, applicantName: string, transferType: any): MutationSimulationResult {
    const parcel = this.parcels.find((p) => p.id === parcelId) || this.parcels[0];
    return {
      mutationNumber: `MH-SIM-${Date.now().toString().slice(-6)}`,
      applicantName,
      transferType,
      beforeMutation: {
        totalAreaHa: parcel.landAreaHa,
        owners: parcel.coSharers.map((cs) => ({
          name: cs.name,
          sharePercent: parseFloat(cs.share) || 100,
        })),
        khataNo: parcel.khataNumber,
        encumbrances: parcel.dna.encumbranceStatus === 'UNENCUMBERED' ? ['Nil Encumbrances'] : [parcel.dna.encumbranceStatus],
      },
      afterMutation: {
        totalAreaHa: parcel.landAreaHa,
        owners: [
          { name: `${applicantName} (Successor/Purchaser)`, sharePercent: 50.0, relation: 'Primary Transferee' },
          { name: 'Co-Sharer A (Retained)', sharePercent: 25.0, relation: 'Co-Sharer' },
          { name: 'Co-Sharer B (Retained)', sharePercent: 25.0, relation: 'Co-Sharer' },
        ],
        khataNo: `${parcel.khataNumber}/New`,
        encumbrances: ['Stamp Duty Verification Pending', 'Statutory 15-Day Public Notice Form 24'],
        fragmentationWarning:
          parcel.landAreaHa / 3 < 0.4
            ? 'Warning: Resulting subdivided share falls below 0.40 Ha standard limit under Bombay Prevention of Fragmentation Act.'
            : undefined,
      },
      legalPreCheckPassed: parcel.dna.encumbranceStatus !== 'COURT_STAY',
      statutoryWarnings:
        parcel.dna.encumbranceStatus === 'COURT_STAY'
          ? ['CRITICAL: Active Court Injunction prevents sanctioning of mutation under Section 154 MLRC.']
          : ['Notice must be served on all adjoining survey holders within 15 days.', 'Aadhaar e-Sign mandatory for all transferees.'],
      suggestedOrderText: `In the Court of Sub-Divisional Officer / Tehsildar, Haveli. Pursuant to application submitted under Section 149 of the Maharashtra Land Revenue Code, 1966, the mutation entry has been mathematically verified. Resulting partition complies with agricultural ceiling limits. Public notice Form 24 is hereby sanctioned.`,
    };
  }

  // Document Comparison generator
  compareDocuments(parcelId: string): DocumentDiffComparison {
    const parcel = this.parcels.find((p) => p.id === parcelId) || this.parcels[0];
    const docYear = parcel.documentYear || 2024;
    return {
      docA: {
        title: `Cadastral RoR (Historical Year ${docYear - 10})`,
        year: docYear - 10,
        type: '7/12 Extract (Record of Rights)',
      },
      docB: {
        title: `Digital RoR (Current Year ${docYear})`,
        year: docYear,
        type: '7/12 Extract (e-Mahabhulekh Digital Sign)',
      },
      differences: [
        {
          field: 'Owner Name (खातेदार)',
          oldValue: parcel.fatherName || 'Ancestral Holder',
          newValue: parcel.ownerName,
          diffType: 'CHANGED',
          impact: 'HIGH',
        },
        {
          field: 'Area (क्षेत्रफळ)',
          oldValue: `${parcel.landAreaHa} Ha`,
          newValue: `${parcel.landAreaHa} Ha`,
          diffType: 'SAME',
          impact: 'LOW',
        },
        {
          field: 'Mutation Entry (फेरफार)',
          oldValue: 'Historical Succession No. 114',
          newValue: parcel.mutationNumber,
          diffType: 'CHANGED',
          impact: 'MEDIUM',
        },
        {
          field: 'Aadhaar e-KYC Linkage',
          oldValue: 'Not Available (Manual Registry)',
          newValue: 'Linked & Biometrically Verified (UIDAI)',
          diffType: 'ADDED',
          impact: 'HIGH',
        },
        {
          field: 'CERSAI Lien Status',
          oldValue: 'Manual Non-Encumbrance Certificate',
          newValue: 'Online Central Registry Clean (Zero Liens)',
          diffType: 'ADDED',
          impact: 'MEDIUM',
        },
      ],
      areaDiffHa: 0.0,
      ownershipDiffSummary: `Lawful succession recorded from ${parcel.fatherName} to ${parcel.ownerName} with verified revenue lineage.`,
    };
  }

  // Ingests, verifies and patches dynamic data uploaded by Officer into the live database
  upsertParcelFromUpload(input: {
    recordType?: string;
    district?: string;
    taluka?: string;
    village?: string;
    documentYear?: number;
    fileName?: string;
    ownerName?: string;
    fatherName?: string;
    surveyNumber?: string;
    khasraNumber?: string;
    khataNumber?: string;
    landAreaHa?: number;
    landType?: string;
    mutationNumber?: string;
    rawOcrText?: string;
    confidence?: number;
  }): { parcel: LandParcelDetail; document: DocumentRecord; isNew: boolean } {
    const district = input.district || 'Pune';
    const taluka = input.taluka || 'Haveli';
    const village = input.village || 'Wagholi';
    const docYear = Number(input.documentYear) || 2024;
    const surveyNumber = input.surveyNumber?.trim() || '219/3';
    const ownerName = input.ownerName?.trim() || 'Rameshwar Kisan Patil';
    const fatherName = input.fatherName?.trim() || 'Kisan Dhondiba Patil';
    const landAreaHa = typeof input.landAreaHa === 'number' && !isNaN(input.landAreaHa) ? input.landAreaHa : 2.45;
    const landType = input.landType || 'Perennially Irrigated Agricultural (Jirayat / Bagayat)';
    const mutationNumber = input.mutationNumber || `MH-${taluka.slice(0, 3).toUpperCase()}-${docYear}-M${Math.floor(1000 + Math.random() * 9000)}`;
    const khataNumber = input.khataNumber || `KH-${surveyNumber.replace(/[^0-9]/g, '') || '742'}`;
    const cleanSurvey = surveyNumber.replace(/[^a-zA-Z0-9]/g, '-');
    const parcelUid = `IN-MH-${district.slice(0, 3).toUpperCase()}-${taluka.slice(0, 3).toUpperCase()}-${docYear}-${cleanSurvey}`;

    // Base coordinates according to village
    let centerLat = 18.5793;
    let centerLng = 73.9821;
    const vLower = village.toLowerCase();
    if (vLower.includes('paud')) {
      centerLat = 18.5284;
      centerLng = 73.6124;
    } else if (vLower.includes('malegaon') || vLower.includes('baramati')) {
      centerLat = 18.1528;
      centerLng = 74.5771;
    } else if (vLower.includes('chakan') || vLower.includes('khed')) {
      centerLat = 18.7612;
      centerLng = 73.8592;
    } else if (vLower.includes('hadapsar')) {
      centerLat = 18.5089;
      centerLng = 73.9259;
    }

    // Generate boundary polygon around centroid (proportional to area)
    const delta = 0.0015 * Math.sqrt(Math.max(0.5, landAreaHa));
    const polygon = [
      { lat: Number((centerLat + delta * 1.1).toFixed(6)), lng: Number((centerLng - delta * 0.9).toFixed(6)) },
      { lat: Number((centerLat + delta * 1.2).toFixed(6)), lng: Number((centerLng + delta * 1.1).toFixed(6)) },
      { lat: Number((centerLat - delta * 0.9).toFixed(6)), lng: Number((centerLng + delta * 1.2).toFixed(6)) },
      { lat: Number((centerLat - delta * 1.1).toFixed(6)), lng: Number((centerLng - delta * 0.8).toFixed(6)) },
    ];

    // Find if already exists in parcels
    const existingIndex = this.parcels.findIndex(
      (p) => p.surveyNumber.toLowerCase() === surveyNumber.toLowerCase() || p.parcelUid === parcelUid
    );

    let targetParcel: LandParcelDetail;
    const isNew = existingIndex < 0;

    if (!isNew) {
      // Patch existing parcel with the new data from uploaded record
      targetParcel = this.parcels[existingIndex];
      targetParcel.ownerName = ownerName;
      targetParcel.fatherName = fatherName;
      targetParcel.surveyNumber = surveyNumber;
      targetParcel.village = village;
      targetParcel.taluka = taluka;
      targetParcel.district = district;
      targetParcel.landAreaHa = landAreaHa;
      targetParcel.landAreaSqft = Number((landAreaHa * 107639.1).toFixed(2));
      targetParcel.landType = landType;
      targetParcel.mutationNumber = mutationNumber;
      targetParcel.status = 'VERIFIED';
      targetParcel.riskLevel = 'LOW';
      targetParcel.trustIndex = 98.6;
      targetParcel.documentYear = docYear;
      targetParcel.lastUpdated = 'Just now (Officer Ingestion Verified)';
      targetParcel.coSharers = [
        { name: ownerName, share: `100% (${landAreaHa} Ha)`, aadhaarLinked: true }
      ];
      targetParcel.gis.cadastralAreaHa = landAreaHa;
      targetParcel.gis.statedAreaHa = landAreaHa;
      targetParcel.gis.satelliteAreaHa = Number((landAreaHa * 0.998).toFixed(3));
      targetParcel.gis.encroachmentDetected = false;
    } else {
      // Create new LandParcelDetail
      const newId = `p-upload-${Date.now()}`;
      targetParcel = {
        id: newId,
        parcelUid,
        surveyNumber,
        khasraNumber: input.khasraNumber || surveyNumber,
        khataNumber,
        village,
        taluka,
        district,
        state: 'Maharashtra',
        landAreaHa,
        landAreaSqft: Number((landAreaHa * 107639.1).toFixed(2)),
        landType,
        revenueAssessmentInr: Number((landAreaHa * 20.4).toFixed(1)),
        ownerName,
        fatherName,
        coSharers: [
          { name: ownerName, share: `100% (${landAreaHa} Ha)`, aadhaarLinked: true }
        ],
        mutationNumber,
        registrationNumber: `MH-${district.slice(0, 3).toUpperCase()}-REG-${docYear}-${Math.floor(1000 + Math.random() * 9000)}`,
        documentYear: docYear,
        status: 'VERIFIED',
        riskLevel: 'LOW',
        trustIndex: 98.8,
        confidenceScore: 99.4,
        lastUpdated: 'Just now (Officer Ingested)',
        dna: {
          parcelUid,
          dnaHash: `sha384-gov-maha-${Date.now()}-${cleanSurvey}`,
          centroid: { lat: centerLat, lng: centerLng },
          polygon,
          elevationMeters: 558.2,
          soilType: 'Medium Black Fertile Soil (Regur)',
          encumbranceStatus: 'UNENCUMBERED',
          totalMutations: 3,
          totalInspections: 2,
          riskScore: 3,
          lastDroneSurveyDate: '2026-08-20',
        },
        timeline: [
          {
            year: 1954,
            date: '1954-05-12',
            type: 'OWNERSHIP_CHANGE',
            title: 'Cadastral Settlement Registry (RoR)',
            description: `Original ancestral holding registered under Bombay Tenancy Act in ${village}.`,
            ownerName: fatherName,
            areaHectares: landAreaHa,
          },
          {
            year: 1988,
            date: '1988-11-20',
            type: 'MUTATION_APPROVAL',
            title: 'Lawful Lineage Succession (Ferfar)',
            description: `Succession partitioned and recorded under Section 149 MLRC.`,
            ownerName: fatherName,
            mutationNo: `MH-M-342`,
            areaHectares: landAreaHa,
          },
          {
            year: docYear,
            date: new Date().toISOString().slice(0, 10),
            type: 'VERIFICATION',
            title: 'Digital RoR & Satellite Truth Cross-Verification',
            description: `Document ingested and verified by Revenue Officer with Cartosat-3 satellite alignment.`,
            ownerName,
            mutationNo: mutationNumber,
            areaHectares: landAreaHa,
          }
        ],
        agents: [
          {
            id: 'ag-1',
            code: 'OCR_OFFICER',
            name: 'PaddleOCR + TrOCR Indic Specialist',
            role: 'Devanagari OCR Extraction & Ligature Verification',
            model: 'TrOCR-Indic-v3 + PaddleOCR-Multilingual',
            status: 'APPROVED',
            confidence: 99.4,
            recommendation: 'Clear high-resolution text lines match government standard 7/12 format with 99.4% confidence.',
            evidence: ['Devanagari character consistency 99.4%', 'Zero ligature segmentation anomalies detected'],
            executionLogs: ['Document pre-processed at 300 DPI.', 'Bounding boxes identified across 6 revenue fields.'],
            decision: 'OFFICER_APPROVED',
          },
          {
            id: 'ag-2',
            code: 'VERIFICATION_OFFICER',
            name: 'Statutory Revenue Cross-Verification Officer',
            role: 'MLRC Statutory Compliance & Land Ceiling Audit',
            model: 'RevenueLegal-LLM-v2.8',
            status: 'APPROVED',
            confidence: 99.1,
            recommendation: 'Area within statutory ceiling limits under Section 63/149 MLRC. Treasury fee stamps confirmed.',
            evidence: [`Area ${landAreaHa} Ha complies with ceiling limit`, 'Khata formatting adheres to e-Mahabhulekh schema'],
            executionLogs: ['Section 149 MLRC compliance check executed.', 'Khata record link validated.'],
            decision: 'OFFICER_APPROVED',
          },
          {
            id: 'ag-3',
            code: 'GIS_OFFICER',
            name: 'Cadastral & Satellite Truth Cartographer',
            role: 'Cartosat-3 Satellite Boundary & Encroachment Verification',
            model: 'GeoSAM-Cadastral-HighRes',
            status: 'APPROVED',
            confidence: 98.7,
            recommendation: 'GPS boundary stones align with satellite polygon. Zero encroachment on forest or canal reserves.',
            evidence: ['Cadastral-to-satellite discrepancy < 0.2%', 'Canal buffer zone intact'],
            executionLogs: ['Boundary coordinates extracted.', 'ISRO Bhuvan Cartosat-3 optical overlay processed.'],
            decision: 'OFFICER_APPROVED',
          },
          {
            id: 'ag-4',
            code: 'FRAUD_OFFICER',
            name: 'Forensic Stamp & Seal Authentication Agent',
            role: 'Rubber Stamp Forensic & Watermark Verification',
            model: 'ForensicVision-SealVerify-v4',
            status: 'APPROVED',
            confidence: 99.6,
            recommendation: 'Treasury seal geometry authentic. No ink manipulation or digital copy-paste detected.',
            evidence: ['Official Tehsildar rubber seal authentic', 'Zero baseline text shifts or pixel tampering'],
            executionLogs: ['Spectral frequency analysis completed.', 'Paper watermark reflectance validated.'],
            decision: 'OFFICER_APPROVED',
          },
          {
            id: 'ag-5',
            code: 'LEGAL_OFFICER',
            name: 'Title Continuity & CERSAI Lien Specialist',
            role: '70-Year Lineage & Encumbrance Check',
            model: 'LegalLineage-Audit-v3',
            status: 'APPROVED',
            confidence: 98.5,
            recommendation: '70-year title unbroken. CERSAI central registry returns clean non-encumbrance status.',
            evidence: ['Zero pending mortgage liens in CERSAI database', 'e-Courts civil litigation check clear'],
            executionLogs: ['CERSAI database queried.', 'District Court civil suit index verified.'],
            decision: 'OFFICER_APPROVED',
          }
        ],
        gis: {
          parcelUid,
          statedAreaHa: landAreaHa,
          cadastralAreaHa: landAreaHa,
          satelliteAreaHa: Number((landAreaHa * 0.998).toFixed(3)),
          areaDiscrepancyPercent: 0.2,
          encroachmentDetected: false,
          landUseStated: 'Agricultural Farmland (Jirayat / Bagayat)',
          landUseDetected: 'Active Crop Cultivation (Drip-irrigated farmland)',
          landUseMatch: true,
          statedPolygon: polygon,
          cadastralPolygon: polygon,
          satelliteObservedPolygon: polygon,
          certificateId: `NIC-GIS-MAHA-${Date.now().toString().slice(-6)}`,
          verifiedAt: new Date().toISOString(),
        },
        fraud: {
          score: 2,
          riskCategory: 'CLEAN',
          checks: {
            editedPdf: false,
            metadataMismatch: false,
            duplicateUpload: false,
            sealMismatch: false,
            signatureSimilarity: 98.9,
            imageManipulation: false,
            ocrOverwrite: false,
          },
          suspiciousRegions: [],
          forensicSummary: 'Official Government Treasury stamp and Tehsildar seal authentic. Clean document.',
          manualReviewStatus: 'CLEARED',
        },
        dispute: {
          riskIndex: 3,
          riskCategory: 'LOW',
          reasons: ['Zero litigations in e-Courts database', 'Continuous lawful succession confirmed since 1954'],
          evidenceItems: ['7/12 RoR verified by Tehsildar', 'Aadhaar e-KYC linked'],
          suggestedActions: ['Sanction mutation Form 24', 'Issue digitally signed e-RoR'],
          pendingCourtCases: [],
          collectorAlerted: false,
        },
        trust: {
          parcelUid,
          overallScore: 98.8,
          badge: 'VERIFIED_GOLD',
          aiVerificationScore: 99.2,
          officerVerificationBadge: {
            officerName: 'Shri Suresh Patil',
            designation: 'Sub-Divisional Magistrate / Tehsildar (Haveli)',
            officerId: 'MH-TEH-HAV-491',
            signatureHash: `e-Sign-CCA-GOI-NIC-HAV-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
          },
          districtSeal: 'Collectorate Pune (Government of Maharashtra)',
          fraudClearance: true,
          qrVerificationUrl: `https://bhulekh.gov.in/verify/${parcelUid}`,
          digitalSignatureHash: `SHA-256-NIC-MAHA-${Date.now()}`,
          lastVerifiedDate: 'Today',
        },
      };

      // Unshift to the very top of parcels
      this.parcels.unshift(targetParcel);
    }

    // Create / unshift Document Record
    const newDocId = `doc-${Date.now()}`;
    const newDoc: DocumentRecord = {
      id: newDocId,
      parcelId: targetParcel.id,
      recordType: (input.recordType as any) || '7/12_ROR',
      fileName: input.fileName || `OFFICER_SCAN_${village.toUpperCase()}_GAT_${cleanSurvey}.pdf`,
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
      fileSizeBytes: 1542000,
      mimeType: 'application/pdf',
      sha256Hash: `a7f9b841${Date.now()}8e20f18392ad0184b29c`,
      ocrConfidence: input.confidence || 99.2,
      uploadedAt: new Date().toISOString(),
      uploadedByName: 'Logged-in Revenue Officer / Tehsildar',
      uploadedByOfficerId: 'u-officer-current',
      district,
      taluka,
      village,
      documentYear: docYear,
      extractedFields: [
        {
          id: `f-${Date.now()}-1`,
          fieldName: 'ownerName',
          label: 'Landowner Name (खातेदाराचे नाव)',
          extractedValue: ownerName,
          verifiedValue: ownerName,
          confidence: 99.4,
          boundingBox: { x: 18, y: 22, width: 34, height: 4.8 },
          rawOcrText: ownerName,
          aiExplanation: 'Auto-extracted and verified against Devanagari standard RoR header.',
          isHandwritten: false,
          status: 'APPROVED',
        },
        {
          id: `f-${Date.now()}-2`,
          fieldName: 'surveyNumber',
          label: 'Survey / Gat Number (सर्व्हे / गट क्रमांक)',
          extractedValue: surveyNumber,
          verifiedValue: surveyNumber,
          confidence: 99.6,
          boundingBox: { x: 12, y: 14, width: 14, height: 4.5 },
          rawOcrText: surveyNumber,
          aiExplanation: 'Matched with cadastral revenue map grid.',
          isHandwritten: false,
          status: 'APPROVED',
        },
        {
          id: `f-${Date.now()}-3`,
          fieldName: 'landArea',
          label: 'Area (क्षेत्रफळ)',
          extractedValue: `${landAreaHa} Hectares (${Math.round(landAreaHa * 40)} Gunthas)`,
          verifiedValue: `${landAreaHa} Hectares`,
          confidence: 98.9,
          boundingBox: { x: 72, y: 22, width: 20, height: 5.0 },
          rawOcrText: `${landAreaHa} हेक्टर`,
          aiExplanation: 'Verified standard Hectare-Are notation.',
          isHandwritten: false,
          status: 'APPROVED',
        },
        {
          id: `f-${Date.now()}-4`,
          fieldName: 'khataNumber',
          label: 'Khata Number (खाते क्रमांक)',
          extractedValue: khataNumber,
          verifiedValue: khataNumber,
          confidence: 98.7,
          boundingBox: { x: 48, y: 14, width: 12, height: 4.2 },
          rawOcrText: khataNumber,
          aiExplanation: 'Extracted from revenue ledger linkage.',
          isHandwritten: false,
          status: 'APPROVED',
        },
        {
          id: `f-${Date.now()}-5`,
          fieldName: 'mutationNumber',
          label: 'Latest Mutation (फेरफार क्रमांक)',
          extractedValue: mutationNumber,
          verifiedValue: mutationNumber,
          confidence: 99.1,
          boundingBox: { x: 18, y: 64, width: 26, height: 4.5 },
          rawOcrText: mutationNumber,
          aiExplanation: 'Extracted from Ferfar note section.',
          isHandwritten: false,
          status: 'APPROVED',
        },
      ],
      version: 1,
    };

    this.documents.unshift(newDoc);

    // Sync into citizen database so citizen portal immediately reflects this
    citizenDb.syncVerifiedParcel({
      parcelUid: targetParcel.parcelUid,
      surveyNumber: targetParcel.surveyNumber,
      ownerName: targetParcel.ownerName,
      village: targetParcel.village,
      taluka: targetParcel.taluka,
      district: targetParcel.district,
      areaHectares: targetParcel.landAreaHa,
      landType: targetParcel.landType,
      trustScore: 98,
      status: 'VERIFIED',
      mutationNumber: targetParcel.mutationNumber,
      documentYear: docYear,
    });

    return { parcel: targetParcel, document: newDoc, isNew };
  }
}

export const landDb = new LandRecordsDatabase();
