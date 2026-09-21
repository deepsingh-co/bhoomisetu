import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Compass,
  Download,
  CheckCircle2,
  Eye,
  Crosshair,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenMiniGisMapViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CitizenMiniGisMapView: React.FC<CitizenMiniGisMapViewProps> = ({
  onNavigate,
  language,
}) => {
  const [selectedParcel, setSelectedParcel] = useState('142/1');
  const [activeLayer, setActiveLayer] = useState<'HYBRID' | 'CADASTRAL' | 'SATELLITE'>('HYBRID');
  const [showEncroachmentBuffer, setShowEncroachmentBuffer] = useState(true);
  const [gpsSimulated, setGpsSimulated] = useState(false);

  const parcelsList = [
    {
      id: '142/1',
      uid: 'IN-MH-PUN-HAV-2024-00142-A',
      name: 'Survey 142/1 (Wagholi, Pune)',
      area: '1.84 Ha',
      status: 'VERIFIED',
      score: 98,
      lat: 18.5793,
      lng: 73.9812,
    },
    {
      id: '142/2',
      uid: 'IN-MH-PUN-HAV-2024-00142-C',
      name: 'Survey 142/2 (Wagholi, Pune)',
      area: '0.92 Ha',
      status: 'VERIFIED',
      score: 94,
      lat: 18.5799,
      lng: 73.9819,
    },
    {
      id: '88/4',
      uid: 'IN-MH-PUN-BAR-2023-00088-B',
      name: 'Survey 88/4 (Malegaon, Baramati)',
      area: '2.10 Ha',
      status: 'UNDER_REVIEW',
      score: 68,
      lat: 18.1512,
      lng: 74.5781,
    },
  ];

  const current = parcelsList.find((p) => p.id === selectedParcel) || parcelsList[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            SVAMITVA Drone & Cartosat-3 High Resolution
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen Cadastral GIS Map Viewer
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Centimeter-accurate parcel boundaries verified against Survey of India national coordinates and state revenue maps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGpsSimulated(true);
              setTimeout(() => setGpsSimulated(false), 3000);
            }}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Crosshair className="w-4 h-4 text-[#0B7A3B]" />
            {gpsSimulated ? 'GPS Locked (RTK ±2cm)' : 'Locate My Field GPS'}
          </button>
          <button
            onClick={() =>
              alert(`Downloading high-resolution 1:500 Cadastral Map for Survey ${current.id}`)
            }
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Map (PDF)
          </button>
        </div>
      </div>

      {/* Map Studio Canvas */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-xs flex flex-col lg:flex-row">
        {/* Left Map Display Box */}
        <div className="flex-1 relative bg-slate-900 min-h-[480px] p-6 text-white flex flex-col justify-between overflow-hidden">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between z-10">
            {/* Layer toggles */}
            <div className="flex bg-black/60 backdrop-blur-xs p-1 rounded-lg text-xs font-semibold border border-white/10">
              <button
                onClick={() => setActiveLayer('HYBRID')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeLayer === 'HYBRID' ? 'bg-[#123A78] text-white' : 'text-gray-300'
                }`}
              >
                Cadastral Hybrid
              </button>
              <button
                onClick={() => setActiveLayer('SATELLITE')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeLayer === 'SATELLITE' ? 'bg-[#123A78] text-white' : 'text-gray-300'
                }`}
              >
                Cartosat-3 Satellite
              </button>
              <button
                onClick={() => setActiveLayer('CADASTRAL')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeLayer === 'CADASTRAL' ? 'bg-[#123A78] text-white' : 'text-gray-300'
                }`}
              >
                Revenue Vector
              </button>
            </div>

            {/* Buffer layer toggle */}
            <label className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-xs text-gray-200 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={showEncroachmentBuffer}
                onChange={(e) => setShowEncroachmentBuffer(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span>50m Canal Buffer</span>
            </label>
          </div>

          {/* Central Interactive Cadastral Map Graphic */}
          <div className="my-auto flex items-center justify-center relative">
            {/* Compass Rose */}
            <div className="absolute top-0 right-4 p-2 bg-black/50 rounded-full border border-white/10 text-center text-[10px] font-mono">
              <Compass className="w-5 h-5 text-emerald-400 mx-auto animate-spin-slow" />
              <span>N</span>
            </div>

            {/* Simulated Parcel Geometry Polygon */}
            <div className="border-4 border-emerald-400 bg-emerald-500/25 p-12 rounded-2xl relative shadow-2xl backdrop-blur-2xs text-center max-w-sm w-full transition-all">
              <div className="absolute -top-3 left-4 bg-[#0B7A3B] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Gat / Survey {current.id}
              </div>

              <div className="space-y-1">
                <span className="text-xl font-black text-white block">
                  {current.area}
                </span>
                <span className="text-xs text-emerald-200 block">
                  Drip Irrigation Farmland • Wagholi
                </span>
                <span className="text-[11px] font-mono text-gray-300 block">
                  Lat: {current.lat}° N | Lng: {current.lng}° E
                </span>
              </div>

              {/* Buffer Zone Ring */}
              {showEncroachmentBuffer && (
                <div className="mt-4 pt-3 border-t border-dashed border-amber-400/80 text-[10px] text-amber-300 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>50m Waterway Buffer: ZERO ENCROACHMENT</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Coordinates & Scale Bar */}
          <div className="flex items-center justify-between text-[11px] text-gray-300 bg-black/60 backdrop-blur-xs p-2.5 rounded-lg border border-white/10 z-10">
            <div className="flex items-center gap-3 font-mono">
              <span>Projection: WGS84 / EPSG:4326</span>
              <span>•</span>
              <span>Scale 1:500 (1cm = 5m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-semibold">Live GIS Satellite Synchronized</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar Controls */}
        <div className="w-full lg:w-80 p-5 bg-[#F8FAFC] border-t lg:border-t-0 lg:border-l border-[#D8DEE8] space-y-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Select Linked Holding
          </span>

          <div className="space-y-2">
            {parcelsList.map((p) => {
              const isSelected = selectedParcel === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedParcel(p.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#123A78] shadow-xs'
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{p.name}</h4>
                      <p className="text-[11px] text-gray-500">Area: {p.area}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.score >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.score}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2 text-xs">
            <span className="font-bold text-gray-800 block">Map Feature Legend</span>
            <div className="space-y-1.5 text-gray-600 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
                <span>Green: Verified Parcel Boundary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
                <span>Amber: Pending Revenue Mutation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500 shrink-0" />
                <span>Blue: State Mutha Irrigation Canal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-500 shrink-0" />
                <span>Purple: Public Gram Panchayat Road</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('trust', current.uid)}
            className="w-full bg-[#123A78] hover:bg-[#0e2c5d] text-white py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Trust Audit</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
