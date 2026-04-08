import { deleteGoalAction } from "@/features/goals/actions/delete-goal";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

export function DeleteGoalForm({ goalId }: { goalId: string }) {
  return (
    <form action={deleteGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa mục tiêu này không? Dữ liệu liên quan có thể bị ẩn khỏi luồng làm việc hiện tại."
        idleLabel="Xóa mục tiêu"
        pendingLabel="Đang xóa mục tiêu..."
        variant="secondary"
      />
    </form>
  );
}
