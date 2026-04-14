import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { TaskForm } from "@/features/tasks/components/task-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listProjectOptionsForGoal } from "@/server/modules/projects/queries";

type NewTaskPageProps = {
  params: Promise<{
    goalId: string;
    milestoneId: string;
  }>;
};

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId, milestoneId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    notFound();
  }

  const projectOptions = await listProjectOptionsForGoal(
    userId,
    BigInt(parsedGoalId.data)
  );

  return (
    <PageFormShell
      backHref={`/goals/${parsedGoalId.data}`}
      backLabel="Quay lại mục tiêu"
      description="Tạo công việc mới trong cột mốc đang chọn để đưa vào board ngay."
      eyebrow="Tạo công việc"
      maxWidthClassName="max-w-6xl"
      title="Công việc mới"
    >
      <TaskForm
        cancelHref={`/goals/${parsedGoalId.data}` as Route}
        goalId={parsedGoalId.data}
        key={`${parsedGoalId.data}:${parsedMilestoneId.data}`}
        milestoneId={parsedMilestoneId.data}
        mode="create"
        projectOptions={projectOptions}
      />
    </PageFormShell>
  );
}
