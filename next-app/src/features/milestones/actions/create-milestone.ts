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
import { createMilestoneForGoal } from "@/server/modules/milestones/mutations";

export async function createMilestoneAction(
  _previousState: MilestoneFormActionState,
  formData: FormData
): Promise<MilestoneFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const values = readMilestoneFormValues(formData);

  if (!parsedGoalId.success) {
    return buildMilestoneFormErrorState(values, "Goal khong hop le.");
  }

  const parsedValues = milestoneFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildMilestoneFormErrorState(
      values,
      "Du lieu milestone chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const createdMilestoneId = await createMilestoneForGoal(
    userId,
    BigInt(parsedGoalId.data),
    parsedValues.data
  );

  if (!createdMilestoneId) {
    return buildMilestoneFormErrorState(values, "Khong tao duoc milestone.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath(`/goals/${parsedGoalId.data}`);
  redirect(`/goals/${parsedGoalId.data}` as Route);
}
