import "server-only";

import {
  clampProgress,
  goalPriorityFromPrisma,
  workStatusFromPrisma
} from "@/features/goals/goal-helpers";
import {
  projectStatusFromPrisma
} from "@/features/projects/project-helpers";
import type {
  ProjectDetail,
  ProjectFormValues,
  ProjectGoalOption,
  ProjectListItem,
  ProjectOption
} from "@/features/projects/types";
import type { TaskListItem, SubtaskSummary } from "@/features/tasks/types";
import { formatDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

function toNumber(value: number | { toNumber(): number } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function mapSubtask(subtask: {
  id: bigint;
  name: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  completedAt: Date | null;
  sortOrder: number;
}): SubtaskSummary {
  return {
    id: subtask.id.toString(),
    name: subtask.name,
    status: subtask.status.toLowerCase() as SubtaskSummary["status"],
    completedAt: subtask.completedAt?.toISOString() ?? null,
    sortOrder: subtask.sortOrder
  };
}

function mapProjectTask(task: {
  id: bigint;
  title: string;
  description: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progressPercentage: number | { toNumber(): number } | null;
  dueAt: Date | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  isFocus: boolean;
  goal: {
    id: bigint;
    title: string;
  };
  milestone: {
    id: bigint;
    title: string;
    sequenceNo: number;
  } | null;
  subtasks: Array<{
    id: bigint;
    name: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    completedAt: Date | null;
    sortOrder: number;
  }>;
}): TaskListItem {
  const subtasks = task.subtasks.map(mapSubtask);
  const completedSubtasksCount = subtasks.filter((subtask) => {
    return subtask.status === "completed";
  }).length;

  return {
    id: task.id.toString(),
    title: task.title,
    description: task.description ?? "",
    status: workStatusFromPrisma[task.status],
    priority: goalPriorityFromPrisma[task.priority],
    progress: clampProgress(toNumber(task.progressPercentage)),
    dueAt: task.dueAt?.toISOString() ?? null,
    estimatedMinutes: task.estimatedMinutes ?? null,
    actualMinutes: task.actualMinutes ?? null,
    isFocus: task.isFocus,
    goalId: task.goal.id.toString(),
    goalTitle: task.goal.title,
    milestoneId: task.milestone?.id.toString() ?? null,
    milestoneTitle: task.milestone?.title ?? null,
    milestoneSequenceNo: task.milestone?.sequenceNo ?? null,
    project: null,
    subtasks,
    subtasksCount: subtasks.length,
    completedSubtasksCount
  };
}

function mapProject(project: {
  id: bigint;
  name: string;
  description: string | null;
  status: keyof typeof projectStatusFromPrisma;
  color: string | null;
  startDate: Date | null;
  endDate: Date | null;
  progressPercentage: number | { toNumber(): number } | null;
  createdAt: Date;
  updatedAt: Date;
  goal: {
    id: bigint;
    title: string;
  } | null;
  tasks: Array<{
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  }>;
}): ProjectListItem {
  const completedTasksCount = project.tasks.filter((task) => {
    return task.status === "COMPLETED";
  }).length;

  return {
    id: project.id.toString(),
    name: project.name,
    description: project.description ?? "",
    status: projectStatusFromPrisma[project.status],
    color: project.color ?? null,
    startDate: formatDateInput(project.startDate),
    endDate: formatDateInput(project.endDate),
    progress: clampProgress(toNumber(project.progressPercentage)),
    goal: project.goal
      ? {
          id: project.goal.id.toString(),
          title: project.goal.title
        }
      : null,
    tasksCount: project.tasks.length,
    completedTasksCount,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };
}

export async function listProjectGoalOptionsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ targetDate: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true
    }
  });

  return goals.map<ProjectGoalOption>((goal) => ({
    id: goal.id.toString(),
    title: goal.title
  }));
}

export async function listProjectOptionsForGoal(
  userId: bigint,
  goalId: bigint
) {
  const prisma = getPrismaClient();
  const projects = await prisma.project.findMany({
    where: {
      userId,
      deletedAt: null,
      OR: [{ goalId: null }, { goalId }]
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      color: true,
      goal: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  return projects.map<ProjectOption>((project) => ({
    id: project.id.toString(),
    name: project.name,
    color: project.color ?? null,
    goalId: project.goal?.id.toString() ?? null,
    goalTitle: project.goal?.title ?? null
  }));
}

export async function listProjectsForUser(userId: bigint) {
  const prisma = getPrismaClient();
  const projects = await prisma.project.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: [{ endDate: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      color: true,
      startDate: true,
      endDate: true,
      progressPercentage: true,
      createdAt: true,
      updatedAt: true,
      goal: {
        select: {
          id: true,
          title: true
        }
      },
      tasks: {
        where: {
          deletedAt: null
        },
        select: {
          status: true
        }
      }
    }
  });

  return projects.map(mapProject);
}

export async function getProjectDetailForUser(userId: bigint, projectId: bigint) {
  const prisma = getPrismaClient();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      color: true,
      startDate: true,
      endDate: true,
      progressPercentage: true,
      createdAt: true,
      updatedAt: true,
      goal: {
        select: {
          id: true,
          title: true
        }
      },
      tasks: {
        where: {
          deletedAt: null
        },
        orderBy: [{ isFocus: "desc" }, { dueAt: "asc" }, { sortOrder: "asc" }],
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          progressPercentage: true,
          dueAt: true,
          estimatedMinutes: true,
          actualMinutes: true,
          isFocus: true,
          goal: {
            select: {
              id: true,
              title: true
            }
          },
          milestone: {
            select: {
              id: true,
              title: true,
              sequenceNo: true
            }
          },
          subtasks: {
            where: {
              deletedAt: null
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              name: true,
              status: true,
              completedAt: true,
              sortOrder: true
            }
          }
        }
      }
    }
  });

  if (!project) {
    return null;
  }

  const detail: ProjectDetail = {
    ...mapProject(project),
    tasks: project.tasks.map((task) => {
      const mappedTask = mapProjectTask(task);

      return {
        ...mappedTask,
        project: {
          id: project.id.toString(),
          name: project.name,
          color: project.color ?? null
        }
      };
    })
  };

  return detail;
}

export async function getProjectFormValuesForUser(
  userId: bigint,
  projectId: bigint
) {
  const prisma = getPrismaClient();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null
    },
    select: {
      goalId: true,
      name: true,
      description: true,
      status: true,
      color: true,
      startDate: true,
      endDate: true
    }
  });

  if (!project) {
    return null;
  }

  const values: ProjectFormValues = {
    goalId: project.goalId?.toString() ?? "",
    name: project.name,
    description: project.description ?? "",
    status: projectStatusFromPrisma[project.status],
    color: project.color ?? "",
    startDate: formatDateInput(project.startDate),
    endDate: formatDateInput(project.endDate)
  };

  return values;
}
