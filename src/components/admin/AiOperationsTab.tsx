import React, { useState, useEffect } from 'react';
import { NationalAiAgentItem } from '../../types/nationalAdmin';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  BarChart3,
  Server,
  Layers,
  Terminal,
} from 'lucide-react';

export const AiOperationsTab: React.FC = () => {
  const [agents, setAgents] = useState<NationalAiAgentItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restartingId, setRestartingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    fetchAiTelemetry();
  }, []);

  const fetchAiTelemetry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/ai-operations');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load AI operations telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartAgent = async (agentId: string, agentName: string) => {
    setRestartingId(agentId);
    try {
      const res = await fetch(`/api/admin/ai-operations/${agentId}/reset`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`AI Daemon process for "${agentName}" restarted. Queue flushed.`);
        fetchAiTelemetry();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      console.error('Failed to restart agent:', err);
    } finally {
      setRestartingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-gray-300 p-4 rounded shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#123A78]">
              NIC AI CENTRE OF EXCELLENCE
            </span>
            <span className="text-xs text-gray-500 font-semibold">Real-Time Telemetry & Daemon Cluster</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#123A78]" />
            National Cadastral AI Operations & Model Health
          </h2>
          <p className="text-xs text-gray-600">
            Automated OCR ingestion, Cross-Repository verification, Satellite parcel segmentation, and Forensic fraud checks
          </p>
        </div>

        <button
          onClick={fetchAiTelemetry}
          className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-xs font-bold flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          Poll Telemetry Now
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
          {notice}
        </div>
      )}

      {/* 4 Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Ingestions Today
            </span>
            <span className="text-2xl font-black text-gray-900 block mt-1">
              {summary.totalProcessedToday.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500">Across all 5 agent pipelines</span>
          </div>

          <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Average Model Accuracy
            </span>
            <span className="text-2xl font-black text-[#0B7A3B] block mt-1">
              {summary.averageAccuracy}%
            </span>
            <span className="text-[11px] text-[#0B7A3B] font-semibold">NIC Benchmarked</span>
          </div>

          <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Cluster Error Rate
            </span>
            <span className="text-2xl font-black text-gray-900 block mt-1">
              {summary.errorRate}%
            </span>
            <span className="text-[11px] text-gray-500">{summary.totalErrorsToday} exceptions caught</span>
          </div>

          <div className="bg-white border border-gray-300 p-3.5 rounded shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Active Daemon Workers
            </span>
            <span className="text-2xl font-black text-[#123A78] block mt-1">
              {summary.activeAgents} / {agents.length} Online
            </span>
            <span className="text-[11px] text-gray-500">Node cluster operational</span>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Dedicated Government Cadastral AI Agents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.agentId}
              className="bg-white border border-gray-300 rounded shadow-sm p-4 hover:border-[#123A78] transition"
            >
              <div className="flex items-start justify-between border-b border-gray-200 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-gray-900">{agent.agentName}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-100 text-[#0B7A3B] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B7A3B] animate-ping" />
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    Model: {agent.modelVersion} • Category: {agent.category}
                  </p>
                </div>

                <button
                  disabled={restartingId === agent.agentId}
                  onClick={() => handleRestartAgent(agent.agentId, agent.agentName)}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-bold flex items-center gap-1 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${restartingId === agent.agentId ? 'animate-spin' : ''}`} />
                  Restart Daemon
                </button>
              </div>

              {/* Metric Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-[11px] text-gray-500 block">Accuracy</span>
                  <span className="text-sm font-black text-[#0B7A3B]">{agent.accuracyPercentage}%</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-[11px] text-gray-500 block">Latency</span>
                  <span className="text-sm font-black text-gray-900">{agent.avgResponseTimeMs} ms</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-[11px] text-gray-500 block">Queue Length</span>
                  <span className="text-sm font-black text-amber-700">{agent.queueLength} tasks</span>
                </div>
              </div>

              {/* Human-in-the-loop overrides */}
              <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded text-xs space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>Suggestions Accepted by Officers:</span>
                  <span className="font-bold text-[#0B7A3B]">{agent.suggestionsAcceptedCount}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Manual Overrides / Corrections:</span>
                  <span className="font-bold text-gray-900">{agent.manualOverridesCount}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Processed in Last 24 Hours:</span>
                  <span className="font-bold text-gray-900">{agent.requestsProcessedToday}</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-gray-500 flex justify-between items-center">
                <span>Heartbeat: {new Date(agent.lastHealthCheck).toLocaleTimeString()}</span>
                <span className="font-mono text-gray-400">{agent.agentId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
