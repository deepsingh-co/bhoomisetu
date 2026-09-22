import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  KeyRound,
  UserCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Search,
  Compass,
  Users,
  Building2,
  LayoutDashboard,
  Cpu,
  FileCheck2,
  Sparkles,
  Smartphone,
  MapPin,
  RefreshCw,
  AlertTriangle,
  QrCode,
  FileText,
  Clock,
  Layers,
  Award,
  ExternalLink,
  ChevronRight,
  Eye,
  Satellite,
  Landmark,
} from 'lucide-react';
import { Language, translations } from '../translations';
import { DigitalIndiaBadge } from './Emblems';
import { User, RoleType } from '../types';
import { LandParcelDetail } from '../types/landRecords';
import { INITIAL_PARCELS } from '../data/seedParcels';

interface LandingPortalGatewayProps {
  language: Language;
  currentUser?: User | null;
  onNavigateToPortal: (portalId: string) => void;
  onLoginSuccess: (user: User, token: string, targetPortal?: string) => void;
  onRequire2FA: (tempToken: string, phoneMasked: string, emailMasked: string, testOtpHint?: string) => void;
  onRequireCitizenOtp: (identifier: string, testOtpHint?: string) => void;
  onOpenRegisterModal: () => void;
  onOpenForgotPasswordModal: () => void;
  onSelectParcelForView?: (parcelId: string) => void;
}

