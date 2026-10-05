import React from 'react';
import { Shield } from 'lucide-react';

export const ShieldBadge: React.FC<{ shields: number }> = ({ shields }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanskrit-100 border border-sanskrit-300 text-sanskrit-800 font-bold text-xs shadow-sm">
      <Shield className="w-4 h-4 text-sanskrit-600 fill-sanskrit-200" />
      <span>{shields} Shield{shields === 1 ? '' : 's'}</span>
    </div>
  );
};
