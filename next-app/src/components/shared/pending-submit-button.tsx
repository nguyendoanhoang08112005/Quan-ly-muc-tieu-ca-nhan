"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type PendingSubmitButtonProps = Pick<
  ButtonProps,
  "className" | "disabled" | "size" | "variant"
> & {
  idleLabel: string;
  pendingLabel?: string;
};

export function PendingSubmitButton({
  className,
  disabled,
  idleLabel,
  pendingLabel = "Đang xử lý...",
  size,
  variant
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-busy={pending}
      className={className}
      disabled={disabled || pending}
      size={size}
      type="submit"
      variant={variant}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
