import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Simulate/Trigger browser PWA install guide
      setIsInstalling(true);
      setTimeout(() => {
        setIsInstalling(false);
        setIsInstalled(true);
      }, 1200);
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="bg-[#123A78] text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
          <Smartphone className="w-4 h-4 text-[#F39C12]" />
        </div>
        <div>
          <span className="font-semibold block sm:inline">Install BhoomiSetu Mobile App (PWA):</span>{' '}
          <span className="text-gray-200">
            Official offline access for farmers & citizens. Fast 7/12 download with zero data charges.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-[#0B7A3B] hover:bg-[#096330] text-white px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm text-xs"
        >
          {isInstalling ? (
            'Installing...'
          ) : isInstalled ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Installed
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" /> Install App
            </>
          )}
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-gray-300 hover:text-white p-1 rounded transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
