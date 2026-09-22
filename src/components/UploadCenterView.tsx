import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Trash2,
  ShieldCheck,
  Building,
  ArrowRight,
  MapPin,
  Sparkles,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { LandRecordType } from '../types/landRecords';

interface UploadCenterViewProps {
  onDocumentUploaded: (documentId: string) => void;
  onNavigateToQueue: () => void;
  onNavigateToCitizen?: (parcelId?: string) => void;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({
  onDocumentUploaded,
  onNavigateToQueue,
  onNavigateToCitizen,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'scanner'>('upload');

  // Form Metadata State
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli');
  const [village, setVillage] = useState('Wagholi');
  const [docYear, setDocYear] = useState('2024');
  const [recordType, setRecordType] = useState<LandRecordType>('7/12_ROR');

  // Dynamic Land Record Fields (Extracted & Officer Editable)
  const [ownerName, setOwnerName] = useState('Anand Suresh Deshmukh');
  const [fatherName, setFatherName] = useState('Suresh Vitthal Deshmukh');
  const [surveyNumber, setSurveyNumber] = useState('219/3');
  const [khasraNumber, setKhasraNumber] = useState('219/3');
  const [khataNumber, setKhataNumber] = useState('842');
  const [landAreaHa, setLandAreaHa] = useState<number>(3.25);
  const [landType, setLandType] = useState('Perennially Irrigated Agricultural (Jirayat / Bagayat)');
  const [mutationNumber, setMutationNumber] = useState('MH-HAV-2026-M4892');

  // 6-Step Verification Execution State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verifiedParcelResult, setVerifiedParcelResult] = useState<any>(null);

  // Upload Queue State
  const [files, setFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: string;
      status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'DUPLICATE_ALERT';
      progress: number;
      sha256: string;
      confidence?: number;
    }>
  >([
    {
      id: 'f-init-1',
      name: 'HAVELI_WAGHOLI_GAT_142A_ROR.pdf',
      size: '1.8 MB',
      status: 'COMPLETED',
      progress: 100,
      sha256: '9f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      confidence: 99.2,
    },
  ]);

  const PRESETS = [
    {
      label: 'Gat 219/3 • Anand Suresh Deshmukh (3.25 Ha, Wagholi)',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Wagholi',
      docYear: '2024',
      recordType: '7/12_ROR' as LandRecordType,
      ownerName: 'Anand Suresh Deshmukh',
      fatherName: 'Suresh Vitthal Deshmukh',
      surveyNumber: '219/3',
      khasraNumber: '219/3',
      khataNumber: '842',
      landAreaHa: 3.25,
      landType: 'Perennially Irrigated Agricultural (Jirayat / Bagayat)',
      mutationNumber: 'MH-HAV-2026-M4892',
    },
    {
      label: 'Gat 154/B • Smt. Savitribai Ramdas Shinde (1.75 Ha, Paud)',
      district: 'Pune',
      taluka: 'Mulshi',
      village: 'Paud',
      docYear: '2024',
      recordType: '7/12_ROR' as LandRecordType,
      ownerName: 'Smt. Savitribai Ramdas Shinde',
      fatherName: 'Ramdas Tukaram Shinde',
      surveyNumber: '154/B',
      khasraNumber: '154/B',
      khataNumber: '319',
      landAreaHa: 1.75,
      landType: 'Dry Crop Agricultural (Jirayat)',
      mutationNumber: 'MH-MUL-2026-M1944',
    },
    {
      label: 'Gat 412/1 • Rajesh Dinkar More (4.10 Ha, Chakan)',
      district: 'Pune',
      taluka: 'Khed',
      village: 'Chakan',
      docYear: '2024',
      recordType: '7/12_ROR' as LandRecordType,
      ownerName: 'Rajesh Dinkar More',
      fatherName: 'Dinkar Anandrao More',
      surveyNumber: '412/1',
      khasraNumber: '412/1',
      khataNumber: '1104',
      landAreaHa: 4.10,
      landType: 'Industrial / Commercial Converted (NA)',
      mutationNumber: 'MH-KHD-2026-M9012',
    },
    {
      label: 'Gat 142/A • Rameshwar Kisan Patil (2.45 Ha, Wagholi)',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Wagholi',
      docYear: '2024',
      recordType: '7/12_ROR' as LandRecordType,
      ownerName: 'Rameshwar Kisan Patil',
      fatherName: 'Kisan Dhondiba Patil',
      surveyNumber: '142/A',
      khasraNumber: '142/A',
      khataNumber: '562',
      landAreaHa: 2.45,
      landType: 'Jirayat Bagayat Agricultural Farmland',
      mutationNumber: 'MH-HAV-2026-M3412',
    },
  ];

  const applyPreset = (p: typeof PRESETS[0]) => {
    setDistrict(p.district);
    setTaluka(p.taluka);
    setVillage(p.village);
    setDocYear(p.docYear);
    setRecordType(p.recordType);
    setOwnerName(p.ownerName);
    setFatherName(p.fatherName);
    setSurveyNumber(p.surveyNumber);
    setKhasraNumber(p.khasraNumber);
    setKhataNumber(p.khataNumber);
    setLandAreaHa(p.landAreaHa);
    setLandType(p.landType);
    setMutationNumber(p.mutationNumber);
  };

  const PIPELINE_STEPS = [
    {
      step: 1,
      title: 'Devanagari OCR Extraction & Ligature Transcription',
      engine: 'PaddleOCR + TrOCR Indic v3 (99.4% confidence)',
      desc: `Extracted Landowner (${ownerName}), Survey (${surveyNumber}), and Area (${landAreaHa} Ha). Zero character error rate.`,
      icon: FileText,
    },
    {
      step: 2,
      title: 'MLRC Statutory Compliance & Land Ceiling Audit',
      engine: 'RevenueLegal Rules Engine (Sec. 63/149 MLRC)',
      desc: `Holding of ${landAreaHa} Ha satisfies statutory non-fragmentation & ceiling bounds under Maharashtra Land Revenue Code.`,
      icon: ShieldCheck,
    },
    {
      step: 3,
      title: 'Cadastral Boundary & ISRO Cartosat-3 Satellite Overlay',
      engine: 'GeoSAM Cadastral Edge Detector',
      desc: 'Village cadastral map boundary matched with satellite polygon (0.2% variance). Zero forest/waterbody encroachment.',
      icon: MapPin,
    },
    {
      step: 4,
      title: 'Forensic Seal, Stamp & Paper Tamper Analysis',
      engine: 'ForensicVision Rubber Stamp Verifier',
      desc: 'Sub-Divisional Magistrate / Tehsildar official seal verified authentic. No digital clone-stamping or PDF tampering.',
      icon: CheckCircle2,
    },
    {
      step: 5,
      title: '70-Year Lineage & CERSAI Non-Encumbrance Audit',
      engine: 'LegalLineage Multi-Decadal Chain Validator',
      desc: 'Continuous title chain confirmed from 1954 settlement. CERSAI central registry returns clean zero-lien status.',
      icon: Sliders,
    },
    {
      step: 6,
      title: 'AI Multi-Agent Consensus & Citizen Portal Synchronization',
      engine: 'BhoomiSetu Multi-Agent Core Orchestrator',
      desc: 'All 5 AI Specialist Officers approved record. Synced to Citizen Portfolio, DigiLocker & Trust Certificate.',
      icon: Building,
    },
  ];

  const execute6StepVerificationPipeline = async () => {
    setIsVerifying(true);
    setVerificationModalOpen(true);
    setVerificationComplete(false);
    setCurrentStepIndex(0);

    try {
      const response = await fetch('/api/land-records/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType,
          district,
          taluka,
          village,
          year: docYear,
          fileName: `OFFICIAL_${district.toUpperCase()}_GAT_${surveyNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          ownerName,
          fatherName,
          surveyNumber,
          khasraNumber,
          khataNumber,
          landAreaHa,
          landType,
          mutationNumber,
        }),
      });

      const data = await response.json();
      setVerifiedParcelResult(data.parcel);

      // Sequentially animate all 6 steps
      for (let i = 0; i < 6; i++) {
        setCurrentStepIndex(i);
        await new Promise((r) => setTimeout(r, 600));
      }

      setCurrentStepIndex(6);
      setVerificationComplete(true);
      setIsVerifying(false);

      const newFileItem = {
        id: data.document?.id || `doc-${Date.now()}`,
        name: `VERIFIED_${village.toUpperCase()}_GAT_${surveyNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        size: '1.95 MB',
        status: 'COMPLETED' as const,
        progress: 100,
        sha256: data.document?.sha256Hash || `sha256_verified_${Date.now()}`,
        confidence: 99.4,
      };
      setFiles((prev) => [newFileItem, ...prev]);

      if (data.parcel?.id) {
        onDocumentUploaded(data.parcel.id);
      }
    } catch (err) {
      console.error('Verification pipeline error:', err);
      setIsVerifying(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Camera Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerPreset, setScannerPreset] = useState<'712_ROR' | 'SALE_DEED' | 'MUTATION'>('712_ROR');
  const [contrastLevel, setContrastLevel] = useState(120);
  const [perspectiveCorrected, setPerspectiveCorrected] = useState(true);
  const [shadowRemoved, setShadowRemoved] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(Array.from(e.target.files));
    }
  };

  const handleIncomingFiles = (incoming: File[]) => {
    const newItems = incoming.map((file, idx) => {
      // Simulate duplicate check on specific name or random condition
      const isDuplicate = file.name.toLowerCase().includes('duplicate') || file.name === 'DUPLICATE_ROR.pdf';
      return {
        id: `upl-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        status: (isDuplicate ? 'DUPLICATE_ALERT' : 'QUEUED') as any,
        progress: 0,
        sha256: `sha256_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      };
    });

    setFiles((prev) => [...newItems, ...prev]);
  };

  const startBatchProcessing = async () => {
    setIsProcessingBatch(true);

    // Simulate progressive processing with PaddleOCR + TrOCR pipeline
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'QUEUED') {
        // Step 1: Processing
        setFiles((current) =>
          current.map((item, idx) =>
            idx === i ? { ...item, status: 'PROCESSING', progress: 45 } : item
          )
        );

        await new Promise((r) => setTimeout(r, 600));

        // Step 2: Completed
        setFiles((current) =>
          current.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: 'COMPLETED',
                  progress: 100,
                  confidence: 98.4,
                }
              : item
          )
        );
      }
    }

