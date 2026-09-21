import React, { useState } from 'react';
import {
  Dna,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  FileText,
  AlertTriangle,
  QrCode,
  Share2,
  Download,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface ParcelIntelligenceViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onOpenReportModal: (parcel: LandParcelDetail) => void;
  onOpenComparisonModal: (parcel: LandParcelDetail) => void;
}

export const ParcelIntelligenceView: React.FC<ParcelIntelligenceViewProps> = ({
  parcels,
  selectedParcelId,
  onOpenReportModal,
  onOpenComparisonModal,
  onSelectParcel,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Timeline Slider State
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<number>(2024);

  // Available timeline years
  const availableYears = [1952, 1978, 1999, 2016, 2024];

  // Current active event
  const currentTimelineEvent =
    currentParcel.timeline.find((t) => t.year === selectedTimelineYear) ||
    currentParcel.timeline[currentParcel.timeline.length - 1];

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header Strip & Land DNA Badge */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#D8DEE8] pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#123A78] text-white flex items-center justify-center font-bold text-2xl shadow-2xs">
                <Dna className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                    Feature 5, 6, 13 &amp; 14
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                    Parcel 360° Profile &amp; Land DNA Engine
                  </h1>
                </div>
                <div className="text-xs text-[#5A6878] font-mono mt-0.5 break-all">
                  Cadastral UID: <span className="font-bold text-[#123A78]">{currentParcel.parcelUid}</span>
                </div>
              </div>
            </div>

            {/* Selector & Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={selectedParcelId}
                onChange={(e) => onSelectParcel(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.surveyNumber} ({p.village}) — {p.ownerName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onOpenComparisonModal(currentParcel)}
                className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#123A78]" />
                <span>Compare Historical RoR</span>
              </button>

              <button
                onClick={() => onOpenReportModal(currentParcel)}
                className="px-3.5 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Dossier</span>
              </button>
            </div>
          </div>

          {/* SHA-384 Immutable Cryptographic DNA Fingerprint Strip */}
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0B7A3B] shrink-0" />
              <span className="font-bold text-[#123A78]">SHA-384 Land DNA Integrity Hash:</span>
              <span className="font-mono text-gray-700 break-all text-[11px]">{currentParcel.dna.dnaHash}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] font-bold text-[10px] rounded uppercase shrink-0">
              BLOCKCHAIN ANCHORED (NIC CADASTRE)
            </span>
          </div>
        </div>

        {/* 360° Dossier Grid: Basic Details, Co-Sharers, and Citizen Trust Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Primary Details & Co-Sharers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Cadastral Parameters */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#123A78] uppercase tracking-wider border-b border-gray-200 pb-2">
                Cadastral Holding Particulars (गाव नमुना ७/१२)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Survey / Gat No:</span>
                  <span className="font-bold text-sm text-[#1C2733]">{currentParcel.surveyNumber}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Khata Number:</span>
                  <span className="font-bold text-sm text-[#1C2733]">{currentParcel.khataNumber}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Holding Area:</span>
                  <span className="font-mono font-bold text-sm text-[#123A78]">
                    {currentParcel.landAreaHa} Ha ({currentParcel.landAreaSqft.toLocaleString()} sqft)
                  </span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Land Classification:</span>
                  <span className="font-semibold text-xs text-[#1C2733] truncate block">{currentParcel.landType}</span>
                </div>
              </div>

              {/* Owner & Legal Heir Table */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase text-gray-600 tracking-wider">
                  Registered Title Holders &amp; Share Allotments
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 font-bold text-gray-700">
                      <tr>
                        <th className="p-2.5">Name of Landowner</th>
                        <th className="p-2.5">Share %</th>
                        <th className="p-2.5">Aadhaar Linkage</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentParcel.coSharers.map((sharer, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2.5 font-bold text-gray-800">{sharer.name}</td>
                          <td className="p-2.5 font-mono text-[#123A78] font-semibold">{sharer.share}</td>
                          <td className="p-2.5">
                            {sharer.aadhaarLinked ? (
                              <span className="text-[#0B7A3B] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>e-KYC Verified</span>
                              </span>
                            ) : (
                              <span className="text-gray-500">Pending Link</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                              ACTIVE
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* FEATURE 6: AI TIME TRAVEL (1950 TO PRESENT SLIDER) */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#123A78]" />
                  <h3 className="text-sm font-bold text-[#123A78]">
                    Time Travel for Land: Historical Timeline (1950 &ndash; Present)
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#123A78] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Year Selected: {selectedTimelineYear}
                </span>
              </div>

              {/* Slider Control */}
              <div className="space-y-2 pt-2">
                <input
                  type="range"
                  min="1952"
                  max="2024"
                  step="1"
                  value={selectedTimelineYear}
                  onChange={(e) => {
                    // Snap to closest available year
                    const val = Number(e.target.value);
                    const closest = availableYears.reduce((prev, curr) =>
                      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                    );
                    setSelectedTimelineYear(closest);
                  }}
                  className="w-full accent-[#123A78] cursor-pointer"
                />

                {/* Stepper notches */}
                <div className="flex justify-between text-[11px] font-mono text-gray-500 pt-1">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedTimelineYear(year)}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        selectedTimelineYear === year
                          ? 'bg-[#123A78] text-white'
                          : 'text-gray-600 hover:text-[#123A78]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Milestone Display Card */}
              {currentTimelineEvent && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded">
                      {currentTimelineEvent.type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-gray-500 font-bold">{currentTimelineEvent.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1C2733]">{currentTimelineEvent.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{currentTimelineEvent.description}</p>
                  <div className="pt-2 border-t border-gray-200 flex justify-between text-gray-600 text-[11px]">
                    <span>Recorded Owner: <strong className="text-gray-800">{currentTimelineEvent.ownerName}</strong></span>
                    <span>Holding Area: <strong className="text-gray-800">{currentTimelineEvent.areaHectares} Ha</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Col 3: Citizen Trust Score & Digital Badge (Feature 13) */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#123A78] rounded-xl p-5 shadow-2xs space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-xs font-bold uppercase text-[#123A78] tracking-wider">
                  Citizen Trust Score &amp; Badge
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] font-bold text-[10px] rounded uppercase">
                  {currentParcel.trust.badge.replace('_', ' ')}
                </span>
              </div>

              {/* Trust Score Radial Display */}
              <div className="text-center py-2 bg-blue-50/50 rounded-lg border border-blue-200">
                <div className="text-4xl font-extrabold text-[#123A78] font-mono">
                  {currentParcel.trust.overallScore}%
                </div>
                <div className="text-[11px] font-bold text-[#0B7A3B] mt-1">
                  National Cadastral Trust Clearance
                </div>
              </div>

              {/* Verification Sub-Scores */}
              <div className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-600">AI Bilingual OCR Extraction:</span>
                    <span className="font-mono font-bold text-[#123A78]">
                      {currentParcel.trust.aiVerificationScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#123A78] h-full"
                      style={{ width: `${currentParcel.trust.aiVerificationScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-600">Satellite GIS Consistency:</span>
                    <span className="font-mono font-bold text-[#0B7A3B]">98.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0B7A3B] h-full" style={{ width: '98.2%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-600">Fraud &amp; Tamper Clearance:</span>
                    <span className="font-mono font-bold text-[#0B7A3B]">99.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0B7A3B] h-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>
              </div>

              {/* QR Code Token Box */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded border border-gray-300 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-[#123A78]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <div className="font-bold text-[#123A78]">Official Verification QR</div>
                  <div className="text-gray-500 text-[10px] mt-0.5">
                    Scan for instant court-admissible certificate validation.
                  </div>
                </div>
              </div>

              {/* Officer Sign-Off Stamp */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs space-y-1">
                <div className="font-bold text-[#0B7A3B] flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated by Tehsildar (Haveli)</span>
                </div>
                <div className="text-[11px] text-gray-700">
                  Digital Sign Ref: {currentParcel.trust.officerVerificationBadge.signatureHash}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
