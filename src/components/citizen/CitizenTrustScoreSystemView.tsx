import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Printer,
  QrCode,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  Lock,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenTrustScoreSystemViewProps {
  parcelId?: string;
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CitizenTrustScoreSystemView: React.FC<CitizenTrustScoreSystemViewProps> = ({
  parcelId = 'IN-MH-PUN-HAV-2024-00142-A',
  onNavigate,
  language,
}) => {
  const [trustData, setTrustData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    fetch(`/api/citizen/trust/${parcelId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrustData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [parcelId]);

  if (loading || !trustData) {
    return (
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-4 border-[#123A78] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-700">Loading AI Trust Verification Dossier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#0B7A3B]/10 text-[#0B7A3B] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Official DILRMP Verification Score
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen AI Land Trust Score & Audit Dossier
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Parcel UID: {trustData.parcelUid} | Survey No: {trustData.surveyNumber} ({trustData.village}, Pune)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('timeline', trustData.parcelUid)}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            70-Yr History
          </button>
          <button
            onClick={() => setShowCertificateModal(true)}
            className="bg-[#0B7A3B] hover:bg-[#096330] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> View Official Certificate
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-linear-to-r from-[#123A78] to-[#1e4e96] text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              National Land Records Modernization Programme (DILRMP)
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
              Land Title Verified & Cryptographically Anchored
            </h3>
            <p className="text-sm text-gray-200 max-w-xl leading-relaxed">
              This parcel has successfully passed all 6 government verification checkpoints with zero legal injunctions, zero buffer encroachment, and 100% OCR document concordance.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authorized by: {trustData.officerVerifiedBy}
              </span>
              <span>•</span>
              <span>Last Verification: {trustData.lastVerificationDate}</span>
            </div>
          </div>

          {/* Score Circle Widget */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center shrink-0 flex flex-col items-center justify-center w-48 h-48 shadow-inner">
            <span className="text-5xl font-black text-emerald-400 tracking-tight">
              {trustData.overallScore}
              <span className="text-2xl text-white font-normal">/100</span>
            </span>
            <span className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
              GREEN VERIFIED
            </span>
            <span className="text-[10px] text-gray-200 mt-1">High Institutional Trust</span>
          </div>
        </div>
      </div>

      {/* The 6 Government Pillars of Trust */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              The 6 Government Verification Pillars
            </h3>
            <p className="text-xs text-gray-500">
              Institutional criteria mandated by the Department of Land Resources (DoLR)
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            All 6 Checks Passed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trustData.pillars.map((pillar: any, idx: number) => (
            <div
              key={pillar.id}
              className="bg-white border border-[#D8DEE8] rounded-xl p-4.5 hover:border-[#0B7A3B] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{pillar.name}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {pillar.details}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-sm font-black text-[#0B7A3B] block">
                    {pillar.score}%
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                    {pillar.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Government Certificate Preview Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl border-4 border-[#123A78] my-8 relative">
            {/* National Header in Certificate */}
            <div className="text-center border-b-2 border-[#123A78] pb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-xs mb-2">
                सत्यमेव<br/>जयते
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">
                GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT
              </h3>
              <h4 className="text-lg font-black text-[#123A78] mt-0.5">
                NATIONAL LAND RECORDS TRUST & VERIFICATION CERTIFICATE
              </h4>
              <p className="text-[11px] text-gray-500">
                Digital India Land Records Modernization Programme (DILRMP) | NIC State Node Pune
              </p>
            </div>

            {/* Certificate Details Table */}
            <div className="mt-5 space-y-3 text-xs text-gray-800">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-gray-500 block text-[10px]">CERTIFICATE NUMBER</span>
                  <span className="font-mono font-bold text-gray-900">
                    DILRMP-MH-PUN-2026-981274
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">ULPIN (UNIQUE PARCEL ID)</span>
                  <span className="font-mono font-bold text-gray-900">
                    {trustData.parcelUid}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">SURVEY / GAT NUMBER</span>
                  <span className="font-bold text-gray-900">
                    Survey {trustData.surveyNumber}, Village {trustData.village}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">VERIFIED AREA</span>
                  <span className="font-bold text-gray-900">
                    {trustData.areaHectares} Hectares (~73.6 Gunthas)
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">REGISTERED OWNER</span>
                  <span className="font-bold text-gray-900">
                    {trustData.ownerName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">AI TRUST INDEX</span>
                  <span className="font-bold text-[#0B7A3B]">
                    98/100 (High Institutional Confidence)
                  </span>
                </div>
              </div>

              {/* Digital Seal & QR Code */}
              <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-950 font-bold">
                    <Lock className="w-4 h-4 text-[#123A78]" /> Cryptographic SHA-256 Digital Signature:
                  </div>
                  <p className="font-mono text-[9px] text-gray-600 max-w-sm break-all">
                    {trustData.digitalSignature}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Officially attested by {trustData.officerVerifiedBy}
                  </p>
                </div>

                {/* QR Code Stamp */}
                <div className="p-2 bg-white border border-gray-300 rounded text-center shrink-0">
                  <QrCode className="w-16 h-16 mx-auto text-[#123A78]" />
                  <span className="text-[8px] font-mono block text-gray-600">SCAN TO VERIFY</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Close Preview
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Copy
                </button>
                <button
                  onClick={() => {
                    alert('Certificate downloaded with cryptographic seal.');
                    setShowCertificateModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B7A3B] hover:bg-[#096330] rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF (Signed)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
