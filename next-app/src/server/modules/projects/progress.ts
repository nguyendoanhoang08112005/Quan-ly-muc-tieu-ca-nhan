import "server-only";

import type { Prisma, PrismaClient } from "@prisma/client";

function roundProgress(value: number) {
  return Math.round(value * 100) / 100;
}

export async function syncProjectProgress(
  prisma: PrismaClient | Prisma.TransactionClient,
  projectId: bigint
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      deletedAt: null
    },
    select: {
      id: true,
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

  if (!project) {
    return 0;
  }

  const completedTasks = project.tasks.filter((task) => {
    return task.status === "COMPLETED";
  }).length;
  const progress = roundProgress(
    project.tasks.length > 0 ? (completedTasks / project.tasks.length) * 100 : 0
  );

  await prisma.project.update({
    where: {
      id: project.id
    },
    data: {
      progressPercentage: progress
    }
  });

  return progress;
}
