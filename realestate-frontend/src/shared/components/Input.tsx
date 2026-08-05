import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-lg border px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-slate ${
            error ? "border-clay" : "border-line"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-clay">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";