import React, { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Printer,
  FileText,
  Calculator,
  Building,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface MutationSimulatorViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
}

export const MutationSimulatorView: React.FC<MutationSimulatorViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Simulation inputs
  const [mutationType, setMutationType] = useState<'SALE' | 'PARTITION' | 'SUCCESSION'>('PARTITION');
  const [buyerName, setBuyerName] = useState('Anil Dattatray Shinde');
  const [transferAreaHa, setTransferAreaHa] = useState<number>(0.85);

  // Bombay Fragmentation Act check: Minimum fragment threshold in Maharashtra is usually 0.20 Hectares (approx 20 Gunthas)
  const residualArea = Math.max(0, +(currentParcel.landAreaHa - transferAreaHa).toFixed(2));
  const isFragmentationViolated = transferAreaHa < 0.2 || residualArea < 0.2;

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Banner */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                Feature 11
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                Mutation "What-If" Simulator (फेरफार सिम्युलेटर)
              </h1>
            </div>
            <p className="text-xs text-[#5A6878] mt-1">
              Simulate partition, sale, and succession before statutory sanctioning. Verifies compliance with Bombay Fragmentation Act.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">Select Parcel:</label>
            <select
              value={selectedParcelId}
              onChange={(e) => onSelectParcel(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-300 rounded font-bold text-xs text-[#123A78]"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.surveyNumber} ({p.village}) — {p.ownerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Controls Card */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#123A78] uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Mutation Parameters Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Type of Proposed Mutation:</label>
              <select
                value={mutationType}
                onChange={(e) => setMutationType(e.target.value as any)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-bold text-[#123A78]"
              >
                <option value="PARTITION">Partition / Hissa Phodni (हिस्सा पाडणी)</option>
                <option value="SALE">Registered Sale Deed (खरेदी खत)</option>
                <option value="SUCCESSION">Succession / Waras Entry (वारसा नोंद)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Transferee / New Allottee Name:
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-gray-800"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Area to Transfer / Carve Out (Hectares):
              </label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                max={currentParcel.landAreaHa}
                value={transferAreaHa}
                onChange={(e) => setTransferAreaHa(Number(e.target.value))}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-mono font-bold text-[#123A78]"
              />
            </div>
          </div>
        </div>

        {/* Before vs After Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current State */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                CURRENT STATE (Before Mutation)
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-[#123A78] text-[10px] font-bold rounded">
                7/12 Active Record
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="text-gray-500 block text-[11px]">Primary Landowner:</span>
                <span className="font-bold text-sm text-[#1C2733]">{currentParcel.ownerName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">Survey / Gat:</span>
                  <span className="font-bold text-xs text-[#1C2733]">{currentParcel.surveyNumber}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-500 block text-[10px]">Total Area:</span>
                  <span className="font-mono font-bold text-xs text-[#123A78]">
                    {currentParcel.landAreaHa} Ha
                  </span>
                </div>
              </div>
              <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Khata Number:</span>
                <span className="font-bold text-xs text-gray-800">{currentParcel.khataNumber}</span>
              </div>
            </div>
          </div>

          {/* Simulated State */}
          <div className="bg-white border-2 border-[#123A78] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-[#123A78] uppercase tracking-wider">
                PROPOSED STATE (After Sanction)
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] text-[10px] font-bold rounded">
                Draft 7/12 &bull; 2 Hissas
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Residual Share 1 */}
              <div className="p-3 bg-blue-50/50 rounded border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#123A78]">Sub-Division 1 ({currentParcel.surveyNumber}/1)</span>
                  <span className="font-mono font-bold text-[#123A78]">{residualArea} Ha</span>
                </div>
                <div className="text-[11px] text-gray-700">Allottee: {currentParcel.ownerName} (Retained)</div>
              </div>

              {/* Carved Share 2 */}
              <div className="p-3 bg-emerald-50/50 rounded border border-emerald-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#0B7A3B]">Sub-Division 2 ({currentParcel.surveyNumber}/2)</span>
                  <span className="font-mono font-bold text-[#0B7A3B]">{transferAreaHa} Ha</span>
                </div>
                <div className="text-[11px] text-gray-700">Allottee: {buyerName} (New Khatedar)</div>
              </div>

              {/* Statutory Bombay Fragmentation Check */}
              <div
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  isFragmentationViolated
                    ? 'bg-red-50 border-red-200 text-[#B42318]'
                    : 'bg-emerald-50 border-emerald-200 text-[#0B7A3B]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {isFragmentationViolated ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>
                    {isFragmentationViolated
                      ? 'Statutory Violation: Bombay Fragmentation Act'
                      : 'Statutory Compliance Verified'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-700">
                  {isFragmentationViolated
                    ? 'Error: Proposed parcel size or residual size falls below standard fragment minimum (0.20 Ha). Mutation cannot be legally sanctioned under Section 8B.'
                    : 'Both sub-divided units exceed the 0.20 Hectare statutory standard holding requirement.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            Simulated under Maharashtra Land Revenue (Record of Rights and Registers) Rules, 1971.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrder}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Draft Form 12 Notice</span>
            </button>
            <button
              onClick={() => {
                if (isFragmentationViolated) {
                  alert('Cannot generate sanction order: Fragmentation threshold breach!');
                } else {
                  alert('Draft Sanction Order No. REV-FER-2026-881 generated successfully for Circle Officer approval.');
                }
              }}
              className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Draft Sanction Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
