import { deleteTaskAction } from "@/features/tasks/actions/delete-task";
import { Button } from "@/components/ui/button";

export function DeleteTaskForm({
  goalId,
  taskId
}: {
  goalId: string;
  taskId: string;
}) {
  return (
    <form action={deleteTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <input name="taskId" type="hidden" value={taskId} />
      <Button type="submit" variant="destructive">
        Xoa task
      </Button>
    </form>
  );
}
