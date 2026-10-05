import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading GLOSSA...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[250px]">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-sanskrit-200 border-t-sanskrit-600 rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-8 h-8 border-4 border-gold-300 border-t-gold-500 rounded-full animate-spin direction-reverse"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-sanskrit-700 tracking-wide font-serif-heading">{label}</p>
    </div>
  );
};
