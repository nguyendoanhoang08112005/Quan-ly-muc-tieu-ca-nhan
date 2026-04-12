import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
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
    <PageFormShell
      backHref={`/goals/${parsedGoalId.data}`}
      backLabel="Quay lại mục tiêu"
      description="Thêm chặng mới để tách mục tiêu lớn thành các phần dễ làm hơn."
      eyebrow="Tạo cột mốc"
      title="Cột mốc mới"
    >
        <MilestoneForm
          cancelHref={`/goals/${parsedGoalId.data}` as Route}
          goalId={parsedGoalId.data}
          mode="create"
        />
    </PageFormShell>
  );
}
