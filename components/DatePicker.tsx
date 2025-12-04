// DatePicker Component | TypeScript
"use client";

import { forwardRef } from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, label, required = false, min, max, className = "", disabled = false }, ref) => {
    return (
      <div className={className}>
        {label && (
          <div className="block text-sm font-medium mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </div>
        )}
        <label className="relative block cursor-pointer">
          <input
            ref={ref}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </label>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
