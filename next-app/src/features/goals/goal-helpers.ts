import type {
  GoalFormValues,
  GoalPriority,
  GoalStatus,
  GoalType,
  WorkStatus
} from "@/features/goals/types";
import { addDaysToDateInput, getTodayDateInput } from "@/lib/dates";

export const goalTypeLabels: Record<GoalType, string> = {
  short_term: "Ngắn hạn",
  mid_term: "Trung hạn",
  long_term: "Dài hạn"
};

export const goalPriorityLabels: Record<GoalPriority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  critical: "Rất cao"
};

export const goalStatusLabels: Record<GoalStatus, string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  paused: "Tạm dừng",
  cancelled: "Đã hủy"
};

export const workStatusLabels: Record<WorkStatus, string> = {
  not_started: "Chưa bắt đầu",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  paused: "Tạm dừng"
};

export const goalLogTypeLabels: Record<string, string> = {
  progress_update: "Cập nhật tiến độ",
  status_change: "Đổi trạng thái",
  note: "Ghi chú",
  risk: "Rủi ro",
  completion: "Hoàn thành",
  ai_suggestion: "Gợi ý AI"
};

export const workStatusClassNames: Record<WorkStatus, string> = {
  not_started: "bg-stone-100 text-stone-700",
  in_progress: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700"
};

export const goalStatusClassNames: Record<GoalStatus, string> = {
  not_started: "bg-stone-100 text-stone-700",
  in_progress: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700"
};

export const goalPriorityClassNames: Record<GoalPriority, string> = {
  low: "bg-stone-100 text-stone-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-rose-100 text-rose-700"
};

export const goalTypeToPrisma = {
  short_term: "SHORT_TERM",
  mid_term: "MID_TERM",
  long_term: "LONG_TERM"
} as const;

export const goalTypeFromPrisma = {
  SHORT_TERM: "short_term",
  MID_TERM: "mid_term",
  LONG_TERM: "long_term"
} as const;

export const goalPriorityToPrisma = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  critical: "CRITICAL"
} as const;

export const goalPriorityFromPrisma = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
} as const;

export const goalStatusToPrisma = {
  not_started: "NOT_STARTED",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  paused: "PAUSED",
  cancelled: "CANCELLED"
} as const;

export const goalStatusFromPrisma = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  PAUSED: "paused",
  CANCELLED: "cancelled"
} as const;

export const workStatusFromPrisma = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  PAUSED: "paused"
} as const;

export const workStatusToPrisma = {
  not_started: "NOT_STARTED",
  in_progress: "IN_PROGRESS",
  completed: "COMPLETED",
  paused: "PAUSED"
} as const;

export function buildDefaultGoalFormValues(): GoalFormValues {
  const startDate = getTodayDateInput();

  return {
    title: "",
    description: "",
    goalType: "short_term",
    priority: "medium",
    status: "not_started",
    startDate,
    targetDate: addDaysToDateInput(startDate, 7),
    note: "",
    isPublic: false,
    categoryId: "",
    tagIds: []
  };
}

export function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 100) / 100));
}
