"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium
      rounded-xl transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
      ${fullWidth ? "w-full" : ""}
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-violet-500 to-purple-600 text-white
        shadow-lg shadow-violet-500/25
        hover:shadow-violet-500/40 hover:-translate-y-0.5 hover:scale-[1.02]
        active:scale-[0.98]
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-violet-600 before:to-purple-700
        before:opacity-0 before:transition-opacity before:duration-300 before:z-0
        hover:before:opacity-100
      `,
      secondary: `
        bg-[var(--muted)] text-[var(--foreground)]
        border border-[var(--border)]
        hover:bg-violet-500/10 hover:border-violet-500/50 hover:text-violet-500
        hover:-translate-y-0.5 hover:shadow-md
        active:scale-[0.98]
      `,
      outline: `
        bg-transparent text-[var(--foreground)]
        border-2 border-[var(--border)]
        hover:border-violet-500 hover:bg-violet-500/5 hover:text-violet-500
        hover:-translate-y-0.5
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-[var(--foreground)]
        hover:bg-[var(--muted)] hover:text-violet-500
        active:scale-[0.95]
      `,
      destructive: `
        bg-gradient-to-r from-red-500 to-red-600 text-white
        shadow-lg shadow-red-500/25
        hover:shadow-red-500/40 hover:-translate-y-0.5
        active:scale-[0.98]
      `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 relative z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="relative z-10">{icon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {icon && iconPosition === "right" && !loading && (
          <span className="relative z-10">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
