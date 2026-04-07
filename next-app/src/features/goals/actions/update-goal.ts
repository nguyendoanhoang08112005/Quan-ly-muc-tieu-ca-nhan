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
    return buildGoalFormErrorState(values, "Khong tim thay goal de cap nhat.");
  }

  const parsedValues = goalFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildGoalFormErrorState(
      values,
      "Du lieu goal chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedGoalId = await updateGoalForUser(
    userId,
    BigInt(parsedGoalId.data),
    parsedValues.data
  );

  if (!updatedGoalId) {
    return buildGoalFormErrorState(values, "Goal khong ton tai hoac da bi xoa.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath(`/goals/${updatedGoalId}`);
  revalidatePath(`/goals/${updatedGoalId}/edit`);
  redirect(`/goals/${updatedGoalId}`);
}
