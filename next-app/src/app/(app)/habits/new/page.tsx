import { HabitForm } from "@/features/habits/components/habit-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listHabitGoalOptionsForUser } from "@/server/modules/habits/queries";

export default async function NewHabitPage() {
  const userId = await requireAuthenticatedUserId();
  const goalOptions = await listHabitGoalOptionsForUser(userId);

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <HabitForm cancelHref="/habits" goalOptions={goalOptions} mode="create" />
    </div>
  );
}
