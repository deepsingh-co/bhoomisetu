import React from 'react';
import {
  ShieldCheck,
  Search,
  Mic,
  FolderOpen,
  CheckCircle2,
  QrCode,
  History,
  FileEdit,
  AlertCircle,
  HelpCircle,
  FileText,
  Bell,
  User,
  ArrowRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface CitizenNavbarProps {
  activeTab: CitizenActiveTab;
  onTabChange: (tab: CitizenActiveTab) => void;
  language: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
  onSwitchToOfficer: () => void;
  unreadCount?: number;
  isOffline?: boolean;
}

export const CitizenNavbar: React.FC<CitizenNavbarProps> = ({
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  onSwitchToOfficer,
  unreadCount = 2,
  isOffline = false,
}) => {
  const menuItems: { id: CitizenActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck },
    { id: 'search', label: 'Universal Search', icon: Search },
    { id: 'voice', label: 'Voice Search', icon: Mic },
    { id: 'portfolio', label: 'My Portfolio', icon: FolderOpen },
    { id: 'trust', label: 'Trust Score', icon: CheckCircle2 },
    { id: 'qr-verify', label: 'QR Verify', icon: QrCode },
    { id: 'timeline', label: '70-Yr Timeline', icon: History },
    { id: 'correction', label: 'Corrections', icon: FileEdit },
    { id: 'grievance', label: 'Grievance', icon: AlertCircle },
    { id: 'wallet', label: 'Doc Wallet', icon: FileText },
    { id: 'help', label: 'Help & Glossary', icon: HelpCircle },
  ];

  return (
    <header className="bg-white border-b border-[#D8DEE8] shadow-sm sticky top-0 z-40">
      {/* Top National Strip */}
      <div className="bg-[#123A78] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide">भारत सरकार | Government of India</span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="hidden md:inline text-gray-300">
              Department of Land Resources & National Informatics Centre (NIC)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Online / Offline status */}
            <div className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded">
              {isOffline ? (
                <>
                  <WifiOff className="w-3 h-3 text-red-300" />
                  <span className="text-red-200">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-green-300" />
                  <span className="text-green-200">NIC Node Online</span>
                </>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-black/20 rounded px-1.5 py-0.5">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 text-[11px] font-medium rounded ${
                  language === 'en' ? 'bg-white text-[#123A78] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                ENG
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-1.5 py-0.5 text-[11px] font-medium rounded ${
                  language === 'hi' ? 'bg-white text-[#123A78] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('mr')}
                className={`px-1.5 py-0.5 text-[11px] font-medium rounded ${
                  language === 'mr' ? 'bg-white text-[#123A78] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Switch to Officer Portal */}
            <button
              onClick={onSwitchToOfficer}
              className="bg-[#0B7A3B] hover:bg-[#096330] text-white text-[11px] font-medium px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              Officer Portal <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Citizen Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          {/* Official Emblem */}
          <div className="w-10 h-10 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-blue-900 shrink-0">
            <span className="tracking-tighter">सत्यमेव<br/>जयते</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-[#123A78] tracking-tight leading-tight">
                Bhulekh AI v3
              </h1>
              <span className="bg-[#0B7A3B]/10 text-[#0B7A3B] text-[10px] font-bold px-2 py-0.5 rounded border border-[#0B7A3B]/30 uppercase">
                Citizen Portal
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium">
              National Land Records Intelligence Portal | DILRMP
            </p>
          </div>
        </div>

        {/* Right Citizen Greeting & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => onTabChange('notifications')}
            className="p-2 text-gray-600 hover:text-[#123A78] hover:bg-gray-100 rounded-full relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Citizen Profile Chip */}
          <button
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#D8DEE8] hover:bg-gray-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#123A78]/10 text-[#123A78] flex items-center justify-center font-semibold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-gray-900 leading-tight">
                Rameshwar Patil
              </div>
              <div className="text-[10px] text-gray-500">
                Aadhaar: XXXX-8421
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Links */}
      <nav className="hidden md:block bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#123A78] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
