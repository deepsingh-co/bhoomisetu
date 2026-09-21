import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GovernmentHeader } from './components/GovernmentHeader';
import { GovernmentNav } from './components/GovernmentNav';
import { HeroAndTrust } from './components/HeroAndTrust';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AdminApprovalView } from './components/AdminApprovalView';
import { SecurityCenterView } from './components/SecurityCenterView';
import { AuditLogsView } from './components/AuditLogsView';
import { ProfileView } from './components/ProfileView';
import { GovernmentFooter } from './components/GovernmentFooter';

// Module 2 Components
import { UploadCenterView } from './components/UploadCenterView';
import { VerificationQueueView } from './components/VerificationQueueView';
import { GisSatelliteView } from './components/GisSatelliteView';
import { ParcelIntelligenceView } from './components/ParcelIntelligenceView';
import { FraudAndDisputeView } from './components/FraudAndDisputeView';
import { MultiAgentHubView } from './components/MultiAgentHubView';
import { MutationSimulatorView } from './components/MutationSimulatorView';
import { VoiceSearchView } from './components/VoiceSearchView';
import { LandTimelineView } from './components/LandTimelineView';
import { CitizenTrustScoreView } from './components/CitizenTrustScoreView';
import { GovernmentReportsView } from './components/GovernmentReportsView';
import { GeoAiMasterView } from './components/geoai/GeoAiMasterView';

// Module 4: Citizen Portal (UMANG / DigiLocker / Citizen Experience)
import { CitizenPortalMasterView } from './components/citizen/CitizenPortalMasterView';

// Module 5: National Command Center + Admin + State & District Governance
import { AdminMasterView } from './components/admin/AdminMasterView';

// Module 2 Modals
import { InspectionReportModal } from './components/InspectionReportModal';
import { DocumentComparisonModal } from './components/DocumentComparisonModal';

// Seed & Data
import { INITIAL_PARCELS } from './data/seedParcels';
import { LandParcelDetail } from './types/landRecords';

// Modals
import { Officer2FAModal } from './components/Officer2FAModal';
import { CitizenOtpModal } from './components/CitizenOtpModal';
import { EmployeeRegistrationModal } from './components/EmployeeRegistrationModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { InactivityTimeoutModal } from './components/InactivityTimeoutModal';

import { Language } from './translations';
import { User, NotificationItem } from './types';

