import React from 'react';
import { LogOut, User as UserIcon, Shield, FileText, CheckCircle2, Bell, Compass } from 'lucide-react';
import { Language, translations } from '../translations';
import { User } from '../types';

export type ActiveNavView = string;

interface GovernmentNavProps {
  language: Language;
  activeView: ActiveNavView;
  onNavigate: (view: any) => void;
  currentUser: User | null;
  onLogout: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const GovernmentNav: React.FC<GovernmentNavProps> = ({
  language,
  activeView,
  onNavigate,
  currentUser,
  onLogout,
  unreadNotificationsCount = 0,
  onOpenNotifications,
}) => {
  const t = translations[language];

  const publicNavItems: { id: ActiveNavView; label: string; badge?: string }[] = [
    { id: 'home', label: t.home },
    { id: 'national-command', label: 'National Command Center (GoI)', badge: 'Module 5' },
    { id: 'citizen-portal', label: 'Citizen Portal (नागरिक पोर्टल)' },
    { id: 'geo-ai', label: 'ISRO GeoAI Layer' },
    { id: 'citizen-services', label: t.citizenServices },
    { id: 'officer-login', label: t.officerLogin },
    { id: 'verification', label: t.verification },
    { id: 'help-centre', label: t.helpCentre },
    { id: 'contact', label: t.contact },
    { id: 'rti', label: t.rti },
    { id: 'about-platform', label: t.aboutPlatform },
  ];

  // Additional Nav items when authenticated
  const authenticatedItems: { id: ActiveNavView; label: string; icon?: React.ReactNode; badge?: string }[] = [
    { id: 'national-command', label: 'National Command Center', icon: <Shield className="w-4 h-4 text-amber-500" />, badge: 'Admin' },
    { id: 'citizen-portal', label: 'Citizen Portal View', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
    { id: 'dashboard', label: 'Officer Dashboard', icon: <FileText className="w-4 h-4" /> },
    { id: 'geo-ai', label: 'ISRO GeoAI Layer', icon: <Compass className="w-4 h-4 text-amber-500" /> },
    { id: 'voice-search', label: 'Voice Search', icon: <FileText className="w-4 h-4 text-emerald-700" /> },
    { id: 'multi-agent', label: 'Multi-Agent Hub', icon: <FileText className="w-4 h-4 text-[#123A78]" /> },
    { id: 'timeline', label: 'AI Land Timeline', icon: <FileText className="w-4 h-4 text-amber-700" /> },
    { id: 'trust-score', label: 'Citizen Trust Score', icon: <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" /> },
    { id: 'upload', label: 'Upload & Scanner', icon: <FileText className="w-4 h-4" /> },
    { id: 'queue', label: 'AI Verification Queue', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'gis', label: 'GIS & Satellite', icon: <Shield className="w-4 h-4" /> },
    { id: 'parcel-dna', label: 'Parcel 360° & DNA', icon: <FileText className="w-4 h-4" /> },
    { id: 'fraud', label: 'Fraud & Disputes', icon: <Shield className="w-4 h-4 text-[#B42318]" /> },
    { id: 'mutation-sim', label: 'Mutation Simulator', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'DILRMP Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'security-center', label: 'Security Center', icon: <Shield className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Activity', icon: <FileText className="w-4 h-4" /> },
  ];

  // If Admin or Collector, add Employee Approvals
  if (
    currentUser &&
    ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_COLLECTOR'].includes(currentUser.roleType)
  ) {
    authenticatedItems.splice(1, 0, {
      id: 'approvals',
      label: 'Employee Approvals',
      icon: <CheckCircle2 className="w-4 h-4 text-[#1F7A3E]" />,
    });
  }

  return (
    <nav
      id="government-navigation-bar"
      className="sticky top-0 z-40 w-full bg-white border-b border-[#D8DEE8] shadow-sm transition-all"
      aria-label="Main Government Portal Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between overflow-x-auto scrollbar-thin">
        {/* Navigation Link List */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-0">
          {!currentUser ? (
            publicNavItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-3.5 px-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#123A78] rounded-t-sm ${
                    isActive
                      ? 'text-[#123A78] font-bold border-b-2 border-[#123A78] bg-blue-50/50'
                      : 'text-[#1C2733] hover:text-[#123A78] hover:bg-gray-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 bg-amber-100 border border-amber-300 text-amber-900 rounded text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })
          ) : (
            <>
              <button
                id="nav-item-home-auth"
                onClick={() => onNavigate('home')}
                className={`py-3.5 px-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#123A78] ${
                  activeView === 'home'
                    ? 'text-[#123A78] font-bold border-b-2 border-[#123A78]'
                    : 'text-[#5A6878] hover:text-[#123A78]'
                }`}
              >
                {t.home}
              </button>

              {authenticatedItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-1.5 py-3.5 px-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#123A78] ${
                      isActive
                        ? 'text-[#123A78] font-bold border-b-2 border-[#123A78] bg-blue-50/50'
                        : 'text-[#1C2733] hover:text-[#123A78] hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Authenticated User Status Strip & Logout */}
        {currentUser && (
          <div className="flex items-center gap-3 py-2 pl-4 shrink-0 border-l border-[#D8DEE8]">
            <button
              id="user-profile-nav-btn"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 text-left hover:bg-gray-50 p-1.5 rounded focus:ring-2 focus:ring-[#123A78]"
              title="View Officer Profile & Clearance"
            >
              <div className="w-8 h-8 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block leading-tight">
                <div className="text-xs font-bold text-[#1C2733] truncate max-w-[140px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-[#5A6878] uppercase font-semibold">
                  {currentUser.roleType.replace('_', ' ')}
                </div>
              </div>
            </button>

            {onOpenNotifications && (
              <button
                type="button"
                id="nav-notification-bell-btn"
                onClick={onOpenNotifications}
                className="relative p-2 text-[#123A78] hover:bg-gray-100 rounded-md border border-[#D8DEE8] focus:ring-2 focus:ring-[#123A78]"
                title="View Government Notifications & Advisories"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B42318] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="secure-signout-nav-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B42318] bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors focus:ring-2 focus:ring-[#B42318]"
              title="Terminate Secure Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
