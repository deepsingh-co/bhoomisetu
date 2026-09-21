import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Phone,
  CreditCard,
  History,
  Lock,
  Bell,
  CheckCircle2,
  Download,
  Key,
  Globe,
  Smartphone,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenProfileAuditViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
}

export const CitizenProfileAuditView: React.FC<CitizenProfileAuditViewProps> = ({
  onNavigate,
  language,
  onLanguageChange,
}) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Privacy toggles
  const [maskPublicName, setMaskPublicName] = useState(true);
  const [smsMutationAlerts, setSmsMutationAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/citizen/profile').then((r) => r.json()),
      fetch('/api/citizen/activity-history').then((r) => r.json()),
    ])
      .then(([prof, act]) => {
        setProfileData(prof);
        setActivities(act.activities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Aadhaar & Digilocker e-KYC Verified
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen Profile & Security Audit Log
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your landholder identity, privacy preferences, and monitor official activity history under the Digital Personal Data Protection (DPDP) Act.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              alert('Exporting official UIDAI & Bhulekh login security audit report.')
            }
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#123A78]" /> Download Audit Trail
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Card (1 col) */}
        <div className="space-y-5">
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="w-12 h-12 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-base">
                RP
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {profileData?.name || 'Rameshwar Dnyaneshwar Patil'}
                </h3>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> UIDAI e-KYC Verified
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">AADHAAR NUMBER</span>
                <span className="font-mono font-bold text-gray-900">
                  {profileData?.maskedAadhaar || 'XXXX-XXXX-8421'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">REGISTERED MOBILE</span>
                <span className="font-mono font-bold text-gray-900">
                  {profileData?.phone || '+91 98231 XXXXX'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">DOMICILE TALUKA</span>
                <span className="font-bold text-gray-900">
                  {profileData?.village || 'Wagholi'}, {profileData?.district || 'Pune'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block text-[10px]">LINKED KHATAS (ACCOUNTS)</span>
                <div className="flex gap-1.5 mt-1">
                  <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-mono font-bold border border-blue-200">
                    KH-142-1
                  </span>
                  <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-mono font-bold border border-blue-200">
                    KH-142-2
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & DPDP Act Controls */}
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#123A78]" /> Privacy & Security Controls
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-gray-900 block">Mask Name on Public Search</span>
                  <span className="text-[11px] text-gray-500">Hide full name from unauthorized searchers</span>
                </div>
                <input
                  type="checkbox"
                  checked={maskPublicName}
                  onChange={(e) => setMaskPublicName(e.target.checked)}
                  className="rounded text-[#123A78] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-gray-100">
                <div>
                  <span className="font-semibold text-gray-900 block">Instant SMS Ferfar Alerts</span>
                  <span className="text-[11px] text-gray-500">Alert me immediately if a mutation notice is lodged</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsMutationAlerts}
                  onChange={(e) => setSmsMutationAlerts(e.target.checked)}
                  className="rounded text-[#123A78] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-gray-100">
                <div>
                  <span className="font-semibold text-gray-900 block">Satellite Survey Updates</span>
                  <span className="text-[11px] text-gray-500">Email notice on fresh Cartosat ortho-imagery</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-[#123A78] w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Activity Audit Log (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-[#123A78]" /> Security & Access Audit Trail
              </h3>
              <span className="text-xs text-gray-500">Last 30 Days</span>
            </div>

            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 text-xs flex items-start justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{act.action}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border text-gray-600">
                        {act.details}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span>IP: {act.ip}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    AUTHORIZED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
