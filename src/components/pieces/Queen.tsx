import React from 'react';

interface QueenProps {
  color: 'white' | 'black';
  size?: number;
}

export const Queen: React.FC<QueenProps> = ({ color, size = 45 }) => {
  const fillColor = color === 'white' ? '#fff' : '#1a1a2e';
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
        <linearGradient id={`queenGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`queenShadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#queenShadow-${color})`}>
        {/* Crown points with circles */}
        <circle cx="6" cy="12" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
        <circle cx="14" cy="9" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
        <circle cx="22.5" cy="8" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
        <circle cx="31" cy="9" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
        <circle cx="39" cy="12" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth="1"/>
        
        {/* Crown body */}
        <path
          d="M 9 26 C 17.5 24.5 30 24.5 36 26 L 38.5 13.5 L 31 25 L 30.7 10.9 L 25.5 24.5 L 22.5 10 L 19.5 24.5 L 14.3 10.9 L 14 25 L 6.5 13.5 L 9 26 Z"
          fill={`url(#queenGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Base */}
        <path
          d="M 9 26 C 9 28 10.5 28 11.5 30 C 12.5 31.5 12.5 31 12 33.5 C 10.5 34.5 11 36 11 36 C 9.5 37.5 11 38.5 11 38.5 C 17.5 39.5 27.5 39.5 34 38.5 C 34 38.5 35.5 37.5 34 36 C 34 36 34.5 34.5 33 33.5 C 32.5 31 32.5 31.5 33.5 30 C 34.5 28 36 28 36 26 C 27.5 24.5 17.5 24.5 9 26 Z"
          fill={`url(#queenGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Decorative lines */}
        <path
          d="M 11.5 30 C 15 29 30 29 33.5 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
        <path
          d="M 12 33.5 C 18 32.5 27 32.5 33 33.5"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

