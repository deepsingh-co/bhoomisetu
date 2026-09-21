import React, { useState } from 'react';
import { NationalStateItem } from '../../types/nationalAdmin';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Search,
  ChevronRight,
  BarChart3,
  Globe2,
  Filter,
} from 'lucide-react';

interface IndiaInteractiveGisMapProps {
  states: NationalStateItem[];
  onSelectState: (stateCode: string) => void;
  selectedStateCode?: string;
}

// Approximate SVG centroid coordinates for Indian states on an 800x850 viewport
const STATE_POSITIONS: Record<
  string,
  { cx: number; cy: number; width: number; height: number; pathD?: string }
> = {
  JK: { cx: 280, cy: 90, width: 80, height: 70 },
  HP: { cx: 310, cy: 155, width: 60, height: 50 },
  PB: { cx: 270, cy: 190, width: 60, height: 50 },
  HR: { cx: 300, cy: 225, width: 50, height: 45 },
  DL: { cx: 315, cy: 240, width: 25, height: 25 },
  UK: { cx: 360, cy: 195, width: 60, height: 50 },
  RJ: { cx: 210, cy: 280, width: 130, height: 110 },
  UP: { cx: 400, cy: 285, width: 130, height: 95 },
  BR: { cx: 540, cy: 330, width: 90, height: 70 },
  SK: { cx: 620, cy: 265, width: 35, height: 35 },
  AR: { cx: 740, cy: 250, width: 70, height: 55 },
  AS: { cx: 700, cy: 315, width: 85, height: 50 },
  NL: { cx: 770, cy: 310, width: 35, height: 35 },
  MN: { cx: 765, cy: 350, width: 35, height: 35 },
  MZ: { cx: 745, cy: 395, width: 35, height: 45 },
  TR: { cx: 710, cy: 390, width: 35, height: 35 },
  ML: { cx: 680, cy: 345, width: 45, height: 30 },
  WB: { cx: 600, cy: 395, width: 70, height: 90 },
  JH: { cx: 530, cy: 390, width: 75, height: 65 },
  OD: { cx: 520, cy: 475, width: 85, height: 80 },
  CG: { cx: 450, cy: 440, width: 75, height: 95 },
  MP: { cx: 345, cy: 385, width: 130, height: 100 },
  GJ: { cx: 160, cy: 395, width: 110, height: 90 },
  MH: { cx: 280, cy: 510, width: 135, height: 110 },
  GA: { cx: 225, cy: 625, width: 25, height: 25 },
  KA: { cx: 275, cy: 640, width: 95, height: 120 },
  TS: { cx: 375, cy: 545, width: 85, height: 80 },
  AP: { cx: 395, cy: 640, width: 95, height: 110 },
  TN: { cx: 340, cy: 750, width: 90, height: 110 },
  KL: { cx: 275, cy: 755, width: 50, height: 100 },
};

