"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildMilestoneFormErrorState,
  type MilestoneFormActionState,
  readMilestoneFormValues
} from "@/features/milestones/actions/shared";
import {
  milestoneFormSchema,
  milestoneIdSchema
} from "@/features/milestones/schemas/milestone-schemas";
import { updateMilestoneForGoal } from "@/server/modules/milestones/mutations";

export async function updateMilestoneAction(
  _previousState: MilestoneFormActionState,
  formData: FormData
): Promise<MilestoneFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const milestoneId = formData.get("milestoneId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);
  const values = readMilestoneFormValues(formData);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    return buildMilestoneFormErrorState(
      values,
      "Không tìm thấy milestone để cập nhật."
    );
  }

  const parsedValues = milestoneFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildMilestoneFormErrorState(
      values,
      "Dữ liệu cột mốc chưa hợp lệ.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedMilestoneId = await updateMilestoneForGoal(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedMilestoneId.data),
    parsedValues.data
  );

  if (!updatedMilestoneId.ok) {
    return buildMilestoneFormErrorState(values, updatedMilestoneId.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/tasks/board");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  redirect(`/goals/${parsedGoalId.data}` as Route);
}
