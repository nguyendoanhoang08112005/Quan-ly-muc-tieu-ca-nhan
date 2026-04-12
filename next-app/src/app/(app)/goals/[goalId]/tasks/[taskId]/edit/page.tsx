import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { TaskForm } from "@/features/tasks/components/task-form";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listProjectOptionsForGoal } from "@/server/modules/projects/queries";
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

  const [task, projectOptions] = await Promise.all([
    getTaskFormValuesForUser(
      userId,
      BigInt(parsedGoalId.data),
      BigInt(parsedTaskId.data)
    ),
    listProjectOptionsForGoal(userId, BigInt(parsedGoalId.data))
  ]);

  if (!task) {
    notFound();
  }

  return (
    <PageFormShell
      backHref={`/goals/${parsedGoalId.data}`}
      backLabel="Quay lại mục tiêu"
      description="Cập nhật trạng thái, hạn hoàn thành và ngữ cảnh của công việc đang chọn."
      eyebrow="Sửa công việc"
      maxWidthClassName="max-w-6xl"
      title="Cập nhật công việc"
    >
        <TaskForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          initialValues={task}
          mode="edit"
          projectOptions={projectOptions}
          taskId={parsedTaskId.data}
        />
    </PageFormShell>
  );
}
