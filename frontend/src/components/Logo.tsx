import React from 'react';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 64, showWordmark = true, className = '' }) => {
  const s = size;
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="containerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2D8C2" />
            <stop offset="100%" stopColor="#EBCBB3" />
          </linearGradient>
          <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B2D91" />
            <stop offset="100%" stopColor="#BCA6E6" />
          </linearGradient>
          <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BCA6E6" />
            <stop offset="100%" stopColor="#7B4BB7" />
          </linearGradient>
        </defs>

        {/* Container */}
        <rect width="64" height="64" rx="16" fill="url(#containerGrad)" />

        {/* Leaves */}
        <ellipse cx="22" cy="50" rx="8" ry="4" fill="#7ED1B2" transform="rotate(-30 22 50)" opacity="0.9" />
        <ellipse cx="42" cy="50" rx="8" ry="4" fill="#7ED1B2" transform="rotate(30 42 50)" opacity="0.9" />

        {/* Lotus petals - 5 petals */}
        {/* Center petal (top) */}
        <ellipse cx="32" cy="24" rx="5" ry="10" fill="url(#petalGrad)" opacity="0.95" />
        {/* Upper left petal */}
        <ellipse cx="22" cy="27" rx="5" ry="10" fill="url(#petalGrad)" opacity="0.9" transform="rotate(-35 22 27)" />
        {/* Upper right petal */}
        <ellipse cx="42" cy="27" rx="5" ry="10" fill="url(#petalGrad)" opacity="0.9" transform="rotate(35 42 27)" />
        {/* Lower left petal */}
        <ellipse cx="20" cy="36" rx="5" ry="9" fill="url(#petalGrad)" opacity="0.8" transform="rotate(-60 20 36)" />
        {/* Lower right petal */}
        <ellipse cx="44" cy="36" rx="5" ry="9" fill="url(#petalGrad)" opacity="0.8" transform="rotate(60 44 36)" />

        {/* Core */}
        <circle cx="32" cy="34" r="7" fill="url(#coreGrad)" />
        <circle cx="32" cy="34" r="4" fill="#E8DFF5" opacity="0.7" />
        <circle cx="32" cy="34" r="2" fill="#BCA6E6" />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: size * 0.22,
            color: '#111111',
            letterSpacing: '0.05em',
          }}
        >
          luminique
        </span>
      )}
    </div>
  );
};

export default Logo;
