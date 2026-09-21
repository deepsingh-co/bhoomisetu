import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  FileText,
  Camera,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CitizenActiveTab, CitizenTimelineEvent } from '../../types/citizen';

interface CitizenTimelineViewProps {
  parcelId?: string;
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const CitizenTimelineView: React.FC<CitizenTimelineViewProps> = ({
  parcelId = 'IN-MH-PUN-HAV-2024-00142-A',
  onNavigate,
  language,
}) => {
  const [timelineData, setTimelineData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [activeEventSnapshot, setActiveEventSnapshot] = useState<CitizenTimelineEvent | null>(null);

  useEffect(() => {
    fetch(`/api/citizen/timeline/${parcelId}`)
      .then((res) => res.json())
      .then((data) => {
        setTimelineData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [parcelId]);

  if (loading || !timelineData) {
    return (
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-4 border-[#123A78] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-700">Loading 70-Year Ownership Chain...</p>
      </div>
    );
  }

  let events: CitizenTimelineEvent[] = timelineData.events || [];
  if (selectedCategory !== 'ALL') {
    events = events.filter((e) => e.category === selectedCategory);
  }
  if (selectedYear !== 'ALL') {
    events = events.filter((e) => e.year === selectedYear);
  }

  const years = [1954, 1982, 2012, 2021, 2024, 2026];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-[#123A78]/10 text-[#123A78] text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            70-Year Unbroken Chain of Title
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            Citizen AI Land Timeline (1954 – 2026)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Survey No. {timelineData.surveyNumber} ({timelineData.village}, Pune) | Complete record of settlements, mutations, and drone surveys
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('trust', timelineData.parcelUid)}
            className="bg-white border border-[#D8DEE8] hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            Trust Dossier
          </button>
          <button
            onClick={() =>
              alert('Downloading official 70-Year Historical Ownership Chain (PDF) with NIC seals.')
            }
            className="bg-[#123A78] hover:bg-[#0e2c5d] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download History Report
          </button>
        </div>
      </div>

      {/* Year & Category Filter Bar */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-4 shadow-xs space-y-3">
        {/* Year Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-gray-500 font-semibold mr-1">Filter by Year:</span>
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              selectedYear === 'ALL'
                ? 'bg-[#123A78] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Years (1954–2026)
          </button>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                selectedYear === yr
                  ? 'bg-[#123A78] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-gray-100">
          <span className="text-gray-500 font-semibold mr-1">Event Type:</span>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'OWNERSHIP', label: 'Ownership & Sale Deed' },
            { id: 'MUTATION', label: 'Heirship Ferfars' },
            { id: 'INSPECTION', label: 'Drone SVAMITVA Flight' },
            { id: 'SATELLITE_CHANGE', label: 'Satellite Verification' },
            { id: 'VERIFICATION', label: 'AI Trust Sanction' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-100 text-blue-900 font-bold border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Events Stack */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-6 ml-3 sm:ml-4">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#123A78] shadow-xs group-hover:scale-125 transition-transform" />

            {/* Event Box */}
            <div className="bg-white border border-[#D8DEE8] rounded-xl p-4.5 hover:border-[#123A78] hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#123A78]">
                    {event.year}
                  </span>
                  <span className="text-xs text-gray-500">• {event.date}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#123A78] border border-blue-200">
                    {event.category}
                  </span>
                </div>

                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                  {event.status}
                </span>
              </div>

              <h4 className="text-base font-bold text-gray-900">
                {event.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {event.description}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Recorded By: <strong className="text-gray-700">{event.actor}</strong></span>

                {event.hasMapSnapshot && (
                  <button
                    onClick={() => setActiveEventSnapshot(event)}
                    className="text-xs font-semibold text-[#123A78] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> View Map Snapshot
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Snapshot Visualizer Modal */}
      {activeEventSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#123A78]" />
                {activeEventSnapshot.year} Cadastral Map Snapshot
              </h3>
              <button
                onClick={() => setActiveEventSnapshot(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Simulated Map Visual */}
              <div className="h-48 bg-slate-800 rounded-lg p-3 text-white flex flex-col justify-between relative overflow-hidden border border-slate-700">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>HISTORICAL LAYER: {activeEventSnapshot.year}</span>
                  <span className="text-emerald-400">GSD: 0.05m RTK</span>
                </div>

                <div className="border border-dashed border-yellow-400 p-4 rounded bg-yellow-400/10 text-center">
                  <span className="font-bold text-sm block">
                    Survey Parcel 142/1 ({activeEventSnapshot.title})
                  </span>
                  <span className="text-xs text-gray-300">
                    Cadastral boundary pegs matching Bombay Land Revenue Settlement
                  </span>
                </div>

                <div className="text-[10px] text-gray-400 flex justify-between">
                  <span>Coordinates: 18.5793° N, 73.9812° E</span>
                  <span>Survey of India Anchored</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {activeEventSnapshot.description}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveEventSnapshot(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123A78] hover:bg-[#0e2c5d] rounded-lg"
              >
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
