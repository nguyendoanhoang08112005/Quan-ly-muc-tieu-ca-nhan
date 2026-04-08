import type { TaskFormValues } from "@/features/tasks/types";
import { buildDefaultTaskFormValues } from "@/features/tasks/task-helpers";

type TaskFormField = keyof TaskFormValues;

export type TaskFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<TaskFormField, string[]>>;
  values: TaskFormValues;
};

export function getInitialTaskFormActionState(
  values?: Partial<TaskFormValues>
): TaskFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultTaskFormValues(),
      ...values
    }
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function readTaskFormValues(formData: FormData): TaskFormValues {
  return {
    title: readFormValue(formData, "title"),
    description: readFormValue(formData, "description"),
    status: readFormValue(formData, "status") as TaskFormValues["status"],
    priority: readFormValue(formData, "priority") as TaskFormValues["priority"],
    dueAt: readFormValue(formData, "dueAt"),
    estimatedMinutes: readFormValue(formData, "estimatedMinutes"),
    isFocus: formData.get("isFocus") === "on"
  };
}

export function buildTaskFormErrorState(
  values: TaskFormValues,
  message: string,
  fieldErrors?: TaskFormActionState["fieldErrors"]
): TaskFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
