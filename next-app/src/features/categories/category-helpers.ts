import type { CategoryFormValues, CategoryType } from "@/features/categories/types";

export const categoryTypeLabels: Record<CategoryType, string> = {
  goal: "Mục tiêu",
  task: "Công việc",
  habit: "Thói quen",
  all: "Tất cả"
};

export const categoryTypeToPrisma = {
  goal: "GOAL",
  task: "TASK",
  habit: "HABIT",
  all: "ALL"
} as const;

export const categoryTypeFromPrisma = {
  GOAL: "goal",
  TASK: "task",
  HABIT: "habit",
  ALL: "all"
} as const;

export function buildDefaultCategoryFormValues(): CategoryFormValues {
  return {
    name: "",
    color: "",
    icon: "",
    type: "goal"
  };
}
