import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = true }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl border border-sanskrit-200/60 p-6 shadow-card transition-all duration-300',
        hoverEffect && onClick && 'cursor-pointer hover:-translate-y-1 hover:border-sanskrit-500/40 hover:shadow-soft',
        className
      )}
    >
      {children}
    </div>
  );
};
