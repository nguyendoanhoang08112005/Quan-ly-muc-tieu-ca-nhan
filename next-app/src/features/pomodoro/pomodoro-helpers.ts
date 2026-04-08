import type { PomodoroStartFormValues } from "@/features/pomodoro/types";

export function buildDefaultPomodoroStartFormValues(
  taskId = ""
): PomodoroStartFormValues {
  return {
    taskId,
    durationMinutes: "25"
  };
}

export function formatPomodoroMinutes(value: number) {
  return `${Math.max(0, Math.round(value))} phut`;
}
