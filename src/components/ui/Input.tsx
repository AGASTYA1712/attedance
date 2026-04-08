import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none transition-all
          focus:border-[#202A36] focus:ring-4 focus:ring-[#202A36]/5
          placeholder:text-gray-400 text-gray-900
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/5' : ''}
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 ml-1">{error}</span>
      )}
    </div>
  );
};
