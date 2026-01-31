"use client";

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, fullWidth = false }) => {
  return (
    <div className={`py-3 ${fullWidth ? 'w-full' : ''}`}>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
