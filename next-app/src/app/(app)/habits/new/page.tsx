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
      description="Tạo một thói quen có tín hiệu đạt rõ, nhịp ghi phù hợp và xem trước ngay trước khi lưu."
      eyebrow="Tạo thói quen"
      maxWidthClassName="max-w-6xl"
      title="Thói quen mới"
    >
      <HabitForm
        cancelHref="/habits"
        goalOptions={goalOptions}
        key="new-habit"
        mode="create"
      />
    </PageFormShell>
  );
}
