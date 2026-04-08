import { deleteTaskAction } from "@/features/tasks/actions/delete-task";
import { Button } from "@/components/ui/button";

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
      <Button type="submit" variant="destructive">
        Xóa công việc
      </Button>
    </form>
  );
}
