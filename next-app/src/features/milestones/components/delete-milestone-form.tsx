import { deleteMilestoneAction } from "@/features/milestones/actions/delete-milestone";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

export function DeleteMilestoneForm({
  goalId,
  milestoneId
}: {
  goalId: string;
  milestoneId: string;
}) {
  return (
    <form action={deleteMilestoneAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <input name="milestoneId" type="hidden" value={milestoneId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa cột mốc này không? Các công việc nằm trong cột mốc sẽ bị ảnh hưởng."
        idleLabel="Xóa cột mốc"
        pendingLabel="Đang xóa cột mốc..."
        variant="destructive"
      />
    </form>
  );
}
