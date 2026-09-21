import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Send,
  CheckCircle2,
  Clock,
  Star,
  Shield,
  FileText,
  HelpCircle,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { CitizenActiveTab, CitizenGrievanceItem } from '../../types/citizen';

interface GrievancePortalViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const GrievancePortalView: React.FC<GrievancePortalViewProps> = ({
  onNavigate,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'NEW'>('LIST');
  const [grievances, setGrievances] = useState<CitizenGrievanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Grievance Form State
  const [category, setCategory] = useState<any>('MUTATION_DELAY');
  const [priority, setPriority] = useState<any>('HIGH');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any | null>(null);

  const fetchGrievances = () => {
    setLoading(true);
    fetch('/api/citizen/grievances')
      .then((res) => res.json())
      .then((data) => {
        setGrievances(data.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      alert('Please fill out both subject and description.');
      return;
    }

    setIsSubmitting(true);
    fetch('/api/citizen/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        priority,
        subject,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        setSubmittedTicket(data);
        fetchGrievances();
      })
      .catch(() => setIsSubmitting(false));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Right to Public Services Act (RTSA)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen Public Grievance Redressal Portal
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Government of India Centralized Public Grievance Redress and Monitoring System (CPGRAMS). Legally binding 15-day statutory resolution guarantee.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => {
              setActiveTab('LIST');
              setSubmittedTicket(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'LIST'
                ? 'bg-white text-[#123A78] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Grievances ({grievances.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('NEW');
              setSubmittedTicket(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'NEW'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            + Lodge Grievance
          </button>
        </div>
      </div>

      {/* Submitted Ticket Receipt */}
      {submittedTicket && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-emerald-950 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Grievance Registered Successfully!
          </div>
          <p className="text-xs">
            Official Ticket Number:{' '}
            <strong className="font-mono text-sm">{submittedTicket.ticketNumber}</strong>. Forwarded to Sub-Divisional Officer (SDO) Pune Collectorate.
          </p>
          <button
            onClick={() => setActiveTab('LIST')}
            className="text-xs bg-[#0B7A3B] text-white px-3 py-1.5 rounded font-semibold"
          >
            View Grievance Status
          </button>
        </div>
      )}

      {/* NEW GRIEVANCE FORM */}
      {activeTab === 'NEW' && !submittedTicket && (
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-3">
            Lodge Official Public Grievance (Form G-1)
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Grievance Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold bg-white"
                >
                  <option value="MUTATION_DELAY">Unreasonable Delay in Mutation / Ferfar Sanction</option>
                  <option value="LAND_RECORD_ISSUE">Incorrect Entry in 7/12 RoR</option>
                  <option value="VERIFICATION_DELAY">Delay in DILRMP Digital Verification</option>
                  <option value="FRAUD_REPORT">Report Encroachment or Forged Land Record</option>
                  <option value="GIS_ERROR">Cadastral Boundary Mapping Error</option>
                  <option value="TECHNICAL_ISSUE">Portal Technical / Download Failure</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Severity / Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold bg-white"
                >
                  <option value="HIGH">High (Active Construction / Registry Deadline)</option>
                  <option value="URGENT">Urgent (Imminent Illegal Encroachment)</option>
                  <option value="MEDIUM">Medium (General Rectification)</option>
                  <option value="LOW">Low (Information Query)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Grievance Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Heirship Mutation Ferfar No. 8419 pending past 30-day statutory period..."
                className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Detailed Description & Reference Numbers *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                placeholder="Include survey number, application date, village, and Talathi office visited..."
                required
              />
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
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
                {isSubmitting ? 'Registering with Collectorate...' : 'Lodge Grievance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRIEVANCES LIST VIEW */}
      {activeTab === 'LIST' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              Active Grievance Tickets & Statutory Deadlines
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              RTSA Mandated: 15 Working Days
            </span>
          </div>

          <div className="space-y-4">
            {grievances.map((grv) => (
              <div
                key={grv.id}
                className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs hover:border-[#123A78] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#123A78] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {grv.ticketNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {grv.priority} PRIORITY
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mt-1">
                      {grv.subject}
                    </h4>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                      grv.status === 'CLOSED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    STATUS: {grv.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {grv.description}
                </p>

                {/* Resolution & Officer Note */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span>Assigned Officer: <strong className="text-gray-800">{grv.assignedOfficer}</strong></span>
                    <span>Filed on: {new Date(grv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>Official Action Note:</strong> {grv.resolutionNotes || 'Inquiry initiated.'}
                  </p>
                </div>

                {/* Citizen Rating */}
                {grv.satisfactionRating && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 pt-1">
                    <span>Citizen Redressal Satisfaction:</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < grv.satisfactionRating! ? 'fill-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
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
