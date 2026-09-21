import React, { useState, useEffect } from 'react';
import {
  User as UserType,
} from '../types';
import {
  LandParcelDetail,
  DashboardStats,
  RecentVerificationItem,
} from '../types/landRecords';
import {
  FileText,
  Upload,
  Camera,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Building,
  Layers,
  MapPin,
  FileCheck,
  Compass,
  Cpu,
  RefreshCw,
  Eye,
  Download,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserType;
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  onNavigateToUpload: () => void;
  onNavigateToScanner: () => void;
  onNavigateToQueue: () => void;
  onNavigateToGis: () => void;
  onNavigateToParcelDna: () => void;
  onNavigateToFraud: () => void;
  onNavigateToMultiAgent: () => void;
  onNavigateToMutation: () => void;
  onNavigateToVoice: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToTrustScore?: () => void;
  onNavigateToReports: () => void;
  onNavigateToApprovals: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToAudit: () => void;
  onOpenReportModal: (parcel: LandParcelDetail) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  parcels,
  selectedParcelId,
  onSelectParcel,
  onNavigateToUpload,
  onNavigateToScanner,
  onNavigateToQueue,
  onNavigateToGis,
  onNavigateToParcelDna,
  onNavigateToFraud,
  onNavigateToMultiAgent,
  onNavigateToMutation,
  onNavigateToVoice,
  onNavigateToTimeline,
  onNavigateToTrustScore,
  onNavigateToReports,
  onNavigateToApprovals,
  onNavigateToSecurity,
  onNavigateToAudit,
  onOpenReportModal,
}) => {
  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('ALL');

  // Stats State
  const [stats, setStats] = useState<DashboardStats>({
    todayUploads: {
      total: 142,
      ror712Count: 88,
      ror8aCount: 24,
      saleDeedCount: 18,
      mutationCount: 12,
    },
    pendingVerification: {
      total: 37,
      autoApproved: 26,
      needsHumanReview: 8,
      flaggedCritical: 3,
    },
    highRiskDocumentsCount: 3,
    activeFraudAlertsCount: 4,
    recentMutations: [
      {
        id: 'mut-101',
        mutationNumber: '918',
        village: 'Wagholi',
        applicantName: 'Rameshwar Kisan Patil',
        type: 'SUCCESSION',
        status: 'PENDING_SANCTION',
        date: '2026-03-24',
      },
      {
        id: 'mut-102',
        mutationNumber: '482',
        village: 'Malegaon Khurd',
        applicantName: 'Vikram Suresh Deshmukh',
        type: 'SALE_DEED',
        status: 'DISPUTED_STAY',
        date: '2026-03-23',
      },
      {
        id: 'mut-103',
        mutationNumber: '215',
        village: 'Paud',
        applicantName: 'Sunil Mahadev Jagtap',
        type: 'PARTITION',
        status: 'APPROVED',
        date: '2026-03-22',
      },
      {
        id: 'mut-104',
        mutationNumber: '704',
        village: 'Chakan',
        applicantName: 'Bharat Forge Industrial Ltd',
        type: 'SALE_DEED',
        status: 'APPROVED',
        date: '2026-03-21',
      },
    ],
    districtProgress: {
      districtName: 'Pune',
      villagesDigitized: 1420,
      totalVillages: 1480,
      completionPercentage: 95.9,
      geoReferencedParcels: 1842900,
    },
  });

  // Recent Verifications Stream State
  const [recentStream, setRecentStream] = useState<RecentVerificationItem[]>([
    {
      id: 'stream-1',
      documentName: 'WAGHOLI_GAT_142A_ROR.pdf',
      surveyNumber: '142/A',
      village: 'Wagholi',
      taluka: 'Haveli',
      uploadedBy: 'Patwari Rajesh Shinde',
      timestamp: '12 mins ago',
      confidence: 99.4,
      status: 'AUTO_APPROVED',
      fraudProbability: 2.1,
      parcelId: 'p-001',
    },
    {
      id: 'stream-2',
      documentName: 'MALEGAON_GAT_309_DEED.pdf',
      surveyNumber: '309/2',
      village: 'Malegaon Khurd',
      taluka: 'Baramati',
      uploadedBy: 'Sub-Registrar Baramati',
      timestamp: '24 mins ago',
      confidence: 68.2,
      status: 'FLAGGED_FRAUD',
      fraudProbability: 92.4,
      parcelId: 'p-002',
    },
    {
      id: 'stream-3',
      documentName: 'PAUD_GAT_78_2_INSPECTION.pdf',
      surveyNumber: '78/2',
      village: 'Paud',
      taluka: 'Mulshi',
      uploadedBy: 'Circle Officer Mulshi',
      timestamp: '41 mins ago',
      confidence: 86.5,
      status: 'NEEDS_REVIEW',
      fraudProbability: 44.0,
      parcelId: 'p-003',
    },
    {
      id: 'stream-4',
      documentName: 'CHAKAN_GAT_504_INDUSTRIAL_LEASE.pdf',
      surveyNumber: '504',
      village: 'Chakan',
      taluka: 'Khed',
      uploadedBy: 'MIDC Land Acquisition Officer',
      timestamp: '1 hour ago',
      confidence: 98.7,
      status: 'AUTO_APPROVED',
      fraudProbability: 3.5,
      parcelId: 'p-004',
    },
  ]);

  // Fetch real stats on mount
  useEffect(() => {
    fetch('/api/land-records/dashboard-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.todayUploads) {
          setStats(data);
        }
      })
      .catch((err) => console.warn('Using seeded dashboard stats.'));
  }, []);

  // Filtered parcels based on search bar
  const filteredParcels = parcels.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      p.surveyNumber.toLowerCase().includes(query) ||
      p.khataNumber.toLowerCase().includes(query) ||
      p.ownerName.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query) ||
      p.parcelUid.toLowerCase().includes(query);

    const matchesVillage = selectedVillageFilter === 'ALL' || p.village === selectedVillageFilter;
    return matchesQuery && matchesVillage;
  });

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Officer Clearance & Department Status Banner */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#D8DEE8] pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#123A78] text-white flex items-center justify-center font-bold text-2xl shadow-2xs shrink-0">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">{user.fullName}</h1>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-[#123A78] font-bold text-[11px] rounded uppercase">
                    {user.roleType.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-[#5A6878] font-medium mt-0.5">
                  Sub-Divisional Magistrate &amp; Tehsildar &bull; Haveli Revenue Division, Pune
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={onNavigateToVoice}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#123A78] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Rural Voice Search</span>
              </button>
              <button
                onClick={onNavigateToSecurity}
                className="px-3 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Security</span>
              </button>
              <button
                onClick={onNavigateToAudit}
                className="px-3 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Quick Details Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-[#5A6878] block text-[11px]">Officer Employee ID:</span>
              <span className="font-mono font-bold text-[#1C2733]">
                {user.employeeId || 'MH-REV-HAV-2024-081'}
              </span>
            </div>
            <div>
              <span className="text-[#5A6878] block text-[11px]">Revenue Sub-Division:</span>
              <span className="font-semibold text-[#1C2733]">Haveli Division (Pune Collectorate)</span>
            </div>
            <div>
              <span className="text-[#5A6878] block text-[11px]">AI Cadastre Gateway:</span>
              <span className="font-semibold text-[#123A78]">v3.4.1 (PaddleOCR + ISRO Bhuvan)</span>
            </div>
            <div>
              <span className="text-[#5A6878] block text-[11px]">Session Authentication:</span>
              <span className="font-semibold text-[#0B7A3B] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DSC Class-3 2FA Certified</span>
              </span>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS BAR (6 Essential Government Tools) */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-[#123A78] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Officer Operational Quick Actions</span>
            </h2>
            <span className="text-[11px] text-gray-500">Press key shortcuts or click directly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={onNavigateToUpload}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-blue-100 text-[#123A78] flex items-center justify-center mb-2 group-hover:bg-[#123A78] group-hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-[#123A78]">
                Upload Record
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Batch PDF / 7-12</div>
            </button>

            <button
              onClick={onNavigateToScanner}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-blue-100 text-[#123A78] flex items-center justify-center mb-2 group-hover:bg-[#123A78] group-hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-[#123A78]">
                Open Scanner
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Mobile Camera &amp; Desk</div>
            </button>

            <button
              onClick={onNavigateToQueue}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-emerald-100 text-[#0B7A3B] flex items-center justify-center mb-2 group-hover:bg-[#0B7A3B] group-hover:text-white transition-colors">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-[#0B7A3B]">
                Verify AI Queue
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">37 In Pending Queue</div>
            </button>

            <button
              onClick={onNavigateToGis}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-indigo-700">
                Open GIS Map
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">ISRO Bhuvan &amp; Sat</div>
            </button>

            <button
              onClick={onNavigateToMultiAgent}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-purple-700">
                Multi-Agent Hub
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">5 AI Cadre Officers</div>
            </button>

            <button
              onClick={onNavigateToReports}
              className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#123A78] rounded-lg text-left transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded bg-amber-100 text-[#B26A00] flex items-center justify-center mb-2 group-hover:bg-[#B26A00] group-hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#1C2733] group-hover:text-[#B26A00]">
                DILRMP Reports
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">Export CSV &amp; Stats</div>
            </button>

            {onNavigateToTimeline && (
              <button
                onClick={onNavigateToTimeline}
                className="p-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-600 rounded-lg text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:bg-amber-700 group-hover:text-white transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#1C2733] group-hover:text-amber-800">
                  AI Land Timeline
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">1950 &mdash; Present Archive</div>
              </button>
            )}

            {onNavigateToTrustScore && (
              <button
                onClick={onNavigateToTrustScore}
                className="p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-[#0B7A3B] rounded-lg text-left transition-all group shadow-2xs"
              >
                <div className="w-8 h-8 rounded bg-emerald-100 text-[#0B7A3B] flex items-center justify-center mb-2 group-hover:bg-[#0B7A3B] group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#1C2733] group-hover:text-[#0B7A3B]">
                  Citizen Trust Score
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Verification Certificate</div>
              </button>
            )}
          </div>
        </div>

        {/* 6 CORE DASHBOARD WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* WIDGET 1: Today's Uploads */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                1. Today's Ingestion &amp; Uploads
              </span>
              <span className="text-xl font-mono font-extrabold text-[#123A78]">
                {stats.todayUploads.total}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">&bull; 7/12 RoR Extracts (सातबारा):</span>
                <span className="font-mono font-bold text-gray-800">{stats.todayUploads.ror712Count}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">&bull; 8A Khata Hold-Sheets (८-अ):</span>
                <span className="font-mono font-bold text-gray-800">{stats.todayUploads.ror8aCount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">&bull; Registered Deeds (खरेदी खत):</span>
                <span className="font-mono font-bold text-gray-800">{stats.todayUploads.saleDeedCount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">&bull; Mutations / Form 12 (फेरफार):</span>
                <span className="font-mono font-bold text-gray-800">{stats.todayUploads.mutationCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onNavigateToUpload}
                className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
              >
                <span>Open Ingestion Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WIDGET 2: Pending Verification Queue */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                2. Pending Verification Queue
              </span>
              <span className="text-xl font-mono font-extrabold text-[#1C2733]">
                {stats.pendingVerification.total}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-emerald-50 rounded flex items-center justify-between">
                <span className="text-[#0B7A3B] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Auto-Approved (&gt;95%)</span>
                </span>
                <span className="font-mono font-bold text-[#0B7A3B]">
                  {stats.pendingVerification.autoApproved}
                </span>
              </div>

              <div className="p-2 bg-amber-50 rounded flex items-center justify-between">
                <span className="text-[#B26A00] font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Needs Human Review</span>
                </span>
                <span className="font-mono font-bold text-[#B26A00]">
                  {stats.pendingVerification.needsHumanReview}
                </span>
              </div>

              <div className="p-2 bg-red-50 rounded flex items-center justify-between">
                <span className="text-[#B42318] font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged / High Risk</span>
                </span>
                <span className="font-mono font-bold text-[#B42318]">
                  {stats.pendingVerification.flaggedCritical}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onNavigateToQueue}
                className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
              >
                <span>Launch Verification Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WIDGET 3: High Risk Documents */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                3. High Risk Documents (&lt;70%)
              </span>
              <span className="text-xl font-mono font-extrabold text-[#B42318]">
                {stats.highRiskDocumentsCount}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Documents flagged with localized font anomalies, ink density alterations, or low TrOCR Devanagari recognition.
            </p>

            <div className="p-2.5 bg-red-50 rounded border border-red-200 text-xs space-y-1">
              <div className="font-bold text-[#B42318] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Priority Review Required:</span>
              </div>
              <div className="text-[11px] text-gray-700">
                Gat 309/2 (Malegaon Khurd) &mdash; Area modification in 7/12 RoR flagged by byte forensic audit.
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onSelectParcel('p-002');
                  onNavigateToFraud();
                }}
                className="text-xs font-bold text-[#B42318] hover:underline flex items-center gap-1"
              >
                <span>Inspect Flagged Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WIDGET 4: Fraud Alerts */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                4. Forensic Fraud Alerts
              </span>
              <span className="px-2 py-0.5 bg-red-100 text-[#B42318] font-bold text-xs rounded uppercase">
                {stats.activeFraudAlertsCount} ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">Forged Tehsildar Stamp Seal:</span>
                <span className="font-mono font-bold text-[#B42318]">1 Case</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-600">Disputed Civil Suit Stay:</span>
                <span className="font-mono font-bold text-[#B42318]">2 Cases</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Boundary Encroachment (GIS):</span>
                <span className="font-mono font-bold text-[#B26A00]">1 Case</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onNavigateToFraud}
                className="text-xs font-bold text-[#B42318] hover:underline flex items-center gap-1"
              >
                <span>Open Fraud &amp; Dispute Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WIDGET 5: Recent Mutations */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                5. Recent Mutations (फेरफार)
              </span>
              <button
                onClick={onNavigateToMutation}
                className="text-xs font-bold text-[#123A78] hover:underline"
              >
                Simulator &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {stats.recentMutations.slice(0, 3).map((mut) => (
                <div key={mut.id} className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1C2733]">Ferfar No. {mut.mutationNumber}</div>
                    <div className="text-[11px] text-gray-500">{mut.applicantName} ({mut.village})</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                      mut.status === 'APPROVED'
                        ? 'bg-emerald-100 text-[#0B7A3B]'
                        : mut.status === 'DISPUTED_STAY'
                        ? 'bg-red-100 text-[#B42318]'
                        : 'bg-amber-100 text-[#B26A00]'
                    }`}
                  >
                    {mut.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onNavigateToMutation}
                className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
              >
                <span>Launch Mutation Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WIDGET 6: District Progress */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                6. DILRMP District Progress
              </span>
              <span className="font-mono font-bold text-xs text-[#0B7A3B]">
                {stats.districtProgress.completionPercentage}% Done
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-gray-600 mb-1 text-[11px]">
                  <span>Villages Fully Digitized:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {stats.districtProgress.villagesDigitized} / {stats.districtProgress.totalVillages}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0B7A3B] h-full"
                    style={{ width: `${stats.districtProgress.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between pt-1 text-gray-600 text-[11px]">
                <span>Geo-Referenced Parcels:</span>
                <span className="font-mono font-bold text-[#123A78]">
                  {stats.districtProgress.geoReferencedParcels.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onNavigateToReports}
                className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
              >
                <span>View Full District Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH BAR & PARCEL INTELLIGENCE FINDER */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#123A78] uppercase tracking-wider">
                Cadastral Parcel Search &amp; DNA Dossier Finder
              </h3>
              <p className="text-xs text-gray-500">
                Search across all 1,480 digitized villages by Survey / Gat No, Khata No, Landowner Name, or UID.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedVillageFilter}
                onChange={(e) => setSelectedVillageFilter(e.target.value)}
                className="p-1.5 bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-[#1C2733]"
              >
                <option value="ALL">All Villages (Haveli &amp; Baramati)</option>
                <option value="Wagholi">Wagholi (वाघोली)</option>
                <option value="Malegaon Khurd">Malegaon Khurd (माळेगाव)</option>
                <option value="Paud">Paud (पौड)</option>
                <option value="Chakan">Chakan (चाकण)</option>
                <option value="Hadapsar">Hadapsar (हडपसर)</option>
              </select>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Survey No (e.g. 142/A), Khata No (e.g. 884), Landowner Name (e.g. Patil), or UID..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#123A78]"
            />
          </div>

          {/* Parcel Matches Results Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#123A78] text-white">
                  <th className="p-2.5 font-bold">Survey / Gat</th>
                  <th className="p-2.5 font-bold">Village &amp; Taluka</th>
                  <th className="p-2.5 font-bold">Landowner Name</th>
                  <th className="p-2.5 font-bold">Area</th>
                  <th className="p-2.5 font-bold text-center">Trust Score</th>
                  <th className="p-2.5 font-bold text-center">Status</th>
                  <th className="p-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-2.5 font-bold text-[#123A78] font-mono">{parcel.surveyNumber}</td>
                    <td className="p-2.5 text-gray-700">
                      {parcel.village}, {parcel.taluka}
                    </td>
                    <td className="p-2.5 font-semibold text-[#1C2733]">{parcel.ownerName}</td>
                    <td className="p-2.5 font-mono text-gray-600">{parcel.landAreaHa} Ha</td>
                    <td className="p-2.5 text-center">
                      <span className="font-mono font-bold text-xs text-[#0B7A3B]">
                        {parcel.trust.overallScore}%
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          parcel.riskLevel === 'CLEAN'
                            ? 'bg-emerald-100 text-[#0B7A3B]'
                            : parcel.riskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-[#B26A00]'
                            : 'bg-red-100 text-[#B42318]'
                        }`}
                      >
                        {parcel.riskLevel}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectParcel(parcel.id);
                            onNavigateToParcelDna();
                          }}
                          className="px-2.5 py-1 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-[11px] font-bold rounded shadow-2xs"
                        >
                          View 360° DNA
                        </button>
                        <button
                          onClick={() => onOpenReportModal(parcel)}
                          className="p-1 text-gray-500 hover:text-[#123A78]"
                          title="Print Certified Inspection Report"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE RECENT VERIFICATION STREAM */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
              <h3 className="text-sm font-bold text-[#1C2733]">
                Live AI Verification &amp; Ingestion Stream
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-500">Auto-refresh active (PaddleOCR v4)</span>
          </div>

          <div className="divide-y divide-gray-200">
            {recentStream.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#123A78] flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1C2733]">{item.documentName}</span>
                      <span className="text-[10px] font-mono text-gray-500">
                        ({item.village} &bull; Gat {item.surveyNumber})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Ingested by {item.uploadedBy} &bull; {item.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-[11px] font-mono font-bold text-gray-700">
                      OCR Confidence: {item.confidence}%
                    </div>
                    <div
                      className={`text-[10px] font-mono font-bold ${
                        item.fraudProbability > 50 ? 'text-[#B42318]' : 'text-[#0B7A3B]'
                      }`}
                    >
                      Fraud Probability: {item.fraudProbability}%
                    </div>
                  </div>

                  {item.status === 'AUTO_APPROVED' && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded uppercase">
                      Auto Approved
                    </span>
                  )}
                  {item.status === 'NEEDS_REVIEW' && (
                    <span className="px-2.5 py-1 bg-amber-100 text-[#B26A00] text-[10px] font-bold rounded uppercase">
                      Needs Review
                    </span>
                  )}
                  {item.status === 'FLAGGED_FRAUD' && (
                    <span className="px-2.5 py-1 bg-red-100 text-[#B42318] text-[10px] font-bold rounded uppercase">
                      Flagged Fraud
                    </span>
                  )}

                  <button
                    onClick={() => {
                      onSelectParcel(item.parcelId);
                      onNavigateToQueue();
                    }}
                    className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg shadow-2xs"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
