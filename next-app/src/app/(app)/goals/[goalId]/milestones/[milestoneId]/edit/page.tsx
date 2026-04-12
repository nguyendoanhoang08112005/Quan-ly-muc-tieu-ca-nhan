import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { MilestoneForm } from "@/features/milestones/components/milestone-form";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { getMilestoneFormValuesForUser } from "@/server/modules/milestones/queries";

type EditMilestonePageProps = {
  params: Promise<{
    goalId: string;
    milestoneId: string;
  }>;
};

export default async function EditMilestonePage({
  params
}: EditMilestonePageProps) {
  const userId = await requireAuthenticatedUserId();
  const { goalId, milestoneId } = await params;
  const parsedGoalId = goalIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    notFound();
  }

  const milestone = await getMilestoneFormValuesForUser(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedMilestoneId.data)
  );

  if (!milestone) {
    notFound();
  }

  return (
    <PageFormShell
      backHref={`/goals/${parsedGoalId.data}`}
      backLabel="Quay lại mục tiêu"
      description="Cập nhật tiêu đề, thời gian và trạng thái của cột mốc này."
      eyebrow="Sửa cột mốc"
      title="Cập nhật cột mốc"
    >
        <MilestoneForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          initialValues={milestone}
          milestoneId={parsedMilestoneId.data}
          mode="edit"
        />
    </PageFormShell>
  );
}
