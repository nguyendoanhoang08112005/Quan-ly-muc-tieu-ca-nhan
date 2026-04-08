import type { Route } from "next";
import { notFound } from "next/navigation";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { TaskForm } from "@/features/tasks/components/task-form";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { getTaskFormValuesForUser } from "@/server/modules/tasks/queries";

type EditTaskPageProps = {
  params: Promise<{
    goalId: string;
    taskId: string;
  }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId, taskId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);
  const parsedTaskId = taskIdSchema.safeParse(taskId);

  if (!parsedGoalId.success || !parsedTaskId.success) {
    notFound();
  }

  const task = await getTaskFormValuesForUser(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedTaskId.data)
  );

  if (!task) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <TaskForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          initialValues={task}
          mode="edit"
          taskId={parsedTaskId.data}
        />
      </div>
    </div>
  );
}
