import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  FileText,
  Eye,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Shield,
  MapPin,
  Compass,
  X,
  Building,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface LandTimelineViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onNavigateToGis?: () => void;
}

export type TimelineFilterCategory =
  | 'ALL'
  | 'OWNERSHIP_CHANGE'
  | 'MUTATION'
  | 'SUBDIVISION'
  | 'GOV_ACQUISITION'
  | 'COURT_DISPUTE'
  | 'SATELLITE_SNAPSHOT'
  | 'VERIFICATION'
  | 'INSPECTION'
  | 'FRAUD_ALERT';

export interface HistoricalYearSnapshot {
  year: number;
  date: string;
  owner: string;
  coSharers: string[];
  areaHa: number;
  landClassification: string;
  taxAssessmentInr: number;
  documentRef: string;
  documentType: string;
  governingLaw: string;
  status: 'CLEAR' | 'UNDER_SURVEY' | 'SUBDIVIDED' | 'DISPUTED';
  boundaryCoordinates: { lat: number; lng: number }[];
  summary: string;
}

export const LandTimelineView: React.FC<LandTimelineViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onNavigateToGis,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Primary Timeline Slider Year (1950 to 2026)
  const [activeYear, setActiveYear] = useState<number>(2024);
  const [filterType, setFilterType] = useState<TimelineFilterCategory>('ALL');

  // Side-by-Side Comparison Mode
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareYearLeft, setCompareYearLeft] = useState<number>(1978);
  const [compareYearRight, setCompareYearRight] = useState<number>(2024);

  // Document Preview Modal State
  const [previewDocYear, setPreviewDocYear] = useState<number | null>(null);

  // Printable Report Modal State
  const [isPrintReportOpen, setIsPrintReportOpen] = useState<boolean>(false);

  // Available epochs from 1950 to Present
  const timelineEpochs = [1950, 1968, 1978, 1984, 1999, 2012, 2016, 2024, 2026];

  // Historical Records Data for Time Travel Engine
  const historicalSnapshots: Record<number, HistoricalYearSnapshot> = {
    1950: {
      year: 1950,
      date: '1950-01-26',
      owner: currentParcel.id === 'p-005' ? 'Gopal Singh Rajput' : 'Dhondiba Ramji Patil',
      coSharers: ['Sole Titleholder (Ancestral Zamindari Abolition Allotment)'],
      areaHa: currentParcel.id === 'p-005' ? 3.70 : 4.90,
      landClassification: 'Dry Agricultural (Jirayat / बागायत)',
      taxAssessmentInr: 120,
      documentRef: 'BOMBAY-CADASTRE-BOOK-1950-VOL-4',
      documentType: 'Handwritten Modi / Devanagari Cadastral Settlement Sheet',
      governingLaw: 'Bombay Land Revenue Code, 1879',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9950 },
        { lat: 18.5960, lng: 73.9950 },
        { lat: 18.5960, lng: 74.0010 },
        { lat: 18.5900, lng: 74.0010 },
      ],
      summary: 'Initial post-independence cadastral baseline. Ancestral title affirmed under Bombay Land Revenue Code with traditional chain survey.',
    },
    1968: {
      year: 1968,
      date: '1968-05-11',
      owner: currentParcel.id === 'p-005' ? 'Gopal Singh Rajput' : 'Dhondiba Ramji Patil',
      coSharers: ['Sole Titleholder'],
      areaHa: currentParcel.id === 'p-005' ? 3.70 : 4.90,
      landClassification: 'Consolidated Agricultural (Chakbandi)',
      taxAssessmentInr: 190,
      documentRef: 'DIST-CHAKBANDI-ORDER-1968-NO-88',
      documentType: 'Consolidation of Holdings Certificate',
      governingLaw: 'Bombay Prevention of Fragmentation and Consolidation of Holdings Act 1947',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9950 },
        { lat: 18.5960, lng: 73.9950 },
        { lat: 18.5960, lng: 74.0010 },
        { lat: 18.5900, lng: 74.0010 },
      ],
      summary: 'Agricultural consolidation (Chakbandi) carried out to amalgamate scattered fragments into compact surveyed revenue plot.',
    },
    1978: {
      year: 1978,
      date: '1978-08-20',
      owner: currentParcel.id === 'p-005' ? 'Gopal Singh Rajput' : 'Kisan Mahadev Patil',
      coSharers: ['Family devolution registered'],
      areaHa: currentParcel.id === 'p-005' ? 3.70 : 4.90,
      landClassification: 'Agricultural Bagayat (Well Irrigated)',
      taxAssessmentInr: 340,
      documentRef: 'FERFAR-REGISTER-ENTRY-1978-NO-114',
      documentType: 'Succession Mutation Sanction (वारस नोंद)',
      governingLaw: 'Maharashtra Land Revenue Code 1966 Section 149',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9950 },
        { lat: 18.5960, lng: 73.9950 },
        { lat: 18.5960, lng: 74.0010 },
        { lat: 18.5900, lng: 74.0010 },
      ],
      summary: 'Succession mutation sanctioned upon demise of original patentee. Title devolved peacefully without legal dispute.',
    },
    1984: {
      year: 1984,
      date: '1984-11-02',
      owner: currentParcel.id === 'p-005' ? 'Ram Singh Rajput' : 'Kisan Mahadev Patil',
      coSharers: ['Ram Singh Rajput (100%)'],
      areaHa: currentParcel.id === 'p-005' ? 3.70 : 4.90,
      landClassification: 'Perennial Cropland (Sugarcane)',
      taxAssessmentInr: 450,
      documentRef: 'FERFAR-RECORD-1984-NO-182',
      documentType: 'Succession Mutation Order (नावे नोंदणी)',
      governingLaw: 'Maharashtra Land Revenue Code 1966 Section 150',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9950 },
        { lat: 18.5960, lng: 73.9950 },
        { lat: 18.5960, lng: 74.0010 },
        { lat: 18.5900, lng: 74.0010 },
      ],
      summary: 'Statutory succession mutation registered by Haveli Tahsil office following verification of legal heir certificate.',
    },
    1999: {
      year: 1999,
      date: '1999-07-19',
      owner: currentParcel.id === 'p-005' ? 'Ram Singh Rajput' : 'Rameshwar & Suresh Patil',
      coSharers: currentParcel.id === 'p-005' ? ['Ram Singh Rajput (70%)', 'Devendra Rajput (30%)'] : ['Rameshwar (50%)', 'Suresh (50%)'],
      areaHa: currentParcel.id === 'p-005' ? 1.85 : 2.45,
      landClassification: 'Agricultural (Subdivided Plot)',
      taxAssessmentInr: 620,
      documentRef: 'TAHSILDAR-SANCTION-1999-HISSA-482',
      documentType: 'Subdivision Sanction (हिश्या फोडणी नकाशा)',
      governingLaw: 'Bombay Prevention of Fragmentation Act 1947 & MLRC 1966 Sec 85',
      status: 'SUBDIVIDED',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9995 },
        { lat: 18.5900, lng: 73.9995 },
      ],
      summary: 'Amicable family partition and cadastral bifurcation into sub-division parts. Survey map demarcated with boundary stones.',
    },
    2012: {
      year: 2012,
      date: '2012-04-10',
      owner: currentParcel.ownerName,
      coSharers: currentParcel.coSharers.map((c) => `${c.name} (${c.share})`),
      areaHa: currentParcel.landAreaHa,
      landClassification: 'Agricultural (Jirayat / Bagayat)',
      taxAssessmentInr: 710,
      documentRef: 'REV-INSPECTION-2012-PUN-091',
      documentType: 'Circle Inspector Spot Verification & Soil Health Audit',
      governingLaw: 'Maharashtra Land Revenue (Inspection) Rules',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9995 },
        { lat: 18.5900, lng: 73.9995 },
      ],
      summary: 'Field physical verification verifying perennial well irrigation, sugarcane crop cultivation, and clear non-encroached borders.',
    },
    2016: {
      year: 2016,
      date: '2016-09-14',
      owner: currentParcel.ownerName,
      coSharers: currentParcel.coSharers.map((c) => `${c.name} (${c.share})`),
      areaHa: currentParcel.landAreaHa,
      landClassification: currentParcel.landType,
      taxAssessmentInr: 780,
      documentRef: 'ISRO-CARTOSAT-ORTHO-2016-MH-00214',
      documentType: 'ISRO Cartosat-2 Satellite Cadastral Georeference',
      governingLaw: 'Digital India Land Records Modernization Programme (DILRMP)',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9995 },
        { lat: 18.5900, lng: 73.9995 },
      ],
      summary: 'Satellite boundary georeferencing by Survey of India and ISRO. 5cm GPS ground control points established.',
    },
    2024: {
      year: 2024,
      date: '2024-08-15',
      owner: currentParcel.ownerName,
      coSharers: currentParcel.coSharers.map((c) => `${c.name} (${c.share})`),
      areaHa: currentParcel.landAreaHa,
      landClassification: currentParcel.landType,
      taxAssessmentInr: 850,
      documentRef: 'E-MAHABHULEKH-DIGITAL-ROR-2024',
      documentType: 'Digitally Signed 7/12 RoR & Citizen Trust Certificate',
      governingLaw: 'Information Technology Act 2000 & MLRC 1966',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9995 },
        { lat: 18.5900, lng: 73.9995 },
      ],
      summary: 'Modern digital RoR issued with CCA Class-3 digital signature certificate, encrypted verification QR code, and AI trust seal.',
    },
    2026: {
      year: 2026,
      date: '2026-03-24',
      owner: currentParcel.ownerName,
      coSharers: currentParcel.coSharers.map((c) => `${c.name} (${c.share})`),
      areaHa: currentParcel.landAreaHa,
      landClassification: currentParcel.landType,
      taxAssessmentInr: 850,
      documentRef: 'BHOOMISETU-IMMUTABLE-DNA',
      documentType: 'BhoomiSetu Real-Time Multi-Agent Cadastral Dossier',
      governingLaw: 'National Land Governance AI Framework (DILRMP 2.0)',
      status: 'CLEAR',
      boundaryCoordinates: [
        { lat: 18.5900, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9965 },
        { lat: 18.5930, lng: 73.9995 },
        { lat: 18.5900, lng: 73.9995 },
      ],
      summary: 'Current active operational record synchronized with continuous ISRO satellite radar feed and e-Courts automated dispute scanning.',
    },
  };

  // Find snapshot for active year or fallback
  const activeSnapshot = historicalSnapshots[activeYear] || historicalSnapshots[2024];
  const leftSnapshot = historicalSnapshots[compareYearLeft] || historicalSnapshots[1978];
  const rightSnapshot = historicalSnapshots[compareYearRight] || historicalSnapshots[2024];

  // Filter events
  const allEvents = currentParcel.timeline || [];
  const filteredEvents = allEvents.filter((ev) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'MUTATION') return ev.type.includes('MUTATION');
    if (filterType === 'SUBDIVISION') return ev.type === 'SUBDIVISION' || ev.type === 'MUTATION_PARTITION';
    if (filterType === 'SATELLITE_SNAPSHOT') return ev.type.includes('SATELLITE') || ev.type.includes('GIS');
    if (filterType === 'VERIFICATION') return ev.type.includes('VERIFICATION') || ev.type.includes('DIGITAL');
    if (filterType === 'INSPECTION') return ev.type.includes('INSPECTION');
    return true;
  });

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header Strip & Navigation Bar */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Time Travel Cadastre Engine
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded uppercase">
                  1950 &mdash; Present Archive
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                AI Timeline: Time Travel for Land (जमिनीचा ऐतिहासिक कालपट)
              </h1>
              <p className="text-xs text-[#5A6878]">
                Every land parcel maintains an unbroken chronological genealogy from 1950 to present with legal mutations, area subdivisions, and satellite boundaries.
              </p>
            </div>

            {/* Parcel Selection and Action Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-600">Active Parcel:</label>
                <select
                  value={selectedParcelId}
                  onChange={(e) => onSelectParcel(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-xs text-[#123A78]"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.surveyNumber} ({p.village}) &mdash; {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Side-by-Side Comparison Mode Toggle */}
              <button
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`px-3.5 py-2 rounded-lg border font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-all ${
                  isCompareMode
                    ? 'bg-[#123A78] text-white border-[#123A78]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isCompareMode ? 'Exit Comparison Mode' : 'Side-by-Side Compare'}</span>
              </button>

              {/* Printable Historical Ownership Report */}
              <button
                onClick={() => setIsPrintReportOpen(true)}
                className="px-3.5 py-2 bg-[#0B7A3B] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Historical Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter by Event Type Toolbar */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#123A78]" />
            <span>Filter Historical Events (घटना प्रकारानुसार क्रमवारी):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { id: 'ALL' as const, label: 'All Events (सर्व नोंदी)' },
              { id: 'OWNERSHIP_CHANGE' as const, label: 'Ownership Change (मालकी हक्क बदल)' },
              { id: 'MUTATION' as const, label: 'Mutation Approval (फेरफार मंजुरी)' },
              { id: 'SUBDIVISION' as const, label: 'Subdivision (हिश्या फोडणी)' },
              { id: 'GOV_ACQUISITION' as const, label: 'Govt Acquisition (शासकीय भूसंपादन)' },
              { id: 'COURT_DISPUTE' as const, label: 'Court Dispute (न्यायालयीन दावा)' },
              { id: 'SATELLITE_SNAPSHOT' as const, label: 'Satellite Snapshot (उपग्रह नकाशा)' },
              { id: 'VERIFICATION' as const, label: 'Verification (सत्यापन)' },
              { id: 'INSPECTION' as const, label: 'Spot Inspection (स्थळ पाहणी)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  filterType === btn.id
                    ? 'bg-[#123A78] text-white shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* SIDE-BY-SIDE COMPARISON MODE (Compare any two years e.g. 1978 vs 2024) */}
        {isCompareMode ? (
          <div className="bg-white border-2 border-[#123A78] rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#123A78] font-bold text-[10px] rounded uppercase">
                  Comparative Cadastral Intelligence
                </span>
                <h2 className="text-lg font-bold text-[#1C2733] mt-1">
                  Historical Side-by-Side Analysis: {compareYearLeft} vs {compareYearRight}
                </h2>
              </div>

              {/* Year Selector Pickers */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-bold">Epoch 1:</span>
                  <select
                    value={compareYearLeft}
                    onChange={(e) => setCompareYearLeft(Number(e.target.value))}
                    className="p-1.5 bg-gray-100 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
                  >
                    {timelineEpochs.map((yr) => (
                      <option key={yr} value={yr}>
                        Year {yr}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-400 font-bold">&mdash; vs &mdash;</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-bold">Epoch 2:</span>
                  <select
                    value={compareYearRight}
                    onChange={(e) => setCompareYearRight(Number(e.target.value))}
                    className="p-1.5 bg-gray-100 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
                  >
                    {timelineEpochs.map((yr) => (
                      <option key={yr} value={yr}>
                        Year {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Comparative Grid: Owner, Area, Classification, Tax, Boundary Diff, Document */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Year Snapshot Card */}
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xl font-extrabold text-[#123A78] font-mono">
                    Year {compareYearLeft}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded">
                    {leftSnapshot.date}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                    <span className="text-[11px] text-gray-500 uppercase block font-semibold">Registered Titleholder:</span>
                    <span className="font-bold text-[#1C2733] text-sm">{leftSnapshot.owner}</span>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      Co-Sharers: {leftSnapshot.coSharers.join(', ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Holding Area:</span>
                      <span className="font-mono font-bold text-sm text-[#123A78]">
                        {leftSnapshot.areaHa} Hectares
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Tax Assessment (Lagaan):</span>
                      <span className="font-mono font-bold text-sm text-emerald-800">
                        ₹{leftSnapshot.taxAssessmentInr} / year
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Land Classification:</span>
                    <span className="font-medium text-gray-800">{leftSnapshot.landClassification}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-gray-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Statutory Reference &amp; Law:</span>
                    <span className="font-mono text-[11px] text-[#123A78] block">{leftSnapshot.documentRef}</span>
                    <span className="text-[10px] text-gray-600">{leftSnapshot.governingLaw}</span>
                  </div>
                </div>

                {/* Left Mini Cadastral Canvas */}
                <div className="h-32 bg-slate-900 rounded-lg p-2 relative overflow-hidden flex items-center justify-center border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 160 100">
                    <polygon
                      points={compareYearLeft <= 1984 ? '20,15 140,15 135,85 25,85' : '45,25 115,25 110,75 50,75'}
                      fill="#3b82f6"
                      fillOpacity="0.3"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    />
                    <text x="50" y="55" fill="#ffffff" fontSize="9" fontWeight="bold">
                      {leftSnapshot.areaHa} Ha
                    </text>
                  </svg>
                  <span className="absolute bottom-1 right-2 text-[10px] text-gray-400 font-mono">
                    Cadastre {compareYearLeft}
                  </span>
                </div>
              </div>

              {/* Right Year Snapshot Card */}
              <div className="bg-emerald-50/40 border border-emerald-300 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="text-xl font-extrabold text-[#0B7A3B] font-mono">
                    Year {compareYearRight}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                    {rightSnapshot.date}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[11px] text-gray-500 uppercase block font-semibold">Registered Titleholder:</span>
                    <span className="font-bold text-[#1C2733] text-sm">{rightSnapshot.owner}</span>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      Co-Sharers: {rightSnapshot.coSharers.join(', ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Holding Area:</span>
                      <span className="font-mono font-bold text-sm text-[#0B7A3B]">
                        {rightSnapshot.areaHa} Hectares
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Tax Assessment (Lagaan):</span>
                      <span className="font-mono font-bold text-sm text-emerald-800">
                        ₹{rightSnapshot.taxAssessmentInr} / year
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Land Classification:</span>
                    <span className="font-medium text-gray-800">{rightSnapshot.landClassification}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Statutory Reference &amp; Law:</span>
                    <span className="font-mono text-[11px] text-[#0B7A3B] block">{rightSnapshot.documentRef}</span>
                    <span className="text-[10px] text-gray-600">{rightSnapshot.governingLaw}</span>
                  </div>
                </div>

                {/* Right Mini Cadastral Canvas */}
                <div className="h-32 bg-slate-900 rounded-lg p-2 relative overflow-hidden flex items-center justify-center border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 160 100">
                    {/* Ghost outline of epoch 1 for comparison */}
                    <polygon
                      points={compareYearLeft <= 1984 ? '20,15 140,15 135,85 25,85' : '45,25 115,25 110,75 50,75'}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    {/* Active polygon of epoch 2 */}
                    <polygon
                      points={compareYearRight <= 1984 ? '20,15 140,15 135,85 25,85' : '45,25 115,25 110,75 50,75'}
                      fill="#10b981"
                      fillOpacity="0.45"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <text x="50" y="55" fill="#ffffff" fontSize="9" fontWeight="bold">
                      {rightSnapshot.areaHa} Ha
                    </text>
                  </svg>
                  <span className="absolute bottom-1 right-2 text-[10px] text-emerald-400 font-mono">
                    Cadastre {compareYearRight} (Ghost Overlay)
                  </span>
                </div>
              </div>
            </div>

            {/* Difference & Mutation Analysis Banner */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs uppercase text-[#123A78] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#123A78]" />
                <span>AI Automated Variance Synthesis:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Area Difference:</span>
                  <span className="font-bold text-[#1C2733]">
                    {Math.abs(leftSnapshot.areaHa - rightSnapshot.areaHa).toFixed(2)} Ha{' '}
                    {leftSnapshot.areaHa > rightSnapshot.areaHa ? '(Bifurcated / Subdivided)' : '(Consolidated)'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Tax Assessment Growth:</span>
                  <span className="font-bold text-emerald-700">
                    +₹{rightSnapshot.taxAssessmentInr - leftSnapshot.taxAssessmentInr} (
                    {(
                      ((rightSnapshot.taxAssessmentInr - leftSnapshot.taxAssessmentInr) /
                        leftSnapshot.taxAssessmentInr) *
                      100
                    ).toFixed(0)}
                    % revision)
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Succession Legality:</span>
                  <span className="font-bold text-[#0B7A3B]">Clean Lineage Devolved Unbroken</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PRIMARY TIME TRAVEL INTERACTIVE SLIDER (1950 to 2026) */
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                  Continuous Epoch Navigation
                </span>
                <h2 className="text-lg font-bold text-[#1C2733] mt-1">
                  Cadastral Snapshot for Year {activeYear}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentIndex = timelineEpochs.indexOf(activeYear);
                    if (currentIndex > 0) setActiveYear(timelineEpochs[currentIndex - 1]);
                  }}
                  disabled={activeYear === timelineEpochs[0]}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold rounded-lg flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Year</span>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = timelineEpochs.indexOf(activeYear);
                    if (currentIndex < timelineEpochs.length - 1) setActiveYear(timelineEpochs[currentIndex + 1]);
                  }}
                  disabled={activeYear === timelineEpochs[timelineEpochs.length - 1]}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold rounded-lg flex items-center gap-1"
                >
                  <span>Next Year</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Timeline Slider Component */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-500 px-1">
                <span>1950 (Settlement)</span>
                <span>1978 (Succession)</span>
                <span>1999 (Partition)</span>
                <span>2016 (Cartosat)</span>
                <span className="text-[#123A78]">2024 (Digital RoR)</span>
                <span className="text-emerald-700">2026 (Live AI)</span>
              </div>

              {/* Slider Input */}
              <div className="relative py-2">
                <input
                  type="range"
                  min="1950"
                  max="2026"
                  step="1"
                  value={activeYear}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    // Snap to nearest epoch
                    const closest = timelineEpochs.reduce((prev, curr) =>
                      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                    );
                    setActiveYear(closest);
                  }}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#123A78]"
                />

                {/* Clickable Epoch Pins */}
                <div className="flex justify-between items-center mt-3">
                  {timelineEpochs.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setActiveYear(yr)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        activeYear === yr
                          ? 'bg-[#123A78] text-white ring-4 ring-blue-100 scale-110'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Year Cadastral Detail Card & Animated Boundary Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Details (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-300 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div>
                      <span className="text-xs text-gray-500 font-mono">Epoch Date: {activeSnapshot.date}</span>
                      <h3 className="text-base font-bold text-[#1C2733]">
                        {activeSnapshot.documentType}
                      </h3>
                    </div>

                    <button
                      onClick={() => setPreviewDocYear(activeYear)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#123A78] border border-blue-200 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Official Document</span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    {activeSnapshot.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Registered Titleholder:</span>
                      <span className="font-bold text-[#1C2733] truncate block">{activeSnapshot.owner}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Total Holding Area:</span>
                      <span className="font-mono font-bold text-[#123A78] block">{activeSnapshot.areaHa} Ha</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Land Classification:</span>
                      <span className="font-bold text-gray-800 truncate block">{activeSnapshot.landClassification}</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block font-semibold">Annual Assessment:</span>
                      <span className="font-mono font-bold text-emerald-800 block">₹{activeSnapshot.taxAssessmentInr}</span>
                    </div>
                  </div>

                  {/* Co-Sharers & Statutory Law */}
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-gray-800">
                      <strong>Governing Statutory Law:</strong> {activeSnapshot.governingLaw}
                    </div>
                    <span className="font-mono text-gray-600 text-[11px]">
                      Ref: {activeSnapshot.documentRef}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Animated Parcel Boundary Updates (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 rounded-xl p-4 text-white space-y-3 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Boundary Geometry in {activeYear}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{activeSnapshot.areaHa} Ha</span>
                </div>

                {/* Animated Cadastral Boundary Display */}
                <div className="h-44 bg-slate-950 rounded-lg p-3 relative overflow-hidden flex items-center justify-center border border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>

                  <svg className="w-full h-full" viewBox="0 0 160 110">
                    {/* Ghost original 1950 ancestral plot for continuity */}
                    {activeYear > 1984 && (
                      <polygon
                        points="15,10 145,10 140,95 20,95"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="1"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* Active Epoch Boundary Polygon */}
                    <polygon
                      points={
                        activeYear <= 1984
                          ? '15,10 145,10 140,95 20,95'
                          : '45,25 125,25 120,85 50,85'
                      }
                      fill={activeYear <= 1984 ? '#3b82f6' : '#10b981'}
                      fillOpacity="0.4"
                      stroke={activeYear <= 1984 ? '#60a5fa' : '#34d399'}
                      strokeWidth="2.5"
                      className="transition-all duration-500 ease-in-out"
                    />

                    <text x="50" y="58" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      {activeSnapshot.areaHa} Ha
                    </text>
                  </svg>

                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-gray-300 font-mono border border-slate-700">
                    {activeYear <= 1984 ? 'Parent Holding (Survey 214)' : 'Subdivided Holding (214/3)'}
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 leading-snug">
                  * Notice the geometric transition in 1999: parent plot (3.70 Ha) was officially bifurcated into Survey 214/1, 214/2, and 214/3 (1.85 Ha).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chronological Event Timeline Grid (Filtered) */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#123A78]" />
              <h3 className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                Unbroken Statutory Mutation Chronology ({filteredEvents.length} Verified Entries)
              </h3>
            </div>
            <span className="text-[11px] text-gray-500">Click any milestone to inspect historical record</span>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  setActiveYear(evt.year);
                  setPreviewDocYear(evt.year);
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  activeYear === evt.year
                    ? 'bg-blue-50/60 border-[#123A78] ring-1 ring-[#123A78]'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#123A78] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {evt.year}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-blue-100 text-[#123A78] font-bold text-[10px] rounded uppercase">
                        {evt.type.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-gray-500 text-[11px]">{evt.date}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#1C2733]">{evt.title}</h4>
                    <p className="text-xs text-gray-600 leading-snug">{evt.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Titleholder:</span>
                    <span className="font-bold text-gray-800">{evt.ownerName}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-gray-500 block">Area:</span>
                    <span className="font-bold text-[#123A78]">{evt.areaHectares} Ha</span>
                  </div>
                  <button className="px-2.5 py-1 bg-white border border-gray-300 hover:border-[#123A78] text-[#123A78] font-bold rounded text-[11px] shadow-2xs">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENT PREVIEW MODAL */}
        {previewDocYear && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-gray-300 space-y-4 text-left animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#123A78]" />
                  <h3 className="font-bold text-base text-[#1C2733]">
                    Official Archival Record Preview: Year {previewDocYear}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewDocYear(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#FAF7F0] border border-amber-300 rounded-lg p-5 space-y-3 font-serif">
                <div className="text-center border-b border-amber-300/60 pb-2">
                  <div className="text-[11px] uppercase tracking-widest text-amber-900 font-bold">
                    GOVERNMENT OF MAHARASHTRA &bull; REVENUE &amp; FOREST DEPARTMENT
                  </div>
                  <div className="text-base font-bold text-gray-900 mt-1">
                    {historicalSnapshots[previewDocYear]?.documentType || 'Official Revenue Record'}
                  </div>
                  <div className="text-xs text-gray-600 font-mono mt-0.5">
                    Ref: {historicalSnapshots[previewDocYear]?.documentRef}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-gray-500 block">Village &amp; Taluka:</span>
                    <span className="font-bold text-gray-900">{currentParcel.village}, {currentParcel.taluka}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Survey &amp; Khata:</span>
                    <span className="font-bold text-gray-900">{currentParcel.surveyNumber} &bull; Khata {currentParcel.khataNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Registered Titleholder:</span>
                    <span className="font-bold text-gray-900">{historicalSnapshots[previewDocYear]?.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Allotted Area:</span>
                    <span className="font-bold text-gray-900">{historicalSnapshots[previewDocYear]?.areaHa} Hectares</span>
                  </div>
                </div>

                <div className="p-3 bg-white/60 border border-amber-200 rounded text-xs leading-relaxed text-gray-800">
                  {historicalSnapshots[previewDocYear]?.summary}
                </div>

                <div className="pt-3 border-t border-amber-300/60 flex items-center justify-between text-[11px] text-gray-600">
                  <span>Governing Law: {historicalSnapshots[previewDocYear]?.governingLaw}</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NIC Archives Digitally Certified</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewDocYear(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE HISTORICAL OWNERSHIP REPORT MODAL */}
        {isPrintReportOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-2xs overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl border border-gray-300 space-y-6 text-left my-8">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b-2 border-[#123A78] pb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#123A78] font-bold">
                    OFFICE OF THE SUB-DIVISIONAL MAGISTRATE &amp; REVENUE TAHSILE
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">
                    Historical Ownership, Succession &amp; Mutation Report (1950 &mdash; 2026)
                  </h2>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Cadastral UID: {currentParcel.parcelUid} &bull; Survey: {currentParcel.surveyNumber} &bull; Village: {currentParcel.village}
                  </div>
                </div>
                <button
                  onClick={() => setIsPrintReportOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Genealogy & Succession Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#123A78]">
                  Chronological Titleholder Succession Ledger:
                </h4>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 font-bold text-gray-700">
                      <tr>
                        <th className="p-2.5">Year</th>
                        <th className="p-2.5">Titleholder</th>
                        <th className="p-2.5">Holding Area</th>
                        <th className="p-2.5">Mutation Ref</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {timelineEpochs.map((yr) => {
                        const snap = historicalSnapshots[yr];
                        return (
                          <tr key={yr} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold font-mono text-[#123A78]">{yr}</td>
                            <td className="p-2.5 font-bold text-gray-900">{snap?.owner}</td>
                            <td className="p-2.5 font-mono">{snap?.areaHa} Ha</td>
                            <td className="p-2.5 font-mono text-[11px] text-gray-600">{snap?.documentRef}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                                {snap?.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Tehsildar Authentication Seal */}
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-gray-900">Authenticated &amp; Digitally Certified:</div>
                  <div className="text-gray-700">Shri Mahesh Gopal Kulkarni, Sub-Divisional Magistrate (Haveli)</div>
                  <div className="font-mono text-gray-500 text-[10px]">
                    SHA-256 Digest: cca-class3-report-digest-9821a7c4 &bull; Issued under Section 148 MLRC 1966
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>Send to Printer (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
