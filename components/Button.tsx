// Shared action button with visible states and stable loading labels | TypeScript
"use client";
import { forwardRef } from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg"; loading?: boolean; icon?: React.ReactNode;
  iconPosition?: "left" | "right"; fullWidth?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  children, variant = "primary", size = "md", loading = false, icon,
  iconPosition = "left", fullWidth = false, className = "", disabled, type = "button", ...props
}, ref) {
  return <button {...props} ref={ref} type={type} disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={`ui-button ui-button--${variant} ui-button--${size} ${fullWidth ? "w-full" : ""} ${className}`}>
    {loading && <span aria-hidden="true" className="button-spinner" />}
    {icon && iconPosition === "left" && !loading && <span aria-hidden="true">{icon}</span>}
    <span>{children}</span>
    {icon && iconPosition === "right" && <span aria-hidden="true">{icon}</span>}
    {loading && <span className="sr-only">Loading</span>}
  </button>;
});
