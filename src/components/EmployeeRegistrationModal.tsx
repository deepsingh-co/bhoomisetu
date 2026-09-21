import React, { useState } from 'react';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Building2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { GovernmentEmployeeRequestItem } from '../types';

interface EmployeeRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeRegistrationModal: React.FC<EmployeeRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [modalTab, setModalTab] = useState<'apply' | 'status'>('apply');

  // Application Form State
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Revenue & Land Records Office');
  const [designation, setDesignation] = useState('Naib Tehsildar & Circle Officer');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [officialEmail, setOfficialEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fileName, setFileName] = useState('Official_ID_Card.pdf');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Status Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<GovernmentEmployeeRequestItem | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          employeeId,
          department,
          designation,
          district,
          state,
          officialEmail,
          phoneNumber,
          idCardDocUrl: filePreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
          idCardFileName: fileName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Submission failed.');
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess({ id: data.requestId, message: data.message });
    } catch (err) {
      setErrorMessage('Network error submitting official credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Lookup Handler (mock search from db or static demo items)
  const handleStatusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('kulkarni') || q.includes('712') || q.includes('101')) {
      setLookupResult({
        id: 'req-emp-101',
        fullName: 'Mahesh Gopal Kulkarni',
        employeeId: 'MH-REV-KOT-712',
        department: 'Taluka Land Records Office (Baramati)',
        designation: 'Naib Tehsildar & Circle Officer',
        district: 'Pune',
        state: 'Maharashtra',
        officialEmail: 'mahesh.kulkarni@rev.gov.in',
        phoneNumber: '9422019283',
        idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        idCardFileName: 'GOV_ID_KULKARNI_MH_REV.pdf',
        status: 'PENDING',
        createdAt: '2026-09-19T10:00:00.000Z',
      });
    } else if (q.includes('jadhav') || q.includes('992') || q.includes('103')) {
      setLookupResult({
        id: 'req-emp-103',
        fullName: 'Dilip R. Jadhav',
        employeeId: 'MH-PAT-PUN-992',
        department: 'Village Revenue Administrative Office',
        designation: 'Talathi / Patwari',
        district: 'Pune',
        state: 'Maharashtra',
        officialEmail: 'dilip.jadhav@rev.gov.in',
        phoneNumber: '9765431290',
        idCardDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60',
        idCardFileName: 'GOI_PATWARI_CARD.pdf',
        status: 'APPROVED',
        reviewNotes: 'Verified with Pune District Collectorate Gazette roster.',
        reviewedAt: '2026-09-17T11:30:00.000Z',
        reviewedByEmail: 'vikram.meena@ias.gov.in',
        createdAt: '2026-09-15T09:00:00.000Z',
      });
    } else {
      setLookupError('No application found for this Employee ID / Request ID. Ensure you enter a valid ID.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-registration-title"
    >
      <div className="w-full max-w-2xl bg-white border border-[#D8DEE8] rounded-xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-amber-300" />
            <div>
              <h3 id="employee-registration-title" className="text-sm font-bold tracking-wide">
                Government Employee Department Onboarding
              </h3>
              <p className="text-[11px] text-blue-100">
                Collectorate Verification &amp; Clearance Workflow (Non-Direct Registration)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D8DEE8] bg-[#F5F7FA]">
          <button
            type="button"
            id="tab-emp-apply"
            onClick={() => setModalTab('apply')}
            className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition-colors ${
              modalTab === 'apply'
                ? 'border-[#123A78] text-[#123A78] bg-white'
                : 'border-transparent text-[#5A6878] hover:text-[#1C2733]'
            }`}
          >
            1. Submit Onboarding Application
          </button>
          <button
            type="button"
            id="tab-emp-status"
            onClick={() => setModalTab('status')}
            className={`flex-1 py-3 px-4 text-xs font-bold text-center border-b-2 transition-colors ${
              modalTab === 'status'
                ? 'border-[#123A78] text-[#123A78] bg-white'
                : 'border-transparent text-[#5A6878] hover:text-[#1C2733]'
            }`}
          >
            2. Track Application Status
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-left max-h-[75vh] overflow-y-auto">
          {modalTab === 'apply' ? (
            submitSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 text-[#1F7A3E] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#1C2733]">
                  Application Submitted for Collectorate Verification
                </h4>
                <p className="text-xs text-[#5A6878] max-w-md mx-auto leading-relaxed">
                  Your employment credentials have been forwarded to the District Collectorate. Under NIC security rules, accounts are activated only following departmental authorization.
                </p>

                <div className="p-3 bg-[#F5F7FA] border border-[#D8DEE8] rounded-md max-w-sm mx-auto font-mono text-xs text-[#123A78]">
                  Application Tracking ID: <strong>{submitSuccess.id}</strong>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(submitSuccess.id);
                      setModalTab('status');
                    }}
                    className="px-4 py-2 bg-[#123A78] text-white text-xs font-semibold rounded hover:bg-[#1D5AA6]"
                  >
                    View Status Screen
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-[#D8DEE8] text-[#1C2733] text-xs font-semibold rounded hover:bg-gray-50"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border-l-4 border-[#C67A00] rounded text-[#1C2733] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C67A00]" />
                    <span>Government Policy Directive: No Direct Registration</span>
                  </div>
                  <p className="text-[11px] text-[#5A6878]">
                    Government officers cannot create self-authorized accounts. Every request is verified by the District Collector or State Revenue Admin before departmental access is provisioned.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-red-50 border-l-4 border-[#B42318] text-[#B42318] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mahesh Gopal Kulkarni"
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Official Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. MH-REV-KOT-712"
                      className="w-full p-2.5 text-xs font-mono uppercase bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Department / Office <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Taluka Revenue Office"
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Official Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Naib Tehsildar / Talathi"
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Cadre State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Central Cadre">Central Cadre (New Delhi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      District Jurisdiction <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Thane">Thane</option>
                      <option value="Mumbai Headquarters">Mumbai Headquarters</option>
                      <option value="New Delhi">New Delhi</option>
                    </select>
                  </div>
                </div>

                {/* Official Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Official Email (.gov.in / .nic.in) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="e.g. mkulkarni@rev.gov.in"
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C2733] mb-1">
                      Government Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9422019283"
                      className="w-full p-2.5 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                </div>

                {/* Upload Government ID Card */}
                <div>
                  <label className="block font-bold text-[#1C2733] mb-1">
                    Upload Government ID Card / Appointment Order <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-[#D8DEE8] hover:border-[#123A78] rounded-lg p-4 text-center bg-[#F5F7FA] transition-colors">
                    <Upload className="w-6 h-6 text-[#5A6878] mx-auto mb-1.5" />
                    <div className="font-semibold text-xs text-[#123A78]">
                      Click to upload or drag and drop official credential document
                    </div>
                    <div className="text-[10px] text-[#7A8794] mt-0.5">
                      PDF, PNG, JPG (Departmental ID card, Service book extract, or Transfer order)
                    </div>
                    <input
                      type="file"
                      id="upload-gov-id-input"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,image/*"
                    />
                    <label
                      htmlFor="upload-gov-id-input"
                      className="mt-2.5 inline-block px-3 py-1.5 bg-white border border-[#D8DEE8] rounded font-semibold text-xs text-[#1C2733] cursor-pointer hover:bg-gray-100"
                    >
                      Select Official File
                    </label>
                    {fileName && (
                      <div className="mt-2 text-xs font-mono text-[#1F7A3E] flex items-center justify-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attached: {fileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-onboarding-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application for Collectorate Approval'}</span>
                </button>
              </form>
            )
          ) : (
            /* STATUS SCREEN */
            <div className="space-y-4">
              <form onSubmit={handleStatusSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Employee ID (e.g. MH-REV-KOT-712 or req-emp-101)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
                  />
                  <Search className="w-4 h-4 text-[#5A6878] absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  id="search-status-btn"
                  className="px-4 py-2 bg-[#123A78] text-white font-semibold text-xs rounded hover:bg-[#1D5AA6]"
                >
                  Check Status
                </button>
              </form>

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-[#B42318] rounded">
                  {lookupError}
                </div>
              )}

              {/* Status Display Card */}
              {lookupResult ? (
                <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D8DEE8] pb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#123A78]">
                        {lookupResult.employeeId}
                      </span>
                      <h4 className="text-sm font-bold text-[#1C2733]">
                        {lookupResult.fullName}
                      </h4>
                    </div>
                    {/* Status Badge */}
                    {lookupResult.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-[#C67A00] font-bold text-xs rounded">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Verification</span>
                      </span>
                    )}
                    {lookupResult.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-[#1F7A3E] font-bold text-xs rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved &amp; Active</span>
                      </span>
                    )}
                    {lookupResult.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-[#B42318] font-bold text-xs rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#5A6878]">Department:</span>
                      <div className="font-semibold text-[#1C2733]">{lookupResult.department}</div>
                    </div>
                    <div>
                      <span className="text-[#5A6878]">Designation:</span>
                      <div className="font-semibold text-[#1C2733]">{lookupResult.designation}</div>
                    </div>
                    <div>
                      <span className="text-[#5A6878]">Jurisdiction:</span>
                      <div className="font-semibold text-[#1C2733]">{lookupResult.district}, {lookupResult.state}</div>
                    </div>
                    <div>
                      <span className="text-[#5A6878]">Official Email:</span>
                      <div className="font-mono text-[#1C2733]">{lookupResult.officialEmail}</div>
                    </div>
                  </div>

                  {/* Review remarks & Reason */}
                  {lookupResult.reviewNotes && (
                    <div className="p-2.5 bg-white border border-[#D8DEE8] rounded text-xs">
                      <div className="font-bold text-[#1C2733]">Collectorate Verification Remarks:</div>
                      <div className="text-[#5A6878] italic mt-0.5">{lookupResult.reviewNotes}</div>
                      {lookupResult.reviewedByEmail && (
                        <div className="text-[10px] text-[#7A8794] mt-1 font-mono">
                          Reviewed by: {lookupResult.reviewedByEmail}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-[#7A8794]">
                    Submitted on {new Date(lookupResult.createdAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#5A6878] bg-[#F5F7FA] rounded border border-[#D8DEE8]">
                  Enter your Employee ID or Tracking ID above to inspect departmental verification status.
                  <div className="mt-2 text-[11px] text-[#123A78]">
                    Try testing with: <strong>MH-REV-KOT-712</strong> (Pending) or <strong>MH-PAT-PUN-992</strong> (Approved).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
