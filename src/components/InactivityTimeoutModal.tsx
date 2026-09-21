import React from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle } from 'lucide-react';

interface InactivityTimeoutModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

export const InactivityTimeoutModal: React.FC<InactivityTimeoutModalProps> = ({
  isOpen,
  secondsRemaining,
  onExtendSession,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-warning-title"
    >
      <div className="w-full max-w-md bg-white border-2 border-[#B42318] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#B42318] text-white p-4 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <h3 id="inactivity-warning-title" className="text-sm font-bold">
              Session Inactivity Alert
            </h3>
            <p className="text-[11px] text-red-100">
              National Informatics Centre Security Protocol
            </p>
          </div>
        </div>

        <div className="p-6 text-left space-y-4">
          <p className="text-xs text-[#1C2733] leading-relaxed">
            In accordance with Government of India Information Security Standards, authorized sessions terminate automatically following periods of inactivity.
          </p>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#C67A00] font-semibold">
              <Clock className="w-4 h-4" />
              <span>Session terminating in:</span>
            </div>
            <span className="font-mono text-xl font-extrabold text-[#B42318]">
              {secondsRemaining}s
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              id="extend-session-btn"
              onClick={onExtendSession}
              className="flex-1 py-2.5 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Extend Active Session</span>
            </button>

            <button
              id="terminate-session-btn"
              onClick={onLogout}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1C2733] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#B42318]" />
              <span>Sign Out Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
