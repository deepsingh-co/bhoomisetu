import React from 'react';

// Official Ashoka Lion Capital of India Vector Emblem
export const AshokaEmblem: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-label="State Emblem of India"
    role="img"
  >
    {/* Outer boundary circle with subtle gold/navy styling */}
    <circle cx="50" cy="50" r="48" fill="#123A78" stroke="#D8DEE8" strokeWidth="1.5" />
    
    {/* Inner White field */}
    <circle cx="50" cy="50" r="44" fill="#FFFFFF" />

    {/* Ashoka Chakra in Center */}
    <circle cx="50" cy="50" r="28" stroke="#123A78" strokeWidth="2.5" fill="#F5F7FA" />
    <circle cx="50" cy="50" r="5" fill="#123A78" />

    {/* 24 spokes of Ashoka Chakra */}
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 26 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 26 * Math.sin((angle * Math.PI) / 180)}
          stroke="#123A78"
          strokeWidth="1.5"
        />
      );
    })}

    {/* National Motto base placeholder arch */}
    <path
      d="M26 80 Q50 74 74 80 L72 87 Q50 82 28 87 Z"
      fill="#123A78"
    />
    <text
      x="50"
      y="85"
      textAnchor="middle"
      fontSize="5"
      fontWeight="700"
      fill="#FFFFFF"
      letterSpacing="0.5"
    >
      सत्यमेव जयते
    </text>
  </svg>
);

// Digital India Emblem Logo
export const DigitalIndiaBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D8DEE8] rounded-md ${className}`}>
    <div className="w-5 h-5 rounded-full bg-[#123A78] flex items-center justify-center text-[9px] font-bold text-white">
      DI
    </div>
    <div className="leading-tight text-left">
      <div className="text-[10px] font-bold text-[#123A78] tracking-tight">Digital India</div>
      <div className="text-[8px] text-[#5A6878]">Power to Empower</div>
    </div>
  </div>
);

// NIC Badge
export const NicBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F5F7FA] border border-[#D8DEE8] rounded text-[#123A78] text-[11px] font-medium ${className}`}>
    <span className="w-2 h-2 rounded-full bg-[#1F7A3E] animate-pulse"></span>
    <span className="font-semibold">NIC Certified</span>
    <span className="text-[#5A6878] border-l border-[#D8DEE8] pl-1">TLS 1.3 / ISO 27001</span>
  </div>
);

// Tricolor Top Ribbon for Authentic Government Identity
export const TricolorRibbon: React.FC = () => (
  <div className="w-full flex h-1.5 overflow-hidden" aria-hidden="true">
    <div className="w-1/3 bg-[#FF9933]"></div>
    <div className="w-1/3 bg-[#FFFFFF] border-y border-[#D8DEE8]/40"></div>
    <div className="w-1/3 bg-[#138808]"></div>
  </div>
);
