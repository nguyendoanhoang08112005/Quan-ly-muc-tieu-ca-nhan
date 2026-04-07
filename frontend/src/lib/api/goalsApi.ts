import { Goal, GoalMilestone, GoalTask } from '../../features/goals/types';
import api from './authApi';

const API_V1_PREFIX = '/v1';

export interface CreateGoalPayload {
  title: string;
  description: string;
  goal_type: Goal['goal_type'];
  priority: Goal['priority'];
  status: Goal['status'];
  start_date: string;
  target_date: string;
  note: string;
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {}

type GoalApiResponse = Partial<Goal> & {
  id: number;
  user_id?: number;
  name?: string;
  deadline?: string;
  target_date?: string;
  progress_percentage?: number | string;
  progress?: number | string;
  note?: string | null;
  tasks_count?: number;
  milestones_count?: number;
  milestones?: MilestoneApiResponse[];
};

type MilestoneApiResponse = Partial<GoalMilestone> & {
  id: number;
  goal_id: number;
  progress_percentage?: number | string;
  progress?: number | string;
  note?: string | null;
  tasks?: TaskApiResponse[];
};

type TaskApiResponse = Partial<GoalTask> & {
  id: number;
  goal_id: number;
  milestone_id?: number | null;
  progress_percentage?: number | string;
  progress?: number | string;
};

const normalizeStatus = (status?: string): Goal['status'] => {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'active':
    case 'in_progress':
      return 'in_progress';
    case 'paused':
      return 'paused';
    case 'on_hold':
    case 'not_started':
    default:
      return 'not_started';
  }
};

const normalizeGoal = (goal: GoalApiResponse): Goal => ({
  id: goal.id,
  user_id: goal.user_id,
  title: goal.title ?? goal.name ?? 'Muc tieu chua dat ten',
  description: goal.description ?? '',
  goal_type: goal.goal_type ?? 'short_term',
  start_date: goal.start_date ?? new Date().toISOString().split('T')[0],
  target_date: goal.target_date ?? goal.due_date ?? goal.deadline ?? new Date().toISOString().split('T')[0],
  due_date: goal.target_date ?? goal.due_date ?? goal.deadline ?? new Date().toISOString().split('T')[0],
  note: goal.note ?? '',
  status: normalizeStatus(goal.status),
  priority: goal.priority ?? 'medium',
  progress: Number(goal.progress ?? goal.progress_percentage ?? 0),
  progress_percentage: Number(goal.progress_percentage ?? goal.progress ?? 0),
  tasks_count: goal.tasks_count,
  milestones_count: goal.milestones_count,
  milestones: goal.milestones?.map(normalizeMilestone),
  created_at: goal.created_at ?? '',
  updated_at: goal.updated_at ?? '',
});

const normalizeTaskStatus = (status?: string): GoalTask['status'] => {
  switch (status) {
    case 'completed':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    case 'paused':
      return 'paused';
    case 'not_started':
    default:
      return 'not_started';
  }
};

const normalizeTask = (task: TaskApiResponse): GoalTask => ({
  id: task.id,
  user_id: task.user_id ?? 0,
  goal_id: task.goal_id,
  milestone_id: task.milestone_id ?? null,
  title: task.title ?? 'Task chua dat ten',
  description: task.description ?? '',
  status: normalizeTaskStatus(task.status),
  priority: task.priority ?? 'medium',
  progress: Number(task.progress ?? task.progress_percentage ?? 0),
  progress_percentage: Number(task.progress_percentage ?? task.progress ?? 0),
  due_at: task.due_at ?? null,
  estimated_minutes: task.estimated_minutes ?? null,
  actual_minutes: task.actual_minutes ?? null,
  is_focus: Boolean(task.is_focus),
  started_at: task.started_at ?? null,
  completed_at: task.completed_at ?? null,
  sort_order: task.sort_order ?? 0,
  created_at: task.created_at ?? '',
  updated_at: task.updated_at ?? '',
});

const normalizeMilestone = (milestone: MilestoneApiResponse): GoalMilestone => ({
  id: milestone.id,
  user_id: milestone.user_id ?? 0,
  goal_id: milestone.goal_id,
  title: milestone.title ?? 'Milestone chua dat ten',
  description: milestone.description ?? '',
  status: normalizeTaskStatus(milestone.status),
  progress: Number(milestone.progress ?? milestone.progress_percentage ?? 0),
  progress_percentage: Number(milestone.progress_percentage ?? milestone.progress ?? 0),
  start_date: milestone.start_date ?? null,
  target_date: milestone.target_date ?? null,
  completed_at: milestone.completed_at ?? null,
  sequence_no: milestone.sequence_no ?? 1,
  note: milestone.note ?? '',
  tasks_count: milestone.tasks_count,
  tasks: milestone.tasks?.map(normalizeTask),
  created_at: milestone.created_at ?? '',
  updated_at: milestone.updated_at ?? '',
});

export const goalsApi = {
  list: async (): Promise<Goal[]> => {
    const response = await api.get(`${API_V1_PREFIX}/goals`);
    const payload = Array.isArray(response.data) ? response.data : response.data?.data ?? [];

    return payload.map(normalizeGoal);
  },

  get: async (goalId: number): Promise<Goal> => {
    const response = await api.get(`${API_V1_PREFIX}/goals/${goalId}`);
    return normalizeGoal(response.data?.data ?? response.data);
  },

  create: async (data: CreateGoalPayload): Promise<Goal> => {
    const response = await api.post(`${API_V1_PREFIX}/goals`, data);

    return normalizeGoal(response.data?.data ?? response.data);
  },

  update: async (goalId: number, data: UpdateGoalPayload): Promise<Goal> => {
    const response = await api.patch(`${API_V1_PREFIX}/goals/${goalId}`, data);
    return normalizeGoal(response.data?.data ?? response.data);
  },

  remove: async (goalId: number): Promise<void> => {
    await api.delete(`${API_V1_PREFIX}/goals/${goalId}`);
  },
};

export { normalizeGoal, normalizeMilestone, normalizeTask };
