import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sanskrit-600 text-white hover:bg-sanskrit-700 focus:ring-sanskrit-500 shadow-md hover:shadow-lg',
    secondary: 'bg-sanskrit-100 text-sanskrit-800 hover:bg-sanskrit-200 focus:ring-sanskrit-400',
    outline: 'border-2 border-sanskrit-600 text-sanskrit-600 hover:bg-sanskrit-50 focus:ring-sanskrit-500',
    ghost: 'text-charcoal-700 hover:bg-sanskrit-100/60 focus:ring-sanskrit-300',
    gold: 'bg-gradient-to-r from-gold-500 to-gold-600 text-sanskrit-900 font-semibold hover:from-gold-600 hover:to-gold-700 shadow-md hover:shadow-glow',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
