import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export function Button({ text, ...props }: ButtonProps) {
  return (
    <>
      <button
        className="cursor-pointer mt-10 py-1 inline-flex w-full justify-center border border-white bg-green-800 text-white rounded-2xl hover:bg-green-700 transition-colors ease-in-out duration-500"
        {...props}
      >
        {text}
      </button>
    </>
  );
}
