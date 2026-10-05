import React from 'react';
import { Button } from './Button';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white/70 border border-sanskrit-200/60 rounded-2xl shadow-card my-4">
      <div className="w-16 h-16 rounded-2xl bg-sanskrit-100 flex items-center justify-center text-sanskrit-700 mb-4 shadow-inner">
        {icon || <Sparkles className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">{title}</h3>
      <p className="text-sm text-charcoal-500 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
