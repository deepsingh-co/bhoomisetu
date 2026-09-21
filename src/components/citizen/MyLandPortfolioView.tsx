import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Copy,
  MapPin,
  ExternalLink,
  Layers,
  Filter,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CitizenActiveTab, CitizenParcel } from '../../types/citizen';

interface MyLandPortfolioViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const MyLandPortfolioView: React.FC<MyLandPortfolioViewProps> = ({
  onNavigate,
  language,
}) => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalParcel, setShareModalParcel] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch('/api/citizen/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setPortfolioData(data);
        setParcels(data.parcels || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#0B7A3B]/10 text-[#0B7A3B] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Official Landholder Dossier
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            My Land Portfolio & Assets
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Verified agricultural & residential parcels linked to Aadhaar ID (XXXX-XXXX-8421)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('correction')}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            + Report Discrepancy
          </button>
          <button
            onClick={() => onNavigate('wallet')}
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" /> Download All 7/12 Copies
          </button>
        </div>
      </div>

      {/* Summary Stat Tiles */}
      {portfolioData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">TOTAL PARCELS</span>
            <span className="text-2xl font-bold text-gray-900 mt-1 block">
              {portfolioData.summary?.totalParcels} Holdings
            </span>
            <span className="text-[11px] text-gray-600 mt-1 block">
              {portfolioData.summary?.ownedCount} Owned, {portfolioData.summary?.inheritedCount} Inherited
            </span>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">TOTAL HOLDING AREA</span>
            <span className="text-2xl font-bold text-[#123A78] mt-1 block">
              {portfolioData.summary?.totalAreaHectares} Ha
            </span>
            <span className="text-[11px] text-gray-600 mt-1 block">
              ~{Math.round((portfolioData.summary?.totalAreaHectares || 0) * 40)} Gunthas (11.99 Acres)
            </span>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">AVG. AI TRUST SCORE</span>
            <span className="text-2xl font-bold text-[#0B7A3B] mt-1 block">
              {portfolioData.summary?.averageTrustScore}/100
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              98% High Security Confidence
            </span>
          </div>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-4">
            <span className="text-xs font-semibold text-gray-500 block">ACTIVE MUTATION NOTICES</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">
              {portfolioData.summary?.pendingMutationCount} In Review
            </span>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
              Notice 8419 (Baramati Circle)
            </span>
          </div>
        </div>
      )}

      {/* Parcels List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Registered Parcels ({parcels.length})
          </h3>
          <span className="text-xs text-gray-500">
            Click on any holding to view 70-year revenue lineage or generate certificate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden hover:border-[#123A78] hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Photo / Cadastral Map Visual Placeholder */}
              <div className="h-32 bg-slate-100 relative p-3 flex flex-col justify-between border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      parcel.ownershipType === 'OWNED'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : parcel.ownershipType === 'INHERITED'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {parcel.ownershipType}
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      parcel.trustScore >= 85
                        ? 'bg-[#0B7A3B] text-white'
                        : 'bg-[#F39C12] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> {parcel.trustScore}/100
                  </span>
                </div>

                <div className="bg-black/60 backdrop-blur-xs text-white p-2 rounded text-[11px] flex items-center justify-between">
                  <span className="font-semibold truncate">{parcel.photoPlaceholder}</span>
                  <span className="text-gray-300 shrink-0 ml-1">Survey Map</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    Survey No. {parcel.surveyNumber}
                  </h4>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {parcel.village}, {parcel.taluka}, {parcel.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">AREA</span>
                    <span className="font-bold text-gray-800">
                      {parcel.areaHectares} Ha ({Math.round(parcel.areaHectares * 40)} Gunthas)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">CLASSIFICATION</span>
                    <span className="font-semibold text-gray-800 truncate block">
                      {parcel.landType}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 font-mono truncate">
                  ULPIN: {parcel.parcelUid}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => setShareModalParcel(parcel)}
                  className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
                  title="Share Verification Link"
                >
                  <Share2 className="w-4 h-4 text-[#123A78]" />
                </button>

                <button
                  onClick={() => onNavigate('trust', parcel.parcelUid)}
                  className="flex-1 bg-white border border-[#123A78] hover:bg-blue-50 text-[#123A78] text-xs font-semibold py-2 rounded-md transition-colors text-center"
                >
                  Trust Dossier
                </button>

                <button
                  onClick={() => onNavigate('timeline', parcel.parcelUid)}
                  className="flex-1 bg-[#123A78] hover:bg-[#0e2c5d] text-white text-xs font-semibold py-2 rounded-md transition-colors text-center"
                >
                  70-Yr History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Verification Modal */}
      {shareModalParcel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0B7A3B]" /> Public Land Verification Link
              </h3>
              <button
                onClick={() => setShareModalParcel(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-gray-600">
                Share this official tamper-proof verification link with banks, legal advisors, or buyers to verify Survey No. {shareModalParcel.surveyNumber}, {shareModalParcel.village}.
              </p>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between text-xs font-mono break-all">
                <span className="text-blue-900">
                  https://bhulekh.nic.in/verify/BHULEKH-VERIFY-981274-PUN-HAV-142-A
                </span>
                <button
                  onClick={() =>
                    handleCopyLink(
                      'https://bhulekh.nic.in/verify/BHULEKH-VERIFY-981274-PUN-HAV-142-A'
                    )
                  }
                  className="ml-2 p-1.5 bg-white border rounded hover:bg-gray-100 text-gray-700 shrink-0"
                  title="Copy link"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Protected by NIC SHA-256 digital signature. Personal Aadhaar numbers remain masked for privacy.
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShareModalParcel(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopyLink(
                    'https://bhulekh.nic.in/verify/BHULEKH-VERIFY-981274-PUN-HAV-142-A'
                  );
                  setTimeout(() => setShareModalParcel(null), 1000);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123A78] hover:bg-[#0e2c5d] rounded-lg"
              >
                Copy Link & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
