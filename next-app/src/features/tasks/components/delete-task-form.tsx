import { deleteTaskAction } from "@/features/tasks/actions/delete-task";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import type { ButtonProps } from "@/components/ui/button";

export function DeleteTaskForm({
  className,
  goalId,
  idleLabel = "Xóa công việc",
  pendingLabel = "Đang xóa công việc...",
  projectId,
  size = "default",
  taskId,
  variant = "destructive"
}: {
  className?: string;
  goalId: string;
  idleLabel?: string;
  pendingLabel?: string;
  projectId?: string | null;
  size?: ButtonProps["size"];
  taskId: string;
  variant?: ButtonProps["variant"];
}) {
  return (
    <form action={deleteTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}
      <input name="taskId" type="hidden" value={taskId} />
      <ConfirmSubmitButton
        className={className}
        confirmMessage="Bạn có chắc muốn xóa công việc này không? Tiến độ liên quan sẽ được tính lại."
        idleLabel={idleLabel}
        pendingLabel={pendingLabel}
        size={size}
        variant={variant}
      />
    </form>
  );
}
