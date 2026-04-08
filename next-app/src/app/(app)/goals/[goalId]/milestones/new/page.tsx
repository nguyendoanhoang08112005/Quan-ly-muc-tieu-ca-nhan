import type { Route } from "next";
import { notFound } from "next/navigation";
import { MilestoneForm } from "@/features/milestones/components/milestone-form";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";

type NewMilestonePageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function NewMilestonePage({
  params
}: NewMilestonePageProps) {
  const { goalId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);

  if (!parsedGoalId.success) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <MilestoneForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          mode="create"
        />
      </div>
    </div>
  );
}
