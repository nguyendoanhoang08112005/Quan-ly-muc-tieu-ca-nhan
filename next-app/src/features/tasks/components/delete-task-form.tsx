import { deleteTaskAction } from "@/features/tasks/actions/delete-task";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";

export function DeleteTaskForm({
  goalId,
  projectId,
  taskId
}: {
  goalId: string;
  projectId?: string | null;
  taskId: string;
}) {
  return (
    <form action={deleteTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}
      <input name="taskId" type="hidden" value={taskId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa công việc này không? Tiến độ liên quan sẽ được tính lại."
        idleLabel="Xóa công việc"
        pendingLabel="Đang xóa công việc..."
        variant="destructive"
      />
    </form>
  );
}
