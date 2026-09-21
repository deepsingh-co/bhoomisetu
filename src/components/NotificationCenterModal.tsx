import React from 'react';
import { Bell, Check, Shield, UserCheck, KeyRound, AlertTriangle, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ACCOUNT_APPROVAL':
        return <UserCheck className="w-4 h-4 text-[#1F7A3E]" />;
      case 'SECURITY':
      case 'LOGIN_ALERT':
        return <Shield className="w-4 h-4 text-[#123A78]" />;
      case 'SYSTEM':
        return <Bell className="w-4 h-4 text-[#C67A00]" />;
      default:
        return <KeyRound className="w-4 h-4 text-[#5A6878]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-center-title"
    >
      <div className="w-full max-w-md bg-white border border-[#D8DEE8] rounded-xl shadow-2xl overflow-hidden mt-12 animate-in slide-in-from-top-4">
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <div>
              <h3 id="notification-center-title" className="text-sm font-bold">
                Government Notification Centre
              </h3>
              <p className="text-[10px] text-blue-100">
                Official Departmental Alerts &amp; Audits
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

        <div className="max-h-[70vh] overflow-y-auto divide-y divide-[#D8DEE8]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5A6878] space-y-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-[#7A8794]">
                <Bell className="w-5 h-5" />
              </div>
              <div className="font-bold text-[#1C2733]">No New Notifications</div>
              <div>All system advisories and security alerts have been acknowledged.</div>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 text-left space-y-1.5 transition-colors ${
                  n.isRead ? 'bg-white' : 'bg-blue-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIcon(n.type)}
                    <span className="text-xs font-bold text-[#1C2733]">{n.title}</span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => onMarkAsRead(n.id)}
                      title="Mark as read"
                      className="p-1 hover:bg-white rounded border border-[#D8DEE8] text-[#123A78] text-[10px] flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3 h-3" />
                      <span>Read</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#5A6878] leading-relaxed pl-6">
                  {n.message}
                </p>

                <div className="text-[10px] text-[#7A8794] font-mono pl-6">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
