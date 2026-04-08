import type { DashboardOverview } from "@/features/dashboard/types";
import type {
  GoalDetail,
  GoalListItem,
  GoalMilestoneSummary,
  GoalTaskSummary
} from "@/features/goals/types";
import type { HabitDetail, HabitListItem } from "@/features/habits/types";
import type { NoteListItem } from "@/features/notes/types";
import type {
  NotificationListItem,
  NotificationSummary
} from "@/features/notifications/types";
import type { ProfileSummary } from "@/features/profile/types";
import type { TaskListItem } from "@/features/tasks/types";

function toApiId(value: bigint | number | string | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = Number(value);

  return Number.isSafeInteger(numeric) ? numeric : `${value}`;
}

function serializeTaskResource(
  task: GoalTaskSummary | TaskListItem,
  context?: {
    goalId?: bigint | number | string | null;
    milestoneId?: bigint | number | string | null;
  }
) {
  return {
    id: toApiId(task.id),
    goal_id: toApiId(
      context?.goalId ?? ("goalId" in task ? task.goalId : null)
    ),
    milestone_id: toApiId(
      context?.milestoneId ??
        ("milestoneId" in task ? task.milestoneId : null)
    ),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    progress_percentage: task.progress,
    progress: task.progress,
    due_at: task.dueAt,
    estimated_minutes: task.estimatedMinutes,
    actual_minutes: task.actualMinutes,
    is_focus: task.isFocus,
    started_at: "startedAt" in task ? task.startedAt : null,
    completed_at: "completedAt" in task ? task.completedAt : null,
    sort_order: "sortOrder" in task ? task.sortOrder : 0,
    project: task.project
      ? {
          id: toApiId(task.project.id),
          name: task.project.name,
          color: task.project.color
        }
      : null,
    subtasks: task.subtasks.map((subtask) => ({
      id: toApiId(subtask.id),
      name: subtask.name,
      status: subtask.status,
      completed_at: subtask.completedAt,
      sort_order: subtask.sortOrder
    })),
    created_at: null,
    updated_at: null
  };
}

function serializeMilestoneResource(
  milestone: GoalMilestoneSummary,
  userId: bigint | number | string | null | undefined,
  goalId: bigint | number | string
) {
  return {
    id: toApiId(milestone.id),
    user_id: toApiId(userId),
    goal_id: toApiId(goalId),
    title: milestone.title,
    description: milestone.description,
    status: milestone.status,
    progress_percentage: milestone.progress,
    progress: milestone.progress,
    start_date: milestone.startDate,
    target_date: milestone.targetDate,
    completed_at: milestone.completedAt,
    sequence_no: milestone.sequenceNo,
    note: milestone.note,
    tasks_count: milestone.tasksCount,
    tasks: milestone.tasks.map((task) => {
      return serializeTaskResource(task, {
        goalId,
        milestoneId: milestone.id
      });
    }),
    created_at: null,
    updated_at: null
  };
}

export function serializeGoalResource(
  goal: GoalListItem | GoalDetail,
  userId?: bigint | number | string
) {
  return {
    id: toApiId(goal.id),
    user_id: toApiId(userId),
    title: goal.title,
    slug: goal.slug,
    description: goal.description,
    goal_type: goal.goalType,
    priority: goal.priority,
    status: goal.status,
    start_date: goal.startDate,
    target_date: goal.targetDate,
    due_date: goal.targetDate,
    note: goal.note,
    progress_percentage: goal.progress,
    progress: goal.progress,
    tasks_count: goal.tasksCount,
    milestones_count: goal.milestonesCount,
    is_public: goal.isPublic,
    category: goal.category
      ? {
          id: toApiId(goal.category.id),
          name: goal.category.name,
          color: goal.category.color,
          icon: goal.category.icon
        }
      : null,
    tags: goal.tags.map((tag) => ({
      id: toApiId(tag.id),
      name: tag.name,
      color: tag.color
    })),
    completed_at: "completedAt" in goal ? goal.completedAt : null,
    milestones:
      "milestones" in goal
        ? goal.milestones.map((milestone) => {
            return serializeMilestoneResource(milestone, userId, goal.id);
          })
        : undefined,
    logs:
      "logs" in goal
        ? goal.logs.map((log) => ({
            id: toApiId(log.id),
            log_type: log.logType,
            title: log.title,
            content: log.content,
            progress_snapshot: log.progressSnapshot,
            logged_at: log.loggedAt,
            milestone_title: log.milestoneTitle,
            task_title: log.taskTitle
          }))
        : undefined,
    created_at: goal.createdAt,
    updated_at: goal.updatedAt
  };
}

