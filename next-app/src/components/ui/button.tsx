import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "ui-dark-cta bg-stone-950 !text-white shadow-[0_10px_24px_rgba(28,25,23,0.16)] hover:bg-stone-800",
        secondary:
          "ui-light-cta border border-[color:var(--border)] bg-white/80 !text-stone-950 shadow-sm backdrop-blur hover:bg-white",
        ghost: "text-stone-700 hover:bg-white/70 hover:text-stone-950",
        destructive: "ui-dark-cta bg-rose-600 !text-white hover:bg-rose-700"
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-4.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, style, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={style}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
