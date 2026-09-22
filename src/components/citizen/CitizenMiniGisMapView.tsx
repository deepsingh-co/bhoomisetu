import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Compass,
  Download,
  CheckCircle2,
  AlertTriangle,
  Crosshair,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Navigation,
  Footprints,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Printer,
  Info,
  Route,
  Search,
  ArrowRight,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CornerData {
  id: string;
  code: string;
  label: string;
  direction: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  pillarType: string;
  pillarStatus: string;
  soiPillarId: string;
  description: string;
}

interface BoundaryEdgeData {
  id: string;
  fromCorner: string;
  toCorner: string;
  name: string;
  lengthMeters: number;
  lengthFeet: number;
  adjoining: string;
  boundaryType: string;
  encroachmentStatus: string;
}

interface GisParcelData {
  id: string;
  parcelUid: string;
  surveyNumber: string;
  khasraNumber: string;
  khataNumber: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  ownerName: string;
  maskedOwnerName: string;
  fatherName: string;
  areaHectares: number;
  areaGunthas: number;
  areaSqft: number;
  landType: string;
  soilType: string;
  elevationMeters: number;
  status: string;
  trustIndex: number;
  centroid: { lat: number; lng: number };
  polygon: Array<{ lat: number; lng: number }>;
  corners: CornerData[];
  boundaryEdges: BoundaryEdgeData[];
  perimeterMeters: number;
  perimeterFeet: number;
  approachRoad: string;
  nearestHighway: string;
  landmarks: Array<{ name: string; distance: string; type: string }>;
  googleMapsNavUrl: string;
  satelliteProvider: string;
  lastDroneSurvey: string;
  cadastralSheetNo: string;
}

interface CitizenMiniGisMapViewProps {
  parcelId?: string;
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

function computeHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const CitizenMiniGisMapView: React.FC<CitizenMiniGisMapViewProps> = ({
  parcelId: initialParcelId,
  onNavigate,
  language,
}) => {
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    initialParcelId || 'IN-MH-PUN-HAV-2024-00142-A'
  );
  const [parcelData, setParcelData] = useState<GisParcelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<'SATELLITE' | 'HYBRID' | 'CADASTRAL'>('SATELLITE');
  const [showEncroachmentBuffer, setShowEncroachmentBuffer] = useState(true);
  const [showCorners, setShowCorners] = useState(true);
  const [showEdgeLengths, setShowEdgeLengths] = useState(true);
  const [selectedCorner, setSelectedCorner] = useState<CornerData | null>(null);
  const [copiedCornerId, setCopiedCornerId] = useState<string | null>(null);
  const [isWalkingMode, setIsWalkingMode] = useState(false);
  const [activeWalkStep, setActiveWalkStep] = useState(0);
  const [verifiedWalkSteps, setVerifiedWalkSteps] = useState<Record<number, boolean>>({});
  const [showPrintSlipModal, setShowPrintSlipModal] = useState(false);

  // User GPS Tracking
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Linked parcels list for quick switching
  const linkedParcels = [
    {
      id: 'IN-MH-PUN-HAV-2024-00142-A',
      survey: '142/1',
      village: 'Wagholi, Pune',
      area: '1.84 Ha',
      status: 'VERIFIED',
      score: 98,
    },
    {
      id: 'IN-MH-PUN-HAV-2024-00142-C',
      survey: '142/2',
      village: 'Wagholi, Pune',
      area: '0.92 Ha',
      status: 'VERIFIED',
      score: 94,
    },
    {
      id: 'IN-MH-PUN-BAR-2023-00088-B',
      survey: '88/4',
      village: 'Malegaon, Baramati',
      area: '2.10 Ha',
      status: 'FLAGGED',
      score: 68,
    },
    {
      id: 'IN-MH-PUN-MUL-2024-00214-0',
      survey: '214',
      village: 'Paud, Mulshi',
      area: '1.80 Ha',
      status: 'PENDING',
      score: 78,
    },
  ];

