"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type ConfirmSubmitButtonProps = Pick<
  ButtonProps,
  "className" | "size" | "variant"
> & {
  confirmMessage: string;
  idleLabel: string;
  pendingLabel?: string;
};

export function ConfirmSubmitButton({
  className,
  confirmMessage,
  idleLabel,
  pendingLabel = "Đang xử lý...",
  size,
  variant
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={className}
      onClick={(event) => {
        if (pending) {
          return;
        }

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      size={size}
      type="submit"
      variant={variant}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
