"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { subtaskIdSchema } from "@/features/subtasks/schemas/subtask-schemas";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { toggleSubtaskForTask } from "@/server/modules/subtasks/mutations";

export async function toggleSubtaskAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const taskId = formData.get("taskId");
  const subtaskId = formData.get("subtaskId");
  const parsedTaskId = taskIdSchema.safeParse(taskId);
  const parsedSubtaskId = subtaskIdSchema.safeParse(subtaskId);

  if (!parsedTaskId.success || !parsedSubtaskId.success) {
    return;
  }

  const result = await toggleSubtaskForTask(
    userId,
    BigInt(parsedTaskId.data),
    BigInt(parsedSubtaskId.data)
  );

  if (!result) {
    return;
  }

  revalidatePath("/tasks");
  revalidatePath(`/goals/${result.goalId}`);
  revalidatePath("/projects");
  if (result.projectId) {
    revalidatePath(`/projects/${result.projectId}`);
  }
}
