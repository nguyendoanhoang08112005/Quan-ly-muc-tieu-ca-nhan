import type { TagFormValues } from "@/features/tags/types";
import { buildDefaultTagFormValues } from "@/features/tags/tag-helpers";

type TagFormField = keyof TagFormValues;

export type TagFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<TagFormField, string[]>>;
  values: TagFormValues;
};

export function getInitialTagFormActionState(
  values?: Partial<TagFormValues>
): TagFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultTagFormValues(),
      ...values
    }
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function readTagFormValues(formData: FormData): TagFormValues {
  return {
    name: readFormValue(formData, "name"),
    color: readFormValue(formData, "color")
  };
}

export function buildTagFormErrorState(
  values: TagFormValues,
  message: string,
  fieldErrors?: TagFormActionState["fieldErrors"]
): TagFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
