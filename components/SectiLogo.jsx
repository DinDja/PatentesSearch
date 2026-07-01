'use client';

export function SectiLogo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Patentes SECTI Bahia"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00b5b8" />
          <stop offset="100%" stopColor="#008f91" />
        </linearGradient>
      </defs>
      
      <g>
        <text
          x="0"
          y="42"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="38"
          fontWeight="600"
          fill="url(#logoGradient)"
          letterSpacing="-0.5"
        >
          Patentes
        </text>
        
        <text
          x="175"
          y="42"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="38"
          fontWeight="300"
          fill="#737373"
          letterSpacing="2"
        >
          SECTI
        </text>
        
        <rect x="175" y="48" width="55" height="2" fill="#00b5b8" rx="1" />
      </g>
    </svg>
  );
}