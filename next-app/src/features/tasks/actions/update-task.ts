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
    return buildTaskFormErrorState(values, "Không tìm thấy công việc để cập nhật.");
  }

  const parsedValues = taskFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildTaskFormErrorState(
      values,
      "Dữ liệu công việc chưa hợp lệ.",
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
    return buildTaskFormErrorState(
      values,
      "Công việc không tồn tại hoặc đã bị xóa."
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/tasks/board");
  revalidatePath("/projects");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  revalidatePath(`/tasks/${parsedTaskId.data}`);
  if (parsedValues.data.projectId) {
    revalidatePath(`/projects/${parsedValues.data.projectId}`);
  }
  redirect(`/tasks/${parsedTaskId.data}` as Route);
}
