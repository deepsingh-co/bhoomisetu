import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { CitizenActiveTab, CitizenParcel } from '../../types/citizen';

interface UniversalLandSearchViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const UniversalLandSearchView: React.FC<UniversalLandSearchViewProps> = ({
  onNavigate,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedTaluka, setSelectedTaluka] = useState('ALL');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedLandType, setSelectedLandType] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');

  const [results, setResults] = useState<CitizenParcel[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedParcelForPreview, setSelectedParcelForPreview] = useState<CitizenParcel | null>(null);

  const executeSearch = (q = searchQuery) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('query', q);
    if (searchType !== 'ALL') params.set('type', searchType);
    if (selectedDistrict !== 'ALL') params.set('district', selectedDistrict);
    if (selectedTaluka !== 'ALL') params.set('taluka', selectedTaluka);
    if (selectedVillage !== 'ALL') params.set('village', selectedVillage);
    if (selectedLandType !== 'ALL') params.set('landType', selectedLandType);
    if (verifiedOnly) params.set('verifiedOnly', 'true');
    if (minArea) params.set('minArea', minArea);
    if (maxArea) params.set('maxArea', maxArea);

    fetch(`/api/citizen/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        if (data.recentSearches) setRecentSearches(data.recentSearches);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    executeSearch('');
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSearchType('ALL');
    setSelectedDistrict('ALL');
    setSelectedTaluka('ALL');
    setSelectedVillage('ALL');
    setSelectedLandType('ALL');
    setVerifiedOnly(false);
    setMinArea('');
    setMaxArea('');
    executeSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs">
        <div className="max-w-3xl">
          <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Universal Land Search Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            Search Land Records & Verified 7/12 Documents
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Search 3.4 crore verified cadastral parcels across Maharashtra and India using Survey Number, Khata, Khasra, Owner Name, or Natural Language.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                placeholder="Enter Survey No (e.g. 142), Owner Name (e.g. Patil), Khata No, or 'Verified land in Wagholi'..."
                className="w-full pl-10 pr-4 py-3 border border-[#D8DEE8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#123A78] focus:border-transparent"
              />
            </div>

            <button
              onClick={() => executeSearch()}
              disabled={loading}
              className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search Records
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 ${
                showFilters || verifiedOnly || selectedDistrict !== 'ALL'
                  ? 'bg-blue-50 border-[#123A78] text-[#123A78]'
                  : 'border-[#D8DEE8] text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters {(verifiedOnly || selectedDistrict !== 'ALL') && '•'}
            </button>
          </div>

          {/* Quick Search Method Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            <span className="text-gray-500 font-medium mr-1">Search by:</span>
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'SURVEY', label: 'Survey / Gat No' },
              { id: 'KHATA', label: 'Khata Number' },
              { id: 'OWNER', label: 'Owner Name' },
              { id: 'VILLAGE', label: 'Village / Taluka' },
              { id: 'NATURAL', label: 'Natural Language' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSearchType(method.id);
                  executeSearch();
                }}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  searchType === method.id
                    ? 'bg-[#123A78] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#D8DEE8] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border border-[#D8DEE8] rounded-md bg-white focus:ring-1 focus:ring-[#123A78]"
              >
                <option value="ALL">All Districts</option>
                <option value="Pune">Pune</option>
                <option value="Satara">Satara</option>
                <option value="Ahmednagar">Ahmednagar</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Taluka</label>
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className="w-full p-2 border border-[#D8DEE8] rounded-md bg-white focus:ring-1 focus:ring-[#123A78]"
              >
                <option value="ALL">All Talukas</option>
                <option value="Haveli">Haveli</option>
                <option value="Baramati">Baramati</option>
                <option value="Shirur">Shirur</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Village</label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full p-2 border border-[#D8DEE8] rounded-md bg-white focus:ring-1 focus:ring-[#123A78]"
              >
                <option value="ALL">All Villages</option>
                <option value="Wagholi">Wagholi</option>
                <option value="Malegaon Budruk">Malegaon Budruk</option>
                <option value="Bavdhan Khurd">Bavdhan Khurd</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Land Classification</label>
              <select
                value={selectedLandType}
                onChange={(e) => setSelectedLandType(e.target.value)}
                className="w-full p-2 border border-[#D8DEE8] rounded-md bg-white focus:ring-1 focus:ring-[#123A78]"
              >
                <option value="ALL">All Classifications</option>
                <option value="Jirayat">Jirayat (Dry Agricultural)</option>
                <option value="Bagayat">Bagayat (Irrigated)</option>
                <option value="Agricultural">Agricultural Farmland</option>
                <option value="Non-Agricultural">Non-Agricultural (NA)</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-4 flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-[#0B7A3B] focus:ring-[#0B7A3B] w-4 h-4"
                />
                <span className="font-medium text-gray-800">
                  Show Verified Records Only (Trust Score &gt; 85%)
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-900 font-medium px-3 py-1 text-xs cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => executeSearch()}
                  className="bg-[#123A78] text-white px-4 py-1.5 rounded-md font-medium text-xs hover:bg-[#0e2c5d] cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {loading ? 'Searching Records...' : `${results.length} Land Records Found`}
          </h3>
          <p className="text-xs text-gray-500">
            Official Cadastral Records with cryptographic trust badges
          </p>
        </div>

        {/* Quick Voice Search Prompt */}
        <button
          onClick={() => onNavigate('voice')}
          className="text-xs font-semibold text-[#0B7A3B] hover:underline flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg"
        >
          <Sparkles className="w-3.5 h-3.5" /> Speak query in Hindi/Marathi
        </button>
      </div>

      {/* Results Grid */}
      {results.length === 0 && !loading ? (
        <div className="bg-white border border-[#D8DEE8] rounded-xl p-8 text-center">
          <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-800">No matching land records found</h4>
          <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
            Try searching with just the survey number (e.g. 142), village name (e.g. Wagholi), or clear active filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-[#123A78] text-white px-4 py-2 rounded-lg text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white border border-[#D8DEE8] rounded-xl p-4.5 hover:border-[#123A78] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#123A78] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Survey No. {parcel.surveyNumber}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Khata: {parcel.khataNumber || `KH-${parcel.surveyNumber}`}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mt-1">
                      {parcel.maskedOwnerName}
                    </h4>
                  </div>

                  {/* Trust Badge */}
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        parcel.trustScore >= 85
                          ? 'bg-[#0B7A3B] text-white'
                          : 'bg-[#F39C12] text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {parcel.trustScore}/100 Trust
                    </span>
                  </div>
                </div>

                {/* Location & Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">VILLAGE / TALUKA</span>
                    <span className="font-semibold text-gray-800">
                      {parcel.village}, {parcel.taluka}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">TOTAL AREA</span>
                    <span className="font-semibold text-gray-800">
                      {parcel.areaHectares} Ha ({parcel.areaGunthas} Gunthas)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">LAND CLASSIFICATION</span>
                    <span className="font-semibold text-gray-800">{parcel.landType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">ULPIN PARCEL UID</span>
                    <span className="font-mono text-[10px] text-gray-800 truncate block">
                      {parcel.parcelUid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('trust', parcel.parcelUid)}
                  className="text-xs font-bold text-[#123A78] hover:underline flex items-center gap-1"
                >
                  Trust Breakdown <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('timeline', parcel.parcelUid)}
                    className="text-xs border border-gray-300 hover:bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                  >
                    70-Yr History
                  </button>
                  <button
                    onClick={() => onNavigate('parcel-page', parcel.parcelUid)}
                    className="text-xs bg-[#123A78] hover:bg-[#0e2c5d] text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                  >
                    Open Record
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
