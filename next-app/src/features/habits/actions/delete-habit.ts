"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { habitIdSchema } from "@/features/habits/schemas/habit-schemas";
import { softDeleteHabitForUser } from "@/server/modules/habits/mutations";

export async function deleteHabitAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const habitId = formData.get("habitId");
  const parsedHabitId = habitIdSchema.safeParse(habitId);

  if (!parsedHabitId.success) {
    redirect("/habits");
  }

  await softDeleteHabitForUser(userId, BigInt(parsedHabitId.data));

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  redirect("/habits");
}
