"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildHabitLogFormErrorState,
  getInitialHabitLogFormActionState,
  type HabitLogFormActionState,
  readHabitLogFormValues
} from "@/features/habits/actions/shared";
import {
  habitIdSchema,
  habitLogFormSchema
} from "@/features/habits/schemas/habit-schemas";
import { upsertHabitLogForUser } from "@/server/modules/habits/mutations";

export async function upsertHabitLogAction(
  _previousState: HabitLogFormActionState,
  formData: FormData
): Promise<HabitLogFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const habitId = formData.get("habitId");
  const parsedHabitId = habitIdSchema.safeParse(habitId);
  const values = readHabitLogFormValues(formData);
  const parsed = habitLogFormSchema.safeParse(values);

  if (!parsedHabitId.success) {
    return buildHabitLogFormErrorState(values, "Habit không hợp lệ.");
  }

  if (!parsed.success) {
    return buildHabitLogFormErrorState(
      values,
      "Dữ liệu log habit chưa hợp lệ.",
      parsed.error.flatten().fieldErrors
    );
  }

  const savedHabitId = await upsertHabitLogForUser(
    userId,
    BigInt(parsedHabitId.data),
    parsed.data
  );

  if (!savedHabitId) {
    return buildHabitLogFormErrorState(
      values,
      "Không tìm thấy habit để ghi log."
    );
  }

  revalidatePath("/habits");
  revalidatePath(`/habits/${savedHabitId}`);
  revalidatePath("/dashboard");

  return {
    ...getInitialHabitLogFormActionState(values),
    status: "success",
    message: "Đã cập nhật habit log."
  };
}
