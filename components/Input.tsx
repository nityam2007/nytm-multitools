// Labelled text input with associated help and validation | TypeScript
"use client";
import { forwardRef, useId } from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; helperText?: string; icon?: React.ReactNode;
  iconPosition?: "left" | "right"; fullWidth?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  label, error, helperText, icon, iconPosition = "left", fullWidth = true,
  className = "", type = "text", id, ...props
}, ref) {
  const generated = useId();
  const fieldId = id || generated;
  const describedBy = [props["aria-describedby"], error ? `${fieldId}-error` : helperText ? `${fieldId}-help` : ""].filter(Boolean).join(" ") || undefined;
  return <div className={`field ${fullWidth ? "w-full" : ""}`}>
    {label && <label htmlFor={fieldId} className="field-label">{label}</label>}
    <div className="field-input-wrap">
      {icon && <span aria-hidden="true" className={`field-icon field-icon--${iconPosition}`}>{icon}</span>}
      <input {...props} ref={ref} type={type} id={fieldId}
        aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy}
        className={`field-control ${icon ? `field-control--icon-${iconPosition}` : ""} ${className}`} />
    </div>
    {error ? <p id={`${fieldId}-error`} className="field-error" role="alert">{error}</p>
      : helperText && <p id={`${fieldId}-help`} className="field-help">{helperText}</p>}
  </div>;
});
