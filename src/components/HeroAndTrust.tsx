import React from 'react';
import {
  Shield,
  KeyRound,
  FileCheck2,
  Building2,
  CheckCircle,
  MapPin,
  Lock,
  ArrowRight,
  Database,
  Search,
  Compass,
} from 'lucide-react';
import { Language, translations } from '../translations';
import { DigitalIndiaBadge } from './Emblems';
import { LayoutDashboard } from 'lucide-react';

interface HeroAndTrustProps {
  language: Language;
  onSelectOfficerLogin: () => void;
  onSelectCitizenLogin: () => void;
  onSelectLearnMore: () => void;
  onSelectGeoAi?: () => void;
  onSelectNationalCommand?: () => void;
}

export const HeroAndTrust: React.FC<HeroAndTrustProps> = ({
  language,
  onSelectOfficerLogin,
  onSelectCitizenLogin,
  onSelectLearnMore,
  onSelectGeoAi,
  onSelectNationalCommand,
}) => {
  const t = translations[language];

  return (
    <div className="w-full">
      {/* Official Security Notice Banner */}
      <div className="bg-[#123A78] text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-medium tracking-wide">
              {t.itActNotice}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-blue-100">
            <span>Official Portal of GoI</span>
            <span>•</span>
            <span>MeitY Empanelled</span>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="bg-gradient-to-b from-[#F5F7FA] to-white border-b border-[#D8DEE8] py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Government Information & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#D8DEE8] rounded-md text-xs font-semibold text-[#123A78] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1F7A3E]"></span>
              <span>Government of India • Ministry of Rural Development</span>
              <span className="text-[#D8DEE8]">|</span>
              <span className="text-[#5A6878]">DILRMP Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C2733] leading-tight">
              National Land Records Intelligence &amp; Identity Gateway
            </h1>

            <p className="text-base sm:text-lg text-[#5A6878] leading-relaxed max-w-2xl">
              Production-grade identity and access governance for <strong>Bhulekh AI v3</strong>.
              Unified role-based authentication connecting Citizens, Patwaris, Verification Officers,
              and District Collectors for tamper-proof title intelligence and cadastral governance.
            </p>

            {/* Official Security Disclaimer Callout */}
            <div className="p-3.5 bg-amber-50/80 border-l-4 border-[#C67A00] rounded-r-md text-xs sm:text-sm text-[#1C2733] flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#C67A00] shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Official Security Notice:</strong> {t.disclaimer}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onSelectNationalCommand && (
                <button
                  id="hero-national-command-cta"
                  onClick={onSelectNationalCommand}
                  className="px-6 py-3 bg-[#123A78] hover:bg-[#0E2C5B] text-white font-black text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors border-2 border-amber-400 focus:ring-2 focus:ring-[#123A78]"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>National Command Center (GoI / NIC)</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-400 text-gray-950 rounded">
                    Module 5
                  </span>
                </button>
              )}

              <button
                id="hero-officer-login-cta"
                onClick={onSelectOfficerLogin}
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold text-sm rounded-lg shadow-2xs flex items-center gap-2 transition-colors focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Officer &amp; Collector Login</span>
              </button>

              {onSelectGeoAi && (
                <button
                  id="hero-geo-ai-cta"
                  onClick={onSelectGeoAi}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm rounded-lg shadow-2xs flex items-center gap-2 transition-colors border border-amber-600 focus:ring-2 focus:ring-amber-500"
                >
                  <Compass className="w-4 h-4 text-[#123A78]" />
                  <span>Launch ISRO GeoAI Intelligence Layer</span>
                </button>
              )}

              <button
                id="hero-citizen-login-cta"
                onClick={onSelectCitizenLogin}
                className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-[#123A78] text-[#123A78] font-semibold text-sm rounded-lg shadow-2xs flex items-center gap-2 transition-colors focus:ring-2 focus:ring-[#123A78]"
              >
                <Search className="w-4 h-4" />
                <span>Citizen &amp; Landowner Services</span>
              </button>

              <button
                id="hero-learn-more-cta"
                onClick={onSelectLearnMore}
                className="px-5 py-3 text-sm font-medium text-[#5A6878] hover:text-[#123A78] hover:underline flex items-center gap-1.5"
              >
                <span>Learn About Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-[#5A6878]">
              <DigitalIndiaBadge />
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#1F7A3E]" />
                <span>7 Tier RBAC Clearance</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#1F7A3E]" />
                <span>2FA Mandate for Officers</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cadastral Survey & Digital Land Records Graphic (Strict Government Style) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs relative overflow-hidden">
              {/* Header of the Government Record Card */}
              <div className="flex items-center justify-between border-b border-[#D8DEE8] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1F7A3E]"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#123A78]">
                    RoR / Cadastral Intelligence Map
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#5A6878] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#D8DEE8]">
                  KHASRA #142-A/2026
                </span>
              </div>

              {/* Cadastral Map Visual representation (Strict SVG government vector) */}
              <div className="relative w-full h-56 bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg overflow-hidden flex items-center justify-center p-2">
                {/* SVG Cadastral Boundary Grid */}
                <svg className="w-full h-full" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8DEE8" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="240" fill="url(#grid)" />

                  {/* Parcel 1 */}
                  <polygon
                    points="40,30 150,20 180,90 70,110"
                    fill="#123A78"
                    fillOpacity="0.08"
                    stroke="#123A78"
                    strokeWidth="2"
                  />
                  <text x="95" y="70" fill="#123A78" fontSize="10" fontWeight="bold">Plot 141-B</text>

                  {/* Parcel 2 (Verified Target Parcel) */}
                  <polygon
                    points="150,20 290,35 320,130 180,90"
                    fill="#1F7A3E"
                    fillOpacity="0.12"
                    stroke="#1F7A3E"
                    strokeWidth="2.5"
                  />
                  <text x="215" y="75" fill="#1F7A3E" fontSize="11" fontWeight="bold">Khasra 142-A</text>
                  <text x="210" y="90" fill="#5A6878" fontSize="9">1.42 Hectares</text>

                  {/* Parcel 3 */}
                  <polygon
                    points="70,110 180,90 220,200 60,190"
                    fill="#123A78"
                    fillOpacity="0.05"
                    stroke="#5A6878"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text x="120" y="150" fill="#5A6878" fontSize="10">Plot 143-C</text>

                  {/* Parcel 4 */}
                  <polygon
                    points="180,90 320,130 350,220 220,200"
                    fill="#123A78"
                    fillOpacity="0.05"
                    stroke="#5A6878"
                    strokeWidth="1.5"
                  />
                  <text x="260" y="170" fill="#5A6878" fontSize="10">Plot 144</text>

                  {/* Official Inspection Pin */}
                  <circle cx="235" cy="55" r="5" fill="#B42318" />
                  <circle cx="235" cy="55" r="10" stroke="#B42318" strokeWidth="1" opacity="0.6" />
                </svg>

                {/* Official Verification Watermark Stamp */}
                <div className="absolute bottom-3 right-3 bg-white/95 border border-[#1F7A3E] rounded px-3 py-1.5 shadow-2xs text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1F7A3E]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>NIC CERTIFIED GEO-RECORD</span>
                  </div>
                  <div className="text-[9px] text-[#5A6878] font-mono">
                    Lat: 18.5204° N, Long: 73.8567° E
                  </div>
                </div>
              </div>

              {/* Metadata strip below graphic */}
              <div className="mt-4 pt-3 border-t border-[#D8DEE8] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#F5F7FA] p-2 rounded border border-[#D8DEE8]">
                  <div className="text-[10px] text-[#5A6878] uppercase">State Cadre</div>
                  <div className="font-bold text-[#1C2733]">Maharashtra</div>
                </div>
                <div className="bg-[#F5F7FA] p-2 rounded border border-[#D8DEE8]">
                  <div className="text-[10px] text-[#5A6878] uppercase">Collectorate</div>
                  <div className="font-bold text-[#1C2733]">Pune Central</div>
                </div>
                <div className="bg-[#F5F7FA] p-2 rounded border border-[#D8DEE8]">
                  <div className="text-[10px] text-[#5A6878] uppercase">Title Status</div>
                  <div className="font-bold text-[#1F7A3E]">Verified Clean</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - 4 Government Trust Cards */}
      <section className="bg-white py-12 border-b border-[#D8DEE8]" aria-labelledby="trust-section-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 id="trust-section-title" className="text-2xl sm:text-3xl font-bold text-[#1C2733]">
              Government-Grade Trust &amp; Cryptographic Security
            </h2>
            <p className="text-sm text-[#5A6878] mt-2">
              Engineered strictly compliant with National Informatics Centre (NIC) and MeitY cybersecurity benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-5 text-left transition-all hover:border-[#123A78]">
              <div className="w-10 h-10 rounded-md bg-white border border-[#D8DEE8] flex items-center justify-center text-[#123A78] mb-3.5 shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2733] mb-1.5">
                Secure Digital Infrastructure
              </h3>
              <p className="text-xs text-[#5A6878] leading-relaxed">
                MeitY empanelled cloud architecture with automated TLS 1.3 encryption, DDoS mitigation, and continuous NIC vulnerability auditing.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-5 text-left transition-all hover:border-[#123A78]">
              <div className="w-10 h-10 rounded-md bg-white border border-[#D8DEE8] flex items-center justify-center text-[#123A78] mb-3.5 shadow-2xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2733] mb-1.5">
                NIC-grade Authentication
              </h3>
              <p className="text-xs text-[#5A6878] leading-relaxed">
                Hardware token &amp; Two-Factor OTP enforcement for all Level-3+ administrative officers, eliminating credential spoofing and unauthorized access.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-5 text-left transition-all hover:border-[#123A78]">
              <div className="w-10 h-10 rounded-md bg-white border border-[#D8DEE8] flex items-center justify-center text-[#123A78] mb-3.5 shadow-2xs">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2733] mb-1.5">
                AI Assisted Verification
              </h3>
              <p className="text-xs text-[#5A6878] leading-relaxed">
                Bilingual Devanagari OCR cross-referencing legacy registry ledgers with modern cadastral coordinates to surface title disputes automatically.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#F5F7FA] border border-[#D8DEE8] rounded-lg p-5 text-left transition-all hover:border-[#123A78]">
              <div className="w-10 h-10 rounded-md bg-white border border-[#D8DEE8] flex items-center justify-center text-[#123A78] mb-3.5 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C2733] mb-1.5">
                District Level Monitoring
              </h3>
              <p className="text-xs text-[#5A6878] leading-relaxed">
                Collectorate-governed employee clearance workflow, real-time jurisdictional telemetry, and immutable audit logs per Section 43/66 IT Act.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
