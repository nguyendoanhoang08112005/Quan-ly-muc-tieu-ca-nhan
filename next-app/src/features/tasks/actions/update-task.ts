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
import { taskFormSchema, taskIdSchema } from "@/features/tasks/schemas/task-schemas";
import { updateTaskForGoal } from "@/server/modules/tasks/mutations";

export async function updateTaskAction(
  _previousState: TaskFormActionState,
  formData: FormData
): Promise<TaskFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const taskId = formData.get("taskId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedTaskId = taskIdSchema.safeParse(taskId);
  const values = readTaskFormValues(formData);

  if (!parsedGoalId.success || !parsedTaskId.success) {
    return buildTaskFormErrorState(values, "Khong tim thay task de cap nhat.");
  }

  const parsedValues = taskFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildTaskFormErrorState(
      values,
      "Du lieu task chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedTaskId = await updateTaskForGoal(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedTaskId.data),
    parsedValues.data
  );

  if (!updatedTaskId) {
    return buildTaskFormErrorState(values, "Task khong ton tai hoac da bi xoa.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  redirect(`/goals/${parsedGoalId.data}` as Route);
}
