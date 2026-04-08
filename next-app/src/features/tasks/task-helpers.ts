import type { TaskFormValues } from "@/features/tasks/types";

export function buildDefaultTaskFormValues(): TaskFormValues {
  return {
    title: "",
    description: "",
    status: "not_started",
    priority: "medium",
    dueAt: "",
    estimatedMinutes: "",
    isFocus: false
  };
}
