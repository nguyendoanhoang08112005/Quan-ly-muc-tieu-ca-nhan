import { GoalMilestone } from '../../features/goals/types';
import api from './authApi';
import { normalizeMilestone } from './goalsApi';

const API_V1_PREFIX = '/v1';

export interface CreateMilestonePayload {
  title: string;
  description: string;
  status: GoalMilestone['status'];
  start_date: string;
  target_date: string;
  note: string;
  sequence_no?: number;
}

export interface UpdateMilestonePayload extends Partial<CreateMilestonePayload> {}

export const milestonesApi = {
  listByGoal: async (goalId: number): Promise<GoalMilestone[]> => {
    const response = await api.get(`${API_V1_PREFIX}/goals/${goalId}/milestones`);
    const payload = Array.isArray(response.data) ? response.data : response.data?.data ?? [];

    return payload.map(normalizeMilestone);
  },

  create: async (goalId: number, data: CreateMilestonePayload): Promise<GoalMilestone> => {
    const response = await api.post(`${API_V1_PREFIX}/goals/${goalId}/milestones`, data);

    return normalizeMilestone(response.data?.data ?? response.data);
  },

  get: async (milestoneId: number): Promise<GoalMilestone> => {
    const response = await api.get(`${API_V1_PREFIX}/milestones/${milestoneId}`);

    return normalizeMilestone(response.data?.data ?? response.data);
  },

  update: async (
    milestoneId: number,
    data: UpdateMilestonePayload
  ): Promise<GoalMilestone> => {
    const response = await api.patch(`${API_V1_PREFIX}/milestones/${milestoneId}`, data);

    return normalizeMilestone(response.data?.data ?? response.data);
  },

  remove: async (milestoneId: number): Promise<void> => {
    await api.delete(`${API_V1_PREFIX}/milestones/${milestoneId}`);
  },
};
