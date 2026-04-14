import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { habitIdSchema } from "@/features/habits/schemas/habit-schemas";
import { HabitForm } from "@/features/habits/components/habit-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  getHabitFormValuesForUser,
  listHabitGoalOptionsForUser
} from "@/server/modules/habits/queries";

type EditHabitPageProps = {
  params: Promise<{
    habitId: string;
  }>;
};

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { habitId } = await params;
  const parsedHabitId = habitIdSchema.safeParse(habitId);

  if (!parsedHabitId.success) {
    notFound();
  }

  const [habit, goalOptions] = await Promise.all([
    getHabitFormValuesForUser(userId, BigInt(parsedHabitId.data)),
    listHabitGoalOptionsForUser(userId)
  ]);

  if (!habit) {
    notFound();
  }

  const detailHref = `/habits/${parsedHabitId.data}` as Route;

  return (
    <PageFormShell
      backHref={detailHref}
      backLabel="Quay lại thói quen"
      description="Điều chỉnh tín hiệu đạt, nhịp ghi và trạng thái theo dõi mà vẫn thấy ngay bức tranh sau khi lưu."
      eyebrow="Sửa thói quen"
      maxWidthClassName="max-w-6xl"
      title="Cập nhật thói quen"
    >
      <HabitForm
        cancelHref={detailHref}
        goalOptions={goalOptions}
        habitId={parsedHabitId.data}
        initialValues={habit}
        key={parsedHabitId.data}
        mode="edit"
      />
    </PageFormShell>
  );
}
