import React, { useState, useEffect } from 'react';
import {
  Search,
  Mic,
  QrCode,
  FolderOpen,
  FileText,
  AlertCircle,
  FileEdit,
  HelpCircle,
  CheckCircle2,
  Clock,
  Download,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenDashboardViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  onNavigate,
  language,
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/citizen/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    {
      id: 'verified',
      label: 'Verified Land Records',
      value: `${dashboardData?.summary?.ownedCount ?? dashboardData?.parcels?.filter((p: any) => p.status === 'VERIFIED').length ?? 2} Parcels`,
      sublabel: `${dashboardData?.summary?.totalAreaHectares ?? '2.76'} Hectares Total Holding`,
      icon: CheckCircle2,
      color: 'text-[#0B7A3B]',
      bgColor: 'bg-emerald-50 border-emerald-200',
      action: () => onNavigate('portfolio'),
    },
    {
      id: 'pending',
      label: 'Pending Mutations',
      value: `${dashboardData?.summary?.pendingMutationCount ?? 1} Ferfar`,
      sublabel: 'Survey 88/4 Baramati (Heirship)',
      icon: Clock,
      color: 'text-[#F39C12]',
      bgColor: 'bg-amber-50 border-amber-200',
      action: () => onNavigate('portfolio'),
    },
    {
      id: 'certificates',
      label: 'Digital Certificates',
      value: `${(dashboardData?.parcels?.length || 2) + 3} Documents`,
      sublabel: '7/12 RoR & Trust Certificates',
      icon: FileText,
      color: 'text-[#123A78]',
      bgColor: 'bg-blue-50 border-blue-200',
      action: () => onNavigate('wallet'),
    },
    {
      id: 'corrections',
      label: 'Correction Requests',
      value: '2 Submitted',
      sublabel: '1 Under Field Verification',
      icon: FileEdit,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 border-purple-200',
      action: () => onNavigate('correction'),
    },
  ];

  const quickActions = [
    {
      id: 'universal-search',
      title: 'Search Land Record',
      description: 'Search by Survey, Khata, Khasra, Owner Name or Village',
      icon: Search,
      badge: 'Fast',
      action: () => onNavigate('search'),
    },
    {
      id: 'voice-search',
      title: 'Voice-Based Search',
      description: 'Rural voice search in Hindi, Marathi & English',
      icon: Mic,
      badge: 'Rural AI',
      badgeColor: 'bg-amber-100 text-amber-800',
      action: () => onNavigate('voice'),
    },
    {
      id: 'qr-scanner',
      title: 'Scan QR Certificate',
      description: 'Instant tamper check for 7/12 & land certificates',
      icon: QrCode,
      badge: 'Forensic Check',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => onNavigate('qr-verify'),
    },
    {
      id: 'land-portfolio',
      title: 'My Land Portfolio',
      description: 'View all your linked ancestral & purchased plots',
      icon: FolderOpen,
      action: () => onNavigate('portfolio'),
    },
    {
      id: 'track-application',
      title: 'Track Correction Status',
      description: 'Check status of field panchnama & Tehsildar orders',
      icon: Clock,
      action: () => onNavigate('correction'),
    },
    {
      id: 'grievance',
      title: 'Public Grievance Portal',
      description: 'Lodge complaints under Right to Public Services Act',
      icon: AlertCircle,
      action: () => onNavigate('grievance'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Official Government Notification Ticker */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-900 font-medium">
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
            DILRMP Notice
          </span>
          <span>
            Free digital download of digitally signed 7/12 RoR with QR verification is active. Zero stamp fees applicable for farmers.
          </span>
        </div>
        <button
          onClick={() => onNavigate('wallet')}
          className="text-xs text-amber-900 font-bold underline hover:text-amber-950 shrink-0 ml-3"
        >
          Download Now
        </button>
      </div>

      {/* Citizen Welcome & Summary Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#123A78]">
              Namaste, Rameshwar Patil
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar Linked
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Registered Citizen Landholder | Taluka: Haveli | District: Pune, Maharashtra
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('search')}
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" /> Search Land Record
          </button>
          <button
            onClick={() => onNavigate('voice')}
            className="bg-[#0B7A3B] hover:bg-[#096330] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4" /> Voice Search
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={stat.action}
              className={`p-4 rounded-xl border ${stat.bgColor} cursor-pointer hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 block">{stat.label}</span>
                  <span className="text-2xl font-bold text-gray-900 mt-1 block">{stat.value}</span>
                </div>
                <div className={`p-2 rounded-lg bg-white shadow-xs ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs text-gray-600">
                <span>{stat.sublabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#123A78]" /> Citizen Service Centers
          </h3>
          <span className="text-xs text-gray-500">Official Government Services</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={action.action}
                className="bg-white border border-[#D8DEE8] rounded-xl p-4.5 hover:border-[#123A78] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-[#123A78] group-hover:bg-[#123A78] group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#123A78] transition-colors">
                        {action.title}
                      </h4>
                      {action.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            action.badgeColor || 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Land Holdings Highlights */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B7A3B]" /> My Registered Land Holdings
            </h3>
            <p className="text-xs text-gray-500">Parcels linked to your verified Aadhaar & 7/12 records</p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-[#123A78] hover:underline flex items-center gap-1"
          >
            View Complete Portfolio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(dashboardData?.parcels && dashboardData.parcels.length > 0 ? dashboardData.parcels : [
            {
              id: 'parcel-1',
              parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
              surveyNumber: '142/1',
              village: 'Wagholi',
              taluka: 'Haveli',
              district: 'Pune',
              areaHectares: 1.84,
              trustScore: 98,
              status: 'VERIFIED',
              holdingType: 'Owned Agricultural Land',
              unencumbered: true,
            },
            {
              id: 'parcel-2',
              parcelUid: 'IN-MH-PUN-BAR-2023-00088-B',
              surveyNumber: '88/4',
              village: 'Malegaon Budruk',
              taluka: 'Baramati',
              district: 'Pune',
              areaHectares: 2.1,
              trustScore: 68,
              status: 'PENDING_MUTATION',
              holdingType: 'Inherited Holding (Mutation Pending)',
              unencumbered: false,
            },
          ]).map((parcel: any) => {
            const isPending = parcel.status === 'PENDING_MUTATION' || parcel.status === 'UNDER_REVIEW';
            const trustScore = parcel.trustScore || (parcel.status === 'VERIFIED' ? 98 : 74);
            const holdingType = parcel.holdingType || (isPending ? 'Inherited Holding (Mutation In Review)' : 'Owned Agricultural Land');

            return (
              <div
                key={parcel.id || parcel.parcelUid}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                  isPending ? 'border-amber-200 bg-amber-50/40' : 'border-emerald-200 bg-emerald-50/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isPending ? 'text-amber-800' : 'text-emerald-800'
                        }`}
                      >
                        {holdingType}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-0.5">
                        Survey No. {parcel.surveyNumber}, {parcel.village}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Taluka: {parcel.taluka} | District: {parcel.district || 'Pune'} | Area: {parcel.areaHectares || parcel.landAreaHa} Hectares ({Math.round((parcel.areaHectares || parcel.landAreaHa || 1) * 40)} Gunthas)
                      </p>
                      {parcel.ownerName && (
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                          Holder: {parcel.ownerName}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs ${
                          isPending ? 'bg-[#F39C12]' : 'bg-[#0B7A3B]'
                        }`}
                      >
                        {isPending ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>Trust Score {trustScore}/100</span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-3 bg-white p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                      isPending ? 'border-amber-100' : 'border-emerald-100'
                    }`}
                  >
                    <span className="text-gray-600">
                      {isPending
                        ? 'Notice Period Lapsed. Tehsildar Sanction Pending.'
                        : 'AI Verification: 100% OCR Match & Zero Encroachment'}
                    </span>
                    <span
                      className={`font-bold ${
                        isPending ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {isPending ? 'In Review' : 'Unencumbered'}
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center justify-between ${
                    isPending ? 'border-amber-100' : 'border-emerald-100'
                  }`}
                >
                  <button
                    onClick={() => onNavigate(isPending ? 'correction' : 'trust', parcel.parcelUid)}
                    className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                      isPending ? 'text-purple-700' : 'text-[#123A78]'
                    }`}
                  >
                    {isPending ? 'Track Ferfar Notice' : 'Inspect Trust Dossier'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('map', parcel.parcelUid)}
                      className="text-xs bg-[#0B7A3B] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#086330] flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                      title="View Real Satellite Boundary & Corners"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>GIS Satellite</span>
                    </button>
                    <button
                      onClick={() => onNavigate(isPending ? 'trust' : 'timeline', parcel.parcelUid)}
                      className="text-xs bg-[#123A78] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#0e2c5d] transition-colors"
                    >
                      {isPending ? 'View Details' : '70-Yr Timeline'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Trust & Service Guarantees */}
      <div className="bg-[#F8FAFC] border border-[#D8DEE8] rounded-xl p-5">
        <h4 className="text-sm font-bold text-[#123A78] uppercase tracking-wider mb-3">
          Government of India Public Guarantees
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#0B7A3B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block">NIC Cryptographic Security</span>
              All certificates carry SHA-256 digital seals anchored to the National Land Records Registry.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#123A78] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block">15-Day Statutory SLA</span>
              Under Right to Public Services Act, undisputed mutations are resolved within 15 working days.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#F39C12] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 block">Farmer Helpline 1800-11-8942</span>
              24x7 toll-free assistance for rural landowners in 12 regional languages.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
