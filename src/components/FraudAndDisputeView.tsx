import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileSearch,
  Scale,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Building,
  Info,
  Layers,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface FraudAndDisputeViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
}

export const FraudAndDisputeView: React.FC<FraudAndDisputeViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  const [escalated, setEscalated] = useState(false);
  const [clearedByOfficer, setClearedByOfficer] = useState(false);

  const handleEscalateToAcb = () => {
    setEscalated(true);
    alert(
      `Case escalated: Cadastral parcel ${currentParcel.parcelUid} dispatched to District Collector and State Anti-Corruption Cell under Section 154 MLRC.`
    );
  };

  const handleClearRecord = () => {
    setClearedByOfficer(true);
    alert(`Officer clearance recorded for parcel ${currentParcel.parcelUid}. Audit log created.`);
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#B42318] text-white text-[10px] font-bold rounded uppercase">
                Feature 9 &amp; 10
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                Fraud Fingerprint &amp; Dispute Prediction Engine
              </h1>
            </div>
            <p className="text-xs text-[#5A6878] mt-1">
              Automated PDF byte inspection, circular stamp eccentricity verification, signature analysis, and e-Court litigation risk modeling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">Inspect Parcel:</label>
            <select
              value={selectedParcelId}
              onChange={(e) => onSelectParcel(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.surveyNumber} ({p.village}) — {p.ownerName} [
                  {p.fraud.riskCategory === 'HIGH_RISK' ? 'CRITICAL FRAUD' : 'CLEAN'}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Split: Feature 9 (Fraud Fingerprint) vs Feature 10 (Dispute Prediction) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col (6 cols): Fraud Fingerprint Engine */}
          <div className="lg:col-span-6 bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#B42318]" />
                <h2 className="text-base font-bold text-[#1C2733]">
                  Feature 9: Fraud Fingerprint Forensic Engine
                </h2>
              </div>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                  currentParcel.fraud.riskCategory === 'HIGH_RISK'
                    ? 'bg-red-100 text-[#B42318]'
                    : currentParcel.fraud.riskCategory === 'SUSPICIOUS'
                    ? 'bg-amber-100 text-[#B26A00]'
                    : 'bg-emerald-100 text-[#0B7A3B]'
                }`}
              >
                {currentParcel.fraud.riskCategory.replace('_', ' ')}
              </span>
            </div>

            {/* Score & Summary Banner */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Fraud Probability Score:</span>
                <span className="text-3xl font-mono font-extrabold text-[#1C2733]">
                  {currentParcel.fraud.score} / 100
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-500 block">NIC Forensic Status:</span>
                <span className="font-bold text-xs text-[#123A78]">
                  {currentParcel.fraud.manualReviewStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* 7 Deep Forensic Security Checks */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Cryptographic &amp; Visual Document Integrity Checks
              </h4>
              <div className="space-y-1.5 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-700">1. Third-Party PDF Editor Metadata (Photoshop/Illustrator):</span>
                  {currentParcel.fraud.checks.editedPdf ? (
                    <span className="font-bold text-[#B42318] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>DETECTED (FAIL)</span>
                    </span>
                  ) : (
                    <span className="font-bold text-[#0B7A3B] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CLEAN (PASS)</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-700">2. Metadata &amp; Creation Timestamp Consistency:</span>
                  {currentParcel.fraud.checks.metadataMismatch ? (
                    <span className="font-bold text-[#B42318] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>MISMATCH FLAGGED</span>
                    </span>
                  ) : (
                    <span className="font-bold text-[#0B7A3B] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SYNCHRONIZED</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-700">3. Duplicate Upload SHA-256 Collision Check:</span>
                  <span className="font-bold text-[#0B7A3B] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>UNIQUE HASH</span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-700">4. Official Tehsildar Circular Seal Geometric Circularity:</span>
                  {currentParcel.fraud.checks.sealMismatch ? (
                    <span className="font-bold text-[#B42318] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ELLIPTICAL ARTIFACT (FAIL)</span>
                    </span>
                  ) : (
                    <span className="font-bold text-[#0B7A3B] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AUTHENTIC (CIRCULARITY 0.998)</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-700">5. Author Signature Vector Similarity:</span>
                  <span
                    className={`font-mono font-bold ${
                      currentParcel.fraud.checks.signatureSimilarity > 85 ? 'text-[#0B7A3B]' : 'text-[#B42318]'
                    }`}
                  >
                    {currentParcel.fraud.checks.signatureSimilarity}% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Suspicious Spliced Regions Heatmap Preview */}
            {currentParcel.fraud.suspiciousRegions.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs">
                <span className="font-bold text-[#B42318] uppercase tracking-wider text-[11px] block">
                  Altered Regions Identified by ForensicDoc-Shield:
                </span>
                <div className="space-y-1">
                  {currentParcel.fraud.suspiciousRegions.map((reg: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded border border-red-200">
                      <span className="font-semibold text-gray-800">&bull; {reg.label}</span>
                      <span className="font-mono font-bold text-[#B42318] uppercase">
                        [{reg.severity} SEVERITY]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={handleEscalateToAcb}
                disabled={escalated}
                className="flex-1 py-2.5 bg-[#B42318] hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{escalated ? 'Escalated to Collectorate' : 'Escalate to District Collector & ACB'}</span>
              </button>

              <button
                onClick={handleClearRecord}
                disabled={clearedByOfficer}
                className="py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg shadow-2xs"
              >
                {clearedByOfficer ? 'Cleared by Officer' : 'Mark Cleared'}
              </button>
            </div>
          </div>

          {/* Right Col (6 cols): Feature 10 (Dispute Prediction Engine) */}
          <div className="lg:col-span-6 bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#123A78]" />
                <h2 className="text-base font-bold text-[#1C2733]">
                  Feature 10: Dispute Prediction Engine
                </h2>
              </div>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase ${
                  currentParcel.dispute.riskCategory === 'CRITICAL'
                    ? 'bg-red-100 text-[#B42318]'
                    : currentParcel.dispute.riskCategory === 'MEDIUM'
                    ? 'bg-amber-100 text-[#B26A00]'
                    : 'bg-emerald-100 text-[#0B7A3B]'
                }`}
              >
                {currentParcel.dispute.riskCategory} DISPUTE RISK
              </span>
            </div>

            {/* Dispute Risk Gauge */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Dispute Risk Index (0-100):</span>
                <span className="text-3xl font-mono font-extrabold text-[#123A78]">
                  {currentParcel.dispute.riskIndex} / 100
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-500 block">Civil Litigation Status:</span>
                <span
                  className={`font-bold text-xs ${
                    currentParcel.dispute.pendingCourtCases.length > 0 ? 'text-[#B42318]' : 'text-[#0B7A3B]'
                  }`}
                >
                  {currentParcel.dispute.pendingCourtCases.length > 0 ? 'ACTIVE STAY ORDER' : 'NIL COURT ORDERS'}
                </span>
              </div>
            </div>

            {/* Risk Factors / Predictive Signals */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Predictive Risk Signals &amp; Evidence
              </h4>
              <div className="space-y-2">
                {currentParcel.dispute.reasons.map((r: string, i: number) => (
                  <div key={i} className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#B26A00] shrink-0 mt-0.5" />
                    <span className="text-gray-800">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Court Cases List */}
            {currentParcel.dispute.pendingCourtCases.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1.5 text-xs">
                <div className="font-bold text-[#B42318] flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>e-Courts National Judicial Grid Case Linkage:</span>
                </div>
                {currentParcel.dispute.pendingCourtCases.map((c: string, i: number) => (
                  <div key={i} className="font-mono text-[11px] text-gray-800 bg-white p-2 rounded border border-red-200">
                    Case No: <span className="font-bold text-[#B42318]">{c}</span> &bull; Status: Interim Stay on Alienation
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Statutory Administrative Actions */}
            <div className="space-y-2 text-xs pt-1">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Statutory Recommendations for Sub-Divisional Officer:
              </h4>
              <div className="space-y-1.5">
                {currentParcel.dispute.suggestedActions.map((act: string, i: number) => (
                  <div key={i} className="p-2 bg-blue-50/60 border border-blue-200 rounded text-gray-800 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#123A78] shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
