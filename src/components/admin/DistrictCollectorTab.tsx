import React, { useState, useEffect } from 'react';
import { NationalDistrictItem, NationalOfficerItem, NationalFraudItem } from '../../types/nationalAdmin';
import {
  Building,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface DistrictCollectorTabProps {
  districtId: string;
  onNavigateTab: (tab: any) => void;
}

export const DistrictCollectorTab: React.FC<DistrictCollectorTabProps> = ({
  districtId,
  onNavigateTab,
}) => {
  const [districtData, setDistrictData] = useState<NationalDistrictItem | null>(null);
  const [officers, setOfficers] = useState<NationalOfficerItem[]>([]);
  const [fraudCases, setFraudCases] = useState<NationalFraudItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQueueFilter, setActiveQueueFilter] = useState<string>('ALL');
  const [approvalMessage, setApprovalMessage] = useState<string>('');

  useEffect(() => {
    fetchDistrictDetail();
  }, [districtId]);

  const fetchDistrictDetail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/districts/${districtId || 'dist-mh-pune'}`);
      const data = await res.json();
      if (data.success) {
        setDistrictData(data.district);
        setOfficers(data.officers || []);
        setFraudCases(data.fraudCases || []);
      }
    } catch (err) {
      console.error('Failed to load district data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchApprove = () => {
    setApprovalMessage('Statutory Mutation Batch #MUT-2026-B81 approved and sealed under MLRC Section 150.');
    setTimeout(() => setApprovalMessage(''), 4000);
  };

  if (isLoading || !districtData) {
    return (
      <div className="bg-white border border-gray-300 p-8 rounded text-center text-xs text-gray-500">
        Loading District Collector Command Center...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              DISTRICT COLLECTORATE COMMAND
            </span>
            <span className="text-xs text-gray-500 font-semibold">{districtData.stateName} Cadre</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Building className="w-6 h-6 text-[#123A78]" />
            Collector & District Magistrate, {districtData.name}
          </h2>
          <p className="text-xs text-gray-600">
            Collector: <strong>{districtData.collectorName}</strong> • Email: {districtData.collectorEmail} •
            Headquarters: {districtData.headquarters}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBatchApprove}
            className="px-3 py-1.5 bg-[#0B7A3B] hover:bg-[#096330] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Batch Clear Validated Mutations (12)
          </button>
          <button
            onClick={() => onNavigateTab('officer-management')}
            className="px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Users className="w-3.5 h-3.5" />
            Manage Taluka Officers
          </button>
        </div>
      </div>

      {approvalMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {approvalMessage}
        </div>
      )}

      {/* 5 Real-Time Collector Queues */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          Statutory Operational Queues (Live Collectorate Influx)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Queue 1 */}
          <div className="bg-white border border-gray-300 p-3 rounded shadow-sm hover:border-[#123A78] transition cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Pending RoR</span>
              <FileCheck2 className="w-4 h-4 text-[#123A78]" />
            </div>
            <span className="text-2xl font-black text-gray-900 block mt-2">
              {districtData.verificationQueueCount}
            </span>
            <span className="text-[11px] text-gray-500">Awaiting Circle Officer</span>
          </div>

          {/* Queue 2 */}
          <div className="bg-white border border-gray-300 p-3 rounded shadow-sm hover:border-red-600 transition cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Fraud Flags</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-black text-red-600 block mt-2">
              {districtData.fraudQueueCount}
            </span>
            <span className="text-[11px] text-red-600 font-semibold">Forensic Tampering</span>
          </div>

          {/* Queue 3 */}
          <div className="bg-white border border-gray-300 p-3 rounded shadow-sm hover:border-amber-500 transition cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Ground Inspections</span>
              <Compass className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-600 block mt-2">
              {districtData.inspectionQueueCount}
            </span>
            <span className="text-[11px] text-gray-500">Field Panchnama Due</span>
          </div>

          {/* Queue 4 */}
          <div className="bg-white border border-gray-300 p-3 rounded shadow-sm hover:border-blue-600 transition cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Boundary Disputes</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-2xl font-black text-blue-800 block mt-2">
              {districtData.disputeQueueCount}
            </span>
            <span className="text-[11px] text-gray-500">Revenue Court Pipeline</span>
          </div>

          {/* Queue 5 */}
          <div className="bg-white border border-gray-300 p-3 rounded shadow-sm hover:border-[#0B7A3B] transition cursor-pointer">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
              <span>Mutation Approvals</span>
              <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
            </div>
            <span className="text-2xl font-black text-[#0B7A3B] block mt-2">
              {districtData.mutationQueueCount}
            </span>
            <span className="text-[11px] text-gray-500">15-Day SLA Compliant</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Village Risk Heatmap & Taluka Officer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Village Cadastral Risk Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-300 rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#123A78]" />
              High-Priority Village Cadastral Matrix ({districtData.name})
            </h4>
            <span className="text-xs font-semibold text-gray-500">14 Talukas / 1,872 Villages</span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                village: 'Wagholi',
                taluka: 'Haveli',
                parcels: '18,400',
                verified: '94.5%',
                fraud: 4,
                disputes: 8,
                status: 'High Growth NA Corridor',
                risk: 'MEDIUM',
              },
              {
                village: 'Hadapsar Rural',
                taluka: 'Haveli',
                parcels: '12,200',
                verified: '96.2%',
                fraud: 2,
                disputes: 5,
                status: 'IT Park Encroachment Buffer',
                risk: 'LOW',
              },
              {
                village: 'Paud',
                taluka: 'Mulshi',
                parcels: '9,800',
                verified: '88.0%',
                fraud: 6,
                disputes: 12,
                status: 'Western Ghats Eco-Sensitive Buffer',
                risk: 'HIGH',
              },
              {
                village: 'Chakan',
                taluka: 'Khed',
                parcels: '15,600',
                verified: '92.1%',
                fraud: 3,
                disputes: 6,
                status: 'MIDC Industrial Land Acquisition',
                risk: 'MEDIUM',
              },
              {
                village: 'Baramati Rural',
                taluka: 'Baramati',
                parcels: '22,100',
                verified: '97.8%',
                fraud: 1,
                disputes: 2,
                status: 'Canal Irrigation Zone',
                risk: 'LOW',
              },
            ].map((v, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 border border-gray-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-blue-50/50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{v.village}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-200 text-gray-700 rounded">
                      Tehsil: {v.taluka}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        v.risk === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : v.risk === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {v.risk} RISK
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">{v.status}</p>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="font-bold text-gray-900 block">{v.parcels} Parcels</span>
                    <span className="text-[#0B7A3B] font-bold text-[11px]">{v.verified} Verified</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-red-600 font-bold block">{v.fraud} Fraud</span>
                    <span className="text-gray-500 font-medium">{v.disputes} Disputes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Taluka Cadre Officers (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-300 rounded shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#123A78]" />
                Assigned Revenue Officers ({officers.length})
              </h4>
              <button
                onClick={() => onNavigateTab('officer-management')}
                className="text-xs font-bold text-[#123A78] hover:underline"
              >
                All Cadres
              </button>
            </div>

            <div className="space-y-2.5">
              {officers.map((off) => (
                <div key={off.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{off.fullName}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-green-100 text-[#0B7A3B]">
                      {off.loginStatus}
                    </span>
                  </div>
                  <div className="text-gray-600 text-[11px]">
                    {off.designation} • {off.talukaName || 'District HQ'}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                    <span>Performance: {off.performanceRating} / 5.0</span>
                    <span className="font-semibold text-gray-700">
                      {off.totalRecordsProcessed.toLocaleString()} records processed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 flex items-center justify-between">
            <span>Disaster Protocol: Normal</span>
            <span className="font-bold text-[#123A78]">SLA Compliance: 95.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
