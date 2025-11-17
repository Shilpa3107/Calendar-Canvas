"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn("truncate", !selectedOption && "text-neutral-500")}>
          {selectedOption ? selectedOption.label : placeholder || 'Select...'}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white p-1 shadow-lg animate-fade-in"
        >
          <ul>
            {options.map(option => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-neutral-100 data-[selected=true]:bg-neutral-100"
                onClick={() => handleSelect(option.value)}
                data-selected={value === option.value}
              >
                {value === option.value && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { Select };
