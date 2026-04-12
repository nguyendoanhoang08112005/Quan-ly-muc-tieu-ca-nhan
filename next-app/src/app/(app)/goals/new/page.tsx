import type { Route } from "next";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { GoalForm } from "@/features/goals/components/goal-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listGoalMetadataOptions } from "@/server/modules/goals/queries";

export default async function NewGoalPage() {
  const userId = await requireAuthenticatedUserId();
  const options = await listGoalMetadataOptions(userId);

  return (
    <PageFormShell
      backHref="/goals"
      backLabel="Quay lại mục tiêu"
      description="Tạo mục tiêu mới, chia theo chặng và gắn ngữ cảnh cần thiết ngay từ đầu."
      eyebrow="Tạo mục tiêu"
      title="Mục tiêu mới"
    >
        <GoalForm
          cancelHref={"/goals" as Route}
          categories={options.categories}
          mode="create"
          tags={options.tags}
        />
    </PageFormShell>
  );
}
