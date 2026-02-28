import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Lock, Shield, Eye, Trash2, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: '📋',
    title: 'Data We Collect',
    content: `We collect only the information you voluntarily provide during onboarding: your name, email address, skin type, skin concerns, and routine preferences. We also store your in-app activity such as routine completion history, GlowPoints, and streak data locally on your device using browser storage (localStorage).`,
  },
  {
    icon: '🎯',
    title: 'How We Use Your Data',
    content: `Your data is used exclusively to personalize your skincare experience within Luminique. This includes generating product recommendations based on your skin type, tracking your routine streaks, calculating GlowPoints, and displaying your progress. We do not use your data for advertising profiling or sell it to third parties under any circumstances.`,
  },
  {
    icon: '🔒',
    title: 'Data Storage & Security',
    content: `All your personal data is stored locally on your device using browser localStorage. No data is transmitted to external servers. This means your information stays on your device and is not accessible to us or any third party. You can clear your data at any time by using the "Reset All Data" option in your profile settings or by clearing your browser's local storage.`,
  },
  {
    icon: '🌍',
    title: 'GDPR & Your Rights',
    content: `Under the General Data Protection Regulation (GDPR) and similar privacy laws, you have the following rights:\n\n• Right to Access: View all data stored about you\n• Right to Rectification: Correct inaccurate personal data\n• Right to Erasure: Delete your data at any time via Profile → Reset All Data\n• Right to Portability: Your data is stored locally and accessible to you\n• Right to Object: Opt out of analytics via Profile → Settings\n\nSince all data is stored locally on your device, you have full control at all times.`,
  },
  {
    icon: '🍪',
    title: 'Cookies & Local Storage',
    content: `Luminique uses browser localStorage (not cookies) to persist your preferences and progress across sessions. This is essential for the app to function — without it, your streak, GlowPoints, and routine history would be lost when you close the browser. We do not use tracking cookies or third-party analytics cookies.`,
  },
  {
    icon: '👶',
    title: 'Children\'s Privacy',
    content: `Luminique is available to users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided personal information, please contact us immediately and we will take steps to remove that information.`,
  },
  {
    icon: '🔄',
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by displaying a notice within the app. Your continued use of Luminique after such changes constitutes your acceptance of the updated policy.`,
  },
  {
    icon: '📧',
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding your privacy or this policy, please contact us at:\n\nprivacy@luminique.app\n\nWe are committed to addressing your concerns promptly and transparently.`,
  },
];

const PrivacyPolicyScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container">
      <div className="screen-content overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/profile' })}
            className="p-2 rounded-full transition-colors"
            style={{ background: 'rgba(123,75,183,0.1)' }}
          >
            <ChevronLeft size={20} style={{ color: '#7B4BB7' }} />
          </button>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#111111' }}>Privacy Policy</h1>
            <p className="text-xs" style={{ color: '#6B6B8A' }}>Last updated: {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Hero Badge */}
        <div
          className="mx-5 mb-5 rounded-3xl p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #7B4BB7, #5B2D91)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <Lock size={28} color="white" />
          </div>
          <div>
            <p className="text-white font-bold text-base mb-0.5">Your Privacy Matters</p>
            <p className="text-white/80 text-xs leading-relaxed">
              We never sell your data. All information stays on your device.
            </p>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
          {[
            { icon: <Shield size={18} style={{ color: '#7ED1B2' }} />, label: 'No Data Selling', desc: 'Ever' },
            { icon: <Eye size={18} style={{ color: '#7B4BB7' }} />, label: 'Full Transparency', desc: 'Always' },
            { icon: <Trash2 size={18} style={{ color: '#D4A843' }} />, label: 'Delete Anytime', desc: 'Your choice' },
            { icon: <Mail size={18} style={{ color: '#BCA6E6' }} />, label: 'No Spam', desc: 'Opt-in only' },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-3 flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(123,75,183,0.08)' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#111111' }}>{item.label}</p>
                <p className="text-[10px]" style={{ color: '#6B6B8A' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Sections */}
        <div className="px-5 mb-6 flex flex-col gap-4">
          {SECTIONS.map((section, i) => (
            <div key={i} className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{section.icon}</span>
                <h2 className="text-sm font-semibold" style={{ color: '#111111' }}>{section.title}</h2>
              </div>
              <p
                className="text-xs leading-relaxed whitespace-pre-line"
                style={{ color: '#6B6B8A' }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Badge */}
        <div
          className="mx-5 mb-4 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(126,209,178,0.15)', border: '1px solid rgba(126,209,178,0.4)' }}
        >
          <Lock size={20} style={{ color: '#5B8A5B' }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: '#5B8A5B' }}>
              🔒 We never sell your data
            </p>
            <p className="text-[10px]" style={{ color: '#5B8A5B' }}>
              Your skincare journey is private and secure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-5 mb-6 text-center">
          <p className="text-xs" style={{ color: '#6B6B8A' }}>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'luminique')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
              style={{ color: '#7B4BB7' }}
            >
              caffeine.ai
            </a>{' '}
            · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;
