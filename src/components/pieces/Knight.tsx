import React from 'react';

interface KnightProps {
  color: 'white' | 'black';
  size?: number;
}

export const Knight: React.FC<KnightProps> = ({ color, size = 45 }) => {
  const strokeColor = color === 'white' ? '#1a1a2e' : '#c9a227';
  const eyeColor = color === 'white' ? '#1a1a2e' : '#ffd700';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`knightGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`knightShadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#knightShadow-${color})`}>
        {/* Main horse head shape */}
        <path
          d="M 22 10 C 32.5 11 38.5 18 38 39 L 15 39 C 15 30 25 32.5 23 18 C 23 18 20 18 18 17 C 13 17 8 14 8.5 10 C 10.5 10.5 12.5 10 14 8 C 17 3 22 10 22 10"
          fill={`url(#knightGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Mane */}
        <path
          d="M 24 18 C 24.5 20.5 27 22 27 22 C 24.5 24.5 21.5 25.5 20.5 25.5 C 18 25.5 14.5 24 14 24 C 14 24 18.5 20.5 19 18"
          fill={`url(#knightGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Ear */}
        <path
          d="M 17.5 6 C 17.5 6 20 2 23 6"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Eye */}
        <circle
          cx="15"
          cy="15.5"
          r="1.5"
          fill={eyeColor}
        />
        
        {/* Nostril */}
        <circle
          cx="9"
          cy="11.5"
          r="1"
          fill={strokeColor}
        />
        
        {/* Mouth line */}
        <path
          d="M 9.5 12 L 9 15"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
        />
        
        {/* Base decorations */}
        <path
          d="M 15 39 C 15 39.5 14.5 40 12 40 C 12 40 12 40.5 15.5 40.5 L 38.5 40.5 C 39.5 40.5 39 39.5 38 39"
          fill={`url(#knightGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

