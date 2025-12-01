"use client";

import { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full min-h-[200px] p-4 rounded-xl
            bg-[var(--card)] border border-[var(--border)]
            focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
            resize-y font-mono text-sm
            placeholder:text-[var(--muted-foreground)]
            ${error ? "border-[var(--destructive)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--destructive)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
