import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Edit3,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe2,
  Layers,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  SearchX,
  UserX,
  RotateCcw,
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
  const [typedInput, setTypedInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [structuredFilters, setStructuredFilters] = useState<any>(null);
  const [voiceResults, setVoiceResults] = useState<any[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [speechApiSupported, setSpeechApiSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastFinalTranscriptRef = useRef<string>('');

  // Check Web Speech API availability on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechApiSupported(false);
    }
  }, []);

  // Cleanup speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sampleVoiceQueries = [
    {
      lang: 'hi',
      text: 'मेरे पिताजी राम सिंह की जमीन दिखाओ वाघोली में',
      label: 'राम सिंह (Ram Singh)',
      category: 'match',
    },
    {
      lang: 'mr',
      text: 'वाघोली मधील गट क्रमांक १४२ चा सातबारा दाखवा',
      label: 'गट क्र. १४२ वाघोली (मराठी)',
      category: 'match',
    },
    {
      lang: 'hi',
      text: 'रमेशवर किसन पाटील की जमीन दिखाओ',
      label: 'रमेशवर पाटील (Rameshwar Patil)',
      category: 'match',
    },
    {
      lang: 'en',
      text: 'Show verified agricultural land in Wagholi Pune',
      label: 'Verified land in Wagholi',
      category: 'match',
    },
    {
      lang: 'hi',
      text: 'संजय शिंदे की बारामती की जमीन दिखाओ',
      label: 'संजय शिंदे (Sanjay Shinde)',
      category: 'match',
    },
    {
      lang: 'hi',
      text: 'सुनील शर्मा के नाम का सातबारा दिखाओ',
      label: 'सुनील शर्मा (No Data Test)',
      category: 'nomatch',
    },
    {
      lang: 'en',
      text: 'Search for John Anderson in Pune district',
      label: 'John Anderson (No Data Test)',
      category: 'nomatch',
    },
  ];

  // Text-to-speech audio reader with fallback
  const handleReadAloud = (textToRead: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = voiceLang === 'hi' ? 'hi-IN' : voiceLang === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.95; // clear pacing for accessibility
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2500);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Submit voice search query to server
  const submitVoiceQuery = (queryText: string) => {
    const cleanText = queryText.trim();
    if (!cleanText) return;

    setIsProcessing(true);
    setStatusNotice(null);
    stopSpeaking();

    fetch('/api/citizen/voice-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: cleanText, language: voiceLang }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStructuredFilters(data.structuredFilters);
        const results = data.results || [];
        setVoiceResults(results);
        setIsProcessing(false);
        setHasSearched(true);

        if (results.length > 0) {
          setNoResultsFound(false);
          // Speak results confirmation
          const speechMsg =
            voiceLang === 'hi'
              ? `हमें इस नाम से ${results.length} भूमि रिकॉर्ड मिले हैं।`
              : voiceLang === 'mr'
              ? `आम्हाला या नावाने ${results.length} जमीन अभिलेख सापडले आहेत.`
              : `Found ${results.length} land records matching your voice search.`;
          handleReadAloud(speechMsg);
        } else {
          setNoResultsFound(true);
          // Speak exact required message: "sorry we dont find any data from this name"
          const apologyVoice =
            voiceLang === 'hi'
              ? `क्षमा करें, इस नाम से कोई डेटा नहीं मिला। Sorry, we don't find any data from this name.`
              : voiceLang === 'mr'
              ? `क्षमस्व, या नावाने कोणतीही माहिती मिळाली नाही. Sorry, we don't find any data from this name.`
              : `Sorry, we don't find any data from this name.`;
          handleReadAloud(apologyVoice);
        }
      })
      .catch((err) => {
        console.error('Voice search failed:', err);
        setIsProcessing(false);
        setHasSearched(true);
        setNoResultsFound(true);
        handleReadAloud("Sorry, we don't find any data from this name.");
      });
  };

  // Real Speech Recognition handler
  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusNotice(
        'Web Speech API is not supported in this browser. You can type any name in the input box below or choose a sample voice query.'
      );
      // Fallback: Pick a sample query to demonstrate
      handleSimulateVoice(
        voiceLang === 'mr'
          ? 'वाघोली मधील गट क्रमांक १४२ चा सातबारा दाखवा'
          : voiceLang === 'hi'
          ? 'मेरे पिताजी राम सिंह की जमीन दिखाओ वाघोली में'
          : 'Show verified agricultural land in Wagholi Pune'
      );
      return;
    }

    try {
      stopSpeaking();
      setStatusNotice(null);
      setTranscript('');
      lastFinalTranscriptRef.current = '';
      setVoiceResults([]);
      setHasSearched(false);
      setNoResultsFound(false);

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Match chosen language
      recognition.lang = voiceLang === 'hi' ? 'hi-IN' : voiceLang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusNotice('Microphone active. Speak naturally now...');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            interimTranscript += trans;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);
        setTypedInput(currentText);

        if (finalTranscript) {
          lastFinalTranscriptRef.current = finalTranscript;
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusNotice(
            'Microphone access was denied. Please allow microphone permission in your browser or type your query in the search bar below.'
          );
        } else if (event.error === 'no-speech') {
          setStatusNotice('No speech was detected. Please try clicking the microphone again and speaking clearly.');
        } else {
          setStatusNotice(`Audio recognition notice: ${event.error}. You can also type any name or query.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const textToQuery = lastFinalTranscriptRef.current || transcript;
        if (textToQuery && textToQuery.trim().length > 1) {
          submitVoiceQuery(textToQuery.trim());
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('Error starting SpeechRecognition:', err);
      setIsListening(false);
      setStatusNotice('Could not start microphone. You can type any name or query directly below.');
    }
  };

  // Fallback simulator for demo / test queries
  const handleSimulateVoice = (queryText: string) => {
    stopSpeaking();
    setIsListening(true);
    setTranscript('');
    setTypedInput(queryText);
    setStructuredFilters(null);
    setVoiceResults([]);
    setHasSearched(false);
    setNoResultsFound(false);
    setStatusNotice('Simulating voice input stream...');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= queryText.length) {
        setTranscript(queryText.slice(0, idx));
        idx += 3;
      } else {
        clearInterval(interval);
        setIsListening(false);
        setStatusNotice(null);
        submitVoiceQuery(queryText);
      }
    }, 35);
  };

  const handleManualSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = typedInput.trim() || transcript.trim();
    if (q) {
      setTranscript(q);
      submitVoiceQuery(q);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE8] rounded-xl p-5 shadow-xs">
        <div className="max-w-3xl">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Rural Accessibility AI & Voice Recognition
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            Voice-Based Rural Land Record Search
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Speak naturally in your native language or any name. The system recognizes your voice input, extracts cadastral records, and audibly reports results or informs you if no data is found.
          </p>
        </div>

        {/* Language Selection Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-gray-200 pb-3">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" /> Language:
          </span>
          <button
            onClick={() => {
              setVoiceLang('hi');
              stopSpeaking();
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              voiceLang === 'hi'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => {
              setVoiceLang('mr');
              stopSpeaking();
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              voiceLang === 'mr'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            मराठी (Marathi)
          </button>
          <button
            onClick={() => {
              setVoiceLang('en');
              stopSpeaking();
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              voiceLang === 'en'
                ? 'bg-[#123A78] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
        </div>

        {/* Status Notice if microphone permission or browser restriction */}
        {statusNotice && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{statusNotice}</p>
            </div>
          </div>
        )}

        {/* Central Accessible Microphone Interaction Box */}
        <div className="mt-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-linear-to-b from-blue-50/60 via-amber-50/20 to-white rounded-2xl border border-blue-100 text-center">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <div className="absolute -inset-3 rounded-full bg-red-500/10 animate-pulse" />
              </>
            )}
            <button
              onClick={handleToggleListening}
              disabled={isProcessing}
              title={isListening ? 'Click to Stop Listening' : 'Click to Speak'}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-red-600 text-white shadow-red-300 ring-8 ring-red-100 animate-pulse'
                  : isProcessing
                  ? 'bg-amber-600 text-white shadow-amber-200 ring-4 ring-amber-50'
                  : 'bg-[#123A78] hover:bg-[#0e2c5d] text-white shadow-blue-200 ring-4 ring-blue-50'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-bounce" />
              ) : isProcessing ? (
                <RefreshCw className="w-10 h-10 animate-spin" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="mt-4">
            <span className="text-base font-bold text-gray-900 block">
              {isListening
                ? 'Listening to your voice... Speak now (आवाज सुन रहे हैं)'
                : isProcessing
                ? 'Analyzing voice query & searching database...'
                : 'Tap Microphone & Speak Any Name (माइक दबाकर बोलें)'}
            </span>
            <span className="text-xs text-gray-600 mt-1 block">
              Recognizes any voice input (e.g. "Ram Singh ki zameen", "Survey number 142 Wagholi", or any person's name)
            </span>
          </div>

          {/* Fallback Text Input & Dictation Box */}
          <div className="mt-5 w-full max-w-xl">
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Or type/edit any voice command or name here..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#123A78]"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !typedInput.trim()}
                className="bg-[#123A78] hover:bg-[#0e2c5d] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Search
              </button>
            </form>
          </div>

          {/* Quick Voice Prompt Chips */}
          <div className="mt-5 max-w-2xl w-full">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              Or tap a sample query to test recognition:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleVoiceQueries
                .filter((q) => q.lang === voiceLang || voiceLang === 'en' || q.category === 'nomatch')
                .map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulateVoice(sq.text)}
                    className={`text-xs px-3 py-1.5 rounded-full shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer border ${
                      sq.category === 'nomatch'
                        ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                        : 'bg-white border-[#D8DEE8] hover:border-[#123A78] text-gray-800 hover:bg-blue-50'
                    }`}
                  >
                    <Mic className={`w-3 h-3 ${sq.category === 'nomatch' ? 'text-rose-600' : 'text-[#0B7A3B]'}`} />
                    {sq.label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Live Transcript & Intent Output */}
        {transcript && (
          <div className="mt-5 p-4 bg-white border border-[#D8DEE8] rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Spoken Voice Command (बोला गया वाक्य):
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      handleReadAloud(transcript);
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-800" /> Stop Speaking
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#0B7A3B]" /> Read Aloud (सुनें)
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-[#123A78] hover:underline flex items-center gap-1 font-medium cursor-pointer"
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
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    setTypedInput(e.target.value);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#123A78]"
                />
                <button
                  onClick={() => {
                    setIsEditing(false);
                    submitVoiceQuery(transcript);
                  }}
                  className="bg-[#123A78] text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
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

      {/* Case 1: NO RESULTS FOUND APOLOGY CARD */}
      {hasSearched && noResultsFound && (
        <div className="bg-white border-2 border-rose-200 rounded-xl p-6 shadow-sm text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <SearchX className="w-7 h-7" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Sorry, we don't find any data from this name
          </h3>

          <p className="text-sm text-rose-700 font-medium mt-1">
            {voiceLang === 'mr'
              ? 'क्षमस्व, या नावाने कोणतीही माहिती मिळाली नाही.'
              : 'क्षमा करें, इस नाम से कोई डेटा नहीं मिला।'}
          </p>

          <p className="text-xs text-gray-600 mt-2 max-w-lg mx-auto">
            No land records, 7/12 extracts, or cadastral holdings were found matching "{transcript}".
          </p>

          <div className="mt-4 inline-flex items-center gap-2">
            <button
              onClick={() =>
                handleReadAloud(
                  voiceLang === 'hi'
                    ? "क्षमा करें, इस नाम से कोई डेटा नहीं मिला। Sorry, we don't find any data from this name."
                    : voiceLang === 'mr'
                    ? "क्षमस्व, या नावाने कोणतीही माहिती मिळाली नाही. Sorry, we don't find any data from this name."
                    : "Sorry, we don't find any data from this name."
                )
              }
              className="text-xs bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              Listen to Announcement (पुनः सुनें)
            </button>

            <button
              onClick={() => {
                setTranscript('');
                setTypedInput('');
                setNoResultsFound(false);
                setHasSearched(false);
                stopSpeaking();
              }}
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear & Try Again
            </button>
          </div>

          {/* Suggestions for user */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-left max-w-xl mx-auto">
            <span className="text-xs font-bold text-gray-700 block mb-2">
              💡 Suggestions to find land records:
            </span>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-4">
              <li>Check the spelling or try speaking the full registered name of the titleholder.</li>
              <li>Try mentioning the Survey/Gat Number (e.g. 142/A, 214, 305/C, 419).</li>
              <li>Or tap one of the active registered landholders in this district below:</li>
            </ul>

            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Rameshwar Kisan Patil', survey: '142/A' },
                { name: 'Ram Singh Thakur', survey: '214' },
                { name: 'Sanjay Jagannath Shinde', survey: '88/B' },
                { name: 'Dattatraya Balwant Deshmukh', survey: '305/C' },
                { name: 'Vitthal Raoji Kadam', survey: '419' },
              ].map((holder, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateVoice(`${holder.name} survey ${holder.survey}`)}
                  className="text-xs bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer"
                >
                  {holder.name} (Gat {holder.survey})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Case 2: RESULTS FOUND CARDS */}
      {hasSearched && !noResultsFound && voiceResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Matched Land Records ({voiceResults.length})
              </h3>
              <p className="text-xs text-gray-500">
                Cadastral parcels retrieved for voice query "{transcript}"
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence Match
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
                        {p.ownerName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {p.village}, {p.taluka} | Area: {p.areaHectares} Ha
                      </p>
                      <span className="inline-block mt-1 text-[11px] text-gray-500">
                        UID: {p.parcelUid}
                      </span>
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
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer font-medium"
                    title="Speak details"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#0B7A3B]" /> Listen Aloud
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('map', p.parcelUid)}
                      className="text-xs bg-[#0B7A3B] text-white px-2.5 py-1.5 rounded-md font-semibold hover:bg-[#086330] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Show GIS boundary with corners and real satellite data"
                    >
                      <Layers className="w-3 h-3" /> GIS & Satellite
                    </button>

                    <button
                      onClick={() => onNavigate('parcel-page', p.parcelUid)}
                      className="text-xs bg-[#123A78] text-white px-3 py-1.5 rounded-md font-semibold hover:bg-[#0e2c5d] flex items-center gap-1 cursor-pointer"
                    >
                      Open Record <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

