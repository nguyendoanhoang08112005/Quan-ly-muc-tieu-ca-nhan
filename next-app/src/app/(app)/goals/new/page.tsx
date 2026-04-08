import type { Route } from "next";
import { GoalForm } from "@/features/goals/components/goal-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listGoalMetadataOptions } from "@/server/modules/goals/queries";

export default async function NewGoalPage() {
  const userId = await requireAuthenticatedUserId();
  const options = await listGoalMetadataOptions(userId);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <GoalForm
          cancelHref={"/goals" as Route}
          categories={options.categories}
          mode="create"
          tags={options.tags}
        />
      </div>
    </div>
  );
}
