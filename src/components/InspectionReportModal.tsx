import React, { useState } from 'react';
import { X, Printer, ShieldCheck, QrCode, FileText, CheckCircle2, Download, Building } from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface InspectionReportModalProps {
  parcel: LandParcelDetail;
  onClose: () => void;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({ parcel, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const reportId = `NIC-BHU-MH-2026-INSP-${parcel.id.toUpperCase()}-0491`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(parcel.trust.digitalSignatureHash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border-2 border-[#123A78] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Official Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-amber-300 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Government of India &bull; Revenue & Forest Department (Maharashtra)
              </div>
              <h2 className="text-base font-bold">Official Land Cadastral & On-Site Inspection Report</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Body (Printable Form Format) */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-xs sm:text-sm bg-[#FCFDFD]">
          {/* Official Emblem & Document Header */}
          <div className="border-b-2 border-gray-300 pb-4 text-center space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase">Form No. 16 (Rule 32) &bull; DILRMP Verification Standard</div>
            <h3 className="text-lg font-extrabold text-[#123A78]">OFFICE OF THE SUB-DIVISIONAL MAGISTRATE &amp; TEHSILDAR</h3>
            <p className="text-xs text-gray-600">
              Taluka: <span className="font-semibold">{parcel.taluka}</span> | District:{' '}
              <span className="font-semibold">{parcel.district}</span> | State: <span className="font-semibold">{parcel.state}</span>
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded font-mono text-xs font-bold text-[#123A78]">
              Report Reference: {reportId}
            </div>
          </div>

          {/* Parcel Identification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div>
              <span className="text-[11px] text-gray-500 block">Cadastral UID:</span>
              <span className="font-mono font-bold text-xs text-[#123A78] break-all">{parcel.parcelUid}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Survey / Gat No:</span>
              <span className="font-bold text-[#1C2733]">{parcel.surveyNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Khata Number:</span>
              <span className="font-bold text-[#1C2733]">{parcel.khataNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Village (गावं):</span>
              <span className="font-bold text-[#1C2733]">{parcel.village}</span>
            </div>
          </div>

          {/* Ownership Details */}
          <div className="space-y-2 border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-xs uppercase text-[#123A78] tracking-wider border-b pb-1">
              1. Ownership &amp; Tenancy Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Registered Landowner:</span>
                <div className="font-bold text-[#1C2733] text-sm">{parcel.ownerName}</div>
                <div className="text-gray-500 text-[11px]">S/o or D/o: {parcel.fatherName}</div>
              </div>
              <div>
                <span className="text-gray-500">Co-Sharers &amp; Allotment:</span>
                <div className="font-semibold text-gray-700">
                  {parcel.coSharers.map((c, i) => (
                    <span key={i} className="inline-block mr-2 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      {c.name} ({c.share})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Area & Satellite Verification Metrics */}
          <div className="space-y-2 border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-xs uppercase text-[#123A78] tracking-wider border-b pb-1">
              2. Cadastral Area &amp; ISRO Satellite Truth Verification
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Stated RoR Area</span>
                <span className="font-mono font-bold text-sm text-[#1C2733]">{parcel.gis.statedAreaHa} Ha</span>
              </div>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Cadastral Sheet Area</span>
                <span className="font-mono font-bold text-sm text-[#123A78]">{parcel.gis.cadastralAreaHa} Ha</span>
              </div>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase block">Satellite Calculated Area</span>
                <span className="font-mono font-bold text-sm text-[#0B7A3B]">{parcel.gis.satelliteAreaHa} Ha</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded text-xs">
              <div className="font-semibold text-[#123A78] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
                <span>Geospatial Variance: {parcel.gis.areaDiscrepancyPercent}%</span>
              </div>
              <p className="text-gray-600 mt-1">
                Cadastral boundaries georeferenced using Cartosat-3 and Sentinel-2 multispectral band imagery.
                {parcel.gis.encroachmentDetected
                  ? ' Warning: Field inspection records boundary variance exceeding standard 0.5% tolerance.'
                  : ' Variance is within permissible limits of Digital India Land Modernization Rules.'}
              </p>
            </div>
          </div>

          {/* On-Site Findings & Officer Recommendation */}
          <div className="space-y-2 border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-bold text-xs uppercase text-[#123A78] tracking-wider border-b pb-1">
              3. On-Site Inspection Findings &amp; Land Classification
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-500">Stated Land Classification:</span>
                <span className="font-semibold text-[#1C2733]">{parcel.landType}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-500">Observed Physical Land Use:</span>
                <span className="font-semibold text-[#1C2733]">{parcel.gis.landUseDetected}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-500">Soil &amp; Topography:</span>
                <span className="font-semibold text-[#1C2733]">{parcel.dna.soilType} (Elevation: {parcel.dna.elevationMeters}m)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-500">Encumbrance Registry (CERSAI):</span>
                <span
                  className={`font-bold ${
                    parcel.dna.encumbranceStatus === 'UNENCUMBERED' ? 'text-[#0B7A3B]' : 'text-[#B42318]'
                  }`}
                >
                  {parcel.dna.encumbranceStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-300">
              <span className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                Official Recommendation by Inspecting Officer:
              </span>
              <p className="text-xs text-gray-800 leading-relaxed font-medium">
                {parcel.riskLevel === 'CRITICAL'
                  ? 'Title mutation stayed in view of Civil Suit and suspected document alteration. Matter escalated to Sub-Divisional Officer for judicial determination under Section 154 of MLRC 1966.'
                  : 'Physical boundaries and title continuity from 1952 verified. No encumbrances or public corridor infringements detected. Certified fit for regular digital revenue mutations and e-Signing.'}
              </p>
            </div>
          </div>

          {/* Official Signatures & Digital Seals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-gray-300 pt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-white p-1 border border-gray-300 rounded flex items-center justify-center shrink-0">
                <QrCode className="w-14 h-14 text-[#123A78]" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-[#123A78]">NIC Certified QR Token</div>
                <div className="text-gray-500 mt-0.5">Scan to verify authentic certificate on bhulekh.gov.in</div>
                <div className="font-mono text-[9px] text-gray-400 mt-1 truncate max-w-[180px]">
                  {parcel.trust.qrVerificationUrl}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-[11px] space-y-1">
              <div className="flex items-center gap-1 font-bold text-[#0B7A3B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Signed via CCA India (DSC Class 3)</span>
              </div>
              <div className="text-gray-700">
                Officer: <span className="font-semibold">{parcel.trust.officerVerificationBadge.officerName}</span>
              </div>
              <div className="text-gray-600">Designation: {parcel.trust.officerVerificationBadge.designation}</div>
              <div className="text-gray-500 font-mono text-[10px] break-all">
                Hash: {parcel.trust.digitalSignatureHash}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyHash}
            className="text-xs font-semibold text-[#123A78] hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Hash Copied to Clipboard!' : 'Copy Verification Hash'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={() => {
                alert(`Official Inspection Certificate ${reportId} has been exported to PDF with NIC watermark.`);
              }}
              className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
