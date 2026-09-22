import React, { useState, useEffect } from 'react';
import {
  Lock,
  UserCheck,
  Shield,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Phone,
  Mail,
  Building,
  MapPin,
  CheckCircle2,
  FileBadge,
} from 'lucide-react';
import { Language, translations } from '../translations';
import { RoleType, User } from '../types';

interface LoginViewProps {
  language: Language;
  securityNotice?: string | null;
  onLoginSuccess: (user: User, token: string) => void;
  onRequire2FA: (tempToken: string, phoneMasked: string, emailMasked: string, hint?: string) => void;
  onRequireCitizenOtp: (identifier: string, hint?: string) => void;
  onOpenRegisterModal: () => void;
  onOpenForgotPasswordModal: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  language,
  securityNotice,
  onLoginSuccess,
  onRequire2FA,
  onRequireCitizenOtp,
  onOpenRegisterModal,
  onOpenForgotPasswordModal,
}) => {
  const t = translations[language];

  // Tabs: 'officer' or 'citizen'
  const [activeTab, setActiveTab] = useState<'officer' | 'citizen'>('officer');

  // Officer Login State
  const [officerIdentifier, setOfficerIdentifier] = useState('vikram.meena@ias.gov.in');
  const [officerPassword, setOfficerPassword] = useState('Nic@Bhulekh2026');
  const [district, setDistrict] = useState('Pune');
  const [department, setDepartment] = useState('District Collectorate');
  const [rememberMe, setRememberMe] = useState(true);

  // Citizen Login State
  const [citizenMode, setCitizenMode] = useState<'mobile' | 'email'>('mobile');
  const [citizenMobile, setCitizenMobile] = useState('9876543210');
  const [citizenEmail, setCitizenEmail] = useState('ramesh.kisan@gmail.com');
  const [citizenPassword, setCitizenPassword] = useState('Citizen@2026');

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generate 5-character alphanumeric CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [activeTab]);

  // Handle Quick Demo Account Selection (for all 7 roles)
  const selectDemoRole = (role: RoleType) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (role === 'SUPER_ADMIN') {
      setActiveTab('officer');
      setOfficerIdentifier('rajesh.verma@nic.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('New Delhi');
      setDepartment('Ministry of Rural Development / NIC');
    } else if (role === 'STATE_ADMIN') {
      setActiveTab('officer');
      setOfficerIdentifier('ananya.deshmukh@maharashtra.gov.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('Mumbai Headquarters');
      setDepartment('Revenue and Forest Department');
    } else if (role === 'DISTRICT_COLLECTOR') {
      setActiveTab('officer');
      setOfficerIdentifier('vikram.meena@ias.gov.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('Pune');
      setDepartment('District Collectorate');
    } else if (role === 'GOVERNMENT_OFFICER') {
      setActiveTab('officer');
      setOfficerIdentifier('suresh.patil@rev.gov.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('Pune');
      setDepartment('Taluka Revenue Office');
    } else if (role === 'VERIFICATION_OFFICER') {
      setActiveTab('officer');
      setOfficerIdentifier('priya.nair@audit.gov.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('Pune');
      setDepartment('Land Records Title Audit Wing');
    } else if (role === 'SURVEY_OFFICER') {
      setActiveTab('officer');
      setOfficerIdentifier('arun.singh@survey.gov.in');
      setOfficerPassword('Nic@Bhulekh2026');
      setDistrict('Pune');
      setDepartment('Survey of India (Cadastral Wing)');
    } else if (role === 'CITIZEN') {
      setActiveTab('citizen');
      setCitizenMobile('9876543210');
      setCitizenEmail('ramesh.kisan@gmail.com');
      setCitizenPassword('Citizen@2026');
    }
    // Pre-fill CAPTCHA for demo convenience
    setCaptchaInput(captchaCode);
  };

  // Submit Officer Login
  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid CAPTCHA security code. Please check and re-enter.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: officerIdentifier,
          password: officerPassword,
          captchaInput,
          expectedCaptcha: captchaCode,
          district,
          department,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Authentication failed. Please verify credentials.');
        generateCaptcha();
        setIsLoading(false);
        return;
      }

      if (data.requires2FA) {
        onRequire2FA(data.tempAuthToken, data.phoneMasked, data.emailMasked, data.testOtpHint);
      } else {
        onRequire2FA(data.tempAuthToken || 'temp-token', '+91 ******7889', officerIdentifier, data.testOtpHint || '123456');
      }
    } catch (err: any) {
      setErrorMessage('Network error communicating with Government Authentication Gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Citizen Login
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid CAPTCHA security code. Please check and re-enter.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    if (citizenMode === 'mobile') {
      // Request Citizen OTP
      try {
        const response = await fetch('/api/auth/citizen-otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: citizenMobile,
            captchaInput,
            expectedCaptcha: captchaCode,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          setErrorMessage(data.message || 'Unable to dispatch OTP.');
          generateCaptcha();
          setIsLoading(false);
          return;
        }

        onRequireCitizenOtp(citizenMobile, data.testOtpHint);
      } catch (err) {
        setErrorMessage('Network error requesting citizen authentication OTP.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Email + Password Citizen Login
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: citizenEmail,
            password: citizenPassword,
            captchaInput,
            expectedCaptcha: captchaCode,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          setErrorMessage(data.message || 'Invalid email or password.');
          generateCaptcha();
          setIsLoading(false);
          return;
        }

        if (data.requires2FA) {
          onRequire2FA(data.tempAuthToken, data.phoneMasked, data.emailMasked, data.testOtpHint);
        } else {
          onRequireCitizenOtp(citizenEmail, data.testOtpHint || '123456');
        }
      } catch (err) {
        setErrorMessage('Network error during citizen authentication.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div id="authentication-portal-container" className="w-full bg-[#F5F7FA] py-8 sm:py-12 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Quick Role Tester Bar (Provides Instant One-Click Evaluation for All 7 Roles) */}
        <div className="mb-8 p-3.5 bg-white border border-[#D8DEE8] rounded-lg shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pb-2.5 border-b border-[#D8DEE8]">
            <div className="flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-[#123A78]" />
              <span className="text-xs font-bold text-[#1C2733] uppercase tracking-wider">
                Official Roster Testing Selector (7 Roles)
              </span>
              <span className="text-[10px] bg-blue-100 text-[#123A78] font-semibold px-2 py-0.5 rounded">
                Evaluator Mode
              </span>
            </div>
            <div className="text-[11px] text-[#5A6878]">
              Default Master Password: <code className="font-mono font-bold text-[#123A78] bg-gray-100 px-1 py-0.5 rounded">Nic@Bhulekh2026</code> / OTP: <code className="font-mono font-bold text-[#1F7A3E] bg-gray-100 px-1 py-0.5 rounded">123456</code>
            </div>
          </div>

          <div className="pt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { role: 'SUPER_ADMIN', label: '1. Super Admin (NIC/MoRD)' },
              { role: 'STATE_ADMIN', label: '2. State Admin (Sec. Revenue)' },
              { role: 'DISTRICT_COLLECTOR', label: '3. District Collector (Pune)' },
              { role: 'GOVERNMENT_OFFICER', label: '4. Govt Officer (Tehsildar)' },
              { role: 'VERIFICATION_OFFICER', label: '5. Verification Officer' },
              { role: 'SURVEY_OFFICER', label: '6. Survey Officer' },
              { role: 'CITIZEN', label: '7. Citizen Landowner' },
            ].map((item) => (
              <button
                key={item.role}
                id={`demo-role-${item.role.toLowerCase()}`}
                type="button"
                onClick={() => selectDemoRole(item.role as RoleType)}
                className="px-2.5 py-1 text-xs font-medium bg-[#F5F7FA] hover:bg-[#123A78] hover:text-white text-[#1C2733] border border-[#D8DEE8] rounded transition-colors focus:ring-2 focus:ring-[#123A78]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split Layout: Left Panel (Government Branding & Security) vs Right Panel (Login Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-[#123A78] text-xs font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#1F7A3E]" />
                <span>NIC Government Identity Service (GIS)</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1C2733] leading-snug">
                Authorized Personnel &amp; Citizen Access Portal
              </h2>

              <p className="text-xs sm:text-sm text-[#5A6878] leading-relaxed">
                BhoomiSetu is the unified national gateway for land records verification, cadastral analysis, and real-time title chain validation under the Ministry of Rural Development.
              </p>

              {/* Security Mandate List */}
              <div className="pt-2 border-t border-[#D8DEE8] space-y-2.5 text-xs text-[#1C2733]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A3E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Multi-Factor Mandate:</strong> All Level-3+ officers must complete 2FA via NIC OTP gateway.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A3E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Jurisdictional Scoping:</strong> Access is confined strictly to gazetted district and taluka rosters.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A3E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Logging:</strong> Every session timestamp, IP address, and parcel lookup is logged under IT Act 2000.
                  </span>
                </div>
              </div>

              {/* Official IT Act Notice Box */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-[#B42318] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Statutory Security Warning</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This system is restricted to authorized Government of India workflows. Unlawful attempts to bypass credentials or tamper with cadastral data will be prosecuted under Sections 43 &amp; 66 of the IT Act, 2000.
                </p>
              </div>

              <div className="text-[11px] text-[#7A8794]">
                Session automatically terminates after 15 minutes of inactivity in compliance with NIC Security Policy v4.2.
              </div>
            </div>
          </div>

          {/* Right Panel: Official Login Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#D8DEE8] rounded-xl shadow-xs overflow-hidden">
              {/* Tab Selector: Officer Login vs Citizen Login */}
              <div className="grid grid-cols-2 border-b border-[#D8DEE8] bg-[#F5F7FA]">
                <button
                  id="tab-officer-login"
                  type="button"
                  onClick={() => {
                    setActiveTab('officer');
                    setErrorMessage(null);
                  }}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'officer'
                      ? 'border-[#123A78] text-[#123A78] bg-white'
                      : 'border-transparent text-[#5A6878] hover:text-[#1C2733]'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Government Officer Login</span>
                </button>

                <button
                  id="tab-citizen-login"
                  type="button"
                  onClick={() => {
                    setActiveTab('citizen');
                    setErrorMessage(null);
                  }}
                  className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'citizen'
                      ? 'border-[#123A78] text-[#123A78] bg-white'
                      : 'border-transparent text-[#5A6878] hover:text-[#1C2733]'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Citizen Services Login</span>
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* Security Gate Notice */}
                {securityNotice && (
                  <div className="mb-5 p-3.5 bg-amber-50 border-l-4 border-amber-600 rounded-r-md text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Authentication &amp; OTP Verification Required</span>
                      <span>{securityNotice}</span>
                    </div>
                  </div>
                )}

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="mb-5 p-3 bg-red-50 border-l-4 border-[#B42318] rounded-r-md text-xs sm:text-sm text-[#B42318] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-5 p-3 bg-green-50 border-l-4 border-[#1F7A3E] rounded-r-md text-xs sm:text-sm text-[#1F7A3E] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* 1. OFFICER LOGIN FORM */}
                {activeTab === 'officer' && (
                  <form onSubmit={handleOfficerSubmit} className="space-y-4 text-left">
                    <div className="border-b border-[#D8DEE8] pb-2 mb-4">
                      <h3 className="text-base font-bold text-[#1C2733]">
                        {t.officerLoginTitle}
                      </h3>
                      <p className="text-xs text-[#5A6878]">
                        Department of Land Resources &bull; Cadre Authentication
                      </p>
                    </div>

                    {/* Email / Employee ID */}
                    <div>
                      <label
                        htmlFor="officer-identifier-input"
                        className="block text-xs font-bold text-[#1C2733] mb-1"
                      >
                        Official Email / Employee ID <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="officer-identifier-input"
                          type="text"
                          required
                          value={officerIdentifier}
                          onChange={(e) => setOfficerIdentifier(e.target.value)}
                          placeholder={t.govtEmailPlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] placeholder-[#7A8794] focus:outline-none focus:ring-2 focus:ring-[#123A78] focus:border-[#123A78]"
                        />
                        <Mail className="w-4 h-4 text-[#5A6878] absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="officer-password-input"
                          className="block text-xs font-bold text-[#1C2733]"
                        >
                          Official Password <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          id="officer-forgot-password-link"
                          onClick={onOpenForgotPasswordModal}
                          className="text-xs text-[#123A78] hover:underline font-medium"
                        >
                          {t.forgotPassword}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          id="officer-password-input"
                          type="password"
                          required
                          value={officerPassword}
                          onChange={(e) => setOfficerPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] placeholder-[#7A8794] focus:outline-none focus:ring-2 focus:ring-[#123A78] focus:border-[#123A78]"
                        />
                        <Lock className="w-4 h-4 text-[#5A6878] absolute left-3 top-3" />
                      </div>
                    </div>

                    {/* District & Department Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label
                          htmlFor="officer-district-select"
                          className="block text-xs font-bold text-[#1C2733] mb-1"
                        >
                          Jurisdiction District
                        </label>
                        <div className="relative">
                          <select
                            id="officer-district-select"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                          >
                            <option value="Pune">Pune District</option>
                            <option value="Nagpur">Nagpur District</option>
                            <option value="Nashik">Nashik District</option>
                            <option value="Mumbai Headquarters">Mumbai Headquarters</option>
                            <option value="New Delhi">New Delhi (Central MoRD)</option>
                          </select>
                          <MapPin className="w-3.5 h-3.5 text-[#5A6878] absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="officer-dept-select"
                          className="block text-xs font-bold text-[#1C2733] mb-1"
                        >
                          Department Wing
                        </label>
                        <div className="relative">
                          <select
                            id="officer-dept-select"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                          >
                            <option value="District Collectorate">District Collectorate</option>
                            <option value="Taluka Revenue Office">Taluka Revenue Office (Haveli/Baramati)</option>
                            <option value="Land Records Title Audit Wing">Title Audit &amp; Verification Wing</option>
                            <option value="Survey of India (Cadastral Wing)">Survey of India / Drone Cadastre</option>
                            <option value="Ministry of Rural Development / NIC">Central MoRD / NIC</option>
                          </select>
                          <Building className="w-3.5 h-3.5 text-[#5A6878] absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>

                    {/* CAPTCHA Security Verification */}
                    <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-md p-3 space-y-2">
                      <label
                        htmlFor="officer-captcha-input"
                        className="block text-xs font-bold text-[#1C2733]"
                      >
                        Security Verification (CAPTCHA) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div
                          className="px-4 py-2 bg-white border border-[#D8DEE8] font-mono text-base font-extrabold tracking-widest text-[#123A78] select-none rounded line-through decoration-[#B42318]/40"
                          style={{ letterSpacing: '0.3em' }}
                          aria-label={`CAPTCHA code: ${captchaCode}`}
                        >
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          id="refresh-captcha-officer-btn"
                          onClick={generateCaptcha}
                          className="p-2 border border-[#D8DEE8] rounded bg-white hover:bg-gray-100 text-[#123A78] focus:ring-2 focus:ring-[#123A78]"
                          title="Refresh CAPTCHA code"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <input
                          id="officer-captcha-input"
                          type="text"
                          required
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 py-2 px-3 text-sm uppercase bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[#1C2733]">
                        <input
                          type="checkbox"
                          id="officer-remember-me-check"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-[#D8DEE8] text-[#123A78] focus:ring-[#123A78]"
                        />
                        <span>Remember authorized workstation</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      id="officer-login-submit-btn"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#123A78] focus:ring-offset-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying NIC Credentials...</span>
                        </div>
                      ) : (
                        <span>{t.signInButton}</span>
                      )}
                    </button>

                    {/* New Government Employee Registration CTA */}
                    <div className="pt-3 border-t border-[#D8DEE8] text-center">
                      <button
                        type="button"
                        id="officer-apply-access-btn"
                        onClick={onOpenRegisterModal}
                        className="text-xs font-semibold text-[#123A78] hover:underline"
                      >
                        {t.registerOfficerBtn}
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. CITIZEN LOGIN FORM */}
                {activeTab === 'citizen' && (
                  <form onSubmit={handleCitizenSubmit} className="space-y-4 text-left">
                    <div className="border-b border-[#D8DEE8] pb-2 mb-4">
                      <h3 className="text-base font-bold text-[#1C2733]">
                        {t.citizenLoginTitle}
                      </h3>
                      <p className="text-xs text-[#5A6878]">
                        Access Land Records (7/12 Extract, Khasra, Khatauni, RoR, Mutation Tracking)
                      </p>
                    </div>

                    {/* Sub-modes: Mobile OTP vs Email */}
                    <div className="flex items-center gap-4 text-xs font-medium text-[#5A6878] pb-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="citizenMode"
                          checked={citizenMode === 'mobile'}
                          onChange={() => setCitizenMode('mobile')}
                          className="text-[#123A78] focus:ring-[#123A78]"
                        />
                        <span className="font-semibold text-[#1C2733]">Mobile Number + OTP</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="citizenMode"
                          checked={citizenMode === 'email'}
                          onChange={() => setCitizenMode('email')}
                          className="text-[#123A78] focus:ring-[#123A78]"
                        />
                        <span>Email + Password</span>
                      </label>
                    </div>

                    {citizenMode === 'mobile' ? (
                      <div>
                        <label
                          htmlFor="citizen-mobile-input"
                          className="block text-xs font-bold text-[#1C2733] mb-1"
                        >
                          Registered Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-xs font-bold text-[#5A6878]">
                            +91
                          </div>
                          <input
                            id="citizen-mobile-input"
                            type="tel"
                            required
                            maxLength={10}
                            value={citizenMobile}
                            onChange={(e) => setCitizenMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="w-full pl-12 pr-3 py-2.5 text-sm bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] placeholder-[#7A8794] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                          />
                          <Phone className="w-4 h-4 text-[#5A6878] absolute right-3 top-3" />
                        </div>
                        <p className="text-[11px] text-[#5A6878] mt-1">
                          A 6-digit One Time Password (OTP) will be dispatched via Government SMS Gateway.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label
                            htmlFor="citizen-email-input"
                            className="block text-xs font-bold text-[#1C2733] mb-1"
                          >
                            Registered Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id="citizen-email-input"
                              type="email"
                              required
                              value={citizenEmail}
                              onChange={(e) => setCitizenEmail(e.target.value)}
                              placeholder="e.g. ramesh.kisan@gmail.com"
                              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                            />
                            <Mail className="w-4 h-4 text-[#5A6878] absolute left-3 top-3" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label
                              htmlFor="citizen-password-input"
                              className="block text-xs font-bold text-[#1C2733]"
                            >
                              Password <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={onOpenForgotPasswordModal}
                              className="text-xs text-[#123A78] hover:underline font-medium"
                            >
                              {t.forgotPassword}
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              id="citizen-password-input"
                              type="password"
                              required
                              value={citizenPassword}
                              onChange={(e) => setCitizenPassword(e.target.value)}
                              placeholder="Enter password"
                              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                            />
                            <Lock className="w-4 h-4 text-[#5A6878] absolute left-3 top-3" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* CAPTCHA Verification */}
                    <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-md p-3 space-y-2">
                      <label
                        htmlFor="citizen-captcha-input"
                        className="block text-xs font-bold text-[#1C2733]"
                      >
                        Security Verification (CAPTCHA) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <div
                          className="px-4 py-2 bg-white border border-[#D8DEE8] font-mono text-base font-extrabold tracking-widest text-[#123A78] select-none rounded line-through decoration-[#1F7A3E]/40"
                          style={{ letterSpacing: '0.3em' }}
                        >
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="p-2 border border-[#D8DEE8] rounded bg-white hover:bg-gray-100 text-[#123A78]"
                          title="Refresh CAPTCHA"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <input
                          id="citizen-captcha-input"
                          type="text"
                          required
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 py-2 px-3 text-sm uppercase bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                          maxLength={6}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="citizen-login-submit-btn"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#123A78] disabled:opacity-60"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Secure OTP...</span>
                        </div>
                      ) : (
                        <span>{citizenMode === 'mobile' ? t.sendOtp : t.signInButton}</span>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Card Footer: No Social Login Disclaimer */}
              <div className="bg-[#F5F7FA] border-t border-[#D8DEE8] py-2.5 px-6 text-center text-[11px] text-[#5A6878]">
                <span>Official Identity Gateway &bull; Social login strictly prohibited under NIC Digital India guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
