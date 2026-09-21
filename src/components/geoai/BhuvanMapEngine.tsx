import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Ruler,
  Square,
  Maximize2,
  Minimize2,
  Compass,
  Download,
  Printer,
  Copy,
  Check,
  Bookmark,
  Search,
  Eye,
  EyeOff,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Info,
  Navigation,
} from 'lucide-react';
import { GeoParcelFeature } from '../../types/geoAi';
import { MOCK_GEO_PARCELS } from '../../data/geoAiData';

interface BhuvanMapEngineProps {
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onOpenInspectParcel?: (parcel: GeoParcelFeature) => void;
}

export const BhuvanMapEngine: React.FC<BhuvanMapEngineProps> = ({
  selectedParcelId,
  onSelectParcel,
  onOpenInspectParcel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Active Base Layer & Overlays
  const [baseLayerType, setBaseLayerType] = useState<'satellite' | 'street' | 'terrain'>('satellite');
  const [activeLayers, setActiveLayers] = useState({
    parcels: true,
    cadastralBoundary: true,
    roads: true,
    waterBodies: true,
    agriculture: true,
    forestBuffer: true,
    govtBuildings: true,
    encroachmentHeatmap: true,
    disputeHeatmap: false,
  });

  // Layer Opacities
  const [layerOpacity, setLayerOpacity] = useState({
    parcels: 0.85,
    encroachment: 0.65,
    waterBodies: 0.5,
  });

  // Tool states
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTool, setActiveTool] = useState<'none' | 'measure-distance' | 'measure-area' | 'draw-polygon'>('none');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number }>({ lat: 18.5799, lng: 73.9826 });
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [bookmarkedParcels, setBookmarkedParcels] = useState<string[]>(['IN-MH-PUN-BAR-2023-00088-B']);
  const [searchQuery, setSearchQuery] = useState('');
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);

  const selectedParcel = MOCK_GEO_PARCELS.find((p) => p.id === selectedParcelId) || MOCK_GEO_PARCELS[0];

  // Initialize Map
  useEffect(() => {
    isMountedRef.current = true;
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = selectedParcel.properties.centroid;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Add Zoom Control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Track mouse coordinates
    map.on('mousemove', (e) => {
      setMouseCoords({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
    });

    // Base Tile Layer
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if (baseLayerType === 'street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else if (baseLayerType === 'terrain') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    }

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    // Layer Group
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Render Parcels
    if (activeLayers.parcels) {
      MOCK_GEO_PARCELS.forEach((parcel) => {
        const isSelected = parcel.id === selectedParcelId;
        const isFlagged = parcel.properties.verificationStatus === 'FLAGGED' || parcel.properties.hasEncroachment;
        const isVerified = parcel.properties.verificationStatus === 'VERIFIED';

        let color = '#123A78';
        let fillColor = '#1D5AA6';
        if (isFlagged) {
          color = '#B42318';
          fillColor = '#FEE4E2';
        } else if (isVerified) {
          color = '#0B7A3B';
          fillColor = '#D1FADF';
        }

        const polyCoords = parcel.geometry.coordinates[0].map((coord) => [coord[1], coord[0]] as [number, number]);

        const polygon = L.polygon(polyCoords, {
          color: isSelected ? '#F04438' : color,
          weight: isSelected ? 4 : 2,
          dashArray: isSelected ? undefined : '4, 4',
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.75 : layerOpacity.parcels * 0.45,
        }).addTo(layerGroup);

        polygon.on('click', () => {
          onSelectParcel(parcel.id);
        });

        const popupContent = `
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: #1E293B; min-width: 220px; line-height: 1.4;">
            <div style="background-color: #123A78; color: white; padding: 6px 10px; font-weight: bold; border-radius: 4px 4px 0 0; display: flex; justify-content: space-between;">
              <span>Survey #${parcel.properties.surveyNumber}</span>
              <span>${parcel.properties.trustScore}% Trust</span>
            </div>
            <div style="padding: 8px; border: 1px solid #D8DEE8; border-top: none; background-color: #FFFFFF;">
              <div><b>ULPIN:</b> <span style="font-family: monospace; font-size: 11px;">${parcel.properties.parcelUid}</span></div>
              <div style="margin-top: 4px;"><b>Owner:</b> ${parcel.properties.owner}</div>
              <div style="margin-top: 2px;"><b>Cadastral Area:</b> ${parcel.properties.cadastralAreaHa} Ha</div>
              <div style="margin-top: 2px;"><b>Status:</b> <span style="color: ${isFlagged ? '#B42318' : '#0B7A3B'}; font-weight: 600;">${parcel.properties.verificationStatus}</span></div>
              ${parcel.properties.hasEncroachment ? `<div style="margin-top: 4px; padding: 3px 6px; background-color: #FEE4E2; color: #B42318; border-radius: 4px; font-size: 10px; font-weight: bold;">⚠️ Encroachment Flagged</div>` : ''}
              <div style="margin-top: 8px; text-align: right;">
                <button id="inspect-btn-${parcel.id}" style="background-color: #123A78; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">View Intelligence &rarr;</button>
              </div>
            </div>
          </div>
        `;
        polygon.bindPopup(popupContent);

        polygon.on('popupopen', () => {
          const btn = document.getElementById(`inspect-btn-${parcel.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onOpenInspectParcel) onOpenInspectParcel(parcel);
            };
          }
        });
      });
    }

    // Render Water Body Buffer (Mutha Canal & Community Pond)
    if (activeLayers.waterBodies) {
      const canalCoords: [number, number][] = [
        [18.5830, 73.9760],
        [18.5828, 73.9800],
        [18.5825, 73.9840],
        [18.5820, 73.9880],
      ];
      L.polyline(canalCoords, {
        color: '#0284C7',
        weight: 8,
        opacity: layerOpacity.waterBodies,
      }).addTo(layerGroup).bindPopup('<b>Mutha Canal Right Bank Distributary</b><br/>50-meter statutory green buffer enforced');

      // Canal 50m Buffer Corridor
      L.polyline(canalCoords, {
        color: '#38BDF8',
        weight: 22,
        opacity: 0.25,
      }).addTo(layerGroup);
    }

    // Render Roads
    if (activeLayers.roads) {
      const roadCoords: [number, number][] = [
        [18.5760, 73.9780],
        [18.5770, 73.9820],
        [18.5780, 73.9860],
        [18.5790, 73.9890],
      ];
      L.polyline(roadCoords, {
        color: '#D97706',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 4',
      }).addTo(layerGroup).bindPopup('<b>Pune-Nagar Highway Connector Road (Haveli ZP)</b>');
    }

    // Fly to selected parcel
    if (selectedParcel) {
      map.flyTo(selectedParcel.properties.centroid, 17, { duration: 0.8 });
    }

    return () => {
      isMountedRef.current = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [baseLayerType, activeLayers, layerOpacity, selectedParcelId]);

  // Handle Measurement Tools
  const handleActivateTool = (tool: 'none' | 'measure-distance' | 'measure-area' | 'draw-polygon') => {
    setActiveTool(tool);
    if (tool === 'measure-distance') {
      setMeasurementResult('Distance: 142.8 meters along Survey #88/1B boundary line');
    } else if (tool === 'measure-area') {
      setMeasurementResult('Area: 21,500 sq. meters (2.15 Hectares)');
    } else if (tool === 'draw-polygon') {
      setMeasurementResult('Polygon geometry captured. 5 vertices stored.');
    } else {
      setMeasurementResult(null);
    }
  };

  // Download GeoJSON
  const handleDownloadGeoJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(MOCK_GEO_PARCELS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Wagholi_Cadastral_Parcels_${Date.now()}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Coordinates
  const handleCopyCoords = () => {
    const text = `${mouseCoords.lat}, ${mouseCoords.lng}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    if (bookmarkedParcels.includes(id)) {
      setBookmarkedParcels(bookmarkedParcels.filter((x) => x !== id));
    } else {
      setBookmarkedParcels([...bookmarkedParcels, id]);
    }
  };

  // Print Map
  const handlePrintMap = () => {
    window.print();
  };

  return (
    <div className={`relative flex flex-col bg-white border border-[#D8DEE8] rounded-[10px] overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[750px]'}`}>
      {/* 1. Official GIS Header & Controls Bar */}
      <div className="bg-[#123A78] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center border border-white/20">
            <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider uppercase bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded text-[10px]">
                ISRO Bhuvan × NIC
              </span>
              <h2 className="text-sm md:text-base font-bold tracking-tight">GeoAI Cadastral Intelligence Engine</h2>
            </div>
            <p className="text-[11px] text-blue-100 hidden sm:block">
              EPSG:4326 (WGS 84) • Cartosat-3 High-Resolution Orthomosaic • PostGIS Geometry Engine
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-blue-200 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Survey #, ULPIN, Owner, or Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-[#123A78] border border-white/20 rounded text-xs text-white placeholder:text-blue-200 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* GIS Action Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setBaseLayerType(baseLayerType === 'satellite' ? 'street' : baseLayerType === 'street' ? 'terrain' : 'satellite')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs font-semibold"
            title="Switch Basemap (Satellite / Street / Topo)"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span className="capitalize">{baseLayerType}</span>
          </button>

          <button
            onClick={handleDownloadGeoJson}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs font-semibold"
            title="Export GeoJSON Polygon Data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          <button
            onClick={handlePrintMap}
            className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs"
            title="Print Cadastral Map"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Map'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Map Canvas Area with Floating Sidebars */}
      <div className="relative flex-1 w-full h-full">
        {/* Leaflet Map DOM Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Left: Interactive Layer Switcher & Opacity Controls */}
        <div className="absolute top-4 left-4 z-10 w-64 bg-white/95 backdrop-blur-xs border border-[#D8DEE8] rounded-lg shadow-md p-3 text-xs">
          <div className="flex items-center justify-between font-bold text-[#123A78] pb-2 border-b border-[#D8DEE8] mb-2">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#123A78]" />
              <span>Cadastral Overlays</span>
            </div>
            <span className="text-[10px] text-gray-500 font-normal">WGS 84</span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            <label className="flex items-center justify-between p-1 hover:bg-[#F5F7FA] rounded cursor-pointer">
              <span className="font-semibold text-gray-800">Cadastral Parcels</span>
              <input
                type="checkbox"
                checked={activeLayers.parcels}
                onChange={(e) => setActiveLayers({ ...activeLayers, parcels: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#123A78]"
              />
            </label>

            {activeLayers.parcels && (
              <div className="pl-3 pr-1 py-1 bg-[#F5F7FA] rounded space-y-1">
                <div className="flex justify-between text-[11px] text-gray-600">
                  <span>Polygon Opacity</span>
                  <span>{Math.round(layerOpacity.parcels * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={layerOpacity.parcels}
                  onChange={(e) => setLayerOpacity({ ...layerOpacity, parcels: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#123A78]"
                />
              </div>
            )}

            <label className="flex items-center justify-between p-1 hover:bg-[#F5F7FA] rounded cursor-pointer">
              <span className="text-gray-700">Water Bodies & 50m Buffer</span>
              <input
                type="checkbox"
                checked={activeLayers.waterBodies}
                onChange={(e) => setActiveLayers({ ...activeLayers, waterBodies: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#0284C7]"
              />
            </label>

            <label className="flex items-center justify-between p-1 hover:bg-[#F5F7FA] rounded cursor-pointer">
              <span className="text-gray-700">Road Reserve Alignment</span>
              <input
                type="checkbox"
                checked={activeLayers.roads}
                onChange={(e) => setActiveLayers({ ...activeLayers, roads: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#D97706]"
              />
            </label>

            <label className="flex items-center justify-between p-1 hover:bg-[#F5F7FA] rounded cursor-pointer">
              <span className="text-[#B42318] font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#B42318]" />
                Encroachment Heatmap
              </span>
              <input
                type="checkbox"
                checked={activeLayers.encroachmentHeatmap}
                onChange={(e) => setActiveLayers({ ...activeLayers, encroachmentHeatmap: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#B42318]"
              />
            </label>
          </div>

          <div className="mt-3 pt-2 border-t border-[#D8DEE8] flex justify-between items-center text-[10px] text-gray-500">
            <span>ISRO Bhuvan Service</span>
            <span className="text-[#0B7A3B] font-bold">● Connected</span>
          </div>
        </div>

        {/* Floating Right: Measuring & GIS Precision Tools Bar */}
        <div className="absolute top-4 right-14 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-xs border border-[#D8DEE8] rounded-lg shadow-md p-1.5">
          <button
            onClick={() => handleActivateTool(activeTool === 'measure-distance' ? 'none' : 'measure-distance')}
            className={`p-2 rounded transition-colors ${activeTool === 'measure-distance' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-[#F5F7FA]'}`}
            title="Measure Boundary Distance"
          >
            <Ruler className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleActivateTool(activeTool === 'measure-area' ? 'none' : 'measure-area')}
            className={`p-2 rounded transition-colors ${activeTool === 'measure-area' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-[#F5F7FA]'}`}
            title="Measure Parcel Area"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleActivateTool(activeTool === 'draw-polygon' ? 'none' : 'draw-polygon')}
            className={`p-2 rounded transition-colors ${activeTool === 'draw-polygon' ? 'bg-[#123A78] text-white' : 'text-gray-700 hover:bg-[#F5F7FA]'}`}
            title="Draw Verification Polygon"
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleBookmark(selectedParcel.id)}
            className={`p-2 rounded transition-colors ${bookmarkedParcels.includes(selectedParcel.id) ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-[#F5F7FA]'}`}
            title="Bookmark Selected Parcel"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Bottom Center: Measurement Feedback Notification */}
        {measurementResult && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 bg-[#123A78] text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-white/30 animate-fade-in">
            <Ruler className="w-3.5 h-3.5 text-amber-300" />
            <span>{measurementResult}</span>
            <button onClick={() => setMeasurementResult(null)} className="ml-2 text-white/70 hover:text-white font-bold">×</button>
          </div>
        )}

        {/* Floating Bottom Left: Coordinates HUD & Scale */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-[#D8DEE8] rounded-md px-3 py-1.5 shadow-xs text-xs font-mono text-gray-700">
          <Navigation className="w-3.5 h-3.5 text-[#123A78]" />
          <span>Lat: {mouseCoords.lat}° N</span>
          <span className="text-gray-400">|</span>
          <span>Lng: {mouseCoords.lng}° E</span>
          <button
            onClick={handleCopyCoords}
            className="ml-1 text-gray-500 hover:text-[#123A78]"
            title="Copy Coordinates to Clipboard"
          >
            {copiedCoords ? <Check className="w-3.5 h-3.5 text-[#0B7A3B]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Floating Bottom Right: Selected Parcel Card Overlay */}
        <div className="absolute bottom-3 right-3 z-10 w-80 bg-white/95 backdrop-blur-xs border border-[#D8DEE8] rounded-lg shadow-lg p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8DEE8] mb-2">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Current Selected Parcel</div>
              <div className="text-sm font-bold text-[#123A78]">Survey #{selectedParcel.properties.surveyNumber} • {selectedParcel.properties.village}</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              selectedParcel.properties.verificationStatus === 'VERIFIED' ? 'bg-[#D1FADF] text-[#0B7A3B]' :
              selectedParcel.properties.verificationStatus === 'FLAGGED' ? 'bg-[#FEE4E2] text-[#B42318]' :
              'bg-[#FEF0C7] text-[#B26A00]'
            }`}>
              {selectedParcel.properties.verificationStatus}
            </span>
          </div>

          <div className="space-y-1.5 text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Primary Owner:</span>
              <span className="font-semibold text-gray-900">{selectedParcel.properties.owner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cadastral Area:</span>
              <span className="font-semibold">{selectedParcel.properties.cadastralAreaHa} Ha ({Math.round(selectedParcel.properties.cadastralAreaHa * 10000)} sqm)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Observed Area:</span>
              <span className={`font-semibold ${selectedParcel.properties.observedAreaHa !== selectedParcel.properties.cadastralAreaHa ? 'text-[#B42318]' : ''}`}>
                {selectedParcel.properties.observedAreaHa} Ha
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Citizen Trust Score:</span>
              <span className="font-bold text-[#123A78]">{selectedParcel.properties.trustScore}%</span>
            </div>

            {selectedParcel.properties.hasEncroachment && (
              <div className="p-2 bg-[#FEE4E2] border border-[#FDA29B] rounded text-[11px] text-[#B42318] font-medium flex items-start gap-1.5 mt-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{selectedParcel.properties.encroachmentType}</div>
              </div>
            )}
          </div>

          {onOpenInspectParcel && (
            <button
              onClick={() => onOpenInspectParcel(selectedParcel)}
              className="mt-3 w-full py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded font-semibold text-center transition-colors shadow-2xs"
            >
              Open Full Land DNA Profile &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
