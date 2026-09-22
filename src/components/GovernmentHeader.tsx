import React from 'react';
import { Volume2, Bell, ShieldCheck, Mic } from 'lucide-react';
import { AshokaEmblem, NicBadge, TricolorRibbon } from './Emblems';
import { Language, translations } from '../translations';

interface GovernmentHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  textSize: number;
  onTextSizeChange: (delta: number) => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenVoiceSearch?: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  language,
  onLanguageChange,
  textSize,
  onTextSizeChange,
  isHighContrast,
  onToggleHighContrast,
  unreadCount,
  onOpenNotifications,
  onOpenVoiceSearch,
}) => {
  const t = translations[language];
  const currentDate = new Date().toLocaleDateString(
    language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const announceScreenReader = () => {
    const announcement = `BhoomiSetu. Government of India, Ministry of Rural Development. Screen reader active. High contrast is ${
      isHighContrast ? 'enabled' : 'disabled'
    }.`;
    const utterance = new SpeechSynthesisUtterance(announcement);
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#D8DEE8] text-[#1C2733]" role="banner">
      {/* Top National Tricolor Accent Bar */}
      <TricolorRibbon />

      {/* Top Accessibility and Utility Strip */}
      <div className="bg-[#F5F7FA] border-b border-[#D8DEE8] py-1 px-4 sm:px-8 text-xs text-[#5A6878]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Official Portal Subtitle & Date */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#123A78] hidden sm:inline">
              {t.nationalPortal}
            </span>
            <span className="hidden md:inline text-[#D8DEE8]">|</span>
            <span className="font-mono text-[#5A6878]">{currentDate}</span>
          </div>

          {/* Accessibility Controls & Language Selector */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Screen Reader Trigger */}
            <button
              id="screen-reader-btn"
              onClick={announceScreenReader}
              title="Screen Reader Announcement (Text-to-Speech)"
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#D8DEE8] bg-white hover:bg-gray-100 text-[#123A78] transition-colors focus:ring-2 focus:ring-[#123A78]"
              aria-label="Screen reader assistance"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Screen Reader</span>
            </button>

            {/* Text Resizer */}
            <div className="flex items-center border border-[#D8DEE8] rounded bg-white overflow-hidden" role="group" aria-label="Text size controls">
              <button
                id="text-decrease-btn"
                onClick={() => onTextSizeChange(-1)}
                className={`px-2 py-0.5 text-xs font-semibold hover:bg-gray-100 border-r border-[#D8DEE8] ${
                  textSize < 0 ? 'text-[#123A78] bg-blue-50' : 'text-[#5A6878]'
                }`}
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                id="text-reset-btn"
                onClick={() => onTextSizeChange(0)}
                className={`px-2 py-0.5 text-xs font-semibold hover:bg-gray-100 border-r border-[#D8DEE8] ${
                  textSize === 0 ? 'text-[#123A78] bg-blue-50 font-bold' : 'text-[#5A6878]'
                }`}
                title="Default font size"
                aria-label="Standard font size"
              >
                A
              </button>
              <button
                id="text-increase-btn"
                onClick={() => onTextSizeChange(1)}
                className={`px-2 py-0.5 text-xs font-semibold hover:bg-gray-100 ${
                  textSize > 0 ? 'text-[#123A78] bg-blue-50' : 'text-[#5A6878]'
                }`}
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              id="high-contrast-toggle"
              onClick={onToggleHighContrast}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-colors focus:ring-2 focus:ring-[#123A78] ${
                isHighContrast
                  ? 'bg-[#1C2733] text-white border-[#1C2733]'
                  : 'bg-white text-[#1C2733] border-[#D8DEE8] hover:bg-gray-100'
              }`}
              title="Toggle High Contrast Mode"
              aria-pressed={isHighContrast}
            >
              {t.highContrast}
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-[#D8DEE8] rounded bg-white px-1.5 py-0.5">
              <label htmlFor="language-select" className="sr-only">
                Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="text-xs bg-transparent font-medium text-[#123A78] focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Notifications Alert Bell */}
            <button
              id="notification-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-gray-200 text-[#123A78] focus:ring-2 focus:ring-[#123A78]"
              title="Government Notification Centre"
              aria-label={`Government notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B42318] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Government Banner & Ministry Emblem Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: National Emblem + Ministry Details */}
        <div className="flex items-center gap-4 text-left w-full md:w-auto">
          <div className="shrink-0 flex items-center justify-center">
            <AshokaEmblem size={56} />
          </div>

          <div className="flex flex-col border-l-2 border-[#D8DEE8] pl-3.5">
            <span className="text-xs font-bold tracking-wider uppercase text-[#5A6878]">
              {t.govtOfIndia}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#1C2733]">
              {t.ministryName}
            </span>
            <span className="text-[11px] sm:text-xs text-[#5A6878]">
              {t.deptName}
            </span>
          </div>

          <div className="hidden lg:flex flex-col border-l border-[#D8DEE8] pl-3.5">
            <span className="text-sm font-bold text-[#123A78] tracking-tight flex items-center gap-1.5">
              {t.portalTitle}
              <span className="bg-[#123A78] text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold">
                GOI v3.0
              </span>
            </span>
            <span className="text-xs text-[#5A6878]">
              {t.portalSubtitle}
            </span>
          </div>
        </div>

        {/* Right Side: Security Badges & Verifications */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {onOpenVoiceSearch && (
            <button
              onClick={onOpenVoiceSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[#0B7A3B] text-xs font-bold rounded-lg transition-colors shadow-2xs focus:ring-2 focus:ring-[#0B7A3B]"
              title="Voice-Based Land Search (Hindi / Marathi / English)"
            >
              <Mic className="w-4 h-4 text-[#0B7A3B] animate-pulse" />
              <span className="hidden sm:inline">Voice Land Search</span>
            </button>
          )}
          <NicBadge />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-[#1F7A3E] text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Govt Identity Gateway</span>
          </div>
        </div>
      </div>
    </header>
  );
};
