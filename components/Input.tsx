"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = "left",
      fullWidth = true,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-[var(--card)] border-2 border-[var(--border)]
              focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
              transition-all duration-300
              placeholder:text-[var(--muted-foreground)]
              shadow-sm hover:shadow-md
              ${icon && iconPosition === "left" ? "pl-11" : ""}
              ${icon && iconPosition === "right" ? "pr-11" : ""}
              ${error ? "border-[var(--destructive)] focus:ring-red-500/20 focus:border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          
          {icon && iconPosition === "right" && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
              {icon}
            </div>
          )}
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

Input.displayName = "Input";
