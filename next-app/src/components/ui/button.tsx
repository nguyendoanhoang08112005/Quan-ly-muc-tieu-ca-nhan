import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "ui-dark-cta bg-stone-950 !text-white hover:bg-stone-800",
        secondary:
          "ui-light-cta border border-stone-300 bg-white !text-stone-950 hover:bg-stone-100",
        ghost: "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
        destructive: "ui-dark-cta bg-rose-600 !text-white hover:bg-rose-700"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8"
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
    const resolvedVariant = variant ?? "default";
    const resolvedStyle =
      resolvedVariant === "default" || resolvedVariant === "destructive"
        ? {
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            ...style
          }
        : resolvedVariant === "secondary"
          ? {
              color: "#1c1917",
              WebkitTextFillColor: "#1c1917",
              ...style
            }
          : style;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={resolvedStyle}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
