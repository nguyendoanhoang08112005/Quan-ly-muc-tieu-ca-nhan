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
      "Dữ liệu pomodoro chưa hợp lệ.",
      parsed.error.flatten().fieldErrors
    );
  }

  const result = await startPomodoroSessionForUser(userId, parsed.data);

  if (!result.ok) {
    return buildPomodoroStartFormErrorState(
      values,
      result.reason === "active_session"
        ? "Bạn đang có một phiên pomodoro chưa kết thúc."
        : "Công việc được chọn cho pomodoro không hợp lệ."
    );
  }

  revalidatePath("/pomodoro");
  revalidatePath("/tasks");
  revalidatePath("/tasks/board");
  revalidatePath("/notifications");

  return {
    status: "idle",
    values
  };
}
