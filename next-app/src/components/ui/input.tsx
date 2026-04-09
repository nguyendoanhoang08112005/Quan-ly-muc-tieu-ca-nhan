import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-9 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 transition outline-none placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
