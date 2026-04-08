"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildHabitFormErrorState,
  type HabitFormActionState,
  readHabitFormValues
} from "@/features/habits/actions/shared";
import { habitFormSchema } from "@/features/habits/schemas/habit-schemas";
import { createHabitForUser } from "@/server/modules/habits/mutations";

export async function createHabitAction(
  _previousState: HabitFormActionState,
  formData: FormData
): Promise<HabitFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readHabitFormValues(formData);
  const parsed = habitFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildHabitFormErrorState(
      values,
      "Du lieu habit chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const habitId = await createHabitForUser(userId, parsed.data);

  if (!habitId) {
    return buildHabitFormErrorState(
      values,
      "Goal duoc lien ket voi habit khong hop le."
    );
  }

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  redirect(`/habits/${habitId}` as Route);
}
