import api from './authApi';
import { Goal } from '../interfaces/Goal';

export interface CreateGoalPayload {
  title: string;
  description: string;
  due_date: string;
  priority: Goal['priority'];
}

type GoalApiResponse = Partial<Goal> & {
  id: number;
  name?: string;
  deadline?: string;
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
  due_date: goal.due_date ?? goal.deadline ?? new Date().toISOString().split('T')[0],
  status: normalizeStatus(goal.status),
  priority: goal.priority ?? 'medium',
  progress: Number(goal.progress ?? 0),
  created_at: goal.created_at ?? '',
  updated_at: goal.updated_at ?? '',
});

export const goalsApi = {
  list: async (): Promise<Goal[]> => {
    const response = await api.get('/goals');
    const payload = Array.isArray(response.data) ? response.data : response.data?.data ?? [];

    return payload.map(normalizeGoal);
  },

  create: async (data: CreateGoalPayload): Promise<Goal> => {
    const response = await api.post('/goals', {
      title: data.title,
      name: data.title,
      description: data.description,
      due_date: data.due_date,
      deadline: data.due_date,
      priority: data.priority,
      status: 'active',
      progress: 0,
    });

    return normalizeGoal(response.data?.data ?? response.data);
  },
};
