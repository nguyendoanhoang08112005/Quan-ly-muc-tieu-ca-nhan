import type { Route } from "next";
import { notFound } from "next/navigation";
import { GoalForm } from "@/features/goals/components/goal-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { getGoalFormValuesForUser } from "@/server/modules/goals/queries";

type EditGoalPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function EditGoalPage({ params }: EditGoalPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId } = await params;
  const goal = await getGoalFormValuesForUser(userId, BigInt(goalId));

  if (!goal) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <GoalForm
          cancelHref={`/goals/${goalId}` as Route}
          goalId={goalId}
          initialValues={goal}
          mode="edit"
        />
      </div>
    </div>
  );
}
