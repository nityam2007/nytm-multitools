// TimePicker Component | TypeScript
"use client";

import { forwardRef } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
  step?: number; // in seconds
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ value, onChange, label, required = false, min, max, className = "", disabled = false, step }, ref) => {
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
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </label>
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";
