import React from 'react';

interface KingProps {
  color: 'white' | 'black';
  size?: number;
}

export const King: React.FC<KingProps> = ({ color, size = 45 }) => {
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
        <linearGradient id={`kingGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color === 'white' ? '#ffffff' : '#2d2d44'} />
          <stop offset="100%" stopColor={color === 'white' ? '#e0e0e0' : '#1a1a2e'} />
        </linearGradient>
        <filter id={`shadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      <g filter={`url(#shadow-${color})`}>
        {/* Cross on top */}
        <path
          d="M 22.5 11.63 L 22.5 6 M 20 8 L 25 8"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Crown base */}
        <path
          d="M 22.5 25 C 22.5 25 27 21 27 18 C 27 14.5 22.5 12 22.5 12 C 22.5 12 18 14.5 18 18 C 18 21 22.5 25 22.5 25"
          fill={`url(#kingGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Main body */}
        <path
          d="M 12.5 37 C 18 40.5 27 40.5 32.5 37 L 32.5 30 C 32.5 30 41.5 25.5 38.5 19.5 C 34.5 13 25 16 22.5 23.5 L 22.5 27 L 22.5 23.5 C 20 16 10.5 13 6.5 19.5 C 3.5 25.5 12.5 30 12.5 30 L 12.5 37"
          fill={`url(#kingGrad-${color})`}
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crown details */}
        <path
          d="M 12.5 30 C 18 27 27 27 32.5 30"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <path
          d="M 12.5 33.5 C 18 30.5 27 30.5 32.5 33.5"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
        <path
          d="M 12.5 37 C 18 34 27 34 32.5 37"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

