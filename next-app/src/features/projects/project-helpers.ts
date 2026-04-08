import type { ProjectFormValues, ProjectStatus } from "@/features/projects/types";
import { getTodayDateInput } from "@/lib/dates";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planning: "Len ke hoach",
  active: "Đang chạy",
  paused: "Tam dung",
  completed: "Hoan thanh",
  cancelled: "Đã hủy",
  archived: "Luu tru"
};

export const projectStatusClassNames: Record<ProjectStatus, string> = {
  planning: "bg-stone-100 text-stone-700",
  active: "bg-sky-100 text-sky-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
  archived: "bg-stone-200 text-stone-700"
};

export const projectStatusToPrisma = {
  planning: "PLANNING",
  active: "ACTIVE",
  paused: "PAUSED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  archived: "ARCHIVED"
} as const;

export const projectStatusFromPrisma = {
  PLANNING: "planning",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ARCHIVED: "archived"
} as const;

export function buildDefaultProjectFormValues(): ProjectFormValues {
  return {
    goalId: "",
    name: "",
    description: "",
    status: "planning",
    color: "",
    startDate: getTodayDateInput(),
    endDate: ""
  };
}