export const LandingPortalGateway: React.FC<LandingPortalGatewayProps> = ({
  language,
  currentUser,
  onNavigateToPortal,
  onLoginSuccess,
  onRequire2FA,
  onRequireCitizenOtp,
  onOpenRegisterModal,
  onOpenForgotPasswordModal,
  onSelectParcelForView,
}) => {
  const t = translations[language];

  // Quick Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'quick-roles' | 'officer' | 'citizen'>('quick-roles');
  const [heroActivePortal, setHeroActivePortal] = useState<'citizen' | 'officer' | 'survey' | 'collector' | 'devops'>('citizen');

  // Search & Public Tool States
  const [activeToolTab, setActiveToolTab] = useState<'khasra-search' | 'verify-cert' | 'track-app'>('khasra-search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedParcel, setSearchedParcel] = useState<LandParcelDetail | null>(INITIAL_PARCELS[0]);
  const [certInput, setCertInput] = useState('CERT-2026-MH-4421');
  const [certResult, setCertResult] = useState<any | null>(null);
  const [appInput, setAppInput] = useState('MUT-2026-0918');
  const [appResult, setAppResult] = useState<any | null>(null);

  // Officer Form State
  const [officerIdentifier, setOfficerIdentifier] = useState('suresh.patil@rev.gov.in');
  const [officerPassword, setOfficerPassword] = useState('Nic@Bhulekh2026');
  const [officerDistrict, setOfficerDistrict] = useState('Pune');
  const [officerDepartment, setOfficerDepartment] = useState('Taluka Revenue Office');
  
  // Citizen Form State
  const [citizenMode, setCitizenMode] = useState<'mobile' | 'email'>('mobile');
  const [citizenMobile, setCitizenMobile] = useState('9876543210');
  const [citizenEmail, setCitizenEmail] = useState('ramesh.kisan@gmail.com');
  const [citizenPassword, setCitizenPassword] = useState('Citizen@2026');

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('7K9N4');
  const [captchaInput, setCaptchaInput] = useState('7K9N4');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  // Portal Access Guard: Direct access without authentication + OTP is strictly forbidden
  const handleAccessPortal = (portalId: string) => {
    if (currentUser) {
      onNavigateToPortal(portalId);
      return;
    }
    // Direct entry is blocked: authentication and OTP verification are mandatory
    if (portalId === 'citizen-portal') {
      setLoginModalTab('citizen');
      setAuthError('Access Security Gate: Citizen identity authentication and OTP verification are required to enter the Citizen Portal.');
    } else {
      setLoginModalTab('officer');
      if (portalId === 'geo-ai') {
        setOfficerIdentifier('arun.singh@survey.gov.in');
        setOfficerDepartment('Survey of India (Cadastral Wing)');
      } else if (portalId === 'national-command') {
        setOfficerIdentifier('vikram.meena@ias.gov.in');
        setOfficerDepartment('District Collectorate');
      } else if (portalId === 'infrastructure') {
        setOfficerIdentifier('rajesh.verma@nic.in');
        setOfficerDepartment('Ministry of Rural Development / NIC');
      } else {
        setOfficerIdentifier('suresh.patil@rev.gov.in');
        setOfficerDepartment('Taluka Revenue Office');
      }
      setAuthError('Access Security Gate: Official government credentials and Level-3 Two-Factor OTP verification are mandatory to enter this portal.');
    }
    setIsLoginModalOpen(true);
  };

  // 1-Click Persona Quick Logins - ALWAYS requires OTP verification before portal entry
  const handleQuickRoleLogin = async (role: RoleType, targetPortal: string) => {
    setAuthError(null);
    setAuthLoading(true);

    let identifier = 'ramesh.kisan@gmail.com';
    let password = 'Citizen@2026';

    if (role === 'CITIZEN') {
      identifier = 'ramesh.kisan@gmail.com';
      password = 'Citizen@2026';
    } else if (role === 'GOVERNMENT_OFFICER') {
      identifier = 'suresh.patil@rev.gov.in';
      password = 'Nic@Bhulekh2026';
    } else if (role === 'SURVEY_OFFICER') {
      identifier = 'arun.singh@survey.gov.in';
      password = 'Nic@Bhulekh2026';
    } else if (role === 'DISTRICT_COLLECTOR') {
      identifier = 'vikram.meena@ias.gov.in';
      password = 'Nic@Bhulekh2026';
    } else if (role === 'SUPER_ADMIN') {
      identifier = 'rajesh.verma@nic.in';
      password = 'Nic@Bhulekh2026';
    } else if (role === 'VERIFICATION_OFFICER') {
      identifier = 'priya.nair@audit.gov.in';
      password = 'Nic@Bhulekh2026';
    } else if (role === 'STATE_ADMIN') {
      identifier = 'ananya.deshmukh@maharashtra.gov.in';
      password = 'Nic@Bhulekh2026';
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          password,
          captchaInput: captchaCode,
          expectedCaptcha: captchaCode,
        }),
      });

      const data = await response.json();

      setIsLoginModalOpen(false);
      if (response.ok && data.success) {
        if (role === 'CITIZEN' && citizenMode === 'mobile') {
          onRequireCitizenOtp(identifier, data.testOtpHint || '123456');
        } else {
          onRequire2FA(
            data.tempAuthToken || `temp-token-${role.toLowerCase()}`,
            data.phoneMasked || '+91 ******7889',
            data.emailMasked || `${identifier[0]}***@${identifier.split('@')[1]}`,
            data.testOtpHint || '123456'
          );
        }
      } else {
        // Fallback simulation mode: MUST STILL REQUIRE OTP VERIFICATION
        onRequire2FA(
          `temp-token-${role.toLowerCase()}`,
          '+91 ******7889',
          `${identifier[0]}***@${identifier.split('@')[1]}`,
          '123456'
        );
      }
    } catch (err) {
      // Fallback: MUST STILL REQUIRE OTP VERIFICATION
      setIsLoginModalOpen(false);
      onRequire2FA(
        `temp-token-${role.toLowerCase()}`,
        '+91 ******7889',
        `${identifier[0]}***@${identifier.split('@')[1]}`,
        '123456'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Submit Officer Login - Dispatches OTP and requires 2FA verification
  const handleOfficerFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: officerIdentifier,
          password: officerPassword,
          captchaInput,
          expectedCaptcha: captchaCode,
          district: officerDistrict,
          department: officerDepartment,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setAuthError(data.message || 'Officer credentials invalid.');
        refreshCaptcha();
        return;
      }

      setIsLoginModalOpen(false);
      // Mandatory OTP verification
      onRequire2FA(
        data.tempAuthToken || 'temp-token',
        data.phoneMasked || '+91 ******7889',
        data.emailMasked || `${officerIdentifier[0]}***@${officerIdentifier.split('@')[1]}`,
        data.testOtpHint || '123456'
      );
    } catch (err) {
      setAuthError('Network error connecting to government authentication gateway.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Submit Citizen Login - Dispatches OTP and requires verification
  const handleCitizenFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    if (citizenMode === 'mobile') {
      try {
        const res = await fetch('/api/auth/citizen-otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: citizenMobile,
            captchaInput,
            expectedCaptcha: captchaCode,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setAuthError(data.message || 'Unable to dispatch OTP.');
          refreshCaptcha();
          return;
        }
        setIsLoginModalOpen(false);
        onRequireCitizenOtp(citizenMobile, data.testOtpHint || '123456');
      } catch (err) {
        setAuthError('Network error sending citizen OTP.');
      } finally {
        setAuthLoading(false);
      }
    } else {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: citizenEmail,
            password: citizenPassword,
            captchaInput,
            expectedCaptcha: captchaCode,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setAuthError(data.message || 'Invalid email or password.');
          refreshCaptcha();
          return;
        }
        setIsLoginModalOpen(false);
        // Mandatory OTP verification
        if (data.requires2FA) {
          onRequire2FA(data.tempAuthToken, data.phoneMasked, data.emailMasked, data.testOtpHint);
        } else {
          onRequireCitizenOtp(citizenEmail, data.testOtpHint || '123456');
        }
      } catch (err) {
        setAuthError('Network error during citizen authentication.');
      } finally {
        setAuthLoading(false);
      }
    }
  };

  // Search parcel logic
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const found = INITIAL_PARCELS.find(
      (p) =>
        p.surveyNumber.toLowerCase().includes(q) ||
        p.khataNumber.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.parcelUid.toLowerCase().includes(q)
    );
    if (found) {
      setSearchedParcel(found);
    } else {
      setSearchedParcel(INITIAL_PARCELS[0]);
    }
  };

  // Verify Certificate logic
  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    setCertResult({
      certId: certInput || 'CERT-2026-MH-4421',
      status: 'VERIFIED_AUTHENTIC',
      issueDate: '2026-03-24',
      issuingAuthority: 'Sub-Divisional Officer, Haveli Taluka, Pune',
      parcelUid: 'IN-MH-PUN-HAV-2024-00142-A',
      khasraNo: '142/A (Wagholi)',
      titleHolder: 'Rameshwar Kisan Patil & Suresh Kisan Patil',
      areaHa: '2.45 Hectares (6.05 Acres)',
      hash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    });
  };

  // Track Application logic
  const handleTrackApp = (e: React.FormEvent) => {
    e.preventDefault();
    setAppResult({
      appNumber: appInput || 'MUT-2026-0918',
      type: 'Mutation (वारस नोंद / Succession Partition)',
      filedOn: '2026-03-12',
      applicant: 'Rameshwar Kisan Patil',
      status: 'UNDER_TEHSILDAR_HEARING',
      currentStage: 3,
      stages: [
        { label: 'Application Submitted Online', status: 'COMPLETED', date: '12 Mar 2026' },
        { label: 'Circle Officer Notice & 15-Day Public Objection Period', status: 'COMPLETED', date: '27 Mar 2026' },
        { label: 'Tehsildar Hearing & Boundary Verification', status: 'IN_PROGRESS', date: 'Active' },
        { label: 'Final 7/12 RoR Ledger Mutation Entry & Digital Seal', status: 'PENDING', date: 'Expected 28 Sep 2026' },
      ],
    });
  };

  return (
    <div className="w-full bg-[#F5F7FA] text-[#1C2733] flex flex-col">
      {/* 1. Official Top Ministry Notice Banner */}
      <div className="bg-[#123A78] text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-medium tracking-wide">
              {t.itActNotice}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-blue-100">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              28 States &amp; 8 UTs Active
            </span>
            <span>•</span>
            <span>MeitY Empanelled</span>
            <span>•</span>
            <span>ISRO Bhuvan Connected</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section: Official National Identity & Gateway Overview */}
      <section className="bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border-b border-[#D8DEE8] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4">
            
            {/* National Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D8DEE8] rounded-full text-xs font-semibold text-[#123A78] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1F7A3E]"></span>
              <span>{t.govtOfIndia} • {t.deptName}</span>
              <span className="text-[#D8DEE8]">|</span>
              <span className="text-[#5A6878]">DILRMP Certified</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1C2733] leading-tight">
              National Land Records &amp; Cadastral Intelligence Gateway
            </h1>
            
            <p className="text-base sm:text-lg text-[#5A6878] leading-relaxed max-w-3xl">
              A unified, role-governed digital gateway for <strong>Citizens, Farmers, Revenue Officers, Cadastral Specialists, and District Collectors</strong>. Select your designated workspace below to sign in or explore public services.
            </p>

            {/* UNIFIED ROLE-BASED PORTAL LOGIN & WORK GATEWAY */}
            <div className="w-full max-w-4xl mt-4 bg-white border-2 border-[#123A78]/30 rounded-2xl shadow-xl overflow-hidden text-left">
              {/* Top Banner */}
              <div className="bg-[#123A78] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#0e2c5d]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-sm tracking-wide">
                    Unified Portal Login &amp; Workspace Gateway
                  </span>
                </div>
                <span className="text-[11px] text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                  Select your role to sign in directly
                </span>
              </div>

              {/* Portal Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 bg-gray-100/80 p-1.5 gap-1 border-b border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHeroActivePortal('citizen')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActivePortal === 'citizen'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Citizen / Farmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActivePortal('officer')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActivePortal === 'officer'
                      ? 'bg-[#123A78] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Revenue Officer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActivePortal('survey')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActivePortal === 'survey'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Satellite className="w-4 h-4 shrink-0" />
                  <span>Cadastral &amp; GIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActivePortal('collector')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActivePortal === 'collector'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span>District Collector</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActivePortal('devops')}
                  className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActivePortal === 'devops'
                      ? 'bg-purple-800 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>Infrastructure</span>
                </button>
              </div>

              {/* Portal Workspace Details & Direct Login Body */}
              <div className="p-5 sm:p-6 bg-white">
                {heroActivePortal === 'citizen' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                          Public &amp; Rural Landowners
                        </span>
                        <span className="text-xs text-gray-500 font-medium">नागरिक व शेतकरी पोर्टल</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Citizen &amp; Landowner Services Portal
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Access your official 7/12 &amp; 8A land records, view high-res satellite plots with boundary corners &amp; distance badges, use rural voice recognition, and track mutation certificates.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 pt-1">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 7/12 &amp; 8A DigiWallet
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> GIS Satellite &amp; Corners
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Voice Rural Search
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 min-w-[260px]">
                      <button
                        onClick={() => handleQuickRoleLogin('CITIZEN', 'citizen-portal')}
                        disabled={authLoading}
                        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Sign In as Ramesh Kisan (Citizen)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setLoginModalTab('citizen');
                            setIsLoginModalOpen(true);
                          }}
                          className="py-2 px-3 bg-gray-50 hover:bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Mobile OTP</span>
                        </button>
                        <button
                          onClick={() => handleAccessPortal('citizen-portal')}
                          className="py-2 px-3 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Enter Portal (OTP)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {heroActivePortal === 'officer' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#123A78] bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                          Revenue Administration
                        </span>
                        <span className="text-xs text-gray-500 font-medium">तहसीलदार व मंडळ अधिकारी</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Revenue Officer &amp; Tehsildar Desk
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Verify uploaded deed scans using bilingual Devanagari AI OCR, inspect mutation applications, simulate parcel subdivisions, and examine forensic dispute risk scores.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 pt-1">
                        <span className="flex items-center gap-1 text-[#123A78] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AI OCR Queue
                        </span>
                        <span className="flex items-center gap-1 text-[#123A78] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mutation Simulator
                        </span>
                        <span className="flex items-center gap-1 text-[#123A78] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 70-Year Timeline
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 min-w-[260px]">
                      <button
                        onClick={() => handleQuickRoleLogin('GOVERNMENT_OFFICER', 'dashboard')}
                        disabled={authLoading}
                        className="w-full py-3 px-4 bg-[#123A78] hover:bg-[#0e2c5d] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Sign In as Suresh Patil (Tehsildar)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setLoginModalTab('officer');
                            setIsLoginModalOpen(true);
                          }}
                          className="py-2 px-3 bg-gray-50 hover:bg-blue-50 border border-blue-300 text-[#123A78] font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#123A78]" />
                          <span>Gov ID &amp; 2FA</span>
                        </button>
                        <button
                          onClick={() => handleAccessPortal('dashboard')}
                          className="py-2 px-3 bg-white hover:bg-blue-50 border border-blue-300 text-[#123A78] font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#123A78]" />
                          <span>Enter Desk (2FA)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {heroActivePortal === 'survey' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase">
                          ISRO &amp; Survey of India Spatial Lab
                        </span>
                        <span className="text-xs text-gray-500 font-medium">भू-नकाशा व जीआयएस प्रयोगशाळा</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        ISRO GeoAI &amp; Satellite Cadastral Studio
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Cross-reference ETS surveyed cadastral vectors against Cartosat-3 and Bhuvan multi-spectral imagery, inspect 3D digital twin village models, and detect boundary shifts.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 pt-1">
                        <span className="flex items-center gap-1 text-sky-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bhuvan &amp; Cartosat-3
                        </span>
                        <span className="flex items-center gap-1 text-sky-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 3D Digital Twin
                        </span>
                        <span className="flex items-center gap-1 text-sky-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Encroachment Alerting
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 min-w-[260px]">
                      <button
                        onClick={() => handleQuickRoleLogin('SURVEY_OFFICER', 'geo-ai')}
                        disabled={authLoading}
                        className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Sign In as Arun Singh (Survey Officer)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>

                      <button
                        onClick={() => handleAccessPortal('geo-ai')}
                        className="py-2 px-3 bg-white hover:bg-sky-50 border border-sky-300 text-sky-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-sky-700" />
                        <span>Launch GeoAI (2FA)</span>
                      </button>
                    </div>
                  </div>
                )}

                {heroActivePortal === 'collector' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                          Apex Administration &amp; NIC
                        </span>
                        <span className="text-xs text-gray-500 font-medium">जिल्हाधिकारी व राष्ट्रीय कमान</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        National Command Center &amp; Collectorate
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Supervise 36 States &amp; UTs cadastral digitisation progress, enact district emergency disaster freezes, oversee revenue collection metrics, and manage 7-tier officer role approvals.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 pt-1">
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 36 States/UTs Live Map
                        </span>
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disaster Freeze Controls
                        </span>
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Revenue Analytics
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 min-w-[260px]">
                      <button
                        onClick={() => handleQuickRoleLogin('DISTRICT_COLLECTOR', 'national-command')}
                        disabled={authLoading}
                        className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Sign In as Dr. Neha Sharma (Collector)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>

                      <button
                        onClick={() => handleAccessPortal('national-command')}
                        className="py-2 px-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Command Center (2FA)</span>
                      </button>
                    </div>
                  </div>
                )}

                {heroActivePortal === 'devops' && (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                          AI Infrastructure &amp; Security Ops
                        </span>
                        <span className="text-xs text-gray-500 font-medium">प्रणाली अभियंता व सुरक्षा</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        AI Infrastructure &amp; Cloud DevOps Console
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Monitor live Gemini AI pipelines, inspect Prometheus &amp; Grafana system telemetry, configure BullMQ message queues, and review immutable cryptographic audit trails.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-600 pt-1">
                        <span className="flex items-center gap-1 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Prometheus Telemetry
                        </span>
                        <span className="flex items-center gap-1 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Redis &amp; BullMQ Queues
                        </span>
                        <span className="flex items-center gap-1 text-purple-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographic Ledger
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0 min-w-[260px]">
                      <button
                        onClick={() => handleQuickRoleLogin('SUPER_ADMIN', 'infrastructure')}
                        disabled={authLoading}
                        className="w-full py-3 px-4 bg-purple-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Sign In as Vikram Mehta (Lead DevOps)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>

                      <button
                        onClick={() => handleAccessPortal('infrastructure')}
                        className="py-2 px-3 bg-white hover:bg-purple-50 border border-purple-300 text-purple-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Cpu className="w-3.5 h-3.5 text-purple-700" />
                        <span>DevOps Console (2FA)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-xs text-[#5A6878]">
              <DigitalIndiaBadge />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A3E]" />
                <span>7-Tier Role Matrix</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A3E]" />
                <span>ISRO Bhuvan Spatial Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A3E]" />
                <span>2FA IT Act Certified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE SECTION: THE 5 DEDICATED PORTAL WORKSPACES */}
      <section className="py-10 sm:py-14 bg-[#F5F7FA] border-b border-[#D8DEE8]" aria-labelledby="portals-selection-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-3 py-1 bg-blue-100 text-[#123A78] text-xs font-bold rounded-full uppercase tracking-wider">
              Choose Your Designated Workspace
            </span>
            <h2 id="portals-selection-heading" className="text-2xl sm:text-3xl font-extrabold text-[#1C2733] mt-2">
              Select Your Portal &amp; Sign In
            </h2>
            <p className="text-sm text-[#5A6878] mt-1.5">
              Each portal provides specialized capabilities tailored to your jurisdiction and official responsibilities.
            </p>
          </div>

          {/* 5-Card Dedicated Portals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* PORTAL 1: CITIZEN & LANDOWNER PORTAL */}
            <div className="bg-white border-2 border-emerald-500/80 hover:border-emerald-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Public &amp; Farmers
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                  <UserCheck className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Citizen &amp; Landowner Portal
                </h3>
                <p className="text-xs font-medium text-emerald-800 mb-2">
                  नागरिक एवं भू-स्वामी सेवा पोर्टल
                </p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For landowners, farmers, buyers and legal heirs to inspect 7/12 &amp; 8A RoR ledgers, download QR-verified title certificates, and file mutation or correction requests.
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Digital 7/12 &amp; 8A RoR Record Wallet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100-pt Land Trust Score &amp; Title Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Voice Search in Hindi, Marathi &amp; English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Online Grievance &amp; Mutation Tracker</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="portal-card-citizen-quick-login"
                  onClick={() => handleQuickRoleLogin('CITIZEN', 'citizen-portal')}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Citizen Login (Ramesh Kisan)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="portal-card-citizen-otp-login"
                    onClick={() => {
                      setLoginModalTab('citizen');
                      setIsLoginModalOpen(true);
                    }}
                    className="py-2 px-3 bg-gray-50 hover:bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile OTP</span>
                  </button>

                  <button
                    id="portal-card-citizen-open-view"
                    onClick={() => handleAccessPortal('citizen-portal')}
                    className="py-2 px-3 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Enter Portal (OTP)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PORTAL 2: REVENUE OFFICER & TEHSILDAR DESK */}
            <div className="bg-white border-2 border-[#123A78]/80 hover:border-[#123A78] rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#123A78] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Revenue Administration
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#123A78] mb-4">
                  <Building2 className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Revenue Officer &amp; Tehsildar Desk
                </h3>
                <p className="text-xs font-medium text-[#123A78] mb-2">
                  राजस्व एवं सत्यापन अधिकारी कार्यक्षेत्र
                </p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For Patwaris, Talathis, Circle Officers, Tehsildars, and SDMs to process document uploads, run Devanagari AI OCR, and simulate boundary partitions.
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#123A78] shrink-0" />
                    <span>Dual-Pane AI OCR &amp; Verification Queue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#123A78] shrink-0" />
                    <span>Mutation "What-If" Impact Simulator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#123A78] shrink-0" />
                    <span>Fraud Forensic Intelligence &amp; Multi-Agent Hub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#123A78] shrink-0" />
                    <span>1950–2026 Historical Land Timeline Chain</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="portal-card-officer-quick-login"
                  onClick={() => handleQuickRoleLogin('GOVERNMENT_OFFICER', 'dashboard')}
                  className="w-full py-2.5 px-4 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>1-Click Tehsildar Login (Suresh Patil)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="portal-card-officer-2fa-login"
                    onClick={() => {
                      setLoginModalTab('officer');
                      setIsLoginModalOpen(true);
                    }}
                    className="py-2 px-3 bg-gray-50 hover:bg-blue-50 border border-blue-300 text-[#123A78] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>ID &amp; 2FA Login</span>
                  </button>

                  <button
                    id="portal-card-officer-queue-btn"
                    onClick={() => handleAccessPortal('queue')}
                    className="py-2 px-3 bg-white hover:bg-blue-50 border border-blue-300 text-[#123A78] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-[#123A78]" />
                    <span>AI Queue (2FA)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PORTAL 3: ISRO GEOAI & SATELLITE CADASTRAL LAB */}
            <div className="bg-white border-2 border-sky-500/80 hover:border-sky-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-sky-700 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                ISRO &amp; Spatial GIS
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-4">
                  <Satellite className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  ISRO GeoAI &amp; Satellite Lab
                </h3>
                <p className="text-xs font-medium text-sky-800 mb-2">
                  इसरो भू-स्थानिक बुद्धिमत्ता केंद्र (Module 3)
                </p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For Cadastral Surveyors and GIS Specialists to cross-reference physical coordinates against Bhuvan &amp; Sentinel-2 satellite imagery for change detection.
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Bhuvan &amp; Sentinel-2 Multi-Spectral Layers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>AI Satellite Change Detection (2018 vs 2026)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>3D Village Digital Twin Spatial CAD Model</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Boundary Anomaly &amp; Encroachment Alerting</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="portal-card-survey-quick-login"
                  onClick={() => handleQuickRoleLogin('SURVEY_OFFICER', 'geo-ai')}
                  className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Surveyor Login (Arun Singh)</span>
                </button>

                <button
                  id="portal-card-launch-geo-ai"
                  onClick={() => handleAccessPortal('geo-ai')}
                  className="w-full py-2 px-3 bg-white hover:bg-sky-50 border border-sky-300 text-sky-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-700" />
                  <span>Launch GeoAI Studio (2FA Required)</span>
                </button>
              </div>
            </div>

            {/* PORTAL 4: DISTRICT COLLECTOR & NATIONAL COMMAND */}
            <div className="bg-white border-2 border-amber-500/80 hover:border-amber-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Apex Command (GoI / NIC)
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-4">
                  <Landmark className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  National Command &amp; Collectorate
                </h3>
                <p className="text-xs font-medium text-amber-900 mb-2">
                  राष्ट्रीय कमान एवं जिला कलेक्टर केंद्र (Module 5)
                </p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For District Collectors (IAS), State Revenue Secretaries, and NIC Directors to supervise district governance, disaster emergency freezes, and 7-tier officer roles.
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Interactive 36 States/UTs National Cadastral Map</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>District Collector Governance &amp; Revenue Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Disaster / Flood Emergency Land Freezing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>7-Tier Role Matrix &amp; Cryptographic Audit Trail</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="portal-card-collector-quick-login"
                  onClick={() => handleQuickRoleLogin('DISTRICT_COLLECTOR', 'national-command')}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Collector Login (Vikram Meena IAS)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="portal-card-superadmin-quick-login"
                    onClick={() => handleQuickRoleLogin('SUPER_ADMIN', 'national-command')}
                    className="py-2 px-3 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Super Admin</span>
                  </button>

                  <button
                    id="portal-card-open-command-center"
                    onClick={() => handleAccessPortal('national-command')}
                    className="py-2 px-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Open Center (2FA)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PORTAL 5: AI INFRASTRUCTURE & DEVOPS OPERATIONS */}
            <div className="bg-white border-2 border-purple-500/80 hover:border-purple-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-700 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                Enterprise Infra
              </div>

              <div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mb-4">
                  <Cpu className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  AI Infrastructure &amp; Security Ops
                </h3>
                <p className="text-xs font-medium text-purple-800 mb-2">
                  एआई इन्फ्रास्ट्रक्चर एवं सुरक्षा केंद्र (Module 6)
                </p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For Cloud Architects, CERT-In Auditors, and DevOps Engineers to supervise multi-agent consensus, semantic vector RAG engines, and system latency.
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 mb-6 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>5 Autonomous Agents (Patwari, Tehsildar, GIS, Legal)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>pgvector Semantic Search &amp; RAG Knowledge Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Redis Caching &amp; High-Throughput Queue Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>TLS 1.3 &amp; CERT-In Compliance Logs Audit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="portal-card-infra-launch"
                  onClick={() => handleAccessPortal('infrastructure')}
                  className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Launch AI Infra (2FA Required)</span>
                </button>

                <button
                  id="portal-card-all-roles-modal-btn"
                  onClick={() => {
                    setLoginModalTab('quick-roles');
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-white hover:bg-purple-50 border border-purple-300 text-purple-900 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Switch Any Government Role</span>
                </button>
              </div>
            </div>

            {/* PORTAL 6: QUICK OVERVIEW / ALL ROLES DIRECT ACCESS CARD */}
            <div className="bg-gradient-to-br from-[#123A78] to-[#0A2246] rounded-xl p-6 shadow-sm text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-6 h-6 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    7-Tier RBAC Access Roster
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">
                  Unified Single Sign-On (SSO)
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Authenticated users seamlessly move between departments according to their jurisdictional clearance. No separate logins needed.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 1</span>
                    <span>Citizen &amp; Farmers</span>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 2</span>
                    <span>Survey Specialists</span>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 3</span>
                    <span>Revenue Officers</span>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 4</span>
                    <span>Title Auditors</span>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 5</span>
                    <span>District Collectors</span>
                  </div>
                  <div className="bg-white/10 rounded p-2">
                    <span className="text-amber-300 font-bold block">Level 6/7</span>
                    <span>State &amp; National Admin</span>
                  </div>
                </div>
              </div>

              <button
                id="portal-card-open-all-roles-btn"
                onClick={() => {
                  setLoginModalTab('quick-roles');
                  setIsLoginModalOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <KeyRound className="w-4 h-4" />
                <span>Open Unified Authentication Hub</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PUBLIC QUICK SEARCH & VERIFICATION CENTER */}
      <section className="py-10 bg-white border-b border-[#D8DEE8]" aria-labelledby="public-lookup-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 id="public-lookup-title" className="text-2xl font-bold text-[#1C2733]">
              Public Land Record Search &amp; Verification Center
            </h2>
            <p className="text-xs text-[#5A6878] mt-1">
              Check cadastral title verification, authenticate digital certificates, or track mutation applications instantly without signing in.
            </p>
          </div>

          {/* Interactive Tool Tabs */}
          <div className="max-w-4xl mx-auto bg-[#F5F7FA] border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs">
            
            <div className="flex border-b border-[#D8DEE8] bg-gray-100/70">
              <button
                id="tool-tab-khasra"
                onClick={() => setActiveToolTab('khasra-search')}
                className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeToolTab === 'khasra-search'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Instant Khasra / Survey Search</span>
              </button>

              <button
                id="tool-tab-cert"
                onClick={() => setActiveToolTab('verify-cert')}
                className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeToolTab === 'verify-cert'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Verify Digital Certificate QR</span>
              </button>

              <button
                id="tool-tab-track"
                onClick={() => setActiveToolTab('track-app')}
                className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeToolTab === 'track-app'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Mutation Application</span>
              </button>
            </div>

            {/* TAB 1: KHASRA / SURVEY SEARCH */}
            {activeToolTab === 'khasra-search' && (
              <div className="p-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="khasra-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Khasra No (e.g. 142/A, 108/B, 219) or Village (e.g. Wagholi, Haveli)..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8DEE8] rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <button
                    type="submit"
                    id="khasra-search-submit-btn"
                    className="px-6 py-2.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Search Parcel
                  </button>
                </form>

                {/* Quick Suggestion Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-gray-500">
                  <span>Quick Test Parcels:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('142/A');
                      setSearchedParcel(INITIAL_PARCELS[0]);
                    }}
                    className="px-2 py-0.5 bg-white border border-gray-300 hover:border-[#123A78] rounded font-medium text-gray-700"
                  >
                    Khasra 142/A (Wagholi, Pune)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('108/B');
                      setSearchedParcel(INITIAL_PARCELS[1] || INITIAL_PARCELS[0]);
                    }}
                    className="px-2 py-0.5 bg-white border border-gray-300 hover:border-[#123A78] rounded font-medium text-gray-700"
                  >
                    Khasra 108/B (Pune)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('219');
                      setSearchedParcel(INITIAL_PARCELS[2] || INITIAL_PARCELS[0]);
                    }}
                    className="px-2 py-0.5 bg-white border border-gray-300 hover:border-[#123A78] rounded font-medium text-gray-700"
                  >
                    Khasra 219 (Kalyani Nagar)
                  </button>
                </div>

                {/* Live Parcel Preview Result Card */}
                {searchedParcel && (
                  <div className="bg-white border border-emerald-300 rounded-lg p-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#123A78]">
                            Survey #{searchedParcel.surveyNumber} • {searchedParcel.village}, {searchedParcel.district}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                            {searchedParcel.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                          UID: {searchedParcel.parcelUid}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] text-gray-500">AI Trust Score</div>
                          <div className="text-sm font-black text-emerald-700">{searchedParcel.confidenceScore}% (Clean)</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Title Holder</span>
                        <span className="font-semibold text-gray-900">{searchedParcel.ownerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Land Area</span>
                        <span className="font-semibold text-gray-900">{searchedParcel.landAreaHa} Ha ({searchedParcel.landAreaSqft} sq.ft)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Land Type</span>
                        <span className="font-semibold text-gray-900">{searchedParcel.landType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Encumbrance</span>
                        <span className="font-semibold text-emerald-700">{searchedParcel.dna?.encumbranceStatus || 'UNENCUMBERED'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="text-[11px] text-gray-500">
                        Official Record synchronized with Revenue Ledger (BhoomiSetu Land Registry)
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectParcelForView) onSelectParcelForView(searchedParcel.id);
                            handleAccessPortal('parcel-dna');
                          }}
                          className="px-3 py-1.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View 360° Land DNA</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickRoleLogin('CITIZEN', 'citizen-portal')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download Verified 7/12 RoR</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VERIFY DIGITAL CERTIFICATE */}
            {activeToolTab === 'verify-cert' && (
              <div className="p-6">
                <form onSubmit={handleVerifyCert} className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <QrCode className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="cert-verify-input"
                      type="text"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      placeholder="Enter Certificate Serial Number (e.g. CERT-2026-MH-4421)..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8DEE8] rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <button
                    type="submit"
                    id="cert-verify-submit-btn"
                    className="px-6 py-2.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Verify Authenticity
                  </button>
                </form>

                {certResult && (
                  <div className="bg-white border-2 border-emerald-400 rounded-lg p-5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="text-xs font-bold text-emerald-900 block">
                            Cryptographically Valid Government Certificate
                          </span>
                          <span className="text-[11px] font-mono text-gray-500">ID: {certResult.certId}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        ACTIVE &amp; AUTHENTIC
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Target Parcel</span>
                        <span className="font-semibold text-gray-900">{certResult.khasraNo}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Title Holder</span>
                        <span className="font-semibold text-gray-900">{certResult.titleHolder}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Issuing Authority</span>
                        <span className="font-semibold text-gray-900">{certResult.issuingAuthority}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Issue Date</span>
                        <span className="font-semibold text-gray-900">{certResult.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Total Certified Area</span>
                        <span className="font-semibold text-gray-900">{certResult.areaHa}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block">Digital Signature</span>
                        <span className="font-semibold text-emerald-700 font-mono text-[10px]">NIC-PKI Certified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TRACK MUTATION APPLICATION */}
            {activeToolTab === 'track-app' && (
              <div className="p-6">
                <form onSubmit={handleTrackApp} className="flex flex-col sm:flex-row gap-2 mb-4">
                  <div className="relative flex-1">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="mutation-track-input"
                      type="text"
                      value={appInput}
                      onChange={(e) => setAppInput(e.target.value)}
                      placeholder="Enter Mutation Application Number (e.g. MUT-2026-0918)..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8DEE8] rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                    />
                  </div>
                  <button
                    type="submit"
                    id="mutation-track-submit-btn"
                    className="px-6 py-2.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Track Status
                  </button>
                </form>

                {appResult && (
                  <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                      <div>
                        <span className="text-xs font-bold text-[#123A78] block">{appResult.type}</span>
                        <span className="text-[11px] text-gray-500">
                          App #{appResult.appNumber} • Applicant: {appResult.applicant}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full self-start">
                        Stage 3: Hearing &amp; Verification
                      </span>
                    </div>

                    <div className="space-y-3">
                      {appResult.stages.map((stage: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                              stage.status === 'COMPLETED'
                                ? 'bg-emerald-600 text-white'
                                : stage.status === 'IN_PROGRESS'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{stage.label}</div>
                            <div className="text-[10px] text-gray-500">{stage.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 5. TRUST & ARCHITECTURE COMPLIANCE STRIP */}
      <section className="py-8 bg-[#F5F7FA] border-b border-[#D8DEE8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            
            <div className="bg-white p-4 rounded-lg border border-[#D8DEE8]">
              <div className="flex items-center gap-2 text-[#123A78] font-bold text-xs mb-1">
                <Database className="w-4 h-4" />
                <span>6.4 Lakh+ Villages Synced</span>
              </div>
              <p className="text-[11px] text-gray-600">
                100% digital cadastral mapping aligned with DILRMP central registry guidelines.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#D8DEE8]">
              <div className="flex items-center gap-2 text-[#123A78] font-bold text-xs mb-1">
                <KeyRound className="w-4 h-4" />
                <span>2FA &amp; Hardware Tokens</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Mandatory Two-Factor OTP authentication for all Level-3+ administrative revenue officers.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#D8DEE8]">
              <div className="flex items-center gap-2 text-[#123A78] font-bold text-xs mb-1">
                <Compass className="w-4 h-4" />
                <span>ISRO Bhuvan Spatial Truth</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Continuous satellite telemetry cross-verifies parcel boundaries against physical ground coordinates.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#D8DEE8]">
              <div className="flex items-center gap-2 text-[#123A78] font-bold text-xs mb-1">
                <Lock className="w-4 h-4" />
                <span>Section 43/66 IT Act Compliant</span>
              </div>
              <p className="text-[11px] text-gray-600">
                Tamper-proof SHA-256 cryptographic audit trail recording all officer mutations and inspections.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. UNIFIED AUTHENTICATION & QUICK ROLE LOGIN MODAL */}
      {isLoginModalOpen && (
        <div
          id="unified-login-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="unified-login-modal-panel"
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-[#D8DEE8] overflow-hidden my-8"
          >
            {/* Modal Header */}
            <div className="bg-[#123A78] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-bold">Government Single Sign-On Gateway</h3>
                  <p className="text-[11px] text-blue-100">National Land Records Intelligence Portal</p>
                </div>
              </div>
              <button
                type="button"
                id="close-login-modal-btn"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-blue-200 hover:text-white text-xl font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
              <button
                type="button"
                id="modal-tab-quick-roles"
                onClick={() => setLoginModalTab('quick-roles')}
                className={`flex-1 py-3 px-3 text-center border-b-2 transition-colors ${
                  loginModalTab === 'quick-roles'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
              >
                ⚡ 1-Click Demo Personas
              </button>
              <button
                type="button"
                id="modal-tab-officer"
                onClick={() => setLoginModalTab('officer')}
                className={`flex-1 py-3 px-3 text-center border-b-2 transition-colors ${
                  loginModalTab === 'officer'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
              >
                🏛️ Officer / Collector (2FA)
              </button>
              <button
                type="button"
                id="modal-tab-citizen"
                onClick={() => setLoginModalTab('citizen')}
                className={`flex-1 py-3 px-3 text-center border-b-2 transition-colors ${
                  loginModalTab === 'citizen'
                    ? 'bg-white text-[#123A78] border-[#123A78]'
                    : 'text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
              >
                🌾 Citizen / Farmer (OTP)
              </button>
            </div>

            {/* Modal Error Banner */}
            {authError && (
              <div className="m-4 p-3 bg-red-50 border-l-4 border-red-600 text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB CONTENT 1: QUICK DEMO PERSONAS */}
            {loginModalTab === 'quick-roles' && (
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <strong>Instant Evaluation Mode:</strong> Click any official below to immediately authenticate and open their specialized portal workspace with preloaded authentic data.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Persona 1: Citizen */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('CITIZEN', 'citizen-portal')}
                    className="p-3.5 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                        Farmer / Landowner
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Rameshwar Kisan Patil</div>
                    <div className="text-[11px] text-gray-600">Landowner (Khasra 142/A, Wagholi)</div>
                    <div className="text-[10px] text-emerald-800 font-semibold mt-2">
                      → Opens Citizen Land &amp; RoR Portal
                    </div>
                  </button>

                  {/* Persona 2: Tehsildar */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('GOVERNMENT_OFFICER', 'dashboard')}
                    className="p-3.5 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#123A78] bg-blue-200/80 px-2 py-0.5 rounded">
                        Revenue Officer
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#123A78] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Shri Suresh Patil</div>
                    <div className="text-[11px] text-gray-600">Sub-Divisional Magistrate / Tehsildar (Haveli)</div>
                    <div className="text-[10px] text-[#123A78] font-semibold mt-2">
                      → Opens AI Verification &amp; Mutation Desk
                    </div>
                  </button>

                  {/* Persona 3: Cadastral Surveyor */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('SURVEY_OFFICER', 'geo-ai')}
                    className="p-3.5 bg-sky-50/60 hover:bg-sky-100/80 border border-sky-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded">
                        Cadastral Surveyor
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-700 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Er. Arun Kumar Singh</div>
                    <div className="text-[11px] text-gray-600">Survey of India (Cadastral &amp; Drone Cell)</div>
                    <div className="text-[10px] text-sky-800 font-semibold mt-2">
                      → Opens ISRO GeoAI Spatial Studio
                    </div>
                  </button>

                  {/* Persona 4: District Collector */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('DISTRICT_COLLECTOR', 'national-command')}
                    className="p-3.5 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                        District Collector (IAS)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-800 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Shri Vikram Meena, IAS</div>
                    <div className="text-[11px] text-gray-600">District Magistrate &amp; Collector (Pune)</div>
                    <div className="text-[10px] text-amber-900 font-semibold mt-2">
                      → Opens District Governance &amp; Disaster Console
                    </div>
                  </button>

                  {/* Persona 5: Title Auditor */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('VERIFICATION_OFFICER', 'dashboard')}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                        Title Auditor
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Dr. Priya Nair</div>
                    <div className="text-[11px] text-gray-600">State Land Records Title Audit Wing</div>
                    <div className="text-[10px] text-slate-800 font-semibold mt-2">
                      → Opens Fraud Forensics &amp; Audit Logs
                    </div>
                  </button>

                  {/* Persona 6: Super Admin (GoI / NIC) */}
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('SUPER_ADMIN', 'national-command')}
                    className="p-3.5 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-300 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-200 px-2 py-0.5 rounded">
                        National Super Admin (GoI)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-800 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-bold text-gray-900 text-sm">Dr. Rajesh Verma, IAS</div>
                    <div className="text-[11px] text-gray-600">Mission Director (Ministry of Rural Dev)</div>
                    <div className="text-[10px] text-purple-900 font-semibold mt-2">
                      → Opens Pan-India 36 States/UTs Map &amp; Infra
                    </div>
                  </button>

                </div>
              </div>
            )}

            {/* TAB CONTENT 2: OFFICER / COLLECTOR FORM */}
            {loginModalTab === 'officer' && (
              <form onSubmit={handleOfficerFormSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Government Email or Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={officerIdentifier}
                    onChange={(e) => setOfficerIdentifier(e.target.value)}
                    placeholder="e.g. suresh.patil@rev.gov.in"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-[#123A78]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="Enter official password"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-[#123A78]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">District</label>
                    <select
                      value={officerDistrict}
                      onChange={(e) => setOfficerDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="Pune">Pune District</option>
                      <option value="Mumbai">Mumbai Headquarters</option>
                      <option value="Nagpur">Nagpur Collectorate</option>
                      <option value="New Delhi">National NIC / Delhi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Department</label>
                    <select
                      value={officerDepartment}
                      onChange={(e) => setOfficerDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="Taluka Revenue Office">Taluka Revenue Office</option>
                      <option value="District Collectorate">District Collectorate</option>
                      <option value="Survey of India">Survey of India (Cadastral)</option>
                      <option value="Ministry of Rural Development / NIC">Ministry of Rural Dev / NIC</option>
                    </select>
                  </div>
                </div>

                {/* CAPTCHA */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black tracking-widest bg-gray-200 px-3 py-1 rounded text-gray-900 select-none">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Refresh CAPTCHA"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="w-28 px-2 py-1.5 bg-white border border-gray-300 rounded text-center uppercase font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-bold rounded-lg transition-colors shadow-2xs"
                >
                  {authLoading ? 'Authenticating with NIC Gateway...' : 'Authenticate & Proceed to 2FA'}
                </button>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onOpenRegisterModal();
                    }}
                    className="text-[#123A78] hover:underline"
                  >
                    Apply for New Officer Clearance
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      onOpenForgotPasswordModal();
                    }}
                    className="text-gray-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT 3: CITIZEN / FARMER FORM */}
            {loginModalTab === 'citizen' && (
              <form onSubmit={handleCitizenFormSubmit} className="p-5 space-y-4 text-xs">
                <div className="flex border-b border-gray-200 pb-2 gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizenMode"
                      checked={citizenMode === 'mobile'}
                      onChange={() => setCitizenMode('mobile')}
                    />
                    <span className="font-semibold">Sign in via Mobile OTP</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizenMode"
                      checked={citizenMode === 'email'}
                      onChange={() => setCitizenMode('email')}
                    />
                    <span className="font-semibold">Sign in via Email &amp; Password</span>
                  </label>
                </div>

                {citizenMode === 'mobile' ? (
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      10-Digit Registered Mobile Number *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={citizenMobile}
                        onChange={(e) => setCitizenMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md text-gray-900 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="ramesh.kisan@gmail.com"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="Citizen@2026"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </>
                )}

                {/* CAPTCHA */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black tracking-widest bg-gray-200 px-3 py-1 rounded text-gray-900 select-none">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      title="Refresh CAPTCHA"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter code"
                    className="w-28 px-2 py-1.5 bg-white border border-gray-300 rounded text-center uppercase font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
                >
                  {authLoading
                    ? 'Processing...'
                    : citizenMode === 'mobile'
                    ? 'Dispatch One-Time Password (OTP)'
                    : 'Sign In to Citizen Portal'}
                </button>
              </form>
            )}

            {/* Modal Footer */}
            <div className="bg-gray-50 p-3.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted • MeitY Security Empanelled</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded text-gray-700"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
