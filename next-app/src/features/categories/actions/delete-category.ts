"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { categoryIdSchema } from "@/features/categories/schemas/category-schemas";
import { softDeleteCategoryForUser } from "@/server/modules/categories/mutations";

export async function deleteCategoryAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const categoryId = formData.get("categoryId");
  const parsedCategoryId = categoryIdSchema.safeParse(categoryId);

  if (!parsedCategoryId.success) {
    return;
  }

  await softDeleteCategoryForUser(userId, BigInt(parsedCategoryId.data));

  revalidatePath("/categories");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}
