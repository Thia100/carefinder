import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "danger";
}

export function Button({ text, variant = "primary", ...props }: ButtonProps) {
  const base =
    "cursor-pointer mt-10 py-2 inline-flex w-full justify-center rounded-2xl transition-colors duration-300";

  const styles = {
    primary: "bg-green-800 text-white hover:bg-green-700 border border-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {text}
    </button>
  );
}
