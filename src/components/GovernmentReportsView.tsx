import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Building,
  TrendingUp,
} from 'lucide-react';

export const GovernmentReportsView: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [timeRange, setTimeRange] = useState('FY 2025-26');

  const talukaData = [
    {
      taluka: 'Haveli',
      totalVillages: 142,
      digitizedVillages: 139,
      completionRate: 97.8,
      geoReferencedParcels: '184,200',
      pendingMutations: 18,
      fraudFlags: 4,
    },
    {
      taluka: 'Baramati',
      totalVillages: 116,
      digitizedVillages: 114,
      completionRate: 98.2,
      geoReferencedParcels: '142,900',
      pendingMutations: 9,
      fraudFlags: 1,
    },
    {
      taluka: 'Mulshi',
      totalVillages: 98,
      digitizedVillages: 91,
      completionRate: 92.8,
      geoReferencedParcels: '98,400',
      pendingMutations: 24,
      fraudFlags: 7,
    },
    {
      taluka: 'Khed',
      totalVillages: 134,
      digitizedVillages: 128,
      completionRate: 95.5,
      geoReferencedParcels: '158,100',
      pendingMutations: 14,
      fraudFlags: 3,
    },
    {
      taluka: 'Shirur',
      totalVillages: 112,
      digitizedVillages: 106,
      completionRate: 94.6,
      geoReferencedParcels: '121,500',
      pendingMutations: 12,
      fraudFlags: 2,
    },
  ];

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Taluka,Total Villages,Digitized Villages,Completion Rate (%),GeoReferenced Parcels,Pending Mutations,Fraud Flags\n' +
      talukaData
        .map(
          (t) =>
            `${t.taluka},${t.totalVillages},${t.digitizedVillages},${t.completionRate},"${t.geoReferencedParcels}",${t.pendingMutations},${t.fraudFlags}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DILRMP_PUNE_PROGRESS_REPORT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Top Header */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                Feature 20
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                Government Reporting &amp; DILRMP District Analytics
              </h1>
            </div>
            <p className="text-xs text-[#5A6878] mt-1">
              Digital India Land Records Modernization Programme (DILRMP) cadastral KPI compliance monitoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Data</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Villages Digitized
            </span>
            <div className="text-2xl font-extrabold text-[#123A78] font-mono">1,420 / 1,480</div>
            <div className="text-[11px] text-[#0B7A3B] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>95.9% Complete (On Target)</span>
            </div>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Geo-Referenced Parcels
            </span>
            <div className="text-2xl font-extrabold text-[#1C2733] font-mono">1,842,900</div>
            <div className="text-[11px] text-gray-600">ISRO Bhuvan Orthomosaic Linked</div>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Mutation Pendency (&gt;15 Days)
            </span>
            <div className="text-2xl font-extrabold text-[#0B7A3B] font-mono">42 Cases</div>
            <div className="text-[11px] text-[#0B7A3B] font-semibold">Reduced by 68% with AI Auto-Checks</div>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              High-Risk Fraud Alerts Resolved
            </span>
            <div className="text-2xl font-extrabold text-[#B42318] font-mono">17 / 19</div>
            <div className="text-[11px] text-gray-600">Escalated to Sub-Divisional Officer</div>
          </div>
        </div>

        {/* Taluka-wise Progress Table */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C2733]">
              District Revenue Subdivision Progress (Taluka-wise Breakup)
            </h3>
            <span className="text-xs font-mono text-gray-500">Jurisdiction: Pune Collectorate</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#123A78] text-white">
                  <th className="p-3 font-bold">Taluka Name</th>
                  <th className="p-3 font-bold">Total Villages</th>
                  <th className="p-3 font-bold">Digitized</th>
                  <th className="p-3 font-bold">Progress Bar</th>
                  <th className="p-3 font-bold">Geo-Referenced Parcels</th>
                  <th className="p-3 font-bold text-center">Pending Mutations</th>
                  <th className="p-3 font-bold text-center">Fraud Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {talukaData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#1C2733]">{row.taluka}</td>
                    <td className="p-3 font-mono text-gray-700">{row.totalVillages}</td>
                    <td className="p-3 font-mono text-gray-700">{row.digitizedVillages}</td>
                    <td className="p-3">
                      <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden inline-block align-middle mr-2">
                        <div
                          className="bg-[#0B7A3B] h-full"
                          style={{ width: `${row.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-gray-700">
                        {row.completionRate}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-gray-800">{row.geoReferencedParcels}</td>
                    <td className="p-3 text-center font-mono font-bold text-[#123A78]">
                      {row.pendingMutations}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-[#B42318]">
                      {row.fraudFlags}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
