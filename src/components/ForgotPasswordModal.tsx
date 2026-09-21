import React, { useState } from 'react';
import { KeyRound, Mail, AlertCircle, CheckCircle2, X, RefreshCw, Lock } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [testOtpHint, setTestOtpHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Password strength calculation
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(newPassword);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Government Standard Strong'];
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-600', 'bg-emerald-600'];

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Unable to request password reset.');
        setIsLoading(false);
        return;
      }

      setTestOtpHint(data.testOtpHint || '123456');
      setStep('reset');
    } catch (err) {
      setErrorMessage('Network error requesting reset OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (strength < 3) {
      setErrorMessage('Password does not meet NIC Government security requirements (minimum 8 chars with uppercase, number, symbol).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otpCode,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Password reset failed.');
        setIsLoading(false);
        return;
      }

      setStep('success');
    } catch (err) {
      setErrorMessage('Network error resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div className="w-full max-w-md bg-white border border-[#D8DEE8] rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-300" />
            <div>
              <h3 id="forgot-password-title" className="text-sm font-bold">
                Government Identity Password Reset
              </h3>
              <p className="text-[10px] text-blue-100">
                Self-Service Security Credential Recovery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-left space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border-l-4 border-[#B42318] text-xs text-[#B42318] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <p className="text-[#5A6878] leading-relaxed">
                Enter your registered official email. A verification code will be dispatched to verify your identity.
              </p>

              <div>
                <label className="block font-bold text-[#1C2733] mb-1">
                  Registered Official Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vikram.meena@ias.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D8DEE8] rounded text-[#1C2733] focus:ring-2 focus:ring-[#123A78]"
                  />
                  <Mail className="w-4 h-4 text-[#5A6878] absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                id="request-reset-otp-btn"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold rounded shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Request Recovery OTP</span>}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-[#123A78] flex items-center justify-between">
                <span>Test Code: <strong className="font-mono">{testOtpHint || '123456'}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpCode(testOtpHint || '123456')}
                  className="px-2 py-0.5 bg-[#123A78] text-white rounded text-[10px]"
                >
                  Fill Code
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#1C2733] mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full p-2.5 font-mono text-center text-sm font-bold bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C2733] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                  />
                  <Lock className="w-4 h-4 text-[#5A6878] absolute left-3 top-2.5" />
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Strength: <strong>{strengthLabels[strength - 1] || 'Too Weak'}</strong></span>
                      <span>Min 8 chars, 1 Upper, 1 Number, 1 Symbol</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 transition-colors ${
                            strength >= level ? strengthColors[strength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#1C2733] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D8DEE8] rounded focus:ring-2 focus:ring-[#123A78]"
                  />
                  <Lock className="w-4 h-4 text-[#5A6878] absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                id="submit-reset-password-btn"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold rounded shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Update Password &amp; Invalidate Old Sessions</span>}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 text-[#1F7A3E] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#1C2733]">
                Password Updated Successfully
              </h4>
              <p className="text-xs text-[#5A6878] leading-relaxed">
                Your official government credentials have been updated and all other active sessions have been terminated.
              </p>
              <button
                type="button"
                id="close-password-reset-success-btn"
                onClick={onClose}
                className="px-5 py-2 bg-[#123A78] text-white text-xs font-bold rounded hover:bg-[#1D5AA6]"
              >
                Return to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
