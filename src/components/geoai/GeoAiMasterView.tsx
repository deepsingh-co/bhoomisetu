import React, { useState } from 'react';
import {
  Compass,
  Layers,
  GitFork,
  TrendingUp,
  AlertTriangle,
  Smartphone,
  Building2,
  Bell,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { BhuvanMapEngine } from './BhuvanMapEngine';
import { VillageDigitalTwinView } from './VillageDigitalTwinView';
import { LandIntelligenceGraphView } from './LandIntelligenceGraphView';
import { SatelliteComparisonStudioView } from './SatelliteComparisonStudioView';
import { EncroachmentCenterView } from './EncroachmentCenterView';
import { GeoInspectionMissionView } from './GeoInspectionMissionView';
import { DistrictCommandCenterView } from './DistrictCommandCenterView';
import { EnvironmentalAlertsView } from './EnvironmentalAlertsView';
import { GeoParcelFeature, EncroachmentCase } from '../../types/geoAi';
import { MOCK_GEO_PARCELS } from '../../data/geoAiData';

interface GeoAiMasterViewProps {
  onOpenInspectParcelModal?: (parcelId: string) => void;
}

export const GeoAiMasterView: React.FC<GeoAiMasterViewProps> = ({
  onOpenInspectParcelModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'map' | 'twin' | 'graph' | 'satellite' | 'encroachment' | 'inspection' | 'collector' | 'environment'
  >('map');

  const [selectedParcelId, setSelectedParcelId] = useState<string>('IN-MH-PUN-BAR-2023-00088-B');

  const handleSelectParcel = (id: string) => {
    setSelectedParcelId(id);
  };

  const handleRequisitionInspection = (encroachment: EncroachmentCase) => {
    setSelectedParcelId(encroachment.parcelUid);
    setActiveTab('inspection');
  };

  const handleOpenDna = (parcel: GeoParcelFeature) => {
    if (onOpenInspectParcelModal) {
      onOpenInspectParcelModal(parcel.id);
    }
  };

  const navItems = [
    { id: 'map', label: 'Bhuvan GIS Engine', icon: Compass },
    { id: 'twin', label: 'Village Digital Twin', icon: Layers },
    { id: 'graph', label: 'Knowledge Graph', icon: GitFork },
    { id: 'satellite', label: 'Satellite Comparison', icon: TrendingUp },
    { id: 'encroachment', label: 'Encroachment Center', icon: AlertTriangle },
    { id: 'inspection', label: 'Field Mission App', icon: Smartphone },
    { id: 'collector', label: 'Collector Command', icon: Building2 },
    { id: 'environment', label: 'Environmental Alerts', icon: Bell },
  ];

  return (
    <div className="space-y-4">
      {/* Official Government of India NIC × ISRO Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#123A78] flex items-center justify-center text-white font-bold border border-blue-900 shadow-2xs">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#123A78] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                GOVERNMENT OF INDIA • ISRO × NIC
              </span>
              <span className="text-xs font-bold text-[#0B7A3B] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PM GatiShakti Verified
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-[#123A78] tracking-tight">
              Bhulekh AI v3 — GeoAI Spatial Intelligence Platform (Module 3)
            </h1>
            <p className="text-xs text-gray-600">
              Department of Land Resources (DoLR) • National Remote Sensing Centre (NRSC) • Bhuvan Cadastral 0.28m
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-md px-3 py-1.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0B7A3B] animate-pulse" />
            <span className="text-gray-700 font-medium">NavIC / Cartosat-3 Realtime Feed:</span>
            <span className="font-bold text-[#123A78]">Online</span>
          </div>
        </div>
      </div>

      {/* Module 3 Government Sub-Navigation Bar */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-1 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#123A78] text-white shadow-2xs'
                    : 'text-gray-700 hover:bg-[#F5F7FA] hover:text-[#123A78]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Sub-system Component */}
      <div className="min-h-[700px]">
        {activeTab === 'map' && (
          <BhuvanMapEngine
            selectedParcelId={selectedParcelId}
            onSelectParcel={handleSelectParcel}
            onOpenInspectParcel={handleOpenDna}
          />
        )}

        {activeTab === 'twin' && (
          <VillageDigitalTwinView
            onSelectParcel={handleSelectParcel}
            onNavigateToTimeline={() => {
              if (onOpenInspectParcelModal) onOpenInspectParcelModal(selectedParcelId);
            }}
            onNavigateToSatelliteCompare={() => setActiveTab('satellite')}
          />
        )}

        {activeTab === 'graph' && (
          <LandIntelligenceGraphView onSelectParcel={handleSelectParcel} />
        )}

        {activeTab === 'satellite' && <SatelliteComparisonStudioView />}

        {activeTab === 'encroachment' && (
          <EncroachmentCenterView onRequisitionInspection={handleRequisitionInspection} />
        )}

        {activeTab === 'inspection' && <GeoInspectionMissionView />}

        {activeTab === 'collector' && <DistrictCommandCenterView />}

        {activeTab === 'environment' && (
          <EnvironmentalAlertsView
            onSelectParcel={(id) => {
              setSelectedParcelId(id);
              setActiveTab('map');
            }}
          />
        )}
      </div>
    </div>
  );
};
