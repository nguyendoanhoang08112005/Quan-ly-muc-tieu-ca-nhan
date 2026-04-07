export type GoalType = 'short_term' | 'mid_term' | 'long_term';

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export interface GoalTask {
  id: number;
  user_id: number;
  goal_id: number;
  milestone_id: number | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: GoalPriority;
  progress: number;
  progress_percentage: number;
  due_at: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  is_focus: boolean;
  started_at: string | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GoalMilestone {
  id: number;
  user_id: number;
  goal_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  progress_percentage: number;
  start_date: string | null;
  target_date: string | null;
  completed_at: string | null;
  sequence_no: number;
  note: string;
  tasks_count?: number;
  tasks?: GoalTask[];
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: number;
  user_id?: number;
  title: string;
  description: string;
  goal_type: GoalType;
  start_date: string;
  target_date: string;
  due_date: string;
  note: string;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  progress_percentage: number;
  tasks_count?: number;
  milestones_count?: number;
  milestones?: GoalMilestone[];
  created_at: string;
  updated_at: string;
}
