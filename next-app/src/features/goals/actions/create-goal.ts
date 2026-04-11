"use server";

import type { Route } from "next";
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
      "Dữ liệu mục tiêu chưa hợp lệ.",
      parsed.error.flatten().fieldErrors
    );
  }

  const goalId = await createGoalForUser(userId, parsed.data);

  if (!goalId) {
    return buildGoalFormErrorState(
      values,
      "Danh mục hoặc thẻ không hợp lệ cho mục tiêu này."
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/categories");
  revalidatePath("/tags");
  revalidatePath("/follows");
  const redirectTo = formData.get("redirectTo");
  const nextPath =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : `/goals/${goalId}`;

  redirect(nextPath as Route);
}
