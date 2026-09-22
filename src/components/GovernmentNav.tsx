import React, { useState } from 'react';
import {
  LogOut,
  User as UserIcon,
  Shield,
  FileText,
  CheckCircle2,
  Bell,
  Compass,
  Home,
  Users,
  Building2,
  Satellite,
  Landmark,
  Cpu,
  KeyRound,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
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
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Streamlined Public Navigation
  const publicNavItems: { id: ActiveNavView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Portal Gateway', icon: <Home className="w-4 h-4 text-[#123A78]" /> },
    { id: 'citizen-portal', label: 'Citizen Services (नागरिक)', icon: <Users className="w-4 h-4 text-emerald-600" /> },
    { id: 'dashboard', label: 'Officer Desk (अधिकारी)', icon: <Building2 className="w-4 h-4 text-slate-700" /> },
    { id: 'geo-ai', label: 'ISRO GeoAI Studio', icon: <Compass className="w-4 h-4 text-sky-600" /> },
    { id: 'national-command', label: 'National Command Center', icon: <Landmark className="w-4 h-4 text-amber-600" /> },
    { id: 'infrastructure', label: 'AI Infra & DevOps', icon: <Cpu className="w-4 h-4 text-purple-600" /> },
  ];

  // Portals Available to Authenticated User
  const allPortals = [
    { id: 'citizen-portal', label: 'Citizen Portal (नागरिक)', icon: <Users className="w-4 h-4 text-emerald-600" /> },
    { id: 'dashboard', label: 'Officer Verification Desk', icon: <Building2 className="w-4 h-4 text-slate-700" /> },
    { id: 'geo-ai', label: 'ISRO GeoAI Spatial Studio', icon: <Compass className="w-4 h-4 text-sky-600" /> },
    { id: 'national-command', label: 'National Command Center', icon: <Landmark className="w-4 h-4 text-amber-600" /> },
    { id: 'infrastructure', label: 'AI Infrastructure & DevOps', icon: <Cpu className="w-4 h-4 text-purple-600" /> },
  ];

  const handleMobileNav = (viewId: ActiveNavView) => {
    setIsMobileMenuOpen(false);
    onNavigate(viewId);
  };

  return (
    <nav
      id="government-navigation-bar"
      className="sticky top-0 z-40 w-full bg-white border-b border-[#D8DEE8] shadow-xs transition-all"
      aria-label="Main Government Portal Navigation"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        
        {/* 1. Mobile Header Bar (< lg screens: Phones & Small Tablets) */}
        <div className="flex lg:hidden items-center justify-between py-2.5">
          {/* Left: Branding & Section Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMobileNav('home')}
              className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#123A78]"
              title="Return to National Portal Gateway"
            >
              <div className="w-6 h-6 rounded bg-[#123A78] text-white flex items-center justify-center font-black text-xs">
                BS
              </div>
              <span className="font-extrabold tracking-tight">BhoomiSetu</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-semibold text-gray-700 truncate max-w-[130px] sm:max-w-[220px]">
              {publicNavItems.find((i) => i.id === activeView)?.label.split('(')[0] || 'Portal'}
            </span>
          </div>

          {/* Right: Quick Notifications, Auth & Hamburger */}
          <div className="flex items-center gap-1.5">
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2 text-[#123A78] hover:bg-gray-100 rounded-md border border-[#D8DEE8]"
                aria-label="Notifications"
                title="View Government Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B42318] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {!currentUser ? (
              <button
                id="mobile-nav-signin-btn"
                onClick={() => handleMobileNav('login')}
                className="px-2.5 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-md flex items-center gap-1 shadow-2xs transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                id="mobile-user-avatar-btn"
                onClick={() => handleMobileNav('profile')}
                className="w-8 h-8 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                title={`Logged in as ${currentUser.fullName}`}
              >
                {currentUser.fullName.charAt(0)}
              </button>
            )}

            {/* Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 ml-1 text-gray-700 hover:text-[#123A78] hover:bg-gray-100 rounded-md border border-[#D8DEE8] focus:ring-2 focus:ring-[#123A78]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#B42318]" /> : <Menu className="w-5 h-5 text-[#123A78]" />}
            </button>
          </div>
        </div>

        {/* 2. Mobile Drawer Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden border-t border-[#D8DEE8] py-3 space-y-3 bg-[#F8FAFC] -mx-3 sm:-mx-8 px-4 sm:px-8 shadow-inner animate-in slide-in-from-top-2 duration-150"
          >
            {/* User Session Profile Header in Mobile Drawer */}
            {currentUser ? (
              <div className="p-3 bg-white border border-[#D8DEE8] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs text-[#1C2733]">{currentUser.fullName}</div>
                    <div className="text-[10px] text-[#5A6878] uppercase font-semibold">
                      {currentUser.roleType.replace(/_/g, ' ')} &bull; {currentUser.district || 'National'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-[#B42318] bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xs font-bold text-[#123A78]">Official Security Gateway</div>
                  <div className="text-[11px] text-[#5A6878]">Mandatory 2FA OTP verification enforced</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleMobileNav('login')}
                  className="px-3 py-1.5 bg-[#123A78] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Sign In (OTP)
                </button>
              </div>
            )}

            {/* Mobile Navigation List */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-left">
                Workspaces &amp; Services
              </div>
              {publicNavItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNav(item.id)}
                    className={`w-full p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-[#123A78] text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer Note */}
            <div className="pt-2 border-t border-[#D8DEE8] flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NIC Certified Gateway</span>
              </span>
              <span>Helpline: 1800-180-1551</span>
            </div>
          </div>
        )}

        {/* 3. Desktop Navigation Bar (Visible on lg+ screens) */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Navigation Link List */}
          <div className="flex items-center space-x-1 sm:space-x-2 py-0 overflow-x-auto scrollbar-thin">
            {!currentUser ? (
              publicNavItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`relative py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#123A78] rounded-t-sm flex items-center gap-1.5 ${
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
              })
            ) : (
              <>
                <button
                  id="nav-item-home-auth"
                  onClick={() => onNavigate('home')}
                  className={`py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#123A78] ${
                    activeView === 'home'
                      ? 'text-[#123A78] font-bold border-b-2 border-[#123A78] bg-blue-50/50'
                      : 'text-[#5A6878] hover:text-[#123A78]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Gateway</span>
                </button>

                {/* Portal Switcher Dropdown for Logged In User */}
                <div className="relative">
                  <button
                    id="portal-switcher-btn"
                    onClick={() => setIsPortalMenuOpen(!isPortalMenuOpen)}
                    className="py-2.5 px-3 my-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors border border-gray-300"
                  >
                    <span>Switch Workspace</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                  </button>

                  {isPortalMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1.5"
                      onClick={() => setIsPortalMenuOpen(false)}
                    >
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400">
                        All Government Workspaces
                      </div>
                      {allPortals.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onNavigate(p.id)}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 ${
                            activeView === p.id ? 'bg-blue-50 font-bold text-[#123A78]' : 'text-gray-700'
                          }`}
                        >
                          {p.icon}
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Workspace link corresponding to role */}
                {currentUser.roleType === 'CITIZEN' && (
                  <button
                    id="nav-item-citizen-active"
                    onClick={() => onNavigate('citizen-portal')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeView === 'citizen-portal'
                        ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 bg-emerald-50/50'
                        : 'text-gray-700 hover:text-emerald-700'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>My Land Portfolio</span>
                  </button>
                )}

                {['GOVERNMENT_OFFICER', 'VERIFICATION_OFFICER'].includes(currentUser.roleType) && (
                  <button
                    id="nav-item-officer-active"
                    onClick={() => onNavigate('dashboard')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeView === 'dashboard'
                        ? 'text-[#123A78] font-bold border-b-2 border-[#123A78] bg-blue-50/50'
                        : 'text-gray-700 hover:text-[#123A78]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#123A78]" />
                    <span>Officer Verification Desk</span>
                  </button>
                )}

                {currentUser.roleType === 'SURVEY_OFFICER' && (
                  <button
                    id="nav-item-geoai-active"
                    onClick={() => onNavigate('geo-ai')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeView === 'geo-ai'
                        ? 'text-sky-700 font-bold border-b-2 border-sky-600 bg-sky-50/50'
                        : 'text-gray-700 hover:text-sky-700'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>ISRO GeoAI Studio</span>
                  </button>
                )}

                {['DISTRICT_COLLECTOR', 'STATE_ADMIN', 'SUPER_ADMIN'].includes(currentUser.roleType) && (
                  <button
                    id="nav-item-admin-active"
                    onClick={() => onNavigate('national-command')}
                    className={`py-3.5 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeView === 'national-command'
                        ? 'text-amber-800 font-bold border-b-2 border-amber-600 bg-amber-50/50'
                        : 'text-gray-700 hover:text-amber-800'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-amber-700" />
                    <span>National Command</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right Action: Sign In Button when Guest, or Profile & Logout when Logged In */}
          {!currentUser ? (
            <div className="flex items-center gap-2 py-2 pl-3 shrink-0">
              <button
                id="nav-signin-direct-btn"
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign In</span>
              </button>
            </div>
          ) : (
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
      </div>
    </nav>
  );
};
