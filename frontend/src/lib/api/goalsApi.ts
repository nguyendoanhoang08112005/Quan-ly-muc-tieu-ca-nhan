import { Goal } from '../../interfaces/Goal';
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
  name?: string;
  deadline?: string;
  target_date?: string;
  progress_percentage?: number | string;
  note?: string | null;
  tasks_count?: number;
  milestones_count?: number;
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
  tasks_count: goal.tasks_count,
  milestones_count: goal.milestones_count,
  created_at: goal.created_at ?? '',
  updated_at: goal.updated_at ?? '',
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
