import React, { useState, useEffect } from 'react';
import {
  FolderClosed,
  FolderOpen,
  FileText,
  Download,
  Share2,
  Star,
  Search,
  CheckCircle2,
  QrCode,
  Printer,
  ShieldCheck,
  Eye,
  Lock,
} from 'lucide-react';
import { CitizenActiveTab, CitizenWalletDocument } from '../../types/citizen';

interface CitizenDocumentWalletViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CitizenDocumentWalletView: React.FC<CitizenDocumentWalletViewProps> = ({
  onNavigate,
  language,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('VERIFIED_RECORDS');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<CitizenWalletDocument[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<CitizenWalletDocument | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [selectedFolder]);

  const fetchDocuments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedFolder !== 'ALL') params.set('folder', selectedFolder);
    if (searchQuery) params.set('search', searchQuery);

    fetch(`/api/citizen/documents?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
        if (data.folders) setFolders(data.folders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Government of India DigiLocker Integration
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen Document Wallet & Digital Certificates
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            All your digitally signed 7/12 RoR records, 8A extracts, cadastral maps, and AI trust certificates in one secure Government vault.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('qr-verify')}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-[#123A78]" /> Verify QR Code
          </button>
          <button
            onClick={() => {
              alert('Exporting full document vault archive (.ZIP) with verified digital signatures.');
            }}
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Vault (.ZIP)
          </button>
        </div>
      </div>

      {/* Main Layout: Folders Sidebar + Documents Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Folders Column */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block px-1">
            Vault Categories
          </span>

          <div className="bg-white border border-[#D8DEE8] rounded-xl p-2 shadow-xs space-y-1">
            {[
              { id: 'VERIFIED_RECORDS', label: 'Verified 7/12 & 8A', count: 2 },
              { id: 'DOWNLOADED_REPORTS', label: 'AI Timeline Dossiers', count: 1 },
              { id: 'PENDING_DOCS', label: 'Pending Ferfars', count: 1 },
              { id: 'SHARED_CERTS', label: 'Shared Verification', count: 1 },
              { id: 'FAVORITES', label: 'Starred Records', count: 2 },
            ].map((f) => {
              const isSelected = selectedFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#123A78] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4 text-white" />
                    ) : (
                      <FolderClosed className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="truncate">{f.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* DigiLocker Compliance Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> DigiLocker Equivalent
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Electronic documents in this wallet are legally recognized under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016.
            </p>
          </div>
        </div>

        {/* Right Documents List */}
        <div className="md:col-span-3 space-y-4">
          {/* Search bar inside documents */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDocuments()}
              placeholder="Search documents by title, survey number..."
              className="w-full pl-9 pr-4 py-2 border border-[#D8DEE8] rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#123A78]"
            />
          </div>

          {/* Document Cards */}
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#D8DEE8] rounded-xl p-4 hover:border-[#123A78] hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg shrink-0 border border-red-200">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{doc.title}</h4>
                      {doc.isFavorite && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Survey No. {doc.surveyNumber}</span>
                      <span>•</span>
                      <span>Format: {doc.fileFormat} ({doc.fileSize})</span>
                      <span>•</span>
                      <span>Issued: {new Date(doc.issuedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-gray-500">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-xs">{doc.verificationHash}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md text-xs flex items-center gap-1 font-medium transition-colors"
                    title="Preview Document"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>

                  <button
                    onClick={() =>
                      alert(`Downloading certified ${doc.title} with NIC cryptographic QR watermark.`)
                    }
                    className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-300 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">{previewDoc.title}</h3>
                <span className="text-xs text-gray-500">
                  Digital Record of Rights (RoR) • NIC Central Repository
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Document Rendered Body */}
            <div className="mt-5 p-6 bg-amber-50/20 border-2 border-[#123A78] rounded-xl space-y-4 text-xs font-serif text-gray-800">
              <div className="text-center border-b border-gray-300 pb-3">
                <span className="font-bold uppercase tracking-widest text-[11px] block">
                  GOVERNMENT OF MAHARASHTRA • REVENUE DEPARTMENT
                </span>
                <span className="text-base font-bold text-[#123A78] block mt-1">
                  गाव नमुना सात / बारा (अधिकार अभिलेख पत्रक)
                </span>
                <span className="text-[10px] text-gray-600 block">
                  (महाराष्ट्र जमीन महसूल अधिकार अभिलेख आणि नोंदवह्या तयार करणे व सुस्थितीत ठेवणे नियम १९७१ यातील नियम ३, ५, ६ आणि ७ अन्वये)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded border border-gray-200 text-[11px]">
                <div>
                  <strong>गाव:</strong> वाघोली (Wagholi)
                </div>
                <div>
                  <strong>तालुका:</strong> हवेली (Haveli)
                </div>
                <div>
                  <strong>जिल्हा:</strong> पुणे (Pune)
                </div>
                <div>
                  <strong>भूमापन क्रमांक:</strong> {previewDoc.surveyNumber}
                </div>
                <div>
                  <strong>क्षेत्रफळ:</strong> 1.84 हेक्टर
                </div>
                <div>
                  <strong>खाते क्रमांक:</strong> KH-142-1
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-gray-200">
                <strong className="block mb-1 text-[#123A78]">खातेदाराचे नाव व हिस्सा:</strong>
                <p>रामेश्वर ज्ञानेश्वर पाटील (पूर्ण मालकी हक्क) - 1.84 हेक्टर आर</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  इतर हक्क व बोजा: निरंक (कोणताही बँकेचा अगर सहकारी संस्थेचा बोजा नाही)
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                <div className="text-[10px] space-y-0.5">
                  <p className="font-mono text-gray-500">Hash: {previewDoc.verificationHash}</p>
                  <p className="text-emerald-700 font-bold">
                    ✓ Digitally Signed by Tehsildar Haveli, Pune
                  </p>
                </div>
                <div className="p-1.5 bg-white border border-gray-300 rounded text-center">
                  <QrCode className="w-12 h-12 text-[#123A78]" />
                  <span className="text-[7px] font-mono block">NIC QR VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Certified 7/12 copy downloaded.');
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B7A3B] hover:bg-[#096330] rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Certified PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