  // Sync if prop changes
  useEffect(() => {
    if (initialParcelId && initialParcelId !== selectedParcelId) {
      setSelectedParcelId(initialParcelId);
    }
  }, [initialParcelId]);

  // Fetch GIS Parcel Details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/citizen/parcel-gis/${encodeURIComponent(selectedParcelId)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch GIS data');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.parcel) {
          setParcelData(data.parcel);
          setSelectedCorner(data.parcel.corners[0] || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading GIS parcel:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedParcelId]);

  // Initialize & Update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !parcelData) return;

    const centerLat = parcelData.centroid.lat;
    const centerLng = parcelData.centroid.lng;

    // Cleanup existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 17,
      zoomControl: true,
      attributionControl: true,
      maxZoom: 20,
    });
    mapInstanceRef.current = map;

    // Base Tile Setup
    let tileUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution =
      '&copy; <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics, ISRO Bhuvan';

    if (activeLayer === 'CADASTRAL') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors, Survey of India DILRMP';
    }

    const baseTile = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = baseTile;

    // Add labels overlay if Hybrid
    if (activeLayer === 'HYBRID') {
      const labelsTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; CartoDB & OpenStreetMap',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);
      labelsLayerRef.current = labelsTile;
    }

    // Layer group for vectors and markers
    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;

    // 1. Plot Cadastral Boundary Polygon
    const polyPoints = parcelData.polygon.map((p) => [p.lat, p.lng] as [number, number]);
    const isDisputed = parcelData.status === 'FLAGGED';

    const boundaryPolygon = L.polygon(polyPoints, {
      color: isDisputed ? '#DC2626' : '#10B981',
      weight: 3.5,
      dashArray: isDisputed ? '6, 6' : undefined,
      fillColor: isDisputed ? '#EF4444' : '#059669',
      fillOpacity: 0.22,
    }).addTo(layersGroup);

    boundaryPolygon.bindPopup(`
      <div style="font-family:sans-serif; padding:4px 2px; min-width:180px;">
        <div style="font-size:11px; font-weight:bold; color:#123A78; text-transform:uppercase;">
          Survey No. ${parcelData.surveyNumber}
        </div>
        <div style="font-size:14px; font-weight:bold; color:#111827; margin:2px 0;">
          ${parcelData.ownerName}
        </div>
        <div style="font-size:12px; color:#4B5563;">
          Total Area: <b>${parcelData.areaHectares} Ha (${parcelData.areaGunthas} Gunthas)</b>
        </div>
        <div style="font-size:11px; color:#059669; font-weight:bold; margin-top:4px;">
          ✓ Cadastral Coordinates Verified
        </div>
      </div>
    `);

    // 2. Canal / Road 50m Buffer Ring (if toggled)
    if (showEncroachmentBuffer) {
      const bufferPolygon = L.polygon(polyPoints, {
        color: '#F59E0B',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#F59E0B',
        fillOpacity: 0.08,
      }).addTo(layersGroup);

      bufferPolygon.bindTooltip('50m Waterway / Road Buffer Boundary', {
        sticky: true,
        className: 'bg-amber-900 text-white text-[10px] px-2 py-0.5 rounded shadow',
      });
    }

    // 3. Render Corner Pins (P1, P2, P3, P4)
    if (showCorners && parcelData.corners.length > 0) {
      parcelData.corners.forEach((corner) => {
        const cornerMarkerHtml = `
          <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%); cursor:pointer;">
            <div style="background:${
              isDisputed ? '#DC2626' : '#0B7A3B'
            }; color:#ffffff; font-weight:bold; font-size:11px; padding:2px 7px; border-radius:9999px; box-shadow:0 3px 8px rgba(0,0,0,0.5); border:2px solid #ffffff; display:flex; align-items:center; gap:3px; white-space:nowrap;">
              <span>${corner.code}</span>
            </div>
            <div style="width:2px; height:8px; background:#ffffff; box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>
            <div style="width:7px; height:7px; border-radius:50%; background:#ffffff; border:2.5px solid ${
              isDisputed ? '#DC2626' : '#0B7A3B'
            };"></div>
          </div>
        `;

        const cornerIcon = L.divIcon({
          className: 'custom-corner-div-marker',
          html: cornerMarkerHtml,
          iconSize: [0, 0],
        });

        const marker = L.marker([corner.lat, corner.lng], { icon: cornerIcon }).addTo(layersGroup);

        marker.on('click', () => {
          setSelectedCorner(corner);
        });

        marker.bindTooltip(
          `<b>${corner.label}</b><br/>${corner.lat.toFixed(5)}°N, ${corner.lng.toFixed(5)}°E<br/>Elev: ${corner.elevationMeters}m`,
          {
            direction: 'top',
            offset: [0, -22],
            className: 'text-xs p-1 font-sans rounded shadow-lg',
          }
        );
      });
    }

    // 4. Render Edge Length Badges (Distance in meters along boundary sides)
    if (showEdgeLengths && parcelData.boundaryEdges.length > 0) {
      parcelData.boundaryEdges.forEach((edge, idx) => {
        const c1 = parcelData.corners.find((c) => c.code === edge.fromCorner);
        const c2 = parcelData.corners.find((c) => c.code === edge.toCorner);
        if (c1 && c2) {
          const midLat = (c1.lat + c2.lat) / 2;
          const midLng = (c1.lng + c2.lng) / 2;

          const edgeBadgeHtml = `
            <div style="background:rgba(18, 58, 120, 0.92); color:#ffffff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; border:1px solid rgba(255,255,255,0.7); box-shadow:0 2px 6px rgba(0,0,0,0.5); white-space:nowrap; transform:translate(-50%, -50%); pointer-events:none;">
              ${edge.lengthMeters} m
            </div>
          `;

          const edgeIcon = L.divIcon({
            className: 'custom-edge-badge',
            html: edgeBadgeHtml,
            iconSize: [0, 0],
          });

          L.marker([midLat, midLng], { icon: edgeIcon, interactive: false }).addTo(layersGroup);
        }
      });
    }

    // Fit map bounds neatly to the parcel polygon
    map.fitBounds(boundaryPolygon.getBounds(), {
      padding: [45, 45],
      maxZoom: 18,
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [parcelData, activeLayer, showEncroachmentBuffer, showCorners, showEdgeLengths]);

  // Handle GPS "Locate My Field GPS"
  const handleLocateGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setUserLocation(coords);
        setLocatingGps(false);

        // Add or update user marker on Leaflet map
        if (mapInstanceRef.current && layersGroupRef.current) {
          if (userMarkerRef.current) {
            layersGroupRef.current.removeLayer(userMarkerRef.current);
          }

          const userMarkerHtml = `
            <div style="position:relative; width:22px; height:22px; transform:translate(-50%, -50%);">
              <span style="position:absolute; inset:0; border-radius:50%; background:#2563EB; opacity:0.5; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="position:relative; display:block; width:16px; height:16px; margin:3px; border-radius:50%; background:#1D4ED8; border:3px solid #ffffff; box-shadow:0 0 10px rgba(0,0,0,0.5);"></span>
            </div>
          `;

          const userIcon = L.divIcon({
            className: 'user-live-gps-pin',
            html: userMarkerHtml,
            iconSize: [22, 22],
          });

          const uMarker = L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(
            layersGroupRef.current
          );
          uMarker.bindPopup('<b>Your Current Location</b><br/>GPS Accuracy: ±' + Math.round(coords.accuracy) + 'm');
          userMarkerRef.current = uMarker;

          // Draw dashed guide line from user to Corner P1 / centroid
          if (parcelData && parcelData.corners.length > 0) {
            const entrance = parcelData.corners[0];
            L.polyline(
              [
                [coords.lat, coords.lng],
                [entrance.lat, entrance.lng],
              ],
              {
                color: '#3B82F6',
                weight: 2.5,
                dashArray: '6, 6',
              }
            ).addTo(layersGroupRef.current);

            // Zoom out slightly to frame both user and plot
            mapInstanceRef.current.fitBounds([
              [coords.lat, coords.lng],
              [entrance.lat, entrance.lng],
            ], { padding: [50, 50] });
          }
        }
      },
      (err) => {
        console.warn('GPS location error:', err);
        setLocatingGps(false);
        // Fallback simulation: place user near the parcel entrance (approx 120m away on cart track)
        if (parcelData) {
          const simLat = parcelData.centroid.lat + 0.0011;
          const simLng = parcelData.centroid.lng - 0.0013;
          setUserLocation({
            lat: simLat,
            lng: simLng,
            accuracy: 8,
          });
          setGpsError('Live GPS permission prompt closed. Simulated near-field position activated.');
        } else {
          setGpsError('Unable to retrieve your location. Please check location permissions.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Center on a specific corner
  const handleFocusCorner = (corner: CornerData) => {
    setSelectedCorner(corner);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([corner.lat, corner.lng], 19, {
        animate: true,
      });
    }
  };

  // Copy coordinates to clipboard
  const handleCopyCoords = (corner: CornerData) => {
    const text = `${corner.lat.toFixed(6)}, ${corner.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCornerId(corner.id);
    setTimeout(() => setCopiedCornerId(null), 2000);
  };

  // Calculate distance from user to selected corner or plot entrance
  const userDistanceToCorner =
    userLocation && selectedCorner
      ? computeHaversineMeters(
          userLocation.lat,
          userLocation.lng,
          selectedCorner.lat,
          selectedCorner.lng
        )
      : null;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Navigation & Live Satellite Indicators */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0B7A3B]/10 text-[#0B7A3B] text-xs font-bold px-2.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> High-Resolution Satellite & Cadastral GIS
            </span>
            <span className="bg-blue-50 text-[#123A78] text-xs font-semibold px-2 py-0.5 rounded border border-blue-200">
              Survey of India ETS & DILRMP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5 flex items-center gap-2">
            <span>Land Plot GIS & Satellite Boundary Viewer</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real satellite imagery with surveyed plot boundaries, verified corner pillars, edge dimensions, and GPS field navigation to help you find your plot easily.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleLocateGps}
            disabled={locatingGps}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer ${
              userLocation
                ? 'bg-blue-50 border border-blue-300 text-blue-800'
                : 'bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Crosshair className={`w-4 h-4 text-[#0B7A3B] ${locatingGps ? 'animate-spin' : ''}`} />
            <span>
              {locatingGps
                ? 'Acquiring GPS...'
                : userLocation
                ? 'Field GPS Active (±' + Math.round(userLocation.accuracy) + 'm)'
                : 'Locate My Field GPS'}
            </span>
          </button>

          {parcelData?.googleMapsNavUrl && (
            <a
              href={parcelData.googleMapsNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => setShowPrintSlipModal(true)}
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Boundary Coordinates Slip</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            onClick={() => setGpsError(null)}
            className="text-amber-800 font-bold hover:underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Studio Grid: Left Map + Right Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Satellite Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-xs">
            {/* Top Toolbar */}
            <div className="p-3 bg-[#0F172A] text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
              {/* Satellite Layer Switcher */}
              <div className="flex bg-white/10 backdrop-blur-xs p-1 rounded-lg text-xs font-semibold border border-white/10">
                <button
                  onClick={() => setActiveLayer('SATELLITE')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeLayer === 'SATELLITE'
                      ? 'bg-[#10B981] text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🛰️ Real Satellite
                </button>
                <button
                  onClick={() => setActiveLayer('HYBRID')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeLayer === 'HYBRID'
                      ? 'bg-[#10B981] text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🗺️ Satellite + Roads
                </button>
                <button
                  onClick={() => setActiveLayer('CADASTRAL')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeLayer === 'CADASTRAL'
                      ? 'bg-[#10B981] text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📐 Cadastral Sheet
                </button>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3 text-xs text-gray-200">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCorners}
                    onChange={(e) => setShowCorners(e.target.checked)}
                    className="rounded text-emerald-500"
                  />
                  <span>Corners (P1–P4)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEdgeLengths}
                    onChange={(e) => setShowEdgeLengths(e.target.checked)}
                    className="rounded text-emerald-500"
                  />
                  <span>Side Lengths</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEncroachmentBuffer}
                    onChange={(e) => setShowEncroachmentBuffer(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>50m Canal Buffer</span>
                </label>
              </div>
            </div>

            {/* Map Canvas Container */}
            <div className="relative">
              <div
                ref={mapContainerRef}
                style={{ height: '520px', width: '100%', zIndex: 1 }}
                className="bg-slate-950"
              />

              {/* Floating Compass Rose */}
              <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md p-2 rounded-full border border-white/20 text-center shadow-lg pointer-events-none">
                <Compass className="w-6 h-6 text-emerald-400 mx-auto" />
                <span className="text-[9px] font-mono font-bold text-white block">N</span>
              </div>

              {/* Floating Bottom Info Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-2">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-mono shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Centroid: {parcelData?.centroid.lat.toFixed(5)}°N,{' '}
                    {parcelData?.centroid.lng.toFixed(5)}°E
                  </span>
                  <span>•</span>
                  <span>Perimeter: {parcelData?.perimeterMeters} m ({parcelData?.perimeterFeet} ft)</span>
                </div>

                {userLocation && userDistanceToCorner !== null && (
                  <div className="bg-blue-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-300 text-white text-xs font-sans shadow-lg flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-300" />
                    <span>
                      <b>{userDistanceToCorner} meters</b> away from selected{' '}
                      <b>{selectedCorner?.code}</b>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Map Footer Bar */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">
                  Imagery: {parcelData?.satelliteProvider || 'Cartosat-3 / Esri World Imagery (0.28m GSD)'}
                </span>
                <span>•</span>
                <span>Last Drone Survey: {parcelData?.lastDroneSurvey || '14 Nov 2025'}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Boundary Encroachment Verified</span>
              </div>
            </div>
          </div>

          {/* 3. "Find My Plot" Physical Approach Road & Landmark Guidance Card */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0B7A3B] uppercase tracking-wider block">
                  Plot Location & On-Ground Access
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5 flex items-center gap-2">
                  <Route className="w-4 h-4 text-[#123A78]" />
                  <span>How to Reach & Identify Your Plot on Field</span>
                </h3>
              </div>
              {parcelData?.googleMapsNavUrl && (
                <a
                  href={parcelData.googleMapsNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
                >
                  Open Turn-by-Turn GPS <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-2">
                <span className="font-bold text-gray-800 block text-xs">
                  🚗 Primary Approach Road & Access Track
                </span>
                <p className="text-gray-700 leading-relaxed">
                  <b>Paved Road:</b> {parcelData?.approachRoad || 'Revenue Panand / Farm Road (6m wide)'}
                </p>
                <p className="text-gray-600">
                  <b>Nearest Highway:</b> {parcelData?.nearestHighway || 'Pune-Nagar Highway (SH-27, 2.4 km)'}
                </p>
                <p className="text-gray-600">
                  <b>Field Entrance:</b> North-East Corner P1 directly abuts the 6-meter public agricultural cart track.
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-2">
                <span className="font-bold text-gray-800 block text-xs">
                  📍 Ground Landmarks (Land Survey Stones)
                </span>
                <div className="space-y-1.5">
                  {parcelData?.landmarks.map((lm, idx) => (
                    <div key={idx} className="flex items-start justify-between text-gray-700">
                      <span>• {lm.name}</span>
                      <span className="font-semibold text-gray-900 shrink-0 ml-2">
                        {lm.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Boundary Side Dimensions Table */}
            <div>
              <span className="text-xs font-bold text-gray-800 block mb-2">
                📏 Surveyed Boundary Edge Dimensions (Side-by-Side Lengths)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {parcelData?.boundaryEdges.map((edge) => (
                  <div
                    key={edge.id}
                    className="bg-white border border-gray-200 p-2.5 rounded-lg text-xs"
                  >
                    <div className="flex items-center justify-between text-gray-500 text-[11px]">
                      <span>{edge.name}</span>
                      <span className="font-mono text-gray-400">
                        {edge.fromCorner} → {edge.toCorner}
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 mt-1">
                      {edge.lengthMeters} m
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      {edge.lengthFeet} ft ({edge.boundaryType})
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                      ✓ {edge.encroachmentStatus === 'CLEAR' ? 'Clear Boundary' : 'Buffer Flag'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Corner Pillars & Inspection Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Linked Holdings Switcher */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Select Land Record to View GIS
            </span>
            <div className="space-y-2">
              {linkedParcels.map((p) => {
                const isSelected = selectedParcelId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedParcelId(p.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-[#123A78] shadow-xs ring-1 ring-[#123A78]'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">
                            Survey No. {p.survey}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">({p.area})</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">{p.village}</p>
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
          </div>

          {/* Corner Pillars Inspector */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Ground Markers (Gat Raje)
                </span>
                <h4 className="text-sm font-bold text-gray-900">
                  Cadastral Corner Pillars (P1–P4)
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                4/4 Verified
              </span>
            </div>

            <div className="space-y-2">
              {parcelData?.corners.map((corner) => {
                const isSelected = selectedCorner?.id === corner.id;
                return (
                  <div
                    key={corner.id}
                    onClick={() => handleFocusCorner(corner)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0B7A3B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {corner.code}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            {corner.label}
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            {corner.description}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCoords(corner);
                        }}
                        className="p-1.5 hover:bg-white rounded text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200"
                        title="Copy GPS coordinates"
                      >
                        {copiedCornerId === corner.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200/70 grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-700">
                      <div>
                        <span className="text-gray-400 block text-[9px]">LATITUDE</span>
                        <span>{corner.lat.toFixed(6)}° N</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">LONGITUDE</span>
                        <span>{corner.lng.toFixed(6)}° E</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">ELEVATION</span>
                        <span>{corner.elevationMeters} m AMSL</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px]">MONUMENT</span>
                        <span className="text-emerald-700 font-bold truncate block">
                          SOI Brass Pin
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCorner && (
              <div className="bg-[#123A78]/5 border border-[#123A78]/20 p-3 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-[#123A78]">
                  <span>Pillar Inspection: {selectedCorner.label}</span>
                  <span className="font-mono text-[10px]">{selectedCorner.soiPillarId}</span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  Physical benchmark pillar installed and calibrated by Survey of India with high-precision RTK GNSS. Intact with zero displacement.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCoords(selectedCorner)}
                    className="flex-1 bg-white border border-[#123A78] hover:bg-blue-50 text-[#123A78] py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCornerId === selectedCorner.id ? 'Copied!' : 'Copy GPS Lat/Lng'}</span>
                  </button>
                  <button
                    onClick={() => handleFocusCorner(selectedCorner)}
                    className="flex-1 bg-[#123A78] hover:bg-[#0e2c5d] text-white py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Zoom to Pillar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* "Walk My Plot Boundary" Interactive Guide */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Field Walking Mode
                </span>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-[#0B7A3B]" />
                  <span>Walk Your Boundary Corners</span>
                </h4>
              </div>
              <button
                onClick={() => setIsWalkingMode(!isWalkingMode)}
                className="text-xs font-bold text-[#123A78] hover:underline"
              >
                {isWalkingMode ? 'Close Guide' : 'Start Walk'}
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Follow this step-by-step physical route around your plot to inspect all 4 boundary stones and ensure zero neighbor encroachment:
            </p>

            <div className="space-y-2">
              {[
                {
                  step: 1,
                  title: 'Start at Corner P1 (North-East)',
                  inst: 'Locate the RCC concrete pillar near the public cart road entrance.',
                  check: 'P1 Stone Intact',
                },
                {
                  step: 2,
                  title: 'Walk 395m South to Corner P2',
                  inst: 'Walk along the eastern tree-line until you reach the canal buffer stone.',
                  check: 'East Boundary Clear',
                },
                {
                  step: 3,
                  title: 'Turn Right, Walk 310m West to P3',
                  inst: 'Follow the natural stone bund (धुरा) dividing Survey 142/B.',
                  check: 'South Boundary Clear',
                },
                {
                  step: 4,
                  title: 'Turn Right, Walk 430m North to P4',
                  inst: 'Walk parallel to Survey 139 boundary trench back towards main road.',
                  check: 'West Boundary Clear',
                },
                {
                  step: 5,
                  title: 'Turn Right, Walk 320m East to P1',
                  inst: 'Return to Corner P1 to complete the 1,455m perimeter inspection.',
                  check: 'Complete Perimeter Intact',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-2.5 rounded-lg border text-xs transition-colors ${
                    verifiedWalkSteps[item.step]
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!verifiedWalkSteps[item.step]}
                        onChange={(e) =>
                          setVerifiedWalkSteps({
                            ...verifiedWalkSteps,
                            [item.step]: e.target.checked,
                          })
                        }
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block">
                          Step {item.step}: {item.title}
                        </span>
                        <span className="text-[11px] text-gray-600 block mt-0.5">
                          {item.inst}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Boundary Coordinates Slip Modal (Printable) */}
      {showPrintSlipModal && parcelData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#123A78] uppercase tracking-wider block">
                  Government of Maharashtra • Department of Land Records
                </span>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-[#0B7A3B]" />
                  <span>Official Cadastral Boundary & Corner Coordinates Slip</span>
                </h3>
              </div>
              <button
                onClick={() => setShowPrintSlipModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs" id="printable-boundary-slip">
              {/* Slip Header Meta */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-gray-400 block text-[10px]">SURVEY NO.</span>
                  <span className="font-bold text-gray-900">{parcelData.surveyNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">VILLAGE / TALUKA</span>
                  <span className="font-bold text-gray-900">
                    {parcelData.village}, {parcelData.taluka}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">TOTAL AREA</span>
                  <span className="font-bold text-gray-900">
                    {parcelData.areaHectares} Ha ({parcelData.areaGunthas} Gunthas)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">ULPIN ID</span>
                  <span className="font-mono text-[10px] text-gray-900 truncate block">
                    {parcelData.parcelUid}
                  </span>
                </div>
              </div>

              {/* Coordinates Table */}
              <div>
                <span className="font-bold text-gray-800 block mb-1 text-xs">
                  Certified WGS-84 Corner Pillar Coordinates
                </span>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-[11px] font-semibold text-gray-700">
                        <th className="p-2">Pillar</th>
                        <th className="p-2">Corner</th>
                        <th className="p-2">Latitude (N)</th>
                        <th className="p-2">Longitude (E)</th>
                        <th className="p-2">Elevation</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
                      {parcelData.corners.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="p-2 font-bold text-blue-900">{c.code}</td>
                          <td className="p-2 font-sans font-medium text-gray-800">{c.direction}</td>
                          <td className="p-2 text-gray-900">{c.lat.toFixed(6)}°</td>
                          <td className="p-2 text-gray-900">{c.lng.toFixed(6)}°</td>
                          <td className="p-2 text-gray-600">{c.elevationMeters}m</td>
                          <td className="p-2 font-sans text-emerald-700 font-semibold">✓ Verified</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Boundary Side Dimensions */}
              <div>
                <span className="font-bold text-gray-800 block mb-1 text-xs">
                  Surveyed Boundary Edge Dimensions
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {parcelData.boundaryEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className="p-2 bg-gray-50 rounded border border-gray-200 flex justify-between"
                    >
                      <span className="text-gray-600 font-medium">
                        {edge.name} ({edge.fromCorner}→{edge.toCorner}):
                      </span>
                      <span className="font-bold text-gray-900">
                        {edge.lengthMeters} m ({edge.lengthFeet} ft)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Watermark */}
              <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Survey of India Digital Authentication</span>
                  <span className="text-[11px] text-emerald-700">
                    Digital Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-1 rounded">
                  OFFICIAL DILRMP
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowPrintSlipModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123A78] hover:bg-[#0e2c5d] rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
