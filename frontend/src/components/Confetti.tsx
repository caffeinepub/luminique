import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = ['#BCA6E6', '#F9A8D4', '#7ED1B2', '#D4A843', '#7B4BB7', '#EBCBB3'];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger && !active) {
      setActive(true);
      const newParticles: Particle[] = Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 5,
        delay: Math.random() * 0.5,
        duration: Math.random() * 0.8 + 1.2,
        drift: (Math.random() - 0.5) * 80,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setActive(false);
        setParticles([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
