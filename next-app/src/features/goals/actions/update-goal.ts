"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildGoalFormErrorState,
  type GoalFormActionState,
  readGoalFormValues
} from "@/features/goals/actions/shared";
import {
  goalFormSchema,
  goalIdSchema
} from "@/features/goals/schemas/goal-schemas";
import { updateGoalForUser } from "@/server/modules/goals/mutations";

export async function updateGoalAction(
  _previousState: GoalFormActionState,
  formData: FormData
): Promise<GoalFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readGoalFormValues(formData);
  const goalId = formData.get("goalId");
  const parsedGoalId = goalIdSchema.safeParse(goalId);

  if (!parsedGoalId.success) {
    return buildGoalFormErrorState(values, "Không tìm thấy mục tiêu để cập nhật.");
  }

  const parsedValues = goalFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildGoalFormErrorState(
      values,
      "Dữ liệu mục tiêu chưa hợp lệ.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedGoalId = await updateGoalForUser(
    userId,
    BigInt(parsedGoalId.data),
    parsedValues.data
  );

  if (!updatedGoalId.ok) {
    return buildGoalFormErrorState(values, updatedGoalId.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/categories");
  revalidatePath("/tags");
  revalidatePath("/follows");
  revalidatePath(`/goals/${updatedGoalId.goalId}`);
  revalidatePath(`/goals/${updatedGoalId.goalId}/edit`);
  redirect(`/goals/${updatedGoalId.goalId}`);
}
