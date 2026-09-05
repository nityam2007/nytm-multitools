// Multiline input with an accessible label, character count and validation | TypeScript
"use client";
import { forwardRef, useId } from "react";
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string; helperText?: string; charCount?: boolean;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({
  label, error, helperText, charCount = false, className = "", value, maxLength, id, ...props
}, ref) {
  const generated = useId();
  const fieldId = id || generated;
  const count = typeof value === "string" ? value.length : 0;
  const describedBy = [props["aria-describedby"], error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="field w-full">
    {(label || charCount) && <div className="field-heading">
      {label && <label htmlFor={fieldId} className="field-label">{label}</label>}
      {charCount && <span className="field-count">{count}{maxLength ? ` / ${maxLength}` : ""} characters</span>}
    </div>}
    <textarea {...props} ref={ref} id={fieldId} value={value} maxLength={maxLength}
      aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy}
      className={`field-control field-textarea font-mono ${className}`} />
    {error ? <p id={`${fieldId}-error`} className="field-error" role="alert">{error}</p>
      : helperText && <p id={`${fieldId}-help`} className="field-help">{helperText}</p>}
  </div>;
});
