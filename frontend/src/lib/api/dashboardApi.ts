import { DashboardSummaryResponse } from '../../features/dashboard/types';
import api from './authApi';
import { normalizeGoal } from './goalsApi';

const API_V1_PREFIX = '/v1';

export const dashboardApi = {
  summary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get(`${API_V1_PREFIX}/dashboard/summary`);
    const payload = response.data?.data ?? response.data;

    return {
      summary: payload.summary ?? {
        active_goals: 0,
        completed_goals: 0,
        tasks_today: 0,
        overdue_tasks: 0,
      },
      upcoming_tasks: payload.upcoming_tasks ?? [],
      active_goals: Array.isArray(payload.active_goals)
        ? payload.active_goals.map(normalizeGoal)
        : [],
    };
  },
};
