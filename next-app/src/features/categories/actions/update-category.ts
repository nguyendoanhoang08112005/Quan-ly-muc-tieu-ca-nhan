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
import {
  categoryFormSchema,
  categoryIdSchema
} from "@/features/categories/schemas/category-schemas";
import { updateCategoryForUser } from "@/server/modules/categories/mutations";

export async function updateCategoryAction(
  _previousState: CategoryFormActionState,
  formData: FormData
): Promise<CategoryFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const categoryId = formData.get("categoryId");
  const values = readCategoryFormValues(formData);
  const parsedCategoryId = categoryIdSchema.safeParse(categoryId);

  if (!parsedCategoryId.success) {
    return buildCategoryFormErrorState(
      values,
      "Khong tim thay category de cap nhat."
    );
  }

  const parsedValues = categoryFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return buildCategoryFormErrorState(
      values,
      "Du lieu category chua hop le.",
      parsedValues.error.flatten().fieldErrors
    );
  }

  const updatedCategoryId = await updateCategoryForUser(
    userId,
    BigInt(parsedCategoryId.data),
    parsedValues.data
  );

  if (!updatedCategoryId) {
    return buildCategoryFormErrorState(
      values,
      "Category khong ton tai hoac da bi xoa."
    );
  }

  revalidatePath("/categories");
  revalidatePath("/goals");
  revalidatePath("/dashboard");
  redirect("/categories" as Route);
}
