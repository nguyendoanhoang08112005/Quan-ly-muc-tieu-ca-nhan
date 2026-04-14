"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { milestoneIdSchema } from "@/features/milestones/schemas/milestone-schemas";
import { softDeleteMilestoneForGoal } from "@/server/modules/milestones/mutations";

export async function deleteMilestoneAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const milestoneId = formData.get("milestoneId");
  const parsedGoalId = milestoneIdSchema.safeParse(goalId);
  const parsedMilestoneId = milestoneIdSchema.safeParse(milestoneId);

  if (!parsedGoalId.success || !parsedMilestoneId.success) {
    return;
  }

  await softDeleteMilestoneForGoal(
    userId,
    BigInt(parsedGoalId.data),
    BigInt(parsedMilestoneId.data)
  );

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath("/tasks");
  revalidatePath("/tasks/board");
  revalidatePath(`/goals/${parsedGoalId.data}`);
}
