import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Edit3,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe2,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { CitizenActiveTab } from '../../types/citizen';

interface VoiceRuralSearchViewProps {
  onNavigate: (tab: CitizenActiveTab, parcelId?: string) => void;
  language: 'en' | 'hi' | 'mr';
}

export const VoiceRuralSearchView: React.FC<VoiceRuralSearchViewProps> = ({
  onNavigate,
  language: initialLang,
}) => {
  const [voiceLang, setVoiceLang] = useState<'hi' | 'mr' | 'en'>(
    initialLang === 'mr' ? 'mr' : initialLang === 'hi' ? 'hi' : 'hi'
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [structuredFilters, setStructuredFilters] = useState<any>(null);
  const [voiceResults, setVoiceResults] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleVoiceQueries = [
    {
      lang: 'hi',
      text: 'मेरे पिताजी राम सिंह की जमीन दिखाओ वाघोली में',
      label: 'पिताजी की जमीन (Wagholi)',
    },
    {
      lang: 'hi',
      text: 'खसरा नंबर 142 का सत्यापित सातबारा दिखाओ',
      label: 'खसरा 142 सातबारा',
    },
    {
      lang: 'mr',
      text: 'वाघोली मधील गट क्रमांक १४२ चा सातबारा दाखवा',
      label: 'गट क्र. १४२ वाघोली (मराठी)',
    },
    {
      lang: 'hi',
      text: '2 हेक्टेयर से ज्यादा सत्यापित कृषि भूमि दिखाओ',
      label: '2 हेक्टरहून मोठी शेती',
    },
    {
      lang: 'en',
      text: 'Show verified agricultural land in Wagholi Pune',
      label: 'Verified land in Wagholi',
    },
  ];

  const handleSimulateVoice = (queryText: string) => {
    setIsListening(true);
    setTranscript('');
    setStructuredFilters(null);
    setVoiceResults([]);

    // Simulate speech recognition typing effect
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= queryText.length) {
        setTranscript(queryText.slice(0, idx));
        idx += 3;
      } else {
        clearInterval(interval);
        setIsListening(false);
        submitVoiceQuery(queryText);
      }
    }, 45);
  };

  const submitVoiceQuery = (queryText: string) => {
    setIsProcessing(true);
    fetch('/api/citizen/voice-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: queryText, language: voiceLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStructuredFilters(data.structuredFilters);
        setVoiceResults(data.results || []);
        setIsProcessing(false);
      })
      .catch(() => setIsProcessing(false));
  };

  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      // Pick a suitable default query for active language
      const defaultQuery =
        voiceLang === 'mr'
          ? 'वाघोली मधील गट क्रमांक १४२ चा सातबारा दाखवा'
          : voiceLang === 'hi'
          ? 'मेरे पिताजी राम सिंह की जमीन दिखाओ वाघोली में'
          : 'Show verified agricultural land in Wagholi Pune';
      handleSimulateVoice(defaultQuery);
    }
  };

  // Text-to-speech audio reader simulation for rural accessibility
  const handleReadAloud = (textToRead: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = voiceLang === 'hi' ? 'hi-IN' : voiceLang === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.9; // clear pacing for elderly farmers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs">
        <div className="max-w-3xl">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Rural Accessibility AI
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            Voice-Based Rural Land Record Search
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Speak naturally in your native language. Our AI converts spoken words into official cadastral survey numbers, owner names, and verified land records.
          </p>
        </div>

        {/* Language Selection Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-gray-200 pb-3">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" /> Language:
          </span>
          <button
            onClick={() => setVoiceLang('hi')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              voiceLang === 'hi'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setVoiceLang('mr')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              voiceLang === 'mr'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            मराठी (Marathi)
          </button>
          <button
            onClick={() => setVoiceLang('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              voiceLang === 'en'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
        </div>

        {/* Large Central Accessible Microphone Interaction Box */}
        <div className="mt-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-linear-to-b from-blue-50/50 to-amber-50/30 rounded-2xl border border-blue-100 text-center">
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            )}
            <button
              onClick={handleToggleListening}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-red-600 text-white shadow-red-200 ring-8 ring-red-100 animate-pulse'
                  : 'bg-[#123A78] hover:bg-[#0e2c5d] text-white shadow-blue-200 ring-4 ring-blue-50'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="mt-4">
            <span className="text-sm font-bold text-gray-900 block">
              {isListening
                ? 'Listening... Speak now (आवाज सुन रहे हैं)'
                : 'Tap Microphone to Speak (माइक दबाकर बोलें)'}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 block">
              Say e.g. "Survey number 142 Wagholi" or "Ram Singh ki zameen"
            </span>
          </div>

          {/* Quick Voice Chips */}
          <div className="mt-5 max-w-xl w-full">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              Or tap a sample rural voice query:
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {sampleVoiceQueries
                .filter((q) => q.lang === voiceLang || voiceLang === 'en')
                .map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulateVoice(sq.text)}
                    className="bg-white border border-[#D8DEE8] hover:border-[#123A78] text-gray-800 text-xs px-3 py-1.5 rounded-full shadow-2xs hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                  >
                    <Mic className="w-3 h-3 text-[#0B7A3B]" />
                    {sq.label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Live Transcript & Editor */}
        {transcript && (
          <div className="mt-5 p-4 bg-white border border-[#D8DEE8] rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Spoken Transcript (बोला गया वाक्य):
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleReadAloud(transcript)
                  }
                  className={`text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                    isSpeaking
                      ? 'bg-amber-100 text-amber-900 animate-pulse'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#0B7A3B]" />
                  {isSpeaking ? 'Speaking...' : 'Read Aloud (सुनें)'}
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-[#123A78] hover:underline flex items-center gap-1 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? 'Done' : 'Edit Text'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => submitVoiceQuery(transcript)}
                  className="bg-[#123A78] text-white px-3 py-1.5 rounded text-xs font-semibold"
                >
                  Search
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "{transcript}"
              </p>
            )}

            {/* AI Intent Translation Output */}
            {structuredFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  AI Entity & Intent Extraction (पहचाने गए विवरण):
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {structuredFilters.surveyNumber && (
                    <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md font-semibold">
                      Survey / Gat No: {structuredFilters.surveyNumber}
                    </span>
                  )}
                  {structuredFilters.village && (
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md font-semibold">
                      Village: {structuredFilters.village}
                    </span>
                  )}
                  {structuredFilters.owner && (
                    <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-md font-semibold">
                      Owner Match: {structuredFilters.owner}
                    </span>
                  )}
                  {structuredFilters.minArea && (
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-semibold">
                      Min Area: {structuredFilters.minArea} Ha
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Search Results */}
      {voiceResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              Matched Land Records ({voiceResults.length})
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              High Confidence Match
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {voiceResults.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#123A78] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Survey No. {p.surveyNumber}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 mt-1">
                        {p.maskedOwnerName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {p.village}, {p.taluka} | Area: {p.areaHectares} Ha
                      </p>
                    </div>

                    <span className="bg-[#0B7A3B] text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {p.trustScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleReadAloud(
                        `Survey Number ${p.surveyNumber}, Village ${p.village}. Owner name ${p.ownerName}. Trust score ${p.trustScore} percent.`
                      )
                    }
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    title="Speak details"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#0B7A3B]" /> Listen
                  </button>

                  <button
                    onClick={() => onNavigate('parcel-page', p.parcelUid)}
                    className="text-xs bg-[#123A78] text-white px-3 py-1.5 rounded-md font-semibold hover:bg-[#0e2c5d] flex items-center gap-1"
                  >
                    Open Record <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
