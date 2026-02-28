import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight, ChevronLeft, Check, SkipForward } from 'lucide-react';
import Logo from '../components/Logo';
import { useUserStore } from '../stores/userStore';

const TOTAL_STEPS = 8;

const SKIN_TYPES = [
  { id: 'Normal', icon: '✨', desc: 'Balanced, not too oily or dry' },
  { id: 'Oily', icon: '💧', desc: 'Shiny, enlarged pores' },
  { id: 'Dry', icon: '🌵', desc: 'Tight, flaky, rough texture' },
  { id: 'Combination', icon: '🌗', desc: 'Oily T-zone, dry cheeks' },
  { id: 'Sensitive', icon: '🌸', desc: 'Easily irritated, reactive' },
];

const SKIN_CONCERNS = [
  'Acne', 'Pigmentation', 'Dullness', 'Wrinkles',
  'Dark Circles', 'Uneven Texture', 'Redness', 'Large Pores',
];

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [skinType, setSkinType] = useState('');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [routinePreference, setRoutinePreference] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDone, setScanDone] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const goNext = () => {
    setDirection('forward');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection('back');
    setStep((s) => Math.max(s - 1, 1));
  };

  const toggleConcern = (concern: string) => {
    setSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const startScan = () => {
    setScanProgress(0);
    setScanDone(false);
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setScanDone(true);
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const handleFinish = () => {
    let valid = true;
    if (!name.trim()) { setNameError('Please enter your name'); valid = false; }
    else setNameError('');
    if (!email.trim() || !email.includes('@')) { setEmailError('Please enter a valid email'); valid = false; }
    else setEmailError('');
    if (!valid) return;

    completeOnboarding({
      name: name.trim(),
      email: email.trim(),
      gender,
      ageRange,
      skinType: skinType || 'Combination',
      skinConcerns,
      routinePreference: routinePreference || 'Both',
    });
    navigate({ to: '/home' });
  };

  const animClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #F5E6D6 0%, #E8DFF5 100%)' }}
    >
      {/* Progress bar */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-2">
          {step > 1 && (
            <button onClick={goBack} className="p-2 rounded-full hover:bg-white/40 transition-colors mr-1">
              <ChevronLeft size={20} style={{ color: '#7B4BB7' }} />
            </button>
          )}
          <div className="flex-1 flex gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: i < step ? '#7B4BB7' : 'rgba(188, 166, 230, 0.3)',
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium ml-2" style={{ color: '#6B6B8A' }}>
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className={`flex-1 px-6 pb-8 ${animClass}`} key={step}>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
            <Logo size={80} showWordmark={true} />
            <div>
              <h2 className="text-2xl font-semibold mb-2" style={{ color: '#111111' }}>
                Welcome to Luminique ✨
              </h2>
              <p className="text-base font-light" style={{ color: '#6B6B8A' }}>
                Let's personalize your glow journey
              </p>
            </div>
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)', minWidth: 200 }}
            >
              Get Started <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Gender */}
        {step === 2 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>How do you identify?</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>This helps us personalize your routine</p>
            </div>
            <div className="flex flex-col gap-3">
              {['Male', 'Female', 'Others'].map((g) => (
                <button
                  key={g}
                  onClick={() => { setGender(g); setTimeout(goNext, 200); }}
                  className="glass-card rounded-2xl p-4 text-left font-medium transition-all active:scale-98"
                  style={{
                    border: gender === g ? '2px solid #7B4BB7' : '1px solid rgba(188,166,230,0.4)',
                    color: gender === g ? '#7B4BB7' : '#111111',
                    background: gender === g ? 'rgba(123,75,183,0.08)' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g === 'Male' ? '👨' : g === 'Female' ? '👩' : '🌈'}</span>
                    <span>{g}</span>
                    {gender === g && <Check size={18} className="ml-auto" style={{ color: '#7B4BB7' }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Age Range */}
        {step === 3 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>What's your age range?</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>Skin needs change with age</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['13–19', '20–29', '30–39', '40–49', '50+'].map((age) => (
                <button
                  key={age}
                  onClick={() => { setAgeRange(age); setTimeout(goNext, 200); }}
                  className="glass-card rounded-2xl p-4 text-center font-semibold text-lg transition-all active:scale-95"
                  style={{
                    border: ageRange === age ? '2px solid #7B4BB7' : '1px solid rgba(188,166,230,0.4)',
                    color: ageRange === age ? '#7B4BB7' : '#111111',
                    background: ageRange === age ? 'rgba(123,75,183,0.08)' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Skin Type */}
        {step === 4 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>What's your skin type?</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>We'll recommend products just for you</p>
            </div>
            <div className="flex flex-col gap-3">
              {SKIN_TYPES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => { setSkinType(st.id); setTimeout(goNext, 200); }}
                  className="glass-card rounded-2xl p-4 text-left transition-all active:scale-98"
                  style={{
                    border: skinType === st.id ? '2px solid #7B4BB7' : '1px solid rgba(188,166,230,0.4)',
                    background: skinType === st.id ? 'rgba(123,75,183,0.08)' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{st.icon}</span>
                    <div>
                      <p className="font-semibold" style={{ color: skinType === st.id ? '#7B4BB7' : '#111111' }}>{st.id}</p>
                      <p className="text-xs" style={{ color: '#6B6B8A' }}>{st.desc}</p>
                    </div>
                    {skinType === st.id && <Check size={18} className="ml-auto" style={{ color: '#7B4BB7' }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Skin Concerns */}
        {step === 5 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>What are your skin concerns?</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>Select all that apply</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKIN_CONCERNS.map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                  style={{
                    background: skinConcerns.includes(concern) ? '#7B4BB7' : 'rgba(255,255,255,0.75)',
                    color: skinConcerns.includes(concern) ? 'white' : '#111111',
                    border: skinConcerns.includes(concern) ? '2px solid #7B4BB7' : '1px solid rgba(188,166,230,0.4)',
                  }}
                >
                  {concern}
                </button>
              ))}
            </div>
            <button
              onClick={goNext}
              disabled={skinConcerns.length === 0}
              className="w-full py-4 rounded-2xl text-white font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
            >
              Continue ({skinConcerns.length} selected)
            </button>
          </div>
        )}

        {/* Step 6: Routine Preference */}
        {step === 6 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>When do you prefer to do your routine?</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>We'll send reminders accordingly</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { id: 'Morning', icon: '🌅', desc: 'Start your day with a glow' },
                { id: 'Evening', icon: '🌙', desc: 'Wind down with skincare' },
                { id: 'Both', icon: '✨', desc: 'Morning & evening routines' },
              ].map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => { setRoutinePreference(pref.id); setTimeout(goNext, 200); }}
                  className="glass-card rounded-2xl p-4 text-left transition-all active:scale-98"
                  style={{
                    border: routinePreference === pref.id ? '2px solid #7B4BB7' : '1px solid rgba(188,166,230,0.4)',
                    background: routinePreference === pref.id ? 'rgba(123,75,183,0.08)' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pref.icon}</span>
                    <div>
                      <p className="font-semibold" style={{ color: routinePreference === pref.id ? '#7B4BB7' : '#111111' }}>{pref.id}</p>
                      <p className="text-xs" style={{ color: '#6B6B8A' }}>{pref.desc}</p>
                    </div>
                    {routinePreference === pref.id && <Check size={18} className="ml-auto" style={{ color: '#7B4BB7' }} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: AI Skin Scan */}
        {step === 7 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>AI Skin Analysis ✨</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>Let's analyze your skin for better recommendations</p>
            </div>

            {/* Camera frame */}
            <div className="relative mx-auto" style={{ width: 240, height: 300 }}>
              <div
                className="w-full h-full rounded-3xl overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                  border: '3px solid #7B4BB7',
                }}
              >
                {/* Face outline */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.3 }}>
                  <svg width="120" height="160" viewBox="0 0 120 160">
                    <ellipse cx="60" cy="80" rx="50" ry="65" stroke="#BCA6E6" strokeWidth="2" fill="none" strokeDasharray="8 4" />
                    <circle cx="40" cy="65" r="8" stroke="#BCA6E6" strokeWidth="1.5" fill="none" />
                    <circle cx="80" cy="65" r="8" stroke="#BCA6E6" strokeWidth="1.5" fill="none" />
                    <path d="M45 100 Q60 112 75 100" stroke="#BCA6E6" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-6 h-6" style={{ borderTop: '3px solid #7B4BB7', borderLeft: '3px solid #7B4BB7' }} />
                <div className="absolute top-3 right-3 w-6 h-6" style={{ borderTop: '3px solid #7B4BB7', borderRight: '3px solid #7B4BB7' }} />
                <div className="absolute bottom-3 left-3 w-6 h-6" style={{ borderBottom: '3px solid #7B4BB7', borderLeft: '3px solid #7B4BB7' }} />
                <div className="absolute bottom-3 right-3 w-6 h-6" style={{ borderBottom: '3px solid #7B4BB7', borderRight: '3px solid #7B4BB7' }} />

                {/* Scan line */}
                {scanProgress > 0 && scanProgress < 100 && (
                  <div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #7B4BB7, transparent)',
                      top: `${10 + (scanProgress * 0.8)}%`,
                      transition: 'top 0.1s linear',
                    }}
                  />
                )}

                {/* Scan result overlay */}
                {scanDone && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(123,75,183,0.3)' }}>
                    <div className="text-center p-4">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-white text-xs font-medium">Analysis Complete!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            {scanProgress > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#6B6B8A' }}>
                  <span>Analyzing your skin...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(188,166,230,0.3)' }}>
                  <div className="progress-bar h-full" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}

            {scanDone && (
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-sm font-medium" style={{ color: '#111111' }}>
                  🔍 Your skin appears <strong style={{ color: '#7B4BB7' }}>Combination</strong> with mild <strong style={{ color: '#7B4BB7' }}>Pigmentation</strong>
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!scanProgress && !scanDone && (
                <button
                  onClick={startScan}
                  className="flex-1 py-4 rounded-2xl text-white font-semibold transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
                >
                  Start Scan ✨
                </button>
              )}
              {scanDone && (
                <button
                  onClick={goNext}
                  className="flex-1 py-4 rounded-2xl text-white font-semibold transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
                >
                  Continue →
                </button>
              )}
              <button
                onClick={goNext}
                className="px-6 py-4 rounded-2xl font-medium transition-all active:scale-95 flex items-center gap-1"
                style={{ background: 'rgba(255,255,255,0.75)', color: '#6B6B8A', border: '1px solid rgba(188,166,230,0.4)' }}
              >
                <SkipForward size={16} /> Skip
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Profile Creation */}
        {step === 8 && (
          <div className="flex flex-col gap-6 pt-4">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#111111' }}>Create your profile 🌸</h2>
              <p className="text-sm" style={{ color: '#6B6B8A' }}>Almost there! Set up your account</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#111111' }}>Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: nameError ? '2px solid #ef4444' : '1px solid rgba(188,166,230,0.5)',
                    color: '#111111',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                />
                {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#111111' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@email.com"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.85)',
                    border: emailError ? '2px solid #ef4444' : '1px solid rgba(188,166,230,0.5)',
                    color: '#111111',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl text-white font-semibold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
            >
              Continue with Email ✨
            </button>

            <button
              onClick={() => {
                if (!name.trim()) setName('Guest User');
                if (!email.trim()) setEmail('guest@luminique.app');
                setTimeout(() => {
                  completeOnboarding({
                    name: name.trim() || 'Guest User',
                    email: email.trim() || 'guest@luminique.app',
                    gender,
                    ageRange,
                    skinType: skinType || 'Combination',
                    skinConcerns,
                    routinePreference: routinePreference || 'Both',
                  });
                  navigate({ to: '/home' });
                }, 100);
              }}
              className="w-full py-4 rounded-2xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(188,166,230,0.5)',
                color: '#111111',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs" style={{ color: '#6B6B8A' }}>
              🔒 We never sell your data. Your privacy is our priority.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
