import "server-only";

import { getPrismaClient } from "@/lib/db/prisma";
import { parseDateInput } from "@/lib/dates";
import { projectStatusToPrisma } from "@/features/projects/project-helpers";
import type { ProjectFormInput } from "@/features/projects/schemas/project-schemas";
import { syncProjectProgress } from "@/server/modules/projects/progress";

async function resolveProjectGoalId(userId: bigint, goalId: string | undefined) {
  if (!goalId) {
    return null;
  }

  const prisma = getPrismaClient();
  const goal = await prisma.goal.findFirst({
    where: {
      id: BigInt(goalId),
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  return goal?.id ?? null;
}

function slugifyColor(value: string) {
  return value.trim() || null;
}

export async function createProjectForUser(userId: bigint, input: ProjectFormInput) {
  const prisma = getPrismaClient();
  const goalId = await resolveProjectGoalId(userId, input.goalId);

  if (input.goalId && goalId === null) {
    return null;
  }

  const project = await prisma.project.create({
    data: {
      userId,
      goalId,
      name: input.name,
      description: input.description || null,
      status: projectStatusToPrisma[input.status],
      color: slugifyColor(input.color),
      startDate: input.startDate ? parseDateInput(input.startDate) : null,
      endDate: input.endDate ? parseDateInput(input.endDate) : null
    },
    select: {
      id: true
    }
  });

  await syncProjectProgress(prisma, project.id);

  return project.id.toString();
}

export async function updateProjectForUser(
  userId: bigint,
  projectId: bigint,
  input: ProjectFormInput
) {
  const prisma = getPrismaClient();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!project) {
    return null;
  }

  const goalId = await resolveProjectGoalId(userId, input.goalId);

  if (input.goalId && goalId === null) {
    return null;
  }

  await prisma.project.update({
    where: {
      id: project.id
    },
    data: {
      goalId,
      name: input.name,
      description: input.description || null,
      status: projectStatusToPrisma[input.status],
      color: slugifyColor(input.color),
      startDate: input.startDate ? parseDateInput(input.startDate) : null,
      endDate: input.endDate ? parseDateInput(input.endDate) : null
    }
  });

  await syncProjectProgress(prisma, project.id);

  return project.id.toString();
}

export async function softDeleteProjectForUser(userId: bigint, projectId: bigint) {
  const prisma = getPrismaClient();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null
    },
    select: {
      id: true
    }
  });

  if (!project) {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.updateMany({
      where: {
        projectId: project.id
      },
      data: {
        projectId: null
      }
    });

    await tx.project.update({
      where: {
        id: project.id
      },
      data: {
        deletedAt: new Date()
      }
    });
  });

  return true;
}
