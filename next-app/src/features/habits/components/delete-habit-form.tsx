import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { deleteHabitAction } from "@/features/habits/actions/delete-habit";

export function DeleteHabitForm({ habitId }: { habitId: string }) {
  return (
    <form action={deleteHabitAction}>
      <input name="habitId" type="hidden" value={habitId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa thói quen này không? Nhật ký liên quan sẽ không còn xuất hiện trong giao diện."
        idleLabel="Xóa thói quen"
        pendingLabel="Đang xóa thói quen..."
        variant="destructive"
      />
    </form>
  );
}
