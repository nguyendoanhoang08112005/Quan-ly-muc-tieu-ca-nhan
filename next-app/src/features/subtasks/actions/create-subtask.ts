"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { subtaskFormSchema } from "@/features/subtasks/schemas/subtask-schemas";
import { createSubtaskForTask } from "@/server/modules/subtasks/mutations";

export async function createSubtaskAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const taskId = formData.get("taskId");
  const name = formData.get("name");

  if (typeof taskId !== "string" || typeof name !== "string") {
    return;
  }

  const parsedTaskId = Number(taskId);
  const parsedInput = subtaskFormSchema.safeParse({
    name
  });

  if (!Number.isInteger(parsedTaskId) || parsedTaskId <= 0 || !parsedInput.success) {
    return;
  }

  const result = await createSubtaskForTask(userId, BigInt(taskId), parsedInput.data);

  if (!result) {
    return;
  }

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${parsedTaskId}`);
  revalidatePath(`/goals/${result.goalId}`);
  revalidatePath("/projects");
  if (result.projectId) {
    revalidatePath(`/projects/${result.projectId}`);
  }
}
