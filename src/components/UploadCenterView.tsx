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
} from 'lucide-react';
import { LandRecordType } from '../types/landRecords';

interface UploadCenterViewProps {
  onDocumentUploaded: (documentId: string) => void;
  onNavigateToQueue: () => void;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({
  onDocumentUploaded,
  onNavigateToQueue,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'scanner'>('upload');

  // Form Metadata State
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli');
  const [village, setVillage] = useState('Wagholi');
  const [docYear, setDocYear] = useState('2024');
  const [recordType, setRecordType] = useState<LandRecordType>('7/12_ROR');

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
    </div>
  );
};
