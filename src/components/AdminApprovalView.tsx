import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Eye,
  Shield,
  Search,
} from 'lucide-react';
import { GovernmentEmployeeRequestItem, User } from '../types';

interface AdminApprovalViewProps {
  currentUser: User;
  onBackToDashboard: () => void;
}

export const AdminApprovalView: React.FC<AdminApprovalViewProps> = ({
  currentUser,
  onBackToDashboard,
}) => {
  const [requests, setRequests] = useState<GovernmentEmployeeRequestItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GovernmentEmployeeRequestItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [assignedRole, setAssignedRole] = useState('GOVERNMENT_OFFICER');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/employee-requests');
      const data = await response.json();
      if (data.success && data.requests) {
        setRequests(data.requests);
        if (data.requests.length > 0 && !selectedRequest) {
          setSelectedRequest(data.requests[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReviewAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedRequest) return;
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = await fetch(`/api/admin/employee-requests/${selectedRequest.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewNotes: reviewNotes || (action === 'APPROVE' ? 'Approved by Collectorate roster.' : 'Rejected.'),
          assignedRole,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setActionError(data.message || 'Review action failed.');
        return;
      }

      setActionSuccess(data.message);
      setReviewNotes('');
      fetchRequests();
    } catch (err) {
      setActionError('Network error executing administrative review.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 border border-[#D8DEE8] rounded-xl shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#123A78]" />
              <h2 className="text-xl font-bold text-[#1C2733]">
                Government Employee Onboarding &amp; Approval Console
              </h2>
            </div>
            <p className="text-xs text-[#5A6878] mt-0.5">
              Review and authorize cadre access requests for {currentUser.district || 'State'} District Jurisdiction.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded"
          >
            &larr; Back to Console
          </button>
        </div>

        {/* Feedback alerts */}
        {actionSuccess && (
          <div className="p-3 bg-green-50 border-l-4 border-[#1F7A3E] text-xs font-medium text-[#1F7A3E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-3 bg-red-50 border-l-4 border-[#B42318] text-xs font-medium text-[#B42318] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Main Grid: Request List on Left, Detail & Actions on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Filterable List */}
          <div className="lg:col-span-5 bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-2xs space-y-3">
            {/* Search & Status Filter */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Employee ID or Name..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                />
                <Search className="w-3.5 h-3.5 text-[#5A6878] absolute left-2.5 top-2" />
              </div>

              <div className="flex gap-1">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded border ${
                      filterStatus === st
                        ? 'bg-[#123A78] text-white border-[#123A78]'
                        : 'bg-[#F5F7FA] text-[#5A6878] border-[#D8DEE8] hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* List Items */}
            <div className="max-h-[550px] overflow-y-auto space-y-2 divide-y divide-[#D8DEE8] pt-1">
              {filteredRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5A6878]">
                  No matching employee onboarding applications found.
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedRequest(req);
                        setActionSuccess(null);
                        setActionError(null);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors text-left pt-3 ${
                        isSelected
                          ? 'bg-blue-50/70 border border-[#123A78]'
                          : 'hover:bg-[#F5F7FA] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-[#123A78]">
                          {req.employeeId}
                        </span>
                        {req.status === 'PENDING' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-[#C67A00] rounded">
                            Pending
                          </span>
                        )}
                        {req.status === 'APPROVED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-[#1F7A3E] rounded">
                            Approved
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-[#B42318] rounded">
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="font-bold text-xs text-[#1C2733] mt-1">
                        {req.fullName}
                      </div>

                      <div className="text-[11px] text-[#5A6878] mt-0.5">
                        {req.designation} &bull; {req.department}
                      </div>

                      <div className="text-[10px] text-[#7A8794] mt-1">
                        Jurisdiction: {req.district}, {req.state}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Application Details, Document Inspection & Approval Actions */}
          <div className="lg:col-span-7 bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-5 text-left">
            {selectedRequest ? (
              <>
                <div className="border-b border-[#D8DEE8] pb-4 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#123A78]">
                      Application ID: {selectedRequest.id}
                    </span>
                    <h3 className="text-lg font-bold text-[#1C2733]">
                      {selectedRequest.fullName}
                    </h3>
                    <p className="text-xs text-[#5A6878]">
                      {selectedRequest.designation} &bull; {selectedRequest.department}
                    </p>
                  </div>
                  <div>
                    {selectedRequest.status === 'PENDING' && (
                      <span className="px-3 py-1 bg-amber-100 text-[#C67A00] text-xs font-bold rounded flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting Verification</span>
                      </span>
                    )}
                    {selectedRequest.status === 'APPROVED' && (
                      <span className="px-3 py-1 bg-emerald-100 text-[#1F7A3E] text-xs font-bold rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Account</span>
                      </span>
                    )}
                    {selectedRequest.status === 'REJECTED' && (
                      <span className="px-3 py-1 bg-red-100 text-[#B42318] text-xs font-bold rounded flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Details Table */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#5A6878]">Official Email:</span>
                    <div className="font-mono font-semibold text-[#1C2733]">{selectedRequest.officialEmail}</div>
                  </div>
                  <div>
                    <span className="text-[#5A6878]">Phone Number:</span>
                    <div className="font-mono font-semibold text-[#1C2733]">+91 {selectedRequest.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-[#5A6878]">Jurisdiction:</span>
                    <div className="font-semibold text-[#1C2733]">{selectedRequest.district}, {selectedRequest.state}</div>
                  </div>
                  <div>
                    <span className="text-[#5A6878]">Submitted On:</span>
                    <div className="font-semibold text-[#1C2733]">{new Date(selectedRequest.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* Official ID Card Document Preview */}
                <div className="border border-[#D8DEE8] rounded-lg p-3 bg-[#F5F7FA]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1C2733] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#123A78]" />
                      <span>Uploaded Government Credential Card ({selectedRequest.idCardFileName})</span>
                    </span>
                    <span className="text-[10px] text-[#1F7A3E] font-bold">PDF / ID VERIFIED</span>
                  </div>

                  <div className="w-full h-36 bg-gray-200 rounded overflow-hidden relative flex items-center justify-center border border-[#D8DEE8]">
                    <img
                      src={selectedRequest.idCardDocUrl}
                      alt="Government ID Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-3 py-1 bg-white/90 text-xs font-bold text-[#123A78] rounded shadow-2xs">
                        Official Gazette / Service ID Attached
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Action Form (for Pending items) */}
                {selectedRequest.status === 'PENDING' ? (
                  <div className="space-y-3 pt-2 border-t border-[#D8DEE8]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C2733]">
                      Collectorate Review &amp; Role Assignment
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2733] mb-1">
                        Assign Departmental Security Role
                      </label>
                      <select
                        value={assignedRole}
                        onChange={(e) => setAssignedRole(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
                      >
                        <option value="GOVERNMENT_OFFICER">Government Officer (Sub-Divisional / Tehsildar)</option>
                        <option value="VERIFICATION_OFFICER">Verification Officer (Land Title Auditor)</option>
                        <option value="SURVEY_OFFICER">Survey Officer (Geospatial &amp; Cadastral)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2733] mb-1">
                        Verification Remarks / Gazette Roster Reference
                      </label>
                      <textarea
                        rows={2}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="e.g. Verified with Pune District Collectorate Gazette roster volume 4."
                        className="w-full p-2 text-xs bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
                      />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        id="approve-employee-btn"
                        onClick={() => handleReviewAction('APPROVE')}
                        className="flex-1 py-2.5 bg-[#1F7A3E] hover:bg-emerald-800 text-white font-bold text-xs rounded shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve &amp; Activate Official Credentials</span>
                      </button>

                      <button
                        type="button"
                        id="reject-employee-btn"
                        onClick={() => handleReviewAction('REJECT')}
                        className="px-5 py-2.5 bg-[#B42318] hover:bg-red-800 text-white font-bold text-xs rounded shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-xs space-y-1">
                    <div className="font-bold text-[#1C2733]">Action Summary:</div>
                    <div className="text-[#5A6878] italic">"{selectedRequest.reviewNotes}"</div>
                    {selectedRequest.reviewedByEmail && (
                      <div className="text-[10px] text-[#7A8794] font-mono mt-1">
                        Reviewed by: {selectedRequest.reviewedByEmail} &bull; {new Date(selectedRequest.reviewedAt || '').toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-xs text-[#5A6878]">
                Select an application from the left to inspect official credentials.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
