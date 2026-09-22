import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Compass,
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Clock,
  ShieldCheck,
  Send,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { MOCK_INSPECTIONS } from '../../data/geoAiData';
import { FieldInspectionRecord } from '../../types/geoAi';

export const GeoInspectionMissionView: React.FC = () => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'laptop'>('mobile');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecorded, setVoiceRecorded] = useState<boolean>(false);
  const [missionSubmitted, setMissionSubmitted] = useState<boolean>(false);

  // Inspection form state
  const [checklist, setChecklist] = useState({
    boundaryMarkersVerified: true,
    ownerPresent: true,
    landmarkMatched: true,
    photoCaptured: true,
    encroachmentConfirmed: true,
  });

  const [remarks, setRemarks] = useState(
    'Ground inspection conducted in presence of panchas. Identified 320 sqm RCC godown encroachment on PWD road corridor.'
  );

  const mockInspection = MOCK_INSPECTIONS[0];

  const handleSubmitMission = (e: React.FormEvent) => {
    e.preventDefault();
    setMissionSubmitted(true);
    setTimeout(() => {
      setMissionSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Device Toggle */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-bold rounded">
              Ground Truthing Simulator
            </span>
            <span className="text-xs text-gray-500 font-mono">Mission: {mockInspection.inspectionCode}</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>Geo Inspection Mission & Field Inspector App</span>
            <span className="text-sm font-normal text-gray-600">• Talathi Saja #3, Wagholi</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Simulates the field surveyor mobile ground-truthing workflow with satellite GPS lock, camera capture, and offline synchronization.
          </p>
        </div>

        {/* Viewport Device Switcher */}
        <div className="flex items-center gap-2 bg-[#F5F7FA] p-1.5 rounded-lg border border-[#D8DEE8]">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              deviceMode === 'mobile' ? 'bg-[#123A78] text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Surveyor View</span>
          </button>
          <button
            onClick={() => setDeviceMode('laptop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              deviceMode === 'laptop' ? 'bg-[#123A78] text-white shadow-2xs' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop Officer Terminal</span>
          </button>
        </div>
      </div>

      {/* 2. Main Simulator Display */}
      {deviceMode === 'mobile' ? (
        /* Mobile Smartphone Viewport Simulator */
        <div className="flex justify-center">
          <div className="w-full max-w-[390px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800">
            {/* Phone Screen Container */}
            <div className="w-full bg-white rounded-[28px] overflow-hidden flex flex-col h-[740px]">
              {/* Phone Status Bar */}
              <div className="bg-[#123A78] text-white px-5 py-2 flex justify-between items-center text-[11px] font-mono">
                <span>11:45 AM</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className="flex items-center gap-1 hover:opacity-80"
                    title="Click to simulate offline / online"
                  >
                    {isOnline ? (
                      <span className="flex items-center gap-1 text-emerald-300 font-sans text-[10px]">
                        <Wifi className="w-3 h-3" /> Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-300 font-sans text-[10px]">
                        <WifiOff className="w-3 h-3" /> Offline Queue
                      </span>
                    )}
                  </button>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile App Navigation Header */}
              <div className="bg-[#123A78] text-white px-4 pb-3 pt-1 border-b border-blue-900">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">
                      BhoomiSetu GeoField
                    </span>
                    <h2 className="text-sm font-bold">Survey #{mockInspection.surveyNumber} Verification</h2>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    RT
                  </div>
                </div>
              </div>

              {/* Scrollable Mobile Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {/* GPS Precision HUD Card */}
                <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-2.5 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-1 font-sans font-semibold text-[#123A78]">
                      <MapPin className="w-3.5 h-3.5" /> GPS Lock:
                    </span>
                    <span className="text-[#0B7A3B] font-bold">2.1m (IRNSS NavIC)</span>
                  </div>
                  <div className="text-gray-600">
                    Lat: {mockInspection.gpsCoordinates.lat}° N • Lng: {mockInspection.gpsCoordinates.lng}° E
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Compass className="w-3.5 h-3.5 text-amber-600" /> Bearing:
                    </span>
                    <span className="font-bold text-gray-800">48.5° NE</span>
                  </div>
                </div>

                {/* Geotagged Camera Capture Preview */}
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Geo-Tagged Field Photo:</label>
                  <div className="relative rounded-lg overflow-hidden border border-[#D8DEE8] bg-slate-100">
                    <img
                      src={mockInspection.geoPhotos[0].url}
                      alt="Field inspection"
                      className="w-full h-36 object-cover"
                    />
                    {/* Timestamp & GPS Watermark */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white p-1.5 text-[9px] font-mono leading-tight">
                      <div>Survey #{mockInspection.surveyNumber} • Wagholi Haveli</div>
                      <div>GPS: 18.5801° N, 73.9849° E • Acc: 2.1m</div>
                      <div className="text-amber-300">2026-02-24 11:42:15 IST • Talathi R.K. Thorat</div>
                    </div>
                  </div>
                </div>

                {/* 5-Point Mandatory Checklist */}
                <div className="bg-white border border-[#D8DEE8] rounded-lg p-3 space-y-2">
                  <div className="font-bold text-[#123A78] text-[11px] uppercase tracking-wide">
                    Mandatory Ground Checklist
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      checked={checklist.boundaryMarkersVerified}
                      onChange={(e) => setChecklist({ ...checklist, boundaryMarkersVerified: e.target.checked })}
                      className="w-4 h-4 accent-[#123A78]"
                    />
                    <span>1. Boundary stones & pillars intact</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      checked={checklist.ownerPresent}
                      onChange={(e) => setChecklist({ ...checklist, ownerPresent: e.target.checked })}
                      className="w-4 h-4 accent-[#123A78]"
                    />
                    <span>2. Registered titleholder/representative present</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      checked={checklist.landmarkMatched}
                      onChange={(e) => setChecklist({ ...checklist, landmarkMatched: e.target.checked })}
                      className="w-4 h-4 accent-[#123A78]"
                    />
                    <span>3. Physical landmarks match cadastral sheet</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      checked={checklist.photoCaptured}
                      onChange={(e) => setChecklist({ ...checklist, photoCaptured: e.target.checked })}
                      className="w-4 h-4 accent-[#123A78]"
                    />
                    <span>4. Geotagged photograph captured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#B42318] font-semibold">
                    <input
                      type="checkbox"
                      checked={checklist.encroachmentConfirmed}
                      onChange={(e) => setChecklist({ ...checklist, encroachmentConfirmed: e.target.checked })}
                      className="w-4 h-4 accent-[#B42318]"
                    />
                    <span>5. Confirm spatial encroachment presence</span>
                  </label>
                </div>

                {/* Voice Note Recording Simulator */}
                <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-2.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-gray-800">Oral Panchnama / Voice Note:</span>
                    {voiceRecorded && (
                      <span className="text-[10px] text-[#0B7A3B] font-bold">Recorded (38s)</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsRecordingVoice(!isRecordingVoice);
                      if (!isRecordingVoice) {
                        setTimeout(() => {
                          setIsRecordingVoice(false);
                          setVoiceRecorded(true);
                        }, 2500);
                      }
                    }}
                    className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                      isRecordingVoice
                        ? 'bg-red-600 text-white animate-pulse'
                        : voiceRecorded
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white border border-[#D8DEE8] text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>
                      {isRecordingVoice
                        ? 'Recording Panchnama Audio...'
                        : voiceRecorded
                        ? 'Voice Note Attached (Tap to Re-record)'
                        : 'Tap to Record Voice Panchnama'}
                    </span>
                  </button>
                </div>

                {/* Remarks Field */}
                <div>
                  <label className="font-semibold text-gray-800 block mb-1">Talathi Field Remarks:</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-2 bg-white border border-[#D8DEE8] rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-[#123A78]"
                  />
                </div>

                {/* Submit Ground Truth Button */}
                <button
                  onClick={handleSubmitMission}
                  className="w-full py-2.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold rounded shadow-md text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit Inspection to Land DNA</span>
                </button>

                {missionSubmitted && (
                  <div className="p-2.5 bg-[#D1FADF] border border-[#6CE9A6] text-[#0B7A3B] font-bold rounded text-center text-xs animate-fade-in">
                    ✓ Mission Synchronized with Central Server!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Laptop Desktop Terminal View */
        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8DEE8] mb-4">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                District Revenue Inspector Registry
              </div>
              <h3 className="text-base font-bold text-[#123A78]">
                Ground Truthing Inspection Ledger: Mission #{mockInspection.inspectionCode}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#D1FADF] text-[#0B7A3B] text-xs font-bold">
              STATUS: {mockInspection.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="bg-[#F5F7FA] p-3 rounded border border-[#D8DEE8] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Inspecting Officer:</span>
                  <span className="font-bold text-gray-900">{mockInspection.inspectorName} ({mockInspection.inspectorDesignation})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inspection Date:</span>
                  <span className="font-semibold text-gray-900">{mockInspection.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Survey Coordinates:</span>
                  <span className="font-mono text-gray-900">{mockInspection.gpsCoordinates.lat}° N, {mockInspection.gpsCoordinates.lng}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NavIC Accuracy:</span>
                  <span className="font-bold text-[#0B7A3B]">± {mockInspection.gpsCoordinates.accuracyM} meters</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Official Finding Remarks:</h4>
                <p className="p-3 bg-white border border-[#D8DEE8] rounded leading-relaxed text-gray-700">
                  {mockInspection.remarks}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Geotagged Evidence Reel:</h4>
              <div className="grid grid-cols-2 gap-2">
                {mockInspection.geoPhotos.map((photo, i) => (
                  <div key={i} className="border border-[#D8DEE8] rounded overflow-hidden">
                    <img src={photo.url} alt={photo.caption} className="w-full h-28 object-cover" />
                    <div className="p-1.5 bg-gray-50 text-[10px] text-gray-600 line-clamp-2">
                      {photo.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
