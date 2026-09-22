import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeftRight, CheckCircle2, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { LandParcelDetail, DocumentDiffComparison } from '../types/landRecords';

interface DocumentComparisonModalProps {
  parcel: LandParcelDetail;
  onClose: () => void;
}

export const DocumentComparisonModal: React.FC<DocumentComparisonModalProps> = ({ parcel, onClose }) => {
  const [selectedDocAYear, setSelectedDocAYear] = useState<number>(1999);
  const [selectedDocBYear, setSelectedDocBYear] = useState<number>(2024);

  // Dynamic comparison based on selected years
  const comparisonData: DocumentDiffComparison = {
    docA: {
      title: `Archival 7/12 RoR (${selectedDocAYear})`,
      year: selectedDocAYear,
      type: 'Cadastral Paper Register (Modi Script / Devanagari)',
    },
    docB: {
      title: `Current Digital 7/12 RoR (${selectedDocBYear})`,
      year: selectedDocBYear,
      type: 'e-Mahabhulekh Digitally Signed RoR',
    },
    differences: [
      {
        field: 'Landowner (खातेदार)',
        oldValue: selectedDocAYear < 1978 ? 'Dhondiba Ramji Patil' : parcel.fatherName,
        newValue: parcel.ownerName,
        diffType: 'CHANGED',
        impact: 'HIGH',
      },
      {
        field: 'Total Holding Area',
        oldValue: selectedDocAYear < 1999 ? '4.90 Hectares' : `${parcel.landAreaHa} Hectares`,
        newValue: `${parcel.landAreaHa} Hectares`,
        diffType: selectedDocAYear < 1999 ? 'CHANGED' : 'SAME',
        impact: selectedDocAYear < 1999 ? 'HIGH' : 'LOW',
      },
      {
        field: 'Survey / Gat No.',
        oldValue: selectedDocAYear < 1999 ? 'Survey 142 (Entire)' : parcel.surveyNumber,
        newValue: parcel.surveyNumber,
        diffType: selectedDocAYear < 1999 ? 'CHANGED' : 'SAME',
        impact: 'MEDIUM',
      },
      {
        field: 'Mutation Entry (फेरफार क्र.)',
        oldValue: selectedDocAYear < 1999 ? 'Ferfar No. 114 (1978)' : 'Ferfar No. 482 (1999)',
        newValue: parcel.mutationNumber,
        diffType: 'CHANGED',
        impact: 'MEDIUM',
      },
      {
        field: 'Aadhaar e-KYC Verification',
        oldValue: 'Not Applicable (Pre-digital record)',
        newValue: 'Biometrically Linked via UIDAI',
        diffType: 'ADDED',
        impact: 'HIGH',
      },
      {
        field: 'CERSAI Mortgage Status',
        oldValue: 'Manual Talathi Search Report Required',
        newValue: 'Real-Time CERSAI Clean Record',
        diffType: 'ADDED',
        impact: 'MEDIUM',
      },
    ],
    areaDiffHa: selectedDocAYear < 1999 ? 2.45 : 0.0,
    ownershipDiffSummary:
      selectedDocAYear < 1999
        ? 'Holding partitioned into 142/A and 142/B pursuant to amicable family settlement sanctioned under Ferfar No. 482.'
        : 'Continuous lineage verified with no unrecorded third-party encumbrances.',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border-2 border-[#123A78] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-amber-300 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                BhoomiSetu &bull; Feature 15
              </div>
              <h2 className="text-base font-bold">AI Document Comparison &amp; Historical Cadastral Diff</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-left text-xs sm:text-sm">
          {/* Year selector comparison bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Historical Document (Baseline):</label>
              <select
                value={selectedDocAYear}
                onChange={(e) => setSelectedDocAYear(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs font-semibold text-[#123A78] focus:ring-2 focus:ring-[#123A78]"
              >
                <option value={1952}>1952 — Post-Independence Cadastral Settlement Record</option>
                <option value={1978}>1978 — Succession Ferfar No. 114</option>
                <option value={1999}>1999 — Family Partition (Hissa Phodni 142/A &amp; 142/B)</option>
                <option value={2016}>2016 — ISRO Bhuvan High-Res Geospatial Sync</option>
              </select>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-xs">
                VS
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Current Document (Target):</label>
              <select
                value={selectedDocBYear}
                onChange={(e) => setSelectedDocBYear(Number(e.target.value))}
                className="w-full p-2 bg-white border border-gray-300 rounded text-xs font-semibold text-[#123A78] focus:ring-2 focus:ring-[#123A78]"
              >
                <option value={2024}>2024 — e-Mahabhulekh Digitally Signed RoR (Current)</option>
              </select>
            </div>
          </div>

          {/* AI Intelligence Summary Banner */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
            <div className="font-bold text-xs text-[#123A78] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
              <span>AI Comparative Lineage Analysis</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {comparisonData.ownershipDiffSummary}
            </p>
          </div>

          {/* Comparative Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#123A78] text-white">
                  <th className="p-3 font-bold w-1/4">Field / Parameter</th>
                  <th className="p-3 font-bold w-1/3 bg-[#0F2F61]">
                    Baseline ({selectedDocAYear})
                  </th>
                  <th className="p-3 font-bold w-1/3 bg-[#1D5AA6]">
                    Current Record ({selectedDocBYear})
                  </th>
                  <th className="p-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {comparisonData.differences.map((diff, index) => {
                  return (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-semibold text-gray-800">{diff.field}</td>
                      <td className="p-3 text-gray-600 font-mono bg-gray-50/50">{diff.oldValue}</td>
                      <td className="p-3 text-[#123A78] font-mono font-semibold bg-blue-50/30">
                        {diff.newValue}
                      </td>
                      <td className="p-3 text-center">
                        {diff.diffType === 'CHANGED' && (
                          <span className="px-2 py-0.5 bg-amber-100 text-[#B26A00] font-bold text-[10px] rounded uppercase">
                            MODIFIED
                          </span>
                        )}
                        {diff.diffType === 'ADDED' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] font-bold text-[10px] rounded uppercase">
                            DIGITIZED
                          </span>
                        )}
                        {diff.diffType === 'SAME' && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-bold text-[10px] rounded uppercase">
                            IDENTICAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Cadastral Parcel: <span className="font-mono font-bold text-gray-800">{parcel.parcelUid}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg shadow-2xs"
          >
            Close Comparative Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
