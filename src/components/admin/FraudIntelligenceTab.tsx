import React, { useState, useEffect } from 'react';
import { NationalFraudItem } from '../../types/nationalAdmin';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  Filter,
  FileSearch,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Building,
} from 'lucide-react';

export const FraudIntelligenceTab: React.FC = () => {
  const [fraudCases, setFraudCases] = useState<NationalFraudItem[]>([]);
  const [categoriesCount, setCategoriesCount] = useState<any>({});
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseForEvidence, setSelectedCaseForEvidence] = useState<NationalFraudItem | null>(null);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    fetchFraudCases();
  }, [categoryFilter, severityFilter]);

  const fetchFraudCases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/fraud-intelligence?category=${categoryFilter}&severity=${severityFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setFraudCases(data.cases);
        setCategoriesCount(data.categoriesCount || {});
      }
    } catch (err) {
      console.error('Failed to load fraud cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalateACB = (c: NationalFraudItem) => {
    setActionNotice(
      `Case ${c.caseNumber} (Survey ${c.surveyNumber}, ${c.villageName}) referred to Anti-Corruption Bureau (ACB) Special Vigilance Cell.`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredCases = fraudCases.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      c.caseNumber.toLowerCase().includes(q) ||
      c.surveyNumber.toLowerCase().includes(q) ||
      c.villageName.toLowerCase().includes(q) ||
      c.districtName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
              NATIONAL VIGILANCE DIRECTIVE
            </span>
            <span className="text-xs text-gray-500 font-semibold">Anti-Fraud & Forensic Bureau</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-600" />
            National Cadastral Fraud & Forgery Intelligence Center
          </h2>
          <p className="text-xs text-gray-600">
            Forensic seal inspection, AI signature verification, area manipulation detection, and digital ledger anomalies
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-medium flex items-center gap-2">
          <Scale className="w-4 h-4 text-red-600" />
          {actionNotice}
        </div>
      )}

      {/* Categories Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Seal Tamper', key: 'SEAL_MISMATCH', count: categoriesCount.SEAL_MISMATCH || 0 },
          { label: 'Signature Forgery', key: 'SIGNATURE_FORGERY', count: categoriesCount.SIGNATURE_FORGERY || 0 },
          { label: 'Area Manipulation', key: 'AREA_MANIPULATION', count: categoriesCount.AREA_MANIPULATION || 0 },
          { label: 'Duplicate 7/12', key: 'DUPLICATE_RECORD', count: categoriesCount.DUPLICATE_RECORD || 0 },
          { label: 'Boundary Shift', key: 'BOUNDARY_ENCROACHMENT', count: categoriesCount.BOUNDARY_ENCROACHMENT || 0 },
          { label: 'Doc Tamper', key: 'EDITED_DOCUMENT', count: categoriesCount.EDITED_DOCUMENT || 0 },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => setCategoryFilter(item.key)}
            className={`p-3 rounded border text-xs cursor-pointer transition ${
              categoryFilter === item.key
                ? 'bg-red-50 border-red-600 shadow-sm'
                : 'bg-white border-gray-300 hover:border-red-400'
            }`}
          >
            <span className="text-[11px] font-bold text-gray-500 block truncate">{item.label}</span>
            <span className="text-xl font-black text-red-600 block mt-1">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Fraud Cases Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Case No, Survey, Village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#123A78] w-64"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="SEAL_MISMATCH">Seal Tamper</option>
              <option value="AREA_MANIPULATION">Area Manipulation</option>
              <option value="DUPLICATE_RECORD">Duplicate Record</option>
              <option value="BOUNDARY_ENCROACHMENT">Boundary Encroachment</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>

          <span className="text-xs font-bold text-gray-500">
            {filteredCases.length} Investigatory Flags
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Location & Parcel</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    Querying National Fraud Intelligence ledger...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    No fraud incidents found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-red-50/30 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                      {c.caseNumber}
                      <span className="block text-[10px] text-gray-500 font-sans font-normal">
                        Reported: {new Date(c.reportedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">
                        Survey No. {c.surveyNumber}, {c.villageName}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {c.districtName} District ({c.stateCode})
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-[10px] inline-block border border-red-200">
                        {c.fraudCategory.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-extrabold text-[#0B7A3B]">{c.aiConfidence}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.severity === 'CRITICAL'
                            ? 'bg-red-600 text-white'
                            : c.severity === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[11px] text-gray-700">
                      {c.status.replace('_', ' ')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCaseForEvidence(c)}
                          className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <FileSearch className="w-3 h-3" />
                          Evidence
                        </button>
                        <button
                          onClick={() => handleEscalateACB(c)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Scale className="w-3 h-3" />
                          ACB Referral
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Inspection Modal */}
      {selectedCaseForEvidence && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full border border-gray-300 shadow-xl overflow-hidden">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Forensic Evidence Dossier — {selectedCaseForEvidence.caseNumber}
              </h3>
              <button
                onClick={() => setSelectedCaseForEvidence(null)}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Jurisdiction:</span>
                  <span className="font-bold text-gray-900">
                    Survey {selectedCaseForEvidence.surveyNumber}, {selectedCaseForEvidence.villageName} (
                    {selectedCaseForEvidence.districtName})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fraud Class:</span>
                  <span className="font-bold text-red-700">{selectedCaseForEvidence.fraudCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Confidence:</span>
                  <span className="font-bold text-[#0B7A3B]">{selectedCaseForEvidence.aiConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Investigating Officer:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCaseForEvidence.investigatingOfficer}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Forensic Analysis Report:</label>
                <div className="p-3 bg-red-50/50 border border-red-200 rounded text-gray-800 leading-relaxed">
                  {selectedCaseForEvidence.description}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-gray-600">
                <strong>Statutory Action:</strong> Title mutation on this survey is temporarily frozen in the
                State Revenue Cadastre until cleared by District Magistrate.
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-200">
                <button
                  onClick={() => setSelectedCaseForEvidence(null)}
                  className="px-4 py-1.5 bg-[#123A78] text-white text-xs font-bold rounded"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
