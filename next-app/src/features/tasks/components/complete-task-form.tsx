import { completeTaskAction } from "@/features/tasks/actions/complete-task";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import type { ButtonProps } from "@/components/ui/button";

export function CompleteTaskForm({
  className,
  disabled,
  goalId,
  idleLabel = "Hoàn thành",
  pendingLabel = "Đang hoàn thành...",
  projectId,
  size = "default",
  taskId,
  variant = "secondary"
}: {
  className?: string;
  disabled?: boolean;
  goalId: string;
  idleLabel?: string;
  pendingLabel?: string;
  projectId?: string | null;
  size?: ButtonProps["size"];
  taskId: string;
  variant?: ButtonProps["variant"];
}) {
  return (
    <form action={completeTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}
      <input name="taskId" type="hidden" value={taskId} />
      <PendingSubmitButton
        className={className}
        disabled={disabled}
        idleLabel={idleLabel}
        pendingLabel={pendingLabel}
        size={size}
        variant={variant}
      />
    </form>
  );
}
