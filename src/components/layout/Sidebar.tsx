import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Target,
  MessageSquare,
  Compass,
  AlertTriangle,
  Award,
  FlaskConical,
  Flame,
  Trophy,
  Landmark,
  User,
  Settings,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Target },
  { path: '/chat', label: 'Chat with GLOSSA', icon: MessageSquare },
  { path: '/mastery', label: 'My Mastery', icon: Compass },
  { path: '/error-patterns', label: 'Error Patterns', icon: AlertTriangle },
  { path: '/missions', label: 'Missions', icon: Award },
  { path: '/linguistic-lab', label: 'Linguistic Lab', icon: FlaskConical },
  { path: '/streak', label: 'Streak', icon: Flame },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/culture', label: 'Sanskrit Culture', icon: Landmark },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={clsx(
          'fixed lg:static top-0 left-0 z-40 h-full w-64 bg-white border-r border-sanskrit-200/80 flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-sanskrit-100 lg:hidden">
          <span className="font-serif-heading font-bold text-sanskrit-900 text-lg">GLOSSA Navigation</span>
          <button onClick={onClose} className="p-1 rounded-lg text-charcoal-500 hover:bg-sanskrit-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150',
                    isActive
                      ? 'bg-sanskrit-600 text-white shadow-sm font-semibold'
                      : 'text-charcoal-700 hover:bg-sanskrit-100/70 hover:text-sanskrit-900'
                  )
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Tagline inside Sidebar */}
        <div className="p-4 border-t border-sanskrit-100 bg-sanskrit-50/50">
          <p className="text-[11px] font-semibold font-serif-heading text-sanskrit-800 text-center">
            "संस्कृतेन सम्भाषणं कुरु"
          </p>
          <p className="text-[10px] text-charcoal-500 text-center mt-0.5">
            Understand Sanskrit.
          </p>
        </div>
      </aside>
    </>
  );
};
