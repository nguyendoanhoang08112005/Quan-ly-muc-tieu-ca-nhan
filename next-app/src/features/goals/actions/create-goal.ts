"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { goalFormSchema } from "@/features/goals/schemas/goal-schemas";
import {
  buildGoalFormErrorState,
  type GoalFormActionState,
  readGoalFormValues
} from "@/features/goals/actions/shared";
import { createGoalForUser } from "@/server/modules/goals/mutations";

export async function createGoalAction(
  _previousState: GoalFormActionState,
  formData: FormData
): Promise<GoalFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readGoalFormValues(formData);
  const parsed = goalFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildGoalFormErrorState(
      values,
      "Du lieu goal chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const goalId = await createGoalForUser(userId, parsed.data);

  if (!goalId) {
    return buildGoalFormErrorState(
      values,
      "Category hoac tag khong hop le cho goal nay."
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/categories");
  revalidatePath("/tags");
  redirect(`/goals/${goalId}`);
}
