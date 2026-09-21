import React, { useState, useEffect } from 'react';
import { NationalOfficerItem, NationalStateItem } from '../../types/nationalAdmin';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  KeyRound,
  FileBadge2,
} from 'lucide-react';

interface OfficerManagementTabProps {
  states: NationalStateItem[];
}

export const OfficerManagementTab: React.FC<OfficerManagementTabProps> = ({ states }) => {
  const [officers, setOfficers] = useState<NationalOfficerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedOfficerForTransfer, setSelectedOfficerForTransfer] = useState<NationalOfficerItem | null>(null);
  const [transferDistrict, setTransferDistrict] = useState('');
  const [transferTaluka, setTransferTaluka] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // New Officer Form
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('VERIFICATION_OFFICER');
  const [newDept, setNewDept] = useState('Department of Land Records');
  const [newDesignation, setNewDesignation] = useState('Naib Tehsildar (Land Records)');
  const [newStateCode, setNewStateCode] = useState('MH');

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/officers');
      const data = await res.json();
      if (data.success) {
        setOfficers(data.officers);
      }
    } catch (err) {
      console.error('Failed to load officers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (officerId: string) => {
    try {
      const res = await fetch(`/api/admin/officers/${officerId}/toggle-status`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        fetchOfficers();
        setTimeout(() => setActionNotice(''), 4000);
      }
    } catch (err) {
      console.error('Failed to toggle officer status:', err);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newFullName,
          officialEmail: newEmail,
          phoneNumber: newPhone,
          roleType: newRole,
          department: newDept,
          designation: newDesignation,
          stateCode: newStateCode,
          districtId: 'dist-mh-pune',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        setOnboardModalOpen(false);
        fetchOfficers();
        setNewFullName('');
        setNewEmail('');
        setNewPhone('');
        setTimeout(() => setActionNotice(''), 4000);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Onboarding failed:', err);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficerForTransfer) return;

    try {
      const res = await fetch(`/api/admin/officers/${selectedOfficerForTransfer.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDistrictId: transferDistrict,
          targetTalukaName: transferTaluka,
          justificationReason: transferReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        setTransferModalOpen(false);
        setSelectedOfficerForTransfer(null);
        fetchOfficers();
        setTimeout(() => setActionNotice(''), 4000);
      }
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const filteredOfficers = officers.filter((o) => {
    const matchesRole = roleFilter === 'ALL' || o.roleType === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? o.isActive : !o.isActive);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o.fullName.toLowerCase().includes(q) ||
      o.officialEmail.toLowerCase().includes(q) ||
      o.employeeId.toLowerCase().includes(q) ||
      o.districtName.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              CADRE HRMS DIRECTORY
            </span>
            <span className="text-xs text-gray-500 font-semibold">National Roster Service</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#123A78]" />
            National Land Cadre Officer Management
          </h2>
          <p className="text-xs text-gray-600">
            Super Admins, State Cadres, District Collectors, Tehsildars, and Cadastral Patwaris
          </p>
        </div>

        <button
          onClick={() => setOnboardModalOpen(true)}
          className="px-3.5 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" />
          Onboard New Officer
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {actionNotice}
        </div>
      )}

      {/* Roster Table Container */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Officer, ID or Email..."
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
              <option value="SUPER_ADMIN">Super Admin (GoI)</option>
              <option value="STATE_ADMIN">State Admin</option>
              <option value="DISTRICT_COLLECTOR">District Collector</option>
              <option value="VERIFICATION_OFFICER">Verification Officer</option>
              <option value="SURVEY_OFFICER">Survey Officer (Patwari)</option>
              <option value="AUDITOR">Auditor (CAG)</option>
              <option value="AI_OPS_ADMIN">AI Ops Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded bg-white text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Officers</option>
              <option value="SUSPENDED">Suspended / Inactive</option>
            </select>
          </div>

          <span className="text-xs font-bold text-gray-500">
            Showing {filteredOfficers.length} Officers
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Cadre ID & Name</th>
                <th className="py-2.5 px-3">Role & Department</th>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3">2FA & Security</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    Loading Cadre roster...
                  </td>
                </tr>
              ) : filteredOfficers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    No officers match search criteria.
                  </td>
                </tr>
              ) : (
                filteredOfficers.map((off) => (
                  <tr key={off.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-gray-900">{off.fullName}</div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {off.employeeId} • {off.officialEmail}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-gray-800 block">{off.designation}</span>
                      <span className="text-[10px] font-bold text-[#123A78] bg-blue-50 px-1.5 py-0.2 rounded inline-block">
                        {off.roleType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{off.districtName}</div>
                      <span className="text-[10px] text-gray-500">{off.stateName}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-[#0B7A3B] font-bold">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Enforced (Gov OTP)</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          off.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {off.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">
                      ★ {off.performanceRating} / 5.0
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedOfficerForTransfer(off);
                            setTransferModalOpen(true);
                          }}
                          className="px-2 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          Transfer
                        </button>
                        <button
                          onClick={() => handleToggleStatus(off.id)}
                          className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                            off.isActive
                              ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {off.isActive ? 'Deactivate' : 'Activate'}
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

      {/* Onboard Officer Modal */}
      {onboardModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full border border-gray-300 shadow-xl overflow-hidden">
            <div className="p-4 bg-[#123A78] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register Government Land Officer
              </h3>
              <button
                onClick={() => setOnboardModalOpen(false)}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Official Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Shri Prakash V. Deshmukh"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official .gov.in Email</label>
                  <input
                    type="email"
                    required
                    placeholder="prakash.deshmukh@gov.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile (for 2FA OTP)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cadre Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  >
                    <option value="VERIFICATION_OFFICER">Verification Officer (Circle)</option>
                    <option value="SURVEY_OFFICER">Survey Officer (Patwari / Talathi)</option>
                    <option value="DISTRICT_COLLECTOR">District Collector</option>
                    <option value="AUDITOR">Auditor (CAG)</option>
                    <option value="AI_OPS_ADMIN">AI Operations Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State Cadre</label>
                  <select
                    value={newStateCode}
                    onChange={(e) => setNewStateCode(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  >
                    {states.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Designation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Circle Officer / Naib Tehsildar"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setOnboardModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Officer Modal */}
      {transferModalOpen && selectedOfficerForTransfer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full border border-gray-300 shadow-xl overflow-hidden">
            <div className="p-4 bg-[#123A78] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                Transfer Cadre Jurisdiction
              </h3>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-4 space-y-3">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-xs">
                <span className="font-bold text-gray-900 block">{selectedOfficerForTransfer.fullName}</span>
                <span className="text-gray-500">
                  Current: {selectedOfficerForTransfer.districtName} ({selectedOfficerForTransfer.stateName})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target District</label>
                <select
                  value={transferDistrict}
                  onChange={(e) => setTransferDistrict(e.target.value)}
                  required
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                >
                  <option value="">Select Target District...</option>
                  <option value="dist-mh-nagpur">Nagpur (Maharashtra)</option>
                  <option value="dist-mh-nashik">Nashik (Maharashtra)</option>
                  <option value="dist-mh-thane">Thane (Maharashtra)</option>
                  <option value="dist-mh-pune">Pune (Maharashtra)</option>
                  <option value="dist-up-lucknow">Lucknow (Uttar Pradesh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Taluka / Tehsil</label>
                <input
                  type="text"
                  placeholder="e.g. Haveli / Baramati / Mulshi"
                  value={transferTaluka}
                  onChange={(e) => setTransferTaluka(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Statutory Cadre Order Ref / Justification
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Order No. REV/TRF/2026/894 — Rotational administrative transfer"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  Execute Transfer Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
