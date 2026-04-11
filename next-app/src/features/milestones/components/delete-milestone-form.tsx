import { deleteMilestoneAction } from "@/features/milestones/actions/delete-milestone";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import type { ButtonProps } from "@/components/ui/button";

export function DeleteMilestoneForm({
  className,
  goalId,
  idleLabel = "Xóa cột mốc",
  milestoneId,
  pendingLabel = "Đang xóa cột mốc...",
  size,
  variant = "destructive"
}: {
  className?: string;
  goalId: string;
  idleLabel?: string;
  milestoneId: string;
  pendingLabel?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}) {
  return (
    <form action={deleteMilestoneAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <input name="milestoneId" type="hidden" value={milestoneId} />
      <ConfirmSubmitButton
        className={className}
        confirmMessage="Bạn có chắc muốn xóa cột mốc này không? Các công việc nằm trong cột mốc sẽ bị ảnh hưởng."
        idleLabel={idleLabel}
        pendingLabel={pendingLabel}
        size={size}
        variant={variant}
      />
    </form>
  );
}
