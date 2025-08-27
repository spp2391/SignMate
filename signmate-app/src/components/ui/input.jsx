// ui/input.jsx
import React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={`border rounded-xl p-3 shadow-sm w-full focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
}
