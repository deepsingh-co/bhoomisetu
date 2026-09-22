import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, RefreshCw, AlertCircle, X, Smartphone } from 'lucide-react';
import { User } from '../types';

interface CitizenOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifier: string;
  testOtpHint?: string;
  onSuccess: (user: User, token: string) => void;
}

export const CitizenOtpModal: React.FC<CitizenOtpModalProps> = ({
  isOpen,
  onClose,
  identifier,
  testOtpHint,
  onSuccess,
}) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(180);
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

  const fillTestOtp = () => {
    const code = testOtpHint || '123456';
    setOtpDigits(code.split('').slice(0, 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP received on your mobile.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/citizen-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          otpCode: fullOtp,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'OTP verification failed.');
        setIsLoading(false);
        return;
      }

      onSuccess(data.user, data.token);
    } catch (err) {
      setErrorMessage('Network error during citizen OTP verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-otp-title"
    >
      <div className="w-full max-w-md bg-white border border-[#D8DEE8] rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#123A78] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h3 id="citizen-otp-title" className="text-sm font-bold">
                Citizen Identity OTP Verification
              </h3>
              <p className="text-[10px] text-blue-100">
                Land Records Public Services Gateway
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

        {/* Body */}
        <div className="p-6 text-left space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] border border-[#D8DEE8] rounded-md text-xs text-[#1C2733]">
            <Smartphone className="w-5 h-5 text-[#123A78] shrink-0" />
            <div>
              <div>OTP dispatched to registered mobile:</div>
              <strong className="font-mono text-sm text-[#123A78]">
                {identifier.length === 10 ? `+91 ${identifier}` : identifier}
              </strong>
            </div>
          </div>

          <div className="p-2.5 bg-green-50 border border-green-200 rounded flex items-center justify-between text-xs text-[#1F7A3E]">
            <span>Demo Test Code: <strong className="font-mono">{testOtpHint || '123456'}</strong></span>
            <button
              type="button"
              id="auto-fill-citizen-otp"
              onClick={fillTestOtp}
              className="px-2 py-0.5 bg-[#1F7A3E] text-white text-[11px] font-semibold rounded hover:bg-emerald-700"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C2733] mb-2 text-center">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-center gap-1.5 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    id={`citizen-otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-8 h-10 sm:w-10 sm:h-12 text-center text-base sm:text-lg font-bold font-mono bg-white border-2 border-[#D8DEE8] rounded-md text-[#1C2733] focus:outline-none focus:border-[#123A78] focus:ring-1 focus:ring-[#123A78]"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5A6878]">
              <span>Validity: <strong className="text-[#1C2733] font-mono">{Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}</strong></span>
              {canResend ? (
                <button
                  type="button"
                  id="resend-citizen-otp"
                  onClick={() => {
                    setSecondsLeft(180);
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

            <button
              type="submit"
              id="citizen-otp-submit-btn"
              disabled={isLoading || otpDigits.join('').length !== 6}
              className="w-full py-3 px-4 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold text-sm rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Telecom Gateway...</span>
                </div>
              ) : (
                <span>Verify OTP &amp; Proceed to Land Records</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
