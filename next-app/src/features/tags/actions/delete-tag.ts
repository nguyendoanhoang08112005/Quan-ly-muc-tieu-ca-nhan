"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { tagIdSchema } from "@/features/tags/schemas/tag-schemas";
import { softDeleteTagForUser } from "@/server/modules/tags/mutations";

export async function deleteTagAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const tagId = formData.get("tagId");
  const parsedTagId = tagIdSchema.safeParse(tagId);

  if (!parsedTagId.success) {
    return;
  }

  await softDeleteTagForUser(userId, BigInt(parsedTagId.data));

  revalidatePath("/tags");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}
