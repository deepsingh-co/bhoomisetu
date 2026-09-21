import React from 'react';
import { Database, AlertCircle, CheckCircle2, FileCheck, Layers } from 'lucide-react';

export const DataQualityTab: React.FC = () => {
  const qualityScores = [
    { state: 'Maharashtra', parcels: '3.42 Cr', boundaryComplete: '94.2%', aadhaarSeeded: '88.5%', textErrors: '0.8%', overall: '94/100' },
    { state: 'Gujarat', parcels: '2.10 Cr', boundaryComplete: '96.1%', aadhaarSeeded: '91.2%', textErrors: '0.4%', overall: '96/100' },
    { state: 'Karnataka', parcels: '2.85 Cr', boundaryComplete: '92.4%', aadhaarSeeded: '86.7%', textErrors: '1.2%', overall: '92/100' },
    { state: 'Madhya Pradesh', parcels: '3.60 Cr', boundaryComplete: '87.5%', aadhaarSeeded: '82.1%', textErrors: '2.1%', overall: '87/100' },
    { state: 'Uttar Pradesh', parcels: '7.85 Cr', boundaryComplete: '83.2%', aadhaarSeeded: '79.4%', textErrors: '2.9%', overall: '83/100' },
    { state: 'Rajasthan', parcels: '2.90 Cr', boundaryComplete: '85.8%', aadhaarSeeded: '81.0%', textErrors: '1.8%', overall: '85/100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              CADASTRAL INTEGRITY AUDIT
            </span>
            <span className="text-xs text-gray-500 font-semibold">DILRMP Quality Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-[#123A78]" />
            National Cadastral Data Hygiene & Geometry Quality
          </h2>
          <p className="text-xs text-gray-600">
            Spatial polygon closure, unseeded Aadhaar records, spelling discrepancies, and duplicate legacy 7/12s
          </p>
        </div>
      </div>

      {/* 4 Summary Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Polygon Closure Rate</span>
          <span className="text-2xl font-black text-[#0B7A3B] block mt-1">92.4%</span>
          <span className="text-[11px] text-gray-500">PostGIS topologically valid</span>
        </div>
        <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Aadhaar Seeding</span>
          <span className="text-2xl font-black text-gray-900 block mt-1">84.8%</span>
          <span className="text-[11px] text-gray-500">UIDAI verified title holders</span>
        </div>
        <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Textual Discrepancies</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">1.6%</span>
          <span className="text-[11px] text-gray-500">Flagged for RoR rectification</span>
        </div>
        <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase">National Data Hygiene</span>
          <span className="text-2xl font-black text-[#123A78] block mt-1">89.5 / 100</span>
          <span className="text-[11px] text-[#0B7A3B] font-semibold">Grade A Compliance</span>
        </div>
      </div>

      {/* State Hygiene Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#123A78]" />
            State-by-State Cadastral Quality Index
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">State Directorate</th>
                <th className="py-2.5 px-3">Total Parcels</th>
                <th className="py-2.5 px-3">Boundary Geometry Valid</th>
                <th className="py-2.5 px-3">Aadhaar Seeded</th>
                <th className="py-2.5 px-3">Name / Text Inconsistencies</th>
                <th className="py-2.5 px-3 text-right">Data Quality Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {qualityScores.map((s, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition">
                  <td className="py-2.5 px-3 font-bold text-gray-900">{s.state}</td>
                  <td className="py-2.5 px-3 font-semibold">{s.parcels}</td>
                  <td className="py-2.5 px-3 font-bold text-[#0B7A3B]">{s.boundaryComplete}</td>
                  <td className="py-2.5 px-3">{s.aadhaarSeeded}</td>
                  <td className="py-2.5 px-3 font-medium text-amber-700">{s.textErrors}</td>
                  <td className="py-2.5 px-3 text-right font-black text-[#123A78] text-sm">
                    {s.overall}
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
