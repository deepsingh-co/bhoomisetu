import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCheck,
  Cpu,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  Play,
  FileText,
  Scale,
  MapPin,
  Search,
  Check,
  History,
  CornerDownRight,
  Database,
  Building,
} from 'lucide-react';
import { LandParcelDetail } from '../types/landRecords';

interface MultiAgentHubViewProps {
  parcels: LandParcelDetail[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
}

export type OfficerAgentStatus = 'Waiting' | 'Processing' | 'Recommendation Ready' | 'Approved' | 'Rejected';

export interface NicOfficerAgent {
  id: string;
  code: 'OCR_OFFICER' | 'VERIFICATION_OFFICER' | 'GIS_OFFICER' | 'FRAUD_OFFICER' | 'LEGAL_OFFICER';
  name: string;
  mandate: string;
  roleDescription: string;
  status: OfficerAgentStatus;
  confidence: number;
  executionStartMs: number;
  executionDurationMs: number;
  recommendation: string;
  explanation: string;
  evidence: string[];
  statutoryRuleCite: string;
  humanDecision?: {
    action: 'APPROVED' | 'REJECTED';
    officerName: string;
    designation: string;
    remarks: string;
    timestamp: string;
  };
}

export interface NicAuditEntry {
  auditId: string;
  agentName: string;
  recommendation: string;
  confidence: number;
  humanDecision: 'APPROVED' | 'REJECTED' | 'PENDING';
  officerName: string;
  remarks: string;
  timestamp: string;
}

export const MultiAgentHubView: React.FC<MultiAgentHubViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
}) => {
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];
  const [selectedAgentCode, setSelectedAgentCode] = useState<string>('OCR_OFFICER');
  const [isSimulatingPipeline, setIsSimulatingPipeline] = useState(false);
  const [humanOfficerRemarks, setHumanOfficerRemarks] = useState<string>('');

  // 5 Specialized AI Officers working together as requested by user
  const [officerAgents, setOfficerAgents] = useState<NicOfficerAgent[]>([
    {
      id: 'agent-ocr',
      code: 'OCR_OFFICER',
      name: 'OCR Officer',
      mandate: 'Reads uploaded documents',
      roleDescription: 'Extracts multi-page bilingual (Devanagari / English) cadastral text, stamps, signatures, and revenue register numbers from scans.',
      status: 'Recommendation Ready',
      confidence: 99.4,
      executionStartMs: 0,
      executionDurationMs: 412,
      recommendation: 'Recommend Document Text Acceptance: All 7/12 RoR fields extracted without ligature ambiguities.',
      explanation: 'Extracted Devanagari numerals for Survey Number 214/3 and Khata 312 match the official district gazette without OCR distortion. NIC micro-security watermark confirmed intact.',
      evidence: [
        'Devanagari OCR Ligature Confidence: 99.8% across 14 extracted lines.',
        'Official Sub-Divisional seal detected at coordinates (x: 480, y: 720).',
        'Resolution verification: 400 DPI uncompressed raster scan confirmed.',
      ],
      statutoryRuleCite: 'Section 7(2) of Information Technology Act 2000 (Electronic Records Retention)',
    },
    {
      id: 'agent-verif',
      code: 'VERIFICATION_OFFICER',
      name: 'Verification Officer AI',
      mandate: 'Validates extracted fields',
      roleDescription: 'Cross-verifies extracted titleholders against state revenue registers, checks co-sharers, khata balance arithmetic, and family succession.',
      status: 'Recommendation Ready',
      confidence: 99.1,
      executionStartMs: 412,
      executionDurationMs: 620,
      recommendation: 'Recommend Titleholder Sanction: Lineage and undivided co-sharer shares match e-Pramaan registry.',
      explanation: 'Cross-referenced landowner Ram Singh Rajput and co-sharer Devendra Rajput against Khatauni 312. Verified that undivided shares total exactly 100% with no unnotified legal heirs.',
      evidence: [
        'Co-sharer total share summation = 70% + 30% = 100.0% (Zero share deficit).',
        'Aadhaar e-KYC linked for both titleholders.',
        'Prior mutation entry Ferfar 182 verified in historical taluka ledger.',
      ],
      statutoryRuleCite: 'Section 149 of Maharashtra Land Revenue Code 1966 (Reporting of Acquisition of Rights)',
    },
    {
      id: 'agent-gis',
      code: 'GIS_OFFICER',
      name: 'GIS Officer AI',
      mandate: 'Checks parcel geometry and location',
      roleDescription: 'Validates parcel polygon against ISRO Cartosat satellite data, computes stated vs observed area, and flags physical boundary encroachments.',
      status: 'Recommendation Ready',
      confidence: 99.7,
      executionStartMs: 1032,
      executionDurationMs: 840,
      recommendation: 'Recommend GIS Geometry Approval: Cadastral boundary aligns with satellite orthorectification with 0.0% encroachment.',
      explanation: 'Cadastral polygon coordinates verified against ISRO Bhuvan / Cartosat-2 satellite tile. Stated area of 1.85 Ha matches observed area of 1.85 Ha with zero boundary variance.',
      evidence: [
        'Stated Area: 1.85 Ha vs Observed Satellite Area: 1.85 Ha (0.00% variance).',
        'Adjoining boundary buffer checks: 0 encroachment on village cart track or nala.',
        'Centroid GPS fix: 18.5912°N, 73.9981°E (Haveli Cadastral Grid).',
      ],
      statutoryRuleCite: 'Rule 4 of Survey of India Cadastral Georeferencing Regulations (DILRMP Standard)',
    },
    {
      id: 'agent-fraud',
      code: 'FRAUD_OFFICER',
      name: 'Fraud Investigation Officer AI',
      mandate: 'Analyzes document authenticity',
      roleDescription: 'Performs deep forensic raster analysis, detects PDF byte-level alterations, forged seals, digital splicing, and signature cosine anomalies.',
      status: 'Recommendation Ready',
      confidence: 99.8,
      executionStartMs: 1872,
      executionDurationMs: 310,
      recommendation: 'Recommend Forensic Clearance: No byte tampering, splicing, or rubber-stamp forgery detected.',
      explanation: 'ForensicDoc-Shield inspected PDF byte stream, trailer dictionary, and font embedding. SDM circular seal diameter verified at 38.1mm (+/- 0.1mm) matching the official brass die.',
      evidence: [
        'Zero digital image splicing or double compression artifacts in DCT coefficients.',
        'Signature cosine similarity with Sub-Registrar specimen: 99.7%.',
        'SHA-256 PDF hash verified against state document repository.',
      ],
      statutoryRuleCite: 'Section 463 & 464 of Indian Penal Code / Bharatiya Nyaya Sanhita (Forgery & False Documents)',
    },
    {
      id: 'agent-legal',
      code: 'LEGAL_OFFICER',
      name: 'Legal Assistant Officer AI',
      mandate: 'Retrieves applicable land rules and explains verification requirements',
      roleDescription: 'Queries statutory revenue acts, checks Bombay Prevention of Fragmentation thresholds, and searches e-Courts for pending injunctions.',
      status: 'Recommendation Ready',
      confidence: 98.9,
      executionStartMs: 2182,
      executionDurationMs: 490,
      recommendation: 'Recommend Statutory Sanction: Complies with Fragmentation Act and zero judicial stays on record.',
      explanation: 'Holding area of 1.85 Ha well exceeds the statutory standard minimum holding of 0.20 Ha under Bombay Prevention of Fragmentation and Consolidation of Holdings Act 1947. e-Courts National Judicial Grid query returned 0 pending civil suits.',
      evidence: [
        'Bombay Prevention of Fragmentation Act (Area 1.85 Ha >= 0.20 Ha Standard Minimum) COMPLIANT.',
        'e-Courts NJDG API Response: 0 pending stay orders or lis pendens notices.',
        'CERSAI Central Registry: Unencumbered clear title with zero bank mortgage charges.',
      ],
      statutoryRuleCite: 'Section 7(1) of Bombay Prevention of Fragmentation Act & Section 148-A of MLRC 1966',
    },
  ]);

  // NIC Audit Trail storing AI recommendations and human decisions
  const [auditLog, setAuditLog] = useState<NicAuditEntry[]>([
    {
      auditId: 'AUD-2026-0921-01',
      agentName: 'OCR Officer',
      recommendation: 'Accept Devanagari 7/12 RoR transcription',
      confidence: 99.4,
      humanDecision: 'APPROVED',
      officerName: 'Shri Mahesh Gopal Kulkarni (SDM / Haveli)',
      remarks: 'Verified against manual tahsil copy. Found accurate.',
      timestamp: '2026-09-21 08:12:44',
    },
    {
      auditId: 'AUD-2026-0921-02',
      agentName: 'Verification Officer AI',
      recommendation: 'Sanction co-sharer succession allotment',
      confidence: 99.1,
      humanDecision: 'APPROVED',
      officerName: 'Shri Mahesh Gopal Kulkarni (SDM / Haveli)',
      remarks: 'Co-sharer shares properly accounted for under Hindu Succession Act.',
      timestamp: '2026-09-21 08:15:20',
    },
    {
      auditId: 'AUD-2026-0921-03',
      agentName: 'GIS Officer AI',
      recommendation: 'Approve satellite cadastral boundary match',
      confidence: 99.7,
      humanDecision: 'APPROVED',
      officerName: 'Shri Mahesh Gopal Kulkarni (SDM / Haveli)',
      remarks: 'Ground survey alignment confirmed with zero road encroachment.',
      timestamp: '2026-09-21 08:18:05',
    },
  ]);

  const activeAgent = officerAgents.find((a) => a.code === selectedAgentCode) || officerAgents[0];

  // Pipeline simulation: re-executing the 5 AI officers in sequence
  const handleRerunAllAgents = () => {
    setIsSimulatingPipeline(true);
    // Set all to Waiting
    setOfficerAgents((prev) =>
      prev.map((ag) => ({ ...ag, status: 'Waiting' as OfficerAgentStatus }))
    );

    // Sequence execution simulating NIC pipeline
    const delays = [400, 1000, 1800, 2400, 3000];

    officerAgents.forEach((ag, index) => {
      // Set to processing
      setTimeout(() => {
        setOfficerAgents((curr) =>
          curr.map((item, i) => (i === index ? { ...item, status: 'Processing' as OfficerAgentStatus } : item))
        );
      }, delays[index] - 300);

      // Set to recommendation ready
      setTimeout(() => {
        setOfficerAgents((curr) =>
          curr.map((item, i) =>
            i === index ? { ...item, status: 'Recommendation Ready' as OfficerAgentStatus } : item
          )
        );
        if (index === officerAgents.length - 1) {
          setIsSimulatingPipeline(false);
        }
      }, delays[index]);
    });
  };

  // Human Officer Approval or Rejection of Recommendation
  const handleOfficerDecision = (action: 'APPROVED' | 'REJECTED') => {
    const updatedAgents = officerAgents.map((ag) => {
      if (ag.code === selectedAgentCode) {
        return {
          ...ag,
          status: action === 'APPROVED' ? ('Approved' as OfficerAgentStatus) : ('Rejected' as OfficerAgentStatus),
          humanDecision: {
            action,
            officerName: 'Shri Mahesh Gopal Kulkarni',
            designation: 'Sub-Divisional Magistrate / Tehsildar (Haveli)',
            remarks: humanOfficerRemarks || (action === 'APPROVED' ? 'Statutory review completed. AI recommendation accepted.' : 'Overridden by statutory officer order.'),
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          },
        };
      }
      return ag;
    });

    setOfficerAgents(updatedAgents);

    // Append to Official Audit Trail
    const newAuditEntry: NicAuditEntry = {
      auditId: `AUD-${Date.now().toString().slice(-8)}`,
      agentName: activeAgent.name,
      recommendation: activeAgent.recommendation,
      confidence: activeAgent.confidence,
      humanDecision: action,
      officerName: 'Shri Mahesh Gopal Kulkarni (SDM / Haveli)',
      remarks: humanOfficerRemarks || (action === 'APPROVED' ? 'Statutory officer concurrence recorded.' : 'Officer disagreement recorded with remarks.'),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setAuditLog((prev) => [newAuditEntry, ...prev]);
    setHumanOfficerRemarks('');
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Government Officer Intelligence Command Header */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  NIC AI Workflow Engine
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-[#123A78] text-[10px] font-bold rounded uppercase font-mono">
                  Gov-Stack Cadastre v3.8
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                AI Intelligence Center: Multi-Agent Government Officers
              </h1>
              <p className="text-xs text-[#5A6878]">
                Five autonomous statutory officers collaborating concurrently. Not a chatbot &mdash; an enterprise NIC decision-support and audit governance system.
              </p>
            </div>

            {/* Parcel Selection and Pipeline Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-600">Active Parcel:</label>
                <select
                  value={selectedParcelId}
                  onChange={(e) => onSelectParcel(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-xs text-[#123A78]"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.surveyNumber} ({p.village}) &mdash; {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRerunAllAgents}
                disabled={isSimulatingPipeline}
                className="px-3.5 py-2 bg-[#123A78] hover:bg-[#1D5AA6] disabled:bg-gray-400 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingPipeline ? 'animate-spin' : ''}`} />
                <span>{isSimulatingPipeline ? 'Executing AI Pipeline...' : 'Run All 5 Officers'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Specialized AI Officers: Government Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {officerAgents.map((agent, index) => {
            const isSelected = agent.code === selectedAgentCode;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentCode(agent.code)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all shadow-2xs flex flex-col justify-between text-left ${
                  isSelected
                    ? 'border-2 border-[#123A78] ring-2 ring-blue-100 bg-blue-50/20'
                    : 'border-[#D8DEE8] hover:border-gray-400'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Top: Officer Index & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-[#123A78] text-white flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                        agent.status === 'Waiting'
                          ? 'bg-gray-100 text-gray-600'
                          : agent.status === 'Processing'
                          ? 'bg-amber-100 text-[#B26A00] animate-pulse'
                          : agent.status === 'Approved'
                          ? 'bg-emerald-100 text-[#0B7A3B]'
                          : agent.status === 'Rejected'
                          ? 'bg-red-100 text-[#B42318]'
                          : 'bg-blue-100 text-[#123A78]'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1C2733]">{agent.name}</h3>
                    <div className="text-[11px] font-semibold text-[#123A78] mt-0.5">
                      {agent.mandate}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">
                    {agent.roleDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="font-mono font-bold text-[#0B7A3B]">{agent.confidence}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Execution Timeline for Every AI Action (Millisecond Sequence) */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#123A78]" />
              <h3 className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                Execution Timeline &amp; Latency Trace (Total Sequence: 2,672ms)
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">NIC Real-Time Benchmark</span>
          </div>

          <div className="space-y-2">
            {/* Visual Gantt-style Timeline Bar */}
            <div className="w-full bg-gray-100 h-6 rounded-lg overflow-hidden flex text-[10px] font-mono text-white font-bold">
              <div
                style={{ width: '15.4%' }}
                className="bg-[#123A78] flex items-center justify-center border-r border-white/40 truncate px-1"
                title="OCR Officer (412ms)"
              >
                OCR (412ms)
              </div>
              <div
                style={{ width: '23.2%' }}
                className="bg-[#1D5AA6] flex items-center justify-center border-r border-white/40 truncate px-1"
                title="Verification Officer AI (620ms)"
              >
                Verif (620ms)
              </div>
              <div
                style={{ width: '31.4%' }}
                className="bg-[#0B7A3B] flex items-center justify-center border-r border-white/40 truncate px-1"
                title="GIS Officer AI (840ms)"
              >
                GIS Cartography (840ms)
              </div>
              <div
                style={{ width: '11.6%' }}
                className="bg-[#B42318] flex items-center justify-center border-r border-white/40 truncate px-1"
                title="Fraud Investigation Officer AI (310ms)"
              >
                Fraud (310ms)
              </div>
              <div
                style={{ width: '18.4%' }}
                className="bg-[#6938B8] flex items-center justify-center truncate px-1"
                title="Legal Assistant Officer AI (490ms)"
              >
                Legal (490ms)
              </div>
            </div>

            {/* Micro-benchmarks underneath */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-gray-500 pt-1">
              <div>&bull; OCR: 0ms &rarr; 412ms</div>
              <div>&bull; Verif: 412ms &rarr; 1032ms</div>
              <div>&bull; GIS: 1032ms &rarr; 1872ms</div>
              <div>&bull; Fraud: 1872ms &rarr; 2182ms</div>
              <div>&bull; Legal: 2182ms &rarr; 2672ms</div>
            </div>
          </div>
        </div>

        {/* Deep Recommendation, Evidence & Human Decision Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Left: Officer Recommendation, Statutory Explanation & Evidence */}
          <div className="lg:col-span-8 bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                    Service Dossier
                  </span>
                  <h2 className="text-base font-bold text-[#1C2733]">{activeAgent.name}</h2>
                </div>
                <p className="text-xs text-[#5A6878] mt-0.5">
                  Mandate: <strong>{activeAgent.mandate}</strong> &bull; Latency: {activeAgent.executionDurationMs}ms
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Model Confidence</span>
                <span className="font-mono text-xl font-extrabold text-[#0B7A3B]">
                  {activeAgent.confidence}%
                </span>
              </div>
            </div>

            {/* Official Recommendation Banner */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
              <div className="text-[11px] font-bold text-[#123A78] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#123A78]" />
                <span>Official Recommendation for Human Officer:</span>
              </div>
              <p className="text-sm font-bold text-[#1C2733] leading-relaxed">
                {activeAgent.recommendation}
              </p>
            </div>

            {/* Explanation Section */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Statutory Explanation &amp; Methodological Analysis:
              </h4>
              <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                {activeAgent.explanation}
              </p>
            </div>

            {/* Statutory Legal Rule Citation */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Statutory Authority &amp; Legal Framework:</span>
              </div>
              <p className="text-gray-800 font-medium">{activeAgent.statutoryRuleCite}</p>
            </div>

            {/* Evidence Payload Checklist */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                Verified Evidence Items (साक्ष व पुरावे):
              </h4>
              <div className="space-y-2">
                {activeAgent.evidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0B7A3B] shrink-0 mt-0.5" />
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Decision Record if already actioned */}
            {activeAgent.humanDecision && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  activeAgent.humanDecision.action === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs uppercase flex items-center gap-1 ${
                      activeAgent.humanDecision.action === 'APPROVED' ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Human Officer Decision: {activeAgent.humanDecision.action}</span>
                  </span>
                  <span className="font-mono text-gray-500 text-[11px]">
                    {activeAgent.humanDecision.timestamp}
                  </span>
                </div>
                <div className="text-gray-800">
                  Officer: <strong>{activeAgent.humanDecision.officerName}</strong> &mdash;{' '}
                  <span className="text-gray-600">{activeAgent.humanDecision.designation}</span>
                </div>
                <div className="text-gray-700 italic">
                  Remarks: "{activeAgent.humanDecision.remarks}"
                </div>
              </div>
            )}
          </div>

          {/* Right: Human Officer Approval / Rejection Gateway */}
          <div className="lg:col-span-4 bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#123A78] uppercase tracking-wider border-b border-gray-200 pb-2">
              Statutory Officer Action Portal
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              Under Indian Revenue Jurisprudence, autonomous AI systems provide recommendations. The presiding Sub-Divisional Officer or Tehsildar exercises statutory human authority.
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-700 block">Official Remarks &amp; Judicial Reason:</label>
              <textarea
                rows={3}
                value={humanOfficerRemarks}
                onChange={(e) => setHumanOfficerRemarks(e.target.value)}
                placeholder="Enter statutory reason for accepting or overriding the AI recommendation..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#123A78] focus:bg-white"
              />
            </div>

            {/* Decision Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleOfficerDecision('APPROVED')}
                className="w-full py-2.5 bg-[#0B7A3B] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Approve Recommendation</span>
              </button>

              <button
                onClick={() => handleOfficerDecision('REJECTED')}
                className="w-full py-2.5 bg-[#B42318] hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-2xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject / Override Recommendation</span>
              </button>
            </div>

            {/* Authenticated Officer Badge */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-[11px] space-y-1">
              <div className="font-bold text-gray-800">Officer on Duty:</div>
              <div className="text-gray-700">Shri Mahesh Gopal Kulkarni (SDM / Haveli)</div>
              <div className="font-mono text-gray-500 text-[10px]">ID: NIC-MH-PUN-08812 &bull; Digital Token Active</div>
            </div>
          </div>
        </div>

        {/* Audit Log Table: Stores AI Recommendation and Human Decision */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-2xs space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#123A78]" />
              <h3 className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                Permanent Statutory Audit Log (AI Recommendation &amp; Human Decision Trail)
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">Immutable Log Trail</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 font-bold text-gray-700">
                <tr>
                  <th className="p-2.5">Audit ID</th>
                  <th className="p-2.5">AI Officer</th>
                  <th className="p-2.5">AI Recommendation</th>
                  <th className="p-2.5">Confidence</th>
                  <th className="p-2.5">Human Decision</th>
                  <th className="p-2.5">Reviewing Officer</th>
                  <th className="p-2.5">Remarks</th>
                  <th className="p-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auditLog.map((entry) => (
                  <tr key={entry.auditId} className="hover:bg-gray-50">
                    <td className="p-2.5 font-mono text-[11px] text-gray-500">{entry.auditId}</td>
                    <td className="p-2.5 font-bold text-[#123A78]">{entry.agentName}</td>
                    <td className="p-2.5 text-gray-800 max-w-xs truncate" title={entry.recommendation}>
                      {entry.recommendation}
                    </td>
                    <td className="p-2.5 font-mono font-bold text-[#0B7A3B]">{entry.confidence}%</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          entry.humanDecision === 'APPROVED'
                            ? 'bg-emerald-100 text-[#0B7A3B]'
                            : 'bg-red-100 text-[#B42318]'
                        }`}
                      >
                        {entry.humanDecision}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-700">{entry.officerName}</td>
                    <td className="p-2.5 text-gray-600 italic max-w-xs truncate" title={entry.remarks}>
                      "{entry.remarks}"
                    </td>
                    <td className="p-2.5 font-mono text-gray-500 text-[11px]">{entry.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
