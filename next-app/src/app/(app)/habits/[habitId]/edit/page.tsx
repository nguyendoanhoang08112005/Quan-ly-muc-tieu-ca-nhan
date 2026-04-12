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

  return (
    <PageFormShell
      backHref={`/habits/${parsedHabitId.data}`}
      backLabel="Quay lại thói quen"
      description="Cập nhật mục tiêu lặp, số lượng cần đạt và nhịp nhắc cho thói quen."
      eyebrow="Sửa thói quen"
      maxWidthClassName="max-w-4xl"
      title="Cập nhật thói quen"
    >
      <HabitForm
        cancelHref={`/habits/${parsedHabitId.data}` as Route}
        goalOptions={goalOptions}
        habitId={parsedHabitId.data}
        initialValues={habit}
        mode="edit"
      />
    </PageFormShell>
  );
}
