import React from 'react';
import { LandParcelDetail } from '../types/landRecords';
import { AshokaEmblem } from './Emblems';
import { QrCode, Shield, CheckCircle2, Compass, Award, FileText } from 'lucide-react';

interface ScannedLandRecordDocumentProps {
  parcel: LandParcelDetail;
  mode?: '712-ror' | 'cadastral-map' | 'mutation-register';
  className?: string;
}

export const ScannedLandRecordDocument: React.FC<ScannedLandRecordDocumentProps> = ({
  parcel,
  mode = '712-ror',
  className = '',
}) => {
  if (mode === 'cadastral-map') {
    return (
      <div
        className={`w-full bg-[#FAF7EE] text-[#1C2733] border-2 border-[#D3CBB8] rounded-sm p-6 shadow-md relative overflow-hidden select-none font-serif ${className}`}
        style={{
          backgroundImage:
            'radial-gradient(#E8DFCA 1px, transparent 1px), linear-gradient(to right, #F5EFE0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Cadastral Sheet Header */}
        <div className="border-b-2 border-[#5C4D32] pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AshokaEmblem size={44} />
            <div>
              <div className="text-[10px] tracking-widest font-bold uppercase text-[#5C4D32]">
                जमाबंदी आयुक्त आणि संचालक भूमी अभिलेख (महाराष्ट्र राज्य)
              </div>
              <h2 className="text-lg font-black text-[#2A2114] tracking-tight">
                भू-नकाशा (BHU-NAKSHA) • अधिकृत कॅडस्ट्रल गाव नकाशा
              </h2>
              <div className="text-xs font-semibold text-[#5C4D32]">
                गाव: {parcel.village} | तालुका: {parcel.taluka} | जिल्हा: {parcel.district} | पत्रक क्र. ०४
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-gray-600">
              ULPIN: {parcel.parcelUid}
            </div>
            <div className="text-xs font-bold text-[#123A78]">
              प्रमाण: १ सेमी = २० मीटर (१:२०००)
            </div>
          </div>
        </div>

        {/* Vintage Cadastral Map Visual Canvas */}
        <div className="relative w-full h-[460px] bg-[#F4EEDC] border-2 border-[#8A795D] rounded-xs p-4 flex items-center justify-center overflow-hidden">
          {/* North Pointer Compass */}
          <div className="absolute top-4 right-4 bg-white/80 border border-gray-400 p-2 rounded text-center shadow-xs">
            <Compass className="w-7 h-7 text-[#123A78] mx-auto animate-pulse" />
            <span className="text-[10px] font-bold text-[#123A78] block">उत्तर (N)</span>
          </div>

          {/* SVG Cadastral Map Drawing */}
          <svg viewBox="0 0 600 400" className="w-full h-full max-h-[440px]">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2D6BC" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#cadGrid)" />

            {/* Village Road Line */}
            <path
              d="M 20 40 Q 200 80 580 60"
              fill="none"
              stroke="#B58D54"
              strokeWidth="10"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
            <text x="240" y="55" fill="#6E4F23" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              सार्वजनिक डांबरी रस्ता (Village PWD Road) ➔
            </text>

            {/* Irrigation Canal Line */}
            <path
              d="M 40 370 Q 260 320 560 350"
              fill="none"
              stroke="#388E3C"
              strokeWidth="5"
              strokeOpacity="0.7"
            />
            <text x="280" y="342" fill="#1B5E20" fontSize="10" fontWeight="bold">
              कालवा पाटबंधारे (Irrigation Canal)
            </text>

            {/* Surrounding Survey Plots */}
            {/* North Plot: Gat 141 */}
            <polygon
              points="120,80 340,90 310,170 90,160"
              fill="#EFE8D6"
              stroke="#68573C"
              strokeWidth="2"
            />
            <text x="180" y="130" fill="#4A3B24" fontSize="13" fontWeight="bold">
              गट क्र. १४१
            </text>
            <text x="180" y="145" fill="#75654B" fontSize="9">
              क्षेत्र: २.१० हे.
            </text>

            {/* West Plot: Gat 140 */}
            <polygon
              points="50,170 190,175 160,310 30,290"
              fill="#EFE8D6"
              stroke="#68573C"
              strokeWidth="2"
            />
            <text x="80" y="240" fill="#4A3B24" fontSize="13" fontWeight="bold">
              गट क्र. १४०
            </text>

            {/* East Plot: Gat 142/B */}
            <polygon
              points="380,185 530,175 510,315 360,320"
              fill="#EFE8D6"
              stroke="#68573C"
              strokeWidth="2"
            />
            <text x="410" y="250" fill="#4A3B24" fontSize="13" fontWeight="bold">
              गट क्र. १४२/ब
            </text>
            <text x="410" y="265" fill="#75654B" fontSize="9">
              क्षेत्र: २.४५ हे.
            </text>

            {/* Active Verified Target Parcel: Gat 142/A */}
            <polygon
              points="190,175 380,185 360,320 160,310"
              fill="#FEF3C7"
              stroke="#123A78"
              strokeWidth="3.5"
              strokeDasharray="0"
            />
            {/* Inner Shading */}
            <polygon
              points="194,179 376,189 356,316 164,306"
              fill="#3B82F6"
              fillOpacity="0.08"
            />

            {/* Target Survey Text */}
            <rect x="215" y="210" width="125" height="60" fill="#FFFFFF" rx="4" stroke="#123A78" strokeWidth="1" />
            <text x="277" y="230" textAnchor="middle" fill="#123A78" fontSize="14" fontWeight="bold">
              गट क्र. {parcel.surveyNumber}
            </text>
            <text x="277" y="248" textAnchor="middle" fill="#0B7A3B" fontSize="11" fontWeight="bold">
              क्षेत्र: {parcel.landAreaHa} हेक्टर
            </text>
            <text x="277" y="262" textAnchor="middle" fill="#5A6878" fontSize="9">
              {parcel.ownerName}
            </text>

            {/* Cadastral Boundary Stones (मुनारे / Stones) */}
            <circle cx="190" cy="175" r="4.5" fill="#B42318" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="380" cy="185" r="4.5" fill="#B42318" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="360" cy="320" r="4.5" fill="#B42318" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="160" cy="310" r="4.5" fill="#B42318" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>

          {/* Official Surveyor Rubber Stamp */}
          <div className="absolute bottom-4 left-6 border-2 border-[#5B21B6] text-[#5B21B6] px-3 py-1.5 rounded-xs font-mono text-[10px] font-bold rotate-[-3deg] bg-purple-50/70 shadow-xs">
            <div>भूकर मापक (CADASTRA SURVEYOR)</div>
            <div>भूमी अभिलेख कार्यालय, हवेली उपविभाग</div>
            <div>डिजिटल स्वाक्षरीकृत नकाशा प्रत २०२६</div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#4A3B24]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#FEF3C7] border-2 border-[#123A78]"></span>
              <span className="font-bold">सध्याचा तपासणी गट ({parcel.surveyNumber})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]"></span>
              <span>अधिकृत सीमा मुनारे (Boundary Stones)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-1 bg-[#B58D54]"></span>
              <span>सार्वजनिक रस्ता</span>
            </span>
          </div>
          <span className="font-mono text-gray-500">NIC Bhu-Naksha Engine v4.0</span>
        </div>
      </div>
    );
  }

  // DEFAULT: Authentic Village Form 7/12 RoR (सातबारा उतारा)
  return (
    <div
      className={`w-full bg-[#FAF8F2] text-[#1C2733] border-2 border-[#D8CEB8] rounded-sm p-5 sm:p-7 shadow-lg relative overflow-hidden select-none font-serif ${className}`}
      style={{
        boxShadow: 'inset 0 0 40px rgba(180, 160, 120, 0.15), 0 10px 25px rgba(0,0,0,0.15)',
      }}
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035] rotate-[-25deg]">
        <span className="text-7xl font-black text-black uppercase tracking-widest text-center leading-tight">
          महाराष्ट्र शासन महसूल विभाग<br />MAHABHULEKH VERIFIED RECORD
        </span>
      </div>

      {/* Top Security Micro-print line */}
      <div className="text-[8px] font-mono tracking-widest text-[#7A6A50] text-center border-b border-[#D8CEB8] pb-1 uppercase">
        GOVERNMENT OF MAHARASHTRA • DEPARTMENT OF REVENUE &amp; LAND RECORDS • DIGITAL ROR CERTIFIED
      </div>

      {/* Official Government Header */}
      <div className="pt-3 pb-3 border-b-2 border-[#4A3B24] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AshokaEmblem size={52} />
          <div>
            <div className="text-[11px] font-bold text-[#6D5A3E] tracking-wider uppercase">
              महाराष्ट्र शासन महसूल विभाग
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#2A1F10] tracking-tight leading-snug">
              गाव नमुना सात (अधिकार अभिलेख पत्रक) व गाव नमुना १२ (पिकांची नोंदवही)
            </h1>
            <div className="text-[10px] text-[#7A6A50] italic">
              [महाराष्ट्र जमीन महसूल अधिकार अभिलेख आणि नोंदवह्या (तयार करणे व सुस्थितीत ठेवणे) नियम, १९७१ मधील नियम ३, ५, ६ आणि ७ अन्वये]
            </div>
          </div>
        </div>

        {/* Digital Verification QR & Barcode */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="p-1 bg-white border border-[#D8CEB8] rounded-xs shadow-2xs">
            <QrCode className="w-11 h-11 text-[#123A78]" />
          </div>
          <span className="text-[8px] font-mono text-[#7A6A50]">
            ROR/{parcel.district.slice(0, 3).toUpperCase()}/{parcel.mutationNumber}/2026
          </span>
        </div>
      </div>

      {/* Village / Jurisdiction Details Strip */}
      <div className="my-3 py-1.5 px-3 bg-[#F0EADB] border border-[#D8CEB8] rounded-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
        <div>
          <span className="text-[#6D5A3E] font-medium">गाव:</span>{' '}
          <strong className="text-[#1C2733] font-bold">{parcel.village}</strong>
        </div>
        <div>
          <span className="text-[#6D5A3E] font-medium">तालुका:</span>{' '}
          <strong className="text-[#1C2733] font-bold">{parcel.taluka}</strong>
        </div>
        <div>
          <span className="text-[#6D5A3E] font-medium">जिल्हा:</span>{' '}
          <strong className="text-[#1C2733] font-bold">{parcel.district}</strong>
        </div>
        <div>
          <span className="text-[#6D5A3E] font-medium">खाते क्र.:</span>{' '}
          <strong className="text-[#123A78] font-bold">{parcel.khataNumber}</strong>
        </div>
      </div>

      {/* Main Form 7 (अधिकार अभिलेख पत्रक) Tabular Table */}
      <div className="border-2 border-[#4A3B24] bg-white/70 overflow-hidden rounded-xs">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-[#EAE2CE] border-b-2 border-[#4A3B24] text-[11px] font-serif font-bold text-[#2A1F10]">
              <th className="p-2 border-r border-[#B8A88E] w-[22%]">
                भूमापन क्रमांक व उपविभाग
                <span className="block text-[9px] font-normal text-gray-600 font-sans">
                  (Survey / Gat No. &amp; Sub-div)
                </span>
              </th>
              <th className="p-2 border-r border-[#B8A88E] w-[46%]">
                खातेदाराचे नाव व भूधारणा पद्धती
                <span className="block text-[9px] font-normal text-gray-600 font-sans">
                  (Name of Occupant &amp; Tenure)
                </span>
              </th>
              <th className="p-2 border-r border-[#B8A88E] w-[18%] text-right">
                एकूण क्षेत्र (हेक्टर)
                <span className="block text-[9px] font-normal text-gray-600 font-sans">
                  (Total Area in Ha)
                </span>
              </th>
              <th className="p-2 w-[14%] text-right">
                आकारणी (रु.)
                <span className="block text-[9px] font-normal text-gray-600 font-sans">
                  (Assessment Rs.)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#D8CEB8] align-top">
              {/* Survey / Gat No. */}
              <td className="p-2.5 border-r border-[#D8CEB8] font-mono">
                <div className="text-base font-black text-[#123A78]">
                  गट क्र. {parcel.surveyNumber}
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5">
                  उपविभाग: {parcel.subDivision || 'अ'}
                </div>
                <div className="text-[9px] text-[#0B7A3B] font-bold mt-1">
                  भोगवटादार वर्ग-१
                </div>
              </td>

              {/* Landowner Name & Co-sharers */}
              <td className="p-2.5 border-r border-[#D8CEB8]">
                <div className="text-sm font-bold text-[#1C2733] font-serif">
                  {parcel.ownerName}
                </div>
                <div className="text-[11px] text-gray-700">
                  पित्याचे नाव: {parcel.fatherName}
                </div>
                {parcel.coSharers && parcel.coSharers.length > 0 && (
                  <div className="mt-1 text-[10px] text-gray-600 border-t border-dashed border-gray-300 pt-1">
                    <span className="font-semibold text-gray-800">सहधारक:</span>{' '}
                    {parcel.coSharers.map((c) => `${c.name} (${c.share})`).join(', ')}
                  </div>
                )}
              </td>

              {/* Total Area */}
              <td className="p-2.5 border-r border-[#D8CEB8] text-right font-mono">
                <div className="text-sm font-black text-[#1C2733]">
                  {parcel.landAreaHa.toFixed(2)} हे.
                </div>
                <div className="text-[10px] text-gray-600">
                  ({parcel.landAreaSqft.toLocaleString()} चौ.फूट)
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  पोटखराबा: ०.०२ हे.
                </div>
              </td>

              {/* Tax Assessment */}
              <td className="p-2.5 text-right font-mono">
                <div className="text-xs font-bold text-gray-800">४२.५०</div>
                <div className="text-[10px] text-gray-500">जुडी: निरंक</div>
              </td>
            </tr>

            {/* Other Rights & Mutation Entries Section */}
            <tr className="bg-[#FAF6EC] border-b border-[#B8A88E]">
              <td colSpan={4} className="p-2.5">
                <div className="font-serif font-bold text-xs text-[#4A3B24] mb-1.5 flex items-center justify-between">
                  <span>इतर हक्क, बोजा व फेरफार नोंदी (Other Rights &amp; Mutation Entries):</span>
                  <span className="text-[10px] font-mono text-gray-600">
                    प्रमाणित फेरफार क्र. {parcel.mutationNumber}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-800 leading-relaxed font-sans">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>
                      <strong>फेरफार नोंद क्र. {parcel.mutationNumber}:</strong> प्रमाणित फेरफार अन्वये महसूल नोंदी अद्ययावत. (Certified Revenue Mutation Order sanctioned).
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>
                      <strong>बोजा स्थिती:</strong>{' '}
                      {parcel.dna.encumbranceStatus === 'UNENCUMBERED' ? (
                        <span className="text-[#0B7A3B] font-semibold">
                          सदर मिळकतीवर कोणताही बँक अथवा सरकारी बोजा नाही (निरंक बोजा).
                        </span>
                      ) : (
                        <span className="text-amber-800 font-semibold">
                          शेती कर्ज बोजा नोंद (स्टेट बँक ऑफ इंडिया, शाखा वाघोली - रु. ५,००,०००/-).
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Modi Script Archival Succession Note */}
                  <div className="p-2 bg-[#F3ECE0] border border-[#D8CEB8] rounded text-[11px] text-[#4A3B24] font-serif">
                    <span className="font-bold text-[#7A4B10]">
                      [ऐतिहासिक मोडी लिपी वारसा नोंद १९५२]:
                    </span>{' '}
                    धोंडीबा रामजी पाटील वारस नोंद (वारसा हक्क) — पोस्ट-इंडिपेंडन्स कॅडस्ट्रल सर्व्हे नोंदवहीनुसार मूळ हक्कदार.
                  </div>
                </div>
              </td>
            </tr>

            {/* Village Form 12: Crop Register (पिकांची पाहणी) */}
            <tr className="bg-[#FFFDF9]">
              <td colSpan={4} className="p-2.5">
                <div className="font-serif font-bold text-xs text-[#4A3B24] mb-1">
                  गाव नमुना १२ — पिकांची पाहणी नोंदवही (Register of Crops):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-700 font-sans">
                  <div>
                    <span className="text-gray-500">वर्ष:</span> २०२५-२०२६
                  </div>
                  <div>
                    <span className="text-gray-500">हंगाम:</span> खरीप (बागायत)
                  </div>
                  <div>
                    <span className="text-gray-500">पिकाचे नाव:</span> ऊस / सोयाबीन
                  </div>
                  <div>
                    <span className="text-gray-500">सिंचन साधन:</span> विहीर / ठिबक सिंचन
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Official Signatures and Rubber Stamps */}
      <div className="mt-4 pt-3 border-t border-[#D8CEB8] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Official Purple Ink Rubber Stamp */}
        <div className="relative border-2 border-[#5B21B6] text-[#5B21B6] p-2.5 rounded-full w-36 h-36 flex flex-col items-center justify-center text-center rotate-[-6deg] shadow-xs bg-purple-50/40 select-none">
          <div className="text-[7.5px] font-black uppercase tracking-wider">
            ★ तहसीलदार कार्यालय ★
          </div>
          <AshokaEmblem size={24} className="my-0.5 opacity-80" />
          <div className="text-[8px] font-bold">हवेली, जिल्हा पुणे</div>
          <div className="text-[7px] text-purple-900 font-mono mt-0.5">
            अधिकृत शासन मुद्रा
          </div>
        </div>

        {/* Digital Verification Certificate Box */}
        <div className="flex-1 bg-white/90 border border-emerald-300 rounded p-2.5 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0B7A3B]">
            <CheckCircle2 className="w-4 h-4 text-[#0B7A3B]" />
            <span>ई-महाभूलेख डिजिटल स्वाक्षरीकृत अधिकृत सातबारा उतारा</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-1 leading-normal">
            हा उतारा माहिती तंत्रज्ञान कायदा २००० (IT Act 2000 Section 6A) अन्वये अधिकृत डिजिटल स्वाक्षरीने प्रमाणित करण्यात आलेला आहे. यासाठी कोणत्याही हाताने सहीची आवश्यकता नाही.
          </p>
          <div className="mt-1 font-mono text-[9px] text-gray-500">
            Hash: {parcel.dna.dnaHash.substring(0, 36)}...
          </div>
        </div>

        {/* Talathi / Revenue Officer Signature Stamp */}
        <div className="text-right text-xs font-serif text-[#3A2F20] space-y-1">
          <div className="italic font-bold text-[#123A78] text-sm font-sans tracking-wide">
            स्वाक्षरी / Digital Signed
          </div>
          <div className="font-bold">तलाठी, सझा {parcel.village}</div>
          <div className="text-[10px] text-gray-600">तालुका {parcel.taluka}, जिल्हा {parcel.district}</div>
          <div className="text-[9px] font-mono text-gray-500">दिनांक: २४/०३/२०२६</div>
        </div>
      </div>
    </div>
  );
};
