import React, { useState, useEffect } from 'react';
import { NationalDisasterAlertItem, NationalStateItem } from '../../types/nationalAdmin';
import {
  Satellite,
  Flame,
  AlertTriangle,
  Radio,
  Send,
  CheckCircle2,
  Waves,
  Mountain,
  Trees,
  ShieldAlert,
} from 'lucide-react';

interface DisasterEmergencyTabProps {
  states: NationalStateItem[];
}

export const DisasterEmergencyTab: React.FC<DisasterEmergencyTabProps> = ({ states }) => {
  const [alerts, setAlerts] = useState<NationalDisasterAlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [incidentType, setIncidentType] = useState('FLOOD');
  const [severity, setSeverity] = useState('WARNING');
  const [stateCode, setStateCode] = useState('MH');
  const [affectedDistricts, setAffectedDistricts] = useState('Pune, Satara');
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/emergency-disaster');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error('Failed to load emergency alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/emergency-disaster/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          severity,
          stateCode,
          affectedDistricts: affectedDistricts.split(',').map((s) => s.trim()),
          description: broadcastMessage,
          collectorActionRequired: 'Activate Taluka disaster response and freeze non-essential title mutations.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(data.message);
        setBroadcastModalOpen(false);
        setBroadcastMessage('');
        fetchAlerts();
        setTimeout(() => setActionNotice(''), 5000);
      }
    } catch (err) {
      console.error('Failed to broadcast disaster alert:', err);
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'FLOOD':
      case 'RIVER_OVERFLOW':
        return <Waves className="w-5 h-5 text-blue-600" />;
      case 'LANDSLIDE':
        return <Mountain className="w-5 h-5 text-amber-700" />;
      case 'FOREST_ENCROACHMENT':
        return <Trees className="w-5 h-5 text-emerald-700" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
              NATIONAL DISASTER EMERGENCY DESK
            </span>
            <span className="text-xs text-gray-500 font-semibold">ISRO Bhuvan InSAR & NDMA Link</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Satellite className="w-6 h-6 text-[#123A78]" />
            Satellite Land Emergency & Natural Hazard Monitoring
          </h2>
          <p className="text-xs text-gray-600">
            Real-time flood inundation, landslide slope displacement, and forest/coastal buffer encroachment
          </p>
        </div>

        <button
          onClick={() => setBroadcastModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          Broadcast Cadastral Emergency
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {actionNotice}
        </div>
      )}

      {/* Active Incidents List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Active Satellite Hazards & Cadastral Directives ({alerts.length})
        </h3>

        {isLoading ? (
          <div className="bg-white border border-gray-300 p-8 rounded text-center text-xs text-gray-500">
            Fetching satellite feeds from ISRO Cartosat-3 & RISAT-1A...
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border rounded shadow-sm p-4 transition ${
                alert.severity === 'CRITICAL_EMERGENCY'
                  ? 'border-red-500 bg-red-50/20'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded">{getIncidentIcon(alert.incidentType)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{alert.incidentType}</span>
                      <span className="font-mono text-xs text-gray-500">({alert.alertCode})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alert.severity === 'CRITICAL_EMERGENCY'
                            ? 'bg-red-600 text-white'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-[#123A78]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      State: <strong>{alert.stateName}</strong> • Districts:{' '}
                      {alert.affectedDistricts.join(', ')}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-500 font-medium">
                  Issued: {new Date(alert.issuedAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-8 space-y-2">
                  <p className="text-gray-800 leading-relaxed font-medium">{alert.description}</p>
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-gray-700">
                    <strong className="text-[#123A78] block mb-0.5">
                      Mandatory District Collector Action:
                    </strong>
                    {alert.collectorActionRequired}
                  </div>
                </div>

                <div className="md:col-span-4 bg-gray-50 p-3 rounded border border-gray-200 space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Satellite Sensor:</span>
                    <span className="font-bold text-gray-900 text-right">{alert.isroSatelliteSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affected Villages:</span>
                    <span className="font-bold text-gray-900">{alert.affectedVillagesCount} Villages</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affected Parcels:</span>
                    <span className="font-bold text-red-600">
                      {alert.affectedParcelsCount.toLocaleString()} Parcels
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ground Inspections:</span>
                    <span className="font-bold text-[#0B7A3B]">
                      {alert.inspectionsDispatched} Dispatched
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full border border-gray-300 shadow-xl overflow-hidden">
            <div className="p-4 bg-red-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Broadcast Cadastral Disaster Emergency
              </h3>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastAlert} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hazard Category</label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  >
                    <option value="FLOOD">Flood / Inundation</option>
                    <option value="LANDSLIDE">Landslide / Slope Deformation</option>
                    <option value="RIVER_OVERFLOW">River Buffer Overflow</option>
                    <option value="FOREST_ENCROACHMENT">Forest Land Encroachment</option>
                    <option value="DROUGHT">Agricultural Drought</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  >
                    <option value="CRITICAL_EMERGENCY">Critical Emergency</option>
                    <option value="WARNING">Warning</option>
                    <option value="ADVISORY">Advisory</option>
                    <option value="WATCH">Watch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target State</label>
                  <select
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  >
                    {states.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Affected Districts (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={affectedDistricts}
                    onChange={(e) => setAffectedDistricts(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Incident Description & Geo Hazard Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details of ISRO satellite imagery, water levels, rainfall, or slope deformation rate..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#123A78]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  Broadcast to State Collectors
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
