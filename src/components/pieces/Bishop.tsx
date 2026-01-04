import React from 'react';

interface BishopProps {
  color: 'white' | 'black';
  size?: number;
}

export const Bishop: React.FC<BishopProps> = ({ color, size = 45 }) => {
  const strokeColor = color === 'white' ? '#1a1a2e' : '#c9a227';
  const accentColor = color === 'white' ? '#c9a227' : '#ffd700';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bishopGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`bishopShadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#bishopShadow-${color})`}>
        {/* Top ball */}
        <circle
          cx="22.5"
          cy="8"
          r="3"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Main mitre shape */}
        <path
          d="M 15 32 C 17.5 34.5 27.5 34.5 30 32 C 30.5 30.5 30 30 30 30 C 30 27.5 27.5 26 27.5 26 L 27.5 23 C 27.5 15.5 25.5 11 22.5 9.5 C 19.5 11 17.5 15.5 17.5 23 L 17.5 26 C 17.5 26 15 27.5 15 30 C 15 30 14.5 30.5 15 32 Z"
          fill={`url(#bishopGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Cut line in mitre */}
        <path
          d="M 25 8 C 25.5 12 25.5 15.5 22.5 21 C 19.5 15.5 19.5 12 20 8"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Collar */}
        <path
          d="M 17.5 26 L 27.5 26"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Base collar */}
        <path
          d="M 15 30 C 17.5 27.5 27.5 27.5 30 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
        
        {/* Lower base */}
        <path
          d="M 14.5 32 C 14.5 33.5 16 35 17 36 L 28 36 C 29 35 30.5 33.5 30.5 32 C 27.5 34.5 17.5 34.5 14.5 32 Z"
          fill={`url(#bishopGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Bottom base */}
        <path
          d="M 9 38 L 36 38 C 35 34.5 32 36 28 36 L 17 36 C 13 36 10 34.5 9 38 Z"
          fill={`url(#bishopGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

