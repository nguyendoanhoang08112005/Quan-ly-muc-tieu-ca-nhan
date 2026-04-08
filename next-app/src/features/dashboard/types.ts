import type {
  GoalListItem,
  GoalPriority,
  WorkStatus
} from "@/features/goals/types";

export type DashboardSummary = {
  activeGoals: number;
  completedGoals: number;
  tasksToday: number;
  overdueTasks: number;
};

export type DashboardUpcomingTask = {
  id: string;
  title: string;
  status: WorkStatus;
  priority: GoalPriority;
  dueAt: string | null;
  isFocus: boolean;
  goal: {
    id: string;
    title: string;
  };
  milestone: {
    id: string;
    title: string;
    sequenceNo: number;
  } | null;
};

export type DashboardRecentLog = {
  id: string;
  logType: string;
  title: string | null;
  content: string | null;
  progressSnapshot: number | null;
  loggedAt: string;
  goal: {
    id: string;
    title: string;
  };
  milestoneTitle: string | null;
  taskTitle: string | null;
};

export type DashboardOverview = {
  summary: DashboardSummary;
  metadata: {
    categories: number;
    tags: number;
    nearestDeadlineGoal: GoalListItem | null;
  };
  activeGoals: GoalListItem[];
  upcomingTasks: DashboardUpcomingTask[];
  recentLogs: DashboardRecentLog[];
};
