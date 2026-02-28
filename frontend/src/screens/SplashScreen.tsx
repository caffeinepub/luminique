import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Logo from '../components/Logo';
import { useUserStore } from '../stores/userStore';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate({ to: '/home' });
      } else {
        navigate({ to: '/onboarding' });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, hasCompletedOnboarding]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F5E6D6 0%, #E8DFF5 100%)' }}
    >
      {/* Animated background blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #BCA6E6, transparent)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, #EBCBB3, transparent)',
          filter: 'blur(50px)',
        }}
      />

      {/* Logo */}
      <div className="animate-fade-in-scale flex flex-col items-center gap-6">
        <Logo size={100} showWordmark={false} />
        <div className="text-center">
          <h1
            className="text-3xl font-semibold mb-2"
            style={{ color: '#111111', fontFamily: 'Poppins, sans-serif' }}
          >
            luminique
          </h1>
          <p
            className="text-lg font-light tracking-widest"
            style={{ color: '#7B4BB7', fontFamily: 'Poppins, sans-serif' }}
          >
            Glow. Grow. Bloom.
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: '#BCA6E6',
              animation: `seedPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
