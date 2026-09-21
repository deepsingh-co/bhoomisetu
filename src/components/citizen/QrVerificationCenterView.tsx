import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Camera,
  Search,
  RefreshCw,
  Download,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface QrVerificationCenterViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const QrVerificationCenterView: React.FC<QrVerificationCenterViewProps> = ({
  onNavigate,
  language,
}) => {
  const [qrInput, setQrInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const testCodes = [
    {
      label: 'Valid Official Certificate (98/100)',
      hash: 'BHULEKH-VERIFY-981274-PUN-HAV-142-A',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
    },
    {
      label: 'Expired 7/12 Certificate',
      hash: 'BHULEKH-VERIFY-410291-PUN-HAV-142-C',
      color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
    },
    {
      label: 'Revoked Certificate (Litigation Stay)',
      hash: 'BHULEKH-REVOKED-118490-BAR-88-B',
      color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
    },
    {
      label: 'Tampered / Counterfeit Hash (Security Alert)',
      hash: 'BHULEKH-TAMPERED-DETECTED-SEAL-MISMATCH',
      color: 'bg-red-100 text-red-900 border-red-400 hover:bg-red-200',
    },
  ];

  const handleVerify = (hashToVerify = qrInput) => {
    if (!hashToVerify.trim()) return;
    setLoading(true);
    setVerificationResult(null);

    fetch('/api/citizen/qr/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrHash: hashToVerify.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVerificationResult(data);
        setLoading(false);
        setIsScanning(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSimulateCameraScan = () => {
    setIsScanning(true);
    setVerificationResult(null);
    setTimeout(() => {
      setQrInput('BHULEKH-VERIFY-981274-PUN-HAV-142-A');
      handleVerify('BHULEKH-VERIFY-981274-PUN-HAV-142-A');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs">
        <div className="max-w-3xl">
          <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            National Anti-Fraud Security
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            Official QR Code Land Certificate Verification Center
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Verify the authenticity of any physical 7/12 RoR, 8A, or DILRMP land certificate printed anywhere in India. Instantly detects fraudulent stamps, altered areas, or expired documents.
          </p>
        </div>

        {/* Input Controls */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Scan QR or enter certificate hash / number (e.g. BHULEKH-VERIFY-981274)..."
                className="w-full pl-10 pr-4 py-3 border border-[#D8DEE8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#123A78] font-mono text-xs sm:text-sm"
              />
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={loading || !qrInput.trim()}
              className="bg-[#123A78] hover:bg-[#0e2c5d] disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Verify Cryptographic Seal
            </button>

            <button
              onClick={handleSimulateCameraScan}
              className="border border-[#123A78] text-[#123A78] hover:bg-blue-50 px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4" />
              {isScanning ? 'Scanning...' : 'Open QR Camera'}
            </button>
          </div>

          {/* Test Samples Bar */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-gray-500 block mb-1.5">
              Quick test sample certificates:
            </span>
            <div className="flex flex-wrap gap-2">
              {testCodes.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQrInput(tc.hash);
                    handleVerify(tc.hash);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${tc.color}`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  {tc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Camera Simulation Viewfinder */}
        {isScanning && (
          <div className="mt-5 p-6 bg-slate-900 rounded-xl text-center text-white space-y-3 relative overflow-hidden">
            <div className="w-48 h-48 mx-auto border-2 border-dashed border-emerald-400 rounded-xl relative flex items-center justify-center animate-pulse">
              <span className="text-xs font-mono text-emerald-300">Point Camera at QR Code</span>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 animate-bounce" />
            </div>
            <p className="text-xs text-gray-300">
              Simulating video stream input... Aligning QR code corners with NIC signature ledger.
            </p>
          </div>
        )}
      </div>

      {/* Verification Result Banner & Dossier */}
      {verificationResult && (
        <div className="space-y-4">
          {/* Status Alert Banner */}
          <div
            className={`p-5 rounded-xl border flex items-start gap-3.5 shadow-xs ${
              verificationResult.status === 'VALID'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : verificationResult.status === 'EXPIRED'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : verificationResult.status === 'REVOKED'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-red-100 border-red-400 text-red-950'
            }`}
          >
            {verificationResult.status === 'VALID' ? (
              <ShieldCheck className="w-8 h-8 text-[#0B7A3B] shrink-0" />
            ) : verificationResult.status === 'EXPIRED' ? (
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 shrink-0" />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase ${
                    verificationResult.status === 'VALID'
                      ? 'bg-[#0B7A3B] text-white'
                      : verificationResult.status === 'EXPIRED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-red-700 text-white'
                  }`}
                >
                  VERIFICATION STATUS: {verificationResult.status}
                </span>
                <span className="text-xs font-mono text-gray-600">
                  Ref: {verificationResult.certificate?.certificateNumber || verificationResult.scannedHash}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold mt-1">
                {verificationResult.status === 'VALID'
                  ? 'Official Government of India Trust Certificate Verified'
                  : verificationResult.status === 'EXPIRED'
                  ? 'Certificate Has Expired — Renewal Required'
                  : verificationResult.status === 'REVOKED'
                  ? 'Certificate Revoked — Revenue Litigation Order In Effect'
                  : 'CRITICAL WARNING: Tampered or Counterfeit Document Detected'}
              </h3>

              <p className="text-xs mt-1 leading-relaxed">
                {verificationResult.verificationMessage || verificationResult.message}
              </p>
            </div>
          </div>

          {/* Detailed Certificate Record if Available */}
          {verificationResult.certificate && (
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Official Cadastral Ledger Details
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">SURVEY / GAT NO</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {verificationResult.certificate.surveyNumber}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">VILLAGE / TALUKA</span>
                  <span className="font-semibold text-gray-900">
                    {verificationResult.certificate.village}, {verificationResult.certificate.district}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">REGISTERED OWNER</span>
                  <span className="font-semibold text-gray-900">
                    {verificationResult.maskedOwnerName}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">AREA RECORDED</span>
                  <span className="font-bold text-gray-900">
                    {verificationResult.certificate.areaHectares} Ha
                  </span>
                </div>
              </div>

              {/* Digital Seal info */}
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <Lock className="w-3.5 h-3.5 text-[#123A78]" /> Cryptographic SHA-256 Hash:
                </div>
                <p className="font-mono text-[10px] text-gray-600 break-all">
                  {verificationResult.certificate.digitalSignature}
                </p>
                <p className="text-[11px] text-gray-500">
                  Verified Authority: {verificationResult.certificate.officerVerifiedBy}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={() =>
                    onNavigate('trust', verificationResult.certificate.parcelUid)
                  }
                  className="text-xs font-bold text-[#123A78] hover:underline"
                >
                  View 6-Pillar Trust Dossier →
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onNavigate('timeline', verificationResult.certificate.parcelUid)
                    }
                    className="text-xs border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-md font-semibold text-gray-700"
                  >
                    View Timeline
                  </button>
                  <button
                    onClick={() =>
                      alert(
                        `Downloading latest certified 7/12 copy for Survey ${verificationResult.certificate.surveyNumber}`
                      )
                    }
                    className="text-xs bg-[#0B7A3B] hover:bg-[#096330] text-white px-3.5 py-1.5 rounded-md font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Latest 7/12
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
