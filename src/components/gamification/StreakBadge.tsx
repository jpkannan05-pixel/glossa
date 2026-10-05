import React from 'react';
import { Flame } from 'lucide-react';

export const StreakBadge: React.FC<{ streak: number }> = ({ streak }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs shadow-sm">
      <Flame className="w-4 h-4 fill-orange-500 text-orange-600 animate-pulse" />
      <span>{streak} Day Streak</span>
    </div>
  );
};
