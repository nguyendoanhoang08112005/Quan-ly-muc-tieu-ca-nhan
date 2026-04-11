import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { TaskForm } from "@/features/tasks/components/task-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
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
    <div className="mx-auto max-w-6xl space-y-4">
      <Link
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "gap-2 rounded-full"
        )}
        href={`/goals/${parsedGoalId.data}` as Route}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại mục tiêu
      </Link>

      <div className="rounded-[2rem] border border-stone-200/80 bg-white/70 p-3 shadow-[0_20px_50px_-42px_rgba(120,113,108,0.42)] backdrop-blur sm:p-4">
        <TaskForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          milestoneId={parsedMilestoneId.data}
          mode="create"
          projectOptions={projectOptions}
        />
      </div>
    </div>
  );
}
