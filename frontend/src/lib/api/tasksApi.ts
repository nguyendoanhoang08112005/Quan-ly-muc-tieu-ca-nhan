import { GoalTask } from '../../features/goals/types';
import api from './authApi';
import { normalizeTask } from './goalsApi';

const API_V1_PREFIX = '/v1';

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: GoalTask['status'];
  priority: GoalTask['priority'];
  due_at: string | null;
  estimated_minutes: number | null;
  is_focus: boolean;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export const tasksApi = {
  create: async (milestoneId: number, data: CreateTaskPayload): Promise<GoalTask> => {
    const response = await api.post(`${API_V1_PREFIX}/milestones/${milestoneId}/tasks`, data);

    return normalizeTask(response.data?.data ?? response.data);
  },

  get: async (taskId: number): Promise<GoalTask> => {
    const response = await api.get(`${API_V1_PREFIX}/tasks/${taskId}`);

    return normalizeTask(response.data?.data ?? response.data);
  },

  update: async (taskId: number, data: UpdateTaskPayload): Promise<GoalTask> => {
    const response = await api.patch(`${API_V1_PREFIX}/tasks/${taskId}`, data);

    return normalizeTask(response.data?.data ?? response.data);
  },

  complete: async (taskId: number): Promise<GoalTask> => {
    const response = await api.patch(`${API_V1_PREFIX}/tasks/${taskId}/complete`);

    return normalizeTask(response.data?.data ?? response.data);
  },

  remove: async (taskId: number): Promise<void> => {
    await api.delete(`${API_V1_PREFIX}/tasks/${taskId}`);
  },
};