export default function App() {
  // Accessibility & Localization State
  const [language, setLanguage] = useState<Language>('en');
  const [textSize, setTextSize] = useState<number>(0);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Navigation View State: 'home' | 'login' | 'dashboard' | 'approvals' | 'security' | 'audit' | 'profile'
  const [currentView, setCurrentView] = useState<string>('home');

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Modals Visibility
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFaTempToken, setTwoFaTempToken] = useState('');
  const [twoFaPhoneMasked, setTwoFaPhoneMasked] = useState('');
  const [twoFaEmailMasked, setTwoFaEmailMasked] = useState('');
  const [twoFaTestOtpHint, setTwoFaTestOtpHint] = useState('');

  const [isCitizenOtpModalOpen, setIsCitizenOtpModalOpen] = useState(false);
  const [citizenOtpIdentifier, setCitizenOtpIdentifier] = useState('');
  const [citizenOtpTestHint, setCitizenOtpTestHint] = useState('');

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Land Parcels & Intelligence State
  const [parcels, setParcels] = useState<LandParcelDetail[]>(INITIAL_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState<string>('p-001');
  const [inspectionModalParcel, setInspectionModalParcel] = useState<LandParcelDetail | null>(null);
  const [comparisonModalParcel, setComparisonModalParcel] = useState<LandParcelDetail | null>(null);

  // Inactivity State (15 min standard, alert at 14 min)
  const [isInactivityModalOpen, setIsInactivityModalOpen] = useState(false);
  const [inactivitySecondsLeft, setInactivitySecondsLeft] = useState(60);
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<any>(null);

  // Official Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'user-collector-3',
      title: 'New Government Employee Onboarding Application',
      message: 'Mahesh Gopal Kulkarni (MH-REV-KOT-712) has submitted credentials for Naib Tehsildar role in Baramati.',
      type: 'ACCOUNT_APPROVAL',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      userId: 'user-collector-3',
      title: 'CERT-In Security Compliance Notice',
      message: 'MeitY National Cadastral Gateway security audit pass confirmed. All Level-3 session keys rotated.',
      type: 'SECURITY',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-3',
      userId: 'user-collector-3',
      title: 'Session Established on Authorized Workstation',
      message: 'Successful 2FA login recorded from Pune District Collectorate (IP: 10.142.44.18).',
      type: 'LOGIN_ALERT',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  // Check Local Session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bhulekh_auth_token');
    const savedUser = localStorage.getItem('bhulekh_user_data');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setToken(savedToken);
      } catch (err) {
        localStorage.removeItem('bhulekh_auth_token');
        localStorage.removeItem('bhulekh_user_data');
      }
    }
  }, []);

  // Text size handler
  const handleTextSizeChange = (delta: number) => {
    if (delta === 0) setTextSize(0);
    else setTextSize((prev) => Math.min(Math.max(prev + delta, -1), 2));
  };

  // Load parcels from API or use initial seed
  useEffect(() => {
    fetch('/api/land-records')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setParcels(data);
        }
      })
      .catch((err) => console.warn('Using seeded parcels.'));
  }, []);

  // Selected Parcel object
  const currentSelectedParcel =
    parcels.find((p) => p.id === selectedParcelId) || parcels[0] || INITIAL_PARCELS[0];

  // Inactivity monitoring
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isInactivityModalOpen) {
      setIsInactivityModalOpen(false);
      setInactivitySecondsLeft(60);
    }
  }, [isInactivityModalOpen]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetActivity));

    inactivityTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      // 14 minutes = 840,000 ms -> show warning
      if (elapsed > 840000 && !isInactivityModalOpen) {
        setIsInactivityModalOpen(true);
        setInactivitySecondsLeft(60);
      }
    }, 5000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetActivity));
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [user, resetActivity, isInactivityModalOpen]);

  // Handle countdown inside inactivity modal
  useEffect(() => {
    if (!isInactivityModalOpen) return;

    const countdown = setInterval(() => {
      setInactivitySecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isInactivityModalOpen]);

  const handleExtendSession = () => {
    lastActivityRef.current = Date.now();
    setIsInactivityModalOpen(false);
    setInactivitySecondsLeft(60);
  };

  // Auth Handlers
  const handleLoginSuccess = (authenticatedUser: User, authToken: string) => {
    setUser(authenticatedUser);
    setToken(authToken);
    localStorage.setItem('bhulekh_auth_token', authToken);
    localStorage.setItem('bhulekh_user_data', JSON.stringify(authenticatedUser));
    if (authenticatedUser.roleType === 'CITIZEN') {
      setCurrentView('citizen-portal');
    } else {
      setCurrentView('dashboard');
    }
    setIs2FAModalOpen(false);
    setIsCitizenOtpModalOpen(false);
  };

  const handleRequire2FA = (
    tempToken: string,
    phoneMasked: string,
    emailMasked: string,
    testOtpHint?: string
  ) => {
    setTwoFaTempToken(tempToken);
    setTwoFaPhoneMasked(phoneMasked);
    setTwoFaEmailMasked(emailMasked);
    setTwoFaTestOtpHint(testOtpHint || '123456');
    setIs2FAModalOpen(true);
  };

  const handleRequireCitizenOtp = (identifier: string, testOtpHint?: string) => {
    setCitizenOtpIdentifier(identifier);
    setCitizenOtpTestHint(testOtpHint || '123456');
    setIsCitizenOtpModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('bhulekh_auth_token');
    localStorage.removeItem('bhulekh_user_data');
    setCurrentView('home');
    setIsInactivityModalOpen(false);
  };

  const handleLogoutAllDevices = async () => {
    if (!user) return;
    try {
      await fetch(`/api/admin/sessions/${user.id}/revoke-all`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    handleLogout();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Font size class applied to body wrapper
  const getFontSizeClass = () => {
    if (textSize === 1) return 'text-[16px]';
    if (textSize > 1) return 'text-[17px]';
    if (textSize < 0) return 'text-[14px]';
    return 'text-[15px]';
  };

  return (
    <div
      id="government-app-root"
      className={`min-h-screen flex flex-col font-sans antialiased text-[#1C2733] bg-[#F5F7FA] ${getFontSizeClass()} ${
        isHighContrast ? 'contrast-125 saturate-150' : ''
      }`}
    >
      {/* 1. Official Government Header & Accessibility Bar */}
      <GovernmentHeader
        language={language}
        onLanguageChange={setLanguage}
        textSize={textSize}
        onTextSizeChange={handleTextSizeChange}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenVoiceSearch={() => setCurrentView('voice-search')}
      />

      {/* 2. Official Sticky Navigation Bar */}
      <GovernmentNav
        language={language}
        activeView={currentView}
        onNavigate={setCurrentView}
        currentUser={user}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
      />

      {/* 3. Main View Render */}
      <main className="flex-1 w-full flex flex-col">
        {/* Landing Page */}
        {currentView === 'home' && (
          <div className="w-full">
            <HeroAndTrust
              language={language}
              onSelectNationalCommand={() => setCurrentView('national-command')}
              onSelectOfficerLogin={() => setCurrentView('login')}
              onSelectCitizenLogin={() => setCurrentView('citizen-portal')}
              onSelectGeoAi={() => setCurrentView('geo-ai')}
              onSelectLearnMore={() => {
                const el = document.getElementById('login-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            {/* Embedded Login Section on Landing Page for Instant Government Access */}
            <div id="login-section" className="w-full">
              <LoginView
                language={language}
                onLoginSuccess={handleLoginSuccess}
                onRequire2FA={handleRequire2FA}
                onRequireCitizenOtp={handleRequireCitizenOtp}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onOpenForgotPasswordModal={() => setIsForgotPasswordModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Dedicated Login View */}
        {currentView === 'login' && (
          <div className="w-full py-4">
            <LoginView
              language={language}
              onLoginSuccess={handleLoginSuccess}
              onRequire2FA={handleRequire2FA}
              onRequireCitizenOtp={handleRequireCitizenOtp}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onOpenForgotPasswordModal={() => setIsForgotPasswordModalOpen(true)}
            />
          </div>
        )}

        {/* Module 4: Citizen Portal (UMANG / DigiLocker / Citizen Experience) */}
        {(currentView === 'citizen-portal' ||
          currentView === 'citizen-services' ||
          currentView === 'citizen') && (
          <CitizenPortalMasterView
            language={language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'}
            onLanguageChange={(l) => setLanguage(l as Language)}
            onSwitchToOfficerPortal={() => setCurrentView('login')}
          />
        )}

        {/* Module 5: National Command Center + Admin + State & District Governance */}
        {(currentView === 'national-command' ||
          currentView === 'admin-command' ||
          currentView === 'command-center' ||
          currentView === 'national') && (
          <AdminMasterView onBackToCitizenPortal={() => setCurrentView('home')} />
        )}

        {/* Multi-Role Department Console & Intelligence Command Center */}
        {currentView === 'dashboard' && (
          <DashboardView
            user={user || {
              id: 'officer-demo',
              fullName: 'Shri Mahesh Gopal Kulkarni',
              employeeId: 'MH-REV-HAV-2024-081',
              department: 'Department of Revenue & Land Records',
              designation: 'Sub-Divisional Magistrate / Tehsildar',
              roleType: 'GOVERNMENT_OFFICER',
              state: 'Maharashtra',
              district: 'Pune',
              isApproved: true,
              isEmailVerified: true,
              isPhoneVerified: true,
              is2FAEnabled: true,
              createdAt: '2024-01-01',
              email: 'sdm.haveli@mahabhulekh.gov.in',
            }}
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            onNavigateToUpload={() => setCurrentView('upload')}
            onNavigateToScanner={() => setCurrentView('scanner')}
            onNavigateToQueue={() => setCurrentView('queue')}
            onNavigateToGis={() => setCurrentView('gis')}
            onNavigateToParcelDna={() => setCurrentView('parcel-dna')}
            onNavigateToFraud={() => setCurrentView('fraud')}
            onNavigateToMultiAgent={() => setCurrentView('multi-agent')}
            onNavigateToMutation={() => setCurrentView('mutation-sim')}
            onNavigateToVoice={() => setCurrentView('voice-search')}
            onNavigateToTimeline={() => setCurrentView('timeline')}
            onNavigateToTrustScore={() => setCurrentView('trust-score')}
            onNavigateToReports={() => setCurrentView('reports')}
            onNavigateToApprovals={() => setCurrentView('approvals')}
            onNavigateToSecurity={() => setCurrentView('security')}
            onNavigateToAudit={() => setCurrentView('audit')}
            onOpenReportModal={(p) => setInspectionModalParcel(p)}
          />
        )}

        {/* Module 3: ISRO × NIC GeoAI Spatial Intelligence Platform */}
        {currentView === 'geo-ai' && (
          <GeoAiMasterView
            onOpenInspectParcelModal={(parcelId) => {
              setSelectedParcelId(parcelId);
              setCurrentView('parcel-dna');
            }}
          />
        )}

        {/* Feature 1 & 2: Upload Center & Mobile Desk Scanner */}
        {(currentView === 'upload' || currentView === 'scanner') && (
          <UploadCenterView
            onDocumentUploaded={() => setCurrentView('queue')}
            onNavigateToQueue={() => setCurrentView('queue')}
          />
        )}

        {/* Feature 3: Verification Queue with Dual-Pane OCR & Explainable AI */}
        {currentView === 'queue' && (
          <VerificationQueueView
            parcels={parcels}
            onSelectParcel={setSelectedParcelId}
            onOpenReportModal={(p: LandParcelDetail) => setInspectionModalParcel(p)}
          />
        )}

        {/* Feature 4: GIS & Satellite Truth Verification */}
        {currentView === 'gis' && (
          <GisSatelliteView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            onOpenReportModal={(p: LandParcelDetail) => setInspectionModalParcel(p)}
          />
        )}

        {/* Feature 5: Parcel 360° Profile & Land DNA */}
        {currentView === 'parcel-dna' && (
          <ParcelIntelligenceView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            onOpenReportModal={(p: LandParcelDetail) => setInspectionModalParcel(p)}
            onOpenComparisonModal={(p: LandParcelDetail) => setComparisonModalParcel(p)}
          />
        )}

        {/* Feature 6: Fraud Forensic & Dispute Prediction */}
        {currentView === 'fraud' && (
          <FraudAndDisputeView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
          />
        )}

        {/* Feature 7: Multi-Agent AI Officer Hub with Human-in-the-Loop Override */}
        {currentView === 'multi-agent' && (
          <MultiAgentHubView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
          />
        )}

        {/* Feature 8: Mutation "What-If" Impact Simulator */}
        {currentView === 'mutation-sim' && (
          <MutationSimulatorView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
          />
        )}

        {/* Feature 12: Voice-Based Land Search */}
        {currentView === 'voice-search' && (
          <VoiceSearchView
            parcels={parcels}
            onSelectParcel={setSelectedParcelId}
            onNavigateToParcel={() => setCurrentView('parcel-dna')}
          />
        )}

        {/* Feature 13: AI Land Timeline (Time Travel for Land from 1950 to Present) */}
        {currentView === 'timeline' && (
          <LandTimelineView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            onNavigateToGis={() => setCurrentView('gis')}
          />
        )}

        {/* Feature 14: Citizen Trust Score & Digital Verification Certificate */}
        {(currentView === 'trust-score' || currentView === 'verification') && (
          <CitizenTrustScoreView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={setSelectedParcelId}
            onNavigateToTimeline={() => setCurrentView('timeline')}
            onNavigateToGis={() => setCurrentView('gis')}
          />
        )}

        {/* Feature 20: DILRMP District Reporting & Analytics */}
        {currentView === 'reports' && <GovernmentReportsView />}

        {/* Collector / Admin Employee Approval Workflow */}
        {currentView === 'approvals' && user && (
          <AdminApprovalView
            currentUser={user}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* Security Center (2FA, Sessions, Device Revocation) */}
        {currentView === 'security' && user && (
          <SecurityCenterView
            currentUser={user}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onLogoutAll={handleLogoutAllDevices}
          />
        )}

        {/* Audit Logs Immutable Trail */}
        {currentView === 'audit' && (
          <AuditLogsView onBackToDashboard={() => setCurrentView('dashboard')} />
        )}

        {/* Officer Personnel Profile */}
        {currentView === 'profile' && user && (
          <ProfileView
            currentUser={user}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onNavigateToSecurity={() => setCurrentView('security')}
          />
        )}
      </main>

      {/* 4. Official Government Footer */}
      <GovernmentFooter />

      {/* MODALS */}
      {/* Officer 2FA Modal */}
      <Officer2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        tempToken={twoFaTempToken}
        phoneMasked={twoFaPhoneMasked}
        emailMasked={twoFaEmailMasked}
        testOtpHint={twoFaTestOtpHint}
        onSuccess={handleLoginSuccess}
      />

      {/* Citizen OTP Modal */}
      <CitizenOtpModal
        isOpen={isCitizenOtpModalOpen}
        onClose={() => setIsCitizenOtpModalOpen(false)}
        identifier={citizenOtpIdentifier}
        testOtpHint={citizenOtpTestHint}
        onSuccess={handleLoginSuccess}
      />

      {/* Employee Registration & Status Modal */}
      <EmployeeRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />

      {/* Notification Drawer */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
      />

      {/* Session Inactivity Alert Modal */}
      <InactivityTimeoutModal
        isOpen={isInactivityModalOpen}
        secondsRemaining={inactivitySecondsLeft}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />

      {/* Module 2 Inspection & Comparison Modals */}
      {inspectionModalParcel && (
        <InspectionReportModal
          parcel={inspectionModalParcel}
          onClose={() => setInspectionModalParcel(null)}
        />
      )}

      {comparisonModalParcel && (
        <DocumentComparisonModal
          parcel={comparisonModalParcel}
          onClose={() => setComparisonModalParcel(null)}
        />
      )}
    </div>
  );
}
