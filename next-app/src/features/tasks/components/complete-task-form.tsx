import { completeTaskAction } from "@/features/tasks/actions/complete-task";
import { Button } from "@/components/ui/button";

export function CompleteTaskForm({
  goalId,
  projectId,
  taskId,
  disabled
}: {
  goalId: string;
  projectId?: string | null;
  taskId: string;
  disabled?: boolean;
}) {
  return (
    <form action={completeTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}
      <input name="taskId" type="hidden" value={taskId} />
      <Button disabled={disabled} type="submit" variant="secondary">
        Hoàn thành
      </Button>
    </form>
  );
}
