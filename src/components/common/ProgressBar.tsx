import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  height?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 'h-2.5',
  colorClass = 'bg-sanskrit-600',
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-charcoal-700 mb-1">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-sanskrit-200/70 rounded-full overflow-hidden', height)}>
        <div
          className={clsx('h-full transition-all duration-500 ease-out rounded-full', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
