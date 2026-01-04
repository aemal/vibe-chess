import React from 'react';

interface PawnProps {
  color: 'white' | 'black';
  size?: number;
}

export const Pawn: React.FC<PawnProps> = ({ color, size = 45 }) => {
  const strokeColor = color === 'white' ? '#1a1a2e' : '#c9a227';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`pawnGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`pawnShadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#pawnShadow-${color})`}>
        {/* Head */}
        <circle
          cx="22.5"
          cy="12"
          r="6"
          fill={`url(#pawnGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        
        {/* Neck */}
        <path
          d="M 18.5 18 C 18.5 20 20 22 22.5 22 C 25 22 26.5 20 26.5 18"
          fill={`url(#pawnGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Body */}
        <path
          d="M 17 22 C 14 23.5 11.5 27 11.5 30 L 33.5 30 C 33.5 27 31 23.5 28 22"
          fill={`url(#pawnGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Base platform */}
        <path
          d="M 10 30 L 10 33 L 35 33 L 35 30"
          fill={`url(#pawnGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Bottom base */}
        <path
          d="M 7 33 L 7 37 L 38 37 L 38 33"
          fill={`url(#pawnGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Decorative line */}
        <path
          d="M 11.5 30 L 33.5 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

