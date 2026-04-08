import type { CategoryFormValues } from "@/features/categories/types";
import { buildDefaultCategoryFormValues } from "@/features/categories/category-helpers";

type CategoryFormField = keyof CategoryFormValues;

export type CategoryFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<CategoryFormField, string[]>>;
  values: CategoryFormValues;
};

export function getInitialCategoryFormActionState(
  values?: Partial<CategoryFormValues>
): CategoryFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultCategoryFormValues(),
      ...values
    }
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function readCategoryFormValues(formData: FormData): CategoryFormValues {
  return {
    name: readFormValue(formData, "name"),
    color: readFormValue(formData, "color"),
    icon: readFormValue(formData, "icon"),
    type: readFormValue(formData, "type") as CategoryFormValues["type"]
  };
}

export function buildCategoryFormErrorState(
  values: CategoryFormValues,
  message: string,
  fieldErrors?: CategoryFormActionState["fieldErrors"]
): CategoryFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
