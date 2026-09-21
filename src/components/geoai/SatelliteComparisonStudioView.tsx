import React, { useState } from 'react';
import {
  Layers,
  Sliders,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Printer,
  Info,
} from 'lucide-react';
import { MOCK_SATELLITE_COMPARISON } from '../../data/geoAiData';

export const SatelliteComparisonStudioView: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showParcelBoundary, setShowParcelBoundary] = useState<boolean>(true);
  const [showDifferenceOverlay, setShowDifferenceOverlay] = useState<boolean>(true);
  const [baselineYear, setBaselineYear] = useState<number>(2018);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const data = MOCK_SATELLITE_COMPARISON;

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleGeneratePdfReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-bold rounded">
              ISRO Bhuvan Multi-Temporal Studio
            </span>
            <span className="text-xs text-gray-500 font-mono">Sensors: LISS-IV & Cartosat-3</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>AI Land Use Change & Satellite Swipe Comparison</span>
            <span className="text-sm font-normal text-gray-600">• Survey #88/1B (Wagholi)</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            High-precision temporal change detection analyzing agricultural conversions, canopy loss, and unauthorized construction.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGeneratePdfReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate LULC Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. Temporal Metadata & Change Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Net Structural Shift</span>
            <TrendingUp className="w-4 h-4 text-[#B42318]" />
          </div>
          <div className="text-xl font-bold text-[#B42318]">+{data.changeMetrics.netChangePct}% Built-up</div>
          <div className="text-[11px] text-gray-600 mt-1">
            +{data.changeMetrics.builtUpIncreaseSqm} sqm newly sealed ground
          </div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Vegetation Depletion</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700">-{data.changeMetrics.vegetationDepletionSqm} sqm</div>
          <div className="text-[11px] text-gray-600 mt-1">Agricultural crop cover cleared</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>AI Classifier Confidence</span>
            <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          </div>
          <div className="text-xl font-bold text-[#0B7A3B]">{data.changeMetrics.aiConfidence}%</div>
          <div className="text-[11px] text-gray-600 mt-1">{data.changeMetrics.detectionModel.split(' ')[0]}</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Regulatory Flag</span>
            <AlertTriangle className="w-4 h-4 text-[#B42318]" />
          </div>
          <div className="text-sm font-bold text-[#B42318] uppercase mt-1">
            Unauthorized Plotted Shed
          </div>
          <div className="text-[11px] text-gray-600 mt-1">Non-Agricultural (NA) order absent</div>
        </div>
      </div>

      {/* 3. Interactive Split Comparison Studio with Swipe Slider */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
        {/* Studio Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D8DEE8] mb-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-[#123A78]" />
              <span>Compare Baseline:</span>
              <select
                value={baselineYear}
                onChange={(e) => setBaselineYear(Number(e.target.value))}
                className="px-2 py-1 bg-[#F5F7FA] border border-[#D8DEE8] rounded font-bold text-[#123A78]"
              >
                <option value={2018}>2018 (LISS-IV 5.8m)</option>
                <option value={2020}>2020 (Sentinel-2 10m)</option>
              </select>
            </div>

            <div className="flex items-center gap-1 font-semibold text-gray-700">
              <span>with Current:</span>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="px-2 py-1 bg-[#F5F7FA] border border-[#D8DEE8] rounded font-bold text-[#123A78]"
              >
                <option value={2026}>2026 (Cartosat-3 0.28m PAN)</option>
                <option value={2024}>2024 (Drone SVAMITVA 5cm)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={showParcelBoundary}
                onChange={(e) => setShowParcelBoundary(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#123A78]"
              />
              <span>Cadastral Boundary</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-[#B42318] font-semibold">
              <input
                type="checkbox"
                checked={showDifferenceOverlay}
                onChange={(e) => setShowDifferenceOverlay(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#B42318]"
              />
              <span>Highlight Violations</span>
            </label>
          </div>
        </div>

        {/* Dual Layer Interactive Slider Canvas */}
        <div
          className="relative w-full h-[450px] bg-slate-900 rounded-lg overflow-hidden border border-[#D8DEE8] select-none cursor-ew-resize"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleSliderMove}
        >
          {/* Background Layer: 2026 Cartosat-3 Imagery */}
          <div className="absolute inset-0 w-full h-full bg-[#1E293B]">
            {/* Visual simulation of 2026 high-res satellite image */}
            <div className="w-full h-full relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')` }}>
              <div className="absolute inset-0 bg-black/20" />

              {/* Difference Heatmap Overlay (Red Highlighting New Construction) */}
              {showDifferenceOverlay && (
                <div className="absolute top-[35%] right-[28%] w-48 h-36 border-2 border-red-500 bg-red-600/40 rounded-sm flex items-center justify-center animate-pulse">
                  <span className="text-[10px] bg-[#B42318] text-white px-2 py-0.5 font-bold rounded">
                    +3,240 sqm Commercial Shed
                  </span>
                </div>
              )}

              {/* 2026 Watermark Badge */}
              <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1.5 rounded-md text-xs font-mono font-bold border border-white/20">
                2026: ISRO Cartosat-3 (0.28m)
              </div>
            </div>
          </div>

          {/* Foreground Clipped Layer: 2018 LISS-IV Imagery */}
          <div
            className="absolute inset-0 h-full overflow-hidden border-r-2 border-white pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                width: '100%',
                minWidth: '800px',
                backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`,
                filter: 'brightness(0.95) saturate(1.2)',
              }}
            >
              {/* 2018 Watermark Badge */}
              <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1.5 rounded-md text-xs font-mono font-bold border border-white/20">
                2018: LISS-IV Baseline (5.8m)
              </div>
            </div>
          </div>

          {/* Divider Handle Slider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-8 h-8 bg-[#123A78] text-white rounded-full border-2 border-white shadow-md flex items-center justify-center -ml-3.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5 -ml-1.5" />
            </div>
          </div>

          {/* Instructions Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-[11px] font-semibold shadow-xs">
            Drag slider left or right to compare temporal satellite snapshots
          </div>
        </div>

        {/* AI Synthesis Summary Card */}
        <div className="mt-4 p-4 bg-[#F5F7FA] border border-[#D8DEE8] rounded-[10px]">
          <div className="flex items-center gap-2 font-bold text-[#123A78] text-xs uppercase tracking-wide mb-1">
            <Sparkles className="w-4 h-4 text-[#123A78]" />
            <span>AI Automated Change Analysis Dossier</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mt-1">{data.aiSummary}</p>
        </div>
      </div>
    </div>
  );
};
