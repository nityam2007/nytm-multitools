"use client";

import { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, charCount = false, className = "", value, maxLength, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;
    
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">{label}</label>
            {charCount && (
              <span className="text-xs text-[var(--muted-foreground)] tabular-nums font-mono">
                {currentLength}{maxLength ? ` / ${maxLength}` : ''} characters
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={`
              w-full min-h-[240px] p-4 rounded-2xl
              bg-[var(--card)] border-2 border-[var(--border)]
              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
              resize-y font-mono text-sm
              placeholder:text-[var(--muted-foreground)] placeholder:font-sans
              transition-all duration-300
              shadow-sm hover:shadow-md
              ${error ? "border-[var(--destructive)] focus:ring-red-500/20 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          {/* Decorative corner accent */}
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[var(--border)] rounded-br-lg opacity-30 pointer-events-none" />
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--destructive)] animate-fade-slide-up">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--muted-foreground)]" style={{ lineHeight: '1.5' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
