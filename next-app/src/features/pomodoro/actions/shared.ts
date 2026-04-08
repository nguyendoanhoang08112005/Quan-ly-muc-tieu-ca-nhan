import type { PomodoroStartFormValues } from "@/features/pomodoro/types";
import { buildDefaultPomodoroStartFormValues } from "@/features/pomodoro/pomodoro-helpers";

type PomodoroStartFormField = keyof PomodoroStartFormValues;

export type PomodoroStartFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<PomodoroStartFormField, string[]>>;
  values: PomodoroStartFormValues;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getInitialPomodoroStartFormActionState(
  values?: Partial<PomodoroStartFormValues>
): PomodoroStartFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultPomodoroStartFormValues(),
      ...values
    }
  };
}

export function readPomodoroStartFormValues(
  formData: FormData
): PomodoroStartFormValues {
  return {
    taskId: readFormValue(formData, "taskId"),
    durationMinutes: readFormValue(formData, "durationMinutes")
  };
}

export function buildPomodoroStartFormErrorState(
  values: PomodoroStartFormValues,
  message: string,
  fieldErrors?: PomodoroStartFormActionState["fieldErrors"]
): PomodoroStartFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
