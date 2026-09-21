import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Calendar,
  Send,
  Printer,
  ChevronRight,
  ExternalLink,
  Info,
  MapPin,
  Scale,
} from 'lucide-react';
import { MOCK_ENCROACHMENTS } from '../../data/geoAiData';
import { EncroachmentCase } from '../../types/geoAi';

interface EncroachmentCenterViewProps {
  onRequisitionInspection?: (encroachment: EncroachmentCase) => void;
}

export const EncroachmentCenterView: React.FC<EncroachmentCenterViewProps> = ({
  onRequisitionInspection,
}) => {
  const [cases, setCases] = useState<EncroachmentCase[]>(MOCK_ENCROACHMENTS);
  const [selectedCase, setSelectedCase] = useState<EncroachmentCase>(MOCK_ENCROACHMENTS[0]);
  const [officerNote, setOfficerNote] = useState<string>('');
  const [notesHistory, setNotesHistory] = useState<Array<{ officer: string; text: string; date: string }>>([
    {
      officer: 'S. N. Joshi (Tehsildar, Haveli)',
      text: 'Verified Cartosat-3 0.28m imagery. Structure infringes upon 50m canal safety corridor. Ordered ground inspection.',
      date: '2026-02-22 03:15 PM',
    },
  ]);
  const [noticeGenerated, setNoticeGenerated] = useState<boolean>(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim()) return;
    setNotesHistory([
      ...notesHistory,
      {
        officer: 'Current Revenue Officer (Talathi Saja #3)',
        text: officerNote.trim(),
        date: new Date().toLocaleString(),
      },
    ]);
    setOfficerNote('');
  };

  const handleGenerateNotice = () => {
    setNoticeGenerated(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#FEE4E2] text-[#B42318] border-[#FDA29B]';
      case 'HIGH':
        return 'bg-[#FEF0C7] text-[#B26A00] border-[#FCD34D]';
      case 'MEDIUM':
        return 'bg-blue-50 text-[#123A78] border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#B42318] text-white text-[11px] font-bold rounded">
              Spatial Violation Monitor
            </span>
            <span className="text-xs text-gray-500 font-mono">Encroachment & Easement Guard</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>Encroachment Detection Center</span>
            <span className="text-sm font-normal text-gray-600">• Haveli Sub-Division, Pune</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Automated spatial intersection checks against statutory waterbodies, PWD road rights-of-way, and forest buffer corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateNotice}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#B42318] hover:bg-red-800 text-white rounded text-xs font-bold transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Statutory Sec 53 Notice</span>
          </button>
        </div>
      </div>

      {/* 2. Main Encroachment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Detected Violations */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-[#123A78] uppercase tracking-wide px-1">
            Active Encroachment Violations ({cases.length})
          </div>

          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`p-4 rounded-[10px] border transition-all cursor-pointer ${
                selectedCase.id === c.id
                  ? 'bg-blue-50/50 border-[#123A78] shadow-xs'
                  : 'bg-white border-[#D8DEE8] hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(c.severity)}`}>
                    {c.severity}
                  </span>
                  <span className="font-bold text-[#123A78] text-sm">
                    Survey #{c.surveyNumber} • {c.village}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="text-xs font-semibold text-gray-800 mb-1">{c.infringedFeature}</div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                <span>Overlap: <b className="text-[#B42318]">{c.overlapAreaSqm} sqm</b></span>
                <span>Confidence: <b className="text-[#0B7A3B]">{c.confidenceScore}%</b></span>
                <span>Sensor: {c.detectedVia.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Case Dossier, Spatial Breakdown & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DEE8] mb-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Violation Dossier</span>
                <h3 className="text-base font-bold text-[#123A78]">
                  Survey #{selectedCase.surveyNumber} ({selectedCase.village}) • Case #{selectedCase.id}
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getSeverityBadge(selectedCase.severity)}`}>
                {selectedCase.severity} RISK
              </span>
            </div>

            {/* Violation Details List */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#F5F7FA] p-3 rounded border border-[#D8DEE8]">
                <div>
                  <span className="text-gray-500">Infringed Asset:</span>
                  <div className="font-semibold text-gray-900 mt-0.5">{selectedCase.infringedFeature}</div>
                </div>
                <div>
                  <span className="text-gray-500">Spatial Overlap Area:</span>
                  <div className="font-bold text-[#B42318] text-sm mt-0.5">{selectedCase.overlapAreaSqm} sq. meters</div>
                </div>
                <div>
                  <span className="text-gray-500">Detection Methodology:</span>
                  <div className="font-semibold text-gray-900 mt-0.5">{selectedCase.detectedVia}</div>
                </div>
                <div>
                  <span className="text-gray-500">AI Confidence Score:</span>
                  <div className="font-bold text-[#0B7A3B] mt-0.5">{selectedCase.confidenceScore}% verified match</div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-gray-800">Statutory Action Required:</span>
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-950 font-medium mt-1">
                  {selectedCase.actionRequired}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {onRequisitionInspection && (
                  <button
                    onClick={() => onRequisitionInspection(selectedCase)}
                    className="flex-1 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded font-bold flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Ground Truthing Mission &rarr;</span>
                  </button>
                )}

                <button
                  onClick={handleGenerateNotice}
                  className="px-4 py-2 bg-[#F5F7FA] hover:bg-gray-200 border border-[#D8DEE8] text-[#123A78] rounded font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Formal Show-Cause Notice</span>
                </button>
              </div>
            </div>

            {/* Officer Notes & Action Log */}
            <div className="mt-6 pt-4 border-t border-[#D8DEE8]">
              <h4 className="text-xs font-bold text-[#123A78] uppercase tracking-wide mb-3">
                Revenue Officer Case Log & Notes
              </h4>

              <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
                {notesHistory.map((note, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-xs">
                    <div className="flex justify-between text-[11px] text-gray-500 font-semibold mb-1">
                      <span>{note.officer}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-gray-800">{note.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add officer remark or judicial directive..."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-[#123A78]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold"
                >
                  Post Note
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
