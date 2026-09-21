import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Zap,
  Droplets,
  Trees,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Scale,
  Compass,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { MOCK_VILLAGES, MOCK_GEO_PARCELS } from '../../data/geoAiData';
import { VillageTwinData, VillageAmenity } from '../../types/geoAi';

interface VillageDigitalTwinViewProps {
  onSelectParcel: (id: string) => void;
  onNavigateToTimeline?: () => void;
  onNavigateToSatelliteCompare?: () => void;
}

export const VillageDigitalTwinView: React.FC<VillageDigitalTwinViewProps> = ({
  onSelectParcel,
  onNavigateToTimeline,
  onNavigateToSatelliteCompare,
}) => {
  const [selectedVillageId, setSelectedVillageId] = useState<string>('v-wagholi-001');
  const [activeHeatmap, setActiveHeatmap] = useState<'none' | 'verification' | 'mutation' | 'fraud' | 'dispute'>('verification');
  const [selectedAmenity, setSelectedAmenity] = useState<VillageAmenity | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('IN-MH-PUN-BAR-2023-00088-B');

  const currentVillage: VillageTwinData = MOCK_VILLAGES.find((v) => v.id === selectedVillageId) || MOCK_VILLAGES[0];
  const activeParcel = MOCK_GEO_PARCELS.find((p) => p.id === selectedParcelId) || MOCK_GEO_PARCELS[0];

  const getAmenityIcon = (type: string) => {
    switch (type) {
      case 'PANCHAYAT_OFFICE':
        return <Building2 className="w-4 h-4 text-[#123A78]" />;
      case 'SCHOOL':
        return <GraduationCap className="w-4 h-4 text-[#0B7A3B]" />;
      case 'ELECTRICITY':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'WATER_BODY':
      case 'CANAL':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'FOREST':
        return <Trees className="w-4 h-4 text-emerald-700" />;
      case 'ROAD':
        return <Truck className="w-4 h-4 text-slate-700" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Village Banner & Selector */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-bold rounded">
              DILRMP Village Digital Twin
            </span>
            <span className="text-xs text-gray-500 font-mono">Census Code: {currentVillage.censusCode}</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>{currentVillage.villageName}</span>
            <span className="text-sm font-normal text-gray-600">
              • Taluka: {currentVillage.taluka} • District: {currentVillage.district}
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Real-time geospatial synchronization with Survey of India & Maharashtra Land Records Network (e-Mahabhulekh)
          </p>
        </div>

        {/* Village Switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700">Select Village:</label>
          <select
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="px-3 py-1.5 border border-[#D8DEE8] rounded-md text-xs font-semibold text-[#123A78] bg-[#F5F7FA] focus:outline-hidden focus:ring-1 focus:ring-[#123A78]"
          >
            {MOCK_VILLAGES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.villageName} ({v.taluka})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Village High-Level Statutory Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Total Area</div>
          <div className="text-base font-bold text-[#123A78] mt-1">{currentVillage.totalAreaHa} Ha</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Cadastral Survey</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Total Parcels</div>
          <div className="text-base font-bold text-gray-900 mt-1">{currentVillage.totalParcels}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">7/12 Gat Numbers</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Digitized</div>
          <div className="text-base font-bold text-[#0B7A3B] mt-1">{currentVillage.digitizedParcels}</div>
          <div className="text-[10px] text-[#0B7A3B] mt-0.5">
            {((currentVillage.digitizedParcels / currentVillage.totalParcels) * 100).toFixed(1)}% GIS Linked
          </div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">AI Verified</div>
          <div className="text-base font-bold text-[#123A78] mt-1">{currentVillage.verifiedParcels}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Title Clean</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Pending Review</div>
          <div className="text-base font-bold text-[#B26A00] mt-1">{currentVillage.pendingVerification}</div>
          <div className="text-[10px] text-[#B26A00] mt-0.5">With Talathi</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">High Risk</div>
          <div className="text-base font-bold text-[#B42318] mt-1">{currentVillage.highRiskParcels}</div>
          <div className="text-[10px] text-[#B42318] mt-0.5">Encroachments</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Civil Disputes</div>
          <div className="text-base font-bold text-red-700 mt-1">{currentVillage.disputeParcels}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Court Stays</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-3 shadow-xs">
          <div className="text-[11px] text-gray-500 font-medium">Mutation Queue</div>
          <div className="text-base font-bold text-indigo-900 mt-1">{currentVillage.mutationBacklog}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Avg: 9.4 Days</div>
        </div>
      </div>

      {/* 3. Main Digital Twin Map & Interactive Amenity Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive GIS Twin Model & Heatmap Layer Switcher */}
        <div className="lg:col-span-8 bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs flex flex-col">
          {/* Heatmap & View Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D8DEE8] mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#123A78]" />
              <span className="text-xs font-bold text-[#123A78] uppercase tracking-wide">
                Village Cadastral Infrastructure & Heatmap Layer
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 font-medium mr-1">Heatmap:</span>
              <button
                onClick={() => setActiveHeatmap('verification')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  activeHeatmap === 'verification' ? 'bg-[#123A78] text-white' : 'bg-[#F5F7FA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verification
              </button>
              <button
                onClick={() => setActiveHeatmap('mutation')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  activeHeatmap === 'mutation' ? 'bg-amber-600 text-white' : 'bg-[#F5F7FA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mutation Density
              </button>
              <button
                onClick={() => setActiveHeatmap('fraud')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  activeHeatmap === 'fraud' ? 'bg-red-700 text-white' : 'bg-[#F5F7FA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fraud Flags
              </button>
              <button
                onClick={() => setActiveHeatmap('dispute')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  activeHeatmap === 'dispute' ? 'bg-purple-700 text-white' : 'bg-[#F5F7FA] text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dispute Hotspots
              </button>
            </div>
          </div>

          {/* Graphical Representation of Village Digital Twin Grid */}
          <div className="relative w-full h-[460px] bg-slate-900 rounded-lg overflow-hidden border border-[#D8DEE8] flex items-center justify-center">
            {/* SVG Visualizer for Village Layout with Parcels & Amenities */}
            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* Background Satellite Texture Simulation */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
                {/* Heatmap Gradients */}
                <radialGradient id="heat-fraud" cx="65%" cy="35%" r="30%">
                  <stop offset="0%" stopColor="#B42318" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#B42318" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-mutation" cx="35%" cy="60%" r="35%">
                  <stop offset="0%" stopColor="#B26A00" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#B26A00" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-verify" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0B7A3B" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0B7A3B" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="800" height="500" fill="#1E293B" />
              <rect width="800" height="500" fill="url(#grid)" />

              {/* Heatmap Overlays */}
              {activeHeatmap === 'fraud' && (
                <rect width="800" height="500" fill="url(#heat-fraud)" pointerEvents="none" />
              )}
              {activeHeatmap === 'mutation' && (
                <rect width="800" height="500" fill="url(#heat-mutation)" pointerEvents="none" />
              )}
              {activeHeatmap === 'verification' && (
                <rect width="800" height="500" fill="url(#heat-verify)" pointerEvents="none" />
              )}

              {/* Natural Water Body: Mutha Right Bank Canal */}
              <path
                d="M 50 120 C 220 140, 480 110, 750 90"
                fill="none"
                stroke="#0284C7"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <text x="350" y="105" fill="#BAE6FD" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Mutha Canal (50m Protected Green Corridor)
              </text>

              {/* Road Network (Highway & Village Arteries) */}
              <path
                d="M 120 450 L 320 280 L 680 200"
                fill="none"
                stroke="#D97706"
                strokeWidth="12"
                strokeDasharray="14 6"
              />
              <text x="160" y="390" fill="#FDE68A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                Pune-Nagar SH-27 Highway (60m ROW)
              </text>

              {/* Reserved Forest Zone Polygon */}
              <polygon
                points="620,40 760,50 780,180 650,160"
                fill="#065F46"
                fillOpacity="0.5"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text x="640" y="100" fill="#A7F3D0" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Reserved Forest #42
              </text>

              {/* Cadastral Parcels Layer */}
              {/* Parcel 1: Sunita Patil */}
              <polygon
                points="180,180 320,190 310,270 170,260"
                fill={selectedParcelId === 'IN-MH-PUN-HAV-2024-00142-A' ? '#0B7A3B' : '#1D5AA6'}
                fillOpacity={selectedParcelId === 'IN-MH-PUN-HAV-2024-00142-A' ? '0.85' : '0.45'}
                stroke={selectedParcelId === 'IN-MH-PUN-HAV-2024-00142-A' ? '#4ADE80' : '#93C5FD'}
                strokeWidth={selectedParcelId === 'IN-MH-PUN-HAV-2024-00142-A' ? '3' : '1.5'}
                className="cursor-pointer transition-all hover:opacity-100"
                onClick={() => {
                  setSelectedParcelId('IN-MH-PUN-HAV-2024-00142-A');
                  onSelectParcel('IN-MH-PUN-HAV-2024-00142-A');
                }}
              />
              <text x="210" y="230" fill="#FFFFFF" fontSize="12" fontWeight="bold" pointerEvents="none">
                Gat 142/2A
              </text>

              {/* Parcel 2: Vikram Shinde (Encroachment Flagged) */}
              <polygon
                points="340,190 480,200 460,300 325,285"
                fill={selectedParcelId === 'IN-MH-PUN-BAR-2023-00088-B' ? '#B42318' : '#DC2626'}
                fillOpacity={selectedParcelId === 'IN-MH-PUN-BAR-2023-00088-B' ? '0.85' : '0.55'}
                stroke={selectedParcelId === 'IN-MH-PUN-BAR-2023-00088-B' ? '#FCA5A5' : '#F87171'}
                strokeWidth={selectedParcelId === 'IN-MH-PUN-BAR-2023-00088-B' ? '3' : '1.5'}
                className="cursor-pointer transition-all hover:opacity-100"
                onClick={() => {
                  setSelectedParcelId('IN-MH-PUN-BAR-2023-00088-B');
                  onSelectParcel('IN-MH-PUN-BAR-2023-00088-B');
                }}
              />
              <text x="365" y="245" fill="#FFFFFF" fontSize="12" fontWeight="bold" pointerEvents="none">
                Gat 88/1B (Flagged)
              </text>

              {/* Parcel 3: Sahyadri Agro */}
              <polygon
                points="220,70 380,80 360,160 200,150"
                fill={selectedParcelId === 'IN-MH-PUN-MUL-2024-00214-0' ? '#D97706' : '#B45309'}
                fillOpacity="0.45"
                stroke="#FCD34D"
                strokeWidth="1.5"
                className="cursor-pointer transition-all hover:opacity-100"
                onClick={() => {
                  setSelectedParcelId('IN-MH-PUN-MUL-2024-00214-0');
                  onSelectParcel('IN-MH-PUN-MUL-2024-00214-0');
                }}
              />
              <text x="250" y="120" fill="#FFFFFF" fontSize="12" fontWeight="bold" pointerEvents="none">
                Gat 214/4 (Agro)
              </text>

              {/* Amenity Markers with Interactive Hotspots */}
              {currentVillage.amenities.map((am) => {
                // Project lat/lng to SVG local space
                const x = 200 + ((am.lng - 73.975) / 0.015) * 450;
                const y = 350 - ((am.lat - 18.575) / 0.015) * 300;

                return (
                  <g
                    key={am.id}
                    transform={`translate(${Math.max(50, Math.min(750, x))}, ${Math.max(40, Math.min(460, y))})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedAmenity(am)}
                  >
                    <circle r="12" fill="#FFFFFF" stroke="#123A78" strokeWidth="2.5" className="transition-transform group-hover:scale-125" />
                    <circle r="5" fill="#123A78" />
                    <text x="16" y="4" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      {am.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Amenity Tooltip */}
            {selectedAmenity && (
              <div className="absolute top-4 left-4 bg-white border border-[#D8DEE8] rounded-lg p-3 shadow-lg max-w-xs text-xs z-10 animate-fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#123A78]">
                    {getAmenityIcon(selectedAmenity.type)}
                    <span>{selectedAmenity.name}</span>
                  </div>
                  <button onClick={() => setSelectedAmenity(null)} className="text-gray-400 hover:text-gray-700 font-bold ml-2">×</button>
                </div>
                <div className="text-gray-600 space-y-1">
                  <div><b>Type:</b> {selectedAmenity.type.replace('_', ' ')}</div>
                  <div><b>Statutory Status:</b> <span className="text-[#0B7A3B] font-semibold">{selectedAmenity.status}</span></div>
                  <div><b>Coordinates:</b> {selectedAmenity.lat}° N, {selectedAmenity.lng}° E</div>
                </div>
              </div>
            )}
          </div>

          {/* Heatmap Legend */}
          <div className="mt-3 pt-2 border-t border-[#D8DEE8] flex flex-wrap items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-800">Visual Key:</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#0B7A3B] rounded-xs inline-block" /> Verified Title
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#B42318] rounded-xs inline-block" /> Encroachment Hold
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#0284C7] rounded-xs inline-block" /> Waterbody Buffer (50m)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#D97706] rounded-xs inline-block" /> Road ROW
              </span>
            </div>
            <div className="text-[11px] text-gray-500">Click any parcel or amenity icon to inspect</div>
          </div>
        </div>

        {/* Right Column: Selected Parcel Intelligence & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D8DEE8] mb-3">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Active Parcel Dossier</span>
                <h3 className="text-base font-bold text-[#123A78]">
                  Survey #{activeParcel.properties.surveyNumber} • {activeParcel.properties.village}
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                activeParcel.properties.verificationStatus === 'VERIFIED' ? 'bg-[#D1FADF] text-[#0B7A3B]' : 'bg-[#FEE4E2] text-[#B42318]'
              }`}>
                {activeParcel.properties.verificationStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">ULPIN (Bhu-Aadhaar):</span>
                <span className="font-mono font-semibold text-gray-900">{activeParcel.properties.parcelUid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Registered Owner:</span>
                <span className="font-semibold text-gray-900">{activeParcel.properties.owner}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Cadastral Survey Area:</span>
                <span className="font-semibold">{activeParcel.properties.cadastralAreaHa} Hectares</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Observed Satellite Area:</span>
                <span className={`font-semibold ${activeParcel.properties.observedAreaHa !== activeParcel.properties.cadastralAreaHa ? 'text-[#B42318]' : ''}`}>
                  {activeParcel.properties.observedAreaHa} Hectares
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Present Land Use:</span>
                <span className="font-semibold">{activeParcel.properties.landUse}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Citizen Trust Score:</span>
                <span className="font-bold text-[#123A78] text-sm">{activeParcel.properties.trustScore}%</span>
              </div>

              {activeParcel.properties.hasEncroachment && (
                <div className="p-2.5 bg-[#FEE4E2] border border-[#FDA29B] rounded text-xs text-[#B42318] font-medium flex items-start gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Encroachment Violation:</div>
                    <div>{activeParcel.properties.encroachmentType}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-4 pt-3 border-t border-[#D8DEE8] space-y-2">
              {onNavigateToTimeline && (
                <button
                  onClick={onNavigateToTimeline}
                  className="w-full py-2 bg-[#F5F7FA] hover:bg-[#E2E8F0] border border-[#D8DEE8] text-[#123A78] text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span>Inspect Historical 1950-2026 Timeline &rarr;</span>
                </button>
              )}

              {onNavigateToSatelliteCompare && (
                <button
                  onClick={onNavigateToSatelliteCompare}
                  className="w-full py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Launch Satellite Change Comparison &rarr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Village Public Amenities List */}
          <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
            <h4 className="text-xs font-bold text-[#123A78] uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#123A78]" />
              <span>Public Infrastructure Assets ({currentVillage.amenities.length})</span>
            </h4>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 text-xs">
              {currentVillage.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  onClick={() => setSelectedAmenity(amenity)}
                  className="p-2 bg-[#F5F7FA] hover:bg-gray-100 rounded border border-[#D8DEE8] cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {getAmenityIcon(amenity.type)}
                    <div>
                      <div className="font-semibold text-gray-900">{amenity.name}</div>
                      <div className="text-[10px] text-gray-500">{amenity.status}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
