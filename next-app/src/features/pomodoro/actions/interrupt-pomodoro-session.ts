"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { pomodoroSessionIdSchema } from "@/features/pomodoro/schemas/pomodoro-schemas";
import { interruptPomodoroSessionForUser } from "@/server/modules/pomodoro/mutations";

export async function interruptPomodoroSessionAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const sessionId = formData.get("sessionId");
  const parsedSessionId = pomodoroSessionIdSchema.safeParse(sessionId);

  if (!parsedSessionId.success) {
    return;
  }

  await interruptPomodoroSessionForUser(userId, BigInt(parsedSessionId.data));

  revalidatePath("/pomodoro");
  revalidatePath("/tasks");
  revalidatePath("/tasks/board");
}
