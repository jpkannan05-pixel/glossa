import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { XpBadge } from '../gamification/XpBadge';
import { StreakBadge } from '../gamification/StreakBadge';
import { ShieldBadge } from '../gamification/ShieldBadge';
import { BookOpen, User as UserIcon, LogOut, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sanskrit-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          {user && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-sanskrit-700 hover:bg-sanskrit-100 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-sanskrit-600 flex items-center justify-center text-white font-bold font-serif-heading text-xl shadow-md group-hover:bg-sanskrit-700 transition-colors">
              ग्लो
            </div>
            <div>
              <span className="text-xl font-bold font-serif-heading text-sanskrit-900 tracking-wider">GLOSSA</span>
              <span className="hidden sm:block text-[10px] text-sanskrit-600 font-medium tracking-widest uppercase">Adaptive Sanskrit</span>
            </div>
          </Link>
        </div>

        {/* Center/Right Gamification Badges for Logged-In User */}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <XpBadge xp={user.xp} />
              <StreakBadge streak={user.streak} />
              <ShieldBadge shields={user.shields} />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-sanskrit-200 hover:bg-sanskrit-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-sanskrit-200 flex items-center justify-center text-sanskrit-800 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-semibold text-charcoal-900 pr-1">
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sanskrit-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-sanskrit-100">
                    <p className="text-xs text-charcoal-500 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-sanskrit-900 truncate">{user.name}</p>
                    <p className="text-xs text-sanskrit-600 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-sanskrit-50"
                  >
                    <UserIcon className="w-4 h-4 text-sanskrit-600" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-sanskrit-50"
                  >
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-sanskrit-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Start Learning</Button>
            </Link>
          </div>
        )}

      </div>
    </header>
  );
};
