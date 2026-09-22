import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Filter,
  Sparkles,
  Layers,
  HelpCircle,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  User,
  Users,
  Home,
  FileText,
  Gavel,
  ShieldCheck,
  Building,
  CreditCard,
  Compass,
} from 'lucide-react';
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES } from '../../data/geoAiData';
import { GraphNode, GraphEdge } from '../../types/geoAi';

interface LandIntelligenceGraphViewProps {
  onSelectParcel?: (id: string) => void;
}

export const LandIntelligenceGraphView: React.FC<LandIntelligenceGraphViewProps> = ({
  onSelectParcel,
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(MOCK_GRAPH_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(MOCK_GRAPH_EDGES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(MOCK_GRAPH_NODES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState<string>('ALL');
  const [activeAiQuestion, setActiveAiQuestion] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);

  // AI Reasoning Pre-configured queries
  const AI_QUERIES = [
    {
      id: 'q1',
      question: 'Who owned this parcel before the current owner?',
      highlightIds: ['n-owner-prev', 'n-owner-curr', 'n-parcel'],
      answer:
        'According to Cadastral Settlement 1978 and Mahabhulekh mutation registers, Late Shri Chandrakant Bapu Shinde owned Survey #88/1B continuously from 1978 until his demise in 2016. The land was subsequently transferred to Vikram and Pravin Shinde under Waris Succession Entry #3104.',
    },
    {
      id: 'q2',
      question: 'Which parcels and rights belong to the same family?',
      highlightIds: ['n-owner-prev', 'n-owner-curr', 'n-owner-co'],
      answer:
        'The Shinde family (Chandrakant B. Shinde successors) holds ancestral stakes across Survey #88/1B (2.15 Ha) and adjoining Survey #88/2 (0.95 Ha). Civil Injunction #94/2024 currently enjoins third-party transfer until the co-sharer partition suit is decreed.',
    },
    {
      id: 'q3',
      question: 'Which mutation affected this title and what is its status?',
      highlightIds: ['n-mutation', 'n-parcel', 'n-court'],
      answer:
        'Mutation Ferfar #4120 was lodged on 2024-04-10 seeking sole title entry in the name of Vikram C. Shinde. It was challenged by co-sharer Pravin C. Shinde under Section 247 of MLR Code 1966, resulting in a Civil Court interim stay order.',
    },
    {
      id: 'q4',
      question: 'Are there any undischarged financial encumbrances or court stays?',
      highlightIds: ['n-bank-loan', 'n-court', 'n-parcel'],
      answer:
        'Two active encumbrances detected: (1) State Bank of India agricultural hypothecation of ₹14,50,000 registered in RoR column 12 (इतर अधिकार), and (2) Civil Court Injunction #94/2024 barring any alienation.',
    },
  ];

  const handleRunAiQuery = (query: typeof AI_QUERIES[0]) => {
    setActiveAiQuestion(query.question);
    setAiAnswer(query.answer);
    setHighlightedNodeIds(query.highlightIds);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'PARCEL':
        return <Home className="w-3.5 h-3.5" />;
      case 'OWNER':
        return <User className="w-3.5 h-3.5" />;
      case 'FAMILY':
        return <Users className="w-3.5 h-3.5" />;
      case 'VILLAGE':
        return <Building className="w-3.5 h-3.5" />;
      case 'MUTATION':
        return <FileText className="w-3.5 h-3.5" />;
      case 'COURT_CASE':
        return <Gavel className="w-3.5 h-3.5" />;
      case 'INSPECTION':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'LOAN_HYPOTHECATION':
        return <CreditCard className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  // Filtered nodes
  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedNodeTypeFilter === 'ALL' || n.type === selectedNodeTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#123A78] text-white text-[11px] font-bold rounded">
              Knowledge Graph
            </span>
            <span className="text-xs text-gray-500 font-mono">Title Nexus & Lineage Engine</span>
          </div>
          <h1 className="text-xl font-bold text-[#123A78] flex items-center gap-2">
            <span>Land Intelligence Knowledge Graph</span>
            <span className="text-sm font-normal text-gray-600">• Multi-Entity Lineage & Encumbrance Graph</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Visualizes multi-generational ownership transfers, disputed co-sharers, court injunctions, and revenue mutations.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search graph entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-[#D8DEE8] rounded-md text-xs text-gray-900 bg-[#F5F7FA] focus:outline-hidden focus:ring-1 focus:ring-[#123A78]"
            />
          </div>

          <select
            value={selectedNodeTypeFilter}
            onChange={(e) => setSelectedNodeTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#D8DEE8] rounded-md text-xs font-semibold text-gray-700 bg-[#F5F7FA] focus:outline-hidden"
          >
            <option value="ALL">All Entity Types</option>
            <option value="PARCEL">Parcels</option>
            <option value="OWNER">Owners</option>
            <option value="FAMILY">Family Lineage</option>
            <option value="MUTATION">Mutations</option>
            <option value="COURT_CASE">Court Stays</option>
            <option value="LOAN_HYPOTHECATION">Bank Loans</option>
          </select>
        </div>
      </div>

      {/* 2. Main Graph Canvas & AI Reasoning Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Graph SVG Visualizer */}
        <div className="lg:col-span-8 bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-[#D8DEE8] mb-3">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#123A78]" />
              <span className="text-xs font-bold text-[#123A78] uppercase tracking-wide">
                Interactive Title Topology (Survey #88/1B Nexus)
              </span>
            </div>
            <div className="text-[11px] text-gray-500">
              {filteredNodes.length} Nodes • {edges.length} Semantic Edges
            </div>
          </div>

          {/* SVG Graph Viewport */}
          <div className="relative w-full h-[500px] bg-[#F8FAFC] border border-[#D8DEE8] rounded-lg overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 540 450" className="w-full h-full">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
                </marker>
                <marker
                  id="arrow-dispute"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#B42318" />
                </marker>
              </defs>

              {/* Connecting Edges */}
              {edges.map((edge, idx) => {
                const srcNode = nodes.find((n) => n.id === edge.source);
                const tgtNode = nodes.find((n) => n.id === edge.target);
                if (!srcNode || !tgtNode || !srcNode.x || !srcNode.y || !tgtNode.x || !tgtNode.y) return null;

                const isDispute = edge.type === 'DISPUTE' || edge.type === 'INJUNCTION';
                const isHighlighted = highlightedNodeIds.includes(edge.source) && highlightedNodeIds.includes(edge.target);

                return (
                  <g key={idx}>
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isHighlighted ? '#F59E0B' : isDispute ? '#DC2626' : '#94A3B8'}
                      strokeWidth={isHighlighted ? 3 : isDispute ? 2 : 1.5}
                      strokeDasharray={isDispute ? '4 3' : undefined}
                      markerEnd={isDispute ? 'url(#arrow-dispute)' : 'url(#arrow)'}
                    />
                    <text
                      x={(srcNode.x + tgtNode.x) / 2}
                      y={(srcNode.y + tgtNode.y) / 2 - 4}
                      fill={isDispute ? '#B42318' : '#64748B'}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Entity Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHighlighted = highlightedNodeIds.includes(node.id);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer selection ring */}
                    <circle
                      r={isHighlighted ? 24 : isSelected ? 22 : 18}
                      fill={isHighlighted ? '#FEF3C7' : '#FFFFFF'}
                      stroke={isHighlighted ? '#D97706' : isSelected ? '#123A78' : node.color}
                      strokeWidth={isHighlighted || isSelected ? 3.5 : 2}
                      className="transition-all group-hover:scale-110"
                    />
                    <circle r={8} fill={node.color} />
                    <text
                      y="32"
                      textAnchor="middle"
                      fill="#1E293B"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Inter, sans-serif"
                      className="select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick Legend Overlay */}
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs border border-[#D8DEE8] rounded p-2 text-[10px] text-gray-600 flex flex-wrap gap-3">
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#123A78]" /> Parcel
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A3B]" /> Registered Owner
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]" /> Disputed Co-sharer
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Court Injunction
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Bank Mortgage
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Inspector & AI Reasoning Engine */}
        <div className="lg:col-span-4 space-y-4">
          {/* Node Dossier Card */}
          {selectedNode && (
            <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#D8DEE8] mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      {selectedNode.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm font-bold text-gray-900">{selectedNode.label}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-[#F5F7FA] p-2.5 rounded border border-[#D8DEE8]">
                {selectedNode.details}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-600">
                <span>Direct Connections:</span>
                <span className="font-bold text-[#123A78]">
                  {edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length} Entities
                </span>
              </div>
            </div>
          )}

          {/* AI Reasoning Engine Assistant */}
          <div className="bg-white border border-[#D8DEE8] rounded-[10px] p-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D8DEE8] mb-3">
              <Sparkles className="w-4 h-4 text-[#123A78]" />
              <h3 className="text-xs font-bold text-[#123A78] uppercase tracking-wide">
                AI Title Reasoning & Query Assistant
              </h3>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-gray-600 mb-1">Select an automated cadastral query:</div>
              {AI_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleRunAiQuery(q)}
                  className={`w-full text-left p-2.5 rounded text-xs transition-colors border ${
                    activeAiQuestion === q.question
                      ? 'bg-blue-50 border-[#123A78] text-[#123A78] font-bold'
                      : 'bg-[#F5F7FA] border-[#D8DEE8] text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#123A78] font-bold">›</span>
                    <span>{q.question}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* AI Synthesized Answer Box */}
            {aiAnswer && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-950 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
                  <span>BhoomiSetu AI Reasoning Output:</span>
                </div>
                <p className="leading-relaxed text-gray-800">{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
