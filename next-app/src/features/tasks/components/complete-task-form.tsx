import { completeTaskAction } from "@/features/tasks/actions/complete-task";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CompleteTaskForm({
  className,
  disabled,
  goalId,
  projectId,
  size = "default",
  taskId,
}: {
  className?: string;
  disabled?: boolean;
  goalId: string;
  projectId?: string | null;
  size?: ButtonProps["size"];
  taskId: string;
}) {
  return (
    <form action={completeTaskAction}>
      <input name="goalId" type="hidden" value={goalId} />
      {projectId ? <input name="projectId" type="hidden" value={projectId} /> : null}
      <input name="taskId" type="hidden" value={taskId} />
      <Button
        className={cn(className)}
        disabled={disabled}
        size={size}
        type="submit"
        variant="secondary"
      >
        Hoàn thành
      </Button>
    </form>
  );
}
