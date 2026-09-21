import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Send,
  ArrowRight,
  Shield,
  FileText,
  User,
  MessageSquare,
} from 'lucide-react';
import { CitizenActiveTab, CitizenCorrectionItem } from '../../types/citizen';

interface CorrectionRequestViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CorrectionRequestView: React.FC<CorrectionRequestViewProps> = ({
  onNavigate,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'TRACK'>('TRACK');
  const [requests, setRequests] = useState<CitizenCorrectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Request Form State
  const [surveyNumber, setSurveyNumber] = useState('142/1');
  const [village, setVillage] = useState('Wagholi');
  const [requestType, setRequestType] = useState<any>('OWNER_NAME');
  const [currentDetails, setCurrentDetails] = useState('');
  const [requestedCorrection, setRequestedCorrection] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(['Aadhaar_Card_Verified.pdf']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    fetch('/api/citizen/corrections')
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetails || !requestedCorrection) {
      alert('Please provide both current details and requested correction.');
      return;
    }

    setIsSubmitting(true);
    fetch('/api/citizen/correction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        surveyNumber,
        village,
        requestType,
        currentDetails,
        requestedCorrection,
        evidenceFiles: uploadedFiles,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        setSubmittedReceipt(data);
        fetchRequests();
      })
      .catch(() => setIsSubmitting(false));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Government Land Records Correction System
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Land Record Discrepancy & Correction Requests
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Submit formal correction applications for spelling errors, area variances, or boundary disputes under Maharashtra Land Revenue Code (MLRC Section 155).
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => {
              setActiveTab('TRACK');
              setSubmittedReceipt(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'TRACK'
                ? 'bg-white text-[#123A78] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Track Applications ({requests.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('NEW');
              setSubmittedReceipt(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'NEW'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            + File New Correction
          </button>
        </div>
      </div>

      {/* Submitted Receipt Alert */}
      {submittedReceipt && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-emerald-950 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Application Submitted Successfully!
          </div>
          <p className="text-xs">
            Your correction request has been registered in the DILRMP revenue ledger with Tracking ID:{' '}
            <strong className="font-mono text-sm">{submittedReceipt.trackingId}</strong>.
            Assigned to Haveli Circle Revenue Office. Official SLA: 15 working days.
          </p>
          <button
            onClick={() => setActiveTab('TRACK')}
            className="text-xs bg-[#0B7A3B] text-white px-3 py-1.5 rounded font-semibold"
          >
            View in Tracker
          </button>
        </div>
      )}

      {/* NEW REQUEST FORM */}
      {activeTab === 'NEW' && !submittedReceipt && (
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-5">
          <h3 className="text-base font-bold text-gray-900 border-b pb-3">
            Application for Land Record Correction (Form 8B)
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Survey / Gat Number *
                </label>
                <input
                  type="text"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold"
                  placeholder="e.g. 142/1"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Village & Taluka *
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold"
                  placeholder="e.g. Wagholi, Haveli"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Type of Correction Requested *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold bg-white"
              >
                <option value="OWNER_NAME">Owner Name / Spelling Omission Correction</option>
                <option value="AREA">Land Holding Area Discrepancy (Hectares / Gunthas)</option>
                <option value="BOUNDARY">Boundary / Cadastral Peg Displacement</option>
                <option value="MUTATION">Mutation Entry Missing / Delayed Ferfar</option>
                <option value="DUPLICATE">Duplicate Khata Record Removal</option>
                <option value="DOCUMENT_UPLOAD">Digitized Map / Scan Clarity Issue</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Current Details in Record (जैसा अभी दर्ज है) *
              </label>
              <textarea
                value={currentDetails}
                onChange={(e) => setCurrentDetails(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                placeholder="Describe current erroneous text or area (e.g. 'Ramesh Patil middle name omitted')..."
                required
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Requested Correction (जैसा सही होना चाहिए) *
              </label>
              <textarea
                value={requestedCorrection}
                onChange={(e) => setRequestedCorrection(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                placeholder="Enter exact corrected name, area, or boundary details as per official legal deed..."
                required
              />
            </div>

            {/* Document Upload Simulation */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Supporting Evidence Documents (Aadhaar, Sale Deed, Old 7/12)
              </label>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-600 block">
                  Drag & Drop or Click to Attach PDF Evidence (Max 5MB)
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Attached: {uploadedFiles.join(', ')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('TRACK')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#123A78] hover:bg-[#0e2c5d] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting to Revenue Portal...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TRACKING LIST VIEW */}
      {activeTab === 'TRACK' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              Submitted Applications & Live Revenue Status
            </h3>
            <span className="text-xs text-gray-500">
              Updated from Haveli Taluka Revenue Portal
            </span>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs hover:border-[#123A78] transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#123A78] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {req.trackingId}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        Survey {req.surveyNumber}, {req.village}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">
                      {req.requestType.replace('_', ' ')}: {req.requestedCorrection}
                    </h4>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                      req.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'FIELD_VERIFICATION'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    STATUS: {req.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Step Bar */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="p-1.5 rounded bg-emerald-100 text-emerald-800">
                    1. Submitted
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      req.status !== 'SUBMITTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    2. Under Review
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      req.status === 'FIELD_VERIFICATION' || req.status === 'RESOLVED'
                        ? 'bg-purple-100 text-purple-900 font-bold'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    3. Field Panchnama
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      req.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    4. Sanction Order
                  </div>
                </div>

                {/* Details & Officer Remarks */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span>Assigned Officer: <strong className="text-gray-800">{req.assignedOfficer}</strong></span>
                    <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Officer Remarks:</strong> {req.officerRemarks || 'Verification in progress.'}
                  </p>
                </div>

                {/* Citizen Conversation Thread if any */}
                {req.citizenReplies && req.citizenReplies.length > 0 && (
                  <div className="text-xs space-y-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-[#123A78] flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Citizen Communications Thread:
                    </span>
                    {req.citizenReplies.map((r, i) => (
                      <p key={i} className="text-gray-600 pl-4 border-l-2 border-blue-300 mt-1">
                        <strong>{r.author} ({r.date}):</strong> {r.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
