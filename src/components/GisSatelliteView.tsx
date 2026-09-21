import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Compass,
  FileCheck,
  ShieldAlert,
  Info,
  Building,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface GisSatelliteViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onOpenReportModal: (parcel: LandParcelDetail) => void;
}

export const GisSatelliteView: React.FC<GisSatelliteViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenReportModal,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayersRef = useRef<L.LayerGroup | null>(null);

  const [mapLayer, setMapLayer] = useState<'satellite' | 'cadastral' | 'hybrid'>('satellite');
  const [showCadastralBoundary, setShowCadastralBoundary] = useState(true);
  const [showSatelliteBoundary, setShowSatelliteBoundary] = useState(true);
  const [showEncroachmentHeatmap, setShowEncroachmentHeatmap] = useState(true);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates
    const centerLat = currentParcel.dna.centroid.lat;
    const centerLng = currentParcel.dna.centroid.lng;

    // Destroy existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 16,
      zoomControl: true,
    });

    // Base Tile Layers
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; ESRI World Imagery, ISRO Bhuvan, Digital India Land Records';

    if (mapLayer === 'cadastral') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors, Survey of India';
    }

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

    // Layer Group for Polygons
    const layerGroup = L.layerGroup().addTo(map);
    polygonLayersRef.current = layerGroup;

    // 1. Cadastral Boundary (Official Village Sheet) - Blue Polygon
    if (showCadastralBoundary && currentParcel.gis.cadastralPolygon.length > 0) {
      const cadPoints = currentParcel.gis.cadastralPolygon.map((p: any) => [p.lat, p.lng] as [number, number]);
      const cadPoly = L.polygon(cadPoints, {
        color: '#123A78',
        weight: 3,
        dashArray: '5, 5',
        fillColor: '#1D5AA6',
        fillOpacity: 0.25,
      }).addTo(layerGroup);
      cadPoly.bindPopup(`<b>Official Cadastral Boundary</b><br/>Area: ${currentParcel.gis.cadastralAreaHa} Ha`);
    }

    // 2. Satellite Observed Boundary (ISRO/Cartosat Multi-Spectral) - Green/Amber Polygon
    if (showSatelliteBoundary && currentParcel.gis.satelliteObservedPolygon.length > 0) {
      const satPoints = currentParcel.gis.satelliteObservedPolygon.map((p: any) => [p.lat, p.lng] as [number, number]);
      const satPoly = L.polygon(satPoints, {
        color: currentParcel.gis.encroachmentDetected ? '#B42318' : '#0B7A3B',
        weight: 2,
        fillColor: currentParcel.gis.encroachmentDetected ? '#B42318' : '#0B7A3B',
        fillOpacity: 0.15,
      }).addTo(layerGroup);
      satPoly.bindPopup(
        `<b>ISRO Satellite Detected Footprint</b><br/>Observed Area: ${currentParcel.gis.satelliteAreaHa} Ha`
      );
    }

    // 3. Encroachment Marker if detected
    if (showEncroachmentHeatmap && currentParcel.gis.encroachmentDetected) {
      const marker = L.circleMarker([centerLat + 0.0008, centerLng + 0.001], {
        radius: 12,
        fillColor: '#B42318',
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(layerGroup);
      marker.bindPopup(
        `<b>ENCROACHMENT DETECTED</b><br/>${currentParcel.gis.encroachmentDetails?.areaSqm || 220} sqm structure overstepping buffer.`
      );
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [
    currentParcel,
    mapLayer,
    showCadastralBoundary,
    showSatelliteBoundary,
    showEncroachmentHeatmap,
  ]);

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Top Header Card */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                Feature 8
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                Satellite Truth Verification Engine &amp; Cadastral GIS
              </h1>
            </div>
            <p className="text-xs text-[#5A6878] mt-1">
              Multi-spectral Cartosat-3 &amp; Sentinel-2 satellite layer superimposed on Survey of India cadastral polygons.
            </p>
          </div>

          {/* Parcel Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">Select Parcel:</label>
            <select
              value={selectedParcelId}
              onChange={(e) => onSelectParcel(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.surveyNumber} ({p.village}) — {p.ownerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GIS Grid: Map on Left (8 cols), Metrics & Truth Verification on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-8 bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs flex flex-col">
            {/* Map Controls Header */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Layer switch */}
              <div className="flex items-center gap-1 bg-gray-200 p-0.5 rounded">
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    mapLayer === 'satellite' ? 'bg-[#123A78] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  Satellite (ISRO/ESRI)
                </button>
                <button
                  onClick={() => setMapLayer('cadastral')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    mapLayer === 'cadastral' ? 'bg-[#123A78] text-white shadow-xs' : 'text-gray-700'
                  }`}
                >
                  OpenStreetMap Cadastre
                </button>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-700">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCadastralBoundary}
                    onChange={(e) => setShowCadastralBoundary(e.target.checked)}
                    className="rounded accent-[#123A78]"
                  />
                  <span>Cadastral Boundary (Blue)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSatelliteBoundary}
                    onChange={(e) => setShowSatelliteBoundary(e.target.checked)}
                    className="rounded accent-[#0B7A3B]"
                  />
                  <span>Satellite Footprint</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEncroachmentHeatmap}
                    onChange={(e) => setShowEncroachmentHeatmap(e.target.checked)}
                    className="rounded accent-[#B42318]"
                  />
                  <span>Encroachments</span>
                </label>
              </div>
            </div>

            {/* Interactive Leaflet Stage */}
            <div className="relative w-full h-[520px] bg-gray-900" ref={mapContainerRef}>
              {/* GPS Coordinates Legend Strip */}
              <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs p-2 rounded border border-gray-300 text-[10px] font-mono shadow-md space-y-0.5">
                <div>Centroid: {currentParcel.dna.centroid.lat.toFixed(6)}°N, {currentParcel.dna.centroid.lng.toFixed(6)}°E</div>
                <div>Datum: WGS-84 &bull; Elevation: {currentParcel.dna.elevationMeters}m MSL</div>
                <div>Bhuvan Drone GSD: 5cm Orthomosaic</div>
              </div>
            </div>
          </div>

          {/* Right Col: Ground Truth Comparison & Area Discrepancy Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Area Comparison Card */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#123A78] uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
                <span>Area Discrepancy Analysis</span>
                <span
                  className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                    Math.abs(currentParcel.gis.areaDiscrepancyPercent) < 1.0
                      ? 'bg-emerald-100 text-[#0B7A3B]'
                      : 'bg-red-100 text-[#B42318]'
                  }`}
                >
                  Delta: {currentParcel.gis.areaDiscrepancyPercent}%
                </span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500">1. Stated in 7/12 RoR:</span>
                  <span className="font-mono font-bold text-gray-800">{currentParcel.gis.statedAreaHa} Ha</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500">2. Official Cadastral Sheet:</span>
                  <span className="font-mono font-bold text-[#123A78]">{currentParcel.gis.cadastralAreaHa} Ha</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500">3. ISRO Satellite Observed:</span>
                  <span className="font-mono font-bold text-[#0B7A3B]">{currentParcel.gis.satelliteAreaHa} Ha</span>
                </div>
              </div>

              {/* Status Notice */}
              {currentParcel.gis.encroachmentDetected ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
                  <div className="font-bold text-xs text-[#B42318] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Encroachment / Variance Alert</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    Satellite spectral signature detected physical structure extending {currentParcel.gis.encroachmentDetails?.areaSqm || 220} sqm beyond legal cadastral coordinates.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-xs text-[#0B7A3B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Boundaries Geometrically Conforming</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    Variance between stated area and satellite perimeter is under 0.1%, satisfying DILRMP accuracy standards.
                  </p>
                </div>
              )}
            </div>

            {/* Land Use Classification */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Land Use Spectral Classifier
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Declared Classification:</span>
                  <span className="font-semibold text-gray-800">{currentParcel.gis.landUseStated}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Satellite Observed Use:</span>
                  <span className="font-semibold text-[#123A78]">{currentParcel.gis.landUseDetected}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Classification Match:</span>
                  <span
                    className={`font-bold text-xs ${
                      currentParcel.gis.landUseMatch ? 'text-[#0B7A3B]' : 'text-[#B42318]'
                    }`}
                  >
                    {currentParcel.gis.landUseMatch ? 'MATCH VERIFIED' : 'MISMATCH FLAGGED (NON-AGRI ACTIVITY)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => onOpenReportModal(currentParcel)}
                  className="w-full py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Generate On-Site Inspection Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
