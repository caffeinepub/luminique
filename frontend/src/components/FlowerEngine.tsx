import React from 'react';
import { FlowerState } from '../utils/getFlowerState';

interface FlowerEngineProps {
  state: FlowerState;
  size?: number;
}

const FlowerEngine: React.FC<FlowerEngineProps> = ({ state, size = 200 }) => {
  const s = size;

  if (state === 'seed') {
    return (
      <div className="flex flex-col items-center gap-3 animate-seed-pulse">
        <svg width={s} height={s} viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id="soilGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#C4956A" />
              <stop offset="100%" stopColor="#8B6347" />
            </radialGradient>
            <radialGradient id="seedGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#D4A843" />
              <stop offset="100%" stopColor="#A0722A" />
            </radialGradient>
          </defs>
          {/* Soil mound */}
          <ellipse cx="100" cy="155" rx="55" ry="22" fill="url(#soilGrad)" opacity="0.9" />
          <ellipse cx="100" cy="148" rx="40" ry="16" fill="#A0722A" opacity="0.5" />
          {/* Seed */}
          <ellipse cx="100" cy="138" rx="12" ry="16" fill="url(#seedGrad)" />
          <ellipse cx="100" cy="133" rx="5" ry="7" fill="#D4A843" opacity="0.6" />
          {/* Small sprout hint */}
          <path d="M100 122 Q103 112 100 105" stroke="#7ED1B2" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="103" cy="108" rx="5" ry="3" fill="#7ED1B2" transform="rotate(-20 103 108)" opacity="0.8" />
        </svg>
        <div className="text-center">
          <div className="text-4xl mb-1">🌱</div>
          <p className="text-sm font-medium" style={{ color: '#6B6B8A' }}>Your journey begins...</p>
        </div>
      </div>
    );
  }

  if (state === 'bud') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="animate-gentle-sway origin-bottom">
          <svg width={s} height={s} viewBox="0 0 200 200" fill="none">
            <defs>
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B8A5B" />
                <stop offset="100%" stopColor="#7ED1B2" />
              </linearGradient>
              <linearGradient id="budGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BCA6E6" />
                <stop offset="100%" stopColor="#7B4BB7" />
              </linearGradient>
            </defs>
            {/* Soil */}
            <ellipse cx="100" cy="168" rx="45" ry="16" fill="#C4956A" opacity="0.8" />
            {/* Stem */}
            <path d="M100 168 Q97 140 100 100" stroke="url(#stemGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Leaves */}
            <ellipse cx="88" cy="140" rx="14" ry="6" fill="#7ED1B2" transform="rotate(-30 88 140)" opacity="0.9" />
            <ellipse cx="112" cy="128" rx="14" ry="6" fill="#7ED1B2" transform="rotate(30 112 128)" opacity="0.9" />
            {/* Bud */}
            <ellipse cx="100" cy="88" rx="12" ry="18" fill="url(#budGrad)" />
            <ellipse cx="100" cy="82" rx="8" ry="10" fill="#E8DFF5" opacity="0.6" />
            {/* Bud tip */}
            <ellipse cx="100" cy="74" rx="5" ry="7" fill="#BCA6E6" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-1">🌿</div>
          <p className="text-sm font-medium" style={{ color: '#6B6B8A' }}>Growing beautifully!</p>
        </div>
      </div>
    );
  }

  if (state === 'bloom') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse-glow">
          <svg width={s} height={s} viewBox="0 0 200 200" fill="none">
            <defs>
              <linearGradient id="bloomPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B2D91" />
                <stop offset="100%" stopColor="#BCA6E6" />
              </linearGradient>
              <linearGradient id="bloomPetalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7B4BB7" />
                <stop offset="100%" stopColor="#E8DFF5" />
              </linearGradient>
              <radialGradient id="bloomCoreGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#F5E6D6" />
                <stop offset="50%" stopColor="#BCA6E6" />
                <stop offset="100%" stopColor="#7B4BB7" />
              </radialGradient>
              <linearGradient id="bloomStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B8A5B" />
                <stop offset="100%" stopColor="#7ED1B2" />
              </linearGradient>
              <filter id="glowFilter">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Soil */}
            <ellipse cx="100" cy="175" rx="40" ry="14" fill="#C4956A" opacity="0.7" />
            {/* Stem */}
            <path d="M100 175 Q97 155 100 130" stroke="url(#bloomStemGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Leaves */}
            <ellipse cx="86" cy="155" rx="16" ry="7" fill="#7ED1B2" transform="rotate(-25 86 155)" opacity="0.9" />
            <ellipse cx="114" cy="148" rx="16" ry="7" fill="#7ED1B2" transform="rotate(25 114 148)" opacity="0.9" />

            {/* Outer petals (5) */}
            <ellipse cx="100" cy="95" rx="10" ry="22" fill="url(#bloomPetalGrad)" opacity="0.85" filter="url(#glowFilter)" />
            <ellipse cx="100" cy="95" rx="10" ry="22" fill="url(#bloomPetalGrad)" opacity="0.85" transform="rotate(72 100 118)" filter="url(#glowFilter)" />
            <ellipse cx="100" cy="95" rx="10" ry="22" fill="url(#bloomPetalGrad)" opacity="0.85" transform="rotate(144 100 118)" filter="url(#glowFilter)" />
            <ellipse cx="100" cy="95" rx="10" ry="22" fill="url(#bloomPetalGrad)" opacity="0.85" transform="rotate(216 100 118)" filter="url(#glowFilter)" />
            <ellipse cx="100" cy="95" rx="10" ry="22" fill="url(#bloomPetalGrad)" opacity="0.85" transform="rotate(288 100 118)" filter="url(#glowFilter)" />

            {/* Inner petals (5) */}
            <ellipse cx="100" cy="103" rx="7" ry="16" fill="url(#bloomPetalGrad2)" opacity="0.9" transform="rotate(36 100 118)" />
            <ellipse cx="100" cy="103" rx="7" ry="16" fill="url(#bloomPetalGrad2)" opacity="0.9" transform="rotate(108 100 118)" />
            <ellipse cx="100" cy="103" rx="7" ry="16" fill="url(#bloomPetalGrad2)" opacity="0.9" transform="rotate(180 100 118)" />
            <ellipse cx="100" cy="103" rx="7" ry="16" fill="url(#bloomPetalGrad2)" opacity="0.9" transform="rotate(252 100 118)" />
            <ellipse cx="100" cy="103" rx="7" ry="16" fill="url(#bloomPetalGrad2)" opacity="0.9" transform="rotate(324 100 118)" />

            {/* Core */}
            <circle cx="100" cy="118" r="16" fill="url(#bloomCoreGrad)" />
            <circle cx="100" cy="118" r="10" fill="#F5E6D6" opacity="0.8" />
            <circle cx="100" cy="118" r="5" fill="#BCA6E6" />
            <circle cx="100" cy="118" r="2.5" fill="#7B4BB7" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-1">🌸</div>
          <p className="text-sm font-medium" style={{ color: '#7B4BB7' }}>You're blooming! Keep glowing!</p>
        </div>
      </div>
    );
  }

  // Withered state
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ animation: 'droop 1s ease-out forwards', transformOrigin: 'bottom center' }}>
        <svg width={s} height={s} viewBox="0 0 200 200" fill="none" style={{ opacity: 0.65 }}>
          <defs>
            <linearGradient id="witherPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B8BAA" />
              <stop offset="100%" stopColor="#C4B8D4" />
            </linearGradient>
          </defs>
          {/* Soil */}
          <ellipse cx="100" cy="175" rx="40" ry="14" fill="#A08060" opacity="0.6" />
          {/* Drooping stem */}
          <path d="M100 175 Q95 155 88 130 Q82 110 90 95" stroke="#8B7355" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Drooping leaves */}
          <ellipse cx="80" cy="148" rx="14" ry="5" fill="#9CAF88" transform="rotate(20 80 148)" opacity="0.6" />
          {/* Drooping petals */}
          <ellipse cx="90" cy="88" rx="8" ry="18" fill="url(#witherPetalGrad)" opacity="0.7" transform="rotate(-20 90 105)" />
          <ellipse cx="90" cy="88" rx="8" ry="18" fill="url(#witherPetalGrad)" opacity="0.7" transform="rotate(40 90 105)" />
          <ellipse cx="90" cy="88" rx="8" ry="18" fill="url(#witherPetalGrad)" opacity="0.7" transform="rotate(100 90 105)" />
          <ellipse cx="90" cy="88" rx="8" ry="18" fill="url(#witherPetalGrad)" opacity="0.7" transform="rotate(160 90 105)" />
          <ellipse cx="90" cy="88" rx="8" ry="18" fill="url(#witherPetalGrad)" opacity="0.7" transform="rotate(220 90 105)" />
          {/* Core */}
          <circle cx="90" cy="105" r="12" fill="#C4B8D4" opacity="0.7" />
          <circle cx="90" cy="105" r="6" fill="#E8DFF5" opacity="0.5" />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-4xl mb-1">🥀</div>
        <p className="text-sm font-medium" style={{ color: '#6B6B8A' }}>Your flower needs care...</p>
      </div>
    </div>
  );
};

export default FlowerEngine;
