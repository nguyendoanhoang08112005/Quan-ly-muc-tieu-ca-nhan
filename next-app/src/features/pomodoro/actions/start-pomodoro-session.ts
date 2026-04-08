"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildPomodoroStartFormErrorState,
  type PomodoroStartFormActionState,
  readPomodoroStartFormValues
} from "@/features/pomodoro/actions/shared";
import { pomodoroStartFormSchema } from "@/features/pomodoro/schemas/pomodoro-schemas";
import { startPomodoroSessionForUser } from "@/server/modules/pomodoro/mutations";

export async function startPomodoroSessionAction(
  _previousState: PomodoroStartFormActionState,
  formData: FormData
): Promise<PomodoroStartFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readPomodoroStartFormValues(formData);
  const parsed = pomodoroStartFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildPomodoroStartFormErrorState(
      values,
      "Du lieu pomodoro chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const result = await startPomodoroSessionForUser(userId, parsed.data);

  if (!result.ok) {
    return buildPomodoroStartFormErrorState(
      values,
      result.reason === "active_session"
        ? "Ban dang co mot pomodoro session chua ket thuc."
        : "Task duoc chon cho pomodoro khong hop le."
    );
  }

  revalidatePath("/pomodoro");
  revalidatePath("/tasks");
  revalidatePath("/notifications");

  return {
    status: "idle",
    values
  };
}
