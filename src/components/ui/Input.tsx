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
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        {...props}
        className="border rounded px-3 py-1.5"
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}