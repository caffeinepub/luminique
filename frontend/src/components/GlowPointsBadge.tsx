import React, { useEffect, useRef, useState } from 'react';
import { Flame } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

interface GlowPointsBadgeProps {
  className?: string;
  showFloating?: boolean;
  lastAdded?: number;
}

const GlowPointsBadge: React.FC<GlowPointsBadgeProps> = ({ className = '', showFloating = false, lastAdded = 0 }) => {
  const glowPoints = useUserStore((s) => s.glowPoints);
  const [floating, setFloating] = useState(false);
  const prevPoints = useRef(glowPoints);

  useEffect(() => {
    if (glowPoints > prevPoints.current) {
      setFloating(true);
      const t = setTimeout(() => setFloating(false), 1500);
      prevPoints.current = glowPoints;
      return () => clearTimeout(t);
    }
    prevPoints.current = glowPoints;
  }, [glowPoints]);

  return (
    <div className={`relative inline-flex items-center gap-1.5 glass-card rounded-full px-3 py-1.5 ${className}`}>
      <Flame size={16} className="text-orange-400" fill="#fb923c" />
      <span className="text-sm font-semibold" style={{ color: '#7B4BB7' }}>
        {glowPoints.toLocaleString()}
      </span>
      {floating && (
        <span
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold animate-float-up pointer-events-none"
          style={{ color: '#7B4BB7' }}
        >
          +{lastAdded || ''}
        </span>
      )}
    </div>
  );
};

export default GlowPointsBadge;
