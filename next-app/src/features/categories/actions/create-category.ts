"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildCategoryFormErrorState,
  type CategoryFormActionState,
  readCategoryFormValues
} from "@/features/categories/actions/shared";
import { categoryFormSchema } from "@/features/categories/schemas/category-schemas";
import { createCategoryForUser } from "@/server/modules/categories/mutations";

export async function createCategoryAction(
  _previousState: CategoryFormActionState,
  formData: FormData
): Promise<CategoryFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readCategoryFormValues(formData);
  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildCategoryFormErrorState(
      values,
      "Dữ liệu danh mục chưa hợp lệ.",
      parsed.error.flatten().fieldErrors
    );
  }

  const categoryId = await createCategoryForUser(userId, parsed.data);

  revalidatePath("/categories");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  redirect(`/categories?created=${categoryId}` as Route);
}
