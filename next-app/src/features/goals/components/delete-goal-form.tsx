import { deleteGoalAction } from "@/features/goals/actions/delete-goal";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import type { ButtonProps } from "@/components/ui/button";

export function DeleteGoalForm({
  className,
  goalId,
  idleLabel = "Xóa mục tiêu",
  pendingLabel = "Đang xóa mục tiêu...",
  size,
  variant = "secondary"
}: {
  className?: string;
  goalId: string;
  idleLabel?: string;
  pendingLabel?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  return (
    <form action={deleteGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <ConfirmSubmitButton
        className={className}
        confirmMessage="Bạn có chắc muốn xóa mục tiêu này không? Dữ liệu liên quan có thể bị ẩn khỏi luồng làm việc hiện tại."
        idleLabel={idleLabel}
        pendingLabel={pendingLabel}
        size={size}
        variant={variant}
      />
    </form>
  );
}
