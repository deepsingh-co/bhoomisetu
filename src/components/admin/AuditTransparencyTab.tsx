import React, { useState, useEffect } from 'react';
import { NationalAuditItem } from '../../types/nationalAdmin';
import {
  FileText,
  Search,
  Filter,
  Download,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AuditTransparencyTab: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<NationalAuditItem[]>([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuditEvents();
  }, [roleFilter, actionFilter]);

  const fetchAuditEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/audit-ledger?role=${roleFilter}&action=${actionFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setAuditEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to load audit events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor Name', 'Actor Email', 'Role', 'Action', 'Resource', 'Reason', 'IP Address', 'Hash'];
    const rows = auditEvents.map((e) => [
      e.eventTimestamp,
      e.actorName,
      e.actorEmail,
      e.actorRole,
      e.actionType,
      e.resourceId,
      `"${e.justificationReason.replace(/"/g, '""')}"`,
      e.ipAddress,
      e.cryptographicHash,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Cadastre_Audit_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = auditEvents.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      e.actorName.toLowerCase().includes(q) ||
      e.actorEmail.toLowerCase().includes(q) ||
      e.resourceId.toLowerCase().includes(q) ||
      e.justificationReason.toLowerCase().includes(q) ||
      e.ipAddress.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              STATUTORY AUDIT & COMPTROLLER LEDGER
            </span>
            <span className="text-xs text-gray-500 font-semibold">Immutable SHA-256 Chain</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#123A78]" />
            National Audit & Cadastral Transparency Center
          </h2>
          <p className="text-xs text-gray-600">
            Immutable log of all title mutations, officer approvals, cadastral rectifications, and data exports
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Statutory Audit CSV
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Actor, Reason, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-[#123A78] w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="DISTRICT_COLLECTOR">District Collector</option>
              <option value="VERIFICATION_OFFICER">Verification Officer</option>
              <option value="AI_OPS_ADMIN">AI Ops Admin</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="APPROVAL">Approvals</option>
              <option value="CORRECTION">Corrections</option>
              <option value="EXPORT">Exports</option>
              <option value="ROLE_CHANGE">Role Changes</option>
            </select>
          </div>

          <span className="text-xs font-bold text-gray-500">
            {filteredEvents.length} Immutable Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Government Officer</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Resource & Justification</th>
                <th className="py-2.5 px-3">Device & IP</th>
                <th className="py-2.5 px-3 font-mono">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                    Verifying SHA-256 hash chains across National Cadastre Ledger...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                    No audit records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(evt.eventTimestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{evt.actorName}</div>
                      <span className="text-[10px] text-gray-500 font-mono">{evt.actorEmail}</span>
                      <span className="block text-[10px] font-bold text-[#123A78]">
                        {evt.actorRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          evt.actionType === 'APPROVAL'
                            ? 'bg-green-100 text-[#0B7A3B]'
                            : evt.actionType === 'CORRECTION'
                            ? 'bg-blue-100 text-[#123A78]'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {evt.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-bold text-gray-900 truncate">
                        {evt.resourceType} ({evt.resourceId})
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5">{evt.justificationReason}</p>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-gray-500">
                      <div className="font-mono text-gray-800">{evt.ipAddress}</div>
                      <span className="text-[10px] text-gray-400 truncate block max-w-[140px]">
                        {evt.deviceInfo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[#0B7A3B]">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-gray-600">{evt.cryptographicHash.substring(0, 16)}...</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
