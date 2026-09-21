import React, { useState, useEffect } from 'react';
import { NationalAdminOverviewData, NationalAdminTab } from '../../types/nationalAdmin';
import { NationalOverviewTab } from './NationalOverviewTab';
import { IndiaInteractiveGisMap } from './IndiaInteractiveGisMap';
import { StateAdminConsoleTab } from './StateAdminConsoleTab';
import { DistrictCollectorTab } from './DistrictCollectorTab';
import { OfficerManagementTab } from './OfficerManagementTab';
import { AiOperationsTab } from './AiOperationsTab';
import { FraudIntelligenceTab } from './FraudIntelligenceTab';
import { DisputeIntelligenceTab } from './DisputeIntelligenceTab';
import { DisasterEmergencyTab } from './DisasterEmergencyTab';
import { AuditTransparencyTab } from './AuditTransparencyTab';
import { AnalyticsReportsTab } from './AnalyticsReportsTab';
import { RoleMatrixTab } from './RoleMatrixTab';
import { DataQualityTab } from './DataQualityTab';
import { SystemSettingsTab } from './SystemSettingsTab';
import {
  LayoutDashboard,
  MapPin,
  Landmark,
  Building,
  Users,
  Cpu,
  AlertOctagon,
  Scale,
  Satellite,
  Lock,
  FileSpreadsheet,
  Shield,
  Database,
  Settings,
  ArrowLeft,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface AdminMasterViewProps {
  onBackToCitizenPortal?: () => void;
}

export const AdminMasterView: React.FC<AdminMasterViewProps> = ({ onBackToCitizenPortal }) => {
  const [activeTab, setActiveTab] = useState<NationalAdminTab>('national-overview');
  const [overviewData, setOverviewData] = useState<NationalAdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStateCode, setSelectedStateCode] = useState('MH');
  const [selectedDistrictId, setSelectedDistrictId] = useState('dist-mh-pune');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchOverviewData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard/overview');
      const data = await res.json();
      if (data.success) {
        setOverviewData(data.data);
      }
    } catch (err) {
      console.error('Failed to load national overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems: { id: NationalAdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'national-overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'gis-cadastre', label: 'National GIS Map', icon: MapPin },
    { id: 'state-console', label: 'State Console', icon: Landmark },
    { id: 'district-collector', label: 'District Collectorate', icon: Building },
    { id: 'officer-management', label: 'Officer HRMS', icon: Users },
    { id: 'ai-operations', label: 'AI Operations & Daemon', icon: Cpu, badge: '5 Online' },
    { id: 'fraud-intelligence', label: 'Fraud & Forensics', icon: AlertOctagon, badge: 'Alerts' },
    { id: 'dispute-intelligence', label: 'Disputes & Early Warning', icon: Scale },
    { id: 'disaster-monitoring', label: 'Satellite Hazards', icon: Satellite },
    { id: 'audit-transparency', label: 'Statutory Audit Ledger', icon: Lock },
    { id: 'analytics-reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
    { id: 'role-matrix', label: 'RBAC Access Matrix', icon: Shield },
    { id: 'data-quality', label: 'Data Quality Index', icon: Database },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col">
      {/* 1. National Apex Header (Official GoI Style) */}
      <header className="bg-white border-b-2 border-[#123A78] shadow-sm sticky top-0 z-40">
        <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Emblem & National Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-11 border border-gray-300 rounded bg-[#123A78] flex items-center justify-center text-white font-serif font-black text-sm shadow-inner shrink-0">
              GoI
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-800">
                  Government of India • भारत सरकार
                </span>
                <span className="text-[10px] font-semibold text-gray-400">|</span>
                <span className="text-[10px] font-bold text-[#123A78] uppercase">
                  National Informatics Centre (NIC)
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#123A78] tracking-tight leading-none mt-0.5">
                Bhulekh AI v3 — National Cadastral Command Center
              </h1>
            </div>
          </div>

          {/* Right: Officer Profile, Live IST Clock, Citizen Portal Switch */}
          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>
                {currentTime.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                {currentTime.toLocaleTimeString('en-IN')} IST
              </span>
            </div>

            {/* Officer Clearance Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50/70 border border-blue-200 rounded text-xs">
              <ShieldCheck className="w-4 h-4 text-[#0B7A3B]" />
              <div>
                <span className="font-bold text-gray-900 block leading-tight">
                  Shri Rajesh Kumar, IAS
                </span>
                <span className="text-[10px] text-gray-600 font-medium">
                  Super Admin (GoI) • Level 1 Clearance
                </span>
              </div>
            </div>

            {onBackToCitizenPortal && (
              <button
                onClick={onBackToCitizenPortal}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Citizen Portal
              </button>
            )}
          </div>
        </div>

        {/* 2. Horizontal Government Tab Bar (GatiShakti / CoWIN style) */}
        <div className="bg-[#123A78] text-white overflow-x-auto scrollbar-thin">
          <div className="max-w-[1700px] mx-auto px-4 flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition border-b-2 ${
                    isActive
                      ? 'bg-[#0E2C5B] text-white border-amber-400 font-black'
                      : 'text-blue-100 hover:bg-[#0E2C5B]/60 hover:text-white border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded font-bold bg-amber-400 text-gray-900">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Content Stage */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'national-overview' && (
          <NationalOverviewTab
            states={overviewData?.states || []}
            recentAudits={overviewData?.recentAudits || []}
            disasters={overviewData?.disasters || []}
            onSelectState={(code) => {
              setSelectedStateCode(code);
              setActiveTab('state-console');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'gis-cadastre' && (
          <div className="bg-white border border-gray-300 rounded shadow-sm p-4 space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#123A78]" />
                National Interactive GIS Cadastral Map
              </h2>
              <p className="text-xs text-gray-600">
                Click any State to inspect its cadastral digitization, parcels, and district breakdown
              </p>
            </div>

            <IndiaInteractiveGisMap
              states={overviewData?.states || []}
              selectedStateCode={selectedStateCode}
              onSelectState={(code) => {
                setSelectedStateCode(code);
                setActiveTab('state-console');
              }}
            />
          </div>
        )}

        {activeTab === 'state-console' && (
          <StateAdminConsoleTab
            states={overviewData?.states || []}
            selectedStateCode={selectedStateCode}
            onSelectState={setSelectedStateCode}
            onOpenDistrict={(distId) => {
              setSelectedDistrictId(distId);
              setActiveTab('district-collector');
            }}
          />
        )}

        {activeTab === 'district-collector' && (
          <DistrictCollectorTab
            districtId={selectedDistrictId}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'officer-management' && (
          <OfficerManagementTab states={overviewData?.states || []} />
        )}

        {activeTab === 'ai-operations' && <AiOperationsTab />}

        {activeTab === 'fraud-intelligence' && <FraudIntelligenceTab />}

        {activeTab === 'dispute-intelligence' && <DisputeIntelligenceTab />}

        {activeTab === 'disaster-monitoring' && (
          <DisasterEmergencyTab states={overviewData?.states || []} />
        )}

        {activeTab === 'audit-transparency' && <AuditTransparencyTab />}

        {activeTab === 'analytics-reports' && <AnalyticsReportsTab />}

        {activeTab === 'role-matrix' && <RoleMatrixTab />}

        {activeTab === 'data-quality' && <DataQualityTab />}

        {activeTab === 'system-settings' && <SystemSettingsTab />}
      </main>

      {/* 4. Official Government Footer */}
      <footer className="bg-white border-t border-gray-300 py-4 mt-12 text-xs text-gray-600">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Bhulekh AI v3</strong> — National Cadastral Command Center. Developed by National
            Informatics Centre (NIC) for the Ministry of Rural Development & Land Resources, Government of
            India.
          </div>
          <div className="text-gray-500 text-[11px]">
            Server Cluster: NIC MeghRaj Cloud (PostgreSQL 16 + PostGIS) • Build v3.4.1-gov
          </div>
        </div>
      </footer>
    </div>
  );
};
