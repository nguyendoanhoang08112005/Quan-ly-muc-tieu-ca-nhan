"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildTaskFormErrorState,
  type TaskFormActionState,
  readTaskFormValues
} from "@/features/tasks/actions/shared";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { taskFormSchema } from "@/features/tasks/schemas/task-schemas";
import { createTaskForMilestone } from "@/server/modules/tasks/mutations";

export async function createTaskAction(
  _previousState: TaskFormActionState,
  formData: FormData
): Promise<TaskFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const milestoneId = formData.get("milestoneId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);
  const values = readTaskFormValues(formData);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    return buildTaskFormErrorState(values, "Milestone hoac goal khong hop le.");
  }

  const parsedValues = taskFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildTaskFormErrorState(
      values,
      "Du lieu task chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const createdTaskId = await createTaskForMilestone(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedMilestoneId.data),
    parsedValues.data
  );

  if (!createdTaskId) {
    return buildTaskFormErrorState(values, "Không tạo được task.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  if (parsedValues.data.projectId) {
    revalidatePath(`/projects/${parsedValues.data.projectId}`);
  }
  redirect(`/goals/${parsedGoalId.data}` as Route);
}
