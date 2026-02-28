import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Sparkles, ShoppingBag, Users, User } from 'lucide-react';

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/routine', icon: Sparkles, label: 'Routine' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="bottom-nav">
      <div
        className="glass-card border-t"
        style={{ borderColor: 'rgba(188, 166, 230, 0.3)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => navigate({ to: path })}
                className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center px-3 py-1 rounded-2xl transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(123, 75, 183, 0.12)' : 'transparent',
                }}
              >
                <Icon
                  size={22}
                  style={{
                    color: isActive ? '#7B4BB7' : '#6B6B8A',
                    strokeWidth: isActive ? 2.5 : 1.8,
                  }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#7B4BB7' : '#6B6B8A' }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomTabBar;
