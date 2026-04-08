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
import { habitFormSchema, habitIdSchema } from "@/features/habits/schemas/habit-schemas";
import { updateHabitForUser } from "@/server/modules/habits/mutations";

export async function updateHabitAction(
  _previousState: HabitFormActionState,
  formData: FormData
): Promise<HabitFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const habitId = formData.get("habitId");
  const parsedHabitId = habitIdSchema.safeParse(habitId);
  const values = readHabitFormValues(formData);
  const parsed = habitFormSchema.safeParse(values);

  if (!parsedHabitId.success) {
    return buildHabitFormErrorState(values, "Thói quen không hợp lệ.");
  }

  if (!parsed.success) {
    return buildHabitFormErrorState(
      values,
      "Dữ liệu thói quen chưa hợp lệ.",
      parsed.error.flatten().fieldErrors
    );
  }

  const updatedHabitId = await updateHabitForUser(
    userId,
    BigInt(parsedHabitId.data),
    parsed.data
  );

  if (!updatedHabitId) {
    return buildHabitFormErrorState(
      values,
      "Không tìm thấy thói quen hoặc mục tiêu liên kết không hợp lệ."
    );
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${updatedHabitId}`);
  revalidatePath("/dashboard");
  redirect(`/habits/${updatedHabitId}` as Route);
}
