import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  AlertTriangle,
  Lock,
  LogOut,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { User, SessionItem } from '../types';

interface SecurityCenterViewProps {
  currentUser: User;
  onBackToDashboard: () => void;
  onLogoutAll: () => void;
}

export const SecurityCenterView: React.FC<SecurityCenterViewProps> = ({
  currentUser,
  onBackToDashboard,
  onLogoutAll,
}) => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    currentUser.is2FAEnabled ?? currentUser.twoFactorEnabled ?? true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`/api/admin/sessions/${currentUser.id}`);
      const data = await res.json();
      if (data.success && data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentUser.id]);

  const toggle2FA = async () => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch('/api/admin/security/toggle-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, enabled: !twoFactorEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(!twoFactorEnabled);
        setFeedbackMessage(data.message);
      }
    } catch (err) {
      setFeedbackMessage('Failed to update 2FA configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/admin/sessions/${sessionId}/revoke`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchSessions();
        setFeedbackMessage(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 border border-[#D8DEE8] rounded-xl shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1F7A3E]" />
              <h2 className="text-xl font-bold text-[#1C2733]">
                Government Security Centre &amp; Device Integrity
              </h2>
            </div>
            <p className="text-xs text-[#5A6878] mt-0.5">
              Manage multi-factor authentication, active workstation sessions, and NIC audit credentials.
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-gray-100 border border-[#D8DEE8] text-[#123A78] text-xs font-semibold rounded"
          >
            &larr; Back to Console
          </button>
        </div>

        {feedbackMessage && (
          <div className="p-3 bg-green-50 border-l-4 border-[#1F7A3E] text-xs text-[#1F7A3E] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 2FA & Credentials Management */}
          <div className="lg:col-span-5 space-y-6">
            {/* 2FA Toggle Card */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8DEE8] pb-3">
                <div className="flex items-center gap-2 text-[#123A78] font-bold text-sm">
                  <Lock className="w-4 h-4 text-[#123A78]" />
                  <span>Two-Factor Authentication (2FA)</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    twoFactorEnabled
                      ? 'bg-emerald-100 text-[#1F7A3E]'
                      : 'bg-red-100 text-[#B42318]'
                  }`}
                >
                  {twoFactorEnabled ? 'ENFORCED' : 'DISABLED'}
                </span>
              </div>

              <p className="text-xs text-[#5A6878] leading-relaxed">
                Mandatory for gazetted officers under MeitY Security Guidelines 2026. Dispatches high-priority OTP to your registered official phone and NIC email.
              </p>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C2733]">
                  Status: {twoFactorEnabled ? 'Active Protection' : 'Suspended'}
                </span>
                <button
                  type="button"
                  id="toggle-2fa-btn"
                  onClick={toggle2FA}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs font-bold rounded shadow-2xs transition-colors ${
                    twoFactorEnabled
                      ? 'bg-[#B42318] hover:bg-red-800 text-white'
                      : 'bg-[#1F7A3E] hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isLoading ? 'Updating...' : twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* Suspicious Activity & Security Advisory */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C67A00]">
                <AlertTriangle className="w-4 h-4 text-[#C67A00]" />
                <span>Security Integrity Watch</span>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
                <div className="font-bold text-[#C67A00]">Automated Threat Detection:</div>
                <p className="text-[#5A6878]">
                  Zero unauthorized intrusion attempts or concurrent geographic anomalies detected across this account in the last 30 days.
                </p>
              </div>

              <div className="text-[11px] text-[#7A8794]">
                NIC CERT-In monitors all land records transactions under Indian Cyber Security Framework.
              </div>
            </div>
          </div>

          {/* Right Column: Active Workstations & Sessions */}
          <div className="lg:col-span-7 bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8DEE8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1C2733]">
                  Active Devices &amp; Authorized Workstations
                </h3>
                <p className="text-xs text-[#5A6878]">
                  Authenticated sessions linked to your Government of India identity token.
                </p>
              </div>

              <button
                type="button"
                id="logout-all-devices-btn"
                onClick={onLogoutAll}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#B42318] border border-red-200 text-xs font-semibold rounded flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Terminate All Other Sessions</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 border border-[#D8DEE8] rounded-lg bg-[#F5F7FA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white border border-[#D8DEE8] rounded text-[#123A78]">
                      {(sess.userAgent || sess.browser || '').toLowerCase().includes('mobile') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C2733]">
                          {sess.deviceName || 'Collectorate Workstation'}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-[#1F7A3E] text-[10px] font-bold rounded">
                            CURRENT SESSION
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-[#5A6878] mt-0.5 flex flex-wrap items-center gap-2">
                        <span>IP: <code className="font-mono text-[#123A78]">{sess.ipAddress}</code></span>
                        <span>&bull;</span>
                        <span>Location: {sess.location}</span>
                        <span>&bull;</span>
                        <span>Signed in: {new Date(sess.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-2.5 py-1 text-xs font-medium text-[#B42318] hover:bg-red-50 border border-red-200 rounded"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