export const IndiaInteractiveGisMap: React.FC<IndiaInteractiveGisMapProps> = ({
  states,
  onSelectState,
  selectedStateCode,
}) => {
  const [metric, setMetric] = useState<'verification' | 'fraud' | 'disputes' | 'satellite'>('verification');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredState, setHoveredState] = useState<NationalStateItem | null>(null);

  const filteredStates = states.filter((st) => {
    const matchesZone = zoneFilter === 'ALL' || st.zone === zoneFilter;
    const matchesSearch =
      !searchQuery ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const selectedState = states.find((s) => s.code === selectedStateCode);

  const getStateFill = (st?: NationalStateItem) => {
    if (!st) return '#E2E8F0';
    if (metric === 'verification') {
      if (st.verificationPercentage >= 94) return '#0B7A3B'; // Government Green
      if (st.verificationPercentage >= 88) return '#1B6CA8'; // Deep Gov Blue
      if (st.verificationPercentage >= 80) return '#D97706'; // Amber / Orange
      return '#DC2626'; // Alert Red
    }
    if (metric === 'fraud') {
      if (st.fraudCasesCount > 150) return '#B91C1C';
      if (st.fraudCasesCount > 70) return '#D97706';
      return '#0B7A3B';
    }
    if (metric === 'disputes') {
      if (st.activeDisputesCount > 800) return '#991B1B';
      if (st.activeDisputesCount > 400) return '#D97706';
      return '#1B6CA8';
    }
    // satellite alerts
    if (st.satelliteAlertsCount > 50) return '#C2410C';
    if (st.satelliteAlertsCount > 25) return '#D97706';
    return '#0B7A3B';
  };

  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-[#123A78]" />
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              ISRO Bhuvan & Survey of India GIS Cadastral Map
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Real-time National Land Records Digital Status & Cadastral Verification Health
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-white border border-gray-300 rounded p-0.5 text-xs font-semibold">
            <button
              onClick={() => setMetric('verification')}
              className={`px-3 py-1.5 rounded transition ${
                metric === 'verification' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Digitization %
            </button>
            <button
              onClick={() => setMetric('fraud')}
              className={`px-3 py-1.5 rounded transition ${
                metric === 'fraud' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Fraud Alerts
            </button>
            <button
              onClick={() => setMetric('disputes')}
              className={`px-3 py-1.5 rounded transition ${
                metric === 'disputes' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Disputes
            </button>
            <button
              onClick={() => setMetric('satellite')}
              className={`px-3 py-1.5 rounded transition ${
                metric === 'satellite' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Satellite Alerts
            </button>
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-300 px-2.5 py-1 rounded">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-gray-700">Zone:</span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-transparent font-medium text-gray-800 outline-none cursor-pointer"
            >
              <option value="ALL">All India (National)</option>
              <option value="NORTH">North Zone</option>
              <option value="SOUTH">South Zone</option>
              <option value="WEST">West Zone</option>
              <option value="EAST">East Zone</option>
              <option value="CENTRAL">Central Zone</option>
              <option value="NORTH_EAST">North East</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search State..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#123A78] w-36"
            />
          </div>
        </div>
      </div>

      {/* Map Body & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left SVG Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 p-4 relative flex flex-col items-center justify-center bg-gray-50/50 border-r border-gray-200">
          <div className="w-full max-w-[700px] h-[520px] relative">
            <svg
              viewBox="80 30 740 820"
              className="w-full h-full drop-shadow-sm select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="govShadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* India Background Outline Watermark */}
              <path
                d="M 280,70 L 320,130 L 370,180 L 410,230 L 520,250 L 610,240 L 750,220 L 800,280 L 780,360 L 720,410 L 630,410 L 570,490 L 510,540 L 460,650 L 370,780 L 320,830 L 260,770 L 230,640 L 260,530 L 170,440 L 140,360 L 190,260 L 250,170 Z"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* Render State Polygons / Nodes */}
              {Object.entries(STATE_POSITIONS).map(([code, pos]) => {
                const stateData = states.find((s) => s.code === code);
                const isSelected = selectedStateCode === code;
                const isHovered = hoveredState?.code === code;
                const fillColor = getStateFill(stateData);

                return (
                  <g
                    key={code}
                    onClick={() => onSelectState(code)}
                    onMouseEnter={() => stateData && setHoveredState(stateData)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="cursor-pointer transition duration-150"
                  >
                    {/* State Rect Card Container */}
                    <rect
                      x={pos.cx - pos.width / 2}
                      y={pos.cy - pos.height / 2}
                      width={pos.width}
                      height={pos.height}
                      rx="6"
                      fill={fillColor}
                      stroke={isSelected ? '#0F172A' : isHovered ? '#1E293B' : '#FFFFFF'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                      filter="url(#govShadow)"
                      className="transition-all hover:opacity-95"
                    />

                    {/* State Code Label */}
                    <text
                      x={pos.cx}
                      y={pos.cy - (pos.height > 40 ? 4 : 0)}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={pos.width < 40 ? '9' : '11'}
                      fontWeight="700"
                      className="pointer-events-none tracking-wider"
                    >
                      {code}
                    </text>

                    {/* State Metric Badge underneath */}
                    {stateData && pos.height > 45 && (
                      <text
                        x={pos.cx}
                        y={pos.cy + 13}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="600"
                        className="pointer-events-none opacity-90"
                      >
                        {metric === 'verification'
                          ? `${stateData.verificationPercentage}%`
                          : metric === 'fraud'
                          ? `${stateData.fraudCasesCount} F`
                          : metric === 'disputes'
                          ? `${stateData.activeDisputesCount} D`
                          : `${stateData.satelliteAlertsCount} Sat`}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredState && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-300 rounded p-3 shadow-md pointer-events-none z-10 w-64 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 mb-2">
                  <span className="font-bold text-gray-900 text-sm">{hoveredState.name}</span>
                  <span className="px-1.5 py-0.5 font-bold text-[10px] rounded bg-blue-100 text-[#123A78]">
                    {hoveredState.code}
                  </span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Cadastral Parcels:</span>
                    <span className="font-semibold text-gray-900">
                      {(hoveredState.totalParcels / 100000).toFixed(1)} Lakh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Digitization & Verified:</span>
                    <span className="font-bold text-[#0B7A3B]">{hoveredState.verificationPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fraud Forensic Flags:</span>
                    <span className="font-semibold text-red-600">{hoveredState.fraudCasesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Mutations:</span>
                    <span className="font-semibold text-amber-600">
                      {(hoveredState.pendingParcels / 100000).toFixed(1)} Lakh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collector Average Score:</span>
                    <span className="font-semibold text-[#123A78]">{hoveredState.collectorAvgScore}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Color Legend */}
          <div className="mt-2 w-full flex items-center justify-center gap-6 text-xs text-gray-600 border-t border-gray-200 pt-3">
            <span className="font-bold text-gray-700">National Thresholds:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#0B7A3B]" />
              <span>Verified (&gt;94%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#1B6CA8]" />
              <span>Standard (88% - 93%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#D97706]" />
              <span>Review Needed (80% - 87%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#DC2626]" />
              <span>Critical Action (&lt;80%)</span>
            </div>
          </div>
        </div>

        {/* Right Inspector & Leaderboard (4 cols) */}
        <div className="lg:col-span-4 p-4 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#123A78]" />
                State Cadastre Inspection
              </h4>
              <span className="text-xs font-semibold text-gray-500">{filteredStates.length} States</span>
            </div>

            {selectedState ? (
              <div className="bg-blue-50/60 border border-blue-200 rounded p-4 mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-base font-extrabold text-gray-900">{selectedState.name}</h5>
                    <p className="text-xs text-gray-600">
                      Capital: {selectedState.capital} • Zone: {selectedState.zone}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      selectedState.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : selectedState.status === 'UNDER_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedState.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-3 mb-3">
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-gray-500 block">Total Districts</span>
                    <span className="text-sm font-bold text-gray-900">{selectedState.totalDistricts}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-gray-500 block">Digitization</span>
                    <span className="text-sm font-bold text-[#0B7A3B]">
                      {selectedState.verificationPercentage}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-gray-500 block">Total Parcels</span>
                    <span className="text-sm font-bold text-gray-900">
                      {(selectedState.totalParcels / 1000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-100">
                    <span className="text-gray-500 block">Fraud Cases</span>
                    <span className="text-sm font-bold text-red-600">{selectedState.fraudCasesCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectState(selectedState.code)}
                  className="w-full flex items-center justify-center gap-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white py-2 px-3 rounded text-xs font-bold transition shadow-sm"
                >
                  Launch {selectedState.name} State Console
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-xs text-gray-500 mb-4">
                Click any state polygon or button on the map to inspect district metrics, cadastral queues, and fraud telemetry.
              </div>
            )}

            {/* Quick State List / Leaderboard */}
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              <span className="text-xs font-bold text-gray-700 block mb-1">State Cadastral Performance</span>
              {filteredStates.map((st) => (
                <div
                  key={st.code}
                  onClick={() => onSelectState(st.code)}
                  className={`p-2 rounded border text-xs flex items-center justify-between cursor-pointer transition ${
                    selectedStateCode === st.code
                      ? 'border-[#123A78] bg-blue-50 font-bold'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 font-bold text-gray-600">{st.code}</span>
                    <span className="text-gray-900 font-medium">{st.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B7A3B]">{st.verificationPercentage}%</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600 text-[11px]">{st.fraudCasesCount} Fraud</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-500 flex justify-between items-center">
            <span>ISRO Cartosat-3 WMS Layer v4.0</span>
            <span className="font-semibold text-[#123A78]">Survey of India 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