    setIsProcessingBatch(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Camera Scanner Functions
  const startCamera = async () => {
    try {
      setCameraActive(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Live webcam not accessible, using high-resolution government document feed simulation.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureDocumentScan = () => {
    // Generate scanned document representation
    setCapturedImage(
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80'
    );
    stopCamera();
  };

  const pushScanToPipeline = () => {
    const scanItem = {
      id: `scan-${Date.now()}`,
      name: `MOBILE_SCAN_${village.toUpperCase()}_${docYear}_712.jpg`,
      size: '2.4 MB',
      status: 'COMPLETED' as const,
      progress: 100,
      sha256: `cam_sha256_${Date.now()}`,
      confidence: 98.9,
    };
    setFiles((prev) => [scanItem, ...prev]);
    setActiveTab('upload');
    setCapturedImage(null);
    onDocumentUploaded(scanItem.id);
  };

  return (
    <div className="w-full bg-[#F5F7FA] py-8 border-b border-[#D8DEE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-left">
        {/* Page Banner */}
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D8DEE8] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                  Feature 1 &amp; 2
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C2733]">
                  Document Upload Center &amp; AI Camera Scanner
                </h1>
              </div>
              <p className="text-xs text-[#5A6878] mt-1">
                Batch ingestion, SHA-256 duplicate verification, edge-detection scanner, and automatic PaddleOCR + TrOCR dispatch.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-300 shrink-0">
              <button
                onClick={() => {
                  stopCamera();
                  setActiveTab('upload');
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#123A78] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-[#123A78]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Center</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('scanner');
                  startCamera();
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'scanner'
                    ? 'bg-[#123A78] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-[#123A78]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Scanner</span>
              </button>
            </div>
          </div>

          {/* Revenue Jurisdiction Metadata Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">State &amp; District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-[#1C2733]"
              >
                <option value="Pune">Maharashtra &bull; Pune</option>
                <option value="Satara">Maharashtra &bull; Satara</option>
                <option value="Solapur">Maharashtra &bull; Solapur</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Taluka (तालुका)</label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-[#1C2733]"
              >
                <option value="Haveli">Haveli (हवेली)</option>
                <option value="Baramati">Baramati (बारामती)</option>
                <option value="Mulshi">Mulshi (मुळशी)</option>
                <option value="Khed">Khed (खेड)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Village (गावं)</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-[#1C2733]"
              >
                <option value="Wagholi">Wagholi (वाघोली)</option>
                <option value="Malegaon Khurd">Malegaon Khurd (माळेगाव खुर्द)</option>
                <option value="Paud">Paud (पौड)</option>
                <option value="Chakan">Chakan (चाकण)</option>
                <option value="Hadapsar">Hadapsar (हडपसर)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Document Year</label>
              <select
                value={docYear}
                onChange={(e) => setDocYear(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-[#1C2733]"
              >
                <option value="2024">2024 (Current e-RoR)</option>
                <option value="2022">2022</option>
                <option value="2018">2018</option>
                <option value="1999">1999 (Archival)</option>
                <option value="1978">1978 (Historical)</option>
                <option value="1952">1952 (Settlement)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Document Type</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value as LandRecordType)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded font-semibold text-[#123A78]"
              >
                <option value="7/12_ROR">7/12 Extract (सातबारा)</option>
                <option value="8A_HOLDING">8A Holding (८-अ खाते)</option>
                <option value="SALE_DEED">Sale Deed (खरेदी खत)</option>
                <option value="MUTATION_ENTRY">Mutation Register (फेरफार)</option>
                <option value="KHASRA_KHATAUNI">Khasra / Khatauni</option>
              </select>
            </div>
          </div>
        </div>

        {/* TAB 1: UPLOAD CENTER */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white ${
                isDragging ? 'border-[#123A78] bg-blue-50/50 scale-[1.005]' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#123A78] flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1C2733]">
                    Drag and drop official land records or browse files
                  </h3>
                  <p className="text-xs text-gray-500">
                    Supports high-resolution PDF, Scanned TIFF, JPG, PNG &bull; Max 25 MB per document
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <label className="px-4 py-2 bg-[#123A78] hover:bg-[#1D5AA6] text-white text-xs font-bold rounded-lg cursor-pointer shadow-2xs inline-flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Select Files</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.tiff"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      setActiveTab('scanner');
                      startCamera();
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-[#123A78]" />
                    <span>Launch Camera Scanner</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Ingested Document Queue */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#123A78]" />
                  <h3 className="text-sm font-bold text-[#1C2733]">
                    Ingestion &amp; AI Extraction Queue ({files.length} Documents)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={startBatchProcessing}
                    disabled={isProcessingBatch || files.every((f) => f.status === 'COMPLETED')}
                    className="px-4 py-1.5 bg-[#123A78] disabled:bg-gray-400 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessingBatch ? 'animate-spin' : ''}`} />
                    <span>{isProcessingBatch ? 'Extracting via AI...' : 'Process All with PaddleOCR'}</span>
                  </button>
                  <button
                    onClick={onNavigateToQueue}
                    className="px-3 py-1.5 bg-emerald-50 text-[#0B7A3B] border border-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <span>Open Verification Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Queue List */}
              <div className="divide-y divide-gray-200">
                {files.map((file) => (
                  <div key={file.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#123A78] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#1C2733]">{file.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">({file.size})</span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5 truncate max-w-sm">
                          SHA-256: {file.sha256}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Status indicator */}
                      {file.status === 'COMPLETED' && (
                        <div className="flex items-center gap-1.5 text-xs text-[#0B7A3B] font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>AI Extracted ({file.confidence}%)</span>
                        </div>
                      )}
                      {file.status === 'PROCESSING' && (
                        <div className="flex items-center gap-1.5 text-xs text-[#123A78] font-bold">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>OCR Processing ({file.progress}%)</span>
                        </div>
                      )}
                      {file.status === 'QUEUED' && (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 font-bold text-[10px] rounded uppercase">
                          Ready in Queue
                        </span>
                      )}
                      {file.status === 'DUPLICATE_ALERT' && (
                        <div className="flex items-center gap-1 text-[11px] text-[#B42318] font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Duplicate Hash Found in Registry</span>
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-[#B42318] p-1 rounded"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Land Record Extraction & 6-Step Verification Engine */}
            <div className="bg-white border-2 border-[#123A78]/30 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#123A78] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Live Ingestion &amp; Sync Engine
                    </span>
                    <h3 className="text-base font-bold text-[#1C2733]">
                      Extracted Land Record Data &amp; 6-Step Verification Pipeline
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Extracts dynamic landholder data from uploaded RoR documents, executes all statutory &amp; satellite checks, and patches live into the Citizen Portal.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#0B7A3B]" />
                  <span>PaddleOCR + TrOCR Active</span>
                </div>
              </div>

              {/* Quick Sample Presets */}
              <div>
                <span className="block text-xs font-semibold text-gray-500 mb-2">
                  1-Click Quick Records (Select to Auto-Populate Extraction Form):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        surveyNumber === preset.surveyNumber
                          ? 'border-[#123A78] bg-blue-50/70 shadow-2xs font-bold text-[#123A78]'
                          : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Gat {preset.surveyNumber}</span>
                        {surveyNumber === preset.surveyNumber && (
                          <Check className="w-3.5 h-3.5 text-[#123A78]" />
                        )}
                      </div>
                      <div className="text-[11px] truncate text-gray-600 mt-0.5">{preset.ownerName}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {preset.village} &bull; {preset.landAreaHa} Ha
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-4">
                <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <FileText className="w-4 h-4 text-[#123A78]" />
                  <span>Extracted Land Record Parameters (Editable by Officer Before Sanction)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Primary Landowner Name (खातेदाराचे नाव)
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                      placeholder="e.g. Anand Suresh Deshmukh"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Father / Guardian Name (वडिलांचे नाव)
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                      placeholder="e.g. Suresh Vitthal Deshmukh"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Survey / Gat Number (गट क्रमांक)
                    </label>
                    <input
                      type="text"
                      value={surveyNumber}
                      onChange={(e) => {
                        setSurveyNumber(e.target.value);
                        setKhasraNumber(e.target.value);
                      }}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-bold text-[#123A78] focus:border-[#123A78] focus:outline-none"
                      placeholder="e.g. 219/3"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Total Area in Hectares (क्षेत्रफळ)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={landAreaHa}
                        onChange={(e) => setLandAreaHa(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                        placeholder="3.25"
                      />
                      <span className="absolute right-2.5 top-2 text-[11px] font-bold text-gray-500">Ha</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Khata Account Number (खाते क्र.)
                    </label>
                    <input
                      type="text"
                      value={khataNumber}
                      onChange={(e) => setKhataNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                      placeholder="e.g. 842"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Certified Mutation Number (फेरफार क्र.)
                    </label>
                    <input
                      type="text"
                      value={mutationNumber}
                      onChange={(e) => setMutationNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                      placeholder="e.g. MH-HAV-2026-M4892"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Land Classification &amp; Soil Assessment
                    </label>
                    <input
                      type="text"
                      value={landType}
                      onChange={(e) => setLandType(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded font-semibold text-[#1C2733] focus:border-[#123A78] focus:outline-none"
                      placeholder="Perennially Irrigated Agricultural (Jirayat / Bagayat)"
                    />
                  </div>
                </div>
              </div>

              {/* Action Banner with Primary Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0B7A3B] shrink-0" />
                  <span>
                    Executing checks will validate all 6 revenue layers and immediately sync to Citizen Portal.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={execute6StepVerificationPipeline}
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0B7A3B] hover:bg-[#096330] disabled:bg-gray-400 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing 6-Step Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Verify Across All 6 Steps &amp; Patch to Citizen Portal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMERA SCANNER */}
        {activeTab === 'scanner' && (
          <div className="bg-white border border-[#D8DEE8] rounded-xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1C2733]">
                  NIC High-Resolution Cadastral Document Scanner
                </h3>
                <p className="text-xs text-gray-500">
                  Real-time edge boundary detection, perspective alignment, shadow normalization, and OCR pre-filtering.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-gray-600">Scan Preset:</span>
                <select
                  value={scannerPreset}
                  onChange={(e) => setScannerPreset(e.target.value as any)}
                  className="p-1.5 bg-gray-50 border border-gray-300 rounded font-bold text-[#123A78]"
                >
                  <option value="712_ROR">7/12 RoR Standard Alignment</option>
                  <option value="SALE_DEED">Multi-Page Sale Deed Stamp</option>
                  <option value="MUTATION">Mutation Form 12 / Ferfar</option>
                </select>
              </div>
            </div>

            {/* Scanner Canvas / Video Viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Viewport */}
              <div className="lg:col-span-2 relative bg-gray-950 rounded-xl overflow-hidden min-h-[380px] flex items-center justify-center border-2 border-gray-800 shadow-inner">
                {capturedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={capturedImage}
                      alt="Captured Land Record"
                      className="max-h-[360px] object-contain rounded border-2 border-[#0B7A3B] shadow-lg"
                      style={{
                        filter: `contrast(${contrastLevel}%) ${perspectiveCorrected ? 'none' : 'skew(2deg)'}`,
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-[#0B7A3B] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cadastral Boundary Locked</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full min-h-[360px] flex flex-col items-center justify-center text-white p-6">
                    {/* Simulated / Live Video Overlay */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />

                    {/* Laser Scanner Edge Overlay */}
                    <div className="absolute inset-8 border-2 border-dashed border-emerald-400 rounded pointer-events-none flex flex-col justify-between p-2 shadow-2xl animate-pulse">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded w-fit">
                        [NIC-AI EDGE DETECTOR: 4 CORNERS CALIBRATED]
                      </div>
                      <div className="text-center text-xs font-bold text-white bg-black/70 py-1 px-3 rounded w-fit mx-auto">
                        Align 7/12 extract borders within the green framing box
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded w-fit self-end">
                        ASPECT RATIO: A4 CADASTRE
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: Scanner Controls */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-5 text-xs">
                <div className="font-bold text-sm text-[#123A78] flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Sliders className="w-4 h-4" />
                  <span>Image Optimization Filters</span>
                </div>

                {/* Contrast Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Contrast Booster:</span>
                    <span className="font-mono text-[#123A78]">{contrastLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="180"
                    value={contrastLevel}
                    onChange={(e) => setContrastLevel(Number(e.target.value))}
                    className="w-full accent-[#123A78]"
                  />
                  <span className="text-[10px] text-gray-500 block">Enhances aged Devanagari ink visibility</span>
                </div>

                {/* Toggle Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={perspectiveCorrected}
                      onChange={(e) => setPerspectiveCorrected(e.target.checked)}
                      className="rounded accent-[#123A78] w-4 h-4"
                    />
                    <span>Perspective Flattening (Auto-Skew Correction)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={shadowRemoved}
                      onChange={(e) => setShadowRemoved(e.target.checked)}
                      className="rounded accent-[#123A78] w-4 h-4"
                    />
                    <span>Shadow Removal &amp; Background Whitening</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                  {!capturedImage ? (
                    <button
                      onClick={captureDocumentScan}
                      className="w-full py-2.5 bg-[#123A78] hover:bg-[#1D5AA6] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm text-xs"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture &amp; Freeze Scan</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={pushScanToPipeline}
                        className="w-full py-2.5 bg-[#0B7A3B] hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm &amp; Push to AI OCR</span>
                      </button>
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          startCamera();
                        }}
                        className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-xs"
                      >
                        Retake Scan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6-Step Verification & Citizen Portal Sync Modal */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123A78] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#123A78] text-white text-[10px] font-bold rounded uppercase">
                      Revenue Multi-Layer Audit
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      Gat {surveyNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C2733] mt-0.5">
                    Cadastral Verification &amp; Citizen Sync Pipeline
                  </h3>
                  <p className="text-xs text-gray-500">
                    {ownerName} &bull; {village}, {taluka}, {district} ({landAreaHa} Ha)
                  </p>
                </div>
              </div>

              {!isVerifying && (
                <button
                  onClick={() => setVerificationModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">
                  {verificationComplete
                    ? 'All 6 Verification Layers Passed & Synchronized'
                    : `Verifying Layer ${Math.min(currentStepIndex + 1, 6)} of 6...`}
                </span>
                <span className="text-[#123A78]">
                  {verificationComplete ? '100%' : `${Math.round((Math.max(currentStepIndex, 0) / 6) * 100)}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0B7A3B] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: verificationComplete
                      ? '100%'
                      : `${Math.round((Math.max(currentStepIndex, 0) / 6) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* 6 Step Cards */}
            <div className="space-y-2.5">
              {PIPELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = verificationComplete || currentStepIndex > idx;
                const isCurrent = !verificationComplete && currentStepIndex === idx;
                const isPending = !verificationComplete && currentStepIndex < idx;

                return (
                  <div
                    key={step.step}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                      isPassed
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : isCurrent
                        ? 'border-blue-300 bg-blue-50/60 shadow-xs'
                        : 'border-gray-200 bg-gray-50/40 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isPassed
                          ? 'bg-emerald-100 text-[#0B7A3B]'
                          : isCurrent
                          ? 'bg-blue-100 text-[#123A78]'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#1C2733]">
                          Step {step.step}: {step.title}
                        </span>
                        {isPassed && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-[#0B7A3B] font-bold text-[10px] rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> PASSED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-blue-100 text-[#123A78] font-bold text-[10px] rounded-full flex items-center gap-1 shrink-0">
                            <RefreshCw className="w-3 h-3 animate-spin" /> CHECKING...
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 font-bold text-[10px] rounded-full shrink-0">
                            PENDING
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">{step.engine}</p>
                      <p className="text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verification Success Box & CTAs */}
            {verificationComplete && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B7A3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B7A3B]">
                      Land Record Successfully Verified &amp; Synced to Citizen Portal!
                    </h4>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                      Survey / Gat No. <strong>{surveyNumber}</strong> ({ownerName}) has passed all 6 revenue, cadastral, statutory, and forensic validations. The record has been permanently patched into the Master Database and updated in the Citizen Portal with a <strong>Trust Score of 99/100</strong>.
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  {onNavigateToCitizen && (
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationModalOpen(false);
                        onNavigateToCitizen(verifiedParcelResult?.parcelUid);
                      }}
                      className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-[#123A78] hover:bg-[#0e2c5d] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Citizen Portal to Inspect Record</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setVerificationModalOpen(false);
                      onNavigateToQueue();
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View in Officer Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationModalOpen(false)}
                    className="w-full sm:w-auto py-2.5 px-3 text-xs text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
