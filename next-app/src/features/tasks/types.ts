import type { GoalPriority, WorkStatus } from "@/features/goals/types";

export type SubtaskSummary = {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed";
  completedAt: string | null;
  sortOrder: number;
};

export type TaskProjectOption = {
  id: string;
  name: string;
  color: string | null;
  goalId: string | null;
  goalTitle: string | null;
};

export type TaskQuickCreateMilestoneOption = {
  id: string;
  title: string;
  sequenceNo: number;
  targetDate: string;
  tasksCount: number;
  goal: {
    id: string;
    title: string;
  };
};

export type TaskFormValues = {
  title: string;
  description: string;
  status: WorkStatus;
  priority: GoalPriority;
  dueAt: string;
  estimatedMinutes: string;
  projectId: string;
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
  project: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  subtasks: SubtaskSummary[];
  subtasksCount: number;
  completedSubtasksCount: number;
};
