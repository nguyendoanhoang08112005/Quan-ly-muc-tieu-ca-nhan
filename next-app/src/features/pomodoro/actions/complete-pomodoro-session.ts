"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { pomodoroSessionIdSchema } from "@/features/pomodoro/schemas/pomodoro-schemas";
import { completePomodoroSessionForUser } from "@/server/modules/pomodoro/mutations";

export async function completePomodoroSessionAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const sessionId = formData.get("sessionId");
  const notes = formData.get("notes");
  const parsedSessionId = pomodoroSessionIdSchema.safeParse(sessionId);

  if (!parsedSessionId.success) {
    return;
  }

  await completePomodoroSessionForUser(
    userId,
    BigInt(parsedSessionId.data),
    typeof notes === "string" ? notes : ""
  );

  revalidatePath("/pomodoro");
  revalidatePath("/tasks");
  revalidatePath("/notifications");
}
