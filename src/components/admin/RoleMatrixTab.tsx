import React from 'react';
import { Shield, Check, X, Lock } from 'lucide-react';

export const RoleMatrixTab: React.FC = () => {
  const permissions = [
    { key: 'VIEW_NATIONAL_STATS', label: 'View National Telemetry & Command Overview' },
    { key: 'ISSUE_STATE_DIRECTIVES', label: 'Issue State & Cadastral Directives' },
    { key: 'APPROVE_MUTATION_BATCH', label: 'Approve Title Mutation Batches' },
    { key: 'OVERRIDE_AI_EXTRACTION', label: 'Manual AI Extraction Override' },
    { key: 'TRANSFER_OFFICERS', label: 'Officer Jurisdiction Transfer' },
    { key: 'ACCESS_FRAUD_DOSSIERS', label: 'Access Forensic Fraud Dossiers & ACB Referrals' },
    { key: 'BROADCAST_DISASTER', label: 'Broadcast Natural Disaster Directives' },
    { key: 'EXPORT_AUDIT_LOGS', label: 'Export Statutory Audit & Hash Logs' },
    { key: 'MODIFY_SYSTEM_POLICIES', label: 'Modify Nationwide System Parameters' },
  ];

  const roles = [
    {
      role: 'Super Admin (GoI)',
      department: 'Ministry of Rural Dev / NIC',
      level: 'Clearance L1 (National)',
      perms: [
        'VIEW_NATIONAL_STATS',
        'ISSUE_STATE_DIRECTIVES',
        'APPROVE_MUTATION_BATCH',
        'OVERRIDE_AI_EXTRACTION',
        'TRANSFER_OFFICERS',
        'ACCESS_FRAUD_DOSSIERS',
        'BROADCAST_DISASTER',
        'EXPORT_AUDIT_LOGS',
        'MODIFY_SYSTEM_POLICIES',
      ],
    },
    {
      role: 'State Admin',
      department: 'State Revenue Directorate',
      level: 'Clearance L2 (State)',
      perms: [
        'VIEW_NATIONAL_STATS',
        'ISSUE_STATE_DIRECTIVES',
        'APPROVE_MUTATION_BATCH',
        'OVERRIDE_AI_EXTRACTION',
        'TRANSFER_OFFICERS',
        'ACCESS_FRAUD_DOSSIERS',
        'BROADCAST_DISASTER',
        'EXPORT_AUDIT_LOGS',
      ],
    },
    {
      role: 'District Collector & DM',
      department: 'District Revenue Administration',
      level: 'Clearance L3 (District)',
      perms: [
        'VIEW_NATIONAL_STATS',
        'APPROVE_MUTATION_BATCH',
        'OVERRIDE_AI_EXTRACTION',
        'TRANSFER_OFFICERS',
        'ACCESS_FRAUD_DOSSIERS',
        'BROADCAST_DISASTER',
        'EXPORT_AUDIT_LOGS',
      ],
    },
    {
      role: 'Circle Verification Officer',
      department: 'Tehsil Revenue Office',
      level: 'Clearance L4 (Taluka)',
      perms: ['APPROVE_MUTATION_BATCH', 'OVERRIDE_AI_EXTRACTION'],
    },
    {
      role: 'Survey Officer (Patwari / Talathi)',
      department: 'Field Land Records Cadre',
      level: 'Clearance L5 (Village)',
      perms: ['OVERRIDE_AI_EXTRACTION'],
    },
    {
      role: 'CAG / State Auditor',
      department: 'Comptroller & Auditor General',
      level: 'Clearance L2 (Statutory Audit)',
      perms: ['VIEW_NATIONAL_STATS', 'EXPORT_AUDIT_LOGS'],
    },
    {
      role: 'AI Operations Administrator',
      department: 'NIC AI Centre of Excellence',
      level: 'Clearance L2 (Technical Ops)',
      perms: ['VIEW_NATIONAL_STATS', 'MODIFY_SYSTEM_POLICIES'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              STATUTORY ACCESS CONTROL (RBAC)
            </span>
            <span className="text-xs text-gray-500 font-semibold">DoPT & MeitY Guidelines</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#123A78]" />
            National Cadastral Role-Based Access Control Matrix
          </h2>
          <p className="text-xs text-gray-600">
            Enforced through cryptographic JWT tokens and hardware PKI / Gov OTP authentication
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-3 px-4 min-w-[280px]">Operational Capability</th>
                {roles.map((r, idx) => (
                  <th key={idx} className="py-3 px-3 text-center min-w-[130px]">
                    <span className="text-gray-900 block font-bold text-xs">{r.role}</span>
                    <span className="text-[10px] text-gray-500 font-normal">{r.level}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {permissions.map((perm) => (
                <tr key={perm.key} className="hover:bg-blue-50/30 transition">
                  <td className="py-3 px-4 font-bold text-gray-900 border-r border-gray-200">
                    {perm.label}
                  </td>
                  {roles.map((r, idx) => {
                    const hasPerm = r.perms.includes(perm.key);
                    return (
                      <td key={idx} className="py-3 px-3 text-center border-r border-gray-200">
                        {hasPerm ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-[#0B7A3B]">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
