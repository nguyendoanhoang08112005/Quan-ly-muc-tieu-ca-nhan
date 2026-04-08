import type { ProjectFormValues } from "@/features/projects/types";
import { buildDefaultProjectFormValues } from "@/features/projects/project-helpers";

type ProjectFormField = keyof ProjectFormValues;

export type ProjectFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProjectFormField, string[]>>;
  values: ProjectFormValues;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getInitialProjectFormActionState(
  values?: Partial<ProjectFormValues>
): ProjectFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultProjectFormValues(),
      ...values
    }
  };
}

export function readProjectFormValues(formData: FormData): ProjectFormValues {
  return {
    goalId: readFormValue(formData, "goalId"),
    name: readFormValue(formData, "name"),
    description: readFormValue(formData, "description"),
    status: readFormValue(formData, "status") as ProjectFormValues["status"],
    color: readFormValue(formData, "color"),
    startDate: readFormValue(formData, "startDate"),
    endDate: readFormValue(formData, "endDate")
  };
}

export function buildProjectFormErrorState(
  values: ProjectFormValues,
  message: string,
  fieldErrors?: ProjectFormActionState["fieldErrors"]
): ProjectFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
