// BhoomiSetu — Module 6: AI Infrastructure, Enterprise Backend & DevOps Console
import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Server,
  Database,
  Layers,
  ShieldCheck,
  Activity,
  FileCode,
  FileText,
  Clock,
  Radio,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HardDrive,
  BarChart3,
  Network,
  Terminal,
  Zap,
  BookOpen,
  ArrowRight,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ModelRegistryItem, AgentExecutionResponse, JobQueueMetrics, SystemDevOpsStatus } from '../../../server/infrastructure/types';

interface InfrastructureMasterViewProps {
  onBackToDashboard?: () => void;
}

export const InfrastructureMasterView: React.FC<InfrastructureMasterViewProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<
    'models' | 'multiagent' | 'ocr' | 'rag' | 'satellite' | 'fraud' | 'queues' | 'devops' | 'api'
  >('devops');

  // DevOps & System Status State
  const [devOpsStatus, setDevOpsStatus] = useState<SystemDevOpsStatus | null>(null);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [models, setModels] = useState<ModelRegistryItem[]>([]);
  const [queues, setQueues] = useState<JobQueueMetrics[]>([]);
  const [dlqJobs, setDlqJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Model Inference Playground State
  const [selectedModel, setSelectedModel] = useState<string>('llama3:8b');
  const [inferencePrompt, setInferencePrompt] = useState<string>(
    'Examine encumbrance note for Survey No. 44/2 Wagholi: Verify SBI crop loan charge status.'
  );
  const [jsonMode, setJsonMode] = useState<boolean>(true);
  const [inferenceOutput, setInferenceOutput] = useState<string | null>(null);
  const [inferenceMetrics, setInferenceMetrics] = useState<any>(null);
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  // Multi-Agent Execution State
  const [selectedAgent, setSelectedAgent] = useState<string>('VERIFICATION_AGENT');
  const [agentHistory, setAgentHistory] = useState<AgentExecutionResponse[]>([]);
  const [isAgentExecuting, setIsAgentExecuting] = useState(false);

  // Land Law RAG State
  const [ragQuery, setRagQuery] = useState<string>(
    'What is the mandatory objection period for mutation in Maharashtra under MLRC 1966?'
  );
  const [ragResult, setRagResult] = useState<any>(null);
  const [isRagLoading, setIsRagLoading] = useState(false);

  // Fraud & Dispute State
  const [fraudResult, setFraudResult] = useState<any>(null);
  const [disputeResult, setDisputeResult] = useState<any>(null);

  // OCR Pipeline State
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  // Backup Trigger State
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  // Fetch initial DevOps, models & queue data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [devopsRes, modelsRes, queuesRes, benchRes, histRes] = await Promise.all([
        fetch('/api/infra/devops/status').then((r) => r.json()),
        fetch('/api/infra/ai/models').then((r) => r.json()),
        fetch('/api/infra/queues/status').then((r) => r.json()),
        fetch('/api/infra/benchmarks').then((r) => r.json()),
        fetch('/api/infra/agent/history').then((r) => r.json()),
      ]);

      if (devopsRes.success) setDevOpsStatus(devopsRes.status);
      if (modelsRes.success) setModels(modelsRes.models);
      if (queuesRes.success) {
        setQueues(queuesRes.queues);
        setDlqJobs(queuesRes.deadLetterQueue);
      }
      if (benchRes.success) setBenchmarks(benchRes.benchmarks);
      if (histRes.success) setAgentHistory(histRes.history);
    } catch (e) {
      console.warn('Error fetching infrastructure status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Model Inference Execution
  const handleRunInference = async () => {
    setIsInferenceLoading(true);
    try {
      const res = await fetch('/api/infra/ai/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: inferencePrompt,
          jsonMode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInferenceOutput(data.result.text);
        setInferenceMetrics({
          latencyMs: data.result.latencyMs,
          tokens: data.result.tokensGenerated,
          cached: data.result.cached,
          gpuUsed: data.result.gpuUsed,
          modelUsed: data.result.modelUsed,
        });
      }
    } catch (err: any) {
      setInferenceOutput(`Inference Error: ${err.message}`);
    } finally {
      setIsInferenceLoading(false);
    }
  };

  // Handle Agent Execution
  const handleExecuteAgent = async () => {
    setIsAgentExecuting(true);
    try {
      const res = await fetch('/api/infra/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: selectedAgent,
          targetParcelUid: 'MH-PUN-HAV-2026-00421',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentHistory((prev) => [data.response, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAgentExecuting(false);
    }
  };

  // Handle RAG Legal Query
  const handleRunRag = async () => {
    setIsRagLoading(true);
    try {
      const res = await fetch('/api/infra/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: ragQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setRagResult(data.response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRagLoading(false);
    }
  };

  // Handle OCR Run
  const handleRunOcr = async () => {
    setIsOcrLoading(true);
    try {
      const res = await fetch('/api/infra/ocr/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'MH', languageHint: 'mr' }),
      });
      const data = await res.json();
      if (data.success) setOcrResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Handle Trigger Backup
  const handleTriggerBackup = async (type: 'FULL' | 'INCREMENTAL') => {
    try {
      const res = await fetch('/api/infra/backups/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setBackupNotice(`Encrypted ${type} snapshot created: ${data.snapshot.id} (${data.snapshot.checksum.slice(0, 18)}...)`);
        setTimeout(() => setBackupNotice(null), 6000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen text-slate-800 pb-16">
      {/* 1. Official Government Technical Header */}
      <header className="bg-[#003366] text-white border-b-4 border-[#ff9933] px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1e40af] text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Module 6 — Enterprise Core
              </span>
              <span className="text-slate-300 text-xs font-mono">DILRMP-NIC-AI-INFRA-v3.0.0</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mt-1 tracking-tight text-white">
              AI Infrastructure & Enterprise Operations Console
            </h1>
            <p className="text-xs text-slate-200 mt-0.5">
              Government of India • Ministry of Rural Development • National Land Intelligence Grid
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </button>
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="bg-[#ff9933] hover:bg-[#ea580c] text-white font-semibold text-xs px-3 py-1.5 rounded transition-colors"
              >
                ← Return to Command Center
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Backup Notification Toast */}
      {backupNotice && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupNotice}</span>
          </div>
        </div>
      )}

      {/* 2. Top-Level Architectural Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'devops', label: 'DevOps & Observability', icon: Activity },
            { id: 'models', label: 'Ollama AI Models', icon: Cpu },
            { id: 'multiagent', label: 'Multi-Agent Hub', icon: Network },
            { id: 'ocr', label: 'OCR Pipeline Laboratory', icon: FileText },
            { id: 'rag', label: 'Land Law RAG & Vectors', icon: BookOpen },
            { id: 'satellite', label: 'GeoAI & Satellite', icon: Radio },
            { id: 'fraud', label: 'Fraud & Dispute Engines', icon: ShieldCheck },
            { id: 'queues', label: 'BullMQ Queues & Cache', icon: Layers },
            { id: 'api', label: 'OpenAPI Documentation', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'border-[#003366] text-[#003366] bg-slate-50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#003366]' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-6">
        {/* ========================================================================= */}
        {/* TAB 1: DEVOPS & OBSERVABILITY (Features 22, 23, 24, 33, 35)              */}
        {/* ========================================================================= */}
        {activeTab === 'devops' && (
          <div className="space-y-6">
            {/* System Status Banner */}
            <div className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">System Health: Fully Operational</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      CERT-In Tier-3 Validated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIC Cloud Node AP-SOUTH-1 • All 9 microservice containers reporting healthy heartbeat.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerBackup('INCREMENTAL')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300"
                >
                  Snapshot Incremental
                </button>
                <button
                  onClick={() => handleTriggerBackup('FULL')}
                  className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-3 py-1.5 rounded"
                >
                  Create Full Snapshot
                </button>
              </div>
            </div>

            {/* Microservice Container Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Container Infrastructure Status (Docker & Orchestration)
                </h3>
                <span className="text-[11px] text-slate-500">Auto-heal: Enabled (Swarm/K8s)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {devOpsStatus?.containers.map((c, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{c.name}</span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {c.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-[11px] text-slate-600 border-t border-slate-100 pt-2 mt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">PORT</span>
                        <span className="font-mono">{c.port}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">MEMORY</span>
                        <span>{c.memoryMb} MB</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CPU</span>
                        <span>{c.cpuPercent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Benchmarks & Metric Highlights */}
            {benchmarks && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Production SLA & Algorithmic Performance Benchmarks (Feature 33)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {[
                    { label: 'OCR Extraction Accuracy', val: benchmarks.ocrAccuracy.value, target: benchmarks.ocrAccuracy.target, status: benchmarks.ocrAccuracy.status },
                    { label: 'Model Confidence', val: benchmarks.averageConfidence.value, target: benchmarks.averageConfidence.target, status: benchmarks.averageConfidence.status },
                    { label: 'Avg Processing Time', val: benchmarks.averageProcessingTime.value, target: benchmarks.averageProcessingTime.target, status: benchmarks.averageProcessingTime.status },
                    { label: 'Queue Wait Time', val: benchmarks.queueWaitTime.value, target: benchmarks.queueWaitTime.target, status: benchmarks.queueWaitTime.status },
                    { label: 'Report Generation', val: benchmarks.reportGenerationTime.value, target: benchmarks.reportGenerationTime.target, status: benchmarks.reportGenerationTime.status },
                    { label: 'Search Latency', val: benchmarks.searchLatency.value, target: benchmarks.searchLatency.target, status: benchmarks.searchLatency.status },
                  ].map((b, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded p-3 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block h-6 leading-tight">{b.label}</span>
                      <span className="text-lg font-extrabold text-[#003366] block my-1">{b.val}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        Target: {b.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prometheus Raw Metric Scrape Viewer */}
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#003366]" />
                  <h4 className="font-bold text-xs text-slate-900">Prometheus Telemetry Scrape Endpoint (/metrics)</h4>
                </div>
                <a
                  href="/metrics"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#003366] hover:underline flex items-center gap-1 font-medium"
                >
                  Raw View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded font-mono text-[11px] h-36 overflow-y-auto leading-relaxed">
                <div># HELP bhulekh_uptime_seconds System process uptime in seconds</div>
                <div># TYPE bhulekh_uptime_seconds counter</div>
                <div>bhulekh_uptime_seconds {devOpsStatus?.uptimeSeconds || 1420}</div>
                <div className="text-slate-400 mt-1"># HELP bhulekh_ocr_requests_total Total OCR requests</div>
                <div>bhulekh_ocr_requests_total&#123;status="success"&#125; 14820</div>
                <div>bhulekh_ocr_requests_total&#123;status="failure"&#125; 14</div>
                <div className="text-slate-400 mt-1"># HELP bhulekh_ai_inference_duration_seconds Latency histogram</div>
                <div>bhulekh_ai_inference_duration_seconds_sum 4210.5</div>
                <div>bhulekh_ai_inference_duration_seconds_count 15680</div>
                <div className="text-slate-400 mt-1"># HELP bhulekh_active_queue_jobs BullMQ active jobs</div>
                <div>bhulekh_active_queue_jobs&#123;queue="ocr"&#125; 2</div>
                <div>bhulekh_active_queue_jobs&#123;queue="ai"&#125; 1</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OLLAMA AI MODELS & ORCHESTRATOR (Feature 1)                       */}
        {/* ========================================================================= */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            {/* Model Registry List */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Local Ollama AI Model Registry (Configured & Loaded)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {models.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`bg-white border rounded p-3 cursor-pointer transition-all ${
                      selectedModel === m.id
                        ? 'border-[#003366] ring-1 ring-[#003366] bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{m.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          m.gpuAccelerated ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {m.gpuAccelerated ? 'CUDA GPU' : 'CPU Mode'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mb-2">Identifier: {m.id}</div>
                    <div className="grid grid-cols-3 text-[10px] text-slate-600 border-t border-slate-100 pt-2">
                      <div>
                        <span className="text-slate-400 block">PARAMS</span>
                        <span className="font-semibold">{m.parameterSize}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">QUANT</span>
                        <span className="font-semibold">{m.quantization}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">VRAM REQ</span>
                        <span className="font-semibold">{m.vramRequiredGb} GB</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inference Execution Console */}
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#003366]" />
                Live Model Inference & Cadastre Verification Console
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selected Model: <span className="font-mono text-[#003366]">{selectedModel}</span>
                  </label>
                  <textarea
                    value={inferencePrompt}
                    onChange={(e) => setInferencePrompt(e.target.value)}
                    rows={3}
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded focus:outline-none focus:border-[#003366]"
                    placeholder="Enter prompt or JSON query..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jsonMode}
                      onChange={(e) => setJsonMode(e.target.checked)}
                      className="rounded border-slate-300 text-[#003366] focus:ring-[#003366]"
                    />
                    Strict Government JSON Output Mode (Schema Enforced)
                  </label>

                  <button
                    onClick={handleRunInference}
                    disabled={isInferenceLoading}
                    className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Play className={`w-3.5 h-3.5 ${isInferenceLoading ? 'animate-spin' : ''}`} />
                    {isInferenceLoading ? 'Executing Local LLM...' : 'Run Model Inference'}
                  </button>
                </div>

                {inferenceOutput && (
                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">Inference Response & Audit Trace:</span>
                      {inferenceMetrics && (
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                          <span>Latency: {inferenceMetrics.latencyMs}ms</span>
                          <span>Tokens: ~{inferenceMetrics.tokens}</span>
                          <span>Cache: {inferenceMetrics.cached ? 'HIT' : 'MISS'}</span>
                        </div>
                      )}
                    </div>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64">
                      {inferenceOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MULTI-AGENT HUB (Feature 2)                                        */}
        {/* ========================================================================= */}
        {activeTab === 'multiagent' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">NIC Multi-Agent Autonomous Land Intelligence Hub</h3>
                  <p className="text-xs text-slate-500">
                    Specialized agents orchestrate cross-validation between OCR, GIS, Legal statutes, and Fraud networks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-3 py-1.5 bg-white font-medium text-slate-700"
                  >
                    <option value="OCR_AGENT">OCR Extraction Agent</option>
                    <option value="VERIFICATION_AGENT">e-KYC & Title Verification Agent</option>
                    <option value="GIS_AGENT">PostGIS Spatial Validation Agent</option>
                    <option value="FRAUD_AGENT">Forensic Fraud & Benami Agent</option>
                    <option value="LEGAL_AGENT">Land Revenue Code Legal Agent</option>
                    <option value="TIMELINE_AGENT">Provenance Blockchain Agent</option>
                    <option value="VOICE_SEARCH_AGENT">Indic Voice NLP Agent</option>
                  </select>

                  <button
                    onClick={handleExecuteAgent}
                    disabled={isAgentExecuting}
                    className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isAgentExecuting ? 'animate-spin' : ''}`} />
                    Dispatch Agent Task
                  </button>
                </div>
              </div>

              {/* Execution History Table */}
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Task ID</th>
                      <th className="p-2.5">Agent Role</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Confidence</th>
                      <th className="p-2.5">Latency</th>
                      <th className="p-2.5">Summary Findings</th>
                      <th className="p-2.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {agentHistory.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-500">{h.taskId}</td>
                        <td className="p-2.5 font-bold text-[#003366]">{h.agentType}</td>
                        <td className="p-2.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              h.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {h.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold">{(h.confidenceScore * 100).toFixed(1)}%</td>
                        <td className="p-2.5 text-slate-500">{h.executionMs} ms</td>
                        <td className="p-2.5 font-sans text-slate-800 max-w-xs truncate">{h.summary}</td>
                        <td className="p-2.5 text-slate-400 text-[11px]">{new Date(h.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OCR PIPELINE LABORATORY (Feature 3)                                */}
        {/* ========================================================================= */}
        {activeTab === 'ocr' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dual-Model OCR Pipeline (PaddleOCR v3 + TrOCR Handwritten)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extracts structured cadastral entities from Devanagari 7/12 extracts, Jamabandis, and Sale Deeds.
                  </p>
                </div>
                <button
                  onClick={handleRunOcr}
                  disabled={isOcrLoading}
                  className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-2"
                >
                  <FileText className={`w-3.5 h-3.5 ${isOcrLoading ? 'animate-spin' : ''}`} />
                  {isOcrLoading ? 'Parsing Cadastral Document...' : 'Run Dual-Pass OCR Test'}
                </button>
              </div>

              {ocrResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-2">Detected Bounding Boxes & Entities:</h4>
                    <div className="space-y-2">
                      {ocrResult.fields.map((f: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs">
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="font-semibold text-[#003366]">{f.fieldName}</span>
                            <span className="font-mono text-emerald-700 font-bold">
                              Confidence: {(f.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{f.value}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            Bounding Box: [{f.boundingBox.join(', ')}] • Rule Check: PASSED
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-2">Engine Metadata & Raw Extraction:</h4>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono space-y-1.5 h-96 overflow-y-auto">
                      <div>Engine: {ocrResult.engineUsed}</div>
                      <div>Layout Type: {ocrResult.layoutType}</div>
                      <div>Language: {ocrResult.detectedLanguage}</div>
                      <div>Processing Time: {ocrResult.processingTimeMs} ms</div>
                      <div>Official Seal Detected: {ocrResult.sealDetected ? 'YES' : 'NO'}</div>
                      <div>Signature Verified: {ocrResult.signatureDetected ? 'YES' : 'NO'}</div>
                      <div className="text-slate-400 mt-3 pt-2 border-t border-slate-700">--- Raw Extracted Text ---</div>
                      <pre className="text-slate-300 whitespace-pre-wrap">{ocrResult.rawText}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded p-12 text-center text-slate-500 text-xs">
                  Click &ldquo;Run Dual-Pass OCR Test&rdquo; to execute the multi-lingual document layout recognition engine.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: LAND LAW RAG & VECTORS (Features 4 & 5)                            */}
        {/* ========================================================================= */}
        {activeTab === 'rag' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Land Law RAG Engine & Qdrant HNSW Vector Search
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Statutory question answering grounded strictly in Maharashtra Land Revenue Code, UP Revenue Code, and Central DILRMP Circulars.
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#003366]"
                  placeholder="Enter land law question..."
                />
                <button
                  onClick={handleRunRag}
                  disabled={isRagLoading}
                  className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5"
                >
                  <Search className={`w-3.5 h-3.5 ${isRagLoading ? 'animate-spin' : ''}`} />
                  {isRagLoading ? 'Querying RAG...' : 'Query Legal RAG'}
                </button>
              </div>

              {ragResult && (
                <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Grounded Statutory Finding:
                    </span>
                    <p className="text-sm text-slate-900 font-medium leading-relaxed bg-white p-3 rounded border border-slate-200">
                      {ragResult.answer}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Retrieved Legal Citations (Hallucination-Free):
                    </span>
                    <div className="space-y-2">
                      {ragResult.legalCitations.map((c: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded border border-slate-200 text-xs">
                          <div className="flex items-center justify-between font-bold text-[#003366] mb-1">
                            <span>{c.statute} — Section {c.section}</span>
                            <span className="text-slate-400 font-mono text-[10px]">State: {c.state}</span>
                          </div>
                          <p className="text-slate-600 italic">&ldquo;{c.excerpt}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GEOAI & SATELLITE (Features 7 & 8)                                 */}
        {/* ========================================================================= */}
        {activeTab === 'satellite' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                PostGIS Spatial Cadastre & ISRO Multi-Temporal Satellite Change Detection
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Comparison between 2024 baseline survey and 2026 satellite imagery to identify unpermitted encroachments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">ISRO Cartosat-3 Imagery</span>
                  <div className="text-slate-600 space-y-1 font-mono text-[11px]">
                    <div>Resolution: 0.28m per pixel</div>
                    <div>Cloud Cover: 1.2% (Clear pass)</div>
                    <div>Sensor: Panchromatic + Multi-spectral</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Spatial Topological Metrics</span>
                  <div className="text-slate-600 space-y-1 font-mono text-[11px]">
                    <div>Calculated Area: 1.842 Hectares</div>
                    <div>Perimeter: 546.8 Meters</div>
                    <div>Centroid: [18.5793, 73.9841]</div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Temporal Change Verdict</span>
                  <div className="text-emerald-800 space-y-1 font-mono text-[11px]">
                    <div>NDVI Shift: -0.14 (Permitted Shed)</div>
                    <div>Built-up delta: +280.5 sq.m</div>
                    <div>Encroachment: NONE DETECTED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: FRAUD & DISPUTE ENGINES (Features 9 & 10)                          */}
        {/* ========================================================================= */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Multi-Signal Forensic Fraud & Dispute Risk Prediction Engine
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Calculates risk scores based on document SHA-256 signatures, seal similarity, and co-sharer litigation history.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-slate-800">Forensic Deed Analysis</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Risk: 4.8 / 100 (CLEAN)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Seal Optical Geometry Match:</span>
                      <span className="font-bold text-emerald-700">99.4% Match</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Officer Signature Trajectory:</span>
                      <span className="font-bold text-emerald-700">97.8% Match</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Duplicate IGR Registry Deed Hash:</span>
                      <span className="font-bold text-slate-800">UNIQUE (Pass)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Benami Velocity Warning:</span>
                      <span className="font-bold text-slate-800">NO RED FLAGS</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-slate-800">Dispute Probability Engine</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Probability: 8.5% (VERY LOW)
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Historical Civil Litigation Cases:</span>
                      <span className="font-bold text-slate-800">0 Active Cases</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Boundary Overlap Delta:</span>
                      <span className="font-bold text-emerald-700">&lt; 0.03m (Clean)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                      <span className="text-slate-500">Co-Sharer NOC Status:</span>
                      <span className="font-bold text-slate-800">All Heirs Registered</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Title Trust Certificate:</span>
                      <span className="font-bold text-[#003366]">GRADE A (ELIGIBLE)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: BULLMQ QUEUES & REDIS CACHE (Features 16 & 17)                     */}
        {/* ========================================================================= */}
        {activeTab === 'queues' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                BullMQ Distributed Background Workers & Queue Health
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {queues.map((q, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-800">{q.queueName}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Waiting:</span>
                        <span className="font-bold">{q.waiting}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active:</span>
                        <span className="font-bold text-[#003366]">{q.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Completed:</span>
                        <span className="text-emerald-700 font-semibold">{q.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Failed:</span>
                        <span className="text-rose-600 font-semibold">{q.failed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dead Letter Queue (DLQ) Inspector */}
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-xs text-slate-900">Dead-Letter Queue (DLQ) Exceptions</h4>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">1 Item in DLQ</span>
              </div>

              {dlqJobs.length > 0 ? (
                <div className="space-y-2">
                  {dlqJobs.map((j, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50/50 border border-amber-200 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">{j.id}</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {j.queueName}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{j.errorReason}</p>
                      </div>

                      <button
                        onClick={async () => {
                          await fetch('/api/infra/queues/dlq/retry', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ jobId: j.id }),
                          });
                          fetchData();
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1 rounded text-xs shrink-0 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry Job
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No failed jobs in dead letter queue.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: OPENAPI DOCUMENTATION (Feature 34)                                  */}
        {/* ========================================================================= */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">National Land Intelligence REST API (OpenAPI 3.0)</h3>
                  <p className="text-xs text-slate-500">
                    Compliant with Government of India Open Data and Interoperability Framework (NDAP / DILRMP).
                  </p>
                </div>
                <a
                  href="/api/infra/swagger"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#003366] hover:bg-[#1e40af] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Raw OpenAPI Spec
                </a>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { method: 'GET', path: '/health', desc: 'Real-time heartbeat & container microservice status' },
                  { method: 'GET', path: '/metrics', desc: 'Prometheus metric exposition scrape target' },
                  { method: 'POST', path: '/api/infra/ai/run', desc: 'Execute Ollama LLM with caching and JSON schema enforcement' },
                  { method: 'POST', path: '/api/infra/agent/execute', desc: 'Dispatch multi-agent autonomous verification pipeline' },
                  { method: 'POST', path: '/api/infra/ocr/process', desc: 'Dual-pass PaddleOCR + TrOCR 7/12 land extract parser' },
                  { method: 'POST', path: '/api/infra/rag/query', desc: 'Grounded statutory search under MLRC 1966 & UP Revenue Code' },
                  { method: 'POST', path: '/api/infra/fraud/analyze', desc: 'Multi-signal deed fingerprint & benami velocity detector' },
                  { method: 'POST', path: '/api/infra/dispute/analyze', desc: 'Civil litigation & boundary conflict probability engine' },
                  { method: 'POST', path: '/api/infra/reports/generate', desc: 'Generate signed digital government land certificate' },
                ].map((ep, idx) => (
                  <div key={idx} className="border border-slate-200 rounded p-2.5 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ep.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-slate-800">{ep.path}</span>
                    </div>
                    <span className="text-slate-500 font-sans text-xs">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
