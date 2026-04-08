export type PomodoroStartFormValues = {
  taskId: string;
  durationMinutes: string;
};

export type PomodoroTaskOption = {
  id: string;
  title: string;
  goalId: string;
  goalTitle: string;
};

export type PomodoroSessionItem = {
  id: string;
  taskId: string;
  taskTitle: string;
  goalId: string;
  goalTitle: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  actualDurationMinutes: number;
  completed: boolean;
  notes: string | null;
  isActive: boolean;
};

export type PomodoroOverview = {
  summary: {
    totalSessions: number;
    completedSessions: number;
    activeSessions: number;
    todaySessions: number;
  };
  activeSession: PomodoroSessionItem | null;
  recentSessions: PomodoroSessionItem[];
  taskOptions: PomodoroTaskOption[];
};
