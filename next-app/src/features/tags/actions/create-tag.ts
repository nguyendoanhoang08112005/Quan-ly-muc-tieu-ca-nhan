"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildTagFormErrorState,
  type TagFormActionState,
  readTagFormValues
} from "@/features/tags/actions/shared";
import { tagFormSchema } from "@/features/tags/schemas/tag-schemas";
import { createTagForUser } from "@/server/modules/tags/mutations";

export async function createTagAction(
  _previousState: TagFormActionState,
  formData: FormData
): Promise<TagFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readTagFormValues(formData);
  const parsed = tagFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildTagFormErrorState(
      values,
      "Du lieu tag chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const tagId = await createTagForUser(userId, parsed.data);

  revalidatePath("/tags");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  redirect(`/tags?created=${tagId}` as Route);
}
