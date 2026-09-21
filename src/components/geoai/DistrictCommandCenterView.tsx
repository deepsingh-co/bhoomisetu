import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Users,
  Clock,
  ShieldAlert,
  Search,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface TalukaPerformance {
  name: string;
  totalParcels: number;
  digitizedPct: number;
  verifiedPct: number;
  mutationDisposalDays: number;
  fraudAlerts: number;
  status: 'EXCELLENT' | 'SATISFACTORY' | 'ACTION_REQUIRED';
}

export const DistrictCommandCenterView: React.FC = () => {
  const [searchTaluka, setSearchTaluka] = useState('');

  const talukas: TalukaPerformance[] = [
    {
      name: 'Haveli (हवेली)',
      totalParcels: 142850,
      digitizedPct: 98.4,
      verifiedPct: 92.1,
      mutationDisposalDays: 8.4,
      fraudAlerts: 14,
      status: 'EXCELLENT',
    },
    {
      name: 'Mulshi (मुळशी)',
      totalParcels: 86400,
      digitizedPct: 96.2,
      verifiedPct: 88.5,
      mutationDisposalDays: 10.2,
      fraudAlerts: 9,
      status: 'SATISFACTORY',
    },
    {
      name: 'Baramati (बारामती)',
      totalParcels: 112300,
      digitizedPct: 99.1,
      verifiedPct: 95.8,
      mutationDisposalDays: 6.8,
      fraudAlerts: 4,
      status: 'EXCELLENT',
    },
    {
      name: 'Shirur (शिरूर)',
      totalParcels: 98200,
      digitizedPct: 91.5,
      verifiedPct: 81.2,
      mutationDisposalDays: 14.6,
      fraudAlerts: 22,
      status: 'ACTION_REQUIRED',
    },
    {
      name: 'Maval (मावळ)',
      totalParcels: 79500,
      digitizedPct: 94.8,
      verifiedPct: 87.0,
      mutationDisposalDays: 11.5,
      fraudAlerts: 11,
      status: 'SATISFACTORY',
    },
    {
      name: 'Pune City (पुणे शहर)',
      totalParcels: 214000,
      digitizedPct: 99.5,
      verifiedPct: 97.4,
      mutationDisposalDays: 7.1,
      fraudAlerts: 8,
      status: 'EXCELLENT',
    },
  ];

  const filteredTalukas = talukas.filter((t) => t.name.toLowerCase().includes(searchTaluka.toLowerCase()));

  const handleExportData = (format: 'pdf' | 'csv' | 'excel') => {
    if (format === 'pdf') {
      window.print();
    } else {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['Taluka,Total Parcels,Digitized %,Verified %,Avg Disposal Days,Fraud Alerts,Status']
          .concat(
            talukas.map(
              (t) =>
                `"${t.name}",${t.totalParcels},${t.digitizedPct}%,${t.verifiedPct}%,${t.mutationDisposalDays},${t.fraudAlerts},${t.status}`
            )
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Pune_District_Land_Analytics_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Collector Command Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-bold rounded">
              Collector & District Magistrate Command
            </span>
            <span className="text-xs text-gray-500 font-mono">Pune District • Maharashtra</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>District Geo Intelligence & Cadastral Oversight</span>
            <span className="text-sm font-normal text-gray-600">• Dr. Suhas Diwase, IAS</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Executive oversight tracking 14 talukas, 1,842 revenue villages, and 14.8 lakh land parcels across Pune Division.
          </p>
        </div>

        {/* Data Export Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportData('csv')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F7FA] hover:bg-gray-200 border border-[#D8DEE8] rounded text-xs font-bold text-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExportData('excel')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F7FA] hover:bg-gray-200 border border-[#D8DEE8] rounded text-xs font-bold text-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Excel Dossier</span>
          </button>
          <button
            onClick={() => handleExportData('pdf')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. District High-Level Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>District Land Parcels</span>
            <Building2 className="w-4 h-4 text-[#123A78]" />
          </div>
          <div className="text-2xl font-bold text-[#123A78]">14,82,450</div>
          <div className="text-[11px] text-[#0B7A3B] mt-1 font-medium">96.8% Digitized & Geo-referenced</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Avg Mutation Turnaround</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">8.6 Days</div>
          <div className="text-[11px] text-[#0B7A3B] mt-1 font-medium">Down from 34 days (pre-AI)</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Encroachment Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#B42318]" />
          </div>
          <div className="text-2xl font-bold text-[#B42318]">68 Cases</div>
          <div className="text-[11px] text-gray-600 mt-1">42 Show-cause notices served</div>
        </div>

        <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>AI Model Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          </div>
          <div className="text-2xl font-bold text-[#0B7A3B]">98.2%</div>
          <div className="text-[11px] text-gray-600 mt-1">Grounded on ISRO Bhuvan Tiles</div>
        </div>
      </div>

      {/* 3. Taluka Performance Ranking Table */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D8DEE8] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#123A78] uppercase tracking-wide">
              Taluka Cadastral Performance Index
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search taluka..."
              value={searchTaluka}
              onChange={(e) => setSearchTaluka(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5F7FA] text-gray-700 uppercase font-semibold border-b border-[#D8DEE8]">
              <tr>
                <th className="px-4 py-3">Taluka Name</th>
                <th className="px-4 py-3">Total Parcels</th>
                <th className="px-4 py-3">Digitization %</th>
                <th className="px-4 py-3">Title Verification</th>
                <th className="px-4 py-3">Mutation Disposal</th>
                <th className="px-4 py-3">Active Flags</th>
                <th className="px-4 py-3 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DEE8]">
              {filteredTalukas.map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#123A78]">{t.name}</td>
                  <td className="px-4 py-3 font-mono">{t.totalParcels.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#123A78] h-2 rounded-full" style={{ width: `${t.digitizedPct}%` }} />
                      </div>
                      <span className="font-semibold">{t.digitizedPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0B7A3B]">{t.verifiedPct}%</td>
                  <td className="px-4 py-3 font-mono">{t.mutationDisposalDays} days</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${t.fraudAlerts > 15 ? 'bg-[#FEE4E2] text-[#B42318]' : 'bg-gray-100 text-gray-700'}`}>
                      {t.fraudAlerts}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        t.status === 'EXCELLENT'
                          ? 'bg-[#D1FADF] text-[#0B7A3B]'
                          : t.status === 'SATISFACTORY'
                          ? 'bg-blue-50 text-[#123A78]'
                          : 'bg-[#FEE4E2] text-[#B42318]'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
