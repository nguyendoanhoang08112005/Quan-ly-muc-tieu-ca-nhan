import type { GoalFormValues } from "@/features/goals/types";
import { buildDefaultGoalFormValues } from "@/features/goals/goal-helpers";

type GoalFormField = keyof GoalFormValues;

export type GoalFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<GoalFormField, string[]>>;
  values: GoalFormValues;
};

export function getInitialGoalFormActionState(
  values?: Partial<GoalFormValues>
): GoalFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultGoalFormValues(),
      ...values
    }
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function readGoalFormValues(formData: FormData): GoalFormValues {
  return {
    title: readFormValue(formData, "title"),
    description: readFormValue(formData, "description"),
    goalType: readFormValue(formData, "goalType") as GoalFormValues["goalType"],
    priority: readFormValue(formData, "priority") as GoalFormValues["priority"],
    status: readFormValue(formData, "status") as GoalFormValues["status"],
    startDate: readFormValue(formData, "startDate"),
    targetDate: readFormValue(formData, "targetDate"),
    note: readFormValue(formData, "note"),
    isPublic: formData.get("isPublic") === "on",
    categoryId: readFormValue(formData, "categoryId"),
    tagIds: formData
      .getAll("tagIds")
      .filter((value): value is string => typeof value === "string")
  };
}

export function buildGoalFormErrorState(
  values: GoalFormValues,
  message: string,
  fieldErrors?: GoalFormActionState["fieldErrors"]
): GoalFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
