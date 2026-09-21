import React, { useState, useEffect } from 'react';
import { NationalStateItem, NationalDistrictItem } from '../../types/nationalAdmin';
import {
  Landmark,
  Building2,
  Users,
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  ChevronRight,
  Send,
  ExternalLink,
} from 'lucide-react';

interface StateAdminConsoleTabProps {
  states: NationalStateItem[];
  selectedStateCode: string;
  onSelectState: (code: string) => void;
  onOpenDistrict: (districtId: string) => void;
}

export const StateAdminConsoleTab: React.FC<StateAdminConsoleTabProps> = ({
  states,
  selectedStateCode,
  onSelectState,
  onOpenDistrict,
}) => {
  const [districts, setDistricts] = useState<NationalDistrictItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSubject, setOrderSubject] = useState('');
  const [orderBody, setOrderBody] = useState('');
  const [orderSentMessage, setOrderSentMessage] = useState('');

  const currentState = states.find((s) => s.code === selectedStateCode) || states[0];

  useEffect(() => {
    fetchDistricts();
  }, [selectedStateCode]);

  const fetchDistricts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/districts?stateCode=${selectedStateCode}`);
      const data = await res.json();
      if (data.success) {
        setDistricts(data.districts);
      }
    } catch (err) {
      console.error('Failed to load districts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDistricts = districts.filter((d) => {
    const matchesRisk = riskFilter === 'ALL' || d.riskCategory === riskFilter;
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSentMessage(
      `State Government Notification dispatched to all ${districts.length} District Collectors in ${currentState.name}. Reference ID: GOM-REV-2026-${Date.now().toString().slice(-4)}`
    );
    setOrderSubject('');
    setOrderBody('');
    setTimeout(() => {
      setOrderSentMessage('');
      setOrderModalOpen(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* State Switcher & Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              STATE REVENUE CONSOLE
            </span>
            <span className="text-xs text-gray-500 font-semibold">Code: {currentState.code}</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#123A78]" />
            {currentState.name} Land Records & Cadastre Directorate
          </h2>
          <p className="text-xs text-gray-600">
            Headquarters: {currentState.capital} • Cadastral Zone: {currentState.zone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-gray-700">Switch State:</label>
          <select
            value={selectedStateCode}
            onChange={(e) => onSelectState(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-900 focus:outline-none focus:border-[#123A78] cursor-pointer"
          >
            {states.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name} ({st.code}) — {st.verificationPercentage}%
              </option>
            ))}
          </select>

          <button
            onClick={() => setOrderModalOpen(true)}
            className="px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            Issue State Directive
          </button>
        </div>
      </div>

      {/* State Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Districts</span>
          <span className="text-xl font-black text-gray-900 block mt-1">{currentState.totalDistricts}</span>
        </div>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Parcels</span>
          <span className="text-xl font-black text-gray-900 block mt-1">
            {(currentState.totalParcels / 100000).toFixed(1)} Lakh
          </span>
        </div>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Digitization %</span>
          <span className="text-xl font-black text-[#0B7A3B] block mt-1">
            {currentState.verificationPercentage}%
          </span>
        </div>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Fraud Cases</span>
          <span className="text-xl font-black text-red-600 block mt-1">{currentState.fraudCasesCount}</span>
        </div>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Active Disputes</span>
          <span className="text-xl font-black text-amber-600 block mt-1">{currentState.activeDisputesCount}</span>
        </div>
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Collector Avg Score</span>
          <span className="text-xl font-black text-[#123A78] block mt-1">
            {currentState.collectorAvgScore}/100
          </span>
        </div>
      </div>

      {/* District Cadastral Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#123A78]" />
              District Cadastral Performance & Collector Queue Oversight
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Real-time monitoring across all {districts.length} districts in {currentState.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search District or Collector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#123A78] w-56"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1 px-2 focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Collector & DM</th>
                <th className="py-2.5 px-3">Talukas / Villages</th>
                <th className="py-2.5 px-3">Total Parcels</th>
                <th className="py-2.5 px-3">Verification %</th>
                <th className="py-2.5 px-3">Pending Mutations</th>
                <th className="py-2.5 px-3">Fraud Queue</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                    Loading district cadre telemetry from state registry...
                  </td>
                </tr>
              ) : filteredDistricts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                    No district records matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredDistricts.map((d) => (
                  <tr key={d.id} className="hover:bg-blue-50/50 transition">
                    <td className="py-2.5 px-3 font-bold text-gray-900">
                      <div>{d.name}</div>
                      <span className="text-[10px] text-gray-500 font-normal">HQ: {d.headquarters}</span>
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <div>{d.collectorName}</div>
                      <span className="text-[10px] text-gray-500 font-mono">{d.collectorEmail}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      {d.totalTalukas} Talukas / {d.totalVillages} Villages
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      {(d.totalParcels / 100000).toFixed(1)} Lakh
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0B7A3B]">{d.verificationPercentage}%</span>
                        <div className="w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0B7A3B] h-full"
                            style={{ width: `${d.verificationPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-amber-700">{d.mutationQueueCount}</span> Pending
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          d.fraudQueueCount > 20
                            ? 'bg-red-100 text-red-800'
                            : d.fraudQueueCount > 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {d.fraudQueueCount} Cases
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.riskCategory === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : d.riskCategory === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {d.riskCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenDistrict(d.id)}
                        className="px-2.5 py-1 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold transition inline-flex items-center gap-1"
                      >
                        Collector Console
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* State Directive Dispatch Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-lg w-full border border-gray-300 shadow-xl overflow-hidden">
            <div className="p-4 bg-[#123A78] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Send className="w-4 h-4" />
                Issue Official State Government Directive
              </h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchOrder} className="p-4 space-y-3">
              {orderSentMessage ? (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium">
                  {orderSentMessage}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Recipient Cadre
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`All ${districts.length} District Collectors & SDOs (${currentState.name})`}
                      className="w-full text-xs p-2 bg-gray-100 border border-gray-300 rounded font-semibold text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Directive Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mandatory SVAMITVA Ground Truthing & Mutation Clearance SLA"
                      value={orderSubject}
                      onChange={(e) => setOrderSubject(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Official Directive Order Body (Signed with Digital Cadre Token)
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify enforcement timelines, target villages, and compliance reporting date..."
                      value={orderBody}
                      onChange={(e) => setOrderBody(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setOrderModalOpen(false)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white text-xs font-bold rounded flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Sign & Broadcast Order
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
