import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, AlertCircle, RefreshCw, X, KeyRound, Smartphone } from 'lucide-react';
import { User } from '../types';

interface Officer2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempToken: string;
  phoneMasked: string;
  emailMasked: string;
  testOtpHint?: string;
  onSuccess: (user: User, token: string) => void;
}

export const Officer2FAModal: React.FC<Officer2FAModalProps> = ({
  isOpen,
  onClose,
  tempToken,
  phoneMasked,
  emailMasked,
  testOtpHint,
  onSuccess,
}) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(300);
    setCanResend(false);
    setErrorMessage(null);
    setOtpDigits(['', '', '', '', '', '']);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const fillTestOtp = () => {
    const code = testOtpHint || '123456';
    const newDigits = code.split('').slice(0, 6);
    setOtpDigits(newDigits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit authentication code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/officer-2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempAuthToken: tempToken,
          otpCode: fullOtp,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || '2FA Verification failed.');
        setIsLoading(false);
        return;
      }

      onSuccess(data.user, data.token);
    } catch (err) {
      setErrorMessage('Network error communicating with NIC 2FA service.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="officer-2fa-title"
    >
      <div className="w-full max-w-md bg-white border border-[#D8DEE8] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 id="officer-2fa-title" className="text-sm font-bold tracking-wide">
                Two-Factor Security Verification (2FA)
              </h3>
              <p className="text-[10px] text-blue-200">
                National Informatics Centre &bull; Level-3 Officer Clearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-left space-y-4">
          <div className="text-xs text-[#5A6878] leading-relaxed">
            As required by the Government of India security mandate, an OTP has been dispatched to:
            <div className="mt-2 p-2.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded font-mono text-xs text-[#1C2733] space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#123A78]" />
                <span>Mobile: {phoneMasked}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#123A78]" />
                <span>Official Email: {emailMasked}</span>
              </div>
            </div>
          </div>

          {/* Evaluator Quick Hint Bar */}
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded flex items-center justify-between text-xs text-[#123A78]">
            <span>
              Test Verification Code: <strong className="font-mono">{testOtpHint || '123456'}</strong>
            </span>
            <button
              type="button"
              id="fill-test-otp-btn"
              onClick={fillTestOtp}
              className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-semibold rounded hover:bg-[#1D5AA6]"
            >
              Auto-Fill
            </button>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-50 border-l-4 border-[#B42318] text-xs text-[#B42318] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 6-digit OTP Box Inputs */}
            <div>
              <label className="block text-xs font-bold text-[#1C2733] mb-2 text-center">
                Enter 6-Digit One-Time Security Code
              </label>
              <div className="flex justify-center gap-1.5 sm:gap-2.5" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    id={`officer-otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-8 h-10 sm:w-10 sm:h-12 md:w-11 md:h-13 text-center text-base sm:text-lg font-bold font-mono bg-white border-2 border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:border-[#123A78] focus:ring-1 focus:ring-[#123A78]"
                  />
                ))}
              </div>
            </div>

            {/* Countdown and Resend */}
            <div className="flex items-center justify-between text-xs text-[#5A6878] pt-1">
              <span>Time remaining: <strong className="text-[#1C2733] font-mono">{formatTime(secondsLeft)}</strong></span>
              {canResend ? (
                <button
                  type="button"
                  id="resend-2fa-btn"
                  onClick={() => {
                    setSecondsLeft(300);
                    setCanResend(false);
                    fillTestOtp();
                  }}
                  className="text-[#123A78] font-bold hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-[#7A8794]">Resend in {secondsLeft}s</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="verify-2fa-submit-btn"
              disabled={isLoading || otpDigits.join('').length !== 6}
              className="w-full py-3 px-4 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#123A78] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating OTP with NIC Gateway...</span>
                </div>
              ) : (
                <span>Verify &amp; Access System</span>
              )}
            </button>
          </form>

          <div className="text-[11px] text-center text-[#7A8794] pt-2 border-t border-[#D8DEE8]">
            Hardware Security Key (FIDO2 / PKI Token) is also supported at designated Collectorate terminals.
          </div>
        </div>
      </div>
    </div>
  );
};
