import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'maroon' | 'gold' | 'green' | 'amber' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'maroon', size = 'md', className = '' }) => {
  const styles = {
    maroon: 'bg-sanskrit-100 text-sanskrit-800 border border-sanskrit-300',
    gold: 'bg-gold-100 text-gold-700 border border-gold-300 font-semibold',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full tracking-wide', styles[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
