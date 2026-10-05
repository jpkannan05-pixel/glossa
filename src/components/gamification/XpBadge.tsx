import React from 'react';
import { Sparkles } from 'lucide-react';

export const XpBadge: React.FC<{ xp: number }> = ({ xp }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-100/90 border border-gold-300 text-gold-700 font-bold text-xs shadow-sm">
      <Sparkles className="w-4 h-4 fill-gold-500 text-gold-600" />
      <span>{xp} XP</span>
    </div>
  );
};
