import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  Download,
  Share2,
  Layers,
  History,
  ShieldCheck,
  Building,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface PublicParcelIntelligenceViewProps {
  parcelId?: string;
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const PublicParcelIntelligenceView: React.FC<PublicParcelIntelligenceViewProps> = ({
  parcelId = 'IN-MH-PUN-HAV-2024-00142-A',
  onNavigate,
  language,
}) => {
  const [parcelData, setParcelData] = useState<any>(null);
  const [mapLayer, setMapLayer] = useState<'CADASTRAL' | 'SATELLITE'>('CADASTRAL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/citizen/trust/${parcelId}`)
      .then((res) => res.json())
      .then((data) => {
        setParcelData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [parcelId]);

  if (loading || !parcelData) {
    return (
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-4 border-[#123A78] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-700">Loading Cadastral Parcel Dossier...</p>
      </div>
    );
  }

  const nearbyLandmarks = [
    { name: 'Mutha Canal Feeder Branch', distance: '120 meters East', clearance: '50m Statutory Buffer Clear' },
    { name: 'Wagholi Gram Panchayat Office', distance: '850 meters West', type: 'Administrative Node' },
    { name: 'Zilla Parishad Primary School', distance: '400 meters North', type: 'Public Facility' },
    { name: 'MSEDCL 33kV Electrical Substation', distance: '1.2 km South', type: 'Infrastructure Buffer' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
              Public Cadastral Intelligence
            </span>
            <span className="font-mono text-xs text-gray-500">
              ULPIN: {parcelData.parcelUid}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Survey No. {parcelData.surveyNumber} ({parcelData.village}, Pune)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Official Land Intelligence Summary • Sub-Registrar Jurisdiction: Haveli 4
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('timeline', parcelData.parcelUid)}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
          >
            <History className="w-3.5 h-3.5" /> 70-Yr Lineage
          </button>
          <button
            onClick={() => onNavigate('trust', parcelData.parcelUid)}
            className="bg-[#0B7A3B] hover:bg-[#096330] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" /> Trust Score 98/100
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns - Left Details & Right Map Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Parameters Table */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Land Holding Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">REGISTERED HOLDER</span>
                <span className="font-bold text-gray-900 text-sm">{parcelData.maskedOwnerName}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Masked for privacy</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">TOTAL AREA RECORDED</span>
                <span className="font-bold text-gray-900 text-sm">
                  {parcelData.areaHectares} Ha (~73.6 Gunthas)
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">Survey of India RTK</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">LAND CLASSIFICATION</span>
                <span className="font-bold text-gray-900 text-sm">Jirayat (Dry Crop)</span>
                <span className="text-[10px] text-blue-700 block mt-0.5">Agricultural Khatedar</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">TALUKA & DISTRICT</span>
                <span className="font-bold text-gray-900">Haveli, Pune</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">Circle: Wagholi</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">ENCUMBRANCE STATUS</span>
                <span className="font-bold text-[#0B7A3B]">NIL (Zero Liens)</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Bank loans cleared</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px]">DISPUTE / LITIGATION</span>
                <span className="font-bold text-[#0B7A3B]">Clean Title</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Zero stay orders</span>
              </div>
            </div>
          </div>

          {/* Environmental & Spatial Compliance */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
              <span>Nearby Infrastructure & Buffer Clearances</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                All Buffers Compliant
              </span>
            </h3>

            <div className="space-y-2">
              {nearbyLandmarks.map((lm, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900 block">{lm.name}</span>
                      <span className="text-gray-500 text-[11px]">{lm.distance}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {lm.clearance || lm.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: GIS Map Preview Box */}
        <div className="space-y-4">
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#123A78]" /> Cadastral GIS Preview
              </span>

              {/* Layer switch */}
              <div className="flex bg-gray-100 p-0.5 rounded text-[10px] font-bold">
                <button
                  onClick={() => setMapLayer('CADASTRAL')}
                  className={`px-2 py-0.5 rounded ${
                    mapLayer === 'CADASTRAL' ? 'bg-[#123A78] text-white' : 'text-gray-600'
                  }`}
                >
                  Cadastral
                </button>
                <button
                  onClick={() => setMapLayer('SATELLITE')}
                  className={`px-2 py-0.5 rounded ${
                    mapLayer === 'SATELLITE' ? 'bg-[#123A78] text-white' : 'text-gray-600'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Simulated Interactive Map Screen */}
            <div
              className={`h-56 rounded-lg p-3 text-white flex flex-col justify-between relative overflow-hidden border ${
                mapLayer === 'SATELLITE' ? 'bg-slate-900' : 'bg-emerald-950'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="bg-black/60 px-1.5 py-0.5 rounded">18.5793° N, 73.9812° E</span>
                <span className="bg-emerald-700/80 px-1.5 py-0.5 rounded">ETS Survey Peaked</span>
              </div>

              {/* Boundary SVG Outline */}
              <div className="border-2 border-emerald-400 bg-emerald-400/20 p-6 rounded-lg text-center backdrop-blur-2xs">
                <span className="font-bold text-sm block">Gat No. 142/1</span>
                <span className="text-[10px] text-emerald-200">1.84 Hectares • Drip Irrigated</span>
              </div>

              <div className="text-[9px] text-gray-300 flex justify-between bg-black/50 p-1 rounded">
                <span>Cartosat-3 High Res Layer</span>
                <span>Zero Buffer Violation</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('map')}
              className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#123A78] text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Open Full GIS Map Studio <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs space-y-2 text-xs">
            <span className="font-bold text-gray-800 block mb-2">Available Certified Records</span>

            <button
              onClick={() => onNavigate('wallet')}
              className="w-full bg-[#123A78] hover:bg-[#0e2c5d] text-white p-2.5 rounded-lg font-semibold flex items-center justify-between transition-colors shadow-2xs"
            >
              <span>Download Digitally Signed 7/12 RoR</span>
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('trust', parcelData.parcelUid)}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 p-2.5 rounded-lg font-semibold flex items-center justify-between transition-colors"
            >
              <span>View Verification Audit Certificate</span>
              <ShieldCheck className="w-4 h-4 text-[#0B7A3B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
