"use server";

import { revalidatePath } from "next/cache";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { unfollowGoalForUser } from "@/server/modules/follows/mutations";

export async function unfollowGoalAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const parsedGoalId = goalIdSchema.safeParse(goalId);

  if (!parsedGoalId.success) {
    return;
  }

  const result = await unfollowGoalForUser(userId, BigInt(parsedGoalId.data));

  if (!result) {
    return;
  }

  revalidatePath("/follows");
  revalidatePath("/goals");
  revalidatePath(`/goals/${parsedGoalId.data}`);
}
