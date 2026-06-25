import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#122056]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        {...props}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-sm
          bg-white
          transition-all
          outline-none
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 focus:border-[#5B65DC]"
          }
          focus:ring-4
          focus:ring-[#EEEFFD]
          ${className}
        `}
      />
      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}