"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { completeTaskForGoal } from "@/server/modules/tasks/mutations";

export async function completeTaskAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const projectId = formData.get("projectId");
  const taskId = formData.get("taskId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedTaskId = taskIdSchema.safeParse(taskId);
  const parsedProjectId =
    typeof projectId === "string" && projectId.length > 0
      ? taskIdSchema.safeParse(projectId)
      : null;

  if (
    !parsedGoalId.success ||
    !parsedTaskId.success ||
    (parsedProjectId !== null && !parsedProjectId.success)
  ) {
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
  revalidatePath("/tasks/board");
  revalidatePath("/projects");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  revalidatePath(`/tasks/${parsedTaskId.data}`);
  if (parsedProjectId?.success) {
    revalidatePath(`/projects/${parsedProjectId.data}`);
  }
}
