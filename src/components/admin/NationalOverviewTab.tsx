import React from 'react';
import { NationalStateItem, NationalAuditItem, NationalDisasterAlertItem } from '../../types/nationalAdmin';
import {
  Landmark,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Satellite,
  Download,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface NationalOverviewTabProps {
  states: NationalStateItem[];
  recentAudits: NationalAuditItem[];
  disasters: NationalDisasterAlertItem[];
  onNavigateTab: (tab: any) => void;
  onSelectState: (stateCode: string) => void;
}

export const NationalOverviewTab: React.FC<NationalOverviewTabProps> = ({
  states,
  recentAudits,
  disasters,
  onNavigateTab,
  onSelectState,
}) => {
  const totalParcels = states.reduce((sum, s) => sum + s.totalParcels, 0);
  const verifiedParcels = states.reduce((sum, s) => sum + s.verifiedParcels, 0);
  const pendingParcels = states.reduce((sum, s) => sum + s.pendingParcels, 0);
  const totalFraud = states.reduce((sum, s) => sum + s.fraudCasesCount, 0);
  const totalDisputes = states.reduce((sum, s) => sum + s.activeDisputesCount, 0);
  const avgVerification = Number(((verifiedParcels / (totalParcels || 1)) * 100).toFixed(1));

  const sortedStates = [...states].sort((a, b) => b.verificationPercentage - a.verificationPercentage);
  const topStates = sortedStates.slice(0, 5);
  const actionStates = sortedStates.slice(-4).reverse();

  return (
    <div className="space-y-6">
      {/* Active Disaster / Emergency Notification Banner (if any) */}
      {disasters.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded text-red-700 mt-0.5">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase">
                  ISRO Bhuvan Emergency Alert
                </span>
                <span className="text-xs font-bold text-gray-700">{disasters[0].alertCode}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 mt-0.5">{disasters[0].description}</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Affected: {disasters[0].stateName} ({disasters[0].affectedDistricts.join(', ')}) •{' '}
                {disasters[0].affectedParcelsCount} Cadastral Parcels
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('disaster-emergency')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
          >
            Open Disaster Command
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parcels */}
        <div className="bg-white border border-gray-300 p-4 rounded shadow-sm hover:border-[#123A78] transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total National Parcels
            </span>
            <span className="p-1.5 bg-blue-50 text-[#123A78] rounded">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">
              {(totalParcels / 10000000).toFixed(2)} Cr
            </span>
            <span className="text-xs font-bold text-[#0B7A3B] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +1.8%
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">Across 28 States & 8 Union Territories</div>
        </div>

        {/* Verified Cadastre */}
        <div className="bg-white border border-gray-300 p-4 rounded shadow-sm hover:border-[#0B7A3B] transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Digitized & Verified RoR
            </span>
            <span className="p-1.5 bg-green-50 text-[#0B7A3B] rounded">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0B7A3B]">{avgVerification}%</span>
            <span className="text-xs font-medium text-gray-600">
              ({(verifiedParcels / 10000000).toFixed(2)} Cr Verified)
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Pending:{' '}
            <span className="font-semibold text-amber-600">{(pendingParcels / 10000000).toFixed(2)} Cr</span>
          </div>
        </div>

        {/* Fraud Intelligence Cases */}
        <div className="bg-white border border-gray-300 p-4 rounded shadow-sm hover:border-red-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Forensic Fraud Alerts
            </span>
            <span className="p-1.5 bg-red-50 text-red-600 rounded">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">{totalFraud}</span>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
              Active Investigation
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">Seal forgery, duplicate RoR, area tamper</div>
        </div>

        {/* Cadastral Disputes */}
        <div className="bg-white border border-gray-300 p-4 rounded shadow-sm hover:border-amber-500 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Title Disputes
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{totalDisputes}</span>
            <span className="text-xs font-semibold text-gray-600">Predicted by AI</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">Boundary conflicts & heirship stays</div>
        </div>
      </div>

      {/* DILRMP Progress & Live National Health Bar */}
      <div className="bg-white border border-gray-300 p-5 rounded shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#123A78]" />
              Digital India Land Records Modernization Programme (DILRMP) National Progress
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Real-time synchronization across state cadastral portals (Bhulekh, MahaBhulekh, Bhoomi, Dharani, AnyRoR)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('analytics-reports')}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download DILRMP Report
            </button>
            <button
              onClick={() => onNavigateTab('india-map')}
              className="px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              Interactive GIS Map
            </button>
          </div>
        </div>

        {/* Progress Bar with segmented targets */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span>Overall Cadastral Digitization: {avgVerification}%</span>
            <span>Target: 100% by Dec 2026</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-[#0B7A3B] h-full transition-all duration-500"
              style={{ width: `${avgVerification}%` }}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${100 - avgVerification}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0B7A3B]" /> Digitized & Verified (
                {(verifiedParcels / 10000000).toFixed(2)} Cr)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending Drone Survey / Resettlement (
                {(pendingParcels / 10000000).toFixed(2)} Cr)
              </span>
            </div>
            <span className="font-semibold text-gray-700">6,55,000 Villages Surveyed</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: State Performance Leaderboard & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: State Leaderboard & Action Needed (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-300 rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#123A78]" />
              State Performance & Cadastral Cadre Health
            </h4>
            <button
              onClick={() => onNavigateTab('state-admin')}
              className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
            >
              View All States <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Top 5 States */}
            <div>
              <span className="text-xs font-bold text-[#0B7A3B] block mb-2 uppercase tracking-wide">
                Top Performing States (&gt;93% Verified)
              </span>
              <div className="space-y-2">
                {topStates.map((st) => (
                  <div
                    key={st.code}
                    onClick={() => {
                      onSelectState(st.code);
                      onNavigateTab('state-admin');
                    }}
                    className="p-2.5 bg-gray-50 hover:bg-blue-50/70 border border-gray-200 rounded text-xs flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-black text-gray-700">{st.code}</span>
                      <div>
                        <span className="font-bold text-gray-900 block">{st.name}</span>
                        <span className="text-gray-500 text-[11px]">
                          {st.totalDistricts} Districts • {(st.totalParcels / 100000).toFixed(1)} Lakh Parcels
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#0B7A3B] block">
                        {st.verificationPercentage}%
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Collector Score: {st.collectorAvgScore}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Needed States */}
            <div>
              <span className="text-xs font-bold text-red-600 block mb-2 uppercase tracking-wide">
                Priority Intervention / Review Required
              </span>
              <div className="space-y-2">
                {actionStates.map((st) => (
                  <div
                    key={st.code}
                    onClick={() => {
                      onSelectState(st.code);
                      onNavigateTab('state-admin');
                    }}
                    className="p-2.5 bg-red-50/40 hover:bg-red-50 border border-red-200 rounded text-xs flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-black text-red-700">{st.code}</span>
                      <div>
                        <span className="font-bold text-gray-900 block">{st.name}</span>
                        <span className="text-gray-500 text-[11px]">
                          Pending: {(st.pendingParcels / 100000).toFixed(1)} Lakh • {st.fraudCasesCount} Fraud Cases
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-red-600 block">
                        {st.verificationPercentage}%
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                        {st.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Immutable Audit Trail (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-300 rounded shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#123A78]" />
                Live Command Audit Feed
              </h4>
              <button
                onClick={() => onNavigateTab('audit-transparency')}
                className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
              >
                Full Ledger <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentAudits.map((item) => (
                <div key={item.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.actionType === 'APPROVAL'
                            ? 'bg-[#0B7A3B]'
                            : item.actionType === 'CORRECTION'
                            ? 'bg-blue-600'
                            : 'bg-amber-600'
                        }`}
                      />
                      {item.actionType}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {new Date(item.eventTimestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 font-medium">{item.justificationReason}</p>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                    <span>
                      Actor: <strong className="text-gray-800">{item.actorName}</strong>
                    </span>
                    <span className="font-mono text-gray-400">
                      {item.cryptographicHash.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-blue-50/60 border border-blue-200 rounded text-xs text-gray-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0B7A3B] shrink-0" />
            <span>
              All transactions cryptographically sealed with SHA-256 and synchronized with NIC National Ledger.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
