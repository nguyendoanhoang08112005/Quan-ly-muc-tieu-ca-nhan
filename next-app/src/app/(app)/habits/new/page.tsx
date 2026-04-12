import { PageFormShell } from "@/components/shared/app-page-patterns";
import { HabitForm } from "@/features/habits/components/habit-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listHabitGoalOptionsForUser } from "@/server/modules/habits/queries";

export default async function NewHabitPage() {
  const userId = await requireAuthenticatedUserId();
  const goalOptions = await listHabitGoalOptionsForUser(userId);

  return (
    <PageFormShell
      backHref="/habits"
      backLabel="Quay lại thói quen"
      description="Tạo thói quen mới, chọn nhịp lặp và gắn vào mục tiêu nếu cần."
      eyebrow="Tạo thói quen"
      maxWidthClassName="max-w-4xl"
      title="Thói quen mới"
    >
      <HabitForm cancelHref="/habits" goalOptions={goalOptions} mode="create" />
    </PageFormShell>
  );
}
