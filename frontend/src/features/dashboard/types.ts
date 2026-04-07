import { Goal } from '../goals/types';

export interface DashboardSummaryCounts {
  active_goals: number;
  completed_goals: number;
  tasks_today: number;
  overdue_tasks: number;
}

export interface DashboardUpcomingTask {
  id: number;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  priority: Goal['priority'];
  due_at: string | null;
  estimated_minutes: number | null;
  is_focus: boolean;
  goal: {
    id: number;
    title: string;
  } | null;
  milestone: {
    id: number;
    title: string;
  } | null;
}

export interface DashboardSummaryResponse {
  summary: DashboardSummaryCounts;
  upcoming_tasks: DashboardUpcomingTask[];
  active_goals: Goal[];
}
