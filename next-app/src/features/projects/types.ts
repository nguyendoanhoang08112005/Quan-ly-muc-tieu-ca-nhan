import type { TaskListItem } from "@/features/tasks/types";

export const projectStatusValues = [
  "planning",
  "active",
  "paused",
  "completed",
  "cancelled",
  "archived"
] as const;

export type ProjectStatus = (typeof projectStatusValues)[number];

export type ProjectFormValues = {
  goalId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  startDate: string;
  endDate: string;
};

export type ProjectGoalOption = {
  id: string;
  title: string;
};

export type ProjectOption = {
  id: string;
  name: string;
  color: string | null;
  goalId: string | null;
  goalTitle: string | null;
};

export type ProjectListItem = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string | null;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  goal: ProjectGoalOption | null;
  tasksCount: number;
  completedTasksCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectListItem & {
  tasks: TaskListItem[];
};
