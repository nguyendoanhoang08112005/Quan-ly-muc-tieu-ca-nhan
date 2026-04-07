"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { goalIdSchema } from "@/features/goals/schemas/goal-schemas";
import { softDeleteGoalForUser } from "@/server/modules/goals/mutations";

export async function deleteGoalAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const goalId = formData.get("goalId");
  const parsedGoalId = goalIdSchema.safeParse(goalId);

  if (!parsedGoalId.success) {
    redirect("/goals");
  }

  await softDeleteGoalForUser(userId, BigInt(parsedGoalId.data));

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  redirect("/goals");
}
