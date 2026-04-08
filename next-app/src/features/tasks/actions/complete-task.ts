"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { completeTaskForGoal } from "@/server/modules/tasks/mutations";

export async function completeTaskAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const taskId = formData.get("taskId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedTaskId = taskIdSchema.safeParse(taskId);

  if (!parsedGoalId.success || !parsedTaskId.success) {
    return;
  }

  await completeTaskForGoal(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedTaskId.data)
  );

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath(`/goals/${parsedGoalId.data}`);
}
