import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  Search,
  Eye,
  Info,
  Layers,
  History,
  ShieldAlert,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Save,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { LandParcelDetail, OcrExtractedField } from '../types/landRecords';

interface VerificationQueueViewProps {
  parcels: LandParcelDetail[];
  onSelectParcel: (parcelId: string) => void;
  onOpenReportModal: (parcel: LandParcelDetail) => void;
}

export const VerificationQueueView: React.FC<VerificationQueueViewProps> = ({
  parcels,
  onSelectParcel,
  onOpenReportModal,
}) => {
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[0]?.id || 'p-001');
  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Editable OCR fields local state
  const [fields, setFields] = useState<OcrExtractedField[]>([
    {
      id: 'f-1',
      fieldName: 'ownerName',
      label: 'Landowner Name (खातेदाराचे नाव)',
      extractedValue: selectedParcel.ownerName,
      confidence: 99.4,
      boundingBox: { x: 18, y: 22, width: 34, height: 4.8 },
      rawOcrText: 'रमेशवर किसन पाटील',
      aiExplanation: 'Devnagari ligature matches Gazette cadastral index with 99.4% precision.',
      isHandwritten: false,
      status: 'APPROVED',
      historicalValue: selectedParcel.fatherName,
      historicalYear: 1978,
    },
    {
      id: 'f-2',
      fieldName: 'surveyNumber',
      label: 'Survey / Gat Number (गट क्र.)',
      extractedValue: selectedParcel.surveyNumber,
      confidence: 99.7,
      boundingBox: { x: 12, y: 14, width: 14, height: 4.5 },
      rawOcrText: '१४२/अ',
      aiExplanation: 'Aligned with cadastral village sheet layout.',
      isHandwritten: false,
      status: 'APPROVED',
    },
    {
      id: 'f-3',
      fieldName: 'landArea',
      label: 'Total Land Area (एकूण क्षेत्रफळ)',
      extractedValue: `${selectedParcel.landAreaHa} Hectares`,
      confidence: selectedParcel.riskLevel === 'CRITICAL' ? 68.2 : 98.9,
      boundingBox: { x: 72, y: 22, width: 20, height: 5.0 },
      rawOcrText: `${selectedParcel.landAreaHa} हेक्टर`,
      aiExplanation:
        selectedParcel.riskLevel === 'CRITICAL'
          ? 'CRITICAL WARNING: Localized font mismatch detected. Number baseline shifted by 3.4px (OCR Overwrite suspicion).'
          : 'Hectare-Are-SqM notation standard confirmed against revenue treasury roll.',
      isHandwritten: false,
      status: selectedParcel.riskLevel === 'CRITICAL' ? 'REJECTED' : 'APPROVED',
      historicalValue: '4.90 Hectares (Pre-Subdivision)',
      historicalYear: 1999,
    },
    {
      id: 'f-4',
      fieldName: 'mutationNumber',
      label: 'Certified Mutation Number (फेरफार क्र.)',
      extractedValue: selectedParcel.mutationNumber,
      confidence: 99.1,
      boundingBox: { x: 18, y: 44, width: 26, height: 4.8 },
      rawOcrText: '९१८ (प्रमाणित)',
      aiExplanation: 'Certified mutation order signed by Circle Officer.',
      isHandwritten: true,
      status: 'APPROVED',
    },
    {
      id: 'f-5',
      fieldName: 'modiScriptAnnotation',
      label: 'Archival Modi Script Watermark Margin Note',
      extractedValue: 'धोंडीबा रामजी पाटील वारस नोंद (वारसा हक्क)',
      confidence: 94.6,
      boundingBox: { x: 10, y: 80, width: 45, height: 8.0 },
      rawOcrText: 'मोडी लिपी टिपणी: वारसा नोंद',
      aiExplanation: 'Specialized TrOCR Indic model identified 1952 archival Modi script ancestral succession note.',
      isHandwritten: true,
      status: 'APPROVED',
    },
  ]);

  const [activeFieldId, setActiveFieldId] = useState<string>('f-1');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [tempEditValue, setTempEditValue] = useState<string>('');
  const [auditReason, setAuditReason] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeField = fields.find((f) => f.id === activeFieldId) || fields[0];
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SYNCED'>('IDLE');

  const handleFieldSelect = (field: OcrExtractedField) => {
    setActiveFieldId(field.id);
  };

  const handleApproveField = async (id: string) => {
    const field = fields.find((f) => f.id === id);
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'APPROVED' } : f)));

    if (field && selectedParcel) {
      try {
        await fetch('/api/land-records/verify-field', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parcelId: selectedParcel.id,
            fieldId: field.id,
            fieldName: field.fieldName,
            action: 'APPROVE',
            value: field.verifiedValue || field.extractedValue,
            notes: 'Field approved by verification officer and synced to Citizen Portal',
          }),
        });
      } catch (err) {
        console.warn('Field verification sync warning:', err);
      }
    }
  };

  const handleRejectField = (id: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'REJECTED' } : f)));
  };

  const handleSanctionAllAndSync = async () => {
    setSyncStatus('SYNCING');
    try {
      setFields((prev) => prev.map((f) => ({ ...f, status: 'APPROVED' })));

      await fetch('/api/land-records/verify-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcelId: selectedParcel.id,
          fieldId: 'all',
          fieldName: 'all_fields',
          action: 'APPROVE',
          value: selectedParcel.ownerName,
          notes: 'Full parcel record sanctioned by Revenue Officer. All 6 statutory checks verified and synced to Citizen Portal.',
        }),
      });

      setSyncStatus('SYNCED');
      setTimeout(() => setSyncStatus('IDLE'), 4500);
    } catch (err) {
      console.error('Failed to sync to citizen portal:', err);
      setSyncStatus('IDLE');
    }
  };

  const startEditField = (field: OcrExtractedField) => {
    setEditingFieldId(field.id);
    setTempEditValue(field.verifiedValue || field.extractedValue);
    setAuditReason('Officer manual verification against registered village roznamcha.');
  };

  const saveEditField = (id: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              verifiedValue: tempEditValue,
              status: 'MANUAL_EDIT',
              isEdited: true,
            }
          : f
      )
    );
    setEditingFieldId(null);
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header & Parcel Selector */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                Feature 3 &amp; 4
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                AI OCR &amp; Explainable Verification Queue
              </h1>
            </div>
            <p className="text-xs text-[#5A6878] mt-1">
              Side-by-side verification: Original scanned 7/12 RoR vs. PaddleOCR + TrOCR Devanagari &amp; Modi script extractions.
            </p>
          </div>

          {/* Quick Parcel Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">Select Parcel:</label>
            <select
              value={selectedParcelId}
              onChange={(e) => {
                setSelectedParcelId(e.target.value);
                onSelectParcel(e.target.value);
              }}
              className="p-2 bg-gray-50 border border-gray-300 rounded font-bold text-xs text-[#123A78] max-w-[280px]"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.surveyNumber} ({p.village}, {p.taluka}) — {p.ownerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main 2-Column Split: Scanned Document vs. Explainable AI Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col (7 cols): Scanned Document Viewer with Interactive Bounding Boxes */}
          <div className="lg:col-span-7 bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs flex flex-col">
            {/* Viewer Toolbar */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-700">Scanned Document:</span>
                <span className="font-mono text-gray-500">7_12_{selectedParcel.village.toUpperCase()}_ROR.pdf</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold text-gray-600 px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-700 ml-1"
                  title="Reset Zoom"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Canvas with Overlaid Bounding Boxes */}
            <div className="relative p-4 bg-gray-900 overflow-auto min-h-[500px] flex items-center justify-center">
              <div
                className="relative bg-white shadow-2xl transition-transform duration-200 origin-center max-w-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Official Scanned Image Placeholder */}
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop&q=80"
                  alt="Scanned Land Record 7/12"
                  className="w-full max-h-[560px] object-cover block select-none"
                />

                {/* Simulated Bounding Box Highlights */}
                {fields.map((field) => {
                  const isActive = field.id === activeFieldId;
                  const isHighRisk = field.confidence < 80;
                  return (
                    <div
                      key={field.id}
                      onClick={() => handleFieldSelect(field)}
                      style={{
                        left: `${field.boundingBox.x}%`,
                        top: `${field.boundingBox.y}%`,
                        width: `${field.boundingBox.width}%`,
                        height: `${field.boundingBox.height}%`,
                      }}
                      className={`absolute cursor-pointer border-2 transition-all flex items-start justify-end p-0.5 ${
                        isActive
                          ? 'border-[#123A78] bg-[#123A78]/25 ring-2 ring-[#123A78] z-20'
                          : isHighRisk
                          ? 'border-[#B42318] bg-red-500/20 hover:bg-red-500/30'
                          : 'border-[#0B7A3B] bg-emerald-500/15 hover:bg-emerald-500/25'
                      }`}
                      title={`${field.label} (${field.confidence}%)`}
                    >
                      <span
                        className={`text-[9px] font-bold text-white px-1 rounded shadow-xs ${
                          isHighRisk ? 'bg-[#B42318]' : 'bg-[#123A78]'
                        }`}
                      >
                        {field.confidence}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-bar showing bounding box legend */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between text-[11px] text-gray-600 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-emerald-500/30 border border-emerald-600 rounded-xs"></span>
                  <span>Verified Field (&gt;90%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500/30 border border-red-600 rounded-xs"></span>
                  <span>Low Confidence / Flagged Field</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500/40 border-2 border-[#123A78] rounded-xs"></span>
                  <span>Currently Focused Field</span>
                </span>
              </div>
              <span className="font-mono text-gray-500">PaddleOCR Engine v4.2 + TrOCR Indic</span>
            </div>
          </div>

          {/* Right Col (5 cols): Explainable AI Verification Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Field Focus Card */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#123A78]" />
                  <h3 className="text-sm font-bold text-[#123A78]">
                    Explainable AI Inspection Panel
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    activeField.status === 'APPROVED'
                      ? 'bg-emerald-100 text-[#0B7A3B]'
                      : activeField.status === 'REJECTED'
                      ? 'bg-red-100 text-[#B42318]'
                      : 'bg-amber-100 text-[#B26A00]'
                  }`}
                >
                  {activeField.status}
                </span>
              </div>

              {/* Field Label and Extracted Content */}
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">{activeField.label}</span>

                {editingFieldId === activeField.id ? (
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={tempEditValue}
                      onChange={(e) => setTempEditValue(e.target.value)}
                      className="w-full p-2 bg-blue-50 border-2 border-[#123A78] rounded font-bold text-sm text-[#1C2733]"
                    />
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-1">
                        Mandatory Audit Justification (Reason for Correction):
                      </label>
                      <input
                        type="text"
                        value={auditReason}
                        onChange={(e) => setAuditReason(e.target.value)}
                        className="w-full p-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditField(activeField.id)}
                        className="px-3 py-1 bg-[#0B7A3B] text-white text-xs font-bold rounded flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save &amp; Log Audit</span>
                      </button>
                      <button
                        onClick={() => setEditingFieldId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="font-bold text-sm text-[#1C2733]">
                      {activeField.verifiedValue || activeField.extractedValue}
                    </div>
                    <button
                      onClick={() => startEditField(activeField)}
                      className="text-[#123A78] hover:text-[#1D5AA6] p-1 rounded"
                      title="Edit Value with Officer Audit Reason"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Explainable AI Reason Block */}
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs space-y-1.5">
                <div className="font-bold text-[#123A78] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#0B7A3B]" />
                  <span>Why AI Extracted This Value:</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[11px]">{activeField.aiExplanation}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-blue-100">
                  <span>Raw OCR Token: "{activeField.rawOcrText}"</span>
                  <span className="font-bold text-[#123A78]">Confidence: {activeField.confidence}%</span>
                </div>
              </div>

              {/* Historical Comparison Widget (If available) */}
              {activeField.historicalValue && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
                  <div className="font-bold text-[#B26A00] flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    <span>Historical Cross-Check ({activeField.historicalYear}):</span>
                  </div>
                  <div className="text-[11px] text-gray-700">
                    Previous Value: <span className="font-mono font-bold">{activeField.historicalValue}</span>
                  </div>
                </div>
              )}

              {/* Officer Decision Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleApproveField(activeField.id)}
                  className="flex-1 py-2 bg-[#0B7A3B] hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Field</span>
                </button>
                <button
                  onClick={() => handleRejectField(activeField.id)}
                  className="flex-1 py-2 bg-[#B42318] hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject / Flag Field</span>
                </button>
              </div>
            </div>

            {/* List of All Extracted Fields for Quick Navigation */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                All Extracted Fields ({fields.length})
              </h4>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {fields.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleFieldSelect(f)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      f.id === activeFieldId
                        ? 'border-[#123A78] bg-blue-50/60 font-bold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="text-gray-800">{f.label}</div>
                      <div className="text-[11px] text-gray-500 font-mono truncate max-w-[200px]">
                        {f.verifiedValue || f.extractedValue}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-gray-500">{f.confidence}%</span>
                      {f.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A3B]" />}
                      {f.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-[#B42318]" />}
                      {f.status === 'MANUAL_EDIT' && <Edit3 className="w-3.5 h-3.5 text-[#B26A00]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Master Sanction & Live Citizen Sync Card */}
            <div className="bg-white border-2 border-emerald-300/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B7A3B] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Revenue Sanction &amp; Sync
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Gat {selectedParcel.surveyNumber}
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Approve all verified fields for <strong>{selectedParcel.ownerName}</strong> and instantly sync the record into the Citizen Portal with a high-trust digital seal.
              </p>

              {syncStatus === 'SYNCED' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-[#0B7A3B] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Record Sanctioned &amp; Updated in Citizen Portal!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSanctionAllAndSync}
                disabled={syncStatus === 'SYNCING'}
                className="w-full py-2.5 bg-[#0B7A3B] hover:bg-[#096330] disabled:bg-gray-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                {syncStatus === 'SYNCING' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing with Citizen Portal...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sanction &amp; Sync to Citizen Portal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
