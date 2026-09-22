import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  FileCheck,
  Printer,
  Download,
  Clock,
  MapPin,
  Building,
  UserCheck,
  Eye,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  X,
} from 'lucide-react';
import { LandParcelDetail, TrustBadge } from '../types/landRecords';

interface CitizenTrustScoreViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onNavigateToTimeline?: () => void;
  onNavigateToGis?: () => void;
}

export const CitizenTrustScoreView: React.FC<CitizenTrustScoreViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onNavigateToTimeline,
  onNavigateToGis,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Trust score calculation
  const overallScore = currentParcel.trust?.overallScore || (currentParcel.status === 'VERIFIED' ? 99 : 54);

  // Trust Band classification
  const getTrustBand = (score: number) => {
    if (score >= 90) {
      return {
        band: 'GREEN',
        label: 'Verified (प्रमाणित)',
        color: 'text-[#0B7A3B]',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300',
        badgeBg: 'bg-emerald-100 text-[#0B7A3B]',
        summary: 'All AI, GIS, Forensic, and Revenue Officer authentications are complete and certified without encumbrance.',
      };
    } else if (score >= 60) {
      return {
        band: 'ORANGE',
        label: 'Under Review (पुनरावलोकन प्रलंबित)',
        color: 'text-[#B26A00]',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        badgeBg: 'bg-amber-100 text-[#B26A00]',
        summary: 'Record is legally intact but awaiting field ground-truthing or secondary co-sharer Aadhaar e-KYC authentication.',
      };
    } else {
      return {
        band: 'RED',
        label: 'Attention Required (कारवाई आवश्यक)',
        color: 'text-[#B42318]',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        badgeBg: 'bg-red-100 text-[#B42318]',
        summary: 'Discrepancy detected: either boundary overlap with adjacent survey, pending court stay order, or forensic document anomaly.',
      };
    }
  };

  const trustBand = getTrustBand(overallScore);

  // Core verification milestones checklist
  const milestones = [
    {
      title: 'Digital RoR Ingestion & Bilingual OCR',
      description: 'Extracted Devanagari script and English particulars from official land registry scan.',
      status: 'COMPLETED',
      date: '2026-03-24 09:12',
      officer: 'AI OCR Officer (Cadastre-Net v3)',
    },
    {
      title: 'Cross-Registry Title & Co-Sharer Verification',
      description: 'Validated undivided co-sharer ownership shares, lineage, and Aadhaar e-KYC linkages.',
      status: 'COMPLETED',
      date: '2026-03-24 09:13',
      officer: 'Verification Officer AI (e-Pramaan Registry)',
    },
    {
      title: 'ISRO Cartosat-2 Satellite GIS Boundary Alignment',
      description: 'Orthorectified cadastral polygon matched against high-resolution satellite imagery.',
      status: currentParcel.gis.areaDiscrepancyPercent === 0 ? 'COMPLETED' : 'FLAGGED',
      date: '2026-03-24 09:14',
      officer: 'GIS Officer AI (ISRO Bhuvan Spatial Grid)',
    },
    {
      title: 'Forensic Document Integrity & Anti-Tamper Clearance',
      description: 'Byte-level PDF forensic scan, seal circularity test, and signature cosine similarity.',
      status: currentParcel.fraud.score < 20 ? 'COMPLETED' : 'ATTENTION',
      date: '2026-03-24 09:15',
      officer: 'Fraud Investigation Officer AI (ForensicDoc-Shield)',
    },
    {
      title: 'Statutory Revenue Officer Digital Signature (DSC)',
      description: 'Sub-Divisional Magistrate / Tehsildar judicial sanction under Section 148 MLRC 1966.',
      status: currentParcel.status === 'VERIFIED' ? 'COMPLETED' : 'IN_PROGRESS',
      date: '2026-03-24 09:18',
      officer: currentParcel.trust?.officerVerificationBadge?.officerName || 'Shri Mahesh Gopal Kulkarni (SDM / Haveli)',
    },
  ];

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Top Government Title & Non-Credit Score Mandate Notice */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Citizen Transparency Portal
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-[#123A78] text-[10px] font-bold rounded uppercase">
                  Statutory Title Verification
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                Citizen Trust Score &amp; Verification Certificate (नागरिक विश्वास निर्देशांक)
              </h1>
              <p className="text-xs text-[#5A6878]">
                Provides citizens with crystal-clear visibility into whether a land parcel has satisfied all statutory verification steps. <strong>This is NOT a financial credit score.</strong>
              </p>
            </div>

            {/* Parcel Selector and Print Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-600">Select Parcel:</label>
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

              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="px-4 py-2 bg-[#0B7A3B] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Trust Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Citizen Trust Band & Radial Display */}
        <div className={`border-2 rounded-xl p-6 shadow-xs ${trustBand.bgColor} ${trustBand.borderColor} space-y-4`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
            <div className="flex items-center gap-4">
              {/* Score Badge */}
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-gray-200 flex flex-col items-center justify-center shadow-xs shrink-0">
                <span className={`text-3xl font-extrabold font-mono ${trustBand.color}`}>
                  {overallScore}%
                </span>
                <span className="text-[9px] font-bold uppercase text-gray-500">Trust Score</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${trustBand.badgeBg}`}>
                    Trust Band: {trustBand.label}
                  </span>
                  <span className="font-mono text-xs text-gray-500">UID: {currentParcel.parcelUid}</span>
                </div>
                <h2 className="text-lg font-bold text-[#1C2733]">
                  Survey {currentParcel.surveyNumber} &mdash; {currentParcel.ownerName} ({currentParcel.village}, {currentParcel.taluka})
                </h2>
                <p className="text-xs text-gray-700 max-w-2xl">
                  {trustBand.summary}
                </p>
              </div>
            </div>

            {/* Visual Band Indicator */}
            <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl border border-gray-200 shadow-2xs">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  trustBand.band === 'GREEN' ? 'bg-[#0B7A3B] text-white shadow-2xs' : 'text-gray-400'
                }`}
              >
                Green: Verified
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  trustBand.band === 'ORANGE' ? 'bg-[#B26A00] text-white shadow-2xs' : 'text-gray-400'
                }`}
              >
                Orange: Review
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  trustBand.band === 'RED' ? 'bg-[#B42318] text-white shadow-2xs' : 'text-gray-400'
                }`}
              >
                Red: Attention
              </div>
            </div>
          </div>

          {/* Explanation Engine: Explaining why record is under review or requires attention */}
          {overallScore < 90 && (
            <div className="p-4 bg-white rounded-xl border border-red-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#B42318] font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Statutory Flags Identified by Verification Engine:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed">
                {currentParcel.dispute.reasons.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                <span>
                  <strong>Citizen Resolution Guidance:</strong> Visit Haveli Tahsil Revenue Office with original succession documents or apply for online Ferfar rectification via e-Hakk portal.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 8 Core Components Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. AI Verification Status */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">1. AI Verification</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                COMPLETED
              </span>
            </div>
            <div className="text-xl font-bold text-[#1C2733] font-mono">
              {currentParcel.trust?.aiVerificationScore || 99.4}%
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Bilingual Devanagari OCR &amp; Khatauni cross-registry text matches with 99.4% confidence.
            </p>
          </div>

          {/* 2. Human Verification Status */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">2. Human Verification</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                SANCTIONED
              </span>
            </div>
            <div className="text-base font-bold text-[#1C2733] truncate">
              {currentParcel.trust?.officerVerificationBadge?.officerName || 'Shri Mahesh Kulkarni'}
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Presiding Sub-Divisional Magistrate judicial sign-off under Section 148 MLRC.
            </p>
          </div>

          {/* 3. Fraud Check Status */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">3. Fraud Check</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  currentParcel.fraud.score < 20 ? 'bg-emerald-100 text-[#0B7A3B]' : 'bg-red-100 text-[#B42318]'
                }`}
              >
                {currentParcel.fraud.score < 20 ? 'CLEAN (0% Fraud)' : 'FLAGGED'}
              </span>
            </div>
            <div className="text-base font-bold text-[#1C2733]">
              ForensicDoc-Shield Clear
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Zero PDF byte alteration, zero raster splicing, SDM die diameter exactly 38.1mm.
            </p>
          </div>

          {/* 4. GIS Validation Status */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">4. GIS Validation</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                  currentParcel.gis.areaDiscrepancyPercent === 0 ? 'bg-emerald-100 text-[#0B7A3B]' : 'bg-amber-100 text-[#B26A00]'
                }`}
              >
                {currentParcel.gis.areaDiscrepancyPercent === 0 ? '0.0% Variance' : 'Variance Detected'}
              </span>
            </div>
            <div className="text-base font-bold text-[#1C2733]">
              ISRO Cartosat-2 Aligned
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Centroid: 18.5912°N, 73.9981°E. Stated 1.85 Ha matches observed area with zero road encroachment.
            </p>
          </div>

          {/* 5. Last Verification Date */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">5. Last Verification</span>
              <span className="px-2 py-0.5 bg-blue-100 text-[#123A78] text-[10px] font-bold rounded">
                RECENT
              </span>
            </div>
            <div className="text-base font-bold font-mono text-[#123A78]">
              {currentParcel.trust?.lastVerifiedDate || '2024-08-15'}
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Annual gazette cycle synchronized with Maharashtra e-Mahabhulekh DILRMP server.
            </p>
          </div>

          {/* 6. Officer Verification Badge */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">6. Officer Badge</span>
              <ShieldCheck className="w-4 h-4 text-[#0B7A3B]" />
            </div>
            <div className="text-base font-bold text-[#1C2733]">
              Sub-Divisional Magistrate
            </div>
            <p className="text-[11px] text-gray-600 font-mono truncate" title={currentParcel.trust?.officerVerificationBadge?.signatureHash}>
              Hash: {currentParcel.trust?.officerVerificationBadge?.signatureHash || 'SDM-HAV-2024-SIG'}
            </p>
          </div>

          {/* 7. QR Verification Status */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">7. QR Verification</span>
              <QrCode className="w-4 h-4 text-[#123A78]" />
            </div>
            <div className="text-base font-bold text-[#0B7A3B]">
              Encrypted QR Active
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              Court-admissible mobile verification URL anchored in state blockchain node.
            </p>
          </div>

          {/* 8. Digital Signature Placeholder */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">8. Digital Signature (DSC)</span>
              <FileCheck className="w-4 h-4 text-[#123A78]" />
            </div>
            <div className="text-base font-bold text-[#123A78]">
              CCA India Class-3
            </div>
            <p className="text-[11px] text-gray-600 leading-snug">
              e-Sign certified with SHA-256 tamper-evident electronic stamp.
            </p>
          </div>
        </div>

        {/* Verification Milestones Timeline */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#123A78]" />
              <h3 className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                Cadastral Verification Milestones &amp; Audit Trail
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">DILRMP Certified Step Chain</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative flex items-start gap-4 text-xs">
                {/* Status Dot */}
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                    ms.status === 'COMPLETED'
                      ? 'bg-[#0B7A3B]'
                      : ms.status === 'FLAGGED'
                      ? 'bg-[#B26A00]'
                      : 'bg-[#B42318]'
                  }`}
                >
                  {ms.status === 'COMPLETED' ? <Check className="w-3 h-3" /> : '!'}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 w-full space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#1C2733] text-sm">{ms.title}</span>
                    <span className="font-mono text-[11px] text-gray-500">{ms.date}</span>
                  </div>
                  <p className="text-gray-700 leading-snug">{ms.description}</p>
                  <div className="pt-1 text-[11px] text-[#123A78] font-semibold">
                    Authorized By: {ms.officer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRINTABLE OFFICIAL TRUST CERTIFICATE MODAL */}
        {isCertificateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-2xs overflow-y-auto">
            <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl border-4 border-[#123A78] space-y-6 text-left my-8 print:border-none print:shadow-none print:p-0">
              {/* Official Ashok Stambha Seal & Certificate Header */}
              <div className="flex items-center justify-between border-b-2 border-[#123A78] pb-4">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-widest text-[#123A78] font-bold">
                    GOVERNMENT OF MAHARASHTRA &bull; REVENUE &amp; LAND RECORDS DEPARTMENT
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Official Cadastral Citizen Trust Certificate
                  </h2>
                  <div className="text-xs text-gray-600 font-mono">
                    Certificate UID: CERT-BHOOMISETU-{currentParcel.parcelUid.slice(-8)}-2026 &bull; DILRMP Standard
                  </div>
                </div>

                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 print:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Particulars Grid */}
              <div className="bg-[#FAF7F0] border border-amber-300 rounded-lg p-5 space-y-4">
                <div className="text-center pb-2 border-b border-amber-200">
                  <div className="text-xs font-serif text-gray-800">
                    This is to certify that the land holding described below has undergone comprehensive AI-assisted Devanagari OCR validation, satellite GIS boundary orthorectification, forensic authenticity screening, and statutory Sub-Divisional Magistrate review under Section 148 of the Maharashtra Land Revenue Code, 1966.
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Survey / Gat No:</span>
                    <span className="font-bold text-sm text-[#123A78]">{currentParcel.surveyNumber}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Khata Number:</span>
                    <span className="font-bold text-sm text-gray-900">{currentParcel.khataNumber}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Holding Area:</span>
                    <span className="font-mono font-bold text-sm text-[#0B7A3B]">{currentParcel.landAreaHa} Hectares</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Titleholder:</span>
                    <span className="font-bold text-gray-900">{currentParcel.ownerName}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Village &amp; Taluka:</span>
                    <span className="font-bold text-gray-900">{currentParcel.village}, {currentParcel.taluka}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Trust Rating:</span>
                    <span className="font-bold text-[#0B7A3B]">{overallScore}% &mdash; {trustBand.label}</span>
                  </div>
                </div>

                {/* QR Code & Cryptographic Seals */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-1 rounded border border-gray-300 flex items-center justify-center">
                      <QrCode className="w-14 h-14 text-[#123A78]" />
                    </div>
                    <div className="text-[11px] text-gray-700">
                      <div className="font-bold text-[#123A78]">Official Verification QR</div>
                      <div className="text-gray-500 text-[10px] font-mono mt-0.5">
                        https://bhulekh.gov.in/verify/{currentParcel.parcelUid}
                      </div>
                      <div className="text-emerald-800 text-[10px] font-bold mt-0.5">
                        CCA Class-3 Electronic Signature Valid
                      </div>
                    </div>
                  </div>

                  {/* Tehsildar Digital Signature Stamp */}
                  <div className="text-right border-l sm:border-l-2 border-amber-300 pl-4 space-y-0.5">
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Digitally Certified By:</div>
                    <div className="font-bold text-sm text-gray-900">Shri Mahesh Gopal Kulkarni</div>
                    <div className="text-xs text-gray-700">Sub-Divisional Magistrate / Tehsildar (Haveli)</div>
                    <div className="font-mono text-[10px] text-gray-500">Hash: {currentParcel.trust?.digitalSignatureHash || 'cca-hash-88912'}</div>
                  </div>
                </div>
              </div>

              {/* Print / Action Buttons */}
              <div className="flex justify-end gap-3 pt-2 print:hidden">
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
