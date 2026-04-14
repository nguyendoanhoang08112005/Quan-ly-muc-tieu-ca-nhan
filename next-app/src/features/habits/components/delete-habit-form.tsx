import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import type { ButtonProps } from "@/components/ui/button";
import { deleteHabitAction } from "@/features/habits/actions/delete-habit";

export function DeleteHabitForm({
  className,
  habitId,
  idleLabel = "Xóa thói quen",
  pendingLabel = "Đang xóa thói quen...",
  size = "default",
  variant = "destructive"
}: {
  className?: string;
  habitId: string;
  idleLabel?: string;
  pendingLabel?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  return (
    <form action={deleteHabitAction}>
      <input name="habitId" type="hidden" value={habitId} />
      <ConfirmSubmitButton
        className={className}
        confirmMessage="Bạn có chắc muốn xóa thói quen này không? Nhật ký liên quan sẽ không còn xuất hiện trong giao diện."
        idleLabel={idleLabel}
        pendingLabel={pendingLabel}
        size={size}
        variant={variant}
      />
    </form>
  );
}
