"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700",
        className
      )}
      {...props}
    />
  );
}
