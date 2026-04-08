import type { GoalPriority, WorkStatus } from "@/features/goals/types";

export type TaskFormValues = {
  title: string;
  description: string;
  status: WorkStatus;
  priority: GoalPriority;
  dueAt: string;
  estimatedMinutes: string;
  isFocus: boolean;
};

export type TaskListItem = {
  id: string;
  title: string;
  description: string;
  status: WorkStatus;
  priority: GoalPriority;
  progress: number;
  dueAt: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  isFocus: boolean;
  goalId: string;
  goalTitle: string;
  milestoneId: string | null;
  milestoneTitle: string | null;
  milestoneSequenceNo: number | null;
};
