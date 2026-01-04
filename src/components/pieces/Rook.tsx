import React from 'react';

interface RookProps {
  color: 'white' | 'black';
  size?: number;
}

export const Rook: React.FC<RookProps> = ({ color, size = 45 }) => {
  const strokeColor = color === 'white' ? '#1a1a2e' : '#c9a227';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`rookGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`rookShadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#rookShadow-${color})`}>
        {/* Top battlements */}
        <path
          d="M 9 12 L 9 8 L 13 8 L 13 12 L 17 12 L 17 8 L 21 8 L 21 12 L 24 12 L 24 8 L 28 8 L 28 12 L 32 12 L 32 8 L 36 8 L 36 12 L 36 17 L 9 17 L 9 12 Z"
          fill={`url(#rookGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Upper neck */}
        <path
          d="M 11 17 L 11 20 L 34 20 L 34 17"
          fill={`url(#rookGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Main body */}
        <path
          d="M 13 20 L 11 34 L 34 34 L 32 20"
          fill={`url(#rookGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Base platform */}
        <path
          d="M 8 34 L 8 37 L 37 37 L 37 34"
          fill={`url(#rookGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Bottom base */}
        <path
          d="M 6 37 L 6 40 L 39 40 L 39 37"
          fill={`url(#rookGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Decorative lines */}
        <path
          d="M 13 34 L 32 34"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
        <path
          d="M 11 20 L 34 20"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

