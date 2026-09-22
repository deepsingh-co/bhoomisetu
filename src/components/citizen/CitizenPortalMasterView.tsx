import React, { useState } from 'react';
import { CitizenActiveTab } from '../../types/citizen';
import { CitizenNavbar } from './CitizenNavbar';
import { CitizenBottomNav } from './CitizenBottomNav';
import { PwaInstallBanner } from './PwaInstallBanner';

// Subviews
import { CitizenDashboardView } from './CitizenDashboardView';
import { UniversalLandSearchView } from './UniversalLandSearchView';
import { VoiceRuralSearchView } from './VoiceRuralSearchView';
import { MyLandPortfolioView } from './MyLandPortfolioView';
import { CitizenTrustScoreSystemView } from './CitizenTrustScoreSystemView';
import { QrVerificationCenterView } from './QrVerificationCenterView';
import { CitizenTimelineView } from './CitizenTimelineView';
import { CorrectionRequestView } from './CorrectionRequestView';
import { GrievancePortalView } from './GrievancePortalView';
import { CitizenDocumentWalletView } from './CitizenDocumentWalletView';
import { PublicParcelIntelligenceView } from './PublicParcelIntelligenceView';
import { CitizenMiniGisMapView } from './CitizenMiniGisMapView';
import { CitizenProfileAuditView } from './CitizenProfileAuditView';

interface CitizenPortalMasterViewProps {
  language: 'en' | 'hi' | 'mr';
  onLanguageChange: (lang: 'en' | 'hi' | 'mr') => void;
  onSwitchToOfficerPortal?: () => void;
  initialTab?: CitizenActiveTab;
  initialParcelId?: string;
}

export const CitizenPortalMasterView: React.FC<CitizenPortalMasterViewProps> = ({
  language,
  onLanguageChange,
  onSwitchToOfficerPortal,
  initialTab = 'dashboard',
  initialParcelId = 'IN-MH-PUN-HAV-2024-00142-A',
}) => {
  const [activeTab, setActiveTab] = useState<CitizenActiveTab>(initialTab);
  const [activeParcelId, setActiveParcelId] = useState<string>(initialParcelId);

  const handleNavigate = (tab: CitizenActiveTab, parcelId?: string) => {
    if (parcelId) {
      setActiveParcelId(parcelId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-gray-900 pb-16 md:pb-8">
      {/* 1. Official Citizen Navigation Header */}
      <CitizenNavbar
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab)}
        language={language}
        onLanguageChange={onLanguageChange}
        onSwitchToOfficer={onSwitchToOfficerPortal || (() => {})}
      />

      {/* 2. PWA Install & Offline Status Banner */}
      <PwaInstallBanner />

      {/* 3. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <CitizenDashboardView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'search' && (
          <UniversalLandSearchView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceRuralSearchView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'portfolio' && (
          <MyLandPortfolioView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'trust' && (
          <CitizenTrustScoreSystemView
            parcelId={activeParcelId}
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'qr-verify' && (
          <QrVerificationCenterView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'timeline' && (
          <CitizenTimelineView
            parcelId={activeParcelId}
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'correction' && (
          <CorrectionRequestView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'grievance' && (
          <GrievancePortalView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'wallet' && (
          <CitizenDocumentWalletView
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'parcel-page' && (
          <PublicParcelIntelligenceView
            parcelId={activeParcelId}
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'map' && (
          <CitizenMiniGisMapView
            parcelId={activeParcelId}
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {activeTab === 'profile' && (
          <CitizenProfileAuditView
            onNavigate={handleNavigate}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        )}
      </main>

      {/* 4. Mobile Bottom Navigation for Quick Thumb Access */}
      <CitizenBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab)}
      />
    </div>
  );
};
