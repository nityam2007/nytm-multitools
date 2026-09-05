// Native select with connected label, help and error states | TypeScript
"use client";
import { forwardRef, useId } from "react";
interface SelectOption { value: string; label: string; }
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; helperText?: string; options: SelectOption[]; fullWidth?: boolean;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({
  label, error, helperText, options, fullWidth = true, className = "", id, ...props
}, ref) {
  const generated = useId();
  const fieldId = id || generated;
  const describedBy = [props["aria-describedby"], error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : ""].filter(Boolean).join(" ") || undefined;
  return <div className={`field ${fullWidth ? "w-full" : ""}`}>
    {label && <label htmlFor={fieldId} className="field-label">{label}</label>}
    <select {...props} ref={ref} id={fieldId} className={`field-control select-modern ${className}`}
      aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error ? <p id={`${fieldId}-error`} className="field-error" role="alert">{error}</p>
      : helperText && <p id={`${fieldId}-help`} className="field-help">{helperText}</p>}
  </div>;
});
