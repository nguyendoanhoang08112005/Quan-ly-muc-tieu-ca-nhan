import "server-only";

import { workStatusFromPrisma } from "@/features/goals/goal-helpers";
import type { MilestoneFormValues } from "@/features/milestones/types";
import { formatDateInput } from "@/lib/dates";
import { getPrismaClient } from "@/lib/db/prisma";

export async function getMilestoneFormValuesForUser(
  userId: bigint,
  goalId: bigint,
  milestoneId: bigint
) {
  const prisma = getPrismaClient();
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: milestoneId,
      goalId,
      userId,
      deletedAt: null
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      startDate: true,
      targetDate: true,
      note: true,
      sequenceNo: true
    }
  });

  if (!milestone) {
    return null;
  }

  const values: MilestoneFormValues = {
    title: milestone.title,
    description: milestone.description ?? "",
    status: workStatusFromPrisma[milestone.status],
    startDate: formatDateInput(milestone.startDate),
    targetDate: formatDateInput(milestone.targetDate),
    note: milestone.note ?? "",
    sequenceNo: milestone.sequenceNo ? String(milestone.sequenceNo) : ""
  };

  return values;
}
