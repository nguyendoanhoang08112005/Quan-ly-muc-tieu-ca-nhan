import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { GoalForm } from "@/features/goals/components/goal-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  getGoalFormValuesForUser,
  listGoalMetadataOptions
} from "@/server/modules/goals/queries";

type EditGoalPageProps = {
  params: Promise<{
    goalId: string;
  }>;
};

export default async function EditGoalPage({ params }: EditGoalPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId } = await params;
  const [goal, options] = await Promise.all([
    getGoalFormValuesForUser(userId, BigInt(goalId)),
    listGoalMetadataOptions(userId)
  ]);

  if (!goal) {
    notFound();
  }

  return (
    <PageFormShell
      backHref={`/goals/${goalId}`}
      backLabel="Quay lại mục tiêu"
      description="Chỉnh lại đích đến, mức ưu tiên và khung thời gian của mục tiêu hiện tại."
      eyebrow="Sửa mục tiêu"
      title="Cập nhật mục tiêu"
    >
        <GoalForm
          cancelHref={`/goals/${goalId}` as Route}
          categories={options.categories}
          goalId={goalId}
          initialValues={goal}
          mode="edit"
          tags={options.tags}
        />
    </PageFormShell>
  );
}
