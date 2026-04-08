import type { Route } from "next";
import { notFound } from "next/navigation";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { TaskForm } from "@/features/tasks/components/task-form";

type NewTaskPageProps = {
  params: Promise<{
    goalId: string;
    milestoneId: string;
  }>;
};

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const { goalId, milestoneId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <TaskForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          milestoneId={parsedMilestoneId.data}
          mode="create"
        />
      </div>
    </div>
  );
}