export function serializeUserResource(profile: ProfileSummary) {
  return {
    id: toApiId(profile.id),
    name: profile.name,
    email: profile.email,
    avatar_path: profile.avatarPath,
    timezone: profile.timezone,
    locale: profile.locale,
    email_verified_at: profile.emailVerifiedAt,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt
  };
}

export function serializeTaskApiResource(task: TaskListItem) {
  return serializeTaskResource(task);
}

export function serializeMilestoneApiResource(
  milestone: GoalMilestoneSummary,
  userId: bigint | number | string | null | undefined,
  goalId: bigint | number | string
) {
  return serializeMilestoneResource(milestone, userId, goalId);
}

export function serializeDashboardSummaryResource(
  dashboard: DashboardOverview,
  userId: bigint | number | string
) {
  return {
    summary: {
      active_goals: dashboard.summary.activeGoals,
      completed_goals: dashboard.summary.completedGoals,
      tasks_today: dashboard.summary.tasksToday,
      overdue_tasks: dashboard.summary.overdueTasks
    },
    upcoming_tasks: dashboard.upcomingTasks.map((task) => ({
      id: toApiId(task.id),
      title: task.title,
      description: null,
      status: task.status,
      priority: task.priority,
      due_at: task.dueAt,
      estimated_minutes: null,
      is_focus: task.isFocus,
      goal: {
        id: toApiId(task.goal.id),
        title: task.goal.title
      },
      milestone: task.milestone
        ? {
            id: toApiId(task.milestone.id),
            title: task.milestone.title
          }
        : null
    })),
    active_goals: dashboard.activeGoals.map((goal) => {
      return serializeGoalResource(goal, userId);
    })
  };
}

export function serializeHabitResource(habit: HabitListItem | HabitDetail) {
  return {
    id: toApiId(habit.id),
    title: habit.title,
    description: habit.description,
    frequency: habit.frequency,
    target_count: habit.targetCount,
    unit: habit.unit,
    reminder_time: habit.reminderTime,
    status: habit.status,
    start_date: habit.startDate,
    end_date: habit.endDate,
    current_streak: habit.currentStreak,
    best_streak: habit.bestStreak,
    last_logged_at: habit.lastLoggedAt,
    goal: habit.goal
      ? {
          id: toApiId(habit.goal.id),
          title: habit.goal.title
        }
      : null,
    today_log: habit.todayLog
      ? {
          id: toApiId(habit.todayLog.id),
          log_date: habit.todayLog.logDate,
          completed_count: habit.todayLog.completedCount,
          target_count_snapshot: habit.todayLog.targetCountSnapshot,
          is_completed: habit.todayLog.isCompleted,
          note: habit.todayLog.note
        }
      : null,
    recent_logs:
      "recentLogs" in habit
        ? habit.recentLogs.map((log) => ({
            id: toApiId(log.id),
            log_date: log.logDate,
            completed_count: log.completedCount,
            target_count_snapshot: log.targetCountSnapshot,
            is_completed: log.isCompleted,
            note: log.note
          }))
        : undefined
  };
}

export function serializeNoteResource(note: NoteListItem) {
  return {
    id: toApiId(note.id),
    noteable_type: note.noteableType,
    noteable_id: toApiId(note.noteableId),
    target_label: note.targetLabel,
    target_description: note.targetDescription,
    content: note.content,
    created_at: note.createdAt,
    updated_at: note.updatedAt
  };
}

export function serializeNotificationResource(notification: NotificationListItem) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    related_type: notification.relatedType,
    related_id: toApiId(notification.relatedId),
    href: notification.href,
    is_read: notification.isRead,
    read_at: notification.readAt,
    created_at: notification.createdAt
  };
}

export function serializeNotificationSummaryResource(
  summary: NotificationSummary
) {
  return {
    total: summary.total,
    unread: summary.unread,
    read: summary.read
  };
}
