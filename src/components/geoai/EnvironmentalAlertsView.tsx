import React, { useState } from 'react';
import {
  Droplets,
  Trees,
  CloudRain,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Check,
  Send,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { MOCK_GEO_ALERTS } from '../../data/geoAiData';
import { GeoAlertItem } from '../../types/geoAi';

interface EnvironmentalAlertsViewProps {
  onSelectParcel?: (id: string) => void;
}

export const EnvironmentalAlertsView: React.FC<EnvironmentalAlertsViewProps> = ({
  onSelectParcel,
}) => {
  const [alerts, setAlerts] = useState<GeoAlertItem[]>(MOCK_GEO_ALERTS);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [escalatedAlertId, setEscalatedAlertId] = useState<string | null>(null);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isAcknowledged: true } : a)));
  };

  const handleEscalateToCollector = (id: string) => {
    setEscalatedAlertId(id);
    setTimeout(() => {
      setEscalatedAlertId(null);
    }, 3000);
  };

  const filteredAlerts = alerts.filter(
    (a) => filterPriority === 'ALL' || a.priority === filterPriority
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#0284C7] text-white text-[11px] font-bold rounded">
              Eco-Spatial Intelligence
            </span>
            <span className="text-xs text-gray-500 font-mono">Statutory Buffer & Hazard System</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>Environmental Vulnerability & Statutory Geo-Alerts</span>
            <span className="text-sm font-normal text-gray-600">• Real-time Hazard Monitoring</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Enforces 50m waterbody protection zones, flood return lines, and Social Forestry buffer compliance.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Filter Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-xs font-semibold text-gray-800 focus:outline-hidden"
          >
            <option value="ALL">All Alerts</option>
            <option value="URGENT">Urgent Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>
        </div>
      </div>

      {/* 2. Environmental Statutory Overlay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>River & Canal 50m Buffer</span>
            <Droplets className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-lg font-bold text-[#123A78]">Enforced (100%)</div>
          <div className="text-[11px] text-gray-600 mt-1">
            Statutory Irrigation Dept buffer around Mutha Canal
          </div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Social Forestry Compartment</span>
            <Trees className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-lg font-bold text-emerald-800">100m Eco-Sensitive</div>
          <div className="text-[11px] text-gray-600 mt-1">
            Section 26 Forest Conservation boundary watch
          </div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Flood Inundation Level</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">Blue Line Safe</div>
          <div className="text-[11px] text-[#0B7A3B] mt-1 font-semibold">
            Zero parcels within 25-year flood line
          </div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Topographic Slope Check</span>
            <Mountain className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-lg font-bold text-gray-900">1:20 Gradient</div>
          <div className="text-[11px] text-gray-600 mt-1">
            Digital Elevation Model (CartoDEM 10m)
          </div>
        </div>
      </div>

      {/* 3. Alerts Dispatch Ledger */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#123A78] uppercase tracking-wide pb-3 border-b border-[#D8DEE8] mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#B42318]" />
          <span>Active Geospatial Alerts & Non-Compliance Notices ({filteredAlerts.length})</span>
        </h3>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-[10px] border transition-all ${
                alert.isAcknowledged
                  ? 'bg-gray-50 border-[#D8DEE8] opacity-75'
                  : 'bg-white border-[#FDA29B] shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.priority === 'URGENT'
                        ? 'bg-[#FEE4E2] text-[#B42318]'
                        : alert.priority === 'HIGH'
                        ? 'bg-[#FEF0C7] text-[#B26A00]'
                        : 'bg-blue-50 text-[#123A78]'
                    }`}
                  >
                    {alert.priority} PRIORITY
                  </span>
                  <span className="font-bold text-sm text-gray-900">{alert.title}</span>
                  <span className="text-xs text-gray-500 font-mono">({alert.alertCode})</span>
                </div>
                <span className="text-[11px] text-gray-500">{alert.timestamp}</span>
              </div>

              <p className="text-xs text-gray-700 mb-3">{alert.description}</p>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-4 text-gray-600">
                  <span>
                    Survey: <b>#{alert.surveyNumber}</b>
                  </span>
                  <span>
                    Village: <b>{alert.village}</b>
                  </span>
                  <span>
                    ULPIN: <b className="font-mono">{alert.parcelUid}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {!alert.isAcknowledged ? (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1 bg-[#0B7A3B] hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  ) : (
                    <span className="text-[#0B7A3B] font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleEscalateToCollector(alert.id)}
                    className="px-3 py-1 bg-[#B42318] hover:bg-red-800 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Escalate to Collector</span>
                  </button>

                  {onSelectParcel && (
                    <button
                      onClick={() => onSelectParcel(alert.parcelUid)}
                      className="px-3 py-1 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Locate on Map &rarr;</span>
                    </button>
                  )}
                </div>
              </div>

              {escalatedAlertId === alert.id && (
                <div className="mt-2 p-2 bg-emerald-50 text-[#0B7A3B] border border-emerald-200 rounded text-xs font-bold animate-fade-in">
                  ✓ Priority alert escalated to Collector Dr. Suhas Diwase, IAS
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
