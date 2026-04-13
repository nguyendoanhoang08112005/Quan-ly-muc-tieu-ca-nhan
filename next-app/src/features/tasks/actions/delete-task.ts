"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { softDeleteTaskForGoal } from "@/server/modules/tasks/mutations";

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return null;
  }

  return value;
}

export async function deleteTaskAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const projectId = formData.get("projectId");
  const redirectTo = getSafeRedirectPath(formData.get("redirectTo"));
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

  const deleted = await softDeleteTaskForGoal(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedTaskId.data)
  );

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  revalidatePath(`/tasks/${parsedTaskId.data}`);
  if (parsedProjectId?.success) {
    revalidatePath(`/projects/${parsedProjectId.data}`);
  }

  if (deleted && redirectTo) {
    redirect(redirectTo as Route);
  }
}
