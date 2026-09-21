import React, { useState, useEffect } from 'react';
import { NationalSystemSettings } from '../../types/nationalAdmin';
import {
  Settings,
  Save,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Sliders,
  Bell,
  Languages,
} from 'lucide-react';

export const SystemSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<NationalSystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/system-settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/system-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setNotice('System configurations updated and broadcast to all 28 State Cadastral Servers.');
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="bg-white border border-gray-300 p-8 rounded text-center text-xs text-gray-500">
        Loading national governance parameters...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              ENTERPRISE CONFIGURATION
            </span>
            <span className="text-xs text-gray-500 font-semibold">NIC Runtime Policy Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#123A78]" />
            National Cadastral Governance & Policy Configurations
          </h2>
          <p className="text-xs text-gray-600">
            Tune AI confidence thresholds, mandatory security parameters, mutation SLA rules, and GIS precision
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {notice}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: AI & Extraction Thresholds */}
          <div className="bg-white border border-gray-300 rounded shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Sliders className="w-4 h-4 text-[#123A78]" />
              AI & Verification Parameters
            </h3>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Minimum AI Auto-Approval Confidence</span>
                <span className="text-[#123A78]">{settings.aiConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={settings.aiConfidenceThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, aiConfidenceThreshold: Number(e.target.value) })
                }
                className="w-full accent-[#123A78] cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Records below this confidence level are redirected to human verification officers.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>GIS Cadastral Discrepancy Tolerance (Meters)</span>
                <span className="text-[#123A78]">{settings.gisDiscrepancyToleranceMeters} m</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={settings.gisDiscrepancyToleranceMeters}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gisDiscrepancyToleranceMeters: parseFloat(e.target.value) || 0.5,
                  })
                }
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Acceptable boundary difference between legacy chain survey and SVAMITVA drone survey.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDroneSurveySync}
                  onChange={(e) =>
                    setSettings({ ...settings, enableDroneSurveySync: e.target.checked })
                  }
                  className="rounded border-gray-300 text-[#123A78] focus:ring-[#123A78]"
                />
                Automated SVAMITVA Drone Survey Synchronization
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDigiLockerPush}
                  onChange={(e) =>
                    setSettings({ ...settings, enableDigiLockerPush: e.target.checked })
                  }
                  className="rounded border-gray-300 text-[#123A78] focus:ring-[#123A78]"
                />
                Automatic DigiLocker Push upon Final Mutation Order
              </label>
            </div>
          </div>

          {/* Section 2: Security & Statutory SLA */}
          <div className="bg-white border border-gray-300 rounded shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Lock className="w-4 h-4 text-[#123A78]" />
              Security & Statutory SLA Policy
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Statutory Mutation Clearance SLA (Days)
              </label>
              <input
                type="number"
                value={settings.mutationSlaDays}
                onChange={(e) =>
                  setSettings({ ...settings, mutationSlaDays: parseInt(e.target.value) || 15 })
                }
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Maximum allowable business days for Tehsildar statutory mutation decision.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Auto-Escalate Unresolved Disputes (Days)
              </label>
              <input
                type="number"
                value={settings.autoEscalateDisputesAfterDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoEscalateDisputesAfterDays: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Automatically escalate to District Collectorate Revenue Court after this period.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.is2faEnforcedNationwide}
                  onChange={(e) =>
                    setSettings({ ...settings, is2faEnforcedNationwide: e.target.checked })
                  }
                  className="rounded border-gray-300 text-[#123A78] focus:ring-[#123A78]"
                />
                Enforce Mandatory 2FA for all Land Records Officers
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenanceMode: e.target.checked })
                  }
                  className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                Emergency Cadastre Maintenance Mode (Read-Only)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#123A78] hover:bg-[#0E2C5B] text-white rounded text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Broadcasting Updates...' : 'Apply & Propagate Policies Nationwide'}
          </button>
        </div>
      </form>
    </div>
  );
};
