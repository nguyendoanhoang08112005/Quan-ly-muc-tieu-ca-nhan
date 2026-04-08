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
import { tagFormSchema, tagIdSchema } from "@/features/tags/schemas/tag-schemas";
import { updateTagForUser } from "@/server/modules/tags/mutations";

export async function updateTagAction(
  _previousState: TagFormActionState,
  formData: FormData
): Promise<TagFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const tagId = formData.get("tagId");
  const values = readTagFormValues(formData);
  const parsedTagId = tagIdSchema.safeParse(tagId);

  if (!parsedTagId.success) {
    return buildTagFormErrorState(values, "Không tìm thấy thẻ để cập nhật.");
  }

  const parsedValues = tagFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildTagFormErrorState(
      values,
      "Dữ liệu thẻ chưa hợp lệ.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedTagId = await updateTagForUser(
    userId,
    BigInt(parsedTagId.data),
    parsedValues.data
  );

  if (!updatedTagId) {
    return buildTagFormErrorState(values, "Thẻ không tồn tại hoặc đã bị xóa.");
  }

  revalidatePath("/tags");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  redirect("/tags" as Route);
}
