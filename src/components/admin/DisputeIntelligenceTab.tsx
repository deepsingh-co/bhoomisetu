import React, { useState, useEffect } from 'react';
import { NationalDisputeItem } from '../../types/nationalAdmin';
import {
  Scale,
  AlertTriangle,
  FileText,
  Calendar,
  ChevronRight,
  Shield,
  Gavel,
  CheckCircle2,
} from 'lucide-react';

export const DisputeIntelligenceTab: React.FC = () => {
  const [disputes, setDisputes] = useState<NationalDisputeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/dispute-intelligence');
      const data = await res.json();
      if (data.success) {
        setDisputes(data.cases);
      }
    } catch (err) {
      console.error('Failed to load dispute intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediate = (disp: NationalDisputeItem) => {
    setNotice(
      `Pre-litigation mediation notice issued for ${disp.disputeNumber} (Survey ${disp.surveyNumber}, ${disp.villageName}). Scheduled at Sub-Divisional Magistrate Court.`
    );
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              EARLY WARNING SYSTEM
            </span>
            <span className="text-xs text-gray-500 font-semibold">AI Conflict Risk Index</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#123A78]" />
            National Land Dispute & Early Warning Intelligence
          </h2>
          <p className="text-xs text-gray-600">
            Boundary overlaps, succession conflicts, court stays, and preemptive revenue mediation
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {notice}
        </div>
      )}

      {/* Disputes Cards List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-gray-300 p-8 rounded text-center text-xs text-gray-500">
            Scanning national court registries and succession graphs...
          </div>
        ) : (
          disputes.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-gray-300 rounded shadow-sm p-4 hover:border-[#123A78] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-gray-900">{d.disputeNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#123A78] border border-blue-200">
                    {d.disputeType.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.riskLevel === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : d.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {d.riskLevel} CONFLICT RISK ({d.aiRiskScore}%)
                  </span>
                </div>

                <span className="text-xs text-gray-500 font-medium">
                  Logged: {new Date(d.loggedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8 space-y-2">
                  <h4 className="text-sm font-bold text-gray-900">
                    Survey No. {d.surveyNumber}, {d.villageName} ({d.districtName} District, {d.stateCode})
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{d.summary}</p>
                  <div className="text-[11px] text-gray-500">
                    <strong>Parties Involved:</strong> {d.partiesInvolved.join(' vs. ')}
                  </div>
                  {d.courtCaseRef && (
                    <div className="text-[11px] font-mono text-gray-600 flex items-center gap-1">
                      <Gavel className="w-3 h-3 text-[#123A78]" />
                      Court Reference: {d.courtCaseRef}
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                  <div className="text-right">
                    <span className="text-[11px] text-gray-500 block">Status:</span>
                    <span className="font-bold text-gray-900">{d.status.replace('_', ' ')}</span>
                  </div>

                  <button
                    onClick={() => handleMediate(d)}
                    className="mt-3 px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Schedule Pre-Litigation Mediation
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
