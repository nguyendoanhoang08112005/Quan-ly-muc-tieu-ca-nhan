import type {
  HabitFormValues,
  HabitLogFormValues
} from "@/features/habits/types";
import {
  buildDefaultHabitFormValues,
  buildDefaultHabitLogFormValues
} from "@/features/habits/habit-helpers";

type HabitFormField = keyof HabitFormValues;
type HabitLogFormField = keyof HabitLogFormValues;

export type HabitFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<HabitFormField, string[]>>;
  values: HabitFormValues;
};

export type HabitLogFormActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<HabitLogFormField, string[]>>;
  values: HabitLogFormValues;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getInitialHabitFormActionState(
  values?: Partial<HabitFormValues>
): HabitFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultHabitFormValues(),
      ...values
    }
  };
}

export function getInitialHabitLogFormActionState(
  values?: Partial<HabitLogFormValues>
): HabitLogFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultHabitLogFormValues(),
      ...values
    }
  };
}

export function readHabitFormValues(formData: FormData): HabitFormValues {
  return {
    title: readFormValue(formData, "title"),
    description: readFormValue(formData, "description"),
    goalId: readFormValue(formData, "goalId"),
    frequency: readFormValue(formData, "frequency") as HabitFormValues["frequency"],
    targetCount: readFormValue(formData, "targetCount"),
    unit: readFormValue(formData, "unit"),
    reminderTime: readFormValue(formData, "reminderTime"),
    status: readFormValue(formData, "status") as HabitFormValues["status"],
    startDate: readFormValue(formData, "startDate"),
    endDate: readFormValue(formData, "endDate")
  };
}

export function readHabitLogFormValues(formData: FormData): HabitLogFormValues {
  return {
    logDate: readFormValue(formData, "logDate"),
    completedCount: readFormValue(formData, "completedCount"),
    note: readFormValue(formData, "note")
  };
}

export function buildHabitFormErrorState(
  values: HabitFormValues,
  message: string,
  fieldErrors?: HabitFormActionState["fieldErrors"]
): HabitFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}

export function buildHabitLogFormErrorState(
  values: HabitLogFormValues,
  message: string,
  fieldErrors?: HabitLogFormActionState["fieldErrors"]
): HabitLogFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
