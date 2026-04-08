export const goalTypeValues = ["short_term", "mid_term", "long_term"] as const;
export const goalPriorityValues = [
  "low",
  "medium",
  "high",
  "critical"
] as const;
export const goalStatusValues = [
  "not_started",
  "in_progress",
  "completed",
  "paused",
  "cancelled"
] as const;
export const workStatusValues = [
  "not_started",
  "in_progress",
  "completed",
  "paused"
] as const;

export type GoalType = (typeof goalTypeValues)[number];
export type GoalPriority = (typeof goalPriorityValues)[number];
export type GoalStatus = (typeof goalStatusValues)[number];
export type WorkStatus = (typeof workStatusValues)[number];

export type GoalFormValues = {
  title: string;
  description: string;
  goalType: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  note: string;
  categoryId: string;
  tagIds: string[];
};

export type GoalCategorySummary = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export type GoalTagSummary = {
  id: string;
  name: string;
  color: string | null;
};

export type GoalLogSummary = {
  id: string;
  logType: string;
  title: string | null;
  content: string | null;
  progressSnapshot: number | null;
  loggedAt: string;
  milestoneTitle: string | null;
  taskTitle: string | null;
};

export type GoalMetadataOption = {
  id: string;
  name: string;
  color: string | null;
  icon?: string | null;
};

export type GoalTaskSummary = {
  id: string;
  title: string;
  description: string;
  status: WorkStatus;
  priority: GoalPriority;
  progress: number;
  dueAt: string | null;
  isFocus: boolean;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  startedAt: string | null;
  completedAt: string | null;
  sortOrder: number;
};

export type GoalMilestoneSummary = {
  id: string;
  title: string;
  description: string;
  status: WorkStatus;
  progress: number;
  startDate: string | null;
  targetDate: string | null;
  completedAt: string | null;
  sequenceNo: number;
  note: string | null;
  tasksCount: number;
  tasks: GoalTaskSummary[];
};

export type GoalListItem = {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  goalType: GoalType;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  startDate: string | null;
  targetDate: string | null;
  note: string | null;
  category: GoalCategorySummary | null;
  tags: GoalTagSummary[];
  tasksCount: number;
  milestonesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GoalDetail = GoalListItem & {
  completedAt: string | null;
  milestones: GoalMilestoneSummary[];
  logs: GoalLogSummary[];
};
