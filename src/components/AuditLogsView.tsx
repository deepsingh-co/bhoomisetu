import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogsViewProps {
  onBackToDashboard: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ onBackToDashboard }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const action = log.actionType || log.action || '';
    if (filterAction !== 'ALL' && action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const detailsStr = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || '');
      return (
        log.actorEmail.toLowerCase().includes(q) ||
        (typeof log.actorRole === 'string' && log.actorRole.toLowerCase().includes(q)) ||
        action.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q) ||
        detailsStr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAuditCSV = () => {
    const headers = 'ID,Timestamp,Actor Email,Role,Action,Status,IP Address,Details\n';
    const rows = filteredLogs
      .map(
        (l) => {
          const action = l.actionType || l.action || '';
          const detailsStr = (typeof l.details === 'string' ? l.details : JSON.stringify(l.details || '')).replace(/"/g, '""');
          return `"${l.id}","${l.timestamp}","${l.actorEmail}","${l.actorRole}","${action}","${l.status || 'SUCCESS'}","${l.ipAddress}","${detailsStr}"`;
        }
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bhulekh_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 border border-[#D8DEE8] rounded-xl shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#123A78]" />
              <h2 className="text-xl font-bold text-[#1C2733]">
                National Land Records Immutable Audit Trail
              </h2>
            </div>
            <p className="text-xs text-[#5A6878] mt-0.5">
              Statutory logging of authentication events, cadastral lookups, and administrative actions under IT Act 2000.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditCSV}
              className="px-3.5 py-1.5 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Gazette CSV</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded"
            >
              &larr; Back to Console
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Officer Email, Role, IP Address, or Action..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
            />
            <Search className="w-4 h-4 text-[#5A6878] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5A6878] shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Action:</span>
            </span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
            >
              <option value="ALL">All Recorded Actions</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_2FA_REQUIRED">2FA Dispatched</option>
              <option value="EMPLOYEE_REGISTRATION_SUBMITTED">Employee Applied</option>
              <option value="EMPLOYEE_REQUEST_APPROVED">Application Approved</option>
              <option value="PASSWORD_RESET">Password Reset</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#123A78] text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">Official / Identity</th>
                  <th className="py-3 px-4">Role Cadre</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DEE8]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#5A6878]">
                      No audit events match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F5F7FA] transition-colors">
                      <td className="py-3 px-4 font-mono text-[#5A6878] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#123A78]">
                        {log.actorEmail}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#123A78] font-bold text-[10px] rounded border border-blue-200 uppercase">
                          {log.actorRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1C2733]">
                        {log.actionType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5A6878]">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-4 text-[#5A6878] max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {log.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1F7A3E]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B42318]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>FLAGGED</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
